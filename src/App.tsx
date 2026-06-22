import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppSettings, ClinicalCase, KbChapter } from './lib/types'
import { DEFAULT_MODEL } from './lib/anthropicClient'
import { DEFAULT_LOCAL_MODEL } from './lib/engines/webllmEngine'
import { PROXY_MODE } from './lib/config'
import { generativeAvailable, generativeChat } from './lib/generate'
import { AnthropicError } from './lib/anthropicClient'
import { loadKbIndex, loadCases, loadChunk } from './data/loadContent'
import { useChat } from './hooks/useChat'
import { useExam } from './hooks/useExam'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { useWebLLM } from './hooks/useWebLLM'
import { Chat } from './components/Chat'
import { CaseBar } from './components/CaseBar'
import { ExamView } from './components/ExamView'
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

// Fallback while the case bank loads.
const PLACEHOLDER_CASE: ClinicalCase = {
  id: 'loading',
  titulo: '',
  tema: 'General Surgery',
  presentacion: '',
  puntosClave: [],
  fuente: '',
}

type Tab = 'exam' | 'qa'

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
  const [unlocked, setUnlocked] = useState<boolean>(
    !PROXY_MODE || sessionStorage.getItem('oral-exam-unlocked') === '1',
  )
  const [tab, setTab] = useState<Tab>('exam')

  const [kbChapters, setKbChapters] = useState<KbChapter[]>([])
  const [cases, setCases] = useState<ClinicalCase[]>([])
  const [caseIdx, setCaseIdx] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [examMuted, setExamMuted] = useState(false)

  const tts = useSpeechSynthesis()
  const webllm = useWebLLM()

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    Promise.all([loadKbIndex(), loadCases()])
      .then(([kb, c]) => {
        setKbChapters(kb.chapters)
        setCases(c.casos)
        if (c.casos.length) setCaseIdx(Math.floor(Math.random() * c.casos.length))
      })
      .catch((e) => setLoadError(e?.message || 'Could not load content.'))
  }, [])

  const activeCase = cases[caseIdx] ?? PLACEHOLDER_CASE

  const speak = useCallback(
    (text: string) => tts.speak(text, settings.voiceURI || undefined, settings.rate),
    [tts, settings.voiceURI, settings.rate],
  )

  // Examiner messages are read aloud unless muted.
  const speakExaminer = useCallback(
    (text: string) => {
      if (!examMuted && tts.supported) speak(text)
    },
    [examMuted, tts, speak],
  )

  const exam = useExam({
    settings,
    kbChapters,
    localGenerate: webllm.generate,
    onExaminer: speakExaminer,
  })

  const qa = useChat({
    settings,
    activeCase,
    kbChapters,
    localGenerate: webllm.generate,
    localReady: webllm.status === 'ready',
  })

  const handleQaAsk = useCallback(
    async (question: string) => {
      const answer = await qa.ask(question)
      if (answer && settings.ttsEnabled) speak(answer)
    },
    [qa, settings.ttsEnabled, speak],
  )

  // Free Q&A: refresh/change the active clinical case (random) and reset the chat.
  const changeCase = useCallback(() => {
    tts.cancel()
    qa.reset()
    setCaseIdx((i) => {
      if (cases.length <= 1) return i
      let next = i
      while (next === i) next = Math.floor(Math.random() * cases.length)
      return next
    })
  }, [cases.length, qa, tts])

  // Free Q&A: generate a brand-new case from the material via a generative engine.
  const generateCase = useCallback(async () => {
    if (!kbChapters.length) return
    if (!generativeAvailable(settings, webllm.status === 'ready')) {
      setLoadError('To generate a new case, enable Claude (server/API) or load the local LLM in Settings.')
      setShowSettings(true)
      return
    }
    setGenerating(true)
    setLoadError(null)
    try {
      const chapter = kbChapters[Math.floor(Math.random() * kbChapters.length)]
      const material = (await loadChunk(chapter.file)).slice(0, 8000)
      const raw = await generativeChat({
        system:
          'You generate realistic General Surgery oral-exam clinical cases in English, based ONLY on the given material. '
          + 'Return ONLY a valid JSON object, no extra text or markdown.',
        messages: [
          {
            id: 'gen',
            role: 'user',
            content:
              `Material (topic "${chapter.title}"):\n${material}\n\n`
              + 'Create a novel, realistic oral-exam clinical case based on this material. '
              + 'Exact JSON: {"title": string, "topic": string, "presentation": string (chief complaint, history, exam, vitals, initial tests; viva style), "keyPoints": string[] (4 items)}',
          },
        ],
        settings,
        localGenerate: webllm.generate,
        maxTokens: 900,
      })
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      const newCase: ClinicalCase = {
        id: `gen-${Date.now()}`,
        titulo: parsed.title || chapter.title,
        tema: parsed.topic || chapter.block_name,
        presentacion: parsed.presentation || '',
        puntosClave: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        fuente: chapter.id,
      }
      tts.cancel()
      qa.reset()
      setCases((prev) => {
        const next = [...prev, newCase]
        setCaseIdx(next.length - 1)
        return next
      })
    } catch (e) {
      setLoadError(e instanceof AnthropicError ? e.message : 'Could not generate the case (invalid response).')
    } finally {
      setGenerating(false)
    }
  }, [settings, kbChapters, qa, tts, webllm])

  const handleExamAnswer = useCallback((text: string) => exam.answer(text), [exam])

  // One shared speech recogniser; route the transcript to the active tab.
  const tabRef = useRef<Tab>(tab)
  tabRef.current = tab
  const voiceRouter = useCallback(
    (text: string) => {
      if (tabRef.current === 'exam') exam.answer(text)
      else handleQaAsk(text)
    },
    [exam, handleQaAsk],
  )
  const stt = useSpeechRecognition(voiceRouter)

  const generativeOk = generativeAvailable(settings, webllm.status === 'ready')

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

  const stopVoice = useCallback(() => {
    tts.cancel()
    stt.stop()
  }, [tts, stt])

  const switchTab = useCallback(
    (next: Tab) => {
      stopVoice()
      setTab(next)
    },
    [stopVoice],
  )

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-3 pb-3 pt-[env(safe-area-inset-top)]">
      <header className="flex items-center justify-between py-3">
        <div>
          <h1 className="text-base font-bold leading-tight sm:text-lg">Oral Exam · General Surgery</h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">
            {stt.supported ? 'Voice viva · grounded in the course material' : 'Voice not supported · text mode (Chrome recommended)'}
          </p>
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

      {/* Tabs */}
      <div className="mb-3 flex gap-1 rounded-xl border border-exam-border bg-exam-panel p-1">
        <button
          onClick={() => switchTab('exam')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            tab === 'exam' ? 'bg-exam-accent text-white' : 'text-slate-300 hover:bg-exam-panel2'
          }`}
        >
          🎓 Exam simulator
        </button>
        <button
          onClick={() => switchTab('qa')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            tab === 'qa' ? 'bg-exam-accent text-white' : 'text-slate-300 hover:bg-exam-panel2'
          }`}
        >
          💬 Free Q&A
        </button>
      </div>

      {loadError && (
        <div className="mb-2 rounded-lg border border-exam-danger/40 bg-exam-danger/10 px-3 py-2 text-xs text-red-300">
          {loadError}
        </div>
      )}

      <div className="min-h-0 flex-1">
        {tab === 'exam' ? (
          <ExamView
            exam={exam}
            kbChapters={kbChapters}
            available={generativeOk}
            micSupported={stt.supported}
            listening={stt.listening}
            interimText={stt.interimText}
            micError={stt.error}
            onMicStart={stt.start}
            onMicStop={stt.stop}
            onAnswer={handleExamAnswer}
            onSpeak={tts.supported ? speak : undefined}
            speaking={tts.speaking}
            muted={examMuted}
            onToggleMute={() => {
              if (!examMuted) tts.cancel()
              setExamMuted((m) => !m)
            }}
          />
        ) : (
          <div className="flex h-full flex-col">
            <CaseBar
              activeCase={cases.length ? activeCase : null}
              index={caseIdx}
              total={cases.length}
              onChange={changeCase}
              onGenerate={generateCase}
              generating={generating}
            />
            <div className="min-h-0 flex-1">
              <Chat
                messages={qa.messages}
                loading={qa.loading}
                micSupported={stt.supported}
                listening={stt.listening}
                interimText={stt.interimText}
                micError={stt.error}
                apiError={qa.error}
                onMicStart={stt.start}
                onMicStop={stt.stop}
                onSubmitText={handleQaAsk}
                onSpeak={tts.supported ? speak : undefined}
                emptyHint={
                  <>
                    Ask about this case — or anything in the course material.
                    <br />
                    Use “↻ Change case” above to switch.
                  </>
                }
              />
            </div>
          </div>
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
