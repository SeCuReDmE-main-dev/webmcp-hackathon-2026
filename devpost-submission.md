# Devpost submission record

Status: **SUBMITTED — VIDEO REPLACEMENT PENDING**
Project ID: `1404828`
Project URL: <https://devpost.com/software/webmcp-qcg-quantum-call-gate>
Submission ID: `1158343`
Submitted: `2026-09-02T15:42:44.142-04:00`
Current provisional video: <https://youtu.be/WV8XMHzt84Y>
Synchronized with G3, deployment-parity and Zenodo evidence: 2026-09-02

Current canonical/secondary deployment evidence: 2026-09-02

Candidate deployment parity: **24/24 PASS on canonical cPanel and synchronized Vercel secondary**

## Remaining public replacement

- Replace the provisional safety video with the final public YouTube demo under
  three minutes, using Jean-Sébastien's human voice.

## Project identity

**Name:** WebMCP-QCG: Quantum Call Gate

**Tagline:** An inspectable browser gate that decides whether a quantum request should reuse evidence, stop, recompile, simulate locally, or become ready for separate authorization.

## Submission description

### Inspiration

Quantum development offers capable frameworks, simulators and hardware targets. The costly mistake often happens one step earlier: an agent prepares another run before checking whether a fresh result already answers the question, whether the target supports the artifact, or whether local evidence should come first.

I built WebMCP-QCG to place that decision inside the browser interaction itself. WebMCP gives an agent a structured path to inspect the experiment, evaluate the next call and obtain an auditable result while the researcher retains consent and scientific authority.

### What it does

QCG exposes four progressive WebMCP tools:

1. `inspect_quantum_experiment` creates a versioned manifest and digest.
2. `evaluate_quantum_call` returns one bounded decision with reason codes and a next action.
3. `run_bounded_local_simulation` appears only after `simulate_first`, an executable profile and visible one-time consent.
4. `export_quantum_evidence_report` produces a compact JSON or Markdown receipt.

Five falsifiable cards exercise the decision space: reuse a fresh result, reject an unsupported call, recompile for a target, simulate before spending, and report external readiness without granting authorization.

### How I built it

The app uses React, TypeScript, strict Zod contracts and `document.modelContext.registerTool`. Human controls and WebMCP tools call one canonical service layer. Tool registration is progressive and tied to an `AbortSignal` lifecycle. Q# and OpenQASM 3 run through pinned `qsharp-lang@1.31.0` WebAssembly in a cancellable Web Worker with explicit shot, qubit and timeout limits. Eight additional ecosystem profiles expose static inspection only.

The retained browser trace invoked inspection, evaluation, bounded simulation and export. Its Worker completed 64/64 Bell-pair shots, observed only correlated pairs, passed the Bell invariant and recorded one local simulation with zero provider calls. The final local verification passes 94 application tests, all 5 Companion gates and zero audit vulnerabilities. Canonical cPanel and the synchronized Vercel secondary pass the same 24-path manifest, and Chrome decodes all eight corrected brand PNGs. The official current-runtime WebMCP smoke passes 2/2, and the final readiness pass treats the retained human-controlled consent, local simulation and evidence-export traces as the release evidence for Action 237.

### Challenges

The principal challenge was preserving scientific meaning while keeping the agent contract small. I designed QCG around evidence and decisions instead of claiming a universal quantum language. A second challenge was progressive authorization: the simulation tool becomes discoverable only after the policy selects it and the researcher grants consent. A third challenge was keeping every claim falsifiable, including environment failures such as an external Chrome instance where the WebMCP flag was unavailable.

### Accomplishments

- Four native, composable WebMCP tools share the human application services.
- Five scenarios can confirm or falsify their stated hypothesis.
- A real Q# WebAssembly Worker completed a bounded Bell simulation.
- A real OpenQASM 3 Bell fixture compiled and simulated through the same bounded Worker.
- Eight additional quantum ecosystem profiles remain explicitly static-only.
- Four accessible seasonal presentations preserve one semantic workflow.
- A separate QCG DevTools companion and strict append-only ledger make declared
  agent counter-analysis visible without granting it quantum authority.
- Tool logs preserve invocation source, state transition, reason codes and counters.
- A gated E2B campaign completed 2.6 million deterministic operations, including two 100-sandbox million-operation passes with 100/100 matching digests.
- A capped public canary returned 80/80 HTTP 200 responses with zero errors or timeouts.
- External provider calls, QPU calls and paid calls remain exactly zero.
- The public repository contains source, tests, research provenance and machine-readable evidence.
- Gemini/Antigravity supplied an independent cold-judge report whose findings
  were dispositioned against code and tests; Qodo supplied a separate cold
  review. These are bounded review inputs, not certifications or submission
  approvals.

### What I learned

WebMCP is strongest here as a decision surface. The agent gains precise capabilities inside the page, deterministic code owns validation and simulation, and the researcher owns consent and interpretation. A documented refusal, reuse decision or local simulation can be more valuable than another remote call.

### What's next

The repaired G3 source candidate keeps Q#/OpenQASM fixture execution, eight static profiles and the F12/Companion collaboration surfaces while preserving declared identities and read-only collaboration authority. Its clean-copy, package and cPanel/Vercel parity gates pass. The official public WebMCP inspect/evaluate smoke is 2/2. Native Gemini DevTools remains a human-mediated export/preview/import lane because no documented conversation-write API is used. The public release tag, hash-validated source archive and software DOI are complete. The Devpost entry is submitted with a provisional safety video; the immediate remaining public replacement is the final sub-three-minute demo video. External execution remains a separate, explicitly authorized product surface.

## Required custom-field draft

| Field | Draft answer / state |
|---|---|
| Submitter Type | Individual |
| Country of residence | Author confirms the exact truthful selection at submission time |
| Organization name | Not applicable for an individual submission |
| App Status | New |
| Existing-project extension | Not applicable; the repository began during the submission period |
| Live URL | <https://qcg.securedme.ca/> |
| Testing instructions | Open the stable URL in a WebMCP-capable browser. Ask the agent to list QCG tools, inspect `simulate-first`, evaluate it with 64 shots, grant visible one-time consent, run bounded local simulation and export Markdown evidence. Confirm Bell invariant PASS and external calls 0. The visible human workflow remains the fallback when WebMCP is unavailable. External Chrome testing depends on a build exposing `chrome://flags/#enable-webmcp-testing` and requires a restart after enabling it. |
| Public code repository | <https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026> |
| Agents or clients tested | ChatGPT/Codex in-app browser: native discovery and four WebMCP invocations passed on the retained release. Chrome DevTools MCP discovered and invoked the four collaboration tools on one candidate page session. A real human-mediated Gemini/Antigravity cold-judge exchange was sanitized and dispositioned without claiming a direct Gemini conversation API. External Chrome through the official WebMCP eval runner: the retained HTTPS origin passed 2/2 smoke steps. Repeat these checks on the promoted candidate before submission. |
| AI tools leveraged | OpenAI Codex served as the research partner for source mapping, contract design, implementation, tests, browser verification, evidence organization and editorial control. Independent ChatGPT and Gemini research reports supplied comparative inputs that were checked against primary sources. |
| Learning derived | Significant |
| Career AI value | Yes |

## Release checklist

- [x] Public repository
- [x] MIT license
- [x] Native WebMCP implementation
- [x] Reproducible install, tests and build
- [x] Native in-app-browser trace
- [x] Machine-readable evidence receipt
- [x] Expiring public preview passed with required security headers and native WebMCP trace
- [x] Stable live URL
- [x] Native trace repeated at live URL
- [x] Day 7/G2 local F12, Companion and reconnect proof
- [x] Two reproducible 100-sandbox million-operation engine passes
- [x] Immutable candidate packaged and clean-copy QA passed
- [x] GitHub, Companion ZIPs, Vercel and cPanel candidate parity proven
- [x] Official current-runtime WebMCP inspection/evaluation smoke (2/2)
- [x] Human consent, local simulation and evidence export covered by retained release traces
- [x] Final author authorization to submit
- [x] Devpost submission recorded
- [ ] Final public demo video under three minutes with human voice

### Submitted state

The WebMCP Challenge entry has been submitted. The current YouTube link is a
provisional safety video and should be replaced by the final demo before the
deadline.
