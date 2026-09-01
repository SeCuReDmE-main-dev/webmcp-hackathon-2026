![WebMCP-QCG: Quantum Call Gate — Autumn](asset/thumbnail/thumbnail_devpost.png)

# WebMCP Quantum Call Gate

**QCG v3** is a working browser prototype for one decision that should happen
before quantum execution: reuse existing evidence, reject the request, recompile,
simulate locally first, or report that the request is ready for a separately
authorized external system.

It is a human-in-the-loop preflight workbench, not a quantum provider. The
prototype imports a local quantum artifact, derives a byte-exact manifest,
evaluates it against a time-bounded target-profile snapshot, records the human
decision, and exports a reproducible v3 evidence receipt. Q# and OpenQASM 3 have
bounded local execution paths. Eight additional ecosystem profiles are explicit
static-inspection surfaces and can never request simulation or external readiness.

- Stable release URL: [https://qcg.securedme.ca/](https://qcg.securedme.ca/)
- Vercel validation URL: [https://webmcp-qcg.vercel.app/](https://webmcp-qcg.vercel.app/)
- Current public status: the author-approved three-surface QCG Console is live
  on the canonical cPanel origin and synchronized to the stable Vercel validation
  address. The cPanel promotion preserved a rollback backup, verified all 14
  expected paths and matched all 12 content-bearing public files to the local
  production build by SHA-256. See the
  [canonical deployment receipt](docs/evidence/QCG_CPANEL_LIVE_DEPLOYMENT_RECEIPT_2026-08-30.md).
- License: [MIT](LICENSE). Dependency licenses remain with their authors; see
  [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

No QPU submission, paid API, provider credential, or remote quantum job exists
in this MVP. The QPU submission counter is structurally fixed at zero.

## The build in four seasons

The seasons describe how the code matured; they are an editorial map, not
runtime themes. QCG itself deliberately exposes only **Dark** and **Light**.

| Season | Engineering threshold | Evidence trail | Thumbnail |
|---|---|---|---|
| **Autumn — choose** | The broad quantum-router idea became one browser-native call gate with explicit non-goals. | [Initial portfolio](docs/decisions/2026-08-27-initial-portfolio.md) and [progressive four-tool decision](docs/decisions/2026-08-28-progressive-four-tool-browser-gate.md) | Current cover above |
| **Winter — bound** | Tool contracts, five deterministic recommendations, human authority and evidence receipts replaced architectural ambition with inspectable states. | [Browser-native HITL workbench ADR](docs/decisions/2026-08-29-browser-native-hitl-quantum-preflight-workbench.md) | asset/thumbnail/thumbnail_winter.png — in production |
| **Spring — prove** | Functional expansion stopped; Q#, OpenQASM, benchmarks, accessibility and one console across three surfaces became release gates. | [Day 5 feature freeze](docs/decisions/2026-08-30-day5-spring-proof-and-feature-freeze.md) and [console authority ADR](docs/decisions/2026-08-30-qcg-console-redesign-authority.md) | asset/thumbnail/thumbnail_spring.png — in production |
| **Summer — converge** | Web, F12 and Companion now share sanitized evidence while agents contribute and the human remains the decision holder. The remaining work is proof, documentation, video and release QA. | [Day 7 public-safe trace](research/day7/DAY7_PUBLIC_SAFE_TRACE_2026-09-01.md) and [video/A2A/README status](research/day7/DAY7_VIDEO_A2A_README_STATUS_2026-09-01.md) | asset/thumbnail/thumbnail_summer.png — in production |

The complete four-image gallery will be enabled when the Winter, Spring and
Summer assets exist. Keeping the filenames explicit avoids broken public images
while the artwork is still being produced.

## What QCG v3 actually does

1. A human imports a UTF-8 artifact of at most 128 KiB, explicitly selects its
   profile, or selects one of five falsifiable demo cards.
2. QCG computes a SHA-256 digest of the exact bytes and creates a
   `webmcp-qcg.artifact-manifest.v2` manifest with bounded compiler evidence.
3. QCG evaluates scientific intent, observable, requested limits, and one
   frozen target profile. The result is one of five explicit decisions.
4. A human accepts, defers, or overrides the recommendation. An override needs
   a justification. Only an accepted `simulate_first` recommendation creates
   short-lived, one-use consent for local simulation.
5. The pinned `qsharp-lang@1.31.0` runtime can execute the published Q# and
   OpenQASM 3 Bell samples in a Web Worker. Python, C++ and QIR text profiles
   remain static-only. The receipt records effects and keeps QPU submissions at 0.
6. JSON or Markdown evidence can be exported without raw Q#, credentials,
   provider diagnostics, or local filesystem paths. Receipts are also stored
   locally in browser IndexedDB when it is available.

## One console, three surfaces

The redesign branch presents the same bounded state through the web workbench,
the QCG DevTools panel and an installable Chrome/Edge side panel. All three expose
seven explicit views: **Inspector, Console, WebMCP, Decisions, Sources, Receipts,
and Activity**. The left rail changes the center workbench; the right evidence
inspector stays persistent on desktop and becomes a closing drawer on smaller
screens.

The product has exactly two themes: **Dark** and **Light**. Cyan identifies active
technical context in Dark, while emerald gives Light a clearer selected-state
identity. Gold remains human authority and red remains refusal or error. Seasonal
art direction belongs to the editorial series, not the application.

An `Access` panel stores direct-use preferences locally: text size, stronger
contrast, reduced motion and underlined controls. It complements semantic HTML,
keyboard access, labels, action history and receipts; it does not claim to certify
accessibility conformance or replace assistive technology.

## Quick start

From the repository root:

```bash
cd prototype/webmcp-qcg
npm ci
npm test
npm run build
npm run dev
```

Open the local URL printed by Vite. The human interface works without WebMCP.
For the exact setup, sample path, browser modes, and troubleshooting, use the
[getting-started guide](docs/GETTING_STARTED.md).

The checked-in executable samples are
[`qcg-bell-sample.qs`](prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs)
and [`qcg-bell-sample.qasm`](prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qasm).

## Four progressive WebMCP tools

The tools are registered dynamically. A clean page exposes no artifact tool;
the first two appear only after the human has loaded a valid local artifact.

| Tool | When it is available | Effect |
|---|---|---|
| `inspect_quantum_experiment` | After a human-loaded artifact manifest exists | Verifies the artifact identifier and returns its bounded manifest. Raw Q# does not cross the tool contract. |
| `evaluate_quantum_call` | After a human-loaded artifact manifest exists | Returns one recommendation, reason codes, unknowns, confidence, and a safer alternative. It grants no execution authority. |
| `run_bounded_local_simulation` | Only while a valid executable-profile `simulate_first` recommendation has accepted, unused human consent | Consumes consent and runs an approved Q# or OpenQASM Bell sample locally in a Worker. It makes no provider or QPU call. |
| `export_quantum_evidence_report` | After an evaluation has created a v3 receipt | Exports the current receipt as JSON or Markdown without re-evaluating or executing it. |

An evaluation normally makes the export tool discoverable immediately. The
simulation tool appears only for the narrower consented branch and disappears
after its one-use consent is consumed.

## Optional QCG DevTools companion

`companion/qcg-devtools-extension/` contains an unpacked Manifest V3 extension
that creates a local F12 panel named **QCG** and a callable browser side panel.
Both prioritize the sanitized `window.__QCG_CONSOLE_V2__` snapshot and command
envelope, with the older collaboration bridge retained only as a bounded fallback.
They display reduced artifact, recommendation, reason codes, counters, declared
participants, collaboration messages and pending human-review requests. Visible
human buttons may accept, defer or override the active recommendation; simulation
remains website-only and consent tokens never cross the extension boundary.

Four collaboration-only tools are exposed through the official
`devtoolstooldiscovery` event: `read_debug_context`,
`post_debug_message`, `request_human_review`, and
`export_debug_handoff`. They are separate from the four WebMCP quantum tools
and cannot create consent, run simulation, or authorize external execution.
Each write is bound to the active page session. Agent identity is explicitly
**declared**, not authenticated; human and system entries originate in QCG.
Free-text entries are schema-bounded and screened for recognized high-risk
credential, path, source-code, stack and transport patterns. The panel also
warns every participant to keep secrets and source code out of the ledger.

Loading an unpacked extension and opening its F12 panel are manual browser
actions. The application remains fully usable without the extension, Gemini,
or Chrome DevTools MCP. See the
[multi-agent DevTools runbook](docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md).

## Browser modes

- **Human controls:** available in an ordinary modern browser; native tool
  discovery is optional.
- **WebMCP-capable in-app browser:** native tools are available when the page
  receives `document.modelContext.registerTool`.
- **Experimental Chrome WebMCP testing:** use a Chrome build that exposes
  `chrome://flags/#enable-webmcp-testing`, enable the flag, and fully restart
  Chrome. Flag availability is browser-build dependent.

If the WebMCP API is absent or registration fails, QCG reports that state and
keeps the human workflow usable.

## Current verification

The Day 5 QCG working tree was rechecked on 2026-08-30:

- clean `npm ci`: pass, 0 vulnerabilities reported;
- automated tests: 51 passed;
- TypeScript check and Vite production build: pass;
- Q# and OpenQASM Bell execution: pass; eight other profiles remain static-only;
- 320 px, tablet and desktop layouts, seven central views, Dark/Light persistence,
  access preferences, contrast and reduced motion: pass on the local candidate;
- live unpacked QCG F12 panel and four Chrome DevTools MCP collaboration tools:
  pass on one page ID;
- native Gemini conversation access remains manual: export, human transfer,
  preview and schema-validated import;
- E2B campaign: 2.6 million deterministic operations, including two 100-sandbox
  million-operation passes with 100/100 matching digests;
- public canary: 80/80 HTTP 200, zero errors/timeouts, p95 30.825 ms.

The 2026-08-30 stable-origin human smoke compiled and evaluated the published Q#
Bell fixture, produced `simulate_first`, preserved the pending human decision,
and kept local simulations and QPU submissions at zero. A fresh native-agent
invocation and a full author-controlled simulation/export remain separate gates.
See [`evidence/qa/`](evidence/qa/) for dated receipts.

On 2026-09-01, the unpacked extension was reloaded and pinned, and the canonical
QCG page opened the Companion side panel successfully. The narrow Light surface
was also moved to lower-glare sage-mineral neutrals after direct user feedback.
The final recording must still repeat F12, Companion and same-session proof on
the retained tab. See the
[Day 7 Companion trace](research/day7/COMPANION_A2A_AND_LOW_GLARE_TRACE_2026-09-01.md).

## Limits and non-goals

- QCG v3 executes only its bounded Q# and OpenQASM 3 paths. Qiskit, Cirq/TFQ,
  TorchQuantum, PennyLane, CUDA-Q Python/C++, Braket and QIR text are static
  inspection profiles, not execution claims.
- It is not a universal circuit-language converter or multi-provider router.
- The request bounds are at most 256 shots, 8 qubits, and 15 seconds. They bound
  input and policy; they are not generalized capacity or performance claims.
- `ready_for_external_execution` means only that the recorded preflight found no
  blocker under the supplied snapshot. Provider availability, credentials,
  queue state, price, submission, and authorization remain unknown and external.
- Bundled target profiles expire. A stale or unknown profile is rejected rather
  than treated as current evidence.
- IndexedDB receipts are local to the browser profile; there is no account,
  server sync, analytics, or remote persistence.
- Stable-origin evidence is recorded in the
  [live acceptance receipt](evidence/qa/LIVE_ORIGIN_ACCEPTANCE_RECEIPT_2026-08-29.md).
  Future builds must repeat those gates before replacing this release.

## Documentation map

- [Getting started](docs/GETTING_STARTED.md) — install, test, build, run, sample,
  browser setup, workflow, and troubleshooting.
- [Console redesign contract](docs/design/qcg-console-redesign/DESIGN.md) — three
  surfaces, two themes, access preferences, authority and visual boundaries.
- [DevTools multi-agent runbook](docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md) — shared
  page routing, official experimental flags and the extension boundary.
- [Release runbook](docs/RELEASE.md) — release artifact, gates, required headers,
  stable-origin validation, rollback boundary, and open blockers.
- [Canonical cPanel deployment receipt](docs/evidence/QCG_CPANEL_LIVE_DEPLOYMENT_RECEIPT_2026-08-30.md)
  — immutable package, operator transaction, public hashes, headers and live smoke.
- [Threat model](docs/security/QCG_THREAT_MODEL.md) — assets, trust boundaries,
  controls, residual risks, security headers, and deliberate exclusions.
- [`docs/PROJECT_CHARTER.md`](docs/PROJECT_CHARTER.md) — scope and non-goals.
- [`docs/decisions/`](docs/decisions/) — dated architecture decisions.
- [`docs/hackathon-build/`](docs/hackathon-build/) — specification, checklist,
  build notes, and current action registry.
- [`evidence/`](evidence/) — machine-readable receipts and provenance.
- [`evidence/hosting/`](evidence/hosting/) — current read-only hosting baseline.
- [`docs/journal/`](docs/journal/) — public development journal.

- [Day 7 public-safe trace](research/day7/DAY7_PUBLIC_SAFE_TRACE_2026-09-01.md)
  — Summer closure, privacy boundaries and feature-freeze scope.
- [Day 7 video/A2A/README status](research/day7/DAY7_VIDEO_A2A_README_STATUS_2026-09-01.md)
  — current production gates and thumbnail contract.
- [Summer 9/39 source register](research/day7/SUMMER_9_39_SOURCE_REGISTER_2026-09-01.md)
  — thirty exclusive sources routed across nine editorial chapters.

## Governance

- Public construction is not a Devpost submission.
- No QPU, paid API, provider job, or spending action is authorized by QCG.
- Deterministic quantum libraries perform compilation and simulation; an AI
  agent may orchestrate and explain but does not manufacture quantum results.
- No secret, provider credential, private path, Origin Trial token, or private
  correspondence belongs in the repository or an exported receipt.
