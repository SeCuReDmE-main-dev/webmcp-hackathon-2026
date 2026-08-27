# QuaNTecH-ViD

QuaNTecH-ViD is a local-first video production studio for SecuredMe promotional and documentation media. The active architecture is intentionally small and reproducible:

- FastAPI studio on loopback only
- SQLite job database
- local filesystem assets, captures, caches, and renders
- Playwright site capture
- MoviePy plus the `imageio-ffmpeg` bundled FFmpeg binary
- OpenAI text-to-speech for narration, cached by content hash

The legacy MongoDB, Redis, Firebase, IONOS deployment, and GitHub App paths are no longer part of the active runtime.

## Runtime

Use the central workspace environment file:

```powershell
$env:QUANTECH_VID_ENV_FILE="C:\Users\jeans\Desktop\Case study\modele\.env"
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m uvicorn quantech_vid.api:app --host 127.0.0.1 --port 7476
```

Open the studio at `http://127.0.0.1:7476`.

## CLI

```powershell
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m quantech_vid doctor
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m quantech_vid validate-project .\projects\synthia-promo\project.json
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m quantech_vid capture-site https://synthia.securedme.ca --width 1440 --height 900
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m quantech_vid render-promo .\projects\synthia-promo\project.json --locale fr --profile landscape --output .\runtime\renders\synthia-fr-landscape
```

## API

- `GET /api/v1/health`
- `GET /api/v1/projects`
- `POST /api/v1/projects/validate`
- `POST /api/v1/captures`
- `POST /api/v1/narrations`
- `POST /api/v1/renders`
- `GET /api/v1/renders/{id}`
- `POST /api/v1/renders/{id}/cancel`
- `GET /api/v1/renders/{id}/artifacts`

The API rejects non-loopback host configuration and validates that all project assets stay under the configured allowed roots.

## Synthia Promo Project

`projects/synthia-promo/project.json` defines the first approved render pack:

- French and English narration
- 1920x1080 landscape output
- 1080x1920 vertical output
- MP4, WebM, SRT, VTT, poster PNG, provenance JSON, and QA JSON per render

Public copy is intentionally conservative. It describes Synthia as an experimental educational pre-alpha and avoids unverified metrics, certifications, or production guarantees.

## Chrome Extension

The Chrome extension is a loopback capture bridge only. It can send the current tab URL to the local studio and open the studio UI. It has no OAuth, subscription, or remote SaaS behavior.

```powershell
cd plugins\chrome
npm install
npm run test:contract
npm run build
```

Load `plugins/chrome/dist` as an unpacked extension during local development.

## Tests

```powershell
C:\Users\jeans\Desktop\Case study\modele\.venv\Scripts\python.exe -m pytest
```

The test suite covers manifests, path safety, TTS cache keys, subtitle timing, job recovery/cancel behavior, API endpoints, and a real short render through MoviePy/FFmpeg.

## Security Notes

No live secrets belong in this repository. `OPENAI_API_KEY` is read from the central `.env` at runtime and is never copied into manifests, provenance files, or committed configuration. Render outputs, runtime caches, extension packages, `.pem` signing keys, and `.crx` archives are ignored.
