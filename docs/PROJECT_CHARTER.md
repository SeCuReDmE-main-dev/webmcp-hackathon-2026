# Project charter

## Objective

Select and build one bounded WebMCP hackathon project whose value depends on structured browser tools rather than generic DOM automation.

## Selection question

Can a browser agent use deterministic quantum preflight tools to prevent an unnecessary or invalid execution while preserving scientific traceability?

## Required product behaviors

1. Build or ingest a bounded experiment definition.
2. Compile or validate it for an explicit target.
3. Decide whether execution is necessary.
4. Use a local primitive or simulator when that is sufficient.
5. Visualize and report the result with versions, hashes and limitations.

## Candidate ecosystems

- Qiskit and `qiskit-fermions` for circuits, primitives and fermionic compilation.
- TorchQuantum for differentiable PyTorch quantum workflows.
- TensorFlow Quantum for Cirq/TensorFlow hybrid workflows.
- Azure Quantum for QIR target profiles, multi-provider targets and resource estimation.

These ecosystems are not interchangeable. The common contract will normalize experiment intent and evidence, not silently convert every framework into one circuit representation.

## Non-goals

- no universal quantum programming language;
- no claim that simulation proves hardware behavior;
- no autonomous spending or QPU submission;
- no scientific discovery claim;
- no WebMCP memory primitive;
- no upstream WebMCP proposal before a working, measured result exists;
- no attempt to revive every legacy Quantech Vid component.

## Success evidence

- one reproducible golden path;
- one avoided call with a precise reason and counterfactual;
- zero fabricated quantum metrics;
- tool invocations confirmed as WebMCP rather than generic browser automation;
- a bounded output report below the configured response limits;
- a decision record explaining why the selected concept beat the alternatives.

