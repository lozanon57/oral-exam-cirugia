// Shared domain types.

export interface ClinicalCase {
  id: string
  titulo: string
  tema: string
  presentacion: string
  puntosClave: string[]
  fuente: string
}

export interface CasesFile {
  version: number
  casos: ClinicalCase[]
}

export interface KbChapter {
  id: string
  file: string
  title: string
  block: string
  block_name: string
  level: string
  guidelines_version: string
  section_titles: string[]
  keywords: string[]
}

export interface KbIndex {
  version: number
  chapters: KbChapter[]
}

export type Role = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: Role
  content: string
  /** Chapter ids used as context, for transparency. */
  sources?: string[]
  pending?: boolean
}

export interface AppSettings {
  apiKey: string
  model: string
  ttsEnabled: boolean
  voiceURI: string
  rate: number
}
