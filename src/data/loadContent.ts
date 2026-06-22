import type { CasesFile, KbIndex } from '../lib/types'

// Loads the pre-built knowledge base and cases from /public/content. Honours the
// Vite base path so it works both locally and on GitHub Pages.

const base = import.meta.env.BASE_URL

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${base}content/${path}`)
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
  return res.json() as Promise<T>
}

export async function loadCases(): Promise<CasesFile> {
  return getJson<CasesFile>('casos.json')
}

export async function loadKbIndex(): Promise<KbIndex> {
  return getJson<KbIndex>('kb-index.json')
}

// Fetch the raw markdown for a single chapter chunk, with a tiny in-memory cache.
const chunkCache = new Map<string, string>()

export async function loadChunk(file: string): Promise<string> {
  const cached = chunkCache.get(file)
  if (cached) return cached
  const res = await fetch(`${base}content/kb/${file}`)
  if (!res.ok) throw new Error(`No se pudo cargar el fragmento ${file} (${res.status})`)
  const text = await res.text()
  chunkCache.set(file, text)
  return text
}
