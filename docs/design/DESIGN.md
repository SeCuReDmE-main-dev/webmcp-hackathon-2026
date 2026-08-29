# WebMCP-QCG — Web Design and Stitch Handoff Contract

## 1. Purpose

This document defines the product truth, interaction model, visual system, routing contract, responsive behavior, and Stitch handoff for the public WebMCP-QCG interface.

Canonical product destination:

`https://qcg.securedme.ca/`

Repository:

`https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026`

Domain contract:

- `qcg.securedme.ca` is the real canonical product address and must appear as a clickable first-party URL wherever the destination is shown.
- Hosting and release health are separate operational checks; the interface must never infer deployment health from the presence of the domain alone.
- The design remains deployment-neutral and works as a static React/Vite application.

The existing prototype is the functional and interaction authority. It is not the final visual target. Preserve its working state machine, bounded contracts, accessibility, and evidence semantics while replacing its utilitarian styling with a coherent SecuredMe product interface.

Primary visual authority:

- `asset/thumbnail/thumbnail_devpost.png`
- the English front cover of *WebMCP Quantum Call Gate — Day 2 Field Report*

The cover establishes the navy, electric-blue, cyan, metallic-gold, ivory, gate, lattice, and evidence-led visual language. Translate that identity into a calm scientific instrument. Do not reproduce the cover as a full-page background or turn the application into an ornate fantasy interface.

## 2. Product State and Verified Proof

WebMCP-QCG is a working bounded browser prototype, not only a concept.

Verified current behavior:

- four progressive WebMCP tools are discoverable and invokable;
- human controls and WebMCP calls use the same canonical services;
- a pinned `qsharp-lang@1.31.0` WebAssembly runtime executes inside a Web Worker;
- the fixed Bell fixture completed 64 of 64 shots;
- the Bell correlation invariant passed;
- the evidence receipt recorded one local simulation;
- external provider calls, paid calls, and QPU calls remained at zero;
- the current production build baseline is clean.

The repository defines `npm test` as `vitest run`. The current Vitest execution result remains pending until it is run and verified against the current checkout. Do not display a passing-test count, green test badge, or test-complete claim before that verification exists.

The page may present those values only as a labeled verified fixture. It must never transform them into generalized savings, performance, quantum-advantage, provider-compatibility, or scientific claims.

## 3. Product Identity

Product name:

`WebMCP-QCG`

Expanded name:

`WebMCP Quantum Call Gate`

Parent identity:

`SecuredMe`

Primary line:

`Decide before quantum execution.`

Product explanation:

`A browser-native preflight gate that inspects a quantum request, returns one bounded decision, runs a local Q# simulation only when evidence and visible consent require it, and exports a reproducible receipt.`

Primary audience:

- quantum developers evaluating whether a call is ready;
- browser-agent and WebMCP developers;
- researchers who need inspectable provenance before computation;
- hackathon judges evaluating WebMCP necessity and technical execution;
- educators demonstrating the difference between preparation, simulation, readiness, and authorization.

## 4. Product Truth and Authority Boundary

The interface must communicate the product's authority boundary directly through structure and state.

QCG can:

- inspect a known experiment artifact;
- calculate a versioned manifest and digest;
- evaluate freshness, target compatibility, request bounds, and authorization state;
- return one deterministic decision with reason codes and one next action;
- run one fixed bounded local Q# Bell fixture after `simulate_first` and visible one-time consent;
- export bounded JSON or Markdown evidence;
- show invocation source and zero-call counters.

QCG does not:

- submit jobs to a QPU;
- contact a quantum provider;
- authorize paid work;
- accept arbitrary quantum code in the agent contract;
- claim universal framework or provider compatibility;
- interpret experimental results as scientific truth;
- replace a researcher's judgment;
- grant external execution authority.

The phrase `ready_for_external_execution` means that the preflight record is ready for a later human-controlled workflow. It is a report state, not permission and not execution.

## 5. Shared Human–Agent Contract

The product has one canonical state shared by two interaction surfaces:

1. the human interface;
2. the browser-agent WebMCP surface.

Every invocation carries explicit provenance:

- `human`
- `webmcp`
- `worker`
- `export`

Human and agent actions must never create parallel truth. A button and its corresponding WebMCP tool call the same service function and update the same visible evidence ledger.

The machine-verifiable decision record is absent before invocation. Scenario cards may state hypotheses and expected branches, but they must not reveal the actual decision in the DOM before the gate runs. Detailed results become visible after invocation.

## 6. Progressive Tool Contract

Exactly four tools belong to the MVP:

| Tool | Availability | Visible purpose |
| --- | --- | --- |
| `inspect_quantum_experiment` | initial | Create a versioned manifest and digest for a known artifact. |
| `evaluate_quantum_call` | initial | Return exactly one decision, reason codes, and one next action. |
| `export_quantum_evidence_report` | after evidence exists | Export the current bounded receipt in JSON or Markdown. |
| `run_bounded_qsharp_simulation` | only after `simulate_first` plus unused visible consent | Run the fixed local Bell fixture in the Worker. |

Registration state:

| Product state | Registered tools |
| --- | --- |
| empty / inspected | inspect, evaluate |
| evaluated | inspect, evaluate, export |
| `simulate_first` + unused consent | inspect, evaluate, simulate, export |
| consent consumed / completed / cancelled | inspect, evaluate, export |

The UI needs a compact `Agent surface` module showing which tools are currently registered. Tool appearance and disappearance should be understandable without opening DevTools.

## 7. Decision Model

The gate returns exactly one of five decisions:

- `reuse_result`
- `reject`
- `recompile`
- `simulate_first`
- `ready_for_external_execution`

Each result view must include:

- decision label;
- plain-language explanation;
- reason codes;
- one next action;
- manifest or decision identifier;
- timestamp;
- invocation source;
- local, external, paid, and QPU call counters.

Colors reinforce decisions but never carry meaning alone. Every state needs a text label and an icon.

## 8. Five Falsifiable Scenario Cards

The workbench begins with five named fixtures. Each card states a hypothesis before invocation and remains honest when the observed decision differs.

1. **Reuse the Fresh Result**
   - Hypothesis: valid fresh evidence can answer the request without another run.
   - Expected action: reuse and export.

2. **Reject the Unsupported Call**
   - Hypothesis: incompatible or unsupported requirements should stop at the gate.
   - Expected action: explain the unsupported boundary.

3. **Recompile for the Target**
   - Hypothesis: a compatible experiment with a target mismatch needs recompilation before execution.
   - Expected action: produce a target-specific preparation step.

4. **Simulate Before Spending**
   - Hypothesis: missing local evidence should trigger a bounded simulation before any external expense.
   - Expected action: request visible consent, run locally, then export evidence.

5. **Ready, but Not Authorized**
   - Hypothesis: technical readiness can be established while execution authority remains locked.
   - Expected action: export the readiness record and keep external execution unavailable.

## 9. Required Page Story

The page must establish the complete value proposition in under 15 seconds:

1. A quantum call can consume scarce or paid resources.
2. QCG places a visible browser gate before that call.
3. The gate inspects, decides, optionally simulates locally, and exports evidence.
4. The current MVP contacted zero providers and zero QPUs.
5. A human accepts, overrides, or defers the recommendation while external execution remains locked.

The initial viewport must reveal a hint of the scenario workbench. Avoid a hero so tall that the product appears to be a marketing page rather than an executable instrument.

## 10. Required Information Architecture

### 10.1 Header

Include:

- text identity: `SecuredMe / WebMCP-QCG`;
- primary workbench navigation: Experiment, Agent Review, Human Decision, Evidence Receipt, Activity;
- secondary links: How it works, Boundaries, Source;
- compact status: `Working browser prototype`;
- live WebMCP status: detected, unavailable, registering, or error;
- theme control;
- primary CTA: `Open the gate`.

Do not imply that SecuredMe, OpenAI, Chrome, Microsoft, IBM, NVIDIA, or any quantum provider sponsors or endorses the project.

### 10.2 Five-tab workbench shell

The application has five top-level tabs. They are five views over one canonical experiment record, never five independent copies of state.

1. **Experiment**
   - select one of the five falsifiable fixtures;
   - inspect the artifact, target, bounds, evidence age, and digest;
   - evaluate the call and, only when required, grant one-time consent for a bounded local simulation;
   - keep one primary action visible at a time.

2. **Agent Review**
   - show the current WebMCP tool registry and invocation source;
   - present the agent recommendation, reason codes, next action, assumptions, and unresolved evidence;
   - distinguish a generated recommendation from a human decision;
   - preserve the actual answer boundary before invocation.

3. **Human Decision**
   - present the agent recommendation beside the evidence needed to judge it;
   - offer exactly three review outcomes: `accepted`, `overridden`, and `deferred`;
   - require a concise human rationale for `overridden` and allow an optional note for the other outcomes;
   - record the outcome as governance evidence without triggering external execution.

4. **Evidence Receipt**
   - assemble the manifest, decision, human review, simulation record when present, counters, provenance, and hashes;
   - expose readable summaries first and raw JSON only through disclosure;
   - export the current receipt in JSON or Markdown without reevaluating or rerunning.

5. **Activity**
   - show the chronological invocation and state-transition ledger;
   - filter by source, tool, status, and phase;
   - make cancellation, failure, retry, recovery, export, and human-review events visible;
   - never display secret values, raw quantum code, private paths, or provider internals.

Desktop uses a horizontal tab bar directly above the workbench. Tablet keeps the tab bar scrollable without truncating labels. Mobile uses the same semantic tab order in a horizontally scrollable tab list with a visible position indicator; it must not replace the tabs with an inaccessible custom dropdown.

Keyboard contract:

- use semantic tab and tabpanel relationships;
- `Left` and `Right` move between tabs;
- `Home` and `End` move to the first and last tab;
- `Enter` or `Space` activates a focused tab when activation is manual;
- focus moves predictably and never resets the active experiment;
- tab labels always combine text with an icon and selected-state marker.

### 10.3 Hero

Required copy hierarchy:

- eyebrow: `WebMCP-native quantum preflight`
- H1: `Decide before quantum execution.`
- supporting copy: one sentence describing inspection, decision, bounded local simulation, and evidence export;
- primary CTA: `Open the gate`;
- secondary CTA: `View verified proof`;
- tertiary CTA: `Inspect source`;
- verified fixture line: `64/64 bounded Bell shots · invariant passed · 0 external calls`.

Use a restrained gate or threshold composition on the right: two architectural rails, a luminous central decision seam, a geometric evidence cube, and a small five-stage sequence:

`TRUST → INSPECT → DECIDE → VERIFY → EXECUTE`

The `EXECUTE` stage must appear locked and labeled `external — human controlled`.

### 10.4 Gate Workbench

Desktop composition inside the **Experiment** tab:

- left rail: scenario deck;
- center: active inspection and decision surface;
- right rail: agent surface, counters, and recent invocation ledger.

Tablet composition:

- scenario deck becomes a horizontal scroll or two-column grid;
- decision surface spans the width;
- evidence and agent modules form two columns below.

Mobile composition:

- scenario selector;
- active decision surface;
- conditional action and consent;
- counters;
- evidence;
- invocation ledger.

The workbench must retain one visible primary action at a time.

### 10.5 Inspection Surface

Show:

- selected artifact name;
- artifact ID;
- target and requested bounds;
- evidence age and status;
- digest status;
- `Inspect` action;
- inspection progress and safe cancellation;
- generated manifest ID after completion.

Raw quantum code, credentials, provider diagnostics, and private paths do not belong in this surface.

### 10.6 Decision Surface

Before invocation:

- show the scenario hypothesis;
- show the inputs participating in the policy;
- keep the machine-verifiable answer absent.

After invocation:

- reveal one decision plaque;
- show reason codes as readable chips;
- show one next action;
- show provenance and identifiers;
- update counters and the invocation ledger atomically.

Use the visual metaphor of a gate changing position, but keep transitions under 250 ms and respect reduced motion.

### 10.7 Conditional Simulation and Consent

The simulation control appears only when the active decision is `simulate_first`.

Before it appears, show a visible one-time consent panel containing:

- fixed fixture: two-qubit Bell program;
- local runtime: Q# WebAssembly Worker;
- shots: 1–256, with the demo default clearly shown;
- qubits: 1–8;
- timeout: 500–15000 ms;
- network/provider/QPU calls: zero;
- action: `Grant one-time local consent`.

After consent:

- expose `Run bounded local simulation`;
- expose `Cancel` while active;
- consume and remove consent after completion, cancellation, or error;
- display the invariant result and outcome histogram;
- never expose an external execution button.

### 10.8 Evidence and Invocation Ledger

Evidence is a first-order product surface.

Include:

- decision receipt summary;
- manifest and evidence packet IDs;
- local simulation count;
- external provider count;
- paid-call count;
- QPU-call count;
- Bell invariant when present;
- `Export JSON` and `Export Markdown` actions;
- recent invocation list with source, tool, status, summary, and timestamp.

Keep raw JSON behind a disclosure control. The default surface should remain readable by a scientist, judge, or developer without decoding the schema.

### 10.9 Persistent Security Rail

Three security cards remain visible on every tab. On desktop they form a compact rail above or beside the active panel. On tablet and mobile they become a three-item summary strip with expandable details. Their order and meaning remain stable.

1. **Artifact Integrity**
   - manifest identifier and digest status;
   - states: pending, verified, mismatch, stale, unavailable;
   - communicates whether the evaluated artifact still matches the inspected artifact.

2. **Target Evidence**
   - target compatibility, evidence freshness, and requested-bound status;
   - states: pending, sufficient, incomplete, incompatible, expired;
   - communicates what evidence supports the current recommendation.

3. **Authority & Effects**
   - human review state, consent state, external-execution lock, and local/external/paid/QPU counters;
   - states: awaiting review, accepted, overridden, deferred, consent granted, consent consumed, locked;
   - always shows `External execution: locked` in the MVP.

Every security card uses a label, plain-language status, icon, and short explanation. Color is reinforcement only. A screen reader announcement occurs only when the status materially changes, not on every render.

### 10.10 Human review outcomes

- `accepted`: the human adopts the agent recommendation and its next action. This records agreement; it never authorizes a provider or QPU call.
- `overridden`: the human selects a different bounded next action and supplies a rationale. The original recommendation remains visible in the receipt.
- `deferred`: the human postpones judgment. The record remains open, exports as incomplete, and all external effects stay locked.

Review outcomes are append-only evidence events. A later review creates another event rather than silently rewriting history.

### 10.11 How the Gate Works

Show four concise steps:

1. Inspect the artifact.
2. Evaluate the call.
3. Simulate locally only when evidence requires it.
4. Export the receipt for human-controlled next steps.

Connect each step to its WebMCP tool and visible human control.

### 10.12 Boundaries and Governance

Present the following as a compact trust contract:

- external execution remains locked;
- local simulation is bounded and cancellable;
- one-time consent is visible and consumed;
- unknown schema properties are refused;
- code and secrets stay outside the agent contract;
- detailed results become visible after invocation;
- readiness and authorization remain separate;
- source and evidence links are public and inspectable.

### 10.13 Footer

Include:

- WebMCP-QCG;
- SecuredMe;
- GitHub repository;
- MIT license;
- canonical route [`qcg.securedme.ca`](https://qcg.securedme.ca/);
- status `Working browser prototype`;
- statement `No QPU, paid API, or external quantum job is part of this MVP.`

## 11. Visual Direction

The interface should feel like a premium scientific control room built around an evidence gate.

Translate the article cover into interface semantics:

- deep navy and near-black create the secure decision chamber;
- electric blue and cyan represent computation, registration, and local simulation;
- metallic gold represents trust thresholds, decisions, and verified evidence;
- ivory supports editorial readability;
- the cube represents a versioned evidence packet;
- the gate represents authorization boundaries;
- constellation lines represent inspectable dependencies and provenance.

Use ornament sparingly. Fine gold rules, geometric corner details, and lattice lines may frame major surfaces. They must never compete with labels, controls, evidence, or focus rings.

Avoid:

- generic AI robot imagery;
- decorative particle fields behind body text;
- casino, crypto, steampunk, or game-interface styling;
- fake quantum processor photography;
- giant empty hero sections;
- nested cards inside cards;
- neon glow on every element;
- gold body text on black at small sizes;
- scientific equations used as meaningless decoration;
- visual claims of provider or QPU connection;
- an external `Execute` button.

## 12. Binding Palette

The palette is derived from the first QCG article cover and its matching Devpost thumbnail.

### 12.1 Dark master

- Gate Black: `#02060B`
- Void Navy: `#000D1C`
- Archive Navy: `#011A35`
- Panel Navy: `#071F36`
- Cool Border: `#183E62`
- Quantum Blue: `#0878D8`
- Signal Cyan: `#20C8FF`
- Gate Gold: `#E8A838`
- Bright Gold: `#FFC857`
- Editorial Ivory: `#FFF0C2`
- Cool White: `#EAF5FF`
- Muted Steel: `#9CB4C8`

### 12.2 Light twin

- Parchment: `#FFF9ED`
- Ice Surface: `#F3F9FF`
- Deep Ink: `#071629`
- Navy Text: `#102D4C`
- Light Border: `#C9D9E8`
- Royal Blue: `#0867B7`
- Deep Cyan: `#006B8F`
- Burnished Gold: `#8A5700`
- Warm Rule: `#D9A43A`

### 12.3 State colors

- Pass: `#65D895`
- Warning / consent: `#F2B94B`
- Reject / error: `#FF7483`
- Information: `#59BFFF`
- Locked: `#A8B4C0`

State colors require text and icon companions. Reserve bright gold for decisions, primary actions, selected scenarios, and evidence seals. Reserve cyan for browser-agent activity, computation, links, and focus states.

Bright cover colors are accents and fills, not default small-text colors. Use Gate Black on gold controls, Editorial Ivory or Cool White on dark surfaces, and the darker light-theme cyan/gold tokens for text on parchment or ice.

## 13. Typography and Geometry

- Display and hero: `Cormorant Garamond` or an equivalent high-contrast editorial serif.
- Interface and body: `Inter` or `Manrope`.
- Code, schema, IDs, and reason codes: `IBM Plex Mono`.
- Use serif only for the product promise, major section openings, and select evidence totals.
- Keep buttons, form labels, navigation, status, and body copy in the sans-serif interface family.
- Keep uppercase metadata labels short with restrained tracking.
- Card radius: 8–12 px.
- Primary gate panels may use clipped or chamfered corners through CSS, while preserving normal hit areas.
- Minimum body size: 16 px desktop and mobile.
- Minimum interactive target: 44 × 44 px.
- Maximum content width: 1440 px; workbench preferred width: 1280–1400 px.

### 13.1 Responsive system

| Viewport | Navigation | Workbench | Security rail |
| --- | --- | --- | --- |
| Desktop, 1200–1440+ px | Five tabs in one row | Experiment may use three columns; other tabs use one primary canvas plus a supporting rail | Three persistent cards in one row or right rail |
| Tablet, 768–1199 px | Scrollable five-tab row with complete labels | One primary canvas followed by two-column supporting modules | Three compact cards in one row, details expandable |
| Mobile, 320–767 px | Scrollable semantic tab list with position cue | One column in task order; one primary action at a time | Three-item summary strip followed by expandable cards |

Dark and light themes use identical hierarchy, geometry, order, copy, states, and interaction behavior. Theme changes tokens only. Every required screen must be designed for desktop, tablet, and mobile rather than relying on automatic scaling from the desktop master.

## 14. Component Contract

Required reusable components:

- `QcgHeader`
- `HeroGate`
- `WebMcpStatus`
- `WorkbenchTabs`
- `SecurityRail`
- `ArtifactIntegrityCard`
- `TargetEvidenceCard`
- `AuthorityEffectsCard`
- `ScenarioDeck`
- `ScenarioCard`
- `PhaseRail`
- `InspectionPanel`
- `DecisionPlaque`
- `ReasonCodeChip`
- `ConsentGate`
- `SimulationProgress`
- `OutcomeHistogram`
- `EvidenceCounters`
- `EvidenceReceipt`
- `AgentToolRegistry`
- `AgentReviewPanel`
- `HumanDecisionPanel`
- `ReviewOutcomeControl`
- `InvocationLedger`
- `ActivityFilters`
- `BoundaryContract`
- `QcgFooter`

Every component needs empty, loading, active, complete, cancelled, error, and recovery behavior where applicable.

### 14.1 Complete state matrix

| Surface | Empty / unavailable | Loading / active | Success states | Error and recovery |
| --- | --- | --- | --- | --- |
| Application shell | booting; WebMCP unavailable with human controls preserved | registering tools; restoring local record | ready; degraded human-only | registration error with `Retry registration`; fatal load error with `Reload workbench` |
| Experiment | no scenario selected; no inspection | inspecting; evaluating; simulating; cancelling | inspected; one of five decisions; simulation completed | invalid input; digest mismatch; expired decision; cancelled; Worker timeout; `Review inputs`, `Inspect again`, or `Retry local simulation` |
| Agent Review | no evaluation yet; agent surface unavailable | collecting evidence; evaluating recommendation | recommendation ready; reason codes and next action visible | incomplete evidence; tool error; stale recommendation; `Return to Experiment` or `Evaluate again` |
| Human Decision | review unavailable until recommendation exists | saving review outcome | accepted; overridden; deferred | missing override rationale; stale evidence; save failure; retain draft and offer `Retry save` |
| Evidence Receipt | no evidence packet | assembling; preparing export | receipt ready; JSON exported; Markdown exported | incomplete receipt; export failure; `Review missing evidence` or `Retry export` |
| Activity | no activity; no filter matches | loading or applying filters | chronological events visible | ledger unavailable; retry without losing the canonical experiment |
| Security cards | pending; unavailable; locked | checking integrity, target, or authority | verified/sufficient plus accepted, overridden, or deferred | mismatch, incompatible, expired, or stale with a named recovery action |

Loading states use stable skeleton geometry and explicit text such as `Inspecting artifact…`; they never fake progress. Errors preserve entered values and the last verified receipt. Recovery actions are specific, keyboard reachable, and never silently rerun a simulation or consume consent.

## 15. Accessibility and Motion Contract

- Meet WCAG 2.2 AA contrast for text and interactive controls.
- Preserve semantic heading order.
- Make the entire workflow keyboard operable.
- Use visible `:focus-visible` rings in cyan plus a high-contrast outline.
- Keep labels and reason codes available to assistive technology.
- Use `aria-live` for registration, invocation, cancellation, and result updates without producing repeated chatter.
- Use text and icons in addition to color.
- Respect `prefers-reduced-motion`.
- Avoid animated star fields, parallax, or continuous glowing loops.
- Keep consent explicit and separate from the simulation action.
- Preserve useful human operation when WebMCP is unavailable.
- Keep mobile readable at 320 px without horizontal page scrolling.

## 16. Asset Handling

| Asset | Role |
| --- | --- |
| `asset/thumbnail/thumbnail_devpost.png` | primary public theme and gate-identity reference; suitable for social/Devpost presentation |
| Day 2 English front cover | original palette, editorial hierarchy, and gate metaphor authority |
| browser evidence receipts | factual content source for proof modules; not visual backgrounds |

Do not regenerate the SecuredMe identity or bake functional interface text into images. All navigation, headings, labels, decisions, counters, reason codes, controls, and evidence must remain editable HTML/CSS.

## 17. Routing and Deployment Contract

- Canonical origin: `https://qcg.securedme.ca/`.
- Use a top-level application; do not place the WebMCP registration surface inside an iframe.
- Preserve `Origin-Agent-Cluster: ?1`.
- Preserve `Permissions-Policy: tools=(self)`.
- Keep all assets same-origin unless a verified dependency requires otherwise.
- The human interface must remain functional when `document.modelContext` is absent.
- No analytics, account login, provider credential, API key, or payment dependency belongs in the MVP.
- A static build must remain deployable to cPanel, Cloudflare, Netlify, or another static host without rewriting the product services.

## 18. Required Stitch Deliverables

Stitch should produce one coherent project containing:

1. desktop dark master at 1440 px;
2. desktop light twin at 1440 px;
3. tablet dark and light workbench masters;
4. mobile dark master at 390 px;
5. mobile light twin at 390 px;
6. all five tabs in desktop, tablet, and mobile composition;
7. persistent Artifact Integrity, Target Evidence, and Authority & Effects cards;
8. empty and pre-invocation states;
9. loading states for inspection, evaluation, receipt assembly, activity, and export;
10. `reuse_result` state;
11. `reject` state;
12. `recompile` state;
13. `simulate_first` before consent;
14. active local simulation with cancellation;
15. completed Bell evidence state;
16. `ready_for_external_execution` with external execution visibly locked;
17. Human Decision states for `accepted`, `overridden`, and `deferred`;
18. WebMCP-unavailable human-fallback state;
19. validation, Worker, registration, export, and ledger error states with recovery actions;
20. component and token summary;
21. implementation-ready handoff assets.

## 19. Acceptance Gate

The design is accepted only if:

- a new viewer understands `decide before quantum execution` within 10–15 seconds;
- the product reads as a working browser instrument rather than a future platform;
- the page clearly uses WebMCP for the agent path;
- the four tools and their progressive availability are visible and accurate;
- the five scenario cards remain falsifiable hypotheses;
- the actual decision stays absent before invocation;
- local simulation requires visible one-time consent;
- external execution remains locked in every state;
- the verified fixture says 64/64 shots, invariant pass, and zero external calls without generalizing the result;
- the evidence ledger and provenance are first-order surfaces;
- the five tabs expose one canonical record rather than duplicating state;
- Artifact Integrity, Target Evidence, and Authority & Effects remain visible on every tab;
- accepted, overridden, and deferred human outcomes remain distinct from agent recommendations;
- the visual language clearly derives from the QCG article cover and thumbnail;
- gold represents trust/decision while blue-cyan represents computation;
- text and controls remain readable above the visual atmosphere;
- dark and light themes share the same architecture;
- desktop, tablet, and mobile preserve the same five-tab task order;
- every tab has explicit empty, loading, success, error, and recovery behavior;
- every important state works at 320 px and with keyboard navigation;
- functional text remains HTML/CSS;
- no fake providers, partners, user counts, testimonials, benchmarks, QPU access, or cost-saving claims appear;
- no secret, private path, `.env` value, Origin Trial token, Gmail, Drive, or private correspondence enters the design;
- the result can be implemented against the existing React/TypeScript services without changing the verified product contract.
- `qcg.securedme.ca` is presented as the canonical clickable product address;
- the interface may state that the current production build, 18-test Vitest baseline and official two-step WebMCP smoke evaluation pass; each numeric claim remains tied to its dated receipt.
