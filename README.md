![WebMCP-QCG: Quantum Call Gate](asset/thumbnail/thumbnail_devpost.png)

# WebMCP Quantum Call Gate

Open research and implementation journal for a WebMCP hackathon project.

**WebMCP-QCG** asks a deliberately narrow question before any quantum workload
is executed: should this request reuse existing evidence, be refused, wait for
missing information or consent, or proceed to a bounded local simulation?

The repository preserves the candidate history without pretending every lane
remains active:

| Lane | Status | Current decision |
|---|---|---|
| Quantech Vid | `REJECTED_FOR_THIS_HACKATHON` | Preserved because it was a real candidate, but its video-production scope does not make WebMCP essential. |
| WebCCP | `DEFERRED_BENCH` | Context continuity remains useful above WebMCP, but the data-weight and ingestion-cost model is not mature enough for this hackathon. |
| WebMCP Quantum Connector | `SELECTED_AS_QCG` | The selected direction combines a preflight gate, capability routing and a reproducible evidence packet. |

## Selected direction

**WebMCP Quantum Call Gate + capability adapters + reproducible evidence packet**

The browser page exposes small, non-overlapping tools. A deterministic preflight
engine inspects the request, evidence freshness, target compatibility, local
resource bounds and authorization before any effectful adapter is eligible to
run. Framework-native payloads remain native; the project does not claim a
universal quantum language.

The first browser vertical slice is now executable. A WebMCP-capable browser
discovered and invoked the gate, a Q# Web Worker loaded pinned
`qsharp-lang@1.31.0`, and the bounded Bell fixture completed 64/64 correlated
shots. The evidence receipt records one local simulation, a passing Bell
invariant and zero external provider calls.

No QPU, paid API or remote quantum job has been invoked.

## Run the prototype

Requirements: Node.js 20+ and npm.

```bash
cd prototype/webmcp-qcg
npm ci
npm test
npm run dev
```

Open the displayed local URL in ChatGPT's in-app browser, which supports WebMCP,
or in Chrome 149+ after enabling
`chrome://flags/#enable-webmcp-testing` and restarting Chrome. The application
remains fully usable through its human controls when WebMCP is unavailable.

Create a production bundle with:

```bash
npm run build
```

## Four progressive tools

| Tool | Availability | Purpose |
|---|---|---|
| `inspect_quantum_experiment` | initial | Create a versioned manifest and digest. |
| `evaluate_quantum_call` | initial | Return one decision, reason codes and a next action. |
| `export_quantum_evidence_report` | after evidence exists | Export a bounded JSON or Markdown receipt. |
| `run_bounded_qsharp_simulation` | only after `simulate_first` plus visible one-time consent | Run the fixed local Q# Bell fixture in a Web Worker. |

The five possible decisions are `reuse_result`, `reject`, `recompile`,
`simulate_first` and `ready_for_external_execution`. External readiness is a
report state; it grants no provider authorization.

## Verified Day 3 proof

- Native WebMCP invocations: inspection, evaluation, simulation and export.
- Human authorization event: one visible, one-time consent.
- Q# shots: 64 requested, 64 completed.
- Outcomes: 33 `[One, One]`, 31 `[Zero, Zero]`.
- Bell invariant: pass.
- Local simulations: 1.
- External provider, paid and QPU calls: 0.
- Automated tests: 11 passing.
- Clean production build: passing.

The machine-readable receipt is
[`evidence/browser/qcg-native-browser-proof-2026-08-28.json`](evidence/browser/qcg-native-browser-proof-2026-08-28.json).

## Repository map

- `docs/PROJECT_CHARTER.md` — scope and non-goals.
- `docs/IDEA_PORTFOLIO.md` — three candidate lanes and their status.
- `docs/decisions/` — dated decisions and reversibility conditions.
- `docs/hackathon-build/` — current scope, specification, checklist and build notes.
- `docs/ideas/` — one dossier per candidate.
- `research/webmcp/` — preserved WebMCP/CCP reconnaissance and source registry.
- `research/quantum/` — current four-surface quantum research.
- `evidence/SOURCE_MANIFEST.md` — provenance and hashes for imported research.
- `experiments/` — bounded executable probes and their commands.
- `evidence/` — machine-readable receipts and source provenance.
- `docs/journal/` — public day-by-day development journal.
- `prototype/` — selected implementation surface as it becomes verified.
- `devpost-submission.md` — working submission copy; explicitly unsubmitted.

## Governance

- Public repository and open construction journal; public visibility is not a
  Devpost submission.
- WebMCP upstream remains external and read-only.
- No QPU, paid API or provider job is launched without a separate explicit authorization.
- An AI agent may orchestrate and explain; deterministic quantum libraries own calculations and validation.
- A rejected idea remains documented so the decision can be audited or revisited.
- No secret, account credential, Origin Trial token or private email belongs in this repository.

## Current status

- Day 2 field report and Day 4 working draft: available in `docs/journal/`.
- QDK public-package spike: passed on Node/WASM.
- Q# browser Worker: passed with 64/64 bounded shots.
- Native WebMCP invocation: passed in ChatGPT/Codex's in-app browser.
- External Chrome: human fallback passed; native testing awaits the Chrome 149+
  WebMCP flag and restart.
- Stable public deployment: pending authenticated hosting.
- Devpost project `1404828`: `submission_draft`; not submitted.
- License: MIT. Third-party packages retain their own licenses and notices.
