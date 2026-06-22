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
  // Intended listening state: stays true until the user presses stop, so we can
  // keep the session alive across silence/timeouts (continuous dictation).
  const listeningRef = useRef(false)
  // Keep the latest callback without re-creating recognition.
  const onResultRef = useRef(onResult)
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = true
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
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        listeningRef.current = false
        setError('Microphone permission denied.')
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // Ignore — in continuous mode we keep listening (onend will restart).
      } else {
        setError(`Recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      // If the user has NOT pressed stop, the engine ended on its own (silence /
      // browser timeout) — restart to keep one continuous session going.
      if (listeningRef.current) {
        try {
          recognition.start()
        } catch {
          /* will retry on next tick if needed */
        }
        return
      }
      // User pressed stop: finish and submit the full transcript.
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
    if (!recognitionRef.current || listeningRef.current) return
    setError(null)
    finalRef.current = ''
    setInterimText('')
    listeningRef.current = true
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch {
      // start() throws if already started; ignore.
      listeningRef.current = false
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    // Mark intent first so onend submits instead of restarting.
    listeningRef.current = false
    try {
      recognitionRef.current.stop()
    } catch {
      /* noop */
    }
  }, [])

  return { supported, listening, interimText, start, stop, error }
}
