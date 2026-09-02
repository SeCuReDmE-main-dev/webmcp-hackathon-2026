# Actions 227–232 — repaired publication and deployment parity receipt

Date: 2026-09-02 (America/Toronto)

Status: `PASS`

Scope: runtime candidate, remote publication, GitHub safeguards, Vercel,
cPanel, browser-decodable assets and cross-surface parity

## Authoritative runtime candidate

- Runtime candidate commit:
  `938da498312edab8dd41c12f4b9558865993c833`.
- Remote `origin/main` at promotion time: exact match.
- Repository: `SeCuReDmE-main-dev/webmcp-hackathon-2026`.
- GitHub visibility: public.
- Minimal `main` protection: force pushes disabled and branch deletion disabled.

The runtime candidate contains the final application candidate plus Vercel
routing/header corrections, the raw-binary restoration of eight brand PNGs and
the current live-smoke fixture identifiers. Documentation commits may follow;
the runtime identity above is the deployed application boundary.

## Binary-asset incident and correction

The first 24-path package passed hash parity because Git, Vercel and cPanel all
served the same bytes. Chrome then rejected the 192-pixel PWA icon. Investigation
proved that eight valid PNG working-tree files had earlier been normalized as
text when their Git blobs were created. The source artwork was not redesigned.
The index blobs were replaced with the exact raw bytes under the existing
`public/** -text` rule.

Validation after repair:

- Pillow verified all eight source PNGs and their dimensions;
- each Git index blob equals `git hash-object --no-filters` for its source;
- a fresh clean copy passed 88/88 application tests, 5/5 Companion gates,
  TypeScript/Vite build and `npm audit` with zero vulnerabilities;
- all eight PNGs decoded from the clean-copy `dist`;
- all eight PNGs decoded after R2 archive extraction;
- headless Chrome decoded all eight PNGs on Vercel and cPanel with no console
  or page error.

This is why the final gate requires both byte parity and browser decode.

## Published package identities

| Artifact | SHA-256 |
|---|---|
| Production Companion ZIP | `D69B3DEE68C6DF5A28D526B5A8616CC0148CA58EA7B40F5159F2D193D4216916` |
| Development Companion ZIP | `33EACB2CBD3475E86E86EFD899F2540E5FD5DD7B0F0F99E6E3726BC246BBD35B` |
| Repaired cPanel R2 package | `C4FE4BB205F58B52ECDC30D73855ADF16E29A62EF578A275103632E3D47C4D50` |
| R2 deployment manifest | `10A7AAAFBB4EEC52F4479E3280BA2359FD915CCB989C50DFEDF92E393B12CA59` |

The R2 package contains 24 files and is the only package used for the final
promotion recorded below.

## Vercel verification

Vercel automatically promoted runtime candidate `938da49`. Independent checks
recorded:

- deployment manifest: `24/24 PASS`, treating `.htaccess` as a non-disclosure
  check;
- `/decisions`: HTTP `200` with the exact root HTML;
- policy headers: `7/7`;
- WASM MIME: `application/wasm`;
- Companion MIME: `application/zip`;
- `.htaccess`: redirected rather than disclosed;
- `/assets/`: SPA root response, not a directory listing;
- brand PNGs decoded by Chrome: `8/8`;
- console/page errors during decode: `0`.

## cPanel apply and rollback boundary

- Deployment plan/apply ID: `e001700c1c88f9e14d7f00ce`.
- Destination: `/home/xacm7978/public_html/qcg.securedme.ca`.
- Applied package SHA-256:
  `C4FE4BB205F58B52ECDC30D73855ADF16E29A62EF578A275103632E3D47C4D50`.
- Retained rollback backup:
  `/home/xacm7978/public_html/qcg.securedme.ca.backup-e001700c1c88f9e14d7f00ce`.
- Operator result: success; all 24 expected paths verified; staging cleaned;
  rollback not required; no secret value exposed.
- Independent live manifest: `24/24 PASS`.
- `/decisions`: HTTP `200` with the exact root HTML.
- Policy headers: `7/7`.
- WASM/ZIP MIME: correct.
- `/assets/`: HTTP `403`.
- `.htaccess`: HTTP `403`.
- Brand PNGs decoded by Chrome: `8/8` with no console/page error.

## Current public WebMCP smoke

After both hosts served the repaired runtime, the official
`webmcp-evals@0.0.4` smoke ran against
`https://qcg.securedme.ca/?eval_fixture=simulate-first`:

- `inspect_quantum_experiment`: `PASS`;
- `evaluate_quantum_call`: `PASS`;
- result: `2/2 PASS` across one case;
- recommendation: `simulate_first`;
- confidence: `high`;
- external authority or provider action: none.

This is a current-runtime native tool trace. The human-controlled consent,
local simulation and evidence-export portion remains in Action 237.

## Cross-surface parity verdict

The repaired parity chain is closed:

1. GitHub identifies the deployed runtime at `938da49`.
2. The R2 archive expands to 24 files whose bytes match its manifest.
3. Vercel and cPanel each pass all 24 public checks and their host-specific
   routing, headers, MIME and configuration-disclosure gates.
4. Chrome proves that the corrected binary assets are usable, not merely equal.
5. cPanel retains an explicit pre-promotion backup.
6. The current official WebMCP inspection/evaluation smoke passes 2/2.

Actions 227–232 therefore pass their evidence gates. This receipt does not
publish a video or submit Devpost. Those remain author-controlled actions.

## Action disposition

| Action | Result | Evidence |
|---:|---|---|
| 227 | `DONE` | Repaired runtime candidate `938da49` |
| 228 | `DONE` | `origin/main` exact runtime SHA at promotion time |
| 229 | `DONE` | Public repository and minimal branch safeguards |
| 230 | `DONE` | Vercel 24/24, browser decode, routing, headers and MIME |
| 231 | `DONE` | cPanel R2 plan/apply, backup, 24/24 and browser decode |
| 232 | `DONE` | GitHub, archive, Vercel and cPanel repaired parity chain |
