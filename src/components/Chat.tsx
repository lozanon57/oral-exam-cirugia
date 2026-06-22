import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../lib/types'
import { MessageBubble } from './MessageBubble'
import { MicButton } from './MicButton'

interface Props {
  messages: ChatMessage[]
  loading: boolean
  micSupported: boolean
  listening: boolean
  interimText: string
  micError: string | null
  apiError: string | null
  onMicStart: () => void
  onMicStop: () => void
  onSubmitText: (text: string) => void
  onSpeak?: (text: string) => void
  disabled?: boolean
  emptyHint?: React.ReactNode
}

export function Chat({
  messages,
  loading,
  micSupported,
  listening,
  interimText,
  micError,
  apiError,
  onMicStart,
  onMicStop,
  onSubmitText,
  onSpeak,
  disabled,
  emptyHint,
}: Props) {
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interimText])

  const submit = () => {
    const t = text.trim()
    if (!t || loading) return
    onSubmitText(t)
    setText('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-1 py-3">
        {messages.length === 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            {emptyHint ?? (
              <>
                Ask anything about the course material — by voice or text.
                <br />
                Answers are grounded only in the course content.
              </>
            )}
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onSpeak={onSpeak} />
        ))}
        {listening && interimText && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl border border-dashed border-exam-accent/60 bg-exam-panel px-4 py-3 text-sm italic text-slate-300">
              {interimText}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {(micError || apiError) && (
        <div className="mb-2 rounded-lg border border-exam-danger/40 bg-exam-danger/10 px-3 py-2 text-xs text-red-300">
          {apiError || micError}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-exam-border pt-3">
        <MicButton
          listening={listening}
          disabled={disabled || !micSupported || loading}
          onStart={onMicStart}
          onStop={onMicStop}
        />
        <div className="flex flex-1 items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={micSupported ? 'Or type your question…' : 'Type your question (voice not supported)…'}
            disabled={disabled || loading}
            className="flex-1 rounded-xl border border-exam-border bg-exam-bg px-4 py-3 text-sm outline-none focus:border-exam-accent disabled:opacity-50"
          />
          <button
            onClick={submit}
            disabled={disabled || loading || !text.trim()}
            className="rounded-xl bg-exam-accent px-4 py-3 text-sm font-medium text-white hover:bg-exam-accentHover disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
