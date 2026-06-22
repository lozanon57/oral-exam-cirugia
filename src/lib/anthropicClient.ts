import type { ChatMessage } from './types'

// Anthropic API adapter.
//
// Default mode: direct-from-browser using the user's own API key (stored in
// localStorage). This requires the `anthropic-dangerous-direct-browser-access`
// header. To hide the key later, implement `serverlessChat` to POST to a Vercel
// function and switch DEFAULT_MODE — the rest of the app is unaffected.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

// Recommended current model (fast + strong for concise exam answers).
export const DEFAULT_MODEL = 'claude-sonnet-4-6'

export const AVAILABLE_MODELS: { id: string; label: string }[] = [
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6 — rápido y preciso (recomendado)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 — el más rápido y económico' },
  { id: 'claude-opus-4-8', label: 'Opus 4.8 — máximo razonamiento (más lento)' },
]

export interface ChatParams {
  apiKey: string
  model: string
  system: string
  messages: ChatMessage[]
  maxTokens?: number
}

function toApiMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }))
}

export class AnthropicError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AnthropicError'
    this.status = status
  }
}

export async function browserChat(params: ChatParams): Promise<string> {
  const { apiKey, model, system, messages, maxTokens = 1024 } = params

  if (!apiKey) {
    throw new AnthropicError('Falta la API key. Añádela en Ajustes.', 401)
  }

  let res: Response
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: toApiMessages(messages),
      }),
    })
  } catch (e) {
    throw new AnthropicError(
      'No se pudo conectar con la API de Anthropic (red o CORS). Revisa tu conexión.',
    )
  }

  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = body?.error?.message || JSON.stringify(body)
    } catch {
      detail = await res.text().catch(() => '')
    }
    if (res.status === 401) {
      throw new AnthropicError('API key inválida o sin permisos (401). Revísala en Ajustes.', 401)
    }
    if (res.status === 429) {
      throw new AnthropicError('Límite de uso alcanzado (429). Espera un momento e inténtalo de nuevo.', 429)
    }
    throw new AnthropicError(`Error de la API (${res.status}): ${detail}`, res.status)
  }

  const data = await res.json()
  const text = Array.isArray(data?.content)
    ? data.content.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('')
    : ''
  return text.trim() || '(respuesta vacía)'
}

// Single entry point so swapping to a serverless proxy is a one-line change.
export const sendChat = browserChat
