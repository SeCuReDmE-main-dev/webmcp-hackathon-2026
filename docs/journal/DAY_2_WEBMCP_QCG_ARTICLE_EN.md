# WebMCP Quantum Call Gate

## Deciding Before Quantum Execution

**A Day 2 field report from a solo developer building in public**

**Jean-Sébastien Beaulieu**  
August 27, 2026  
English edition  
Project repository: <https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026>

> Research, source auditing, architectural synthesis, and implementation support were performed with OpenAI Codex. I remain responsible for the claims, decisions, and final text.

---

## Abstract

After nearly thirty-seven hours of research inside a forty-eight-hour window, I reached a decision that changed the project I thought I was building. I began by looking for a WebMCP connector that could help an agent use several quantum ecosystems from the browser: Qiskit, TorchQuantum, TensorFlow Quantum, Microsoft Q#/QDK, and CUDA-Q. That framing was attractive but too broad. It treated execution as the goal and postponed the more important question: should this quantum request be executed at all?

The project emerging from Day 2 is **WebMCP Quantum Call Gate (WebMCP-QCG)**, a browser-native preflight and evidence gate placed before quantum execution. Its scope is deliberate: preserve native quantum languages and framework semantics, place paid jobs behind explicit authorization, and report evidence while scientific judgment remains with the researcher. It accepts a bounded native request, inspects its declared purpose and constraints, compares it with versioned target-capability evidence, and returns an explicit decision such as reuse prior evidence, reject an incompatibility, defer an unknown, require consent, or permit bounded local simulation. Remote readiness appears as an evidence-backed report state; execution belongs to a separately authorized surface.

This article documents the decisions that produced that boundary. It explains why I placed a video tool, a context-continuity system, and a WebMCP design studio on the bench; why quantum targets are part of the experiment rather than interchangeable destinations; and how the browser can support meaningful compilation and simulation while preserving the distinct role of a QPU. A pinned `qsharp-lang@1.31.0` spike loaded a 6,066,574-byte WebAssembly module, validated a two-qubit Bell program, and returned twenty correlated shots in 716 milliseconds on my ordinary Windows laptop. That result proves the public package boundary in Node. The browser Worker path and a native WebMCP invocation form the next executable proof.

The central result is architectural: execution stays separate from evidence, freshness, authorization, and consent. A refusal becomes a useful, inspectable product result with reason codes and a repair path. The exact three-minute interaction remains open overnight. The mission is fixed.

**Keywords:** WebMCP, quantum computing, preflight validation, browser agents, QDK, WebAssembly, provenance, reproducibility, local-first software, responsible execution

---

## Contents

1. Introduction — Before Sleep, Fix the Question
2. Chapter 1 — Building in Public Under Clear Rules
3. Chapter 2 — What WebMCP Actually Exposes
4. Chapter 3 — The Ideas I Left on the Bench
5. Chapter 4 — Five Ecosystems, One Decision Contract
6. Chapter 5 — The Target Is Part of the Experiment
7. Chapter 6 — The Browser as a Bounded Quantum Surface
8. Chapter 7 — Designing for an Ordinary Computer
9. Chapter 8 — WebMCP-QCG: Decide Before You Spend
10. Chapter 9 — A Public Proof Outlives a Large Promise
11. Conclusion — What the Dream Can Add
12. Research Viewing Log
13. References

---

# Introduction — Before Sleep, Fix the Question

This is the end of Day 2 in a personal ten-day WebMCP build and research sprint. In the last forty-eight hours, I have spent close to thirty-seven hours reading specifications, examining repositories, watching technical presentations, comparing frameworks, testing a public package boundary, and repeatedly cutting attractive ideas out of the project. That number describes the conditions under which the decision was made. Fatigue changes judgment and can make a large architecture feel inevitable simply because energy has already been invested in it. Writing this article restores distance between effort and evidence.

I am also building under an unusual condition. The official challenge rules exclude residents of Quebec.[1] The platform can still display activities, award participation badges, and let a developer begin a project. The written rules define contractual eligibility, while the interface provides a place to learn and build. I am proceeding publicly because the training, the source work, the software, and the contribution to SecuredMe matter more to me than a prize. I will respect the technical deadlines, preserve the repository when the event closes, and describe the work accurately as an open build alongside the challenge.

That tension became unexpectedly useful. It gave me the clearest analogy for the tool I now want to build. A visible button proves access to an interface. Authority comes from the governing contract. A backend advertises availability; compatibility comes from the workload and target profile. A credential proves identity or access; scientific value comes from the research question and evidence gap. A cached result carries history; freshness comes from a validity test. Between availability and action, a system needs a decision boundary.

At the beginning of the day, I was still considering several products. One was a video-oriented WebMCP project that would have been visually strong and relatively simple to demonstrate. Another was WebCCP, an attempt to preserve agent continuity across browser and local surfaces. A third was a design-and-evaluation studio for building better WebMCP-enabled websites. The quantum lane began as something larger: an agent-facing connector across Qiskit, TorchQuantum, TensorFlow Quantum, and Azure-related quantum tooling, with Colab as a possible escape route for an older laptop.

The research made the differences between the ecosystems decisive. Qiskit exposes circuit, target, transpilation, and primitive contracts. TorchQuantum is organized around PyTorch modules, dynamic computation graphs, batching, and gradients. TensorFlow Quantum combines Cirq objects and observables with TensorFlow and Keras. Q# and the Microsoft QDK provide a language, compiler, simulator, circuit extraction, resource estimation, and QIR generation. CUDA-Q emphasizes hybrid quantum-classical execution and target discovery. Each ecosystem carries information that a responsible decision must preserve. The project therefore converged on a shared decision layer above framework-native adapters.

The project became clearer when I inverted the question. Instead of asking, “Where should the agent run this?”, I asked, “What evidence is missing, and would another execution add it?” That is the origin of WebMCP Quantum Call Gate. The gate is a browser-facing decision contract positioned ahead of quantum infrastructure and scientific interpretation. It lets an agent present a request to deterministic code and receive a bounded, reasoned decision before any expensive or irreversible action occurs.

The names, repositories, and webinars in this article document the route by which my assumptions changed. Presentations oriented me as a human learner: they showed current vocabulary, demonstrated tools such as the WebMCP Inspector, and made the browser execution model concrete. Thirty primary or institutional sources assigned to individual chapters carry the technical claims. The reference sheet keeps that evidence layer distinct from the six items in my viewing path.

Codex has a visible role in this process. I used it to search the corpus, compare conflicting reports, audit source attribution, run local probes, preserve receipts, and challenge scope. I write in the first-person singular because I am the solo developer choosing the product and publishing the argument. Codex is the research, audit, and implementation collaborator named on the first page. That distinction makes responsibility as legible as automation.

By the end of this article, the architecture will be narrower than the dream that started the day. That is progress. One focused uncertainty remains: “Which interaction will make the product obvious in three minutes?” I am deliberately leaving that design question for sleep. Dreams are welcome at this stage, and tomorrow each idea will pass through the same gate: preserve native framework semantics, separate execution from authorization, operate on an ordinary machine, and produce falsifiable evidence.

---

# Chapter 1 — Building in Public Under Clear Rules

The first architecture lesson of this project came from a rule rather than a runtime. The WebMCP Challenge rules define who may participate, and Quebec is excluded.[1] The platform still exposes participation surfaces and badges, while the written rules remain the authority. I can build, learn, publish, and create a project record while describing my eligibility exactly.

That is the tone I want for the entire project: direct, public, and exact. I am opening the work early. The repository will show the parked ideas, research notes, executable receipts, failures, and eventual code. Publishing the process can make the competition more informed and more demanding. It can also give another developer a useful starting point at every stage of the build.

Open development begins with visible source and becomes open source through an explicit permission contract. The Open Source Definition requires a license that permits redistribution, derived works, and use across people, groups, and fields of endeavour.[2] For that reason, the public repository includes a real license, a clean secret scan, third-party attribution, and documentation that distinguishes my code from the QDK package I reuse. “Public” describes access. “Open source” defines permission.

UNESCO’s Recommendation on Open Science broadens the reason for doing this carefully. It treats open scientific knowledge, infrastructures, engagement, and dialogue as connected practices, while also recognizing legitimate restrictions and inequalities in access.[3] I am applying that discipline at prototype scale: make methods visible, keep evidence inspectable, describe limits, and provide a small public path that works on an ordinary machine before introducing paid accounts or specialized hardware.

This matters to the quantum concept. Much current quantum access is mediated through provider accounts, queues, cloud credits, regional availability, hardware allocations, or organization-controlled workspaces. Those boundaries support real operational needs. The gate adds the missing distinction between “this API is callable” and “this call serves the experiment.”

The first version serves a developer through a browser, an ordinary computer, and a small local simulation. Azure subscriptions, IBM Quantum allocations, CUDA-capable GPUs, QPUs, and local foundation models become optional capability adapters rather than entry requirements. A developer can open the page, inspect a deterministic experiment request, receive a reasoned preflight decision, and run a small local simulation when it answers the question. Remote execution appears as a capability profile and readiness state outside the initial proof path.

This is why refusal becomes guidance. A strong refusal contains reason codes, evidence, and a repair path. `REJECT_RESOURCE` states which bound was exceeded. `DEFER_UNKNOWN` identifies stale or absent target information. `REQUIRE_CONSENT` identifies the action that needs authorization. The gate helps an agent form a better next request.

The rules experience therefore does more than introduce the article. It defines the product ethic. Access, authority, compatibility, and consent are different facts, and a robust browser agent preserves each one. A project form displays an opportunity while the rules define eligibility. A registered tool displays a capability while the preflight establishes whether a call is justified. The honest system makes that boundary visible before action.

---

# Chapter 2 — What WebMCP Actually Exposes

WebMCP currently carries Draft Community Group Report status.[4] That incubation stage supports serious research and prototyping while standardization and uniform cross-browser behavior continue to develop. The draft gives web applications a structured way to expose page-owned tools to an agent through `document.modelContext`. Application contracts, user decisions, and scientific methods supply the authority around those tools.

The value is concrete. A website can describe actions in machine-readable form, define argument schemas, validate inputs, execute page-owned logic, and return structured results. The agent can act through explicit contracts instead of inferring every action from visual layout or brittle DOM manipulation. The page presents its capabilities in the vocabulary of the application itself.

Chrome’s WebMCP guidance emphasizes specific, composable tools, runtime validation, useful descriptions, and responses that help an agent recover from an error.[5] One insight from the day’s viewing path stayed with me: each tool should own a distinct state transition. Two tools that both “plan” a quantum execution under different policies create ambiguity. A contract aligned with state transitions creates capability.

That changes the shape of WebMCP-QCG. An earlier sketch had separate target inspection, compatibility checking, evidence planning, simulation, and export tools. The cleaner candidate has four surfaces:

1. `inspect_quantum_experiment` parses a bounded native request into a versioned manifest and structural diagnostics.
2. `evaluate_quantum_call` compares that manifest with evidence and capability profiles, then returns one explicit preflight decision.
3. `run_bounded_qsharp_simulation` runs only when the evaluation selected the local QDK path and all limits pass.
4. `export_quantum_evidence_report` serializes the existing inputs, profiles, decision, invocation trace, result, and limitations as a reproducibility packet.

The second tool deliberately absorbs target compatibility and minimum-evidence planning. Those are two views of the same deterministic decision. Splitting them would allow contradictory outputs and force the model to adjudicate policy that belongs in code.

The GoogleChromeLabs `webmcp-tools` repository provides an Inspector and experimental evaluation tooling for examining registered tools and agent behavior.[6] Lighthouse also includes an informative audit for registered WebMCP tools.[7] These instruments answer different questions. The Inspector helps a developer see the contract exposed by a page and exercise it. Evaluation tooling helps test whether an agent can complete intended tasks. Lighthouse identifies the presence and shape of registered tools. The application’s evidence receipts carry the separate burden of scientific and safety validation.

For this project, observability is part of the application contract. A native WebMCP receipt records that the agent called the registered tool. The agent obtains the answer through that tool, while the visible DOM presents the human interface. A local simulation receipt records the pinned version, request hash, limits, timing, and result. A protective decision records `executor_invocations: 0` and `remote_requests: 0`, turning an avoided call into measurable evidence.

WebMCP supplies the exposure surface. The application owns the gate, evidence model, adapters, local Worker, consent policy, and reproducibility packet. This boundary mirrors what I learned from the earlier context-continuity study: WebMCP exposes what the page can do and knows now, while the harness or product above it manages memory, retention, policy, and cross-surface continuity.

The distinction controls scope. The page exposes small contracts backed by deterministic components. The agent selects and explains. The code validates, decides, and records. The browser mediates the interaction. Scientific authority remains a separate research responsibility, supported by the full chain rather than assigned to a single role.

---

# Chapter 3 — The Ideas I Left on the Bench

The repository begins with three lanes because I want the abandoned work to remain inspectable. An architecture decision is more useful when it records the alternatives, evidence, and reversal conditions than when it presents the selected idea as inevitable. The United Kingdom’s Architectural Decision Record framework formalizes that practice: capture context, decision, consequences, and status so later contributors can understand why a system took its present shape.[8]

NASA’s systems-engineering guidance treats decision analysis as a structured process: define alternatives and criteria, evaluate trade-offs, and document the rationale.[9] I applied a small version of that discipline alongside the excitement. The scoring balanced originality with WebMCP necessity, seven-day feasibility, proof quality, usefulness after the event, dependence on paid services, fit with my laptop, and the strength of claims I could demonstrate.

**Quantech Vid** would have been the simplest polished submission. A browser agent could inspect a page, gather media context, and help construct an educational quantum video workflow. It would produce a visible demonstration and fit my broader education work. Its main value could already be delivered through a conventional application, browser automation, or API integration. I placed it on the bench so the selected project could make the structured WebMCP boundary essential to the product.

**WebCCP** came from a real pain: losing task continuity while moving between browser, local code, and agent surfaces. Earlier experiments showed that a compact continuity packet can preserve decisions and next actions with less visible context than a full history. They also revealed the measurable weight of retained data and the risk of promoting stale information. I preserved WebCCP for a later experiment that can measure data volume, retention, freshness, and decision quality together. That architecture deserves a dedicated study beyond a one-week build.

**The WebMCP design studio** remains an excellent second project. It would use the Inspector, evaluation CLI, Lighthouse, and contract analysis to help a site owner create distinct, composable tools and test whether agents can use them. It is simpler, directly aligned with the ecosystem, and relevant to SecuredMe’s existing operator plugins. I kept it as SecuredMe’s next development instrument because the quantum problem offered the sharper immediate question: when does a structured call deserve execution?

The **multi-framework quantum connector** was the most seductive version of the selected lane and the one that required the deepest cut. Connecting four or five ecosystems sounded inclusive. In practice, it encouraged a universal adapter that would flatten distinct scientific and runtime contracts. It also pulled Colab, remote providers, authentication, QPU execution, circuit translation, visualization, and agent-to-agent communication into the critical path. I moved that platform roadmap beyond the hackathon and retained a focused decision layer for the demo.

The Open Science Framework’s registration model offers a useful analogy for preserving these choices.[10] A timestamped plan makes changes visible while later evidence determines the hypothesis. In the same spirit, the public repository will retain the candidate portfolio and dated decisions. Every probe can then show what was tried, what changed, and which lane earned the next stage. The record preserves the real path by which the product emerged.

Each idea retains a future lane. Quantech Vid can become an education project. WebCCP can return when context cost and freshness are measurable. The design studio can become a SecuredMe development instrument. The connector can grow into an adapter ecosystem around a smaller core. The seven-day artifact now carries one coherent responsibility, and the wider roadmap remains intact.

---

# Chapter 4 — Five Ecosystems, One Decision Contract

The word “quantum” can make distinct software surfaces appear closer than their contracts allow. Each framework lets a developer describe operations, run a simulator, or prepare work for hardware through its own native objects and execution semantics. WebMCP-QCG therefore shares a decision contract while every adapter preserves the scientific language of its framework.

Qiskit provides a broad software development kit for constructing circuits, retargeting them through transpilation, working with dynamic behavior, and interacting with quantum systems through provider and primitive interfaces.[11] In a Qiskit request, a circuit is meaningful alongside its classical registers, parameters, observables, target constraints, execution options, and result type. A gate that sees only a list of operations loses information needed to decide what evidence the user is asking for.

TorchQuantum uses PyTorch conventions: modules, dynamic computation graphs, autograd, batching, CPU/GPU simulation, and paths from trained models toward quantum execution.[12] A TorchQuantum workload may be a differentiable model rather than a standalone circuit job. Its meaningful constraints include device placement, batch shape, gradients, trainable parameters, and the classical optimization loop. Translating it into a generic gate list before evaluation could erase the reason the framework was chosen.

TensorFlow Quantum combines Cirq circuits and quantum observables with TensorFlow tensors and Keras layers.[13] The native artifact can therefore include symbolic parameters, differentiators, data pipelines, loss functions, and a training environment. A browser preflight can describe those requirements, compare them with the local adapter, and report the exact capability gap. Parsing a circuit fragment remains one input to that assessment rather than a substitute for the full training loop.

Microsoft’s Q# and QDK form another distinct surface. Q# is a quantum programming language, while the QDK supplies tooling for authoring, compilation, simulation, circuit inspection, resource estimation, and target-related workflows.[14] The public npm package is especially useful to this project because it exposes a precompiled WebAssembly boundary suitable for browser-oriented integration. Q# retains its own semantics, and QDK becomes a strong bounded adapter.

CUDA-Q emphasizes hybrid quantum-classical development and exposes multiple backend and target categories, including local simulation and remote or hardware-oriented options.[15] Its target abstraction is valuable prior art for a capability router. Its NVIDIA-oriented acceleration paths also illustrate the distinction between ecosystem support and capability on a specific machine. My CUDA-Q profile can state the available targets and identify my Intel integrated GPU as outside the accelerated path.

The fifth ecosystem in the project map is the cross-cutting provider and target layer surrounding these frameworks. IBM backends, Azure workspaces, CUDA-Q targets, local simulators, Colab runtimes, and future QPUs have different authentication, availability, cost, calibration, and execution contracts. Comparable circuit inputs can therefore produce different classes of evidence.

The common layer in WebMCP-QCG normalizes exactly what the gate needs to decide. A `QuantumExperimentManifest` can record a schema version, scientific question, requested operation class, source framework and version, native artifact hash, representation type, qubit or mode count, shots, observables, gradient and batching requirements, target class, resource ceilings, cost ceiling, evidence references, and consent policy. The artifact itself remains native or referenced by an opaque, verified handle.

Each adapter returns a `TargetCapabilityProfile` with its own version and provenance: local, remote, emulated, or hardware; supported task classes; known limits; authentication requirements expressed only as booleans; cost state such as `free`, `paid`, `unknown`, or `not_applicable`; and evidence state such as `static`, `probed`, `provider_reported`, or `unverified`. Unknown values stay unknown.

This is the minimum shared vocabulary required to refuse, defer, reuse, or authorize a bounded next step. The adapters preserve semantics. The gate normalizes the decision. That separation is the architectural center of the project.

---

# Chapter 5 — The Target Is Part of the Experiment

A logical circuit becomes an executable experiment through a target: supported instructions, connectivity, timing, error properties, resource limits, queue conditions, credentials, and provider-specific options. IBM’s `Target` model represents instruction and hardware constraints to the transpiler.[16] The Call Gate therefore brings target evidence into the request before a harmless logical circuit can become invalid, expensive, or scientifically misleading.

The Qiskit primitives sharpen this distinction. `SamplerV2` and `EstimatorV2` represent different classes of work: sampling bitstring outcomes and estimating expectation values.[17] Precision and shot behavior depend on the primitive and implementation. A request to “run this circuit” omits the result contract. The preflight should ask what claim the result must support before choosing an execution path.

This was the most important lesson I retained from the Qiskit webinar segment between approximately 06:00 and 15:00. The useful chain was map, optimize, execute, and post-process in relation to a processor. The presentation refreshed concepts I already knew and changed their role in the product. Processor selection belongs inside the evidence question from the beginning.

Suppose the user asks whether a Bell-state fixture produces correlated ideal outcomes. A small local simulator can answer that bounded question, so the preflight returns `READY_LOCAL` and selects the smallest method that supplies the evidence. A question about current device noise or calibration behavior requires a fresh target snapshot and explicit remote consent. When either element remains unresolved, the gate returns `DEFER_UNKNOWN` with the missing evidence named.

The decision order must be deterministic:

1. Reject malformed, unversioned, oversized, or secret-bearing input.
2. Reuse an exact, fresh, policy-compatible prior result when it answers the same question.
3. Return `REJECT_INCOMPATIBLE` when the adapter registry lacks the requested operation or evidence class.
4. Redirect toward compilation when the logical artifact is valid but target constraints are unmet.
5. Permit bounded local simulation when it can answer the stated question.
6. Mark a request `READY_REMOTE` only when compatibility, evidence sufficiency, cost state, limits, freshness, and consent are resolved.

In the seven-day scope, the sixth state remains documentary. Authorized execution lives in a separate capability with its own contract.

The newly released `qiskit-fermions` project added a useful research angle because fermionic problems force the representation question into the open.[18] Its repository and PyPI release establish an emerging package surface whose maturity remains a research question. A fermionic Hamiltonian, a qubit mapping, a compiled circuit, and an execution result are different artifacts. A future “fermion-to-qubit clinic” could help a user inspect those transformations after a dedicated executable probe establishes the package boundary.

For now, `qiskit-fermions` appears in the capability map and the research roadmap. The first proof remains smaller: one native Q# fixture, one pinned local adapter, one bounded result, and several refusal or defer fixtures. This focused scope demonstrates the shared decision layer with one operational adapter and honest profiles for the wider ecosystem.

Dynamic provider facts require fresh sources because queue time, pricing, calibration, and availability change. An unresolved profile returns `DEFER_UNKNOWN` and names the missing fact. Compatibility, availability, freshness, authenticity, truth, and authorization remain separate fields: a hash identifies content, while the surrounding evidence establishes the other properties.

By making the target part of the request, WebMCP-QCG changes the agent’s behavior. The model turns a user sentence into a structured experiment, receives deterministic reason codes, repairs missing information, and asks for consent when the request is ready. That is a smaller agent action and a better scientific contract.

---

# Chapter 6 — The Browser as a Bounded Quantum Surface

The Azure QDK webinar I watched in part supplied one durable feasibility insight: meaningful quantum tooling can run in the browser. The current QDK repository carries the technical authority. Its npm package exposes TypeScript entry points backed by Rust compiled to WebAssembly, with compiler and language-service capabilities designed for browser and Node consumers.[19]

I tested that boundary directly. On the available Windows machine, I installed the exact package `qsharp-lang@1.31.0`. The precompiled WebAssembly binary was 6,066,574 bytes. A local Node spike loaded the module, checked a two-qubit Q# Bell program with zero diagnostics, requested twenty shots, and returned the two correlated outcomes. The machine-readable receipt recorded 716 milliseconds. Runtime counters for Rust compilation, Azure services, model APIs, remote submission, and QPU access remained at zero; the published npm/WASM package and Node supplied the proof.

This is a real proof with a narrow meaning: the public package boundary can validate and simulate the fixture through Node on my laptop. The next evidence gates cover WebAssembly delivery through the web build, compilation inside a browser Worker, cancellation through Worker termination, and native WebMCP invocation by an agent.

Reusing QDK is faster and safer than rewriting it. A replacement would duplicate parsing, type checking, Q# semantics, lowering, simulation, diagnostics, circuit extraction, and perhaps QIR generation. WebMCP-QCG contributes the preflight and evidence boundary instead. The project imports the maintained engine behind a `QdkBrowserAdapter`, lazy-loads it after preflight selects the Q# path, and exposes the functions required by the proof.

The initial adapter can be limited to `validate` and `simulate`. Circuit extraction is optional. Source length, qubit count, shot count, result events, memory, and wall time must be bounded before the Worker starts. A timeout should terminate the Worker. Returned data should summarize outcomes and preserve diagnostics instead of transferring large internal state vectors into the interface.

QIR adds a second important boundary. Its specification separates language-specific, generic, and target-specific phases.[20] That structure supports a disciplined compilation pipeline while preserving the need for profiles, target lowering, runtime capabilities, and provider knowledge. WebMCP-QCG can record the QIR stage and any unresolved target-specific step. Cross-target portability remains an evidence-backed adapter property.

Cobweb supplies a different browser pattern. The exact commit that introduced its WebMCP bridge shows a browser MicroPython environment exposing structured tools and requesting approval before executing files.[21] Its demonstrated scope is a browser approval architecture around a powerful local capability. WebMCP-QCG transfers that pattern to its own quantum adapters while treating quantum-backend validation as a separate proof.

The browser’s role is substantial and bounded. It can host the interface, register WebMCP tools, validate manifests, evaluate policy, lazy-load a compiler, run small simulations in a Worker, and export evidence. It can also present capability profiles for Colab, remote simulators, or QPUs. A separately authorized executor owns every remote call.

This boundary gives the demo an honest multi-ecosystem shape. One adapter can be operational, a second can demonstrate manifest portability, and the remaining profiles can state `unverified` or `not_available_in_this_build`. An unsupported path produces a refusal or defer receipt, which carries stronger evidence than a mocked success.

The QDK spike changed the project because it resolved a feasibility question. The laptop can run the compiler and a small simulation. The next proof is precise: move the verified public boundary into a Worker, call it through WebMCP, and preserve a trace that distinguishes those events. That is an achievable vertical slice.

---

# Chapter 7 — Designing for an Ordinary Computer

My laptop provides a useful design constraint. The development machine has an Intel Core i5-8265U, four physical cores, eight logical processors, 31.3 GB of visible memory, Intel UHD 620 graphics, and no NVIDIA CUDA GPU. It supports normal web development, Node tooling, WebAssembly, Workers, and small quantum simulations. Large language models and accelerated quantum workloads belong to an optional remote tier.

The architecture separates work by cost and authority. The language model can remain remote, as it already does when I use Codex. The page, WebMCP contract, policy evaluation, manifest hashing, evidence comparison, and bounded simulator remain local. An optional remote tier can later handle workloads that truly require it.

State-vector simulation creates a hard physical boundary because the representation grows exponentially with the number of qubits. Qiskit Aer exposes memory and execution controls for its `StatevectorSimulator`, including CPU/GPU options and a maximum-memory setting.[22] At sixteen bytes per complex amplitude, the theoretical vector alone is roughly 256 MB at 24 qubits, 1 GB at 26, 4 GB at 28, and 16 GB at 30, before runtime overhead, copies, results, and the rest of the browser. Those numbers illustrate the growth curve; measured runtime policy determines the product limits.

For the first browser proof, the fixed Bell fixture uses two qubits and twenty shots. A later user-controlled simulation might begin with conservative limits such as 12 qubits, 1,000 shots, one Worker, and a five-second timeout. Browser profiling will convert those candidate values into product policy. The gate calculates or estimates workload pressure, compares it with the active policy, and returns `REJECT_RESOURCE` before engine loading when the request exceeds the bound.

Google Colab remains useful as an optional research environment, especially for Python-heavy frameworks whose runtime belongs outside the browser. Its own FAQ explains that resources and limits fluctuate and that free managed runtimes restrict certain usage patterns.[23] Those characteristics position Colab as a visible remote adapter with explicit authentication, runtime uncertainty, and consent. The deterministic hackathon path remains local.

The local-first choice also has an access dimension. The ITU continues to document major inequalities in connectivity, affordability, skills, and meaningful use.[24] That evidence supports an accessible entry path built around a browser, an ordinary computer, and a small educational or preflight workflow. Broader claims about the digital divide remain outside the prototype’s evidence.

Local-first software research argues for keeping the primary copy and immediate interaction under user control while using servers as supporting infrastructure.[25] WebMCP-QCG applies that principle to a different product category. The request, policy, local evidence, decision receipt, and bounded result remain available to the user before any remote submission. Provider data can enrich a target profile while the local workflow remains authoritative for the preflight.

This design makes the system resilient as well as accessible. An unreachable provider API produces `DEFER_UNKNOWN` and preserves the local evidence. The page keeps deterministic controls and reports available during a model-service interruption. A browser with limited WebMCP support can reach the same functions through the visible interface. Agentic access improves the product while the human interface remains a full entry path.

The laptop constraint therefore becomes an architectural advantage. It forces the first proof to be small, measurable, and honest. The demo earns its value by selecting the smallest resource that answers the question and by recognizing when existing evidence is already sufficient.

---

# Chapter 8 — WebMCP-QCG: Decide Before You Spend

WebMCP Quantum Call Gate is a decision system placed between an agent’s request and any quantum executor. Its job is to determine whether the request is structurally valid, compatible with available capabilities, already answered by acceptable evidence, within resource policy, and authorized. It can recommend a bounded local simulation. Remote purchase, queueing, and submission belong to a separate consented executor.

The closest project I found in the competitive scan was Sumi, an AI-assisted quantum learning environment that describes, constructs, simulates, and explains circuits with local Qiskit or Cirq capabilities and an optional MCP surface.[26] Sumi occupies the educational construction space. WebMCP-QCG occupies preflight governance: it evaluates a proposed action before execution, compares evidence and target requirements, and records a zero-call proof when policy resolves the request early. The two products can eventually interoperate through their distinct responsibilities.

The gate begins with a versioned `QuantumExperimentManifest`. It records the purpose of the experiment, the native artifact reference and observed hash, framework and adapter versions, operation class, requested target class, qubits or modes, shots, observables, gradient or batching requirements, resource ceilings, cost ceiling, evidence references, and authorization reference. Secrets are prohibited. The code computes the digest itself instead of trusting a hash supplied by an agent.

The minimal output is a versioned decision receipt:

```json
{
  "decision": "REUSE_EVIDENCE | REJECT_INCOMPATIBLE | REJECT_RESOURCE | DEFER_UNKNOWN | REQUIRE_CONSENT | READY_LOCAL | READY_REMOTE",
  "reason_codes": [],
  "selected_adapter": null,
  "execution_authorized": false
}
```

The receipt also binds the exact request hash, policy hash, target snapshot, evidence packet, adapter version, consent receipt when applicable, and expiry. `READY_REMOTE` still sets `execution_authorized` to false in the MVP. A separate, future executor would require a single-use authorization tied to the same request and limits.

Evidence reuse needs a freshness model. HTTP caching provides a useful engineering analogy: freshness, age, validation, and reuse are separate concepts.[27] Scientific policy supplies its own domain-specific validity window, input equivalence test, target scope, method version, and consent compatibility. RFC 9111 contributes the discipline of explicit revalidation while the experiment defines the meaning of valid evidence.

Provenance must be equally explicit. PROV-O distinguishes entities, activities, agents, generation, derivation, and attribution.[28] It gives the evidence packet a vocabulary for saying what artifact was used, what activity produced the result, which software and person were involved, and how a later decision derived from earlier evidence. Separate validity, freshness, and authorization checks complete that lineage.

Five governance patterns from my earlier FNP-QNN work transfer into this design while its speculative engine and quantum-inspired gates remain in their source project. First, create an action map before exposing capabilities. Second, assign every capability an explicit state such as read-only, bounded simulation, consent required, experimental hidden, or disabled unsafe. Third, version manifests, decisions, and evidence as immutable contracts. Fourth, keep result, provenance, and authorization separate. Fifth, require a readiness gate before any capability is promoted.

These patterns make refusal constructive. `REJECT_INCOMPATIBLE` can identify an unsupported operation or representation. `REJECT_RESOURCE` can report the estimated memory or time conflict. `DEFER_UNKNOWN` can name an expired target snapshot, unknown price, unavailable calibration, or missing evidence type. `REQUIRE_CONSENT` can state the proposed remote action and ceiling. The agent receives information it can use to repair the request.

The product’s strongest demo may be a protective proof. One fixture will intentionally exceed policy or request evidence beyond the local simulator’s capability. The gate will resolve the request before engine import or network access. Instrumentation will show zero adapter invocations and zero remote requests. That first-class trace is the product result.

The tagline “decide before you spend” includes money and extends to time, energy, quota, attention, and scientific confidence. A system that can show existing evidence already answers the question creates more value than an agent that always finds a way to run something.

---

# Chapter 9 — A Public Proof Outlives a Large Promise

The first public version of this repository will contain more research than application code, with every status stated exactly. End-to-end status becomes earned when a browser registers the tools, an agent invokes them, a Worker runs the pinned simulation, and an evidence packet proves each transition.

The Turing Way describes reproducible research as a complete practice around final results. Version control, documented environments, executable workflows, tests, data and dependency records, and clear instructions help another person obtain the same result.[29] NISO’s reproducibility terminology likewise distinguishes claims such as repeatability and reproducibility instead of compressing them into a decorative badge.[30] I will use those ideas as a publication discipline, while scientific peer review remains a separate process.

The public proof should include seven fixtures:

- a fresh exact result that can be reused;
- an incompatible format or target;
- an estimated memory requirement above policy;
- a stale target snapshot;
- an unknown cost or unavailable provider fact;
- missing consent for a remote-capable action;
- a bounded local simulation that is permitted.

Each fixture will produce a machine-readable manifest, decision, reason codes, policy hash, adapter trace, timing, and evidence packet. The positive QDK fixture records the exact package version and WebAssembly asset. The protective fixtures record `simulation_adapter_calls: 0` and `remote_network_calls: 0`. A mock output identifies itself as `mock`, preserving a clear boundary from remote or QPU evidence.

The demo page will keep shortcut answers out of its DOM. The agent discovers registered tools and obtains the result through them. Application-side logs confirm native invocation. The Inspector shows the contracts during development, evaluation tooling exercises task completion, and Lighthouse reports registered tools. The repository’s own receipts remain the proof of what happened.

Reproducibility also means preserving failures. Worker-loading errors, irregular WebMCP discovery, visible-interface fallbacks, and second-adapter incompatibilities all belong in the report. A partial result with clear boundaries creates more value than a polished video that hides the critical path.

The video, when recorded, should be short enough to audit. It can show the same request moving through inspection, preflight, and either local simulation or a protective decision. The screen should expose the reason code, versions, invocation log, and execution counters. The narration will state the current proof envelope: browser-local execution, with QPU behavior, remote cost, universal translation, and benchmarked savings reserved for later evidence.

The open repository must also distinguish old work from new hackathon work. Research inherited from the earlier WebMCP–CCP study or FNP-QNN architecture will be labeled as prior context. The QCG contracts, spike, browser implementation, fixtures, tests, and evidence created during this sprint will have dated commits. A third-party notice will preserve the QDK attribution, and the repository license will make the permissions explicit.

Success at the end of the build requires one honest vertical slice and one portable decision contract. A strong result will demonstrate native WebMCP invocation, deterministic preflight, a bounded local execution, an instrumented refusal, evidence export, and a second framework profile whose status matches its proof.

This is the standard I want to carry beyond the event. A public repository should make the next contributor less dependent on my explanation. If the code fails, the evidence should reveal where. If the architecture changes, the ADR should reveal why. If the product refuses, the reason should be useful. That is a more durable achievement than a large promise made at the end of an exhausted day.

---

# Conclusion — What the Dream Can Add

Day 2 ends with a product decision and a clear build path. I know what I am presenting: a WebMCP decision gate placed before quantum execution. It accepts a native, bounded request; separates content identity from truth and authorization; compares it with versioned evidence and capability profiles; and returns an inspectable decision. It may reuse evidence, reject, defer, require consent, or permit a bounded local proof. Paid or remote submission belongs to a separate authorized executor.

The product is a framework-preserving decision contract sized for browser execution and external evidence. Framework adapters retain their native semantics. A remote model can support the agent while deterministic code owns the decision. Colab remains an optional remote profile. Browser simulations carry their own evidence class, distinct from QPU behavior. WebMCP exposes the contract, while continuity and memory remain harness responsibilities.

The day’s research made that positive boundary possible. WebMCP supplies a structured page-owned tool surface. Qiskit clarified the relationship between targets, primitives, and evidence. TorchQuantum and TensorFlow Quantum showed the native requirements carried by differentiable training workloads. QDK proved that a maintained compiler and small simulator can cross the WebAssembly boundary on an ordinary machine. CUDA-Q showed the value of target-agnostic orchestration while each target retains its contract. Provenance, freshness, local-first design, and reproducibility sources supplied the disciplines needed around the call.

The most concrete result is modest and real: a pinned QDK package validated and simulated a two-qubit Bell fixture locally, returning only correlated outcomes in the canonical 716-millisecond receipt. The next critical proof is clear: move that boundary into a browser Worker, expose the gate through native WebMCP, and preserve logs that prove both invocation and non-invocation.

Tomorrow’s design decisions are now focused: the exact three-minute interaction, the final count of three or four tools, the primary path after comparable QDK and Qiskit/Aer probes, the visual interface, the role of `qiskit-fermions`, the second adapter profile, and browser-measured ceilings for qubits, shots, memory, and time.

This is where I am allowing imagination back into the process. After nearly thirty-seven hours inside forty-eight, another hour of navigation is less likely to improve the decision than sleep. I will let the product appear in the dream if it wants to. Tomorrow, however, every new idea must pass the invariants already fixed: native semantics remain visible; execution stays separate from authorization; paid and remote action stays disabled; local proof stays bounded; refusals stay explainable; and every claim remains tied to an observable receipt.

A night’s sleep now gets one focused question: which interaction will make this architecture immediately obvious in three minutes?

The repository opens now because the process is part of the contribution. The code will follow in public. The written rule limits the prize path while leaving learning, building, publishing, and contribution fully open. Success means making the smallest justified quantum call—and recognizing when existing evidence is already sufficient.

---

# Research Viewing Log

The following presentations shaped my learning path as orientation resources. The primary sources in the reference sheet carry the technical claims.

## Day 1 — August 26, 2026

**W1. Builder Bootcamp: Agents — OpenAI Academy.** Marcus Stallworth, Jeffrey Fan, Aruna Chakkirala, and Tanner Wride are listed on the post-event page. Status: **watched complete and structured**. <https://academy.openai.com/public/clubs/builders-etkn1/events/builder-bootcamp-agents-dnn3r6iuhf>

**W2. WebMCP — Making Agents a First-Class Citizen of the Web.** André Cipriani Bandarra and François Beaufort, WeAreDevelopers / Coffee With Developers, published February 16, 2026. Status: **watched complete; transcript notes completed**. An Inspector demonstration occurred around 13:30, though my notes referenced both WebMCP presentations and I do not treat that timestamp as exclusive attribution. <https://www.wearedevelopers.com/videos/1811-webmcp-making-agents-a-first-class-citizen-of-the-web-andre-cipriani-bandarra-francois-beaufort>

## Day 2 — August 27, 2026

**W3. Build your website for the agentic era.** Kasper Kulikowski, Chrome for Developers, Google I/O 2026, May 22, 2026. Status: **watched complete**. Passages retained in my notes: 22:36–24:08; 29:04 on composable, non-overlapping tools; 30:57 on Lighthouse; and 31:21 on the repository/contribution path. <https://www.youtube.com/watch?v=HdCc-KezQPk>

**W4. Run Quantum Circuits with Qiskit Primitives.** Qiskit, July 17, 2024. Status: **watched and cross-referenced**. The main project-relevant passage was approximately 06:00–15:00, including target selection, mapping, optimization, execution, topology, routing, and post-processing. <https://www.youtube.com/watch?v=NTplT4WnNbk>

**W5. Exploring the Azure Quantum Development Kit.** Scott Hanselman and Stefan Wernli, Azure Friday / Microsoft, March 1, 2024. Status: **viewed in part**. The 02:11–05:00 browser/WASM segment was retained as historical feasibility orientation; current QDK source and package evidence govern technical claims. <https://www.youtube.com/watch?v=PD0wHX6edIg>

**W6. Accelerating Quantum Supercomputing with CUDA-Q.** NVIDIA Developer, 2025. Status: **viewed in part, approximately half**. The retained value was its qubit-agnostic platform framing and hybrid CPU/GPU/QPU orchestration; delivery style led me to stop before completion. <https://www.youtube.com/watch?v=DqPC-nlcXKA>

---

# References

All online sources were last checked on August 27, 2026. Each numbered source is assigned to one chapter only in the project’s locked evidence matrix.

## Chapter 1

1. OpenAI and Devpost. “WebMCP Challenge — Official Rules.” <https://webmcp.devpost.com/rules>
2. Open Source Initiative. “The Open Source Definition.” <https://opensource.org/osd>
3. UNESCO. “Recommendation on Open Science.” <https://www.unesco.org/en/legal-affairs/recommendation-open-science>

## Chapter 2

4. Web Machine Learning Community Group. “WebMCP — Draft Community Group Report.” <https://webmachinelearning.github.io/webmcp/>
5. Chrome for Developers. “WebMCP best practices.” <https://developer.chrome.com/docs/ai/webmcp/best-practices>
6. GoogleChromeLabs. “webmcp-tools.” Inspector and experimental Evals CLI; not an officially supported Google product. <https://github.com/GoogleChromeLabs/webmcp-tools>
7. Chrome for Developers. “Lighthouse audit: Registered WebMCP tools.” <https://developer.chrome.com/docs/lighthouse/agentic-browsing/registered-webmcp-tools>

## Chapter 3

8. UK Department for Science, Innovation and Technology and Government Digital Service. “Architectural Decision Record Framework.” <https://www.gov.uk/government/publications/architectural-decision-record-framework/architectural-decision-record-framework>
9. NASA. “Systems Engineering Handbook, 6.8 Decision Analysis.” <https://www.nasa.gov/reference/6-8-decision-analysis/>
10. Open Science Framework. “Registrations and Preregistrations.” <https://help.osf.io/article/330-welcome-to-registrations>

## Chapter 4

11. Javadi-Abhari, Ali, et al. “Quantum computing with Qiskit.” arXiv:2405.08810. <https://arxiv.org/abs/2405.08810>
12. MIT HAN Lab. “TorchQuantum.” <https://github.com/mit-han-lab/torchquantum>
13. Broughton, Michael, et al. “TensorFlow Quantum: A Software Framework for Quantum Machine Learning.” arXiv:2003.02989. <https://arxiv.org/abs/2003.02989>
14. Microsoft Quantum. “Introduction to Q#.” <https://learn.microsoft.com/en-us/azure/quantum/qsharp-overview>
15. NVIDIA. “CUDA-Q Backends.” <https://nvidia.github.io/cuda-quantum/latest/using/backends/backends.html>

## Chapter 5

16. IBM Quantum. “Represent quantum computers for the transpiler.” <https://quantum.cloud.ibm.com/docs/en/guides/represent-quantum-computers>
17. IBM Quantum. “Qiskit Primitives API.” <https://quantum.cloud.ibm.com/docs/en/api/qiskit/primitives>
18. Qiskit. “qiskit-fermions.” Repository: <https://github.com/Qiskit/qiskit-fermions>. Release registry: version 0.1.0, published August 14, 2026, <https://pypi.org/project/qiskit-fermions/>

## Chapter 6

19. Microsoft QDK. “qsharp npm module.” <https://github.com/microsoft/qdk/tree/main/source/npm/qsharp>
20. QIR Alliance. “Quantum Intermediate Representation specification.” <https://github.com/qir-alliance/qir-spec/blob/main/specification/README.md>
21. Bandarra, André. “Cobweb WebMCP integration commit.” Commit `837329616972ec2d5f1df69aa4eed70adb13d5c7`. <https://github.com/andreban/cobweb/commit/837329616972ec2d5f1df69aa4eed70adb13d5c7>

## Chapter 7

22. Qiskit Aer. “StatevectorSimulator.” <https://qiskit.github.io/qiskit-aer/stubs/qiskit_aer.StatevectorSimulator.html>
23. Google Colab. “Frequently Asked Questions.” <https://research.google.com/colaboratory/intl/en-GB/faq.html>
24. International Telecommunication Union. “Measuring digital development: Facts and Figures 2025.” <https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/>
25. Kleppmann, Martin, et al. “Local-First Software: You Own Your Data, in spite of the Cloud.” <https://www.inkandswitch.com/local-first/static/local-first.pdf>

## Chapter 8

26. Chawdhury, Dhrubo Jyoti. “Sumi / 1StopQuantum.” <https://github.com/dlyog/sumi>
27. Internet Engineering Task Force. “RFC 9111: HTTP Caching.” <https://www.rfc-editor.org/rfc/rfc9111.html>
28. World Wide Web Consortium. “PROV-O: The PROV Ontology.” <https://www.w3.org/TR/prov-o/>

## Chapter 9

29. The Turing Way Community. “Guide for Reproducible Research.” <https://book.the-turing-way.org/reproducible-research/reproducible-research/>
30. National Information Standards Organization. “RP-31-2021, Reproducibility Badging and Definitions.” Published January 28, 2021. DOI: `10.3789/niso-rp-31-2021`. <https://www.niso.org/publications/rp-31-2021-badging>

---

**Document status:** Day 2 English field report. Repository publication is in progress. Devpost project creation is pending; submission state is `not_submitted`.
