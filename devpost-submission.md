# Devpost submission working draft

Status: **PREPARED DRAFT — NOT SUBMITTED**  
Project ID: `1404828`  
Project URL: <https://devpost.com/software/webmcp-qcg-quantum-call-gate>  
Last live-state check: 2026-08-29

## Missing release inputs

- Public YouTube demo under three minutes with audio
- Final author review of every custom field
- Explicit author authorization to submit

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
3. `run_bounded_qsharp_simulation` appears only after `simulate_first` and visible one-time consent.
4. `export_quantum_evidence_report` produces a compact JSON or Markdown receipt.

Five falsifiable cards exercise the decision space: reuse a fresh result, reject an unsupported call, recompile for a target, simulate before spending, and report external readiness without granting authorization.

### How I built it

The app uses React, TypeScript, strict Zod contracts and `document.modelContext.registerTool`. Human controls and WebMCP tools call one canonical service layer. Tool registration is progressive and tied to an `AbortSignal` lifecycle. Q# runs through pinned `qsharp-lang@1.31.0` WebAssembly in a cancellable Web Worker with explicit shot, qubit and timeout limits.

The native browser trace invoked inspection, evaluation, bounded simulation and export. The Worker completed 64/64 Bell-pair shots, observed only correlated pairs, passed the Bell invariant and recorded one local simulation with zero provider calls.

### Challenges

The principal challenge was preserving scientific meaning while keeping the agent contract small. I designed QCG around evidence and decisions instead of claiming a universal quantum language. A second challenge was progressive authorization: the simulation tool becomes discoverable only after the policy selects it and the researcher grants consent. A third challenge was keeping every claim falsifiable, including environment failures such as an external Chrome instance where the WebMCP flag was unavailable.

### Accomplishments

- Four native, composable WebMCP tools share the human application services.
- Five scenarios can confirm or falsify their stated hypothesis.
- A real Q# WebAssembly Worker completed a bounded Bell simulation.
- Tool logs preserve invocation source, state transition, reason codes and counters.
- External provider calls, QPU calls and paid calls remain exactly zero.
- The public repository contains source, tests, research provenance and machine-readable evidence.

### What I learned

WebMCP is strongest here as a decision surface. The agent gains precise capabilities inside the page, deterministic code owns validation and simulation, and the researcher owns consent and interpretation. A documented refusal, reuse decision or local simulation can be more valuable than another remote call.

### What's next

The stable public deployment, live WebMCP smoke trace and clean-clone reproduction now pass. The immediate release gate is the public demo video followed by my final field-by-field review. The longer roadmap adds versioned capability adapters for additional quantum ecosystems while keeping every native contract visible. External execution remains a separate, explicitly authorized product surface.

## Required custom-field draft

| Field | Draft answer / state |
|---|---|
| Submitter Type | Individual |
| Country of residence | Author confirms the exact truthful selection at submission time |
| Organization name | Not applicable for an individual submission |
| App Status | New |
| Existing-project extension | Not applicable; the repository began during the submission period |
| Live URL | <https://qcg.securedme.ca/> |
| Testing instructions | Open in ChatGPT's in-app browser. Ask the agent to list the available QCG tools, inspect `simulate-first`, evaluate it with 64 shots, grant the visible one-time consent in the page, run the bounded Q# simulation, and export Markdown evidence. Confirm Bell invariant PASS and external calls 0. Chrome testing requires Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled and a restart. |
| Public code repository | <https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026> |
| Agents or clients tested | ChatGPT/Codex in-app browser: native discovery and four WebMCP invocations passed. External Chrome through the official WebMCP eval runner: the retained HTTPS origin passed 2/2 smoke steps. The full human fallback also passed on the live origin. |
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
- [ ] Public demo video under three minutes with audio
- [ ] Final author review
- [ ] Explicit author authorization to submit

### ⏳ Not submitted yet

Nothing has been sent to Devpost.
