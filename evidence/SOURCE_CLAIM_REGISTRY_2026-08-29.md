# WebMCP-QCG — source and claim registry

Date: 2026-08-29
Policy: local repo truth → official docs/specifications → maintainer sources → secondary evidence
Statuses: `confirmed by primary sources`, `inferred from multiple sources`, `tentative`

## Source registry

| ID | Source | Type | Use |
|---|---|---|---|
| S01 | `HACKATHON_STATE.json` | Local state | Current prototype, deployment and Devpost status |
| S02 | `.devpost-hackathon-state.json` | Local live snapshot | Challenge IDs, deadline, deliverables and submission state |
| S03 | `evidence/browser/qcg-native-browser-proof-2026-08-28.json` | Local machine-readable receipt | Native tool calls, Bell result and counters |
| S04 | `evidence/qa/DAY3_RELEASE_QA_2026-08-28.md` | Local QA | Install, tests, build and security-report status |
| S05 | `prototype/webmcp-qcg/src/contracts.ts` | Local code | Input bounds and strict schemas |
| S06 | `prototype/webmcp-qcg/src/services.ts` | Local code | Deterministic decisions, logs and receipt behavior |
| S07 | `prototype/webmcp-qcg/src/webmcp.ts` | Local code | Progressive native tool registration |
| S08 | [WebMCP specification](https://webmachinelearning.github.io/webmcp/) | Primary standard | Browser tool model |
| S09 | [Chrome WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp) | Primary product docs | Current API and testing surface |
| S10 | [Secure WebMCP tools](https://developer.chrome.com/docs/ai/webmcp/secure-tools) | Primary security docs | Trust and confirmation boundaries |
| S11 | [qBraid Agent Mode](https://docs.qbraid.com/v2/ai/user-guide/agent-mode) | Primary product docs | Agent execution and approval checkpoints |
| S12 | [qBraid AI/MCP overview](https://docs.qbraid.com/v2/ai/user-guide/overview) | Primary product docs | Live device, queue and pricing context |
| S13 | [qBraid SDK overview](https://docs.qbraid.com/v2/sdk/user-guide/overview) | Primary SDK docs | `TargetProfile`, conversions and validation |
| S14 | [qBraid pricing](https://qbraid.com/pricing) | Primary commercial source | Public packaging and execution credits |
| S15 | [Open Quantum MCP tools](https://docs.openquantum.com/mcp/tools/) | Primary product docs | Quote, spend preview and separate submit step |
| S16 | [Open Quantum pricing](https://www.openquantum.com/pricing) | Primary commercial source | Free and paid execution packaging |
| S17 | [Qiskit MCP Servers](https://qiskit.qotlabs.org/docs/guides/qiskit-mcp-servers) | Primary maintainer docs | Official agent-accessible Qiskit tool families |
| S18 | [Qiskit MCP repository](https://github.com/Qiskit/mcp-servers) | Primary maintainer repository | Current packages and server boundaries |
| S19 | [Qiskit transpilation](https://quantum.cloud.ibm.com/docs/en/guides/transpile) | Primary provider docs | Target-aware local transformation |
| S20 | [IBM Quantum plans](https://quantum.cloud.ibm.com/docs/en/guides/plans-overview) | Primary commercial source | Open and paid access models |
| S21 | [Braket cost tracking and spending limits](https://docs.aws.amazon.com/braket/latest/developerguide/braket-pricing.html) | Primary provider docs | Device spend caps and task rejection |
| S22 | [Braket pricing](https://aws.amazon.com/braket/pricing/) | Primary commercial source | Task, shot and simulator pricing model |
| S23 | [Quantinuum Nexus jobs](https://docs.quantinuum.com/nexus/user_guide/concepts/jobs.html) | Primary provider docs | Compile/execute jobs, queue and lifecycle |
| S24 | [Nexus circuit cost](https://docs.quantinuum.com/nexus/nexus_api/circuits.html) | Primary API docs | Dedicated costing-job behavior |
| S25 | [Azure Q# overview](https://learn.microsoft.com/en-us/azure/quantum/qsharp-overview) | Primary SDK docs | Browser/local Q# boundary |
| S26 | [CUDA-Q kernel execution](https://nvidia.github.io/cuda-quantum/latest/using/basics/run_kernel.html) | Primary SDK docs | Heterogeneous execution engine |
| S27 | [PennyLane specs](https://docs.pennylane.ai/en/stable/code/api/pennylane.specs.html) | Primary SDK docs | Local quantum-resource inspection |
| S28 | [Q-CTRL Fire Opal](https://docs.q-ctrl.com/fire-opal) | Primary product docs | Validation and hardware-aware optimization |
| S29 | [Qiskit ExperimentData](https://qiskit-community.github.io/qiskit-experiments/stubs/qiskit_experiments.framework.ExperimentData.html) | Primary SDK docs | Experiment metadata, artifacts and results |
| S30 | [MLflow Tracking](https://mlflow.org/docs/latest/ml/tracking/) | Primary project docs | General run and artifact provenance |
| S31 | `docs/hackathon-build/DEVPOST_LIVE_EXPECTATIONS_2026-08-29.md` | Local consolidated contract | Video and final delivery gates |
| S32 | `docs/decisions/2026-08-29-browser-native-hitl-quantum-preflight-workbench.md` | Local accepted ADR | Readiness, authority and provider boundary |
| S33 | [LinkedIn discovery lead for Action 98](https://www.linkedin.com/feed/update/urn:li:activity:7499117497804177408/?commentUrn=urn%3Ali%3Acomment%3A(activity%3A7499117497804177408%2C7499489116808646656)&dashCommentUrn=urn%3Ali%3Afsd_comment%3A(7499489116808646656%2Curn%3Ali%3Aactivity%3A7499117497804177408)) | Secondary discovery pointer | No technical claim until the underlying Japanese primary source is identified |
| S34 | [Institute for Molecular Science — Shunkai operational announcement](https://www.ims.ac.jp/en/news/2026/08/0824.html) | Primary institutional source | Operational status, architecture, announced scale and roadmap boundaries |
| S35 | [Infleqtion — Shunkai collaboration milestone](https://infleqtion.com/infleqtion-collaboration-with-japan-moonshot-program-achieves-major-milestone-shunkai-neutral-atom-quantum-computer-now-operational/) | Primary partner source | QPU-stack contribution and explicitly forward-looking roadmap statements |
| S36 | [JST — Neutral Atom-Based Fault-Tolerant Quantum Computer](https://www.jst.go.jp/moonshot/en/program/goal6/6D_ohmori.html) | Primary programme source | Ultracold-atom modality, room-temperature apparatus and 2028/2030 programme goals |
| S37 | [JST — Ohmori project progress through FY2024](https://www.jst.go.jp/moonshot/en/program/goal6/appeal/69_ohmori_ap01.html) | Primary programme report | QPU module, detection, tweezer automation and nondestructive-measurement progress |
| S38 | [Institute for Molecular Science — neutral-atom commercialization platform](https://www.ims.ac.jp/en/news/2024/02/0227.html) | Primary institutional source | Refrigerator-free apparatus boundary and commercialization programme context |
| S39 | [Hitachi — Moonshot Goal 6 Phase 2 participation](https://rd.hitachi.com/_ct/17843315?o=0&tg=manufacturing) | Primary partner source | Performance-evaluation software and operation-policy contribution |
| S40 | [Cabinet Office of Japan — Moonshot Goal 6](https://www8.cao.go.jp/cstp/english/moonshot/sub6_en.html) | Primary government source | National programme objective and time horizon |
| S41 | [Manetsch et al. — 6,100-atom tweezer array](https://www.nature.com/articles/s41586-025-09641-4) | Primary peer-reviewed research | Demonstrated array scale, coherence and room-temperature apparatus with active atom cooling |
| S42 | [Bluvstein et al. — fault-tolerant neutral-atom architecture](https://www.nature.com/articles/s41586-025-09848-5) | Primary peer-reviewed research | Bounded error-correction mechanisms and remaining integration challenge |
| S43 | [Microsoft Quantum Development Kit repository](https://github.com/microsoft/qdk) and [Q# npm module](https://github.com/microsoft/qdk/blob/main/source/npm/qsharp/README.md) | Primary maintainer repository | Rust-to-WebAssembly Q# compiler, language service, simulator and Worker integration |
| S44 | [Microsoft — QDK preview and browser architecture](https://quantum.microsoft.com/en-us/insights/blogs/qir/introducing-the-microsoft-quantum-development-kit-preview) | Primary product source | WebAssembly/browser design and web-hosted development baseline |
| S45 | [Microsoft Learn — different ways to run Q# programs](https://learn.microsoft.com/en-us/azure/quantum/qsharp-ways-to-work) | Primary product docs | Browser Q# authoring, AI assistance and documented web limitations |
| S46 | [Microsoft Learn — QDK simulator overview](https://learn.microsoft.com/en-us/azure/quantum/simulators-overview-qdk) | Primary product docs | Simulator classes, bounded applicability and memory limits |
| S47 | [IBM Quantum — debugging and simulation tools](https://quantum.cloud.ibm.com/docs/en/guides/debugging-tools) | Primary provider docs | Exponential full-state simulation cost and practical memory examples |
| S48 | [Amazon Braket — submitting tasks to simulators](https://docs.aws.amazon.com/braket/latest/developerguide/braket-submit-tasks-simulators.html) | Primary provider docs | Local and managed simulator limits and selection boundaries |
| S49 | [QIR Alliance — QIR Base Profile](https://github.com/qir-alliance/qir-spec/blob/main/specification/profiles/Base_Profile.md) | Primary open specification | Explicit profile, qubit and result constraints for interoperable handoff |

## Claim registry

| Claim ID | Safe claim | Evidence | Status | Boundary or prohibited extension |
|---|---|---|---|---|
| C01 | QCG exposed four native WebMCP tools in the recorded supported browser. | S01, S03, S07 | confirmed by primary sources | Avoid “all browsers” or universal client compatibility |
| C02 | The recorded Q# Worker completed 64 of 64 Bell shots and observed only correlated pairs. | S01, S03 | confirmed by primary sources | One fixture does not establish general scientific correctness |
| C03 | The recorded path made one local simulation and zero external provider calls. | S01, S03 | confirmed by primary sources | Do not convert this directly into dollars saved |
| C04 | The simulation tool required `simulate_first` plus visible one-time consent. | S05–S07 | confirmed by primary sources | Current consent proof applies to the local fixture path |
| C05 | QCG exports JSON or Markdown evidence from its current state. | S06, S07 | confirmed by primary sources | Portable format interoperability still requires external consumers |
| C06 | The current cards are deterministic fixtures. | S05, S06 | confirmed by primary sources | Avoid describing them as imported professional experiments |
| C07 | qBraid already combines agent execution, live device context and approval before sensitive QPU submission. | S11–S13 | confirmed by primary sources | QCG is not the first agentic multi-provider quantum environment |
| C08 | Open Quantum MCP separates quote preparation from job submission and exposes spend preview. | S15 | confirmed by primary sources | QCG currently has no Open Quantum integration |
| C09 | Official Qiskit MCP servers expose circuit, transpiler, docs and Runtime capabilities to MCP clients. | S17, S18 | confirmed by primary sources | MCP compatibility is distinct from WebMCP page tools |
| C10 | Braket can reject a task whose estimated cost exceeds a configured device spending limit. | S21 | confirmed by primary sources | Limits cover a documented subset of Braket costs |
| C11 | Nexus compile and cost operations can themselves be remote jobs. | S23, S24 | confirmed by primary sources | Provider behavior can change; retain source date |
| C12 | Local simulation and resource inspection already exist in QDK, CUDA-Q and PennyLane. | S25–S27 | confirmed by primary sources | QCG adds policy and evidence rather than inventing simulation |
| C13 | Experiment and ML tracking systems already preserve metadata and artifacts. | S29, S30 | confirmed by primary sources | A receipt is not a new product category by itself |
| C14 | The broad multi-provider quantum router category is occupied. | S11–S24 | inferred from multiple sources | Phrase as market synthesis, not a universal impossibility claim |
| C15 | The narrowest defensible gap is an independent browser-native executionless evidence firewall. | S03, S08–S30 | inferred from multiple sources | Market demand and willingness to pay remain unverified |
| C16 | Professional relevance requires real artifact intake, a dated target profile and exact evidence-reuse semantics. | S05, S06, S13, S19, S27, S29 | inferred from multiple sources | This is a product requirement, not a completed feature |
| C17 | `ready_for_external_execution` expresses technical readiness under supplied evidence, not human authorization. | S06, S32 | confirmed by local contract | Never display `ready` as “submitted,” “approved” or “safe to spend” |
| C18 | QCG can support provider runners while retaining no credentials and no submission tool in the MVP. | S32 | confirmed design decision | Future handoff requires a separate decision and threat model |
| C19 | The Devpost project remains a draft and final submission belongs to Jean-Sébastien. | S02, S31 | confirmed by primary sources | Preparation is not submission |
| C20 | The approved video shape is a live ~30-second introduction plus a ~2-minute NotebookLM short, under three minutes total, with product visibility by 10–15 seconds. | S31 | confirmed author decision | Final duration, audio and live proof require QA after editing |
| C21 | The standalone commercial value of QCG is not yet validated. | S11–S30 | tentative due to missing user evidence | Run user tests before pricing or revenue claims |
| C22 | IMS announced Japan's first full-stack neutral-atom quantum computer, Shunkai, operational on 24 August 2026. | S34–S35 | confirmed by primary sources | Operational status does not establish useful quantum advantage, fault tolerance or universal performance |
| C23 | The announced early Shunkai system is expected to use approximately 50 qubits and later expand toward approximately 500, with partial external access planned. | S34 | confirmed roadmap statement | Present 50, 500 and external access as announced stages, never as all completed capabilities |
| C24 | Shunkai uses ultracold neutral atoms as qubits inside an apparatus that operates at room temperature and requires no cryogenic refrigerator. | S34, S36, S38, S41 | confirmed by primary sources | “Room temperature” describes the apparatus; it does not mean warm or uncooled atomic qubits |
| C25 | The JST 2028/2030 milestones and the 10,000-physical-qubit target for March 2031 are programme goals. | S34, S36, S40 | confirmed roadmap statements | Goals are not forecasts guaranteed to occur and are not current outcomes |
| C26 | Microsoft's QDK already compiles and simulates Q# through WebAssembly in browser contexts, and Microsoft documents browser-based Q# authoring with AI assistance. | S43–S45 | confirmed by primary sources | This establishes a bounded Q# baseline, not universal browser support for every quantum framework |
| C27 | General full-state classical quantum simulation remains exponentially constrained by memory, circuit structure, qubit count and noise complexity. | S46–S48 | confirmed by primary sources | Structured, sparse, Clifford and specialized accelerator methods can extend particular cases; avoid one universal qubit ceiling |
| C28 | By 2029, an ordinary browser may plausibly become a shared surface for authoring, inspection, bounded simulation, preflight and controlled delegation across distinct execution substrates. | S08–S10, S34–S49 | inferred from multiple sources | Label as a three-year horizon; never claim that browser simulation will generally equal QPU computational capacity |
| C29 | QCG's defensible future role is to expose the proposed execution substrate, simulation envelope, target freshness and human authority before delegation. | S08–S10, S32, S43–S49 | inferred design consequence | This is a product direction, not a completed multi-provider capability |
| C30 | *Quantum 734* records personal provenance for the vision and supplies no technical evidence, performance result or forecast. | Author editorial rule | confirmed author decision | No fictional passage can support a scientific claim |

## Editorial use contract

Every public paragraph should map its central factual statement to at least one claim ID. Inferences retain their label. Drafts can describe the product vision with confidence while clearly distinguishing what runs today, what the next gate will add and what remains a future adapter.
