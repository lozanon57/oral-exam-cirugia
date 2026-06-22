import { useState } from 'react'
import type { AppSettings } from '../lib/types'
import { AVAILABLE_MODELS } from '../lib/anthropicClient'
import { LOCAL_MODELS } from '../lib/engines/webllmEngine'
import { PROXY_MODE } from '../lib/config'
import type { UseWebLLM } from '../hooks/useWebLLM'

interface Props {
  settings: AppSettings
  voices: SpeechSynthesisVoice[]
  webllm: UseWebLLM
  onChange: (next: AppSettings) => void
  onClose: () => void
}

const ENGINE_OPTIONS: { value: AppSettings['engine']; label: string; hint: string }[] = [
  { value: 'auto', label: 'Auto', hint: 'Best available: local LLM → Claude → wiki. Escalates to Claude when needed.' },
  { value: 'wiki', label: 'Wiki (offline)', hint: 'Extractive answers from the material. No key, works everywhere.' },
  { value: 'local', label: 'Local LLM', hint: 'In-browser model via WebGPU. No key. Load it below.' },
  {
    value: 'api',
    label: 'Claude',
    hint: PROXY_MODE
      ? 'Best quality. Runs via the secure server proxy (key managed for you).'
      : 'Best quality. Requires an Anthropic API key (below).',
  },
]

export function Settings({ settings, voices, webllm, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<AppSettings>(settings)
  const enVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'))

  const save = () => {
    onChange(draft)
    onClose()
  }

  const loadModel = () => webllm.load(draft.localModel)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-exam-border bg-exam-panel p-5 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Engine */}
        <label className="mb-1 block text-sm font-medium text-slate-300">Answer engine</label>
        <select
          value={draft.engine}
          onChange={(e) => setDraft({ ...draft, engine: e.target.value as AppSettings['engine'] })}
          className="mb-1 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
        >
          {ENGINE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mb-4 text-xs text-slate-500">
          {ENGINE_OPTIONS.find((o) => o.value === draft.engine)?.hint}
        </p>

        {/* Local LLM */}
        <div className="mb-4 rounded-lg border border-exam-border bg-exam-bg p-3">
          <div className="mb-2 text-sm font-medium text-slate-300">Local LLM (in-browser, no key)</div>
          {!webllm.supported && (
            <p className="text-xs text-amber-400">
              WebGPU not available here. Use Chrome/Edge on desktop for the local LLM.
            </p>
          )}
          <select
            value={draft.localModel}
            onChange={(e) => setDraft({ ...draft, localModel: e.target.value })}
            disabled={!webllm.supported || webllm.status === 'loading'}
            className="mb-2 w-full rounded-lg border border-exam-border bg-exam-panel px-3 py-2 text-sm outline-none focus:border-exam-accent disabled:opacity-50"
          >
            {LOCAL_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          {webllm.status === 'ready' && webllm.model === draft.localModel ? (
            <p className="text-xs text-exam-ok">✓ Loaded and ready ({webllm.model}).</p>
          ) : (
            <button
              onClick={loadModel}
              disabled={!webllm.supported || webllm.status === 'loading'}
              className="w-full rounded-lg bg-exam-panel2 px-3 py-2 text-sm text-slate-100 hover:bg-exam-border disabled:opacity-50"
            >
              {webllm.status === 'loading' ? 'Downloading…' : 'Download & load model'}
            </button>
          )}

          {webllm.status === 'loading' && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded bg-exam-border">
                <div
                  className="h-full bg-exam-accent transition-all"
                  style={{ width: `${Math.round(webllm.progress * 100)}%` }}
                />
              </div>
              <p className="mt-1 truncate text-[11px] text-slate-500">{webllm.progressText}</p>
            </div>
          )}
          {webllm.error && <p className="mt-1 text-xs text-red-400">{webllm.error}</p>}
          <p className="mt-2 text-[11px] text-slate-500">
            First load downloads the model (cached afterwards). Large files — use Wi-Fi.
          </p>
        </div>

        {/* API key — hidden in proxy mode (key is server-managed) */}
        {PROXY_MODE ? (
          <p className="mb-4 rounded-lg border border-exam-ok/30 bg-exam-ok/5 px-3 py-2 text-xs text-slate-300">
            🔒 Claude runs through a secure server proxy — the API key is managed for you and never
            stored in this browser. Access is controlled by your password.
          </p>
        ) : (
          <>
            <label className="mb-1 block text-sm font-medium text-slate-300">Anthropic API key (optional)</label>
            <input
              type="password"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="sk-ant-… (only needed for the API engine)"
              className="mb-1 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
            />
            <p className="mb-3 text-xs text-slate-500">
              Stored only in this browser (localStorage). Get one at console.anthropic.com.
            </p>
          </>
        )}
        <label className="mb-1 block text-sm font-medium text-slate-300">Claude model</label>
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

        {/* TTS */}
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">Read answers aloud</label>
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

        <label className="mb-1 block text-sm font-medium text-slate-300">Voice</label>
        <select
          value={draft.voiceURI}
          onChange={(e) => setDraft({ ...draft, voiceURI: e.target.value })}
          className="mb-4 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
        >
          <option value="">Default English voice</option>
          {enVoices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-medium text-slate-300">
          Reading speed: {draft.rate.toFixed(1)}×
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
          Save
        </button>
      </div>
    </div>
  )
}
