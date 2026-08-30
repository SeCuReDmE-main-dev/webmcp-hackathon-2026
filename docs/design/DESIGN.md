# WebMCP-QCG design contract — Day 5 Spring proof candidate

## Scope and authority

This is the canonical visual and interaction contract for the WebMCP-QCG browser workbench. The runnable authority is `prototype/webmcp-qcg`; this document describes how to present that behavior, not how to add behavior. The public destination is [qcg.securedme.ca](https://qcg.securedme.ca/), and the repository is [SeCuReDmE-main-dev/webmcp-hackathon-2026](https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026).

The product line is **Decide before quantum execution.** QCG is a browser-native preflight gate: it inspects a bounded quantum artifact, evaluates one deterministic recommendation, optionally runs an approved Q# or OpenQASM 3 Bell fixture after visible one-time consent, and exports a reproducible receipt. Eight additional ecosystem profiles are static inspection surfaces. Provider credentials, paid calls, QPU submission, arbitrary Python/C++/QIR execution, and scientific interpretation are outside the product boundary.

The interface is evidence-led and human-in-the-loop. Human controls and WebMCP tools call one service layer and update one canonical state. A visual treatment can make a state legible; it cannot invent a state.

## Verified product contract

The current app has exactly five top-level tabs, in this order:

1. `Experiment` — import a supported UTF-8 artifact (128 KiB maximum), explicitly choose its profile, edit bounded inputs, select one of five fixtures, inspect.
2. `Agent Review` — show the recommendation, confidence, reason codes, safer alternative, manifest and expiry.
3. `Human Decision` — accept, defer, or justified override; accepted `simulate_first` creates one short-lived consent token.
4. `Evidence Receipt` — show the bound receipt and export JSON or Markdown without rerunning.
5. `Activity` — show effects, progressive tool registration and the invocation ledger.

Keep these three security cards visible across every tab: `Artifact Integrity`, `Target Evidence`, and `Authority & Effects`.

Exactly four progressive tools exist:

| Tool | Registration rule | Product effect |
| --- | --- | --- |
| `inspect_quantum_experiment` | after a valid human-loaded artifact exists | Creates a versioned manifest and digest. |
| `evaluate_quantum_call` | after a valid human-loaded artifact exists | Returns exactly one decision, reason codes and one next action. |
| `run_bounded_local_simulation` | only during accepted executable-profile `simulate_first` consent | Runs an approved Q# or OpenQASM Bell fixture in a Worker. |
| `export_quantum_evidence_report` | after evidence exists | Exports the current bounded receipt. |

The five deterministic fixture hypotheses map to `reuse_result`, `reject`, `recompile`, `simulate_first`, and `ready_for_external_execution`. The final value is a report state only; it is never permission. There is no `Execute` button, provider selector, QPU claim, or hidden execution path.

The current repository test command is `npm test` (`vitest run`). On 2026-08-30 the Day 5 checkout returned 41 passing tests and a passing TypeScript/Vite build. This is a dated engineering receipt, not a provider, quantum-advantage or universal-compatibility claim. The visible app may show this number only with its receipt date and source link.

The profile selector exposes exactly ten profiles. `qsharp-qdk` and `openqasm3-qdk` can compile and simulate within the bounded Worker. Qiskit Python, Cirq/TFQ Python, TorchQuantum Python, PennyLane Python, CUDA-Q Python/C++, Braket Python and QIR text are labelled `static_only`; they can inspect and create evidence but cannot return `simulate_first` or `ready_for_external_execution`.

## Four themes — exactly four

These are four presentation themes, not four product modes. Every theme keeps the same five tabs, fields, controls, labels, state machine, and accessibility contract. Theme selection never changes behavior. Contrast variants within a theme are token values, not additional themes.

### 1. Autumn — provenance

Use deep plum/graphite surfaces, rust and amber accents, ivory text and copper evidence lines. This is the default theme and emphasizes review, reason codes, ledger entries and exported receipts. The existing Autumn article source is read-only reference; do not modify or regenerate it from this handoff.

### 2. Winter — clarity

Use ice white, cool blue, cobalt and a small amount of frosted gold. This is the active Day 3–4 editorial direction. Make the gate rails crisp, the evidence cube geometric, and provenance lines hairline-thin. Winter is clarity and boundedness, not a claim about the season in which an event occurred.

### 3. Spring — emergence

Use a pale mineral base, fresh cyan, soft leaf green and restrained warm gold. The gate seam is a clear beginning; the evidence cube uses thin mint/cyan edges. Use for teaching, first inspection and a calm empty state. Never imply that “spring” means a new scientific result.

### 4. Summer — signal

Use the QCG master navy, electric blue, cyan and metallic gold from the approved thumbnail/cover language. Use for a signal-rich workbench and judge-facing demonstration. Dense information remains calm: flat panels, strong grid, no ornamental star field behind text.

## Visual grammar

- **Gate:** two rails, a blue/cyan seam, and a five-stage rail `TRUST → INSPECT → DECIDE → VERIFY → EXECUTE`. The last stage is visibly locked and labelled `external — human controlled`.
- **Evidence cube:** a small wireframe cube or folded square that represents a digest/receipt. It is a motif only; it must not look like a live QPU or imply 3-D computation.
- **Provenance lines:** sparse connectors between artifact, target snapshot, decision, human choice and receipt. Label source (`human`, `webmcp`, `worker`, `export`) in text.
- **State color:** never use color alone. Every decision has a text label, reason-code text and an icon. Avoid pulsing, casino-like success effects and animated counters.
- **Typography:** high-legibility sans for controls and body, a restrained monospace for identifiers and reason codes, sentence case for explanations, uppercase only for short section eyebrows.
- **Geometry:** one 1280 px maximum workbench, 8 px spacing rhythm, visible 1 px borders, 12–16 px panel radii, and a primary reading column no wider than 75 characters.

## Page composition

The first viewport must show the promise, `Working browser prototype`, WebMCP registration state, the verified fixture line (`64/64 bounded Bell shots · invariant passed · 0 external calls` when that receipt is present), an `Open the gate` action, and a visible edge of the five-scenario deck. Keep the hero short enough that the app reads as an instrument, not a marketing splash page.

Header identity is `SecuredMe / WebMCP-QCG`; secondary links are `How it works`, `Boundaries`, and `Source`. Do not show sponsor/provider logos or imply endorsement by OpenAI, Chrome, Microsoft, IBM, NVIDIA or a quantum provider.

The Experiment tab contains the real-file drop zone, Bell sample download, bounded intent/observable/target/limits, five scenario cards and `Run selected preflight`. The card shows a **Hypothesis** and expected branch; it must not preload the actual machine decision into the DOM.

Agent Review presents one recommendation and its evidence boundary. Human Decision presents `Accept`, `Defer` and `Override` (override requires a 12-character justification), plus local simulation, revoke-consent and cancellation states when applicable. Evidence Receipt presents digest-bound fields and JSON/Markdown export. Activity presents counters and the source-labelled ledger.

## Separate DevTools collaboration architecture

DevTools is an inspection and collaboration surface, not another product theme and not an execution authority. Keep this architecture separate from the app's five-tab navigation:

```text
Human reviewer
    │ visible choice, consent, revoke, export
    ▼
QCG UI ─────── one canonical QcgServices state ─────── WebMCP browser agent
    │                                                     │ discover/invoke
    │                                                     ▼
    └────────────── bounded evidence + source labels ─── DevTools WebMCP panel
                                                          │ inspect schema,
                                                          │ registration,
                                                          │ inputs/outputs,
                                                          │ errors and counts
                                                          ▼
                                                   human review / receipt
```

The UI and agent call the same service functions. DevTools may inspect registration, schemas, invocation input/output, errors and source; it may not add a quantum tool, bypass consent, edit the receipt, or unlock external execution. Four collaboration-only tools (`read_debug_context`, `post_debug_message`, `request_human_review`, `export_debug_handoff`) expose the sanitized ledger through Chrome DevTools MCP. Codex, Gemini CLI/Code Assist or Antigravity can target one page ID through that lane. Chrome's native Gemini DevTools conversation has no documented write API: QCG supports only a human-mediated export, preview and schema-validated import for that surface. Keep raw quantum source out of compact agent results and never expose credentials or local paths.

## Responsive and full-state contract

Design each required state as a complete desktop, tablet and mobile screen, not as a desktop screenshot scaled down:

| Width | Layout |
| --- | --- |
| Desktop 1280–1440 px | Header, three-card security rail, five-tab row, two-column panels, five-card scenario deck. |
| Tablet 768–1199 px | Full labels in a horizontally scrollable tab row, stacked primary panels, two-column or wrapped scenario deck. |
| Mobile 320–767 px | Same semantic order, scrollable tab row with position cue, one-column cards, persistent security cards, no clipped controls. |

Provide empty/partial/active/completed/cancelled/error/recovery states for every tab. In particular: no recommendation before invocation; no receipt before evidence; consent visibly expires, can be revoked and is consumed once; cancellation returns safely to review; errors have a one-step recovery action. `ready_for_external_execution` always retains the locked external stage.

Keyboard users can reach every control, move through tabs with ArrowLeft/ArrowRight/Home/End, and see a 3 px focus ring. Use real headings, labelled form fields, `role=tablist`/`role=tab`/`role=tabpanel`, live status for registration/ledger updates, and descriptive alternative text for every non-decorative graphic. Respect `prefers-reduced-motion`; transitions stay under 250 ms and never carry meaning alone.

## Asset and Stitch policy

`asset/.stitch/stitch_webmcp_quantum_call_gate.zip` is a local archival source (110,473,513 bytes; SHA-256 `3C87306793E161F864701A5E0D7561539A17A6D58B035F5BFCDBCF4E5040FF92`). It remains ignored by Git. The 113 screen images were triaged in `docs/design/STITCH_ASSET_TRIAGE.md`.

Stitch output is reference material. Do not copy raw screens into public asset folders and do not publish generated HTML. Any adopted idea must be redrawn as accessible, editable UI against this contract. Covers and monograph assets belong to Jean-Sébastien and are not generated by this lane.

## Acceptance gate

The handoff is accepted only when:

- the UI still has exactly five tabs, four progressive quantum tools, four separate collaboration tools, five hypotheses and five decisions;
- all four themes preserve the same behavior and information hierarchy;
- DevTools collaboration is shown as inspection/provenance, separate from product authority;
- no generated HTML, fake metrics, `Execute` control, provider/QPU claim or invented date appears;
- gate, cube and provenance motifs support comprehension without becoming decoration;
- desktop/tablet/mobile/full states and keyboard/reduced-motion behavior are specified;
- the Stitch ZIP remains intact and ignored; no raw screen is copied to a public folder.
