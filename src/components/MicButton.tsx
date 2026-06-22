interface Props {
  listening: boolean
  disabled?: boolean
  onStart: () => void
  onStop: () => void
}

export function MicButton({ listening, disabled, onStart, onStop }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={listening ? onStop : onStart}
      aria-pressed={listening}
      aria-label={listening ? 'Detener grabación' : 'Hablar'}
      className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl transition
        ${disabled ? 'cursor-not-allowed bg-exam-panel2 text-slate-600' : ''}
        ${listening ? 'bg-exam-danger text-white' : 'bg-exam-accent text-white hover:bg-exam-accentHover'}`}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-exam-danger animate-pulsering" aria-hidden />
      )}
      <span className="relative">{listening ? '⏹' : '🎤'}</span>
    </button>
  )
}
