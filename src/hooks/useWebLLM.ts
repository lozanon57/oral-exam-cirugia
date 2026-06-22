import { useCallback, useState } from 'react'
import {
  loadLocalModel,
  localGenerate,
  isLocalReady,
  webgpuSupported,
} from '../lib/engines/webllmEngine'
import type { LocalGenerate } from '../lib/engines/types'

export type LocalStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UseWebLLM {
  supported: boolean
  status: LocalStatus
  progress: number
  progressText: string
  error: string | null
  model: string | null
  load: (model: string) => Promise<void>
  generate: LocalGenerate | null
}

export function useWebLLM(): UseWebLLM {
  const supported = webgpuSupported()
  const [status, setStatus] = useState<LocalStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)

  const load = useCallback(
    async (modelId: string) => {
      if (!supported) {
        setError('WebGPU is not available in this browser. Use Chrome/Edge on desktop, or another engine.')
        setStatus('error')
        return
      }
      setStatus('loading')
      setError(null)
      setProgress(0)
      try {
        await loadLocalModel(modelId, (report) => {
          setProgress(report.progress ?? 0)
          setProgressText(report.text ?? '')
        })
        setModel(modelId)
        setStatus('ready')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load the local model.')
        setStatus('error')
      }
    },
    [supported],
  )

  const generate: LocalGenerate | null =
    status === 'ready' && isLocalReady() ? localGenerate : null

  return { supported, status, progress, progressText, error, model, load, generate }
}
