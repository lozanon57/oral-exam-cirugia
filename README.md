# Oral Exam · General Surgery 🎤

A **voice** trainer for the General Surgery oral board exam (viva). It shows a clinical case, you
ask questions out loud, and an "examiner" answers **concisely and grounded ONLY in the HGUGM course
knowledge base** — never generic knowledge. **English** in and out.

> ⚕️ **Academic study tool.** Not medical advice for real patients.

Live app: **https://lozanon57.github.io/oral-exam-cirugia/**

---

## No API key needed — three answer engines (hybrid)

The answer is produced **inside your browser**. Pick the engine in **⚙︎ Settings → Answer engine**:

| Engine | Key? | Device | What it does |
|---|---|---|---|
| **Wiki (offline)** | No | Everything, incl. mobile | Extractive: finds and surfaces the most relevant passages from the material. Instant, fully offline. Default fallback. |
| **Local LLM** | No | Desktop Chrome/Edge (WebGPU) | Runs a small LLM (Llama 3.2 / Qwen2.5) in the browser via WebLLM for conversational answers. Downloads the model once (~1–2.4 GB, cached). |
| **Claude API** | Yes | Everything | Best quality. Uses your Anthropic key (stored only in your browser). |
| **Auto** (default) | — | — | Uses the richest available: Local LLM → API (if a key is set) → Wiki, and **escalates to the API** when there is no relevant material and a key exists. |

Out of the box (no setup) it answers in **Wiki mode** — no key, no download, works on your phone.

---

## How it works

1. The app shows a **clinical case** (collapsible card on top).
2. Tap the **mic**, ask out loud → transcribed (Web Speech API, `en-US`).
3. On silence, the question is sent and the examiner answers, grounded in:
   - the **active case**,
   - the **relevant excerpts** from the knowledge base (keyword retrieval),
   - the **conversation history** of the case.
4. Chain several questions on the same case.
5. **Change clinical case** loads another case and resets the conversation.
6. **Generate new case** creates a fresh case from the material (uses the Local LLM if loaded, else the API).
7. Answers can be **read aloud** (TTS), toggleable in Settings.

**Golden rule:** if something is not in the material, the examiner says so instead of inventing it.

### Optional: enable the Local LLM (no key)

Settings → *Local LLM* → choose a model → **Download & load**. Needs WebGPU (Chrome/Edge on desktop).
First load downloads the model (cached afterwards); use Wi-Fi.

### Optional: Claude API (best quality)

Get a key at **https://console.anthropic.com** → Settings → paste it under *Anthropic API key* →
choose model (Sonnet 4.6 recommended). Stored only in your browser (`localStorage`).

---

## Desarrollo local

Requisitos: Node 18+ (probado con Node 24).

```bash
npm install
npm run dev      # genera el contenido y arranca Vite en http://localhost:5173/oral-exam-cirugia/
```

Build de producción:

```bash
npm run build    # genera contenido + tsc + vite build  ->  /dist
npm run preview  # sirve el build localmente
```

> Recomendado **Chrome** para la voz: el reconocimiento de voz (Web Speech API) tiene mejor soporte.
> Safari funciona parcialmente; Firefox no soporta reconocimiento de voz (usa el modo texto).

---

## Base de conocimiento y casos

El contenido **proviene del curso `surgical-residency-course`** (HGUGM Residencia de Cirugía).
El script `scripts/build-content.mjs`:

- lee `surgical-residency-course/content/chapters/*.json`,
- aplana cada capítulo a **Markdown** en `public/content/kb/*.md`,
- crea un **índice con palabras clave** en `public/content/kb-index.json`,
- genera **12 casos clínicos** en `public/content/casos.json`.

Este contenido se **commitea** (snapshot), así el sitio desplegado es autónomo y el build en CI no
necesita el repo original.

### Regenerar el contenido

```bash
npm run content
# o, si el curso está en otra ruta:
COURSE_DIR=/ruta/a/surgical-residency-course npm run content
```

### Añadir / editar casos a mano

Edita `public/content/casos.json`. Esquema de cada caso:

```json
{
  "id": "caso-001",
  "titulo": "Varón de 68 años con dolor en fosa iliaca derecha",
  "tema": "abdomen agudo",
  "presentacion": "Motivo de consulta, antecedentes, exploración, constantes y pruebas iniciales…",
  "puntosClave": ["diagnóstico diferencial", "pruebas a pedir", "manejo y técnica", "complicaciones"],
  "fuente": "B1"
}
```

`fuente` es el `id` del capítulo en `kb-index.json` (mejora la recuperación de material para ese caso).

### Añadir material a la base de conocimiento

Añade/edita capítulos en el repo del curso y vuelve a ejecutar `npm run content`. El recuperador
puntúa los capítulos por solapamiento de palabras clave con (tema del caso + pregunta) y pasa los
~4 más relevantes al modelo.

---

## Despliegue (GitHub Pages)

Configurado vía **GitHub Actions** (`.github/workflows/deploy.yml`): cada `push` a `main`
construye y publica en Pages.

Pasos una sola vez en GitHub:
1. Repo: `lozanon57/oral-exam-cirugia`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `git push` a `main` → la Action despliega en `https://lozanon57.github.io/oral-exam-cirugia/`.

> `base` en `vite.config.ts` está fijado a `/oral-exam-cirugia/` para que las rutas funcionen en Pages.
> Si renombras el repo, actualiza ese `base`.

---

## Estructura

```
scripts/build-content.mjs     # importa el curso -> KB + casos
public/content/               # KB (kb/*.md, kb-index.json) + casos.json  (committed)
src/
  components/  Chat, MicButton, CaseCard, Settings, MessageBubble
  hooks/       useSpeechRecognition, useSpeechSynthesis, useChat
  lib/         anthropicClient, retrieval, prompts, types
  data/        loadContent
.github/workflows/deploy.yml  # build + deploy a GitHub Pages
```

---

## Backend serverless (opcional, para ocultar la key)

Hoy la llamada vive en `src/lib/anthropicClient.ts` (`browserChat`). Para ocultar la key:
1. Crea una función en Vercel que reciba `{system, messages, model}` y llame a Anthropic con la key
   guardada como **variable de entorno** del servidor.
2. Implementa `serverlessChat` en `anthropicClient.ts` (mismo contrato que `browserChat`).
3. Cambia el export `sendChat` para apuntar a `serverlessChat`. El resto de la app no cambia.

---

## Pendiente de confirmar

- Habilitar **Pages → Source: GitHub Actions** en el repo (paso manual de GitHub, una vez).
- Si quieres modelo distinto por defecto, cámbialo en Ajustes o en `DEFAULT_MODEL`.
