# Stitch prompt — WebMCP-QCG Winter workbench

Use `docs/design/DESIGN.md` as the binding contract. Generate a complete, editable visual design for the real WebMCP-QCG application. Stitch is a visual reference step: do not publish its generated HTML, do not replace the React prototype, and do not rasterize functional text or controls.

## Product and truth boundary

Design **WebMCP-QCG — WebMCP Quantum Call Gate**, a browser-native human-in-the-loop preflight workbench. It inspects a known Q# artifact, evaluates one bounded recommendation, optionally runs one fixed local Q# Bell fixture only after a visible one-time consent, and exports a reproducible receipt. It has no provider credentials, paid call, QPU submission, arbitrary quantum-code execution, or scientific-interpretation capability.

Use the clickable first-party address [https://qcg.securedme.ca/](https://qcg.securedme.ca/) and status copy `Working browser prototype`. Never imply sponsorship or endorsement by a provider, browser vendor or AI company.

The current engineering receipt is 34 passing Vitest tests in six files on 2026-08-29. Treat it as dated build evidence only. The verified Bell fixture is 64/64 bounded shots, its correlation invariant passed, and the receipt recorded zero external calls. Do not convert these into speed, savings, availability, scientific proof or quantum advantage.

## Exact application shell

Build one shell with exactly these five tabs, in order: `Experiment`, `Agent Review`, `Human Decision`, `Evidence Receipt`, `Activity`. Keep three compact cards visible on every tab: `Artifact Integrity`, `Target Evidence`, `Authority & Effects`.

The first viewport shows: product promise `Decide before quantum execution.`, `Working browser prototype`, WebMCP status (`detected`, `unavailable`, `registering` or `error`), the dated verified fixture line when available, `Open the gate`, and a partial view of the five-scenario deck. Do not reveal a machine decision before invocation. A scenario card may show a **Hypothesis**, never a preloaded observed answer.

## Exactly four tools

Render an `Agent surface` registry that changes calmly as the real state changes:

1. `inspect_quantum_experiment` — available after a valid human-loaded artifact exists; creates a versioned manifest and digest.
2. `evaluate_quantum_call` — available after a valid human-loaded artifact exists; returns exactly one decision, reason codes and one next action.
3. `run_bounded_qsharp_simulation` — visible only for accepted `simulate_first` with unused one-time consent; runs the fixed local Bell fixture in a Worker and disappears after use.
4. `export_quantum_evidence_report` — visible after evidence exists; exports JSON or Markdown without rerunning.

Never add a fifth tool, an `Execute` button, a provider/QPU selector, a fake call counter or an animation that claims work occurred.

## Decisions and fixtures

Support exactly these decisions: `reuse_result`, `reject`, `recompile`, `simulate_first`, `ready_for_external_execution`. Every completed decision includes a text label, icon, explanation, reason-code chips, exactly one next action, manifest/decision identifier, timestamp, invocation source and local/external/paid/QPU counters. The final decision is a report state; show the external stage locked with `human controlled`.

Create five selectable hypothesis cards:

- **Reuse the Fresh Result** — fresh valid evidence can answer without another run.
- **Reject the Unsupported Call** — unsupported requirements should stop at the gate.
- **Recompile for the Target** — a target mismatch needs preparation.
- **Simulate Before Spending** — missing evidence calls for one bounded local simulation.
- **Ready, but Not Authorized** — technical readiness can exist while authority stays locked.

## Tab details

`Experiment` contains a real UTF-8 `.qs` import boundary (128 KiB maximum), Bell sample download, scientific intent, observable, target profile, bounded shots/qubits/timeout inputs, five cards and `Run selected preflight`.

`Agent Review` shows the recommendation, confidence, reason codes, safer alternative, manifest, target, reuse key, expiry and unknowns. `Human Decision` shows Accept, Defer and justified Override. Only an accepted `simulate_first` recommendation creates a visible short-lived consent token. Include local simulation, revoke and Cancel controls only in that state.

`Evidence Receipt` shows receipt schema, artifact digest, human choice, Bell invariant status, receipt digest and export controls. `Activity` shows inspections, evaluations, metadata validations, local simulations, QPU submissions and the source-labelled invocation ledger. Empty, partial, active, completed, cancelled, error and one-step recovery states must be designed, not omitted.

## Winter visual direction and four-theme set

The primary Winter presentation uses ice white, cool blue, cobalt and restrained frosted gold. Translate the approved QCG gate/cube/provenance language into a precise instrument: two gate rails, blue-cyan seam, wireframe evidence cube, sparse provenance connectors, and the rail `TRUST → INSPECT → DECIDE → VERIFY → EXECUTE`, with `EXECUTE` visibly locked.

The product has exactly four selectable presentation themes, with identical structure and behavior:

1. `Autumn — provenance`: graphite/plum, rust, amber, ivory, copper; default presentation.
2. `Winter — clarity`: ice white, cobalt, cool blue, frosted gold; active Day 3–4 direction.
3. `Spring — emergence`: mineral pale base, fresh cyan, leaf green, soft gold.
4. `Summer — signal`: QCG navy, electric blue, cyan, metallic gold.

Do not invent a fifth “dark”, “light”, “premium”, “DevTools” or “marketing” theme. Contrast variants are token adjustments inside one of the four themes. Keep text above atmosphere; no cover as a full-page background, no sponsor/provider logos, no decorative fake telemetry.

## Separate DevTools collaboration surface

Represent Chrome DevTools WebMCP as a separate inspection lane beside the app, not as a sixth tab or a theme. Show the human reviewer, QCG UI, the browser-agent WebMCP surface and the DevTools WebMCP panel connected by one canonical state/evidence flow. DevTools may inspect registration, schema, invocation inputs/outputs, errors and counts. It cannot add tools, bypass consent, edit evidence or unlock external execution. Label every event `human`, `webmcp`, `worker` or `export`.

## Responsive, accessibility and motion

Produce complete states at desktop (1280–1440 px), tablet (768–1199 px) and mobile (320–767 px). Desktop uses a five-tab row and two-column panels; tablet keeps full labels in a scrollable row and stacks panels; mobile preserves semantic order, shows a position cue and keeps security cards and controls reachable. No clipped labels or hover-only information.

Use semantic headings and form labels, tab roles, live status for registration/ledger changes, visible 3 px focus rings, keyboard ArrowLeft/ArrowRight/Home/End navigation, and text plus icons for all states. Include descriptive alt text for meaningful graphics. Honor `prefers-reduced-motion`; keep transitions below 250 ms and never communicate state by animation alone.

## Output and self-audit

Deliver editable desktop/tablet/mobile frames for Winter plus reference frames for the other three themes. Keep all functional copy editable HTML/CSS. Do not export or publish generated HTML, raw screen images, cover art, monograph art, fake metrics, invented dates, provider/QPU assertions or an `Execute` control. Before handoff verify exactly five tabs, four tools, five decisions, five hypotheses, four themes and one separate DevTools inspection architecture.
