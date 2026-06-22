import type { KbChapter } from './types'

// Lightweight keyword retrieval over the chapter index. No vector DB — we score
// chapters by keyword overlap between (case topic + question) and each chapter's
// title/keywords/section titles, then fetch the markdown for the top matches.

const STOPWORDS = new Set(
  ('de la el en y a los las del un una con por para que se su al lo como mas pero sus le ya o este si '
    + 'the of and to in a is for with on as are be this that').split(' ')
)

function tokenize(text: string): string[] {
  return String(text)
    .toLowerCase()
    .split(/[^a-záéíóúüñ0-9]+/i)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
}

export interface ScoredChapter {
  chapter: KbChapter
  score: number
}

export function rankChapters(
  query: string,
  chapters: KbChapter[],
  preferChapterId?: string,
): ScoredChapter[] {
  const qTokens = tokenize(query)
  const qSet = new Set(qTokens)

  const scored = chapters.map((chapter) => {
    const haystack = new Set([
      ...chapter.keywords,
      ...tokenize(chapter.title),
      ...tokenize(chapter.section_titles.join(' ')),
      ...tokenize(chapter.block_name),
    ])
    let score = 0
    for (const t of qSet) if (haystack.has(t)) score += 1
    // Strong boost for the chapter the active case comes from.
    if (preferChapterId && chapter.id === preferChapterId) score += 5
    return { chapter, score }
  })

  return scored.sort((a, b) => b.score - a.score)
}

/**
 * Pick the top chapters to use as context. Always includes the case's source
 * chapter. Caps total characters so we stay well within the model context.
 */
export function selectContextChapters(
  ranked: ScoredChapter[],
  maxChapters = 4,
): KbChapter[] {
  return ranked
    .filter((r) => r.score > 0)
    .slice(0, maxChapters)
    .map((r) => r.chapter)
}

const MAX_CHARS_PER_CHUNK = 9000

export function truncateChunk(text: string): string {
  if (text.length <= MAX_CHARS_PER_CHUNK) return text
  return text.slice(0, MAX_CHARS_PER_CHUNK) + '\n\n…(fragmento recortado)…'
}
