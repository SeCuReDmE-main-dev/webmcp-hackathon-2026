# Action 98 — Three-year quantum access vision

**Working thesis:** the same front door, different computational substrates
**Research date:** 2026-08-29
**Horizon:** 2027–2029
**Status:** research complete; editorial integration pending
**Scope:** browser-accessible quantum development, AI assistance, HITL authority, neutral-atom milestones and the role of WebMCP-QCG

## Direct finding

I can defend a three-year vision in which an ordinary browser becomes a practical control surface for quantum authoring, inspection, bounded simulation, resource-aware preflight and deliberate delegation to larger simulators or QPUs. I cannot defend a claim that a classical browser simulator will generally match the computational capacity or physical behaviour of a quantum processor.

The strongest formulation is therefore:

> By 2029, quantum development may become accessible from an ordinary browser at the level of authoring, inspection, bounded simulation, preflight and controlled delegation. Large general-purpose simulations will continue to require specialized classical infrastructure or quantum hardware.

This framing gives WebMCP-QCG a precise future role. The browser can become the shared decision surface. The execution substrate can remain local WebAssembly, an off-device accelerator, a provider simulator or a physical QPU. QCG can identify which substrate is being proposed, explain the evidence and limitations, preserve human authority and export a receipt before an expensive or irreversible action begins.

## The thermal distinction that must remain exact

The Japanese Shunkai announcement is a meaningful hardware milestone. On 24 August 2026, the Institute for Molecular Science announced that Japan's first full-stack neutral-atom quantum computer was operational. The early system is expected to use approximately 50 qubits and later expand toward approximately 500. Partial external access, error-correction work and a 10,000-physical-qubit target by March 2031 are published plans rather than completed outcomes.

The phrase **room-temperature operation** describes the apparatus and the absence of the dilution refrigerator used by some other modalities. It does not mean that the atomic qubits are warm. JST describes neutral-atom systems as arrays of **ultracold atoms** assembled with optical tweezers while the overall system operates at room temperature. Independent experimental work likewise reports room-temperature vacuum apparatus together with active cooling of trapped atoms.

The public-safe sentence is:

> Shunkai uses ultracold neutral atoms as qubits inside an apparatus that operates at room temperature and requires no cryogenic refrigerator.

The sentence “the atoms no longer need cooling” is excluded because it would contradict the cited physics.

## Evidence classification

### 1. Demonstrated facts

| Evidence | What the source establishes | Product meaning |
|---|---|---|
| IMS announced Shunkai operational on 24 August 2026. | A full-stack neutral-atom system now exists in Japan; IMS identifies Hitachi on the software stack and Infleqtion on the QPU stack. | QCG can discuss a real emerging execution modality rather than a fictional one. |
| IMS publishes an early scale of approximately 50 qubits and a later target near 500. | These are the announced deployment stages; partial external availability is planned. | Target profiles need a timestamp and status because platform capabilities change. |
| JST describes ultracold atoms in optical tweezers while the whole system operates at room temperature. | The apparatus avoids a refrigerator while the qubits still require atomic cooling and control. | QCG must preserve modality details instead of compressing them into a misleading badge. |
| FY2024 Moonshot reporting documents a fabricated QPU module, detection fidelity above 99%, an automated 800-tweezer pattern and a demonstrated principle of state-selective nondestructive measurement. | Substantial subsystem progress predates the full-stack announcement. | A gate should distinguish subsystem metrics, integrated-system status and roadmap targets. |
| A 2025 Nature paper demonstrated an array with more than 6,100 neutral atoms, a 12.6-second hyperfine-qubit coherence time and high-fidelity imaging in a room-temperature apparatus. | Large atom arrays and strong component metrics are experimentally real. | Array size alone is not a receipt for universal application performance. |
| A separate neutral-atom experiment used up to 448 atoms to demonstrate important fault-tolerant architecture mechanisms and below-threshold behaviour in a bounded characterization circuit. | Error-correction building blocks are progressing while large-scale fault-tolerant computation remains a formidable integration challenge. | QCG should carry the exact experiment, code, round count, assumptions and limits behind a readiness claim. |
| Microsoft's QDK core targets WebAssembly and powers a browser Q# experience. | Q# compilation and simulation can execute in a browser; the official package supports Worker-based integration. | The current QCG Q# Worker follows an established technical path. |
| Microsoft documents browser Q# authoring and AI assistance without installation or an Azure account. | Browser-accessible, AI-assisted quantum development already exists for a bounded ecosystem. | The three-year vision starts from a demonstrated baseline. |
| IBM and AWS document exponential scaling and practical simulator ceilings. | General classical quantum simulation remains bounded by memory, circuit structure, qubit count and noise-model complexity. | A preflight gate must select a fitting simulation method or defer to specialized infrastructure. |
| The WebMCP draft API exposes structured page tools to agents and describes collaborative workflows with shared context and user control. | A browser page can become an explicit agent interaction surface. | QCG can make HITL state part of the product rather than a separate chat convention. |

### 2. Inferences grounded in multiple sources

- I infer that the browser can become the common control surface even while computation remains distributed across different substrates.
- I infer that increasing neutral-atom scale and external access will make target freshness, capability profiles and pre-execution evidence more important.
- I infer that AI assistance will reduce the effort required to author, inspect and explain quantum programs more quickly than it will remove the physical and classical-compute limits of execution.
- I infer that a provider-neutral receipt can remain useful across local simulation, cloud simulation and hardware preparation because the receipt records the decision boundary rather than pretending to replace the runner.
- I infer that the highest-value HITL moment occurs before credentials, queue entry or spend: the agent recommends; deterministic policy checks; the human accepts, defers or overrides; the receipt records the authority state.

These are product and editorial inferences. They are not experimental results.

### 3. Plausible 2027–2029 horizon

#### 2027 — browser-native preparation becomes ordinary

Q# already proves browser compilation and simulation. A plausible next step is broader use of Workers, WebAssembly improvements, better circuit visualization, resource estimation and agent-facing tools. QCG can make inspection, bounded simulation and evidence export understandable from one page.

#### 2028 — capability negotiation becomes more valuable

JST's current Ohmori project sets a 2028 milestone for demonstrating the effectiveness of quantum error correction and allowing external users within the project to run circuits. This is a goal, not a guaranteed result. If access broadens, developers will need dated target profiles, explicit supported instruction sets, queue and cost states, and a way to compare a local proof with a proposed hardware run.

#### 2029 — the browser can become the hybrid workflow console

A plausible 2029 workflow starts in an ordinary browser, evaluates a scientific artifact, selects a bounded local simulator when appropriate, recommends a specialized cloud or HPC simulator for larger cases, and prepares a deliberate handoff to hardware when evidence and authority align. The interface may feel unified; the computational substrate remains explicit.

### 4. Speculation and prohibited factual extensions

The following ideas can appear only as clearly labelled personal vision or long-range questions:

- arbitrary quantum programs becoming classically simulable at QPU scale;
- a universal fault-tolerant personal quantum computer by 2029;
- AI removing exponential state-space growth;
- Shunkai already delivering useful quantum advantage;
- Shunkai already operating 500 or 10,000 physical qubits;
- Shunkai already being fault tolerant;
- neutral-atom qubits operating as warm atoms;
- universal provider compatibility through one browser schema.

## Why this matters to WebMCP-QCG

My vision becomes concrete when QCG displays the boundary between five things:

1. **Artifact truth** — what source was inspected, its digest, format, compiler and relevant observable.
2. **Simulation envelope** — which simulator class fits, what limits apply and what approximation enters the result.
3. **Target truth** — which QPU or provider profile was captured, when it expires and which facts remain unknown.
4. **Authority state** — what the agent recommends and what I accept, defer or override.
5. **Effect receipt** — whether the workflow stayed local, used an off-device simulator or crossed into external execution.

This model avoids a false binary between “quantum in the browser” and “real quantum.” The browser can perform real classical computation about quantum programs, including exact or approximate simulation within declared bounds. A QPU performs a different physical computation. QCG can help a developer understand which path is in front of them before the agent invokes it.

## Three-year product implications

These are research-backed design directions, not commitments to the current MVP:

- add a visible `execution_substrate` classification such as `browser_wasm`, `local_native`, `remote_simulator` or `qpu`;
- attach a `simulation_method`, applicability statement and resource envelope to every simulated result;
- preserve target modality, profile hash, capture time and expiry;
- distinguish exact, noisy, approximate, hardware-emulated and physical results;
- record whether AI generated, transformed, explained or merely selected an artifact;
- keep agent recommendation, deterministic validation and human authorization as separate states;
- export one evidence receipt whose claims remain readable when the future runner changes.

## Editorial voice seed

I have imagined broadly accessible quantum tools for years. The responsible version of that vision now has a sharper shape. I am not waiting for a quantum processor to sit inside every laptop. I am building toward a browser where far more people can formulate an experiment, inspect its limits, simulate the part that fits, understand the next substrate and retain authority over the call.

Shunkai matters to me because it shows that hardware assumptions can change. Its apparatus operates at room temperature while ultracold atoms remain under precise optical control. The QDK matters because it shows that serious quantum development can already enter an ordinary browser. IBM and AWS matter because they keep the physical boundary honest: general simulation still grows exponentially.

WebMCP-QCG belongs between those truths. It can help an agent and a developer decide which work belongs in the browser, which work belongs on specialized classical infrastructure and which work has earned a deliberate hardware call.

## Fiction provenance boundary

The private work *Quantum 734* records part of the long-standing imagination behind this direction. It supplies provenance of motivation only. It provides no technical evidence, performance claim or forecast. The public article can state that I have carried this intuition for years; every scientific claim must still resolve to the sources below.

## Primary and authoritative sources

1. Institute for Molecular Science, [“Japan’s First Full-Stack Neutral-Atom Quantum Computer ‘Shunkai’ Is Operational”](https://www.ims.ac.jp/en/news/2026/08/0824.html), 24 August 2026.
2. Infleqtion, [“Infleqtion Collaboration with Japan Moonshot Program Achieves Major Milestone”](https://infleqtion.com/infleqtion-collaboration-with-japan-moonshot-program-achieves-major-milestone-shunkai-neutral-atom-quantum-computer-now-operational/), 24 August 2026. Partner announcement; roadmap statements treated as forward-looking.
3. Japan Science and Technology Agency, [“Neutral Atom-Based Fault-Tolerant Quantum Computer”](https://www.jst.go.jp/moonshot/en/program/goal6/6D_ohmori.html), current project page.
4. Japan Science and Technology Agency, [Ohmori project progress through FY2024](https://www.jst.go.jp/moonshot/en/program/goal6/appeal/69_ohmori_ap01.html).
5. Institute for Molecular Science, [neutral-atom commercialization platform announcement](https://www.ims.ac.jp/en/news/2024/02/0227.html), 12 March 2024.
6. Hitachi, [Moonshot Goal 6 Phase 2 participation](https://rd.hitachi.com/_ct/17843315?o=0&tg=manufacturing), 3 March 2026.
7. Cabinet Office of Japan, [Moonshot Goal 6](https://www8.cao.go.jp/cstp/english/moonshot/sub6_en.html).
8. Manetsch et al., [“A tweezer array with 6,100 highly coherent atomic qubits”](https://www.nature.com/articles/s41586-025-09641-4), *Nature* 647, 60–67 (2025).
9. Bluvstein et al., [“A fault-tolerant neutral-atom architecture for universal quantum computation”](https://www.nature.com/articles/s41586-025-09848-5), *Nature* 649, 39–46.
10. Microsoft, [Quantum Development Kit repository](https://github.com/microsoft/qdk) and [Q# npm module](https://github.com/microsoft/qdk/blob/main/source/npm/qsharp/README.md).
11. Microsoft Quantum, [“Introducing the Microsoft Quantum Development Kit Preview”](https://quantum.microsoft.com/en-us/insights/blogs/qir/introducing-the-microsoft-quantum-development-kit-preview).
12. Microsoft Learn, [“Different ways to run Q# programs”](https://learn.microsoft.com/en-us/azure/quantum/qsharp-ways-to-work).
13. Microsoft Learn, [“Overview of quantum simulators in the QDK”](https://learn.microsoft.com/en-us/azure/quantum/simulators-overview-qdk), updated 31 July 2026.
14. IBM Quantum, [quantum simulation and hardware considerations](https://quantum.cloud.ibm.com/docs/en/guides/debugging-tools).
15. Amazon Braket, [“Submitting quantum tasks to simulators”](https://docs.aws.amazon.com/braket/latest/developerguide/braket-submit-tasks-simulators.html).
16. Web Machine Learning Community Group, [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/), 26 August 2026 draft.
17. QIR Alliance, [QIR Base Profile](https://github.com/qir-alliance/qir-spec/blob/main/specification/profiles/Base_Profile.md).

All URLs were checked on 2026-08-29. Product, roadmap and draft-specification claims require revalidation before publication.
