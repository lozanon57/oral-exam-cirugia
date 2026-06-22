// Build script: imports the HGUGM surgical-residency-course chapter JSONs and
// normalises them into (1) a keyword index and (2) per-chapter markdown chunks
// used as the retrieval knowledge base, plus (3) an auto-generated set of
// clinical cases. Run via `npm run content` (also runs before dev/build).
//
// Source of truth: the sibling repo `surgical-residency-course`. We copy a
// snapshot into /public/content so the deployed static site is self-contained.

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = join(ROOT, 'public', 'content')
const CHUNKS_DIR = join(OUT, 'kb')

// Locate the source course. Override with COURSE_DIR env var if it moves.
const CANDIDATES = [
  process.env.COURSE_DIR,
  resolve(ROOT, '..', 'surgical-residency-course'),
].filter(Boolean)

const SOURCE = CANDIDATES.find((p) => p && existsSync(join(p, 'content', 'chapters')))
if (!SOURCE) {
  // On CI (and any clone without the source course) the content is already
  // committed under public/content — skip regeneration gracefully.
  if (existsSync(join(OUT, 'kb-index.json'))) {
    console.warn('[content] Source course not found; using committed public/content snapshot.')
    process.exit(0)
  }
  console.error('[content] Could not find surgical-residency-course/content/chapters.')
  console.error('[content] Checked:', CANDIDATES)
  console.error('[content] Set COURSE_DIR=/abs/path/to/surgical-residency-course and retry.')
  process.exit(1)
}
const CHAPTERS_DIR = join(SOURCE, 'content', 'chapters')

mkdirSync(CHUNKS_DIR, { recursive: true })

// ---------- helpers ----------

const STOPWORDS = new Set(
  ('de la el en y a los las del un una con por para que se su al lo como mas pero sus le ya o este si '
    + 'the of and to in a is for with on as are be this that').split(' ')
)

function keywordsFrom(text) {
  const seen = new Map()
  for (const raw of String(text).toLowerCase().split(/[^a-záéíóúüñ0-9]+/i)) {
    const w = raw.trim()
    if (w.length < 4 || STOPWORDS.has(w)) continue
    seen.set(w, (seen.get(w) || 0) + 1)
  }
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w)
}

// Flatten a content block into readable markdown.
function blockToMarkdown(b) {
  switch (b.type) {
    case 'text':
      return b.content || ''
    case 'case_opener':
    case 'case':
      return `**Case:** ${b.scenario || b.content || ''}`
    case 'callout': {
      const label = b.style ? `[${b.style}] ` : ''
      const title = b.title ? `**${b.title}** — ` : ''
      return `> ${label}${title}${b.content || ''}`
    }
    case 'key_points': {
      const items = (b.points || b.items || []).map((p) => `- ${p}`).join('\n')
      return `**Key points:**\n${items}`
    }
    case 'landmark_trial': {
      const name = b.name || b.title || 'Trial'
      const finding = b.finding || b.summary || b.content || ''
      return `**Landmark trial — ${name}:** ${finding}`
    }
    case 'table': {
      const rows = b.rows || []
      const head = b.headers || (rows[0] ? rows[0] : [])
      const body = b.headers ? rows : rows.slice(1)
      if (!head.length) return ''
      const sep = head.map(() => '---').join(' | ')
      const lines = [head.join(' | '), sep, ...body.map((r) => (Array.isArray(r) ? r.join(' | ') : ''))]
      const cap = b.title || b.caption ? `*${b.title || b.caption}*\n` : ''
      return `${cap}${lines.join('\n')}`
    }
    case 'figure':
      return b.caption ? `*(Figure: ${b.caption})*` : ''
    default:
      return b.content || ''
  }
}

function chapterToMarkdown(c) {
  const out = []
  out.push(`# ${c.title}${c.subtitle ? ` — ${c.subtitle}` : ''}`)
  out.push(`*Block ${c.block} · ${c.block_name} · ${c.level || ''}*`)
  if (c.guidelines_version) out.push(`*Guidelines: ${c.guidelines_version}*`)
  for (const s of c.sections || []) {
    out.push(`\n## ${s.title}`)
    for (const b of s.blocks || []) {
      const md = blockToMarkdown(b)
      if (md && md.trim()) out.push(md.trim())
    }
  }
  return out.join('\n\n')
}

function firstScenario(c) {
  for (const s of c.sections || []) {
    for (const b of s.blocks || []) {
      if ((b.type === 'case_opener' || b.type === 'case') && (b.scenario || b.content)) {
        return b.scenario || b.content
      }
    }
  }
  return null
}

// ---------- build ----------

const files = readdirSync(CHAPTERS_DIR).filter((f) => f.endsWith('.json'))
const index = []
const cases = []
let caseN = 0

for (const file of files) {
  let c
  try {
    c = JSON.parse(readFileSync(join(CHAPTERS_DIR, file), 'utf8'))
  } catch {
    console.warn('[content] skip unparseable', file)
    continue
  }
  if (!c.sections) continue

  const chapterId = c.id || file.replace('.json', '')
  const md = chapterToMarkdown(c)
  const chunkFile = `${file.replace('.json', '')}.md`
  writeFileSync(join(CHUNKS_DIR, chunkFile), md, 'utf8')

  const sectionTitles = (c.sections || []).map((s) => s.title).join(' ')
  const kwSource = [c.title, c.subtitle, c.block_name, sectionTitles,
    (c.learning_objectives || []).join(' ')].join(' ')

  index.push({
    id: chapterId,
    file: chunkFile,
    title: c.title,
    block: c.block,
    block_name: c.block_name,
    level: c.level || '',
    guidelines_version: c.guidelines_version || '',
    section_titles: (c.sections || []).map((s) => s.title),
    keywords: keywordsFrom(kwSource).slice(0, 40),
  })

  // Auto-generate one case per chapter that has a real scenario; this seeds a
  // realistic oral-exam case bank rooted in the material.
  const scenario = firstScenario(c)
  if (scenario) {
    caseN += 1
    cases.push({
      id: `caso-${String(caseN).padStart(3, '0')}`,
      titulo: c.title,
      tema: c.block_name,
      presentacion: scenario,
      puntosClave: (c.learning_objectives || []).slice(0, 5),
      fuente: chapterId,
      // NOTE: keys are internal (legacy es); values are English.
    })
  }
}

// Ensure a healthy spread of cases (8–12). If few chapters carry an explicit
// scenario, synthesise exam-style openers from chapter objectives so the bank
// always covers the major surgical domains.
const TARGET = 12
if (cases.length < 8) {
  const used = new Set(cases.map((k) => k.fuente))
  for (const entry of index) {
    if (cases.length >= TARGET) break
    if (used.has(entry.id)) continue
    caseN += 1
    cases.push({
      id: `caso-${String(caseN).padStart(3, '0')}`,
      titulo: entry.title,
      tema: entry.block_name,
      presentacion:
        `Oral-exam case on ${entry.title} (${entry.block_name}). `
        + `The examiner will pose a clinical scenario from this area. `
        + `Be ready for the differential diagnosis, indicated tests, and management. `
        + `Material topics: ${entry.section_titles.slice(0, 4).join('; ')}.`,
      puntosClave: ['differential diagnosis', 'tests to order', 'management & technique', 'complications'],
      fuente: entry.id,
    })
    used.add(entry.id)
  }
}

writeFileSync(join(OUT, 'kb-index.json'), JSON.stringify({ version: 2, chapters: index }, null, 2))
writeFileSync(join(OUT, 'casos.json'), JSON.stringify({ version: 1, casos: cases }, null, 2))

console.log(`[content] source: ${SOURCE}`)
console.log(`[content] chapters indexed: ${index.length}`)
console.log(`[content] kb chunks written: ${index.length} -> public/content/kb/`)
console.log(`[content] clinical cases generated: ${cases.length}`)
