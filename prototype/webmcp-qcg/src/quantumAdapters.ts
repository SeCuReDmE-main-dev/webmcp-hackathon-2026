import type { ArtifactFormat, CompilerEvidence, QuantumProfileId, QuantumProfileSummary } from './types'

export interface QuantumAdapter {
  id: QuantumProfileId
  label: string
  extensions: readonly string[]
  format: ArtifactFormat
  capabilities: QuantumProfileSummary['capabilities']
  compilerProfileDigest: string
  executable: boolean
}

const qdkCapabilities = { inspect: true, compile: true, simulate: true, static_only: false } as const
const staticCapabilities = { inspect: true, compile: false, simulate: false, static_only: true } as const

export const quantumAdapters: readonly QuantumAdapter[] = [
  { id: 'qsharp-qdk', label: 'Q# / QDK WASM', extensions: ['.qs'], format: 'qsharp', capabilities: qdkCapabilities, compilerProfileDigest: 'qsharp-lang-1-31-0-qsharp', executable: true },
  { id: 'openqasm3-qdk', label: 'OpenQASM 3 / QDK WASM', extensions: ['.qasm'], format: 'openqasm3', capabilities: qdkCapabilities, compilerProfileDigest: 'qsharp-lang-1-31-0-openqasm3', executable: true },
  { id: 'qiskit-python', label: 'Qiskit Python', extensions: ['.py'], format: 'qiskit-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-qiskit-python-v1', executable: false },
  { id: 'cirq-tfq-python', label: 'Cirq / TensorFlow Quantum Python', extensions: ['.py'], format: 'cirq-tfq-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-cirq-tfq-python-v1', executable: false },
  { id: 'torchquantum-python', label: 'TorchQuantum Python', extensions: ['.py'], format: 'torchquantum-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-torchquantum-python-v1', executable: false },
  { id: 'pennylane-python', label: 'PennyLane Python', extensions: ['.py'], format: 'pennylane-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-pennylane-python-v1', executable: false },
  { id: 'cudaq-python', label: 'CUDA-Q Python', extensions: ['.py'], format: 'cudaq-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-cudaq-python-v1', executable: false },
  { id: 'cudaq-cpp', label: 'CUDA-Q C++', extensions: ['.cpp', '.cc'], format: 'cudaq-cpp', capabilities: staticCapabilities, compilerProfileDigest: 'static-cudaq-cpp-v1', executable: false },
  { id: 'braket-python', label: 'Amazon Braket Python', extensions: ['.py'], format: 'braket-python', capabilities: staticCapabilities, compilerProfileDigest: 'static-braket-python-v1', executable: false },
  { id: 'qir-text', label: 'QIR text', extensions: ['.ll'], format: 'qir-text', capabilities: staticCapabilities, compilerProfileDigest: 'static-qir-text-v1', executable: false }
]

export const quantumProfileIds = quantumAdapters.map((adapter) => adapter.id)

export function getQuantumAdapter(profileId: string): QuantumAdapter | undefined {
  return quantumAdapters.find((adapter) => adapter.id === profileId)
}

export function profileSummary(adapter: QuantumAdapter): QuantumProfileSummary {
  return { id: adapter.id, label: adapter.label, format: adapter.format, capabilities: adapter.capabilities }
}

export function staticCompilerEvidence(adapter: QuantumAdapter): CompilerEvidence {
  return {
    name: 'qcg-static-inspector',
    version: '1.0.0',
    status: 'unverified',
    diagnostic_count: 0,
    diagnostics: ['Static inspection only. This profile is neither compiled nor executed by QCG.'],
    profile_digest: adapter.compilerProfileDigest,
    bounded_entrypoint: false,
    estimated_qubits: null
  }
}
