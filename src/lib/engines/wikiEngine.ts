import type { AnswerContext, AnswerResult } from './types'

// Wiki / extractive engine — NO LLM, no API, works on every device offline.
// It splits the retrieved chapter markdown into passages, scores each passage
// against the question, and surfaces the most relevant ones with breadcrumbs.
// This is the "LLM-wiki" fallback: it answers from the material directly.

const STOPWORDS = new Set(
  ('the of and to in a is for with on as are be this that or it at by from an we you they i he she '
    + 'his her its their our your what which who whom how when where why does do did can could should '
    + 'would may might will shall not no yes than then them these those there here').split(' ')
)

function tokenize(text: string): string[] {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
}

interface Passage {
  chapterTitle: string
  section: string
  text: string
  score: number
}

// Parse one chapter's markdown into passages, tracking H1 (chapter) and H2 (section).
function toPassages(chapterTitle: string, md: string): Passage[] {
  const lines = md.split('\n')
  let section = ''
  let buffer: string[] = []
  const passages: Passage[] = []

  const flush = () => {
    const text = buffer.join('\n').trim()
    if (text && text.length > 40) {
      passages.push({ chapterTitle, section, text, score: 0 })
    }
    buffer = []
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush()
      section = line.replace(/^##\s+/, '').trim()
    } else if (line.startsWith('# ')) {
      flush()
    } else if (line.trim() === '') {
      flush()
    } else {
      buffer.push(line)
    }
  }
  flush()
  return passages
}

export function wikiAnswer(ctx: AnswerContext): AnswerResult {
  // The question drives relevance; the case title is a weak tie-breaker, so an
  // on-topic passage always beats a passage that merely matches the case theme.
  const qTokens = new Set(tokenize(ctx.question))
  const caseTokens = new Set(tokenize(ctx.activeCase.titulo))

  const passages: Passage[] = []
  for (const chunk of ctx.chunks) {
    for (const p of toPassages(chunk.title, chunk.text)) {
      const pTokens = tokenize(`${p.section} ${p.text}`)
      let score = 0
      for (const t of pTokens) {
        if (qTokens.has(t)) score += 3
        else if (caseTokens.has(t)) score += 1
      }
      // Reward section-title hits on the question.
      const sectionHit = tokenize(p.section).some((t) => qTokens.has(t)) ? 4 : 0
      p.score = score + sectionHit
      passages.push(p)
    }
  }

  passages.sort((a, b) => b.score - a.score)
  const top = passages.filter((p) => p.score > 0).slice(0, 3)

  const sources = ctx.chunks.map((c) => c.chapterId)

  if (!top.length) {
    return {
      text:
        `I could not find anything in the course material that directly answers this. `
        + `This topic does not appear to be covered — check the active case scope or rephrase. `
        + `(Wiki mode does not invent content.)`,
      engine: 'wiki',
      sources,
      note: 'Wiki mode · no relevant passage found in the material.',
    }
  }

  const body = top
    .map((p) => `**${p.chapterTitle} — ${p.section}**\n${trim(p.text, 700)}`)
    .join('\n\n')

  return {
    text:
      `Here is what the course material says (most relevant passages):\n\n${body}`,
    engine: 'wiki',
    sources,
    note: 'Wiki mode · extractive answer straight from the material (no LLM). Enable the local LLM or add an API key for conversational answers.',
  }
}

function trim(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}
