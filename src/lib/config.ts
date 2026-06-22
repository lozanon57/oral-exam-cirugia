// Build-time config. The proxy URL is injected via VITE_PROXY_URL at build time
// (set in .env / GitHub Actions). When present, the app runs in "proxy mode":
// the API engine calls the Cloudflare Worker (no key in the browser) and the
// whole app is gated behind the server-validated password.

export const PROXY_URL: string = (import.meta.env.VITE_PROXY_URL as string | undefined)?.trim() || ''

export const PROXY_MODE = PROXY_URL.length > 0

// localStorage key holding the password the user typed (their own input — not a
// secret baked into the bundle). Sent to the worker on each request.
export const PASSWORD_KEY = 'oral-exam-password'
