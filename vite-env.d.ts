/// <reference types="vite/client" />

// Web Speech API is not in the default TS DOM lib in a stable shape; declare what we use.
interface Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
}
