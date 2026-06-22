import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppSettings, ClinicalCase, KbChapter } from './lib/types'
import { DEFAULT_MODEL, browserChat, AnthropicError } from './lib/anthropicClient'
import { DEFAULT_LOCAL_MODEL } from './lib/engines/webllmEngine'
import { loadCases, loadKbIndex, loadChunk } from './data/loadContent'
import { PROXY_MODE } from './lib/config'
import { proxyChat } from './lib/proxyClient'
import { useChat } from './hooks/useChat'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { useWebLLM } from './hooks/useWebLLM'
import { Chat } from './components/Chat'
import { CaseCard } from './components/CaseCard'
import { Settings } from './components/Settings'
import { PasswordGate } from './components/PasswordGate'

const SETTINGS_KEY = 'oral-exam-settings-v2'

const DEFAULT_SETTINGS: AppSettings = {
  engine: 'auto',
  localModel: DEFAULT_LOCAL_MODEL,
  apiKey: '',
  model: DEFAULT_MODEL,
  ttsEnabled: false,
  voiceURI: '',
  rate: 1,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [showSettings, setShowSettings] = useState(false)
  // In proxy mode the whole app is gated behind the server-validated password.
  const [unlocked, setUnlocked] = useState<boolean>(
    !PROXY_MODE || sessionStorage.getItem('oral-exam-unlocked') === '1',
  )

  const [cases, setCases] = useState<ClinicalCase[]>([])
  const [kbChapters, setKbChapters] = useState<KbChapter[]>([])
  const [caseIdx, setCaseIdx] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const tts = useSpeechSynthesis()
  const webllm = useWebLLM()

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    Promise.all([loadCases(), loadKbIndex()])
      .then(([c, kb]) => {
        setCases(c.casos)
        setKbChapters(kb.chapters)
        if (c.casos.length) setCaseIdx(Math.floor(Math.random() * c.casos.length))
      })
      .catch((e) => setLoadError(e?.message || 'Could not load content.'))
  }, [])

  const activeCase = cases[caseIdx] ?? null

  const chat = useChat({
    settings,
    activeCase,
    kbChapters,
    localGenerate: webllm.generate,
    localReady: webllm.status === 'ready',
  })

  const speak = useCallback(
    (text: string) => tts.speak(text, settings.voiceURI || undefined, settings.rate),
    [tts, settings.voiceURI, settings.rate],
  )

  const handleAsk = useCallback(
    async (question: string) => {
      const answer = await chat.ask(question)
      if (answer && settings.ttsEnabled) speak(answer)
    },
    [chat, settings.ttsEnabled, speak],
  )

  const stt = useSpeechRecognition(handleAsk)

  const changeCase = useCallback(() => {
    tts.cancel()
    chat.reset()
    setCaseIdx((i) => (cases.length ? (i + 1) % cases.length : 0))
  }, [cases.length, chat, tts])

  // Generate a brand-new case from the knowledge base using a generative engine
  // (local LLM if loaded, otherwise the API if a key is set).
  const generateCase = useCallback(async () => {
    if (!kbChapters.length) return
    const canLocal = webllm.status === 'ready' && webllm.generate
    const canApi = PROXY_MODE || !!settings.apiKey.trim()
    if (!canLocal && !canApi) {
      setLoadError('To generate a new case, load the local LLM or add an API key in Settings.')
      setShowSettings(true)
      return
    }
    setGenerating(true)
    setLoadError(null)
    try {
      const chapter = kbChapters[Math.floor(Math.random() * kbChapters.length)]
      const material = (await loadChunk(chapter.file)).slice(0, 8000)
      const sys =
        'You generate realistic General Surgery oral-board clinical cases in English, based ONLY on the given material. '
        + 'Return ONLY a valid JSON object, no extra text or markdown.'
      const userPrompt =
        `Material (topic "${chapter.title}"):\n${material}\n\n`
        + 'Create a novel, realistic oral-exam clinical case based on this material. '
        + 'Exact JSON format: {"title": string, "topic": string, "presentation": string (chief complaint, history, exam, vitals and initial tests, viva style), "keyPoints": string[] (4 items)}'

      let raw: string
      if (canLocal) {
        raw = await webllm.generate!(sys, [{ role: 'user', content: userPrompt }])
      } else if (PROXY_MODE) {
        raw = await proxyChat({
          model: settings.model,
          system: sys,
          messages: [{ id: 'gen', role: 'user', content: userPrompt }],
          maxTokens: 900,
        })
      } else {
        raw = await browserChat({
          apiKey: settings.apiKey,
          model: settings.model,
          system: sys,
          messages: [{ id: 'gen', role: 'user', content: userPrompt }],
          maxTokens: 900,
        })
      }
      const jsonText = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonText)
      const newCase: ClinicalCase = {
        id: `gen-${Date.now()}`,
        titulo: parsed.title || chapter.title,
        tema: parsed.topic || chapter.block_name,
        presentacion: parsed.presentation || '',
        puntosClave: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        fuente: chapter.id,
      }
      tts.cancel()
      chat.reset()
      setCases((prev) => {
        const next = [...prev, newCase]
        setCaseIdx(next.length - 1)
        return next
      })
    } catch (e) {
      const msg = e instanceof AnthropicError ? e.message : 'Could not generate the case (invalid response).'
      setLoadError(msg)
    } finally {
      setGenerating(false)
    }
  }, [settings, kbChapters, chat, tts, webllm])

  const hasContent = cases.length > 0 && kbChapters.length > 0

  const headerSubtitle = useMemo(() => {
    if (!stt.supported) return 'Voice not supported here · use text mode (Chrome recommended)'
    return 'Oral-exam training · tap the mic and ask'
  }, [stt.supported])

  const engineBadge = useMemo(() => {
    const apiOn = PROXY_MODE || !!settings.apiKey
    const map: Record<AppSettings['engine'], string> = {
      auto: webllm.status === 'ready' ? 'Auto · Local LLM' : apiOn ? 'Auto · Claude' : 'Auto · Wiki',
      wiki: 'Wiki (offline)',
      local: webllm.status === 'ready' ? 'Local LLM' : 'Local (not loaded)',
      api: apiOn ? 'Claude' : 'API (no key)',
    }
    return map[settings.engine]
  }, [settings.engine, settings.apiKey, webllm.status])

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-3 pb-3 pt-[env(safe-area-inset-top)]">
      <header className="flex items-center justify-between py-3">
        <div>
          <h1 className="text-base font-bold leading-tight sm:text-lg">Oral Exam · General Surgery</h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">{headerSubtitle}</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 rounded-lg border border-exam-border bg-exam-panel px-3 py-2 text-sm hover:bg-exam-panel2"
          aria-label="Settings"
        >
          <span className="hidden text-[11px] text-slate-400 sm:inline">{engineBadge}</span>
          <span>⚙︎</span>
        </button>
      </header>

      {loadError && (
        <div className="mb-2 rounded-lg border border-exam-danger/40 bg-exam-danger/10 px-3 py-2 text-xs text-red-300">
          {loadError}
        </div>
      )}

      <div className="mb-3">
        <CaseCard
          activeCase={activeCase}
          index={caseIdx}
          total={cases.length}
          onChange={changeCase}
          onGenerate={generateCase}
          generating={generating}
        />
      </div>

      <div className="min-h-0 flex-1">
        {hasContent ? (
          <Chat
            messages={chat.messages}
            loading={chat.loading}
            micSupported={stt.supported}
            listening={stt.listening}
            interimText={stt.interimText}
            micError={stt.error}
            apiError={chat.error}
            onMicStart={stt.start}
            onMicStop={stt.stop}
            onSubmitText={handleAsk}
            onSpeak={tts.supported ? speak : undefined}
          />
        ) : (
          !loadError && <div className="py-10 text-center text-sm text-slate-500">Loading content…</div>
        )}
      </div>

      {showSettings && (
        <Settings
          settings={settings}
          voices={tts.voices}
          webllm={webllm}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
