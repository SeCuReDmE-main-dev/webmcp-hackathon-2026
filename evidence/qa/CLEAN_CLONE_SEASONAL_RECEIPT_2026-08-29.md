# Seasonal clean-clone receipt — 2026-08-29

Status: PASS

- Source commit: `0411c7237dc1f9f1d5be6b6e2d5a9d9c393993ed`.
- Clone mode: new isolated local directory, `--no-hardlinks`, branch `main`.
- `npm ci`: 108 packages installed, 109 audited, 0 vulnerabilities reported.
- `npm test -- --run`: 6 files, 34/34 tests passed.
- `npm run build`: TypeScript passed; Vite transformed 127 modules.
- Release comparison: all 13 output paths, sizes and SHA-256 values match
  `evidence/release/qcg-seasonal-release-manifest-2026-08-29.json`.
- `.gitattributes` pins the copied QCG HTML and public text assets to LF so the
  release is reproducible with Windows `core.autocrlf=true`.

The clean-clone gate performed no deployment, provider call, Devpost submit,
extension installation or public mutation.
