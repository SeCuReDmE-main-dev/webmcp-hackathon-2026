# WebMCP-QCG — final video script and storyboard

Date: 2026-08-29  
Status: **production-ready script; recording and upload remain author-controlled**  
Target duration: **2:35–2:45**  
Hard limit: **under 3:00**

## Proof contract

The video demonstrates one complete browser-native loop:

```text
real Q# artifact → inspect → evaluate → human authorization
→ bounded local simulation → portable evidence receipt
```

It makes four boundaries explicit:

- WebMCP carries the structured browser interaction.
- Deterministic application code owns inspection, policy and simulation.
- The researcher owns authorization and interpretation.
- The MVP performs zero provider, paid-compute or QPU submissions.

## 00:00–00:30 — live introduction by Jean-Sébastien

### Required visual

Start with Jean-Sébastien on camera while `https://qcg.securedme.ca/` is already visible beside or immediately behind him. Cut to the functioning workbench by **00:08**.

### Script

> I built WebMCP-QCG because an AI agent should help a quantum developer decide before spending compute. This browser gate inspects a real Q# artifact, recommends the smallest justified next action, and keeps execution authority with the human. The current proof is deliberately bounded: five deterministic decisions, one local Q# simulator, four progressive WebMCP tools, and an evidence receipt. It never submits to a provider or QPU. Let me show you the complete loop.

## 00:30–02:35 — NotebookLM short

### 00:30–00:48 — the avoidable call

**Visual:** Experiment tab, public Bell-pair fixture, stable URL visible.

**Narration:**

> Quantum tools can compile, simulate and execute. QCG intervenes one step earlier. It asks whether the next call is justified by the artifact, the target evidence, the requested observable and the evidence already available.

### 00:48–01:08 — native inspection

**Visual:** Show WebMCP discovery, invoke `inspect_quantum_experiment`, then reveal the manifest and SHA-256 in the human interface.

**Narration:**

> The browser agent discovers a native inspection tool. QCG processes the source locally, creates a versioned manifest and binds the decision to the real artifact bytes. Raw quantum code stays outside the compact agent response.

### 01:08–01:30 — deterministic evaluation

**Visual:** Invoke `evaluate_quantum_call` on **Simulate Before Spending**. Hold on `simulate_first`, its reason codes, unknowns and next action.

**Narration:**

> Evaluation returns one bounded recommendation. In this case, local evidence is still missing, so QCG recommends simulation first. The result includes reason codes, uncertainty and a safer next action. A recommendation still grants no execution authority.

### 01:30–01:50 — the human boundary

**Visual:** Human Decision tab. Show `consent_required`, accept the recommendation, then show `authorized`. Briefly reveal the revoke control.

**Narration:**

> I decide whether to accept, defer or override the recommendation. A one-use consent token appears only after my explicit choice. It is scoped, expiring and revocable. Only then does the simulation tool become available.

### 01:50–02:10 — bounded local proof

**Visual:** Run 64 shots. Show completion, correlated Bell outcomes, `Bell invariant: PASS`, `local simulations: 1`, `external provider calls: 0`.

**Narration:**

> The Q# WebAssembly Worker runs sixty-four bounded shots locally. The Bell fixture completes, its correlation invariant passes, and the effect counters record one local simulation with zero external provider calls and zero QPU submissions.

### 02:10–02:28 — portable receipt

**Visual:** Evidence Receipt tab, then export Markdown or JSON. Show artifact hash, target-profile hash, recommendation, human decision and counters.

**Narration:**

> QCG joins the artifact, target snapshot, recommendation, human decision and measured effects into a portable receipt. The agent can explain the next step, while the evidence remains inspectable by the researcher.

### 02:28–02:40 — closing claim

**Visual:** Five decision cards, then product name and repository URL.

**Narration:**

> WebMCP-QCG turns browser automation into a reviewable quantum preflight. It helps a developer reuse, reject, recompile, simulate locally or declare readiness—before a separate authorization ever reaches external compute.

## Capture order

1. Open the stable URL in the supported WebMCP browser.
2. Reset QCG to the public `simulate-first` fixture.
3. Confirm all private tabs, credentials, paths and notifications are absent.
4. Record the product interaction as one clean take.
5. Record Jean-Sébastien's introduction with the product visible by 00:08.
6. Build the NotebookLM short around the clean product take.
7. Add concise burned-in captions for decisions, authority state and effect counters.
8. Export at 1080p with audible speech and no copyrighted background audio.

## Claims allowed on screen

- Four progressive WebMCP tools.
- Five deterministic recommendation outcomes.
- Real Q# artifact inspection and byte-bound SHA-256.
- Bounded local Q# WebAssembly simulation.
- One-use, expiring and revocable human consent.
- Bell invariant pass for the demonstrated fixture.
- Zero external provider calls and zero QPU submissions in the retained proof.
- Eighteen automated tests and official live WebMCP smoke `2/2`, if shown with their receipts.

## Claims to avoid

- Guaranteed cost savings.
- Universal compatibility across quantum providers.
- Hardware execution or QPU validation.
- Autonomous scientific authority.
- Production security certification.
- Any suggestion that OpenAI, Google, IBM, Microsoft, NVIDIA or a hackathon supporter endorses QCG.

## Final QA gate

- [ ] Exported duration is below 3:00.
- [ ] Product appears no later than 00:15; target is 00:08.
- [ ] Stable URL is legible and correct.
- [ ] The four tool names are visible or stated accurately.
- [ ] The `simulate_first` reason codes are readable.
- [ ] Human authority changes from `consent_required` to `authorized`.
- [ ] Simulation begins only after human consent.
- [ ] Receipt shows `external_provider_calls: 0`.
- [ ] Audio is clear on headphones and laptop speakers.
- [ ] No credential, private path, temporary preview or personal notification appears.
- [ ] Video is uploaded publicly to YouTube.
- [ ] The public URL is copied into Devpost only after Jean-Sébastien's review.

Uploading the video and submitting the Devpost entry remain Jean-Sébastien's actions.
