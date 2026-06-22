import { useCallback, useRef, useState } from 'react'
import type { AppSettings, ChatMessage, KbChapter } from '../lib/types'
import type { LocalGenerate } from '../lib/engines/types'
import { generativeChat } from '../lib/generate'
import { AnthropicError } from '../lib/anthropicClient'
import { buildExamSystem, EXAM_START_INSTRUCTION } from '../lib/prompts'
import { loadChunk } from '../data/loadContent'
import { truncateChunk } from '../lib/retrieval'

let idCounter = 0
const nextId = () => `e${++idCounter}_${Date.now()}`

interface UseExamArgs {
  settings: AppSettings
  kbChapters: KbChapter[]
  localGenerate: LocalGenerate | null
  // Called with each new examiner message (for read-aloud).
  onExaminer?: (text: string) => void
}

export interface UseExam {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  started: boolean
  topicTitle: string
  start: (chapterId?: string) => Promise<void>
  answer: (text: string) => Promise<void>
  reset: () => void
}

export function useExam({ settings, kbChapters, localGenerate, onExaminer }: UseExamArgs): UseExam {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')

  // Session-scoped: the system prompt (with material) and the running history.
  const systemRef = useRef<string>('')
  const historyRef = useRef<ChatMessage[]>([])

  const reset = useCallback(() => {
    systemRef.current = ''
    historyRef.current = []
    setMessages([])
    setStarted(false)
    setTopicTitle('')
    setError(null)
    setLoading(false)
  }, [])

  // Run one examiner turn given the current history.
  const examinerTurn = useCallback(async () => {
    const placeholder: ChatMessage = { id: nextId(), role: 'assistant', content: '', pending: true }
    setMessages([...historyRef.current, placeholder])
    setLoading(true)
    try {
      const text = await generativeChat({
        system: systemRef.current,
        messages: historyRef.current,
        settings,
        localGenerate,
        maxTokens: 700,
      })
      const examinerMsg: ChatMessage = { id: placeholder.id, role: 'assistant', content: text }
      historyRef.current = [...historyRef.current, examinerMsg]
      setMessages([...historyRef.current])
      onExaminer?.(text)
    } catch (e) {
      const msg = e instanceof AnthropicError ? e.message : 'Could not reach the examiner. Try again.'
      setError(msg)
      setMessages([...historyRef.current])
    } finally {
      setLoading(false)
    }
  }, [settings, localGenerate, onExaminer])

  const start = useCallback(
    async (chapterId?: string) => {
      if (!kbChapters.length) return
      const chapter =
        kbChapters.find((c) => c.id === chapterId) ||
        kbChapters[Math.floor(Math.random() * kbChapters.length)]

      setError(null)
      setStarted(true)
      setTopicTitle(chapter.title)
      let material = ''
      try {
        material = truncateChunk(await loadChunk(chapter.file))
      } catch {
        setError('Could not load the material for this topic.')
        return
      }
      systemRef.current = buildExamSystem(material)
      // Kick off: a single user instruction tells the examiner to begin.
      historyRef.current = [{ id: nextId(), role: 'user', content: EXAM_START_INSTRUCTION }]
      await examinerTurn()
    },
    [kbChapters, examinerTurn],
  )

  const answer = useCallback(
    async (text: string) => {
      const t = text.trim()
      if (!t || !started || loading) return
      const userMsg: ChatMessage = { id: nextId(), role: 'user', content: t }
      historyRef.current = [...historyRef.current, userMsg]
      setMessages([...historyRef.current])
      await examinerTurn()
    },
    [started, loading, examinerTurn],
  )

  // The kick-off instruction is internal — hide it from the visible transcript.
  const visibleMessages = messages.filter((m) => m.content !== EXAM_START_INSTRUCTION)

  return { messages: visibleMessages, loading, error, started, topicTitle, start, answer, reset }
}
