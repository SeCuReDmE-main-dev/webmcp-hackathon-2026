# QCG browser-route proof — 2026-09-01 America/Toronto

This directory retains the final local Chrome proof inputs and sanitized
evidence exports. The browser route used the current working tree before the
release commit and the Vite origin `http://127.0.0.1:5173/`.

## Q# route

- Import: `downloaded-qcg-bell.qs`
- Evidence: `webmcp-qcg-evidence-qsharp.json`
- Evidence SHA-256:
  `EA0590182519BCD168E9619438FB7CD818AAAC39A5B6D2FCEE5DC6624FBCA7AF`
- Result: `simulate_first` → accepted → Bell invariant true → 64/64 shots.
- Effects: one local simulation, one evidence export, zero QPU submissions.

## OpenQASM route

- Import: `downloaded-qcg-bell.qasm`
- Evidence: `webmcp-qcg-evidence-openqasm3.json`
- Evidence SHA-256:
  `6798F287BF7493E646931B125F922C25009B9C47BC9A2C5B8F1BBB032B14988C`
- Result: `simulate_first` → accepted → Bell invariant true → 64/64 shots.
- Effects: one local simulation, one evidence export, zero QPU submissions.

The two exports were checked for raw quantum source, consent tokens and local
filesystem paths. Profile labels such as `OpenQASM 3 / QDK WASM` remain normal
metadata and are not source-code disclosure.

## Companion boundary

The installed unpacked extension was not connected to this local browser run.
Companion 0.2.3 and F12 current-tab proof therefore remain separate release
gates; automated extension lifecycle and security tests are recorded elsewhere.
