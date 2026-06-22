import type { ClinicalCase } from '../lib/types'

interface Props {
  activeCase: ClinicalCase | null
  index: number
  total: number
  ttsSupported: boolean
  speaking: boolean
  onReplay: () => void
  onChange: () => void
  onGenerate?: () => void
  generating?: boolean
}

// Free Q&A control bar. The clinical case is READ ALOUD (no written vignette).
// Shows only a minimal label + controls. If TTS is unavailable, the scenario
// text is shown as a fallback so the tab stays usable.
export function CaseBar({
  activeCase,
  index,
  total,
  ttsSupported,
  speaking,
  onReplay,
  onChange,
  onGenerate,
  generating,
}: Props) {
  if (!activeCase) {
    return (
      <div className="mb-3 rounded-xl border border-exam-border bg-exam-panel p-3 text-sm text-slate-400">
        Loading clinical case…
      </div>
    )
  }

  return (
    <div className="mb-3 rounded-xl border border-exam-border bg-exam-panel p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-exam-accent">
        Case {total ? index + 1 : 0}/{total} · {activeCase.tema}
      </div>
      <p className="mb-3 text-xs text-slate-400">
        {ttsSupported
          ? '🔊 The case is read aloud — listen, then answer or ask by microphone.'
          : 'Voice output is unavailable here, so the case is shown below.'}
      </p>

      {/* Fallback only when the case cannot be heard. */}
      {!ttsSupported && (
        <p className="mb-3 text-sm leading-relaxed text-slate-200">{activeCase.presentacion}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {ttsSupported && (
          <button
            onClick={onReplay}
            className="rounded-lg bg-exam-accent px-3 py-2 text-sm font-medium text-white hover:bg-exam-accentHover"
          >
            {speaking ? '🔊 Playing…' : '▶ Play case'}
          </button>
        )}
        <button
          onClick={onChange}
          className="rounded-lg border border-exam-border bg-exam-panel2 px-3 py-2 text-sm text-slate-200 hover:bg-exam-border"
        >
          ↻ Change case
        </button>
        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={generating}
            className="rounded-lg border border-exam-border bg-exam-panel2 px-3 py-2 text-sm text-slate-200 hover:bg-exam-border disabled:opacity-50"
          >
            {generating ? 'Generating…' : '✨ Generate new case'}
          </button>
        )}
      </div>
    </div>
  )
}
