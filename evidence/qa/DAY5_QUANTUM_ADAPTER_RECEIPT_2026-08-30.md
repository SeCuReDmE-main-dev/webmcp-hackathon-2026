# Day 5 quantum adapter receipt

- Receipt scope: Actions 129–135 only.
- Recorded: 2026-08-30.
- Runtime: `qsharp-lang@1.31.0` WebAssembly.
- Provider calls: 0.
- QPU submissions: 0.
- Credentials, source paths and raw client artifacts: absent.

## Implemented contract

The quantum registry declares ten explicit human-selected profiles:

| Profile class | Profiles | Day 5 capability |
| --- | --- | --- |
| QDK executable | `qsharp-qdk`, `openqasm3-qdk` | inspect, compile, bounded local simulation |
| Static only | `qiskit-python`, `cirq-tfq-python`, `torchquantum-python`, `pennylane-python`, `cudaq-python`, `cudaq-cpp`, `braket-python`, `qir-text` | inspect only; no QCG compiler, simulator, persistence of raw source, provider or QPU path |

Artifact intake accepts only valid UTF-8 text at or below 128 KiB. It rejects unsupported extensions (including notebooks and archives), invalid encoding, NUL bytes and URLs. The generic import API requires an explicit profile identifier; the legacy Q# import delegates to `qsharp-qdk`.

`EvidenceReceipt v3` records artifact format, selected profile/capabilities and compiler facts. IndexedDB reads existing v2 records through an in-memory conversion; it does not rewrite the v2 source record. Strict reuse includes the artifact digest, observable, parameters digest, shots, compiler profile and selected artifact profile.

The public WebMCP surface remains exactly four tools:

1. `inspect_quantum_experiment`
2. `evaluate_quantum_call`
3. `run_bounded_local_simulation`
4. `export_quantum_evidence_report`

## OpenQASM 3 QDK proof

Fixture: `public/fixtures/qcg-bell-sample.qasm`
SHA-256: `4fa14fe18813b8643eed4d545fb123beb4933fb34fd993e17adb16dd58487fc6`

The fixture was compiled through the pinned QDK API with `projectType: "openqasm"`, then simulated locally for 64 shots. The observed outcomes were 34 `[One, One]` and 30 `[Zero, Zero]`; no uncorrelated pair occurred. The Bell invariant therefore passed: `64 returned / 64 requested`, `true`.

This proves one bounded browser-compatible QDK route for the published OpenQASM 3 Bell fixture. It does not claim general OpenQASM compatibility, scientific correctness beyond the fixture, hardware execution or provider authority.

## Validation

- `npm run test:contracts`: 18/18 passed, including static-profile denial, OpenQASM routing and v2-to-v3 read compatibility.
- `npm run build`: passed (`tsc --noEmit` and Vite production build).
- `git diff --check`: no whitespace errors in this quantum lane's files.

The full suite was intentionally left to final integration because concurrent Day 5 lanes were changing shared test surfaces. No commit or push was performed.
