import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppSettings, ClinicalCase, KbChapter } from './lib/types'
import { DEFAULT_MODEL, sendChat, AnthropicError } from './lib/anthropicClient'
import { loadCases, loadKbIndex, loadChunk } from './data/loadContent'
import { useChat } from './hooks/useChat'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { Chat } from './components/Chat'
import { CaseCard } from './components/CaseCard'
import { Settings } from './components/Settings'

const SETTINGS_KEY = 'oral-exam-settings-v1'

const DEFAULT_SETTINGS: AppSettings = {
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

  const [cases, setCases] = useState<ClinicalCase[]>([])
  const [kbChapters, setKbChapters] = useState<KbChapter[]>([])
  const [caseIdx, setCaseIdx] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const tts = useSpeechSynthesis()

  // Persist settings.
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  // Load content on mount.
  useEffect(() => {
    Promise.all([loadCases(), loadKbIndex()])
      .then(([c, kb]) => {
        setCases(c.casos)
        setKbChapters(kb.chapters)
        // Start on a random case.
        if (c.casos.length) setCaseIdx(Math.floor(Math.random() * c.casos.length))
      })
      .catch((e) => setLoadError(e?.message || 'No se pudo cargar el contenido.'))
  }, [])

  const activeCase = cases[caseIdx] ?? null

  const chat = useChat({ settings, activeCase, kbChapters })

  const speak = useCallback(
    (text: string) => tts.speak(text, settings.voiceURI || undefined, settings.rate),
    [tts, settings.voiceURI, settings.rate],
  )

  // Ask + optionally read the answer aloud.
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

  // Generate a brand-new case from the knowledge base via Claude.
  const generateCase = useCallback(async () => {
    if (!settings.apiKey) {
      setShowSettings(true)
      return
    }
    if (!kbChapters.length) return
    setGenerating(true)
    try {
      const chapter = kbChapters[Math.floor(Math.random() * kbChapters.length)]
      const material = (await loadChunk(chapter.file)).slice(0, 8000)
      const raw = await sendChat({
        apiKey: settings.apiKey,
        model: settings.model,
        system:
          'Generas casos clínicos de examen oral de Cirugía General en español, basados SOLO en el material dado. '
          + 'Devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional ni markdown.',
        messages: [
          {
            id: 'gen',
            role: 'user',
            content:
              `Material (tema "${chapter.title}"):\n${material}\n\n`
              + 'Crea un caso clínico inédito y realista de examen oral basado en este material. '
              + 'Formato JSON exacto: {"titulo": string, "tema": string, "presentacion": string (motivo de consulta, antecedentes, exploración, constantes y pruebas iniciales, estilo oral), "puntosClave": string[] (4 elementos)}',
          },
        ],
        maxTokens: 900,
      })
      const jsonText = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonText)
      const newCase: ClinicalCase = {
        id: `gen-${Date.now()}`,
        titulo: parsed.titulo || chapter.title,
        tema: parsed.tema || chapter.block_name,
        presentacion: parsed.presentacion || '',
        puntosClave: Array.isArray(parsed.puntosClave) ? parsed.puntosClave : [],
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
      const msg = e instanceof AnthropicError ? e.message : 'No se pudo generar el caso (respuesta no válida).'
      setLoadError(msg)
    } finally {
      setGenerating(false)
    }
  }, [settings, kbChapters, chat, tts])

  const needsKey = !settings.apiKey
  const hasContent = cases.length > 0 && kbChapters.length > 0

  const headerSubtitle = useMemo(() => {
    if (!stt.supported) return 'Voz no soportada en este navegador · usa el modo texto (recomendado: Chrome)'
    return 'Entrenamiento de examen oral · pulsa el micrófono y pregunta'
  }, [stt.supported])

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-3 pb-3 pt-[env(safe-area-inset-top)]">
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <div>
          <h1 className="text-base font-bold leading-tight sm:text-lg">
            Examen Oral · Cirugía General
          </h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">{headerSubtitle}</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-lg border border-exam-border bg-exam-panel px-3 py-2 text-sm hover:bg-exam-panel2"
          aria-label="Ajustes"
        >
          ⚙︎
        </button>
      </header>

      {loadError && (
        <div className="mb-2 rounded-lg border border-exam-danger/40 bg-exam-danger/10 px-3 py-2 text-xs text-red-300">
          {loadError}
        </div>
      )}

      {needsKey && (
        <button
          onClick={() => setShowSettings(true)}
          className="mb-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-300"
        >
          ⚠︎ Añade tu API key de Anthropic en Ajustes para empezar a recibir respuestas.
        </button>
      )}

      {/* Case card */}
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

      {/* Chat */}
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
            disabled={needsKey}
          />
        ) : (
          !loadError && <div className="py-10 text-center text-sm text-slate-500">Cargando contenido…</div>
        )}
      </div>

      {showSettings && (
        <Settings
          settings={settings}
          voices={tts.voices}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
