import { PROXY_MODE } from './config'
import { proxyChat } from './proxyClient'
import { browserChat, AnthropicError } from './anthropicClient'
import type { AppSettings, ChatMessage } from './types'
import type { LocalGenerate } from './engines/types'

// Unified generative call across the available backends (proxy → own key →
// local LLM). Used by modes that REQUIRE a real LLM (exam simulator, case
// generation) — i.e. where the extractive Wiki engine is not an option.

export function generativeAvailable(settings: AppSettings, localReady: boolean): boolean {
  return PROXY_MODE || !!settings.apiKey?.trim() || localReady
}

interface GenerativeArgs {
  system: string
  messages: ChatMessage[]
  settings: AppSettings
  localGenerate: LocalGenerate | null
  maxTokens?: number
}

export async function generativeChat({
  system,
  messages,
  settings,
  localGenerate,
  maxTokens = 900,
}: GenerativeArgs): Promise<string> {
  if (PROXY_MODE) {
    return proxyChat({ model: settings.model, system, messages, maxTokens })
  }
  if (settings.apiKey?.trim()) {
    return browserChat({ apiKey: settings.apiKey, model: settings.model, system, messages, maxTokens })
  }
  if (localGenerate) {
    return localGenerate(
      system,
      messages.filter((m) => m.content.trim()).map((m) => ({ role: m.role, content: m.content })),
    )
  }
  throw new AnthropicError('This mode needs Claude (server/API) or a loaded local LLM. Open Settings.')
}
