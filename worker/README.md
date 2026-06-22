# Anthropic proxy (Cloudflare Worker)

Server-side proxy so the public frontend never holds the API key. The key and the
access password live as Cloudflare **secrets**. The worker validates the password
server-side and forwards chat requests to Anthropic.

## Deploy

```bash
cd worker
npx wrangler login                      # opens browser, one time
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key (hidden)
npx wrangler secret put APP_PASSWORD        # e.g. steiner2026
npx wrangler deploy
```

`wrangler deploy` prints the worker URL, e.g.
`https://oral-exam-proxy.<account>.workers.dev`.

Put that URL in the frontend as `VITE_PROXY_URL` (see root README) and rebuild.

## Rotate the key

```bash
npx wrangler secret put ANTHROPIC_API_KEY   # paste a new key
```

No redeploy needed for secret changes. Revoke the old key in console.anthropic.com.

## Notes

- `ALLOWED_ORIGIN` in `wrangler.toml` restricts CORS to the Pages site (+ localhost).
- Secrets are never committed; they live only in Cloudflare.
