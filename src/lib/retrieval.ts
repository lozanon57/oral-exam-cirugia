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

// Question tokens count more than case tokens: the resident's question drives
// relevance, the case only nudges it. Weights tuned so a chapter that strongly
// matches an off-case question can still outrank the active case's chapter.
const QUESTION_WEIGHT = 3
const CASE_WEIGHT = 1
const CASE_SOURCE_BOOST = 2

export function rankChapters(
  question: string,
  caseText: string,
  chapters: KbChapter[],
  preferChapterId?: string,
): ScoredChapter[] {
  const qSet = new Set(tokenize(question))
  const cSet = new Set(tokenize(caseText))

  const scored = chapters.map((chapter) => {
    const haystack = new Set([
      ...chapter.keywords,
      ...tokenize(chapter.title),
      ...tokenize(chapter.section_titles.join(' ')),
      ...tokenize(chapter.block_name),
    ])
    let score = 0
    for (const t of qSet) if (haystack.has(t)) score += QUESTION_WEIGHT
    for (const t of cSet) if (haystack.has(t) && !qSet.has(t)) score += CASE_WEIGHT
    if (preferChapterId && chapter.id === preferChapterId) score += CASE_SOURCE_BOOST
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
