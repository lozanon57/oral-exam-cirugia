import { useState } from 'react'
import { checkPassword } from '../lib/proxyClient'
import { PASSWORD_KEY } from '../lib/config'

interface Props {
  onUnlock: () => void
}

// Full-screen gate shown in proxy mode until the server validates the password.
// The password is validated against the Worker (server-side), not in the bundle.
export function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const pw = value.trim()
    if (!pw || checking) return
    setChecking(true)
    setError(null)
    const ok = await checkPassword(pw)
    setChecking(false)
    if (ok) {
      try {
        localStorage.setItem(PASSWORD_KEY, pw)
        sessionStorage.setItem('oral-exam-unlocked', '1')
      } catch {
        /* ignore storage errors */
      }
      onUnlock()
    } else {
      setError('Wrong password (or the server is unreachable).')
    }
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-exam-border bg-exam-panel p-6 text-center">
        <div className="mb-1 text-3xl">🔒</div>
        <h1 className="text-lg font-bold">Oral Exam · General Surgery</h1>
        <p className="mb-5 mt-1 text-sm text-slate-400">Enter the access password to continue.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Password"
          className="mb-3 w-full rounded-lg border border-exam-border bg-exam-bg px-4 py-3 text-center text-sm outline-none focus:border-exam-accent"
        />
        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
        <button
          onClick={submit}
          disabled={checking || !value.trim()}
          className="w-full rounded-lg bg-exam-accent py-2.5 font-medium text-white hover:bg-exam-accentHover disabled:opacity-50"
        >
          {checking ? 'Checking…' : 'Unlock'}
        </button>
      </div>
    </div>
  )
}
