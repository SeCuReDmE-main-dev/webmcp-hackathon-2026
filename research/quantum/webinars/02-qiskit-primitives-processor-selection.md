# Webinar 02 — Qiskit patterns, processor selection and target-aware circuits

Date analysed: 2026-08-27

Source: [Run Quantum Circuits with Qiskit Primitives](https://www.youtube.com/watch?v=NTplT4WnNbk)

Segment requested: `06:00–15:00`

Status: `WATCHED / TIMESTAMPED_NOTES / CURRENT_DOCS_CROSS_CHECKED`

## Objective

Extract the processor-selection lesson from the second webinar and determine how it should change the WebMCP four-surface quantum orchestrator. The goal is not to relearn elementary circuit construction, but to identify the variables and contracts that must exist before a framework can compile or execute a meaningful experiment.

## Environment / Stack Context

The planned orchestrator targets four distinct software surfaces: Qiskit, TorchQuantum, TensorFlow Quantum and Azure Quantum. They overlap at the classical simulation layer, where CPU and GPU resources are common, but they do not expose one interchangeable processor contract. Qiskit models backends and `Target` constraints; TorchQuantum primarily models differentiable simulation on PyTorch devices and can deploy through Qiskit; TensorFlow Quantum uses Cirq circuits and high-performance simulators; Azure Quantum brokers multiple providers, QIR profiles and resource-estimation models.

The transcript used for the timestamp map is the English automatic caption track retrieved from the public video. Wording was paraphrased and cross-checked against current primary documentation because the recording predates the current Qiskit API surface.

## Research Questions

1. What does the speaker establish between 06:00 and 15:00?
2. Must a processor be chosen before any gate or circuit is constructed?
3. Which processor attributes can be normalized across the four surfaces?
4. Which attributes must remain provider- or framework-specific?
5. How should this affect the WebMCP tool boundaries?

## Findings

### Timestamp map

| Time | Webinar point | Consequence for the orchestrator |
|---|---|---|
| 06:16–06:44 | Qiskit patterns organize quantum workloads as modular steps over heterogeneous computing infrastructure. | Model a staged workflow rather than one universal `run_quantum` tool. |
| 06:52–07:51 | The workflow is `map → optimize → execute → post-process`. | Preserve distinct state and evidence for every stage. |
| 08:10–09:02 | A logical circuit contains qubits, gates and measurements before virtual qubits are assigned to physical qubits. | Keep the logical circuit separate from the target-specific compiled circuit. |
| 09:05–09:54 | Circuit depth approximates execution time and affects whether useful results are plausible on a device. | Depth is a preflight input, not merely a visualization metric. |
| 09:56–11:25 | Processor selection considers qubit count and IBM-specific quality/throughput metrics such as EPLG and CLOPS. | Define common target fields plus namespaced provider metrics; do not force IBM metrics onto other providers. |
| 11:29–12:03 | Mapping translates a scientific problem into a circuit and remains an application-specific research problem. | The agent must retain the objective and observable, not only gate syntax. |
| 12:05–12:31 | Work that is easy classically should remain classical; beginners should decompose large problems. | Add `classical_first`, `decompose` and `simulate_first` decisions before remote execution. |
| 12:35–12:59 | The desired outcome is commonly formulated as an expectation-value or sampling problem. | Record the measurement contract before choosing an execution primitive. |
| 13:10–13:47 | Hardware topology and capabilities must be balanced against the problem and circuit. | Target choice participates in a feedback loop with circuit design. |
| 13:54–14:57 | Layout and routing assign virtual qubits to physical topology; long-distance interactions and SWAPs add cost and error. | Compatibility must be computed before execution and reported explicitly. |
| 15:00 onward | Gate sequences may be composed, simplified or eliminated. | Compare logical and compiled circuits and report why transformations occurred. |

### The processor-first insight needs a two-stage formulation

**Confirmed by primary sources.** The recording does not say that a physical processor must be chosen before any abstract gate can be written. It first maps a problem into a logical circuit, then selects and optimizes for a processor. Current Qiskit documentation likewise builds an abstract `QuantumCircuit`, then uses a backend `Target` to produce an ISA-compatible circuit.

**Architectural inference.** The user's deeper point remains correct: a serious workflow cannot finalize gates, connectivity, layout, depth or execution strategy without first knowing the target constraints. The orchestrator therefore needs two circuit states:

1. `logical_experiment` — objective, logical qubits, operations, parameters, observable and expected evidence;
2. `target_bound_experiment` — selected simulator or QPU, native operations, topology, compilation settings, limits and provenance.

Target selection is thus neither strictly first nor merely an implementation detail. It is an explicit decision between logical construction and target-specific compilation, with a feedback path to revise the logical design.

### The four surfaces share compute classes, not one processor model

**Confirmed by primary sources.** Qiskit, TorchQuantum and TensorFlow Quantum can all perform simulations on conventional computing resources. TorchQuantum explicitly supports PyTorch CPU/GPU devices. TensorFlow Quantum uses Cirq and efficient C++ simulation, while qsim can select CPU, GPU or multi-GPU execution. Qiskit also supports simulator backends and hardware targets.

**Confirmed by primary sources.** Azure Quantum is not the only surface with different physical processors. IBM exposes IBM QPUs through Qiskit; Google/Cirq can model Google processors; Azure exposes several providers and QIR capability profiles. Azure is distinctive because provider diversity and target profiles are first-class parts of its service, not because every other framework uses an identical processor.

| Layer | Safe common abstraction | Differences that must remain visible |
|---|---|---|
| Classical simulation host | CPU, GPU, multi-GPU, memory, precision and concurrency | PyTorch device semantics, TFQ/qsim options, Qiskit simulator method and version |
| Quantum/emulated target | qubit capacity, native operations, topology, noise/calibration and supported control flow | IBM `Target`, Cirq `Device`/processor, Azure provider target and QIR profile |
| Workload contract | sampling, expectation, gradients, batching, shots and observables | Qiskit primitives, Torch autograd, TFQ/Keras differentiators, Azure/QIR job semantics |
| Operational constraints | availability, queue, budget, limits and consent | Provider-specific metrics and authentication |

### Required `TargetCapabilityProfile`

The common manifest should add a versioned target profile containing:

- `framework`, `provider`, `targetId` and immutable version/calibration references;
- `executionClass`: state-vector, tensor-network, noisy emulator, QPU or resource estimator;
- classical host requirements: CPU/GPU, accelerator type, memory and concurrency;
- qubit or mode capacity, native operations and connectivity/topology;
- sampling, expectation, gradient, batching and mid-circuit-control support;
- noise model, calibration age, precision and reproducibility controls;
- shot/job limits, queue state, estimated cost and required consent;
- provider-specific metrics in a namespaced extension object.

This profile describes capabilities; it does not claim that results from different frameworks or physical technologies are directly comparable.

## Recommended Path

Refine the WebMCP orchestrator around six non-overlapping capabilities:

1. `describe_quantum_experiment` — produce the logical experiment and evidence requirement.
2. `list_compatible_targets` — filter the four adapter inventories without compiling or executing.
3. `get_target_capability_profile` — return detailed constraints for one selected target.
4. `compile_for_quantum_target` — produce a target-bound artifact and transformation report.
5. `execute_approved_quantum_job` — the only tool allowed to create a remote or costly job.
6. `normalize_quantum_evidence` — package native results without erasing framework-specific semantics.

The first measurable saving is not merely fewer API calls. It is preventing compilation or execution against a target that cannot satisfy the experiment's gates, topology, measurement type, resource needs or evidence objective.

## Alternatives Considered

- **Choose a QPU before formulating the problem:** rejected because the scientific objective and logical circuit must remain portable enough to compare eligible targets.
- **Compile once and send the same circuit everywhere:** rejected because native gate sets, topology, control-flow support and workload semantics differ.
- **Treat CPU/GPU simulation as equivalent across frameworks:** rejected because common hardware does not make simulator algorithms, precision, gradients or result contracts identical.
- **Hide all provider metrics behind one score:** rejected because it would create false comparability and prevent expert inspection.

## Risks / Unknowns

- The recording's IBM-specific processor names and API syntax are historical; current documentation controls implementation.
- EPLG and CLOPS are useful IBM metrics, not universal cross-provider measures.
- Simulator memory grows rapidly with qubit count; a target that is syntactically compatible may remain operationally infeasible.
- Current availability, queue and price data are volatile and must never be invented by the agent.
- Some transformations across OpenQASM, Cirq, QIR or framework-native representations may lose semantics.

## Sources

- Webinar: https://www.youtube.com/watch?v=NTplT4WnNbk
- IBM Quantum, running quantum circuits: https://quantum.cloud.ibm.com/learning/en/courses/quantum-computing-in-practice/running-quantum-circuits
- IBM Quantum, transpilation: https://quantum.cloud.ibm.com/docs/en/guides/transpile
- IBM Quantum, representing quantum computers for the transpiler: https://quantum.cloud.ibm.com/docs/en/guides/represent-quantum-computers
- IBM Quantum, provider/backend contract: https://quantum.cloud.ibm.com/docs/en/api/qiskit/providers
- TorchQuantum repository: https://github.com/mit-han-lab/torchquantum
- TensorFlow Quantum: https://www.tensorflow.org/quantum
- TensorFlow Quantum batching tutorial: https://www.tensorflow.org/quantum/tutorials/hello_many_worlds
- Google qsim hardware selection: https://quantumai.google/qsim/choose_hw
- Google Cirq quantum virtual machine: https://quantumai.google/cirq/simulate/quantum_virtual_machine
- Azure Quantum providers: https://learn.microsoft.com/en-us/azure/quantum/qc-target-list
- Azure Quantum QIR target profiles: https://learn.microsoft.com/en-us/azure/quantum/quantum-computing-target-profiles
- Microsoft Quantum Resource Estimator: https://learn.microsoft.com/en-us/azure/quantum/overview-resources-estimator
