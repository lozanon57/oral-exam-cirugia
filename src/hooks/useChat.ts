import { useCallback, useRef, useState } from 'react'
import type { AppSettings, ChatMessage, ClinicalCase, KbChapter } from '../lib/types'
import { AnthropicError } from '../lib/anthropicClient'
import { rankChapters, selectContextChapters, truncateChunk } from '../lib/retrieval'
import { loadChunk } from '../data/loadContent'
import { routeAnswer } from '../lib/engines/router'
import type { LocalGenerate, RetrievedChunk } from '../lib/engines/types'

let idCounter = 0
const nextId = () => `m${++idCounter}_${Date.now()}`

interface UseChatArgs {
  settings: AppSettings
  activeCase: ClinicalCase | null
  kbChapters: KbChapter[]
  localGenerate: LocalGenerate | null
  localReady: boolean
}

export interface UseChat {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  ask: (question: string) => Promise<string | null>
  reset: () => void
}

export function useChat({ settings, activeCase, kbChapters, localGenerate, localReady }: UseChatArgs): UseChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const historyRef = useRef<ChatMessage[]>([])

  const reset = useCallback(() => {
    historyRef.current = []
    setMessages([])
    setError(null)
    setLoading(false)
  }, [])

  const ask = useCallback(
    async (question: string): Promise<string | null> => {
      const q = question.trim()
      if (!q || !activeCase) return null

      setError(null)
      const userMsg: ChatMessage = { id: nextId(), role: 'user', content: q }
      const placeholder: ChatMessage = { id: nextId(), role: 'assistant', content: '', pending: true }
      historyRef.current = [...historyRef.current, userMsg]
      setMessages([...historyRef.current, placeholder])
      setLoading(true)

      try {
        // --- retrieval: question drives relevance, case nudges it ---
        const caseText = `${activeCase.titulo} ${activeCase.tema}`
        const ranked = rankChapters(q, caseText, kbChapters, activeCase.fuente)
        const chosen = selectContextChapters(ranked)
        const topScore = ranked.length ? ranked[0].score : 0
        const chunks: RetrievedChunk[] = await Promise.all(
          chosen.map(async (ch) => ({
            chapterId: ch.id,
            title: ch.title,
            text: truncateChunk(await loadChunk(ch.file)),
          })),
        )

        const result = await routeAnswer(
          {
            question: q,
            activeCase,
            chunks,
            topScore,
            history: historyRef.current,
            settings,
          },
          { localGenerate, localReady },
        )

        const ENGINE_LABEL: Record<string, string> = {
          wiki: 'Wiki (offline)',
          local: 'Local LLM',
          api: 'Claude API',
        }
        const assistantMsg: ChatMessage = {
          id: placeholder.id,
          role: 'assistant',
          content: result.text,
          sources: result.sources,
          note: result.note || `Engine: ${ENGINE_LABEL[result.engine]}`,
        }
        historyRef.current = [...historyRef.current, assistantMsg]
        setMessages([...historyRef.current])
        return result.text
      } catch (e) {
        const msg = e instanceof AnthropicError ? e.message : 'Unexpected error while generating the answer.'
        setError(msg)
        setMessages([...historyRef.current])
        return null
      } finally {
        setLoading(false)
      }
    },
    [settings, activeCase, kbChapters, localGenerate, localReady],
  )

  return { messages, loading, error, ask, reset }
}
