# Winter Gate

## From a Quantum Router to a Browser-Native Human Decision

### Day 3-4 Field Report — Introduction

**Jean-Sébastien Beaulieu**  
August 29, 2026  
English working draft

I used Codex to its fullest potential as a research partner—for code mapping, source comparison, evidence organization, consistency checks, editorial control, and deliverable preparation. I formulated the intent, defined the scope, interpreted the results, arbitrated the conclusions, and preserved every public decision. This collaboration expands my investigative capacity; judgment, responsibility, authorship, and final signature remain under my authority.

---

## Introduction — When Autumn Became Winter

Autumn gave WebMCP-QCG its first language. I saw a gate at the entrance of quantum execution: a place where an agent could pause, inspect an experiment, examine the available evidence and help a researcher choose the next action with greater clarity. The first article captured that moment in warm gold, deep navy and falling leaves. It documented an idea while it was still expanding, gathering possible frameworks, processors, simulators and futures around itself.

Winter begins at a different threshold. It begins when imagination accepts structure.

I returned to the project after sleep, breathing room and enough distance to ask a harder question: does this tool solve a real problem, and can I prove its value inside a browser? That question changed the architecture. I stopped measuring progress by the number of ecosystems I could name. I began measuring it by the quality of one decision, the evidence supporting it and the authority preserved around it.

The result already has a functional spine. WebMCP-QCG exposes four progressive tools: inspect a quantum experiment, evaluate the proposed call, run a bounded local Q# simulation when the decision and visible consent permit it, then export an evidence receipt. The interface carries five falsifiable outcomes: reuse a fresh result, reject an unsupported request, recompile for the selected target, simulate before spending, or report technical readiness while preserving a separate authorization gate.

Those are working state transitions rather than decorative labels. A real Q# artifact enters locally, receives a SHA-256 digest and compiles through `qsharp-lang@1.31.0` in a Web Worker. The validated Bell experiment completed sixty-four correlated shots. The recorded path used one local simulation and made zero provider or QPU submissions. The current codebase passes thirty-four automated tests and produces a complete TypeScript and Vite build. This is a narrow proof, and that precision gives it strength: one browser, one bounded simulator, one observable authority chain and one portable receipt.

The market research sharpened the same lesson. qBraid, Qiskit MCP, Open Quantum, Amazon Braket and other specialist platforms already provide serious capabilities around compilation, provider access, pricing, queues, job preparation and execution. Their work gives quantum developers increasingly capable runners. My strongest contribution belongs immediately before those runners. QCG can become an independent preflight surface where an agent and a human establish what artifact is being considered, whether the target evidence is current, whether prior evidence can be reused, which limitations remain active and who holds authority over the next effect.

That is why I removed the universal quantum-router promise from the critical path. The project now advances as a browser-native, human-in-the-loop quantum preflight workbench. Its value comes from sequence: artifact truth, target truth, deterministic recommendation, human decision and evidence receipt. Existing platforms remain free to compile and execute. QCG prepares a decision that can travel toward them with its reasoning and provenance intact.

Human-in-the-loop design becomes concrete when it appears in product state. An agent can recommend. Deterministic services can validate formats, bounds, freshness and compatibility. I can accept, defer or override the recommendation, and the receipt can preserve that choice. Technical readiness and human authorization occupy separate fields because they answer different questions. A ready experiment may still await funding, credentials, institutional approval or a better scientific justification. A local simulation may require only a short, visible and one-use consent. The interface makes those differences readable before action begins.

Day 4 opened a second frontier: the browser can also become a shared debugging room. Chrome DevTools MCP already gives Codex, Gemini-oriented clients and Antigravity a common attachment point to the same page. A dedicated QCG ledger can let each participant preserve its responsibility. Codex can map code, contracts and regression risks. Gemini can contribute browser-focused diagnosis across the DOM, console, network, performance and styling surfaces. I can challenge either analysis, request supporting evidence and make the final decision. QCG remains the canonical record rather than turning one model into the hidden supervisor of another.

The next implementation therefore adds a structured collaboration ledger and a real QCG panel inside Chrome DevTools. It will record observations, hypotheses, proposals, challenges, review requests and receipts. Every identity will be labelled as declared. Every reference will remain bounded. Debug messages will carry evidence while retaining zero authority over quantum consent or execution. Chrome documents Gemini assistance as a user-facing DevTools experience. For this project, the supported collaboration path is the shared ledger, Chrome DevTools MCP and a visible human panel that keeps each exchange inspectable.

This architecture points toward the future I have been trying to articulate for years. By 2029, an ordinary browser can plausibly become a common surface for quantum authoring, inspection, bounded simulation, resource-aware preflight and controlled delegation. The larger computation will continue to select the substrate it requires: browser WebAssembly, local native compute, specialized classical infrastructure, a remote simulator or a physical QPU. Accessibility comes from giving more people the same front door, a clear map of the available paths and an honest account of what each path can support.

Japan's Shunkai milestone makes that future feel closer while keeping the physics precise. The operational neutral-atom system uses an apparatus that works at room temperature without a cryogenic refrigerator, while ultracold atoms remain the qubits under optical control. That distinction matters. Hardware assumptions can change dramatically, yet every result still depends on exact experimental conditions. A browser gate becomes more valuable as the available substrates grow: it can identify the proposed environment, preserve the target snapshot, explain which evidence applies and help the researcher decide when a hardware call has earned its place.

Winter is the right visual language for this stage. Bare branches reveal structure. Frost sharpens edges. Quiet space makes every footprint visible. The gold gate from Autumn remains, because the purpose remains. Its surroundings change from discovery to discipline. The evidence cube stays at the center. Cyan lines connect artifacts, decisions, agents and receipts. Cold gold marks the points where human authority enters the system.

I am still building an ambitious tool, and I am building it through smaller proofs that can survive inspection. Autumn carried the original vision. Winter gives that vision contracts, witnesses and boundaries. The next gate will open because the evidence supports it—and because I choose to open it.

---

## 1. Observation — The gate became a product surface

I observed the strongest proof inside a browser sequence that a researcher could inspect. The working app accepts a human-loaded Q# artifact, gives it a digest, evaluates a bounded request and records one recommendation. This sequence turns a broad infrastructure idea into a decision surface.

The five tabs make that sequence visible. Experiment contains the artifact and bounded inputs. Agent Review exposes the recommendation and reason codes. Human Decision records authority. Evidence Receipt carries the portable result. Activity makes effects and provenance legible. I can follow one record from input to receipt inside one coherent surface.

**Claim boundary.** The demonstrated scope is a functioning five-tab workbench with a coherent state transition. Universal routing, provider compatibility and production execution remain future integration targets.

## 2. Decision — Four seasons, one workflow

I decided to use four visual themes—Autumn, Winter, Spring and Summer—while maintaining one semantic application. Autumn remains the default. Winter carries Days 3–4 with ice white, cobalt, cool blue and restrained gold. Spring, Summer and Autumn provide distinct editorial atmospheres within the same product.

The seasonal code changes tokens and decorative SVG layers. It preserves the same tabs, decision vocabulary, accessibility labels, progressive WebMCP lifecycle and authority model. Every theme preserves the same QCG permissions.

**Claim boundary.** The seasonal proof demonstrates four selectable presentations and persisted selection in the tested browser. Broader browser, device and release validation belongs to the next QA cycles.

## 3. Action — I kept the quantum contract small

I kept exactly four progressive tools: `inspect_quantum_experiment`, `evaluate_quantum_call`, `run_bounded_qsharp_simulation` and `export_quantum_evidence_report`. The first two become available after a valid human-loaded artifact exists. Simulation appears only after a `simulate_first` recommendation and visible one-time consent. Export follows evidence.

The five fixtures make the decision model falsifiable: reuse a fresh result, reject an unsupported call, recompile for a target, simulate before spending, or report technical readiness while authority stays locked. The interface carries the same services for human controls and WebMCP calls. This shared service layer keeps a button, an agent invocation and an evidence entry on one record.

**Claim boundary.** The demonstrated scope is a bounded local workflow with explicit state transitions. `ready_for_external_execution` remains a report state for a later human-controlled external workflow.

## 4. Receipt — The engineering baseline moved to 34/34

The seasonal and DevTools change set preserved the original baseline and added contract coverage. The current receipt records `npm test -- --run` passing in six files with 34/34 tests. `npm run build` also passed, transforming 127 modules and emitting the Q# Worker, the pinned `qsharp-lang@1.31.0` WebAssembly asset and the seasonal resources.

I read this receipt as a progression in evidence. The added tests cover debug contracts, ledger behavior, tool discovery, authority boundaries and seasonal persistence. The baseline remains useful because it shows that the new editorial and collaboration layers preserve the original QCG proof.

**Claim boundary.** Twenty-six passing tests and a passing build establish the engineering state of the recorded checkout. Scientific advantage, scale, wider browser security and provider readiness each require their own future evidence.

## 5. Claim boundary — The Winter browser proof is concrete and narrow

The Chrome 151 browser proof exercised the seasonal radiogroup. Arrow, Home and End navigation selected the four seasons, Winter persisted through a true reload, and the 320 px layout retained all five tabs and three persistent security cards within the document width. Activity accepted one bounded visible human observation while quantum counters stayed at zero.

I value this proof because it joins presentation and behavior. Winter works as a browser state that retains the interaction contract at a narrow width. The evidence remains tied to the browser receipt and its two public-safe captures.

**Claim boundary.** The recorded scope covers Chrome 151 at 320 px with the documented keyboard and persistence checks. Additional browsers, assistive technologies and devices form the next validation matrix.

## 6. Observation — DevTools became a collaboration room

I observed a second kind of browser boundary: several declared collaborators can inspect one QCG page while the product retains quantum authority. The DevTools architecture separates the main five-tab workbench from a QCG panel. The panel reads a structurally reduced page snapshot and records append-only, schema-validated collaboration messages.

The declared actors have different responsibilities. Codex can map code and contracts. A Gemini-labelled participant can contribute browser diagnosis. I remain the human authority who compares evidence and acknowledges a discussion. The ledger preserves actor, kind, sequence, evidence references and review state so that collaboration becomes inspectable rather than implicit.

**Claim boundary.** The exchange is an executable declared-identity protocol fixture. A live external Gemini client and the built-in Gemini DevTools assistant remain separate integration gates.

## 7. Decision — Collaboration carries evidence; quantum authority stays human

I decided that debug messages can observe, challenge, propose, request review and export a handoff, while QCG services retain every quantum decision. The four page-defined DevTools tools—`read_debug_context`, `post_debug_observation`, `request_human_review` and `export_debug_handoff`—belong to a debug lane that remains separate from the four canonical quantum tools.

The integration receipt records monotonic messages, a human acknowledgement, declared identity assurance, unchanged authority and zero QPU submissions before and after the exchange. That separation matters operationally. A discussion can expose a styling defect or request a review while consent, simulation tokens and external stages remain unchanged.

**Claim boundary.** The tested scope covers a bounded collaboration ledger with allowlisted evidence references, recognized high-risk-pattern screening and declared identities. Authenticated identities, live Gemini participation and additional execution capabilities remain future integration gates.

## 8. Action — I packaged the extension and tested the deployment boundary

I kept the DevTools extension unpacked and structurally tested. The MV3 manifest and DevTools page define a QCG panel, while manual Chrome installation and panel opening remain author actions. The panel offers inspection and human-review context; consent, simulation and external execution controls stay inside their canonical QCG services.

I also prepared the seasonal package for the cPanel operator path. The operator health check passed, then the deploy-plan call for `public_html/qcg.securedme.ca` returned `CPANEL_READ_FAILED` before a confirmation token existed. The operator stopped before mutation, the SSH path stayed outside this workflow and the previous live release remained intact.

**Claim boundary.** The demonstrated scope covers a locally built seasonal package, a structurally tested unpacked extension and a deployment attempt that stopped safely before mutation. Live Winter hosting and manual Chrome installation remain the next explicit gates.

## 9. Receipt — Winter reaches the author-review gate

The evidence now forms a clear handoff. The local suite passes 34/34 tests, the production build passes, the browser proof records Winter at 320 px, and the four-season interaction is bounded. The collaboration fixture shows how declared participants can exchange evidence while the human keeps authority.

The public status remains precise because the cPanel read failed before mutation: `qcg.securedme.ca` continues to serve the previous accepted release. The extension awaits manual Chrome installation. The article, final graphics, publication and Devpost submission remain Jean-Sébastien’s decisions. My next action is editorial review against the receipts; deployment and external exchange retain their own evidence gates.

**Claim boundary.** This field report can present a functioning local release candidate, its browser evidence and its explicit limits. It should present publication, live seasonal deployment, manual extension installation and any future provider workflow as separate gates.

## Closing note

Winter makes the existing system easier to inspect. The gate, evidence cube and provenance lines now carry a disciplined sequence: load a human artifact, inspect it, decide, authorize the bounded local branch, and preserve the receipt. DevTools adds a room for declared collaboration, while the product keeps its authority in one place.

I can continue expanding the surrounding research, but the core lesson has become stable enough to guide each next step: the browser becomes more trustworthy when each visible capability states what it knows, what it records and which human choice must follow.
