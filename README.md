# WebMCP-QCG: Quantum Call Gate

<p align="center">
  <img src="asset/thumbnail/readme/summer-gate-readme.jpg" alt="Summer Gate — WebMCP-QCG across three browser surfaces with one human decision" width="1200" />
</p>
<p align="center">
  <a href="https://doi.org/10.5281/zenodo.22240306">
    <img src="https://zenodo.org/badge/DOI/10.5281/zenodo.22240306.svg" alt="DOI: 10.5281/zenodo.22240306" />
  </a>
</p>

> **Software DOI reserved — publication pending Zenodo archive transfer.**

**Review before you run. Decide before quantum execution.**

WebMCP-QCG is a browser-native, human-in-the-loop quantum preflight workbench.
It inspects bounded evidence, recommends one of five outcomes, records an
explicit human decision, can simulate only the canonical Q# and OpenQASM Bell
programs locally, and exports a reproducible evidence receipt. It never submits
a QPU or provider job.

[Live application](https://qcg.securedme.ca/) ·
[Synchronized Vercel secondary](https://webmcp-qcg.vercel.app/) ·
[Devpost project](https://devpost.com/software/webmcp-qcg-quantum-call-gate) ·
[MIT license](LICENSE)

The Devpost page is public. Hackathon submission remains under Jean-Sébastien
Beaulieu's explicit control.

## Four seasons of one build

The seasons tell the engineering story. They are editorial chapters, not
runtime themes. The product exposes only **Dark** and **Light**.

| Autumn — choose | Winter — bound |
| --- | --- |
| <img src="asset/thumbnail/readme/autumn-gate-readme.jpg" alt="Autumn Gate — choosing a bounded problem" width="560" /> | <img src="asset/thumbnail/readme/winter-gate-readme.jpg" alt="Winter Gate — defining contracts and human authority" width="560" /> |
| The broad router idea became one browser-native call gate with explicit non-goals. [Decision trail](docs/decisions/2026-08-27-initial-portfolio.md). [Article DOI 10.5281/zenodo.22135277](https://doi.org/10.5281/zenodo.22135277). | Tool contracts, evidence receipts and five deterministic recommendations turned ambition into inspectable states. [Architecture decision](docs/decisions/2026-08-29-browser-native-hitl-quantum-preflight-workbench.md). Reserved article DOI: [10.5281/zenodo.22167091](https://doi.org/10.5281/zenodo.22167091). |

| Spring — prove | Summer — converge |
| --- | --- |
| <img src="asset/thumbnail/readme/spring-gate-readme.jpg" alt="Spring Gate — benchmarking and freezing the product" width="560" /> | <img src="asset/thumbnail/readme/summer-gate-readme.jpg" alt="Summer Gate — converging Web, F12 and Companion" width="560" /> |
| Feature expansion stopped. Q#, OpenQASM, accessibility, benchmarks and release gates became the work. [Feature-freeze decision](docs/decisions/2026-08-30-day5-spring-proof-and-feature-freeze.md). [Article DOI 10.5281/zenodo.22211182](https://doi.org/10.5281/zenodo.22211182). | Web, F12 and Companion converge around sanitized state while the human remains the decision holder. [Day 7 public trace](research/day7/DAY7_PUBLIC_SAFE_TRACE_2026-09-01.md). Reserved article DOI: [10.5281/zenodo.22240281](https://doi.org/10.5281/zenodo.22240281). |

The sequence is one continuous release argument: Autumn narrows the question,
Winter makes the boundaries explicit, Spring proves the bounded implementation,
and Summer brings the verified browser surfaces together. Each season points to
its own decision or evidence record; none is a claim that the interface changes
with the calendar.

## The decision path

```text
import → inspect → evaluate → human decision
       → optional bounded Bell simulation → export evidence
```

1. A human imports a UTF-8 artifact of at most 128 KiB and selects its profile,
   or opens one of five falsifiable demonstration cards.
2. QCG hashes the exact bytes and creates a versioned artifact manifest with
   bounded compiler evidence.
3. QCG evaluates the intent, observable, request limits and one frozen target
   profile.
4. It returns exactly one recommendation:
   `reuse_result`, `reject`, `recompile`, `simulate_first`, or
   `ready_for_external_execution`.
5. A human accepts, defers or overrides. An override requires a justification.
6. An accepted `simulate_first` recommendation can create one short-lived,
   single-use consent token for the checked-in local Bell fixture.
7. QCG exports JSON or Markdown evidence without raw source, credentials,
   provider diagnostics, consent tokens or local filesystem paths.

`ready_for_external_execution` is a preflight result. It is never provider
authorization, a QPU submission or permission to spend money.

## With WebMCP / without WebMCP

Both paths use the same deterministic QCG services and preserve human authority.
The difference is how a browser agent reaches those services.

| Without WebMCP | With WebMCP |
| --- | --- |
| The person imports, inspects, evaluates, decides, optionally grants one-use local consent, and exports through visible controls. | An agent can discover the currently eligible typed tools, call inspect/evaluate, and receive bounded structured results without scraping the interface. |
| The complete product remains usable in an ordinary browser. | Tool availability follows the same state gates: simulation appears only after `simulate_first` and visible human consent; export appears only when evidence exists. |
| Evidence is read from the interface or downloaded receipt. | Tool inputs and outputs exclude raw source, credentials, local paths and consent tokens. |

This comparison is reproducible from the [quick start](#quick-start), the
[tool table](#eight-tools-two-responsibilities), the checked-in tests and the
[public-safe browser receipt](docs/evidence/ACTIONS_200_213_G2_REAL_BROWSER_2026-09-02.md).

## One bounded state, three browser surfaces

| Surface | Current responsibility | Authority boundary |
| --- | --- | --- |
| **Web application** | Import, inspect, evaluate, record the human decision, run an approved bounded local fixture and export evidence. | The only surface that can hold consent or trigger simulation. |
| **QCG F12 panel** | Render sanitized manifest, recommendation, activity, participants and review requests for the inspected page. | Optional unpacked extension; no source, consent or simulation command crosses it. |
| **QCG Companion side panel** | Keep bounded context visible beside the active QCG tab and support structured human/agent handoffs. | Uses declared participants rather than authenticated agent identities. |

The canonical Web application is public. The F12 and side-panel surfaces are an
optional unpacked Manifest V3 Companion. Current evidence proves the Companion
opening on the canonical Chrome origin. The final retained-tab F12 sequence is
one of the release gates for the last coding and recording pass.

Gemini in DevTools remains a manual, inspectable relay:

```text
QCG sanitized export → human copy/paste → Gemini response
                     → human preview → schema-validated import
```

QCG does not claim a private Gemini API or direct access to Gemini's native
conversation.

## Eight tools, two responsibilities

### Quantum-facing WebMCP tools

| Tool | Availability | Bounded effect |
| --- | --- | --- |
| `inspect_quantum_experiment` | After a valid human-loaded manifest exists | Returns the bounded artifact manifest. Raw source never crosses the contract. |
| `evaluate_quantum_call` | After a valid manifest exists | Returns one recommendation, reason codes, unknowns, confidence and a safer alternative. |
| `run_bounded_local_simulation` | Only after valid `simulate_first` evaluation and live one-use human consent | Runs the approved Q# or OpenQASM Bell fixture locally in a Worker. |
| `export_quantum_evidence_report` | After evaluation creates a receipt | Exports JSON or Markdown without re-evaluating or executing. |

### Collaboration tools registered by the QCG page

| Tool | Purpose |
| --- | --- |
| `read_debug_context` | Read a bounded, sanitized collaboration snapshot. |
| `post_debug_message` | Add a structured observation, hypothesis, proposal or challenge. |
| `request_human_review` | Ask the human decision holder to review a bounded question. |
| `export_debug_handoff` | Export a sanitized packet for another participant or manual Gemini relay. |

The page registers collaboration tools through `devtoolstooldiscovery`. The
extension renders and transports bounded state. Collaboration tools cannot
accept a recommendation, create consent, run simulation or authorize an
external effect.

## Quantum profiles

| Capability | Profiles |
| --- | --- |
| **Bounded local fixture execution** | Q# through QDK; OpenQASM through the same pinned QDK WebAssembly runtime. |
| **Static inspection only** | Qiskit Python, Cirq/TFQ Python, TorchQuantum Python, PennyLane Python, CUDA-Q Python, CUDA-Q C++, Braket Python and QIR text. |

Only the canonical programs represented by the checked-in
[`qcg-bell-sample.qs`](prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qs)
and
[`qcg-bell-sample.qasm`](prototype/webmcp-qcg/public/fixtures/qcg-bell-sample.qasm)
fixtures can reach local simulation. QCG normalizes line endings, trailing
spaces and empty lines for this fixture identity check while preserving the
exact imported-byte digest in evidence. Arbitrary programs receive inspection
and bounded compiler evidence; they do not become executable through QCG.

## Quick start

From the repository root:

```powershell
Set-Location prototype/webmcp-qcg
npm ci
npm test
npm run build
npm run dev
```

Open the URL printed by Vite. The human interface remains usable when WebMCP is
unavailable.

Optional WebMCP evaluations:

```powershell
npm run eval:smoke
npm run eval:live
```

### Optional QCG Companion

Validate the unpacked extension:

```powershell
Set-Location companion/qcg-devtools-extension
npm test
```

Then open `chrome://extensions`, enable Developer mode, select **Load unpacked**
and choose `companion/qcg-devtools-extension/`. The production manifest is
restricted to `https://qcg.securedme.ca/*`; localhost requires the separate
development manifest workflow described in the
[Companion README](companion/qcg-devtools-extension/README.md).

The extension has no dependency installation or build step.

## Verification snapshot

Current published release-candidate verification recorded on 2026-09-02:

- repaired runtime candidate `938da498312edab8dd41c12f4b9558865993c833`
  exactly matches `origin/main`;
- canonical cPanel and the synchronized Vercel secondary each pass the 24-path
  deployment manifest. Vercel also returns exact root HTML for `/decisions`,
  seven policy headers, correct WASM/ZIP MIME types and no readable `.htaccess`;
- the repaired cPanel package SHA-256 is
  `C4FE4BB205F58B52ECDC30D73855ADF16E29A62EF578A275103632E3D47C4D50`;
- Chrome decodes all eight published brand PNGs on both hosts; this explicitly
  closes the binary-normalization defect that a byte-only host comparison had
  initially failed to reveal;
- TypeScript and Vite production build pass;
- current candidate bundle: 131 modules, 388.34 kB JavaScript and 18.84 kB
  CSS, with QDK WebAssembly tracked separately;
- a clean copy passes 88 Vitest cases across 13 test files, all 5 Companion
  gates and `npm audit` with zero vulnerabilities;
- production/development Companion ZIP SHA-256 values are respectively
  `D69B3DEE68C6DF5A28D526B5A8616CC0148CA58EA7B40F5159F2D193D4216916`
  and `33EACB2CBD3475E86E86EFD899F2540E5FD5DD7B0F0F99E6E3726BC246BBD35B`;
- the current public runtime passes the official `webmcp-evals@0.0.4` live
  inspection/evaluation smoke 2/2 and returns `simulate_first` with high
  confidence and no external authority;
- prior human-controlled real Chrome routes for imported Q# and OpenQASM reached
  `simulate_first`, a declared human acceptance, a 64-shot local Bell result,
  evidence export and zero QPU submissions;
- the retained-tab Companion/F12 proof, trusted open/close toggle, reconnect
  paths and responsive/accessibility matrix passed in the G2 browser receipt;
- the public repository is licensed under MIT.

The repaired G3 clean-copy and Actions 227–232 parity receipts establish the
current source, package and hosting chain. The official current-runtime agent
smoke is complete; the human consent, local simulation and evidence-export
portion of Action 237 remains. The source tag and hash-validated archive are
complete; software DOI publication is blocked only at Zenodo transport. Video
and Devpost submission remain separate later actions under human authority.

The repository records deterministic benchmark evidence separately from HTTP
delivery evidence. The final cPanel package, public hashes, security headers
and rollback boundary are captured in the
[publication and deployment parity receipt](docs/evidence/ACTIONS_227_232_PUBLICATION_PARITY_2026-09-02.md).

## Security and deliberate limits

- No QPU call, provider job, provider credential, payment or remote quantum
  execution exists in this release.
- The QPU submission counter is structurally fixed at zero.
- Source code, private paths, consent tokens, secrets, internal stacks and raw
  network bodies are excluded from exported contracts.
- Agent identities are declared, not cryptographically authenticated.
- Human decisions are bound to the active session and recommendation.
- Simulation remains website-only and consumes one-use local consent.
- Static profiles cannot return `simulate_first` or
  `ready_for_external_execution`.
- The access panel improves direct-use preferences; it does not claim WCAG
  certification or replace assistive technology.
- Chrome is the verified Companion runtime. Edge support remains a compatibility
  target until a dedicated runtime receipt exists.

See the [threat model](docs/security/QCG_THREAT_MODEL.md) for the complete trust
boundaries and residual risks.

## Evidence and design trail

- [Console design contract](docs/design/qcg-console-redesign/DESIGN.md)
- [DevTools multi-agent runbook](docs/DEVTOOLS_MULTI_AGENT_RUNBOOK.md)
- [Release runbook](docs/RELEASE.md)
- [Architecture decisions](docs/decisions/)
- [Machine-readable evidence](evidence/)
- [Day 7 Companion and A2A trace](research/day7/COMPANION_A2A_AND_LOW_GLARE_TRACE_2026-09-01.md)
- [Video, A2A and README status](research/day7/DAY7_VIDEO_A2A_README_STATUS_2026-09-01.md)
- [Summer 9/39 source register](research/day7/SUMMER_9_39_SOURCE_REGISTER_2026-09-01.md)
- [Gemini cold-judge disposition](docs/evidence/GEMINI_FINDING_DISPOSITION_2026-09-02.md)
- [Qodo cold-review disposition](docs/evidence/QODO_COLD_REVIEW_DISPOSITION_2026-09-02.md)
- [Actions 214–219 documentation receipt](docs/evidence/ACTIONS_214_219_DOCUMENTATION_2026-09-02.md)
- [Current-runtime WebMCP smoke receipt](docs/evidence/ACTION_237A_CURRENT_RUNTIME_WEBMCP_SMOKE_2026-09-02.md)
- [Tag, source archive and Zenodo transport receipt](docs/evidence/ACTIONS_233_236_TAG_ARCHIVE_ZENODO_2026-09-02.md)
- [Author-deferred post-submission visual refinement](docs/hackathon-build/POST_SUBMISSION_VISUAL_BACKLOG_2026-09-02.md)

## Citation and release state

- Public release tag: [`v0.1.0-hackathon`](https://github.com/SeCuReDmE-main-dev/webmcp-hackathon-2026/tree/v0.1.0-hackathon)
- Tagged source archive SHA-256:
  `7B7198BD0FAE128ADD66725FC238DE7009E2072AFFB72066F72DBC9810663D00`
- Evidence schema: `webmcp-qcg.evidence-receipt.v3`
- Reserved software DOI: [10.5281/zenodo.22240306](https://doi.org/10.5281/zenodo.22240306)
- License: [MIT](LICENSE)

The software DOI is reserved, the Git tag is public and its source archive is
locally validated. Zenodo transport failed before the file reached the draft,
so the DOI record remains unpublished and the pending badge is intentionally
unchanged. Publication resumes only after Zenodo accepts and validates that
exact tagged archive. The four editorial articles retain their independent
publication records.

## Governance

- Public construction is not a Devpost submission.
- AI agents may inspect, propose, challenge and explain. They never replace
  explicit human authority.
- Deterministic quantum libraries perform compilation and local simulation; an
  AI agent does not manufacture quantum results.
- No secret, provider credential, private correspondence or private filesystem
  path belongs in this repository or an exported receipt.
