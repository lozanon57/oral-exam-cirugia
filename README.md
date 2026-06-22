# Examen Oral · Cirugía General 🎤

Entrenador por **voz** para exámenes orales de Cirugía General (estilo MIR / oral de residencia).
Presenta un caso clínico, tú preguntas hablando, y un "adjunto examinador" (Claude) responde de
forma **concisa y basada en el material del curso HGUGM** — no en conocimiento genérico.

> ⚕️ Herramienta **académica de estudio**. No es consejo médico para pacientes reales.

App en producción: **https://lozanon57.github.io/oral-exam-cirugia/**

---

## Cómo funciona

1. La app muestra un **caso clínico** (tarjeta superior, plegable).
2. Pulsas el **micrófono**, formulas tu pregunta en voz alta → se transcribe (Web Speech API, `es-ES`).
3. Al terminar (silencio), la pregunta se envía y el examinador responde, basándose en:
   - el **caso activo**,
   - los **fragmentos relevantes** de la base de conocimiento (recuperación por palabras clave),
   - el **historial** de la conversación del caso.
4. Puedes encadenar varias preguntas sobre el mismo caso.
5. **Cambiar caso clínico** carga otro caso y reinicia la conversación.
6. **Generar caso nuevo** crea un caso inédito a partir del material (usa la API).
7. La respuesta puede **leerse en voz alta** (TTS), activable/desactivable en Ajustes.

La **regla de oro**: si algo no está en el material, el examinador lo advierte en vez de inventar.

---

## API key (Anthropic)

La app llama a Claude **directamente desde el navegador** con **tu propia API key**, que se guarda
**solo en tu navegador** (`localStorage`) — nunca se sube al repo ni a ningún servidor.

1. Consigue una key en **https://console.anthropic.com** → *API Keys*.
2. Abre la app → **⚙︎ Ajustes** → pega la key en *API key de Anthropic* → **Guardar**.
3. (Opcional) Elige modelo: **Sonnet 4.6** (recomendado), Haiku 4.5 (más rápido/barato) u Opus 4.8.

> Nota técnica: usa la cabecera `anthropic-dangerous-direct-browser-access`. Es cómodo para uso
> personal. Si en el futuro quieres **ocultar la key**, ver *Backend serverless* abajo.

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
