# Multi-backend preflight contract for the Quantum Call Gate

Date: 2026-08-27  
Status: working research hypothesis; design remains open; no remote execution authorized

## Working hypothesis

The current leading design would not expose a universal quantum API. It would expose one common
**decision contract** above native adapters. Each adapter keeps the semantics of
its framework and returns a capability profile plus native diagnostics.

## Why the adapters cannot be flattened

### Qiskit

**Confirmed by primary sources.** A Qiskit `Target` describes a backend's
instructions, connectivity, timing and other constraints used by the
transpiler. `Sampler` and `Estimator` represent two higher-level tasks, but
provider-specific options remain different. The Qiskit adapter can therefore
answer circuit/target compatibility and whether the requested task is sampling
or expectation estimation; it cannot stand in for a PyTorch or Keras training
loop.

### QDK / Q#

**Confirmed by primary sources and local execution.** The published QDK WASM
compiler can validate Q#, simulate bounded programs, describe circuits, emit
QIR and estimate resources. This is the only adapter selected for direct
browser execution in the first vertical slice.

### TorchQuantum

**Confirmed by its primary repository.** TorchQuantum is organized around
PyTorch modules, dynamic computation graphs, autograd, batched processing and
CPU/GPU simulation. Its adapter must describe gradient, batching, model and
device requirements. Treating it as only a circuit runner would discard its
main semantics.

### TensorFlow Quantum

**Confirmed by primary documentation.** TensorFlow Quantum combines Cirq
circuits and observables with TensorFlow/Keras layers such as `ControlledPQC`.
Its adapter must retain tensors, trainable symbols, observables,
differentiators and Keras environment requirements. The initial MVP reports a
Colab-oriented capability path; it does not install TFQ in the browser.

### CUDA-Q

**Confirmed by primary documentation.** CUDA-Q exposes discoverable targets
whose metadata includes name, description, remote/emulated state and available
QPUs, and it supports many simulator and hardware categories. It is valuable as
current prior art for target abstraction and future backend plugins. It is not
a browser dependency for the seven-day MVP and does not replace our four
framework adapters.

## Common manifest

`QuantumExperimentManifest` normalizes only the information required to decide
whether an action is justified:

- schema and version;
- scientific question and requested operation class;
- source framework, version, native artifact hash and representation type;
- qubits or modes, gates/operations, parameters, observables and shots;
- gradient, batching, noise, dynamic-circuit and mid-circuit requirements;
- requested target and execution location;
- seed, tolerance, time ceiling, shot ceiling and cost ceiling;
- consent policy and whether any remote execution is allowed;
- prior evidence references and exact-match cache key.

The manifest does not contain credentials and does not convert native code into
a fake universal circuit.

## Target capability profile

Every adapter returns a versioned `TargetCapabilityProfile`:

- adapter, framework and target identifiers;
- profile source, retrieval time and expiry policy;
- local, remote, emulated or hardware execution class;
- supported operation/task classes;
- gate/instruction set and connectivity when meaningful;
- qubit, shot, payload, timeout and batching bounds when known;
- gradients, observables, noise and dynamic-circuit flags;
- authentication and account requirements as booleans only;
- cost status: `free`, `paid`, `unknown` or `not_applicable`;
- evidence state: `static`, `probed`, `provider_reported` or `unverified`.

Unknown values remain unknown. The router never invents provider pricing,
queue time, calibration or compatibility.

## Candidate four-tool surface

### `inspect_quantum_experiment`

Parses the selected fixture or typed input and returns a manifest plus structural
diagnostics. It does not load an engine, select a target or execute code.

### `evaluate_quantum_call`

Compares a valid manifest with available capability profiles and prior evidence.
It returns one recommendation: `reuse_result`, `reject`, `recompile`,
`simulate_first` or `ready_for_external_execution`. It never submits a job.

### `run_bounded_qsharp_simulation`

Runs only the validated QDK browser fixture inside a Worker under strict source,
qubit, shot, event, memory and time bounds. It is unavailable until
`evaluate_quantum_call` selects `simulate_first` for the QDK path.

### `export_quantum_evidence_report`

Serializes manifest, profiles, decision, native diagnostics, simulation result,
invocation log and limitations. It does not re-evaluate or execute anything.

This candidate surface is deliberately smaller than the earlier five-tool sketch. Target
compatibility and minimum-evidence planning belong to one deterministic
evaluation, preventing overlapping tools from producing contradictory plans.

## Deterministic decision order

1. Reject malformed, unversioned, oversized or secret-bearing input.
2. Reuse an exact, fresh and policy-compatible prior result when available.
3. Reject when no adapter supports the requested operation or required evidence.
4. Recommend recompilation when a logical artifact is valid but target-bound
   constraints are unmet.
5. Recommend bounded local simulation when it can answer the stated question.
6. Mark `ready_for_external_execution` only when validation, compatibility,
   evidence sufficiency, cost status and explicit consent are all resolved.

The MVP stops at step 5. Step 6 is a report state, not an executable control.

## Candidate falsifiable golden path

1. A fixed Bell-style Q# fixture is selected from the page.
2. WebMCP registers the four tools and logs discovery/invocation server-side.
3. Inspection produces the versioned manifest.
4. Evaluation chooses `simulate_first`, because a bounded local proof answers
   the question and no remote hardware evidence is required.
5. The Worker runs the pinned QDK package and returns only correlated outcomes.
6. The evidence report shows one remote call avoided and the exact reason.

The demonstration fails if the agent can obtain the answer from the page DOM,
if no WebMCP invocation is logged, if the Worker path is absent, if mixed Bell
outcomes appear in the ideal fixture, or if the report claims remote/QPU proof.

## Sources

- Qiskit target/provider contract: https://quantum.cloud.ibm.com/docs/en/api/qiskit/providers
- Qiskit transpilation: https://quantum.cloud.ibm.com/docs/en/guides/transpile
- Qiskit primitives: https://quantum.cloud.ibm.com/docs/en/guides/primitives
- TorchQuantum repository: https://github.com/mit-han-lab/torchquantum
- TensorFlow Quantum tutorials: https://www.tensorflow.org/quantum/tutorials
- QDK repository: https://github.com/microsoft/qdk
- CUDA-Q Python target API: https://nvidia.github.io/cuda-quantum/latest/api/languages/python_api.html
- CUDA-Q backends: https://nvidia.github.io/cuda-quantum/latest/using/backends/backends.html
