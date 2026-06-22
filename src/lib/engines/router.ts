import type { AnswerContext, AnswerResult, EngineKind, LocalGenerate } from './types'
import { wikiAnswer } from './wikiEngine'
import { browserChat, AnthropicError } from '../anthropicClient'
import { proxyChat } from '../proxyClient'
import { PROXY_MODE } from '../config'
import { SYSTEM_PROMPT, buildUserTurn } from '../prompts'
import type { ChatMessage } from '../types'

// Engine router. Picks an engine based on the user's preference and what is
// actually available, and escalates to the API when it is configured and the
// local/wiki engines have nothing relevant to say.
//
// Availability (no key needed for the first two):
//   wiki   — always available (extractive, offline)
//   local  — available when a WebLLM model is loaded (generate != null)
//   api    — available when an Anthropic API key is set

interface RouterDeps {
  localGenerate: LocalGenerate | null
  localReady: boolean
}

// The API tier is available either via the server proxy (no key in browser) or
// with a user-supplied key (direct browser call).
function apiAvailable(ctx: AnswerContext): boolean {
  return PROXY_MODE || !!ctx.settings.apiKey?.trim()
}

// Turn visible history + current question into provider messages with context
// attached to the current (last) user turn only.
function toGenMessages(ctx: AnswerContext): { role: 'user' | 'assistant'; content: string }[] {
  const history = ctx.history
  const out: { role: 'user' | 'assistant'; content: string }[] = []
  history.forEach((m: ChatMessage, i) => {
    const isLastUser = i === history.length - 1 && m.role === 'user'
    out.push({
      role: m.role,
      content: isLastUser ? buildUserTurn(ctx.activeCase, ctx.chunks, m.content) : m.content,
    })
  })
  return out
}

async function runApi(ctx: AnswerContext): Promise<AnswerResult> {
  const apiMessages: ChatMessage[] = ctx.history.map((m, i) =>
    i === ctx.history.length - 1 && m.role === 'user'
      ? { ...m, content: buildUserTurn(ctx.activeCase, ctx.chunks, m.content) }
      : m,
  )
  // Proxy mode: no key in the browser. Direct mode: user's own key.
  const text = PROXY_MODE
    ? await proxyChat({ model: ctx.settings.model, system: SYSTEM_PROMPT, messages: apiMessages })
    : await browserChat({
        apiKey: ctx.settings.apiKey,
        model: ctx.settings.model,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      })
  return { text, engine: 'api', sources: ctx.chunks.map((c) => c.chapterId) }
}

async function runLocal(ctx: AnswerContext, generate: LocalGenerate): Promise<AnswerResult> {
  const text = await generate(SYSTEM_PROMPT, toGenMessages(ctx))
  return { text, engine: 'local', sources: ctx.chunks.map((c) => c.chapterId) }
}

export async function routeAnswer(ctx: AnswerContext, deps: RouterDeps): Promise<AnswerResult> {
  const pref: EngineKind = ctx.settings.engine
  const canLocal = deps.localReady && !!deps.localGenerate
  const canApi = apiAvailable(ctx)

  // Explicit choices.
  if (pref === 'wiki') return wikiAnswer(ctx)

  if (pref === 'api') {
    if (canApi) return runApi(ctx)
    return withNote(wikiAnswer(ctx), 'No API key set — answered with wiki mode. Add a key in Settings.')
  }

  if (pref === 'local') {
    if (canLocal) return runLocal(ctx, deps.localGenerate!)
    return withNote(
      wikiAnswer(ctx),
      'Local model not loaded — answered with wiki mode. Load it in Settings (needs WebGPU).',
    )
  }

  // pref === 'auto': prefer the richest available engine, escalate to API when
  // there is no relevant material and a key exists.
  if (canLocal) {
    // If the local engine has no material to ground on but an API key exists,
    // the API is more likely to handle it well.
    if (ctx.topScore === 0 && canApi) return escalate(ctx, () => runApi(ctx), 'local')
    return runLocal(ctx, deps.localGenerate!)
  }
  if (canApi) return runApi(ctx)
  // Nothing configured: wiki. If material is empty and we cannot escalate, wiki
  // already explains it found nothing.
  return wikiAnswer(ctx)
}

function withNote(result: AnswerResult, note: string): AnswerResult {
  return { ...result, note: result.note ? `${result.note} · ${note}` : note }
}

async function escalate(
  ctx: AnswerContext,
  primary: () => Promise<AnswerResult>,
  from: string,
): Promise<AnswerResult> {
  try {
    const r = await primary()
    return withNote(r, `Escalated to API (no relevant material for the ${from} engine).`)
  } catch (e) {
    const msg = e instanceof AnthropicError ? e.message : 'API escalation failed.'
    return withNote(wikiAnswer(ctx), msg)
  }
}
