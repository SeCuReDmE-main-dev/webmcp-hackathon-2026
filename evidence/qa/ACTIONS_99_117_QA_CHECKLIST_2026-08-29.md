# Actions 99–117 — Seasonal and DevTools QA checklist

Status: executable checklist; unchecked items are not claims  
Baseline commit: `05843bfd12c46f0b127a7168439575ae6468c1a9`  
Baseline: 18/18 automated tests and passing TypeScript/Vite build

## A. Historical and editorial boundaries

- [x] The published Autumn article tree and its public assets retain their pre-change hashes.
- [x] The Winter article has an independent dated folder and provenance manifest.
- [x] The raw Stitch archive remains local and ignored.
- [x] Public captures come from the functioning application.
- [x] No generated screen with unsupported QPU, provider, signature, price, metric or sponsorship claim is published.
- [x] The canonical Codex disclosure appears once in the Winter manuscript.
- [x] Public narrative uses first-person singular and distinguishes proof, inference, horizon and speculation.

## B. Four-season interface

- [x] Exactly four seasons exist: Autumn, Winter, Spring and Summer.
- [x] Autumn is the initial season and the selection persists in `localStorage`.
- [x] The same semantic DOM, workflow and quantum services operate in every season.
- [x] Season selection works by keyboard and exposes an accessible name and state.
- [x] State meaning uses text and icons in addition to colour.
- [x] Each theme passes the relevant WCAG AA contrast checks.
- [x] `prefers-reduced-motion` removes decorative transitions.
- [x] The workbench remains usable at 320 px, tablet and desktop widths.
- [x] All four seasonal SVGs are decorative, bounded and free of embedded functional text.

## C. Debug-collaboration contracts

- [x] `qcg-debug-message.v1` validates the six permitted message kinds and five declared actors.
- [x] Summary length is bounded to 1,200 characters and evidence references to twelve.
- [x] Unknown fields, duplicate event IDs and invalid state transitions are rejected.
- [x] Evidence references use an allowlist, and recognized high-risk credential, local-path, raw-Q#, stack and network-body patterns are rejected before persistence; the UI also warns participants never to paste secrets or source code.
- [x] The ledger retains no more than 200 messages per session and ten sessions.
- [x] IndexedDB failure leaves the page usable with a clearly reported fallback.
- [x] Agent identities are labelled `declared`; no authenticated-identity claim is made.
- [x] Debug entries cannot create, accept, consume or replay quantum consent.

## D. Third-party DevTools tools

- [x] `read_debug_context` returns bounded, structurally reduced context.
- [x] `post_debug_observation` appends only a valid declared message.
- [x] `request_human_review` creates an open review request without changing quantum state.
- [x] `export_debug_handoff` exports the current collaboration evidence without execution.
- [x] Discovery uses `devtoolstooldiscovery` and `event.respondWith()`.
- [x] Tools remain separate from the four canonical WebMCP quantum tools.
- [x] Discovery and fallback paths preserve the quantum recommendation, consent and effect counters.

## E. QCG DevTools extension

- [x] The unpacked MV3 extension has a valid manifest and `devtools_page`.
- [ ] F12 exposes one panel named `QCG` after manual extension installation.
- [ ] The panel shows participants, messages, artifact manifest, recommendation, reason codes, counters and human-review requests.
- [ ] Actor, kind and state filters work.
- [x] Human message input is bounded and validated.
- [x] The copy action emits bounded context with an explicit review-before-sharing notice.
- [x] The panel offers no consent, simulation or external-execution control.
- [x] Polling occurs only while visible and no faster than every 750 ms.
- [x] The narrow `window.__QCG_DEVTOOLS_V1__` bridge structurally omits raw code, consent values and privileged mutators.

## F. Regression and runtime proof

- [x] All 18 baseline tests remain green.
- [x] New contract, ledger, tool-lifecycle, authority and seasonal tests pass.
- [x] TypeScript and Vite production build pass with the Q# Worker and WASM asset.
- [x] The four WebMCP quantum tools retain progressive registration.
- [x] The human workflow works without WebMCP, the extension or Gemini.
- [ ] One clean clone installs, tests and builds with documented commands.
- [x] One real browser receipt shows the Winter interface and collaboration ledger.
- [x] A protocol proof records a Codex observation, a distinct Gemini-labelled counter-analysis and human acknowledgement; if Gemini was not a live external client, the receipt says so explicitly.
- [x] The quantum recommendation, consent and controlled-effect counters remain unchanged throughout the collaboration proof.

## G. Deployment and public release

- [x] Production files have a release manifest and SHA-256 hashes.
- [x] Deployment uses the SecuredMe cPanel Operator plan/apply path, never SSH.
- [ ] `qcg.securedme.ca` serves the new build with HTTPS, required headers, correct WASM MIME and no directory listing.
- [x] Winter desktop and mobile captures are copied with provenance into the repo and Winter article folder.
- [x] README, getting-started guide, design docs and Devpost draft describe only demonstrated behavior.
- [x] Public artifact scan finds no secret, `.env` value, private path, local correspondence or raw imported Q#.
- [x] Devpost remains a draft and receives no submit action.
- [x] Article publication and final video upload remain Jean-Sébastien author gates.

## Completion rule

An item becomes checked only after its evidence path, command result, browser receipt or author gate is recorded. A structural fixture may prove a contract; it may not be described as a live Gemini exchange unless a separate Gemini client actually participated.
