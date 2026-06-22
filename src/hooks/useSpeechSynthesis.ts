import { useCallback, useEffect, useState } from 'react'

// Wraps speechSynthesis for reading answers aloud, with Spanish-voice discovery.

export interface UseSpeechSynthesis {
  supported: boolean
  speaking: boolean
  voices: SpeechSynthesisVoice[]
  speak: (text: string, voiceURI?: string, rate?: number) => void
  cancel: () => void
}

// Strip light markdown so the TTS reads clean prose.
function clean(text: string): string {
  return text
    .replace(/[*_`#>]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim()
}

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [supported])

  const speak = useCallback(
    (text: string, voiceURI?: string, rate = 1) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(clean(text))
      utt.lang = 'es-ES'
      utt.rate = rate
      const all = window.speechSynthesis.getVoices()
      const chosen =
        (voiceURI && all.find((v) => v.voiceURI === voiceURI)) ||
        all.find((v) => v.lang?.toLowerCase().startsWith('es')) ||
        null
      if (chosen) utt.voice = chosen
      utt.onstart = () => setSpeaking(true)
      utt.onend = () => setSpeaking(false)
      utt.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utt)
    },
    [supported],
  )

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { supported, speaking, voices, speak, cancel }
}
