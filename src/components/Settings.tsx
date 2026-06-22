import { useState } from 'react'
import type { AppSettings } from '../lib/types'
import { AVAILABLE_MODELS } from '../lib/anthropicClient'

interface Props {
  settings: AppSettings
  voices: SpeechSynthesisVoice[]
  onChange: (next: AppSettings) => void
  onClose: () => void
}

export function Settings({ settings, voices, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<AppSettings>(settings)
  const esVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('es'))

  const save = () => {
    onChange(draft)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-exam-border bg-exam-panel p-5 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ajustes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-300">API key de Anthropic</label>
        <input
          type="password"
          value={draft.apiKey}
          onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
          placeholder="sk-ant-..."
          className="mb-1 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
        />
        <p className="mb-4 text-xs text-slate-500">
          Se guarda solo en este navegador (localStorage). Consíguela en console.anthropic.com.
        </p>

        <label className="mb-1 block text-sm font-medium text-slate-300">Modelo</label>
        <select
          value={draft.model}
          onChange={(e) => setDraft({ ...draft, model: e.target.value })}
          className="mb-4 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
        >
          {AVAILABLE_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">Leer respuestas en voz alta</label>
          <button
            onClick={() => setDraft({ ...draft, ttsEnabled: !draft.ttsEnabled })}
            className={`h-6 w-11 rounded-full transition ${draft.ttsEnabled ? 'bg-exam-ok' : 'bg-exam-border'}`}
            aria-pressed={draft.ttsEnabled}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                draft.ttsEnabled ? 'translate-x-[22px]' : ''
              }`}
            />
          </button>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-300">Voz</label>
        <select
          value={draft.voiceURI}
          onChange={(e) => setDraft({ ...draft, voiceURI: e.target.value })}
          className="mb-4 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
        >
          <option value="">Voz española por defecto</option>
          {esVoices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-medium text-slate-300">
          Velocidad de lectura: {draft.rate.toFixed(1)}×
        </label>
        <input
          type="range"
          min={0.6}
          max={1.6}
          step={0.1}
          value={draft.rate}
          onChange={(e) => setDraft({ ...draft, rate: Number(e.target.value) })}
          className="mb-5 w-full accent-exam-accent"
        />

        <button
          onClick={save}
          className="w-full rounded-lg bg-exam-accent py-2.5 font-medium text-white hover:bg-exam-accentHover"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
