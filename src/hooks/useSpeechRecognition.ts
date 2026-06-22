import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps the Web Speech API SpeechRecognition for es-ES dictation.
// Auto-submits the question when recognition ends (silence / onend).

type RecognitionCtor = typeof SpeechRecognition

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export interface UseSpeechRecognition {
  supported: boolean
  listening: boolean
  interimText: string
  start: () => void
  stop: () => void
  error: string | null
}

export function useSpeechRecognition(
  onResult: (finalText: string) => void,
  lang = 'en-US',
): UseSpeechRecognition {
  const Ctor = getRecognitionCtor()
  const supported = !!Ctor
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalRef = useRef('')
  // Keep the latest callback without re-creating recognition.
  const onResultRef = useRef(onResult)
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) final += transcript
        else interim += transcript
      }
      if (final) finalRef.current += final
      setInterimText(finalRef.current + interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') setError('No speech detected. Try again.')
      else if (event.error === 'not-allowed') setError('Microphone permission denied.')
      else if (event.error !== 'aborted') setError(`Recognition error: ${event.error}`)
    }

    recognition.onend = () => {
      setListening(false)
      const text = finalRef.current.trim()
      setInterimText('')
      finalRef.current = ''
      if (text) onResultRef.current(text)
    }

    recognitionRef.current = recognition
    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        /* noop */
      }
    }
  }, [Ctor, lang])

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return
    setError(null)
    finalRef.current = ''
    setInterimText('')
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch {
      // start() throws if already started; ignore.
    }
  }, [listening])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      /* noop */
    }
  }, [])

  return { supported, listening, interimText, start, stop, error }
}
