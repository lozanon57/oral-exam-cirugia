import { useCallback, useRef, useState } from 'react'
import type { AppSettings, ChatMessage, ClinicalCase, KbChapter } from '../lib/types'
import { sendChat, AnthropicError } from '../lib/anthropicClient'
import { SYSTEM_PROMPT, buildCaseContext, buildKnowledgeContext } from '../lib/prompts'
import { rankChapters, selectContextChapters, truncateChunk } from '../lib/retrieval'
import { loadChunk } from '../data/loadContent'

let idCounter = 0
const nextId = () => `m${++idCounter}_${Date.now()}`

interface UseChatArgs {
  settings: AppSettings
  activeCase: ClinicalCase | null
  kbChapters: KbChapter[]
}

export interface UseChat {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  ask: (question: string) => Promise<string | null>
  reset: () => void
}

export function useChat({ settings, activeCase, kbChapters }: UseChatArgs): UseChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Hold the live history so retrieval + API see the latest turns.
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
        // --- retrieval: case topic + question -> top chapters ---
        const query = `${activeCase.titulo} ${activeCase.tema} ${q}`
        const ranked = rankChapters(query, kbChapters, activeCase.fuente)
        const chosen = selectContextChapters(ranked)
        const chunks = await Promise.all(
          chosen.map(async (ch) => ({
            title: ch.title,
            text: truncateChunk(await loadChunk(ch.file)),
          })),
        )

        const contextBlock =
          buildCaseContext(activeCase) + '\n\n' + buildKnowledgeContext(chunks)

        // Send the visible history as-is, but attach the freshly retrieved case
        // + material context to the CURRENT question only. Earlier turns keep the
        // case alive conversationally; each new turn gets the most relevant material.
        const apiMessages: ChatMessage[] = historyRef.current.map((m) =>
          m.id === userMsg.id
            ? { ...m, content: `${contextBlock}\n\n=== PREGUNTA DEL RESIDENTE ===\n${m.content}` }
            : m,
        )

        const answer = await sendChat({
          apiKey: settings.apiKey,
          model: settings.model,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        })

        const assistantMsg: ChatMessage = {
          id: placeholder.id,
          role: 'assistant',
          content: answer,
          sources: chosen.map((c) => c.id),
        }
        historyRef.current = [...historyRef.current, assistantMsg]
        setMessages([...historyRef.current])
        return answer
      } catch (e) {
        const msg =
          e instanceof AnthropicError ? e.message : 'Error inesperado al generar la respuesta.'
        setError(msg)
        // Drop the placeholder; keep the user's question in history.
        setMessages([...historyRef.current])
        return null
      } finally {
        setLoading(false)
      }
    },
    [settings, activeCase, kbChapters],
  )

  return { messages, loading, error, ask, reset }
}
