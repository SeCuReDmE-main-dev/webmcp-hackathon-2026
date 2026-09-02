# QCG final hardening receipt

Date: 2026-09-01
Status: automated, quantum browser-route and canonical deployment gates PASS;
Companion/F12 reload and release publication gates pending

## Scope

This receipt records the final Day 7 hardening baseline without treating an
automated test result as browser or deployment proof.

## Verified automated baseline

- Application: 10 test files, 61 tests passing.
- Application production build: TypeScript and Vite PASS.
- Application bundle budgets: JavaScript 378.53 kB and CSS 14.38 kB, both
  within the documented limits; QDK WebAssembly is excluded from the JavaScript
  budget.
- QCG Console Companion: package `0.2.4`; manifest, trusted-click,
  snapshot-lifecycle/security and low-glare Light checks PASS.
- Product themes: Dark and Light only. The four seasons remain editorial
  structure rather than application state.

## Verified Chrome quantum routes

- A human-imported Q# Bell fixture compiled, inspected and evaluated to
  `simulate_first`.
- A declared human acceptance created one-use local consent; the Worker
  returned 64 of 64 shots with the Bell invariant satisfied.
- The Q# evidence export records one local simulation, one evidence export and
  zero QPU submissions.
- A human-imported OpenQASM Bell fixture completed the same route after a
  release-discovered whitespace-normalization defect was corrected.
- The OpenQASM evidence export records `openqasm3-qdk`, 64 of 64 shots, a
  satisfied Bell invariant, one local simulation and zero QPU submissions.
- Both JSON receipts exclude raw source, local paths and consent tokens. Their
  hashes and fixtures are retained under
  `evidence/runtime/browser-proof/2026-09-01/`.

## Final hardening decisions

- The imported-artifact path keeps the inspected manifest active and exposes a
  visible evaluation form for target, intent, observable and bounded resources.
- The safe console `evaluate` command and visible controls operate on the same
  active imported manifest.
- The F12 and side-panel surfaces consume one strict sanitized broker; F12 no
  longer depends on `chrome.devtools.inspectedWindow.eval`.
- Snapshot and command-result payloads use allowlists, request correlation and
  tab/session binding. Disconnect and navigation clear stale state.
- Native Gemini handoff remains a manual sanitized copy, preview and import
  path. QCG claims no direct API to Gemini's native DevTools conversation.
- Human decisions are explicit, session-bound interface interactions. QCG
  describes this as declared human authority, not cryptographic identity.
- Neither extension surface can launch simulation, create consent, reach a
  provider or submit work to a QPU.

## Verified canonical deployment

- The final production archive was deployed to `https://qcg.securedme.ca/`
  through the cPanel operator's plan, confirmation and apply flow.
- All eight public files matched the local production build byte for byte.
- The root returned HTTP `200`, `/assets/` rejected directory listing with
  HTTP `403`, and the QDK WebAssembly asset used `application/wasm`.
- The six required isolation, permissions, MIME, referrer, frame and resource
  policy headers all matched their expected values.
- Package, plan, public hashes and claim boundaries are recorded in
  `QCG_FINAL_CPANEL_DEPLOYMENT_RECEIPT_2026-09-01.md`.

## Pending release gates

The following remain pending and must be recorded in separate receipts:

- reload and exercise Companion `0.2.4` in the target Chrome runtime;
- prove Web, F12 and side-panel binding on the same current tab and session;
- prove stale-state clearing after reload and navigation;
- complete clean-clone, release archive, tag and Zenodo software-draft checks;
- receive Jean-Sebastien's explicit approval before Zenodo publication or
  Devpost submission.

Until those remaining gates close, this receipt supports the code, automated
tests, two bounded quantum browser routes and the canonical cPanel deployment.
It does not yet support a current Companion/F12 claim.
