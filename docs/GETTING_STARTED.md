# Getting started with QCG v2

This guide runs the current browser prototype from the repository. It covers
the verified local path only: Q# preflight, optional native WebMCP discovery,
bounded Bell simulation, and local evidence export.

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

`npm test` runs the service, WebMCP lifecycle, seasonal selector, strict debug
contract, bridge-authority and third-party tool suites. The current verification
result is 6 test files and 34 tests passing.

`npm run build` runs `tsc --noEmit` before Vite and writes the production bundle
to `prototype/webmcp-qcg/dist/`. The build includes the Q# Worker, the pinned Q#
WebAssembly asset, the public Bell sample, and the `_headers` file.

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

The repository copy of the sample is
[`prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs`](../prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs).
The **Download Bell sample** button generates the same published program in the
browser.

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

1. In **Experiment**, either choose **Simulate Before Spending** and run its
   preflight, or import `qcg-bell-sample.qs` and inspect it.
2. Review the exact-byte digest, compiler status, target-profile evidence, and
   requested bounds.
3. In **Agent Review**, confirm that the recommendation is `simulate_first`.
4. In **Human Decision**, record an accepted decision. This creates private,
   short-lived, one-use consent inside QCG.
5. Run the bounded local Q# simulation. The consent is consumed even if the run
   is cancelled or fails.
6. Inspect **Evidence Receipt** and export JSON or Markdown if needed.
7. Confirm in **Activity** that QPU submissions remain `0`.

At page load, no artifact tool is exposed. After a human loads a valid artifact,
native WebMCP exposes:

- `inspect_quantum_experiment`
- `evaluate_quantum_call`

After evaluation, `export_quantum_evidence_report` becomes available because a
v2 receipt exists. `run_bounded_qsharp_simulation` appears only during the valid
accepted-consent window for `simulate_first` and is removed after consent use.

## 7. Use the seasonal selector

The header contains one radio group with exactly four options: Autumn, Winter,
Spring and Summer. Arrow keys move between adjacent seasons; Home selects
Autumn and End selects Summer. A reload preserves the selected season. The
workflow, five tabs, three security cards, tools and decision state stay the
same in all four presentations.

## 8. Load the optional QCG DevTools panel

This is a manual local-development step:

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select
   `companion/qcg-devtools-extension/`.
4. Open QCG, open F12, then select the **QCG** panel.

The panel reads a structurally reduced bridge with `chrome.devtools.inspectedWindow.eval`.
It can filter declared messages, append a bounded human observation, acknowledge
a review request and copy bounded context for a manual assistant. Review copied
text before sharing it, and never paste secrets or source code. The panel exposes
no consent, simulation or external-execution command.

For Chrome DevTools MCP, use the exact flags and shared-page routing in
[`docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md`](DEVTOOLS_MULTI_AGENT_RUNBOOK.md).
Third-party discovery remains experimental; the narrow bridge is the documented
fallback. QCG itself does not require the extension or a Gemini client.

## 9. Imported artifact behavior

QCG accepts a non-empty UTF-8 `.qs` file no larger than 128 KiB. The filename is
reduced to its leaf component, and SHA-256 is computed over the exact bytes.

An imported artifact can be inspected and evaluated. The current MVP executes
only the exact published Bell sample. Other valid Q# programs remain on the
inspection/recommendation path and receive `recompile` when they would otherwise
enter local simulation. This is an intentional safety boundary, not generalized
Q# execution support.

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

Compare its program text with the published Bell sample. QCG allows leading or
trailing whitespace, but does not execute arbitrary imported Q#; the fixed Bell
program is the only auditable local execution fixture in this MVP.

### A recommendation is no longer executable

Recommendations and consent expire, and consent is single-use. Run a fresh
preflight and record a new human decision. QCG deliberately does not revive or
replay expired authority.

## 11. Security and data boundary

- Raw Q# stays in session memory and does not cross the WebMCP tool contract.
- Exported receipts omit raw Q#, secrets, provider diagnostics, credentials, and
  local filesystem paths.
- Receipts stored in IndexedDB remain local to that browser profile.
- No analytics, authentication, remote persistence, provider submission, paid
  call, or QPU call is part of the prototype.
- Collaboration messages use `identity_assurance: declared`, reject unknown
  fields and prohibited sensitive material, and remain isolated from quantum
  consent and simulation services.
