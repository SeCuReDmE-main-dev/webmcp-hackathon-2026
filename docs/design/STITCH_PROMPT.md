# Stitch Prompt — WebMCP-QCG Quantum Call Gate

Use the attached `DESIGN.md` as the binding product, interaction, truth, accessibility, and visual contract. Use the supplied QCG visual reference, but keep every functional word, control, decision, counter, and evidence field as editable HTML/CSS.

Create a complete premium responsive product design for:

`WebMCP-QCG — WebMCP Quantum Call Gate`

Planned canonical destination:

`https://qcg.securedme.ca/`

Repository:

`https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026`

The domain is the selected target and has passed an availability check. Treat it as the design destination, while keeping public status copy at `Working browser prototype` until live hosting is verified.

## Product truth

WebMCP-QCG is a working browser-native preflight gate. It inspects a known quantum experiment artifact, evaluates whether the request should reuse evidence, stop, recompile, simulate locally, or become ready for a later human-controlled external workflow, and exports a reproducible receipt.

The verified MVP has:

- four progressive WebMCP tools;
- one canonical state shared by human controls and browser agents;
- a pinned `qsharp-lang@1.31.0` WebAssembly runtime in a Web Worker;
- a fixed bounded Bell fixture;
- 64 of 64 completed shots;
- a passing Bell correlation invariant;
- one local simulation;
- zero external provider calls;
- zero paid calls;
- zero QPU calls;
- eleven passing automated tests and a passing production build.

Present those values as one verified fixture, never as generalized performance, savings, provider support, scientific proof, or quantum advantage.

Primary line:

`Decide before quantum execution.`

Supporting line:

`Inspect the request, return one bounded decision, simulate locally only when the evidence calls for it, and export the receipt before any external quantum work.`

## Critical interaction instruction

This is an executable scientific workbench, not a conventional marketing landing page.

The first viewport must show:

- the product promise;
- working-prototype status;
- WebMCP registration status;
- the verified zero-external-call fixture;
- an `Open the gate` action;
- a visible hint of the five-scenario workbench.

The actual machine-verifiable decision must remain absent before invocation. Scenario cards may state a hypothesis but cannot reveal or preload the actual answer in the DOM.

Human controls and WebMCP tools act on the same visible state. Show invocation provenance as `human`, `webmcp`, `worker`, or `export`.

## Four progressive tools

Design a compact `Agent surface` registry that accurately shows current availability:

1. `inspect_quantum_experiment`
   - initially available;
   - creates a versioned manifest and digest.

2. `evaluate_quantum_call`
   - initially available;
   - returns one decision, reason codes, and one next action.

3. `run_bounded_qsharp_simulation`
   - appears only after `simulate_first` and unused visible one-time consent;
   - runs the fixed local Bell fixture;
   - disappears after consent is consumed.

4. `export_quantum_evidence_report`
   - appears after evidence exists;
   - exports JSON or Markdown without rerunning the experiment.

Show tool registration changes as calm state updates, not as gaming animations.

## Five decisions

The decision surface supports exactly:

- `reuse_result`
- `reject`
- `recompile`
- `simulate_first`
- `ready_for_external_execution`

Each completed decision needs:

- a text label and icon;
- a plain-language explanation;
- reason-code chips;
- exactly one next action;
- manifest or decision identifier;
- timestamp and invocation source;
- local, external, paid, and QPU call counters.

`ready_for_external_execution` is a report state only. It grants no permission. Keep the external execution stage locked and label it `human controlled`.

## Five falsifiable scenario cards

Create a scenario deck with:

1. **Reuse the Fresh Result**
   - hypothesis: fresh valid evidence can answer without another run.

2. **Reject the Unsupported Call**
   - hypothesis: unsupported requirements should stop at the gate.

3. **Recompile for the Target**
   - hypothesis: a target mismatch needs preparation before execution.

4. **Simulate Before Spending**
   - hypothesis: missing evidence should trigger one bounded local simulation.

5. **Ready, but Not Authorized**
   - hypothesis: technical readiness can exist while external authority remains locked.

Each card must visibly say `Hypothesis`. The observed result may differ. Do not make the card styling imply that the hypothesis is guaranteed.

## Required page architecture

### 1. Header

Include:

- text identity `SecuredMe / WebMCP-QCG`;
- navigation: Gate, Scenarios, Evidence, How it works, Boundaries, Source;
- status pill: `Working browser prototype`;
- WebMCP status: detected, unavailable, registering, or error;
- dark/light theme control;
- CTA: `Open the gate`.

Do not show sponsor or provider logos. Do not imply endorsement by OpenAI, Chrome, Microsoft, IBM, NVIDIA, or any quantum provider.

### 2. Hero gate

Required hierarchy:

- eyebrow: `WebMCP-native quantum preflight`
- H1: `Decide before quantum execution.`
- one concise supporting sentence;
- primary CTA: `Open the gate`;
- secondary CTA: `View verified proof`;
- tertiary link: `Inspect source`;
- verified fixture: `64/64 bounded Bell shots · invariant passed · 0 external calls`.

Create a restrained visual threshold on the right using two gate rails, a luminous blue-cyan seam, a geometric evidence cube, fine constellation/provenance lines, and this five-stage rail:

`TRUST → INSPECT → DECIDE → VERIFY → EXECUTE`

Make `EXECUTE` visibly locked and annotate it `external — human controlled`.

Do not reproduce the full cover as a background. Translate its gate and evidence language into functional interface geometry.

### 3. Gate workbench

Desktop:

- left: five-scenario deck;
- center: inspection and decision surface;
- right: agent surface, counters, and recent invocation ledger.

Keep one clear primary action at a time.

The center panel should evolve through:

- empty;
- inspecting;
- inspected;
- evaluating;
- decision revealed;
- awaiting consent;
- simulating;
- completed;
- cancelled;
- error with recovery.

### 4. Inspection panel

Show:

- artifact name and ID;
- target;
- requested bounds;
- evidence age;
- digest status;
- `Inspect` action;
- manifest ID after completion.

Do not show raw quantum code, credentials, provider internals, private paths, or secrets.

### 5. Decision plaque

Before evaluation, show the inputs and hypothesis while keeping the actual decision absent.

After evaluation, reveal:

- exactly one decision;
- reason-code chips;
- exactly one next action;
- evidence identifiers and provenance;
- updated counters.

The gate may open, remain closed, or redirect visually according to the result. Keep the transition fast, accessible, and subtle.

### 6. Consent and local simulation

Only for `simulate_first`, show a one-time consent panel:

- `Fixed two-qubit Bell fixture`
- `Q# WebAssembly Worker`
- `1–256 bounded shots`
- `1–8 bounded qubits`
- `500–15000 ms timeout`
- `0 network/provider/QPU calls`
- CTA: `Grant one-time local consent`.

After consent, show:

- CTA: `Run bounded local simulation`;
- `Cancel` during execution;
- progress with completed shots;
- correlated outcome histogram;
- Bell invariant status;
- notice that consent was consumed.

Never add a provider submission or external execution button.

### 7. Evidence receipt and ledger

Make evidence a primary product surface.

Show:

- evidence packet summary;
- decision and reason codes;
- manifest, decision, run, and evidence IDs where present;
- local simulations;
- external provider calls;
- paid calls;
- QPU calls;
- Bell invariant and outcomes when present;
- `Export JSON`;
- `Export Markdown`;
- recent invocations with source, tool, status, summary, and time.

Keep raw JSON behind a disclosure. The initial view must be readable without decoding schemas.

### 8. How it works

Create four concise, connected steps:

1. Inspect the artifact.
2. Evaluate the call.
3. Simulate locally only when evidence requires it.
4. Export the receipt for a human-controlled next step.

Associate each step with the appropriate WebMCP tool and human control.

### 9. Boundaries

Create a calm trust-contract section containing:

- external execution remains locked;
- local simulation is bounded and cancellable;
- consent is visible, one-time, and consumed;
- strict schemas refuse unknown properties;
- raw code and secrets stay outside the tool contract;
- readiness remains separate from authorization;
- every invocation records provenance;
- the human interface works when WebMCP is absent.

### 10. Footer

Include:

- WebMCP-QCG;
- SecuredMe;
- repository link;
- MIT license;
- planned route `qcg.securedme.ca`;
- status `Working browser prototype`;
- line: `No QPU, paid API, or external quantum job is part of this MVP.`

## Visual direction

Use the attached `asset/thumbnail/thumbnail_devpost.png` and the first QCG article cover as the visual authorities.

Translate their design language into a premium scientific control room:

- deep navy and near-black for the decision chamber;
- electric blue and cyan for computation, registration, and simulation;
- metallic gold for trust, decisions, selected scenarios, and verified evidence;
- ivory for editorial warmth and readable major type;
- a gate for authorization boundaries;
- a cube for versioned evidence;
- lattice and constellation lines for provenance and dependencies.

Keep the visual atmosphere behind the interface hierarchy. The design should feel precise, evidence-led, calm, and memorable.

Avoid:

- generic AI robots or brains;
- fake QPU hardware photography;
- random equations used as decoration;
- crypto, casino, game, steampunk, or fantasy-portal styling;
- animated star-field backgrounds;
- overuse of glow;
- gold body text at small sizes;
- giant empty marketing sections;
- cards nested inside cards;
- sponsor or partner strips;
- fake testimonials or metrics;
- provider selection controls;
- an external Execute button.

## Binding palette

Dark master:

- Gate Black `#02060B`
- Void Navy `#000D1C`
- Archive Navy `#011A35`
- Panel Navy `#071F36`
- Cool Border `#183E62`
- Quantum Blue `#0878D8`
- Signal Cyan `#20C8FF`
- Gate Gold `#E8A838`
- Bright Gold `#FFC857`
- Editorial Ivory `#FFF0C2`
- Cool White `#EAF5FF`
- Muted Steel `#9CB4C8`

Light twin:

- Parchment `#FFF9ED`
- Ice Surface `#F3F9FF`
- Deep Ink `#071629`
- Navy Text `#102D4C`
- Light Border `#C9D9E8`
- Royal Blue `#0867B7`
- Deep Cyan `#006B8F`
- Burnished Gold `#8A5700`
- Warm Rule `#D9A43A`

States:

- Pass `#65D895`
- Warning / consent `#F2B94B`
- Reject / error `#FF7483`
- Information `#59BFFF`
- Locked `#A8B4C0`

Use text and icons with every state color. Use cyan for agent/computation/focus and gold for trust/decision/evidence.

Treat bright cover colors as accents and fills rather than default small-text colors. Use Gate Black on gold controls, Editorial Ivory or Cool White on dark surfaces, and the darker light-theme cyan/gold tokens for text on parchment or ice.

## Typography and component style

- Hero and major section openings: `Cormorant Garamond` or equivalent editorial serif.
- Interface and body: `Inter` or `Manrope`.
- Code, IDs, schemas, and reason codes: `IBM Plex Mono`.
- Use the serif sparingly; controls remain sans-serif.
- Card radius: 8–12 px.
- Use fine gold rules and occasional clipped corners for gate panels.
- Keep minimum body size at 16 px.
- Keep targets at least 44 × 44 px.
- Maximum content width: 1440 px.

## Responsive and accessibility requirements

- Produce desktop dark and light masters at 1440 px.
- Produce mobile dark and light masters at 390 px.
- Ensure a readable 320 px layout.
- Preserve semantic heading order.
- Make the whole workflow keyboard operable.
- Use a visible cyan focus ring plus high-contrast outline.
- Support `prefers-reduced-motion`.
- Use `aria-live` behavior for registration, invocation, cancellation, and results without repeated chatter.
- Never depend on color alone.
- Keep consent separate from simulation.
- Keep the human workflow complete when WebMCP is unavailable.
- Do not use floating controls that cover workbench actions.

## Required Stitch outputs

Return one coherent Stitch project with:

1. desktop dark master;
2. desktop light twin;
3. tablet workbench;
4. mobile dark master;
5. mobile light twin;
6. empty pre-invocation state;
7. one state for each of the five decisions;
8. `simulate_first` consent state;
9. active simulation and cancellation state;
10. completed Bell evidence state;
11. WebMCP unavailable human-fallback state;
12. component and token summary;
13. implementation-ready handoff assets.

## Self-audit before finalizing

Reject the output if:

- it looks like a future concept instead of a working browser prototype;
- the gate is decorative rather than tied to the state machine;
- WebMCP is hidden or appears optional to the demonstrated agent path;
- the actual decision is present before invocation;
- the four tools or progressive registration rules are inaccurate;
- local simulation appears without visible one-time consent;
- external execution appears available;
- readiness looks like authorization;
- the 64-shot fixture becomes a generalized claim;
- the invocation ledger or provenance disappears;
- the visual identity stops resembling the navy, blue-cyan, gold, ivory QCG cover language;
- atmosphere reduces text, focus, or control readability;
- functional text is baked into images;
- dark and light versions diverge structurally;
- mobile hides evidence or boundaries;
- fake metrics, providers, partners, testimonials, cost savings, QPU access, or quantum advantage appear;
- any secret, private path, `.env` value, Origin Trial token, Gmail, Drive, or private correspondence appears.
