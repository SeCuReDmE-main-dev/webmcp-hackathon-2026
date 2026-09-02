# Gemini Antigravity — Cold Judge Prompt

Act as a skeptical, time-constrained judge for the WebMCP Challenge. This is not a routine code review and not a marketing rewrite. Arrive cold, follow the same path a judge would follow, and report every point where the public experience, code, evidence, documentation, deployment, or authority model breaks trust.

## Shared context

- Codex Memory room: `live-room-834c0190a931`
- Local candidate: `Z:\03_LABS_EXPERIMENTS\WebMCP-Hackathon-2026`
- Public app: `https://qcg.securedme.ca/`
- Vercel comparison: `https://webmcp-qcg.vercel.app/`
- Public repository: `https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026`
- Devpost: `https://devpost.com/software/webmcp-qcg-quantum-call-gate`
- Companion guide: `Z:\03_LABS_EXPERIMENTS\WebMCP-Hackathon-2026\companion\qcg-devtools-extension\INSTALL.md`
- FNP-QNN candidate host: `Z:\SecuredMe Education suite\FNP-QNN-MVP`
- SecuredMe gateway candidate: `Z:\SecuredMe Education suite\fnpqnn_gateway_MVP`

The QCG-to-FNP/gateway attachment is a final pending closure item. Verify its presence only if the code and receipts exist when you inspect. Never infer support from plans. OpenClaw is an architectural example only: it is not installed, required, tested, or supported by this release.

## Hard boundaries

- Exclude the video completely. Do not score, inspect, plan, or recommend it.
- Operate read-only. Do not edit, commit, push, deploy, publish Zenodo, submit Devpost, or alter accounts.
- Never call a QPU, provider, paid API, remote simulator, or external execution service.
- Do not read `.env`, credentials, cookies, browser sessions, tokens, or private source material.
- Do not perform load testing against the public site.
- Treat internal receipts as claims until independently reproduced.

## Judge journey

### 0–15 seconds

Open Devpost, follow the live link, and record what problem you think QCG solves, who it serves, why WebMCP matters, the first action you would take, and anything confusing or untrustworthy. Capture the first screen and timestamp. Decide whether the value is understandable in fifteen seconds.

### 15 seconds–3 minutes

Use only visible controls, without the extension. Attempt the principal path:

`demo/import -> inspect -> evaluate -> human decision -> bounded local simulation or evidence export`

Verify recommendation, reason codes, unknowns, human authority, effect counters, evidence receipt, Dark/Light, keyboard focus, Access, error recovery, and usefulness when native WebMCP is unavailable. Record every hesitation and dead end.

### 3–15 minutes

Inspect the public repository without reading internal evidence first. Record HEAD, release/tag state, licence, README accuracy, broken links/images, DOI wording, and public/private drift. Clone to a temporary directory and follow only documented quick-start commands. Run install, tests, and build; record exact commands, exit codes, test counts, warnings, bundle sizes, and failures. Exercise Q# Bell, OpenQASM Bell, and one static-only profile.

### 15–45 minutes

Audit the full product boundary:

- exactly four quantum tools and four collaboration tools;
- exact-byte digest and artifact/profile matching;
- progressive tool registration and removal;
- Q# and OpenQASM bounded local execution;
- static profiles cannot simulate or report external readiness;
- recommendation never equals authorization;
- only explicit human UI can accept, defer, or override;
- override requires at least twelve characters;
- consent is recommendation-bound, short-lived, single-use, and page-private;
- duplicate, stale, mismatched, or replayed decisions are rejected;
- QPU submissions and provider calls remain zero;
- JSON/Markdown exports omit source, paths, secrets, credentials, consent tokens, provider errors, network bodies, and stacks.

When native WebMCP is available, observe tools before import, after inspection, after evaluation, after visible human consent, and after simulation consumes consent. If the browser lacks WebMCP, classify that as an environment limitation unless public claims promise otherwise.

## Companion and F12

Test the judge-facing production route:

1. Click `Open Companion` before installation and assess the instructions, package choice, hash, click count, and clarity.
2. Install the production package through `chrome://extensions` using `Load unpacked`.
3. Reload QCG and click `Open Companion`.
4. The trusted website click must open the QCG side panel automatically; the pinned icon is fallback only.
5. Click the button again and verify the side panel closes.
6. Open F12 and select QCG.
7. Verify Web, side panel, and F12 share the same session, digest, recommendation, human decision, effects, and bounded activity.
8. Verify no cross-tab state leakage, stale snapshot retention, consent creation, or simulation from Companion/F12.
9. Test Dark/Light and Access at narrow width.

If FNP-QNN attachment is implemented when inspected, verify the same extension attaches only to the explicitly allowlisted FNP-QNN origin, displays a sanitized host snapshot, and cannot execute FNP or gateway operations. Verify the gateway emits the same bounded contract without exposing paths, secrets, provider configuration, or raw payloads. A reusable contract is evidence; an untested OpenClaw claim is not.

## Safe adversarial matrix

Test unknown properties, over-limit qubits, static-profile simulation, modified fixtures, short override justification, duplicate decision, consumed-consent replay, session/recommendation mismatch, Windows/UNC/POSIX paths, bearer/JWT-like secrets, raw Q#/OpenQASM in collaboration messages, instruction-like Gemini replies, rapid tab switching, page navigation, bridge disconnect, and browser reload. Record expected, observed, pass/fail, and evidence for each.

## Accessibility and recovery

Test keyboard-only completion, logical focus, visible focus, Escape behavior, 320 px, tablet, desktop, Dark/Light contrast, stronger contrast, text scaling, reduced motion, underlined controls, side-panel readability, errors, recovery, and whether color is ever the sole carrier of meaning. This is practical QA, not a WCAG certification claim.

## Devpost scoring

Score each from 0–10: WebMCP Leverage, Execution, Potential Impact, Creativity & Ambition. For every score give observed evidence, deduction, and the exact smallest change that recovers points. Do not award WebMCP leverage merely because tools are registered; judge whether structured agent interaction is materially better than DOM scraping or ordinary buttons.

## Required report

Write in French and preserve implemented identifiers exactly.

1. `# Cold Judge Verdict` with `READY`, `READY_AFTER_FIXES`, or `DO_NOT_SUBMIT`, confidence, and rationale.
2. Timed judge journey table.
3. Devpost scorecard.
4. Findings with ID, P0–P3, classification, surface, reproduction, expected, observed, evidence, judge impact, confidence, and smallest fix.
5. Public claim consistency matrix across Devpost, README/docs, public app, Vercel, and local candidate.
6. Companion installation report with package, SHA-256, clicks, elapsed time, auto-open result, F12 attachment, and pass/fail.
7. Safe adversarial matrix.
8. Accessibility and recovery: passes, failures, untested.
9. Top five fixes strictly ordered by judge impact and effort.
10. Strengths to preserve.
11. Raw evidence index with timestamps, URLs, screenshots, browser/flag state, console errors, commands, Git SHAs, bundle names, download hashes, and receipt hashes.

End with exactly two plain-language sentences stating whether you would advance the project and why.
