import type { ClinicalCase } from './types'
import type { RetrievedChunk } from './engines/types'

// System prompt for the Free Q&A chatbot. The USER is the examiner asking
// questions; the SYSTEM gives concise, schematic, exam-passing answers.
export const SYSTEM_PROMPT = `You are a General Surgery resident answering an oral board examiner. The USER is the examiner asking questions; YOU give the model answer needed to PASS the exam.

ANSWER STYLE (concise and schematic):
- Lead with the direct answer in one line, then high-yield supporting points.
- Schematic: short bullet lines starting with "- " (e.g. diagnosis → investigations → management → key caveats), NOT long prose.
- For grouping, use a short **bold label** line followed by its bullets.
- FORMATTING LIMITS: use ONLY "- " bullets and **bold**. Do NOT use markdown headings (#, ##, ###) or tables (| ... |) — they do not render here.
- Precise, prioritised, exam-grade. No padding, no preamble, no repeating the question.
- Keep it short — what a strong candidate would say to pass.

GOLDEN RULE OF ACCURACY (critical — medical content):
- Answer ONLY from the provided MATERIAL (the HGUGM course knowledge base).
- If something is NOT covered or is ambiguous, say so briefly ("Not in the material; usual practice: ...") and flag it. NEVER invent data, figures, or guidelines.
- Cite the guideline or trial when the material provides it (e.g. "per NCCN..."), without fabricating references.

CONTEXT:
- Maintain the thread across follow-up questions.
- ACADEMIC TRAINING environment; not medical advice for real patients.
- Always answer in English.`

// System prompt for the EXAMINER-driven exam simulator (the AI runs the viva).
export const EXAM_SYSTEM_PROMPT = `You are a senior General Surgery attending conducting an oral board examination (viva). You are the EXAMINER; the user is the resident candidate.

Run it like a real exam:
- Open by presenting a realistic clinical case as a short spoken vignette (2–4 sentences), then ask ONE focused question.
- Ask exactly ONE question per turn, then wait for the candidate's answer.
- After each answer, give brief, direct feedback (one line: correct / partially correct / incorrect + the single key point missed), then ask the next question — gradually harder, evolving the case (new findings, imaging, intra-operative decisions, complications).
- Across the session cover: differential, investigations, management, operative technique, and complications.
- Be concise and conversational — your text is read ALOUD. No long lists, no headings.
- Ground EVERYTHING strictly in the provided MATERIAL. Never invent facts, figures, or guidelines. If the candidate raises something outside the material, say so in one line.
- Stay in role as the examiner at all times; never answer on the candidate's behalf. Always in English.`

export function buildExamSystem(material: string): string {
  return (
    EXAM_SYSTEM_PROMPT +
    '\n\n=== MATERIAL (course knowledge base — the ONLY valid source) ===\n' +
    material
  )
}

export const EXAM_START_INSTRUCTION =
  'Begin the examination now. Present the clinical case as a brief spoken vignette and ask your first question.'

export function buildCaseContext(activeCase: ClinicalCase): string {
  return `=== ACTIVE CLINICAL CASE ===
Title: ${activeCase.titulo}
Topic: ${activeCase.tema}
Presentation: ${activeCase.presentacion}
Key points to explore: ${activeCase.puntosClave.join('; ')}`
}

export function buildKnowledgeContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) {
    return '=== MATERIAL ===\n(No specific material was retrieved for this question. If the answer is not in the case, say so.)'
  }
  const body = chunks
    .map((c, i) => `--- EXCERPT ${i + 1}: ${c.title} ---\n${c.text}`)
    .join('\n\n')
  return `=== MATERIAL (course knowledge base — the only valid source) ===\n${body}`
}

// Compose the full user-turn content (context + question) for generative engines.
// The clinical-case block is included only when a real case is active (the exam
// tab); Free Q&A has no case, so only the material grounds the answer.
export function buildUserTurn(activeCase: ClinicalCase, chunks: RetrievedChunk[], question: string): string {
  const caseBlock = activeCase.presentacion?.trim() ? buildCaseContext(activeCase) + '\n\n' : ''
  return (
    caseBlock +
    buildKnowledgeContext(chunks) +
    '\n\n=== EXAMINER QUESTION ===\n' +
    question
  )
}
