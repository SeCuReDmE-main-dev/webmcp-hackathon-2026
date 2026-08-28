# The Quantum Call I Did Not Make

## Day 3 of WebMCP-QCG: Five Decisions, One Browser Gate

**Jean-Sébastien Beaulieu**  
August 28, 2026  
English working draft  
Project repository: <https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026>

I used Codex to its fullest potential as a research partner, for code mapping, source comparison, evidence organization, consistency checks, editorial control, and deliverable preparation. I formulated the intent, defined the scope, interpreted the results, arbitrated the conclusions, and preserved every public decision. This collaboration enhances my investigative capacity; it places judgment, responsibility, and signature under my authority.

---

## Abstract

Day 3 began with sleep, breathing room and a narrower question. I had already selected the WebMCP Quantum Call Gate as my hackathon project. The next task was to turn its architecture into an interaction that a judge, researcher and browser agent could each understand. I refreshed the live Devpost contract, analyzed five official WebMCP showcase applications, normalized thirty-nine challenge resources and reduced the product to a four-tool state machine: inspect an experiment, evaluate the call, expose a bounded local simulation only when the decision and consent permit it, then export evidence.

The implementation produced a functional vertical slice. A WebMCP-capable browser discovered and invoked the tools. The selected scenario returned `simulate_first` with the reason code `LOCAL_SIMULATION_REQUIRED`. After visible one-time consent, a Q# WebAssembly Worker completed sixty-four Bell-pair shots. Every result was a correlated pair, the Bell invariant passed, and the application recorded one local simulation with zero external provider calls. A final WebMCP call exported the evidence packet.

This result clarifies the product value. WebMCP-QCG is an inspectable decision surface placed before quantum infrastructure. It can reuse evidence, reject an unsupported request, require recompilation, select local simulation or report external readiness while leaving authorization with the researcher. The current slice proves one bounded Q# path and a human fallback. A stable public deployment, the external Chrome flag test and multi-backend adapters remain future gates. Day 3 closed with receipts rather than promises—and with one quantum call deliberately avoided.

**Keywords:** WebMCP, quantum computing, Q#, WebAssembly, browser agents, preflight validation, provenance, progressive disclosure, local simulation, reproducibility

---

## 1. I Returned Rested

Day 2 ended after an intense research marathon. Sleep changed the texture of the problem. The project still carried its ambition, but the morning made the interaction easier to see: a useful gate should help a researcher decide before it helps a machine execute.

I began by recording two simple facts. I had rested and breathed before returning to the work. I had also created a Devpost project draft without submitting it. Those observations sound small beside quantum compilers and browser protocols, yet they set the operating discipline for the day. A clear state makes a clear decision possible.

That discipline also changed how I treated research tooling. I initialized Firecrawl as a reproducible source-acquisition lane and captured current Chrome WebMCP documentation. Its `--browser` option supported browser authentication for the command-line client; it did not place research inside the QCG browser runtime. Keeping that boundary explicit protected the architecture. Firecrawl could acquire and normalize sources. WebMCP would carry the product interaction. Q# would compile and simulate. I would decide what the evidence meant.

This separation gave Day 3 its rhythm: identify one responsibility, assign it to one layer, then demand a receipt from that layer.

## 2. I Filled the Project Form

The Devpost form forced the project into public language. The live draft already described four intended tools, a bounded Q# path and a zero-provider-call boundary. I refreshed the project through the Devpost integration and confirmed its real state: project `1404828`, `submission_draft`, `submitted_at=null`, with the video field still empty.

I also refreshed the challenge requirements instead of relying on memory. The submission needs a working live URL, a public repository with an open-source license, a project description and a public demonstration video under three minutes with audio. The judges score WebMCP leverage, execution, potential impact, and creativity and ambition.

Those four criteria became engineering tests. “Leverage” meant that an agent had to discover and invoke real WebMCP tools. “Execution” meant a coherent human and agent experience rather than a disconnected protocol probe. “Impact” meant a specific decision that helps a quantum researcher avoid an unjustified call. “Creativity” meant combining browser-native agency with quantum preflight evidence while respecting the native quantum toolchains.

The form therefore became more than administration. It became a constraint compiler for the product. I kept the project in draft and moved every public claim back toward executable evidence.

## 3. I Turned Four Judging Criteria Into Tests

The five official OpenAI showcase examples helped me translate those judging criteria into product patterns. Margin Editor demonstrated the value of a visible canonical state and clear provenance. Fieldwork showed how a small capability surface can carry a complete experience. WanderNote reinforced reading before writing and preserving human work. Sunday Table showed the importance of atomic updates across derived state. Paperie made the preparation-versus-authorization boundary visible.

I transferred those lessons into QCG as behaviors rather than decoration. The application would expose a small set of non-overlapping tools. The page would show the decision state, reason codes, next action, provenance and counters. Human controls and browser-agent tools would call the same service functions. Effectful capability would appear only when the current state justified it. Every invocation would record whether it came from the human interface or WebMCP.

I also recorded the gaps. Showcase pages do not prove every backend durability property, recovery path or ownership rule. A public demo can teach a pattern while leaving operational questions unanswered. I carried that same standard into my own work. A passing in-app-browser trace proves that environment and path. It does not automatically prove every Chrome installation, every quantum framework or every future provider adapter.

The criterion tests became precise: discover the tools, complete the interaction, show the human value, and preserve the evidence boundary.

## 4. I Gave Four Tools Four State Transitions

The final tool surface contains four verbs:

1. `inspect_quantum_experiment`
2. `evaluate_quantum_call`
3. `run_bounded_qsharp_simulation`
4. `export_quantum_evidence_report`

Their order matters. Inspection creates a versioned manifest and digest. Evaluation reads that inspection, applies the declared scientific intent and limits, and returns exactly one decision. Export becomes available after evidence exists. Simulation becomes discoverable only when the decision is `simulate_first` and the researcher grants visible one-time consent.

This progressive registration turns discovery into part of the safety model. The browser agent initially sees inspection and evaluation. After evaluation it can see export. During the consent window it can also see simulation. Once the one-time consent is consumed, the simulation capability disappears again.

Each registration cycle owns an `AbortController`. Cleanup removes the tools together, and a partial registration failure aborts the cycle. Strict schemas reject unknown fields and bound shots, qubits, timeouts and target types. Agent-facing responses exclude raw Q# source, credentials and provider diagnostics.

The design keeps capability proportional to state. The agent sees the next justified action rather than the entire future architecture.

## 5. I Designed Five Falsifiable Requests

The interface presents five decision cards:

- **Reuse the Fresh Result**
- **Reject the Unsupported Call**
- **Recompile for the Target**
- **Simulate Before Spending**
- **Ready, but Not Authorized**

Each card declares a hypothesis before invocation. The card then supplies deterministic experiment facts to the same policy engine used by WebMCP. The policy may confirm the hypothesis or contradict it. A request limit can change the result; for example, a one-qubit ceiling turns the Bell simulation scenario into a rejection. The label organizes the experiment while the input still controls the decision.

The possible outputs are equally bounded: `reuse_result`, `reject`, `recompile`, `simulate_first`, or `ready_for_external_execution`. Every output includes reason codes and one next action. External readiness records a technical state; it grants no provider authorization.

This made the demo scientifically healthier. A card became a test fixture rather than a theatrical button. A surprising result would still be useful because the application would preserve the reason, the inputs and the next repair step.

Falsifiability also sharpened the public story. QCG does not promise to make every quantum run cheaper. It demonstrates how one browser gate can explain why a particular run should reuse evidence, stop, change form, simulate locally, or wait for authorization.

## 6. I Made WebMCP Carry the Interaction

The decisive test happened inside a WebMCP-capable browser. The browser discovered two initial tools. A native call to `inspect_quantum_experiment` created `inspect-simulatefirst` and a SHA-256 artifact digest. A native call to `evaluate_quantum_call` returned `simulate_first` with `LOCAL_SIMULATION_REQUIRED`. The application then exposed the consent-controlled simulation path.

I granted visible one-time consent in the page. The browser agent invoked `run_bounded_qsharp_simulation`. After the result arrived, it invoked `export_quantum_evidence_report` and produced a Markdown receipt. The application log recorded four WebMCP calls and one human consent event with explicit source attribution.

The registration progression was observable: two tools initially, three after evaluation, four during the consent window, and three after the one-time simulation consumed its permission.

This proof also resolved a wording problem from the design plan. A useful human interface should reveal the result after the interaction. The accurate contract is therefore: the machine-verifiable decision record is absent before invocation; the detailed result becomes human-visible after invocation. The agent performs essential work, and the researcher receives a legible result.

An external Chrome instance produced a second, different receipt. The application loaded and the human interface worked, while `document.modelContext` was absent because the WebMCP testing environment was unavailable in that instance. I recorded the partial gate and preserved the next step: enable the Chrome 149+ flag, restart, and repeat.

## 7. I Bounded the Quantum Work

The executable branch uses pinned `qsharp-lang@1.31.0` inside a Web Worker. The Worker loads the published WebAssembly module, compiles a fixed two-qubit Bell program and runs the exact requested number of shots within explicit limits. Cancellation and timeout belong to the contract.

The native trace requested sixty-four shots. The Worker completed sixty-four. Thirty-three results were `[One, One]`; thirty-one were `[Zero, Zero]`. Every measurement remained inside the expected correlated set, so the Bell invariant passed.

The application then reported the counters that define the product boundary: one local simulation and zero external provider calls. QPU calls and paid calls also remained zero.

This is the kind of quantum result an ordinary computer can produce responsibly. It demonstrates a compiler, simulator, Worker, browser-agent contract and evidence path. It supplies evidence for the gate while preserving a clear distinction from hardware execution.

The limit is productive. Arbitrary user code, cloud credentials, provider jobs and generalized multi-backend routing remain outside this slice. The roadmap can add adapters one contract at a time after each ecosystem earns its own executable evidence.

## 8. I Made the Product's Value Inspectable

The result panel now shows the phase, inspection ID, decision, reason codes, next action, provenance, evidence ID and counters. The invocation log shows status, operation, source and a concise summary. The simulation panel shows the Bell invariant and completed shots. Export produces a bounded receipt in JSON or Markdown.

This visibility serves three audiences at once. A researcher can see what the gate decided and retain authority over consent. A browser agent can call structured tools and receive compact results. A reviewer can compare claims with screenshots, logs, hashes, tests and source.

The negative branch carries equal product value. `reuse_result` can save a redundant simulation. `reject` can identify an unsupported artifact with a repair path. `recompile` can direct the next deterministic transformation. `ready_for_external_execution` can report technical readiness while the authorization boundary stays closed.

WebMCP makes this collaboration immediate because the tools live with the application state. The browser no longer has to infer meaning from button positions or scrape a result table before acting. The human interface remains present, and the agent receives a contract designed for the same underlying services.

That is the impact claim I can defend today: QCG makes one pre-execution decision inspectable, actionable and attributable inside the browser.

## 9. I Closed Day 3 With Receipts

The clean validation run installed dependencies with zero reported vulnerabilities, passed eleven automated tests across two files and produced a production build. The bundle includes the Q# Worker, the Q# WebAssembly asset and the React application. The source repository now holds the progressive-tool ADR, live Devpost state, resource registry, showcase matrix, browser proof, screenshots, journal and submission draft.

Deployment supplied the final honest boundary of the day. The production artifact is ready. Cloudflare Workers rejected the 6,066,574-byte Q# WebAssembly asset at the 5,242,880-byte per-file gate encountered by Wrangler. I changed the delivery path and created an anonymous Vercel preview. After adding explicit security headers, that public page repeated the full native WebMCP trace: 64/64 completed shots, Bell invariant true, one local simulation and zero provider calls.

The preview expires after one hour, so it is evidence rather than a submission URL. I kept it out of the Devpost live-URL field. An authenticated, stable deployment remains the next hosting gate.

The Devpost project remains a draft. Its video field remains empty. The live submission has received no final action.

Day 3 therefore ended with a working vertical slice and a short remaining path: establish a stable public URL, repeat the native trace there, enable the external Chrome test environment, record the video, and review the submission as its author.

The title of this article became possible because the counters support it. I made one justified local simulation. I made zero external quantum calls. The quantum call I did not make is now visible in the evidence.

## Conclusion — A Gate Earns Its Next Capability

I began Day 3 rested enough to reduce the architecture. I ended it with the first complete interaction: a browser agent inspected an experiment, received a deterministic decision, waited for visible consent, ran a bounded Q# simulation and exported evidence. The researcher-facing state remained legible throughout the path.

The project has moved from a concept portfolio to a functional product slice. Its value comes from sequencing: evidence before execution, state before capability, consent before simulation, and receipts before claims.

Tomorrow's work starts from a stronger position. The core path exists. The next decisions concern deployment, external Chrome verification, failure recovery, presentation and the second article in the series. Multi-backend ambition remains available as a roadmap while the current Q# adapter supplies one precise, reproducible foundation.

The project can now earn its next capability instead of imagining all of them at once.

---

## Evidence map

- Native browser receipt: `evidence/browser/qcg-native-browser-proof-2026-08-28.json`
- Native result screenshot: `evidence/browser/qcg-native-webmcp-qsharp-receipt-2026-08-28.png`
- Prototype validation: `evidence/bleeem/TERRA_D3_WEBMCP_QCG_PROTOTYPE_RECEIPT_2026-08-28.md`
- Resource registry: `research/webmcp/devpost-resources.registry.v1.json`
- Showcase matrix: `research/webmcp/showcase-evidence.matrix.v1.md`
- Append-only journal: `docs/journal/webmcp-qcg.day-log.v1.jsonl`
- Devpost working draft: `devpost-submission.md`

## Sources

1. Web Machine Learning Community Group. “WebMCP.” <https://webmachinelearning.github.io/webmcp/>
2. Chrome for Developers. “WebMCP.” <https://developer.chrome.com/docs/ai/webmcp>
3. Chrome for Developers. “Use the imperative API.” <https://developer.chrome.com/docs/ai/webmcp/imperative-api>
4. Chrome for Developers. “Build secure WebMCP tools.” <https://developer.chrome.com/docs/ai/webmcp/secure-tools>
5. Chrome for Developers. “WebMCP evals.” <https://developer.chrome.com/docs/ai/webmcp/evals>
6. Chrome DevTools. “Debug WebMCP tools.” <https://developer.chrome.com/docs/devtools/application/webmcp>
7. OpenAI. “WebMCP Showcase.” <https://developers.openai.com/showcase?view=webmcp-apps>
8. Devpost. “The WebMCP Challenge — Resources.” <https://webmcp.devpost.com/resources>
9. Microsoft. `qsharp-lang` npm package source. <https://github.com/microsoft/qdk/tree/main/source/npm/qsharp>

**Document status:** English Day 4 working draft. Repository publication and Devpost submission remain separate author decisions.
