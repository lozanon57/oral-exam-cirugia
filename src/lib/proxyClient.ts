import { PROXY_URL, PASSWORD_KEY } from './config'
import { AnthropicError } from './anthropicClient'
import type { ChatMessage } from './types'

// Client for the Cloudflare Worker proxy. No API key here — the worker holds it.
// The user's password (typed, stored in localStorage) is sent as a header and
// validated server-side.

function getPassword(): string {
  try {
    return localStorage.getItem(PASSWORD_KEY) || ''
  } catch {
    return ''
  }
}

function toApiMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }))
}

export interface ProxyChatParams {
  model: string
  system: string
  messages: ChatMessage[]
  maxTokens?: number
}

async function post(body: unknown): Promise<Response> {
  return fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-app-password': getPassword(),
    },
    body: JSON.stringify(body),
  })
}

// Validate the password against the worker without spending tokens.
export async function checkPassword(password: string): Promise<boolean> {
  if (!PROXY_URL) return false
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-app-password': password },
      body: JSON.stringify({ ping: true }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function proxyChat(params: ProxyChatParams): Promise<string> {
  const { model, system, messages, maxTokens = 1024 } = params

  let res: Response
  try {
    res = await post({ model, system, max_tokens: maxTokens, messages: toApiMessages(messages) })
  } catch {
    throw new AnthropicError('Could not reach the proxy (network). Check your connection.')
  }

  if (res.status === 401) {
    throw new AnthropicError('Wrong or missing password. Unlock the app again.', 401)
  }
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json())?.error || ''
    } catch {
      detail = await res.text().catch(() => '')
    }
    throw new AnthropicError(`Proxy error (${res.status}): ${detail}`, res.status)
  }

  const data = await res.json()
  return (data?.text as string)?.trim() || '(empty response)'
}
