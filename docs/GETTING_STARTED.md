# Getting started with QCG v3

This guide runs the current browser prototype from the repository. It covers
the verified local paths: Q#/OpenQASM preflight, optional native WebMCP
discovery, bounded Bell simulation, static ecosystem inspection and evidence
export.

## 1. Prerequisites

The 2026-08-29 verification used:

- Windows with PowerShell;
- Node.js `24.18.1`;
- npm `11.16.0`.

The package currently declares no Node.js `engines` range, so those versions are
the reproducible reference rather than a promise that every older Node release
works. QCG needs no `.env` file, provider account, API key, QPU allocation, or
cloud quantum subscription.

## 2. Install

From the repository root:

```powershell
Set-Location prototype/webmcp-qcg
npm ci
```

`npm ci` installs the exact dependency graph in `package-lock.json`, including
the pinned `qsharp-lang@1.31.0` runtime. Stop any Vite or test process using this
same checkout before reinstalling; on Windows, a running process can lock the
native Rolldown module and cause an `EPERM` unlink error.

No source file, environment file, or credential should be generated during
installation.

## 3. Test and build

```powershell
npm test
npm run build
```

`npm test` runs the service, WebMCP lifecycle, imported-artifact flow, strict
debug contract, bridge-authority, adapter, console and third-party tool suites.
The current automated verification result is 61 tests passing across 10 test
files.

`npm run build` runs `tsc --noEmit` before Vite and writes the production bundle
to `prototype/webmcp-qcg/dist/`. The build includes the bounded QDK Worker, the
pinned WebAssembly asset, both executable Bell samples, and the `_headers` file.

With the local Vite server running on port `5173`, execute the pinned official
smoke suite with `npm run eval:smoke`. To repeat the same two-step suite against
the retained HTTPS origin, use `npm run eval:live`.

## 4. Start the development server

```powershell
npm run dev
```

Open the URL printed by Vite. To choose a host or port explicitly:

```powershell
npm run dev -- --host 127.0.0.1 --port 4179 --strictPort
```

The application shell and the checked-in sample should then respond at:

- `http://127.0.0.1:4179/`
- `http://127.0.0.1:4179/fixtures/qcg-bell-sample.qs`
- `http://127.0.0.1:4179/fixtures/qcg-bell-sample.qasm`

The repository samples are
[`qcg-bell-sample.qs`](../prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs)
and [`qcg-bell-sample.qasm`](../prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qasm).

## 5. Choose a browser mode

### Human workflow

Use the visible controls in an ordinary modern browser. WebMCP support is not
required for import, preflight, human decision, local Bell simulation, or
evidence export.

### Native WebMCP workflow

Use an in-app browser that exposes `document.modelContext.registerTool`, or use
a Chrome build that contains the experimental WebMCP testing flag:

1. Open `chrome://flags/#enable-webmcp-testing`.
2. Enable WebMCP testing.
3. Fully restart Chrome.
4. Open the Vite URL.
5. Confirm that QCG reports native tool registration rather than fallback mode.

The flag is experimental and build-dependent. Its absence is not an application
failure; QCG keeps the full human workflow available.

## 6. Run the bounded sample path

1. In **Inspector**, import `qcg-bell-sample.qs` or
   `qcg-bell-sample.qasm`, select its matching profile, and inspect it.
2. For an imported artifact, return to **Inspector** and complete the visible
   evaluation form: target, scientific intent, observable, shots, timeout and
   maximum qubits. QCG evaluates the active imported manifest; it does not
   replace it with a demonstration fixture.
3. Review the exact-byte digest, compiler status, target-profile evidence, and
   requested bounds.
4. In **Decisions**, confirm that the recommendation is `simulate_first`.
5. In **Decisions**, record an accepted decision. This creates private,
   short-lived, one-use consent inside QCG.
6. Run the bounded local simulation. The consent is consumed even if the run
   is cancelled or fails.
7. Inspect **Receipts** and export JSON or Markdown if needed.
8. Confirm in **Activity** that QPU submissions remain `0`.

At page load, no artifact tool is exposed. After a human loads a valid artifact,
native WebMCP exposes:

- `inspect_quantum_experiment`
- `evaluate_quantum_call`

After evaluation, `export_quantum_evidence_report` becomes available because a
v3 receipt exists. `run_bounded_local_simulation` appears only during the valid
accepted-consent window for an executable `simulate_first` profile and is
removed after consent use.

## 7. Choose Dark or Light

The product has exactly two presentation themes: **Dark** and **Light**. The
selection is retained locally without changing the DOM, tool contracts,
decision state or evidence. Autumn, Winter, Spring and Summer describe the
editorial history in the README and article series; they are not runtime themes.

## 8. Load the optional QCG Console Companion 0.2.5

This is a manual local-development step:

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select
   `companion/qcg-devtools-extension/`.
4. Open QCG, open F12, then select the **QCG** panel.
5. Click **Open Companion** on the QCG page to open the side panel through a
   trusted human click.

The F12 panel and side panel use the same content-script/background broker and
the same strict snapshot sanitizer. Neither surface uses
`chrome.devtools.inspectedWindow.eval`. Snapshot and command results are
allowlisted, correlated to their originating request and bound to the current
tab/session. Disconnecting, navigating away or closing the tab clears stale
context from the broker.

Both surfaces can filter declared messages, append a bounded human observation,
acknowledge a review request and prepare bounded context for a manual assistant.
Native Gemini in DevTools has no documented direct conversation API used by
QCG. The supported path is an explicit, sanitized copy/preview/import relay;
the imported reply remains untrusted data. Review copied text before sharing
it, and never paste secrets or source code. The extension exposes no consent,
simulation, provider or external-execution command.

Decision controls record a declared human interaction. They are deliberately
visible and session-bound, but they do not claim cryptographic identity or
personhood attestation.

For Chrome DevTools MCP, use the exact flags and shared-page routing in
[`docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md`](DEVTOOLS_MULTI_AGENT_RUNBOOK.md).
Third-party discovery remains experimental; the narrow bridge is the documented
fallback. QCG itself does not require the extension or a Gemini client.

## 9. Imported artifact behavior

QCG accepts a non-empty UTF-8 artifact no larger than 128 KiB after explicit
profile selection. The filename is reduced to its leaf component, and SHA-256
is computed over the exact bytes. After inspection, the active imported
manifest remains selected while the visible evaluation form captures target,
intent, observable and bounded resource inputs. Both the form and the safe
console `evaluate` command operate on that same manifest.

Q# (`.qs`) and OpenQASM 3 (`.qasm`) use the bounded QDK runtime. Their approved
Bell fixtures can execute locally. Qiskit, Cirq/TFQ, TorchQuantum, PennyLane,
CUDA-Q Python/C++, Braket and QIR text profiles remain static-only: QCG can
inspect and create evidence, but cannot compile, simulate or return external
readiness for them. Notebooks, archives, binary QIR, URLs and invalid encodings
are rejected.

## 10. Troubleshooting

### `npm ci` fails with `EPERM` on Windows

Stop the development server, test watcher, or other Node process using this
checkout, then rerun the install. A loaded native Rolldown binary cannot be
replaced while it is locked. Do not delete the repository or rewrite the lock
file to work around this condition.

### Native tools are unavailable

Use the human controls. If native WebMCP is required, confirm that the browser
exposes `document.modelContext`, enable the Chrome testing flag when available,
and restart the whole browser process.

### A target profile is rejected as stale or unknown

This is fail-closed behavior. The bundled target snapshots have explicit
capture and expiry timestamps. A fresh, sourced profile must exist before QCG
can treat the target as known.

### A valid imported program will not simulate

Confirm that the selected profile is executable and compare the program with
the matching published Q# or OpenQASM Bell fixture. QCG does not execute Python,
C++ or QIR text and does not treat a static profile as locally runnable.

### A recommendation is no longer executable

Recommendations and consent expire, and consent is single-use. Run a fresh
preflight and record a new human decision. QCG deliberately does not revive or
replay expired authority.

## 11. Security and data boundary

- Raw quantum source stays in session memory and does not cross the WebMCP tool contract.
- Exported receipts omit raw source, secrets, provider diagnostics, credentials, and
  local filesystem paths.
- Receipts stored in IndexedDB remain local to that browser profile.
- No analytics, authentication, remote persistence, provider submission, paid
  call, or QPU call is part of the prototype.
- Collaboration messages use `identity_assurance: declared`, reject unknown
  fields and prohibited sensitive material, and remain isolated from quantum
  consent and simulation services.
- Human decisions represent explicit, session-bound interface interactions;
  QCG does not present them as cryptographic identity proof.
- Gemini handoff is manual and sanitized. QCG does not claim direct access to
  Gemini's native DevTools conversation.
