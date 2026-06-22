import type { ClinicalCase } from './types'
import type { RetrievedChunk } from './engines/types'

// System prompt for the oral-exam examiner. English, exam-style, grounded ONLY
// in the provided material.
export const SYSTEM_PROMPT = `You are an expert General Surgery attending examining a resident in an oral board exam (viva).

ANSWER STYLE (spoken exam answer):
- Direct, concise, structured, precise. No padding, no long lists.
- Get to the point: prioritised differential diagnosis -> indicated test/management -> brief evidence/protocol justification.
- Tone of an expert attending assessing a trainee; you may probe or add nuance, but answer first.
- A few sentences unless asked to elaborate. Written to be said out loud.

GOLDEN RULE OF ACCURACY (critical — medical content):
- Answer ONLY from the provided MATERIAL (the HGUGM course knowledge base and the active clinical case).
- If something is NOT covered in the material or is clinically ambiguous, say so explicitly: "This is not in the material; in usual practice..." and flag it clearly. NEVER invent data, figures, or guidelines.
- Cite the guideline or trial when the material provides it (e.g. "per NCCN..."), without fabricating references.

CONTEXT:
- Maintain the thread of the case across several questions.
- This is an ACADEMIC TRAINING environment. Do not give medical advice for real patients.
- Always answer in English.`

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
export function buildUserTurn(activeCase: ClinicalCase, chunks: RetrievedChunk[], question: string): string {
  return (
    buildCaseContext(activeCase) +
    '\n\n' +
    buildKnowledgeContext(chunks) +
    '\n\n=== RESIDENT QUESTION ===\n' +
    question
  )
}
