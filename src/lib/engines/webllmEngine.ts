// WebLLM singleton — runs a small LLM fully in the browser via WebGPU.
// No API key, no server, no cost. The model is downloaded + cached on first use.
// Imported dynamically so the (large) library is a separate lazy-loaded chunk.

import type { MLCEngine, InitProgressReport } from '@mlc-ai/web-llm'

export interface LocalModelOption {
  id: string
  label: string
}

// Curated small instruct models from the WebLLM prebuilt list. Smaller = faster
// download and runs on more hardware; larger = better answers.
export const LOCAL_MODELS: LocalModelOption[] = [
  { id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', label: 'Llama 3.2 1B — smallest/fastest (~0.9 GB)' },
  { id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC', label: 'Llama 3.2 3B — balanced (~2.3 GB)' },
  { id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC', label: 'Qwen2.5 3B — strong reasoning (~2.4 GB)' },
]

export const DEFAULT_LOCAL_MODEL = LOCAL_MODELS[1].id

export function webgpuSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

let engine: MLCEngine | null = null
let loadedModel: string | null = null
let loadingPromise: Promise<MLCEngine> | null = null

export async function loadLocalModel(
  model: string,
  onProgress?: (report: InitProgressReport) => void,
): Promise<MLCEngine> {
  if (engine && loadedModel === model) return engine
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const webllm = await import('@mlc-ai/web-llm')
    const created = await webllm.CreateMLCEngine(model, {
      initProgressCallback: onProgress,
    })
    engine = created
    loadedModel = model
    loadingPromise = null
    return created
  })()

  try {
    return await loadingPromise
  } catch (e) {
    loadingPromise = null
    throw e
  }
}

export function isLocalReady(model?: string): boolean {
  if (!engine) return false
  return model ? loadedModel === model : true
}

export async function localGenerate(
  system: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  if (!engine) throw new Error('Local model not loaded.')
  const reply = await engine.chat.completions.create({
    messages: [{ role: 'system', content: system }, ...messages],
    temperature: 0.3,
    max_tokens: 700,
  })
  return reply.choices[0]?.message?.content?.trim() || '(empty response)'
}
