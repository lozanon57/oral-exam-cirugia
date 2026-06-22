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

export function CaseCard({ activeCase, index, total, onChange, onGenerate, generating }: Props) {
  const [open, setOpen] = useState(true)

  if (!activeCase) {
    return (
      <div className="rounded-xl border border-exam-border bg-exam-panel p-4 text-sm text-slate-400">
        Cargando caso clínico…
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-exam-border bg-exam-panel">
      <div className="flex items-start justify-between gap-3 p-4">
        <button
          className="flex-1 text-left"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wide text-exam-accent">
            Caso {index + 1}/{total} · {activeCase.tema}
          </div>
          <div className="mt-0.5 font-semibold text-slate-100">{activeCase.titulo}</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {open ? '▾ ocultar enunciado' : '▸ ver enunciado'}
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-exam-border px-4 py-3 text-sm leading-relaxed text-slate-200">
          <p>{activeCase.presentacion}</p>
          {activeCase.puntosClave?.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400">Puntos clave a explorar:</div>
              <ul className="mt-1 list-disc pl-5 text-xs text-slate-400">
                {activeCase.puntosClave.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-exam-border p-3">
        <button
          onClick={onChange}
          className="rounded-lg bg-exam-accent px-3 py-2 text-sm font-medium text-white hover:bg-exam-accentHover"
        >
          ↻ Cambiar caso clínico
        </button>
        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={generating}
            className="rounded-lg border border-exam-border bg-exam-panel2 px-3 py-2 text-sm text-slate-200 hover:bg-exam-border disabled:opacity-50"
          >
            {generating ? 'Generando…' : '✨ Generar caso nuevo'}
          </button>
        )}
      </div>
    </div>
  )
}
