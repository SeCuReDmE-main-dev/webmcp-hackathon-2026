# ADR — Progressive four-tool browser gate

Date: 2026-08-28  
Status: **Accepted; supersedes the open interaction contract in the Day 2 notes**

## Context

Day 2 selected WebMCP-QCG while leaving the exact browser interaction open. The Day 3 source pass emphasized small composable surfaces, canonical visible state, human authorization before effectful work, progressive disclosure and inspectable receipts. The first browser proof also established a real Q# WebAssembly path on ordinary hardware.

## Decision

QCG uses one progressive state machine and exactly four tools:

1. `inspect_quantum_experiment`
2. `evaluate_quantum_call`
3. `run_bounded_qsharp_simulation`
4. `export_quantum_evidence_report`

Inspection and evaluation are registered initially. Evidence export appears after a decision exists. Local simulation appears only when the current decision is `simulate_first` and the human grants visible one-time consent. After that consent is consumed, the simulation tool disappears again.

The human controls and WebMCP tools call the same service functions. This keeps the browser UI and agent surface behaviorally aligned while preserving explicit source attribution.

The prototype includes five named falsifiable scenarios:

- Reuse the Fresh Result
- Reject the Unsupported Call
- Recompile for the Target
- Simulate Before Spending
- Ready, but Not Authorized

Each card states its hypothesis before invocation. Request limits can change the resulting decision, so a card labels a test case rather than dictating its outcome.

## Execution boundary

The only executable branch runs a fixed Bell-pair Q# fixture through `qsharp-lang@1.31.0` in a Web Worker. Shots, qubits and timeout are bounded. QCG records local simulations and external provider calls separately. The external counter remains zero throughout the MVP.

The validated DOM contract is:

> The machine-verifiable decision record is absent before invocation; the detailed result becomes human-visible after invocation.

This formulation reconciles agent-essential interaction with a useful human interface.

## Consequences

- WebMCP becomes essential to the demonstrated agent path.
- The UI remains fully usable when WebMCP is unavailable.
- A `ready_for_external_execution` decision carries evidence while granting no external authorization.
- QPU, paid API and provider jobs remain outside the prototype.
- Multi-backend adapters remain roadmap work until each native contract has executable evidence.

## Evidence

- `evidence/browser/qcg-native-browser-proof-2026-08-28.json`
- `evidence/bleeem/TERRA_D3_WEBMCP_QCG_PROTOTYPE_RECEIPT_2026-08-28.md`
- `prototype/webmcp-qcg/`
