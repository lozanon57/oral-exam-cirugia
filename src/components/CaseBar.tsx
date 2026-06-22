import { useState } from 'react'
import type { ClinicalCase } from '../lib/types'

interface Props {
  activeCase: ClinicalCase | null
  index: number
  total: number
  onChange: () => void
  onGenerate?: () => void
  generating?: boolean
}

// Compact clinical-case header for the Free Q&A tab: shows the case scenario and
// lets the user refresh/change to another case (or generate a new one).
export function CaseBar({ activeCase, index, total, onChange, onGenerate, generating }: Props) {
  const [open, setOpen] = useState(true)

  if (!activeCase) {
    return (
      <div className="mb-3 rounded-xl border border-exam-border bg-exam-panel p-3 text-sm text-slate-400">
        Loading clinical case…
      </div>
    )
  }

  return (
    <div className="mb-3 rounded-xl border border-exam-border bg-exam-panel">
      <div className="flex items-start justify-between gap-3 p-3">
        <button className="min-w-0 flex-1 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-exam-accent">
            Case {total ? index + 1 : 0}/{total} · {activeCase.tema}
          </div>
          <div className="mt-0.5 truncate font-semibold text-slate-100">
            {activeCase.titulo || 'Clinical case'}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">{open ? '▾ hide case' : '▸ show case'}</div>
        </button>
      </div>

      {open && (
        <div className="border-t border-exam-border px-3 py-3 text-sm leading-relaxed text-slate-200">
          {activeCase.presentacion}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-exam-border p-3">
        <button
          onClick={onChange}
          className="rounded-lg bg-exam-accent px-3 py-2 text-sm font-medium text-white hover:bg-exam-accentHover"
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
