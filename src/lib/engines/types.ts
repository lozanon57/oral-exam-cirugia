import type { AppSettings, ChatMessage, ClinicalCase } from '../types'

export type EngineKind = 'auto' | 'wiki' | 'local' | 'api'

// A retrieved chunk of source material.
export interface RetrievedChunk {
  chapterId: string
  title: string
  text: string
}

export interface AnswerContext {
  question: string
  activeCase: ClinicalCase
  chunks: RetrievedChunk[]
  /** Best retrieval score; 0 means nothing in the material matched. */
  topScore: number
  history: ChatMessage[]
  settings: AppSettings
}

export interface AnswerResult {
  text: string
  /** Which engine actually produced the answer. */
  engine: Exclude<EngineKind, 'auto'>
  sources: string[]
  /** Optional note shown under the answer (e.g. fallback explanation). */
  note?: string
}

// A WebLLM generation function injected by the React layer (holds the loaded model).
export type LocalGenerate = (
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
) => Promise<string>
