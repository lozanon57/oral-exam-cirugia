import { useState } from 'react'
import type { KbChapter } from '../lib/types'
import type { UseExam } from '../hooks/useExam'
import { Chat } from './Chat'

interface Props {
  exam: UseExam
  kbChapters: KbChapter[]
  available: boolean
  // Mic wiring (shared recognition in App).
  micSupported: boolean
  listening: boolean
  interimText: string
  micError: string | null
  onMicStart: () => void
  onMicStop: () => void
  onAnswer: (text: string) => void
  onSpeak?: (text: string) => void
  speaking: boolean
  muted: boolean
  onToggleMute: () => void
}

export function ExamView({
  exam,
  kbChapters,
  available,
  micSupported,
  listening,
  interimText,
  micError,
  onMicStart,
  onMicStop,
  onAnswer,
  onSpeak,
  speaking,
  muted,
  onToggleMute,
}: Props) {
  const [topic, setTopic] = useState('')

  if (!exam.started) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
        <div className="text-5xl">🎓</div>
        <h2 className="text-lg font-semibold">Oral exam simulator</h2>
        <p className="max-w-sm text-sm text-slate-400">
          The examiner presents a clinical case out loud and runs a real viva — one question at a
          time, with feedback and follow-ups. Answer by voice or text.
        </p>

        {!available && (
          <p className="max-w-sm rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            The exam needs Claude (server/API) or a loaded local LLM. Check Settings.
          </p>
        )}

        <div className="w-full max-w-sm">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mb-3 w-full rounded-lg border border-exam-border bg-exam-bg px-3 py-2 text-sm outline-none focus:border-exam-accent"
          >
            <option value="">🎲 Surprise me (random topic)</option>
            {kbChapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.block_name} — {c.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => exam.start(topic || undefined)}
            disabled={!available || !kbChapters.length}
            className="w-full rounded-xl bg-exam-accent py-3 font-medium text-white hover:bg-exam-accentHover disabled:opacity-40"
          >
            Start exam
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-exam-border bg-exam-panel px-3 py-2">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-exam-accent">
            Exam in progress
          </div>
          <div className="truncate text-sm text-slate-200">{exam.topicTitle}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onToggleMute}
            className="rounded-lg border border-exam-border bg-exam-panel2 px-2 py-1.5 text-sm hover:bg-exam-border"
            title={muted ? 'Examiner voice off' : 'Examiner voice on'}
          >
            {muted ? '🔇' : speaking ? '🔊…' : '🔊'}
          </button>
          <button
            onClick={exam.reset}
            className="rounded-lg border border-exam-border bg-exam-panel2 px-3 py-1.5 text-sm hover:bg-exam-border"
          >
            New exam
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Chat
          messages={exam.messages}
          loading={exam.loading}
          micSupported={micSupported}
          listening={listening}
          interimText={interimText}
          micError={micError}
          apiError={exam.error}
          onMicStart={onMicStart}
          onMicStop={onMicStop}
          onSubmitText={onAnswer}
          onSpeak={onSpeak}
        />
      </div>
    </div>
  )
}
