// Cloudflare Worker — server-side proxy for the Anthropic API.
//
// WHY: the frontend is a public static site. The API key must NEVER ship to the
// browser. This worker holds the key as a SECRET (wrangler secret put) and a
// password as a SECRET, validates the password server-side, and forwards the
// request to Anthropic. The browser sends only the password (typed by the user)
// and the chat payload — no key, ever.
//
// Secrets (set with `wrangler secret put`):
//   ANTHROPIC_API_KEY  — your Anthropic key
//   APP_PASSWORD       — the access password (e.g. steiner2026)
//
// Var (in wrangler.toml [vars]):
//   ALLOWED_ORIGIN     — the site origin allowed to call this worker

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

function corsHeaders(origin, allowed) {
  // Allow the configured origin and localhost (dev). Reflect only if allowed.
  const ok =
    origin &&
    (origin === allowed || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-app-password',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN || '*')

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors)
    }

    // --- password gate (server-side) ---
    const password = request.headers.get('x-app-password') || ''
    if (!env.APP_PASSWORD || password !== env.APP_PASSWORD) {
      return json({ error: 'Unauthorized' }, 401, cors)
    }

    let payload
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400, cors)
    }

    // Lightweight auth check (used by the password gate) — no Anthropic call.
    if (payload.ping === true) {
      return json({ ok: true }, 200, cors)
    }

    // --- proxy to Anthropic ---
    const { model, system, messages, max_tokens } = payload
    if (!model || !Array.isArray(messages)) {
      return json({ error: 'Missing model or messages' }, 400, cors)
    }

    let upstream
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          max_tokens: max_tokens || 1024,
          system,
          messages,
        }),
      })
    } catch {
      return json({ error: 'Upstream request failed' }, 502, cors)
    }

    const data = await upstream.json().catch(() => null)
    if (!upstream.ok) {
      const detail = data?.error?.message || 'Anthropic API error'
      return json({ error: detail }, upstream.status, cors)
    }

    const text = Array.isArray(data?.content)
      ? data.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
      : ''
    return json({ text: text.trim() }, 200, cors)
  },
}
