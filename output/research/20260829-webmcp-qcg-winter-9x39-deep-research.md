# WebMCP-QCG Winter — 9/39 deep-research matrix

_Research freeze: 2026-08-29, America/Toronto_

## Mandate

This corpus supports the nine chapters of the Winter Day 3–4 article and the next engineering session. It contains exactly **30 non-webinar sources assigned once across nine chapters**. Together, the nine chapter surfaces and thirty sources form the `9/39` research method.

The questions are practical:

1. Which QCG decisions are supported by current primary evidence?
2. Which statements or implementations require correction?
3. Which changes produce the strongest browser, F12, security and visual proof tomorrow?
4. How can Stitch become a design-system input rather than a generic page generator?

## Local ground truth reviewed

- Repository: `Z:\03_LABS_EXPERIMENTS\WebMCP-Hackathon-2026`
- Baseline commit reviewed: `2c3b4cd`
- Current engineering receipt: `34/34` tests in six files and a successful TypeScript/Vite production build.
- Quantum surface: four progressively registered WebMCP tools, local bounded Q# execution in a Worker and five deterministic recommendations.
- Collaboration surface: four separate third-party DevTools tools, an append-only bounded ledger and a Manifest V3 F12 panel.
- Current visual receipt: functional Winter desktop/mobile captures with a readable but still dashboard-like card hierarchy.
- Preserved user material: the untracked `asset/.stitch/` directory was inspected read-only and remains untouched.

## Executive evaluation

### KEEP

- The narrow product position: a browser-native, human-in-the-loop quantum preflight gate.
- The sequence `inspect → evaluate → human decision → conditional local simulation → evidence receipt`.
- Four quantum WebMCP tools separated from four collaboration-only DevTools tools.
- Q# as the single real execution proof for this release.
- Strict schemas, bounded responses, one-use consent, effect counters and the zero-provider-call boundary.
- The four-season token model with identical DOM and decision logic.

### CORRECT

- WebMCP is a current Community Group draft and Chrome origin-trial surface, not a stable W3C standard. Pin dates and tested versions in every architecture claim.
- The F12 extension is structurally implemented, yet the repository still lacks the decisive installed-panel/live-tool receipt on the inspected tab.
- The panel currently trusts the value returned from `inspectedWindow.eval`. Chrome documents that the inspected page controls that main-world result; validate schema, origin, version and size again inside the extension.
- The third-party discovery listener is attached after asynchronous IndexedDB initialization. Register the listener synchronously so automatic discovery cannot race startup.
- Three tools currently advertise `readOnlyHint: true` while changing application state: inspection invalidates downstream decision state, evaluation creates a recommendation/receipt, and export increments counters and replaces the receipt. Either make them true reads or mark them non-read-only, then test annotation truth against state deltas.
- `chrome-devtools-mcp@latest` weakens reproducibility. Pin `1.8.0` for the recorded proof and pass an explicit `pageId`.
- The built-in Gemini DevTools assistant has no documented public bridge that QCG can command. Present Gemini collaboration as manual or as a separate client with declared identity.
- The Winter manuscript says `34/34` in its receipt but still says “Twenty-six passing tests” in one claim boundary. Change that sentence to 34.
- The current UI is technically coherent but visually resembles a common AI dashboard: repeated blue cards, equal visual weights and a weak product silhouette.
- Firecrawl can retrieve and normalize current primary documentation efficiently, but it does not verify truth and its calls consume bounded credits. Keep credentials and network calls outside browser code.

### BUILD TOMORROW

1. Harden and prove the F12 boundary before adding features.
2. Turn the current interface from a card grid into one recognizable QCG instrument.
3. Use Stitch to diverge on components and compositions, then implement the selected direction in the existing React system.
4. Capture three signature states: experiment intake, human decision gate and evidence receipt with the F12 ledger.
5. Design an optional Firecrawl target-evidence refresh adapter as a post-MVP candidate; do not add a fifth runtime tool until the four-tool proof is complete.

## Chapter 1 — The Gate Became a Product

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 01 | [WebMCP Draft Community Group Report](https://webmachinelearning.github.io/webmcp/) | `document.modelContext` exposes JavaScript tools to agents and explicitly frames collaborative workflows with shared context and user control. The document is a Community Group draft dated 26 August 2026. | **KEEP** the browser-native product surface. **CORRECT** any wording that calls it a settled W3C standard. | Pin the draft date and tested browser version in the ADR and receipts. | Confirmed primary; volatile draft |
| 02 | [Chrome WebMCP imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) | The imperative surface supports programmatic registration, structured inputs, execution and lifecycle cleanup. | **KEEP** the current programmatic tools and AbortSignal-based cleanup. | Add a lifecycle acceptance test covering register, abort, re-register and navigation. | Confirmed primary |
| 03 | [OpenAI Site tools documentation](https://learn.chatgpt.com/docs/webmcp) | ChatGPT currently discovers JavaScript-registered tools in the top-level page, supports only a subset of WebMCP, and recommends narrow inputs, explicit side effects and a complete human interface. | **KEEP** top-level JavaScript registration and progressive enhancement. | Run a recorded ChatGPT in-app-browser proof; avoid declarative/iframe claims. | Confirmed primary; current product limits |
| 04 | [IBM Quantum — Minimize job run time](https://quantum.cloud.ibm.com/docs/en/guides/minimize-time) | QPU consumption and cost scale with shots; reusable models also have freshness limits. This validates preflight value while remaining vendor-specific. | **KEEP** cost awareness. **CORRECT** any universal savings claim. | Express effects as measured local counters and provider-neutral risk reasons, never promised dollars saved. | Confirmed primary; vendor-specific |

**Chapter conclusion.** QCG solves a real interaction problem when it helps a human and an agent make the call legible before an external quantum action. The strongest claim is decision quality and evidence, not guaranteed savings.

## Chapter 2 — Four Seasons, One Unchanging Workflow

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 05 | [Google Labs — Design UI using AI with Stitch](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) | Stitch now supports an AI-native canvas, divergent directions, interactive prototypes and `DESIGN.md` import/export. | **CORRECT** the workflow: Stitch should explore and formalize a design system, not replace the live app with generated pages. | Import the current screenshot and `DESIGN.md`; request three divergent versions of one signature state at a time. | Confirmed first-party product source |
| 06 | [Google Design — Human-Centered AI](https://design.google/library/ux-ai) | Novel AI products should spend cognitive load carefully, preserve familiar patterns, strengthen control and keep final curation with the user. | **KEEP** human authority. **CORRECT** ornamental complexity that obscures the decision. | Build one familiar three-zone instrument: evidence, recommendation and human gate. | Confirmed first-party design case study |
| 07 | [W3C — CSS Custom Properties Level 1](https://www.w3.org/TR/css-variables-1/) | Custom properties provide a standards-based token layer for themes without duplicating structure. | **KEEP** four seasons over one stable DOM. | Consolidate color, typography, spacing, radii, shadow, tree and motion tokens in one typed season manifest. | Confirmed standard |
| 08 | [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Perceivable state, keyboard operation, focus visibility, contrast and alternatives to color are testable requirements. | **KEEP** the accessibility gates. | Test all four seasons at 320 px, keyboard-only, grayscale, reduced motion and contrast AA. | Confirmed standard |

**Chapter conclusion.** The four seasons become distinctive when they change atmosphere and editorial rhythm while preserving the same product behavior. The workflow stays stable; the visual language becomes authored.

## Chapter 3 — Four Tools, Five Decisions

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 09 | [Chrome — WebMCP tool security](https://developer.chrome.com/docs/ai/webmcp/secure-tools) | Tool outputs can require `untrustedContentHint`; read-only behavior should be declared truthfully, and cross-origin exposure must be explicit and narrow. | **KEEP** strict schemas and same-origin defaults. **CORRECT** the three false `readOnlyHint: true` annotations. | Make annotations match actual state effects; add a test comparing every hint with before/after snapshots and mark external web evidence untrusted. | Confirmed primary; guidance evolving |
| 10 | [Microsoft QDK — qsharp npm module](https://github.com/microsoft/qdk/tree/main/source/npm/qsharp) | The package provides browser and Node entry points, compiler/language services, WebAssembly and Worker-compatible asynchronous services. | **KEEP** `qsharp-lang@1.31.0` in the browser Worker as the real executable proof. | Record the exact package, WASM hash, cancellation behavior and browser load path. | Confirmed primary repository |
| 11 | [Microsoft — QDK simulator overview](https://learn.microsoft.com/en-us/azure/quantum/simulators-overview-qdk) | Simulators have different capabilities and compatibility boundaries; one simulator does not imply universal backend readiness. | **KEEP** bounded local Q# simulation. **CORRECT** any suggestion that the MVP is a universal quantum router. | Make target profile freshness and unsupported capability reasons visible in the decision rail. | Confirmed primary |

**Chapter conclusion.** Four tools remain sufficient because the five recommendations are product states, not five additional execution endpoints. QCG earns trust through a small, explicit contract.

## Chapter 4 — Engineering the Proof: 34 Tests, One Build

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 12 | [Chrome — WebMCP evals](https://developer.chrome.com/docs/ai/webmcp/evals) | WebMCP tools require dedicated evaluation beyond ordinary UI tests. | **BUILD** a separate agent-tool evaluation receipt. | Run the official eval flow against discovery, selection, argument construction and result usability. | Confirmed primary; experimental tooling |
| 13 | [Vitest — Test run lifecycle](https://vitest.dev/guide/lifecycle.html) | Setup, hooks, teardown and process lifecycle affect whether a green suite is also a reliable completed run. | **KEEP** the 34/34 receipt while treating exit reliability as part of the gate. | Preserve a non-watch command with a confirmed exit code and timeout. | Confirmed primary documentation |
| 14 | [Vite — Building for production](https://vite.dev/guide/build) | A production build has distinct bundling, asset and deployment behavior from the development server. | **KEEP** the production-build receipt. | Record bundle contents, Worker/WASM paths and SHA-256 values from the exact deploy artifact. | Confirmed primary documentation |

**Chapter conclusion.** The article must say 34/34 consistently. Unit tests establish code behavior; live browser and agent receipts establish the remaining product claims.

## Chapter 5 — Winter Under Browser Inspection

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 15 | [Chrome DevTools — Debug WebMCP tools](https://developer.chrome.com/docs/devtools/application/webmcp) | The Application/WebMCP pane shows available tools, schemas, invocation counters, status, inputs and outputs and permits manual runs. | **KEEP** this as the native judge-visible proof surface. | Capture all four tools in the native pane and one successful plus one rejected manual invocation. | Confirmed primary; experimental feature |
| 16 | [Chrome Extensions — `devtools.panels`](https://developer.chrome.com/docs/extensions/reference/api/devtools/panels) | MV3 extensions can create a true DevTools panel; `onShown` and `onHidden` provide the correct visibility lifecycle. | **CORRECT** the current polling trigger. | Move refresh activation to panel `onShown/onHidden`; keep the 750 ms interval only while shown. | Confirmed primary API |
| 17 | [Chrome Extensions — `devtools.inspectedWindow`](https://developer.chrome.com/docs/extensions/reference/api/devtools/inspectedWindow) | `eval` executes in the inspected page’s main world, and the page controls that result. Extension code must process it as untrusted input. | **CORRECT** the current direct trust of `current`. | Add a panel-side strict validator, origin/schema-version check and maximum serialized size before render or clipboard copy. | Confirmed primary API; critical security correction |
| 18 | [Chrome DevTools MCP — Third-party developer tools guide](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md) | Pages can expose bounded third-party DevTools tools through `devtoolstooldiscovery`; support requires an experimental category flag. | **KEEP** the four collaboration-only tools. **CORRECT** any stability claim. | Register discovery synchronously, pin the tested CLI and retain `evaluate_script` as fallback. | Confirmed maintainer documentation; experimental |

**Chapter conclusion.** The F12 code is a serious beginning. “Works 100%” becomes publishable only after the extension is installed, attached to the right tab, invoked and captured with authority counters unchanged.

## Chapter 6 — When DevTools Became a Shared Room

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 19 | [Chrome DevTools MCP — Configuration](https://developer.chrome.com/docs/devtools/agents/get-started/configuration) | Experimental WebMCP and third-party categories require explicit configuration; multi-tab routing must be deliberate. | **BUILD** one reproducible launch configuration. | Document exact flags, Chrome version, debugging port and explicit `pageId` sequence. | Confirmed primary documentation |
| 20 | [Chrome DevTools — AI assistance](https://developer.chrome.com/docs/devtools/ai-assistance) | Gemini in DevTools is a user-facing assistance surface. The public documentation does not expose a direct automation bridge for QCG. | **CORRECT** the multi-agent story. | Keep “copy sanitized context to Gemini” and separate Gemini-client collaboration; avoid claims of controlling built-in Gemini. | Confirmed primary; inference from documented surface |
| 21 | [Chrome DevTools MCP v1.8.0 release](https://github.com/ChromeDevTools/chrome-devtools-mcp/releases/tag/chrome-devtools-mcp-v1.8.0) | Version 1.8.0, released 25 August 2026, makes `pageId` required by default for page-scoped tools. | **CORRECT** `@latest`; **KEEP** explicit tab identity. | Pin `chrome-devtools-mcp@1.8.0` in the runbook and receipt. | Confirmed maintainer release |

**Chapter conclusion.** Codex, Gemini and the human can share evidence only when the same tab, declared identity and authority boundary are explicit. The ledger coordinates; it never grants quantum authority.

## Chapter 7 — Evidence Can Travel; Authority Stays Human

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 22 | [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) | Governance requires defined human/AI roles, documented limits, oversight and traceable decisions. | **KEEP** `AgentRecommendation` separate from `HumanDecision`. | Add one end-to-end assertion that every executable local action references a valid human decision and one-use consent. | Confirmed institutional framework |
| 23 | [Model Context Protocol specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/index) | Tool descriptions and operations require caution, explicit user consent, clear UI and retained human control. | **KEEP** the authority boundary and review surface. | Make tool side effects and the inability of collaboration tools to execute visible in both UI and schemas. | Confirmed protocol specification; used as safety guidance, not WebMCP wire claim |
| 24 | [Chrome DevTools MCP issue #2242 — page-controlled prompt-injection surface](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/2242) | Maintainer issue evidence shows that page-controlled third-party group/tool strings can reach model context and therefore form a prompt-injection boundary. | **KEEP** fixed descriptions. **BUILD** explicit metadata hardening tests. | Reject controls/bidi/newlines in names and keep titles/descriptions compile-time constants with no page or user interpolation. | Confirmed maintainer issue; implementation-sensitive |
| 25 | [Firecrawl — Search](https://docs.firecrawl.dev/features/search) | Search can return URLs plus clean structured page content and highlights in one request; costs grow with result count and optional scraping. | **RESEARCH ADAPTER**, not an unrestricted agent browser. It improves evidence collection, not truth verification. | Specify `propose_target_profile_refresh`: server-side secret, primary-domain allowlist, result/credit cap, cache, source URL, retrieval time, content hash, `untrustedContentHint` and human approval before replacing a target profile. | Confirmed primary product documentation; service and pricing can change |

**Chapter conclusion.** Portable evidence is useful because authority stays local and visible. Every context transfer remains bounded, declared and reviewable.

## Chapter 8 — Packaging the Boundary Before Deployment

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 26 | [Chrome Extensions — Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) | MV3 narrows extension execution and disallows remotely hosted code, improving reviewability of the local panel package. | **KEEP** the unpacked MV3 companion. | Add the tested minimum Chrome version, package hash and install/reload instructions. | Confirmed primary |
| 27 | [cPanel — Domains](https://docs.cpanel.net/cpanel/domains/domains/) | Domains and subdomains can use isolated document roots, making the deployed boundary observable and reversible. | **KEEP** `qcg.securedme.ca` as the canonical isolated origin. | Verify document root, TLS, MIME for WASM, security headers, rollback and that root HTML differs from `securedme.ca`. | Confirmed primary operational documentation |

**Chapter conclusion.** The release package is credible when its origin, extension, WASM, bundle and artifact receipts can all be tied to exact bytes and reproduced. The existing digest implementation remains a local test obligation even though the 30-source editorial corpus assigns this chapter only two external sources.

## Chapter 9 — Winter Ends at the Author’s Gate

| ID | Unique source | What it establishes | Verdict for QCG | Tomorrow action | Confidence |
|---:|---|---|---|---|---|
| 28 | [Microsoft — Quantum Resource Estimator](https://learn.microsoft.com/en-us/azure/quantum/intro-to-resource-estimation) | Resource estimation provides a concrete example of evaluating requirements and assumptions before committing to future quantum execution. | **KEEP** the 2027–2029 vision as preparation and estimation, not present QPU authority. | Add a future adapter contract to the roadmap only; keep it outside the MVP code path. | Confirmed primary |
| 29 | [Infleqtion — Shunkai neutral-atom system](https://infleqtion.com/infleqtion-collaboration-with-japan-moonshot-program-achieves-major-milestone-shunkai-neutral-atom-quantum-computer-now-operational/) | Shunkai is a real operational milestone using neutral-atom technology and an apparatus without a cryogenic refrigerator. The atoms are still cooled to ultracold conditions. | **CORRECT** the editorial wording: “no cryogenic refrigerator” never means “atoms are not cooled.” | Preserve this exact fact/interpretation boundary in the article’s future-facing section. | Confirmed first-party announcement; performance claims not independently validated here |
| 30 | [QIR Alliance — Quantum Intermediate Representation specification](https://github.com/qir-alliance/qir-spec/blob/main/specification/README.md) | QIR separates language-specific, generic and target-specific compilation phases and uses profiles because targets support different capability subsets. | **KEEP** interoperability as a future architecture horizon. **CUT** universal-backend claims from the MVP. | Record a roadmap ADR for profile-aware receipts; ship only the Q# proof now. | Confirmed primary repository |

**Chapter conclusion.** Winter closes with a working, narrow gate and a disciplined horizon. The author’s final decision remains the last state transition.

## F12 “100% proof” acceptance sequence for tomorrow

1. Pin Chrome DevTools MCP `1.8.0`; record Chrome version, flags and debugging port.
2. Correct all false `readOnlyHint` annotations or refactor the associated operations into true reads; add an annotation/state-delta contract test.
3. Attach the `devtoolstooldiscovery` listener synchronously before IndexedDB finishes opening; buffer early requests or answer from the memory fallback.
4. Validate every `inspectedWindow.eval` result again in the panel with a closed schema, bridge version, trusted QCG origin and serialized-size cap.
5. Drive polling from `ExtensionPanel.onShown/onHidden`; stop all refresh work while hidden.
6. Add `minimum_chrome_version` matching the tested release and document unpacked installation.
7. Open QCG, install/reload the extension, close/reopen F12 and select the QCG panel.
8. Use `list_pages`, preserve the returned `pageId`, then discover the four third-party tools.
9. Execute `read_debug_context`, post one Codex observation, post one separately declared Gemini counter-analysis, request human review and acknowledge it in F12.
10. Export the handoff and prove that simulation consent, provider calls and quantum authority counters did not change.
11. Repeat negative cases: wrong origin, missing bridge, malformed/oversized snapshot, duplicate discovery, navigation, unmount and extension reload.
12. Capture the native WebMCP pane, the QCG panel, the visible human decision and the exported receipt in one versioned evidence bundle.

## Firecrawl decision boundary

The idea is valuable when Firecrawl is treated as an **evidence acquisition adapter**. It can search and retrieve source content in a format that is easier for an agent to inspect than ordinary search-result snippets. This often feels more precise because relevant passages, clean Markdown and structured extraction can arrive with the URLs. Precision still depends on the query, domain restrictions, source quality, extraction schema and later validation; Firecrawl itself does not certify correctness.

The safe QCG architecture is:

```text
human requests refresh
  → server-side Firecrawl search/scrape on allowlisted official domains
  → candidate target-profile snapshot
  → URL + retrieved_at + content hash + TTL + cost receipt
  → agent compares candidate with canonical profile
  → human approves, defers or rejects replacement
```

For this hackathon release:

- use Firecrawl immediately for research and source refreshes;
- keep its credential outside Vite, the page, WebMCP schemas and exported receipts;
- never expose broad `search_the_web` or `crawl_any_site` authority;
- cap URLs, pages, bytes, time and credits;
- cache and deduplicate before calling again;
- mark fetched content as untrusted;
- preserve the current four-tool MVP until the core proof is complete;
- place `propose_target_profile_refresh` in a post-proof ADR, then implement it only if the F12 and visual gates are already green.

## Rapid visual-realization pipeline for Stitch

### The core correction

The current app is not technically generic. Its **visual silhouette** is. Repeated rectangular cards, equal border weights and a conventional hero make it resemble many agent dashboards. A full-page Stitch regeneration would intensify that similarity.

### One-day differentiation method

1. Freeze the current functional UI as the non-regression baseline.
2. Give Stitch only three sources of truth: the current live screenshot, canonical `DESIGN.md` and one target state.
3. Request three deliberately divergent compositions for each target state rather than three color variations of the same dashboard.
4. Select one recognizable structure: **artifact inlet → decision rail → human gate → evidence receipt**.
5. Translate the chosen direction into React components, typed tokens and original SVG assets; never paste the raw generated page into the product.
6. Build a small QCG signature pack: gate seam, evidence cube, provenance nodes, winter branches and five decision glyphs at 16/20/24 px.
7. Reduce repeated cards. Use one central instrument canvas, one persistent state rail and one evidence drawer.
8. Let only the active decision emit light or motion. Keep all metrics real and state-driven.
9. Apply seasons through tokens, edge vegetation, lighting and texture while preserving DOM, reading order and functionality.
10. Validate three signature screenshots in desktop and mobile: intake, human decision and F12/evidence receipt.

### Visual uniqueness gates

- **Five-second silhouette:** a viewer recognizes the gate/rail/cube structure after five seconds without reading the title.
- **Thumbnail:** the main decision and human authority remain legible at Devpost-card size.
- **Grayscale:** hierarchy survives without seasonal color.
- **No card soup:** no screen presents more than one dominant container and two supporting panels.
- **No fake science:** every counter, waveform, graph and status is backed by runtime state.
- **No stock future-tech:** avoid generic glowing brains, robot heads, random atom art and decorative fake telemetry.
- **Seasonal continuity:** Autumn, Winter, Spring and Summer remain unmistakably related products rather than four unrelated skins.

## Priority order for the next coding session

### P0 — Claim and security gates

- Correct `Twenty-six` to `34/34` in the Winter manuscript.
- Correct the three false `readOnlyHint` annotations and add the state-delta test.
- Synchronous third-party discovery listener.
- Panel-side validation, trusted-origin/version gate and size cap.
- Pin DevTools MCP `1.8.0` and explicit `pageId`.
- Complete the installed F12 live proof and negative cases.

### P1 — Visual signature

- Replace the card-grid composition with the QCG instrument layout.
- Implement original SVG signatures and a typed four-season token manifest.
- Realize only the three signature screens first.
- Add visual regression captures, grayscale, reduced-motion and accessibility checks.

### P2 — Reproducibility and article receipts

- Pin top-level package versions currently declared as `latest` while preserving the lockfile.
- Record deploy, extension and WASM hashes.
- Record the Firecrawl adapter ADR with allowlist, TTL, cache, byte/credit cap and human-approval boundary; keep it outside the four-tool release unless all P0/P1 gates pass.
- Update README, runbook, Day 3–4 article and Devpost draft with the new receipts only after the proofs exist.

## Final research verdict

**GO, narrow and evidence-led.** QCG has a credible differentiation: it intervenes before an external quantum action, binds agent advice to deterministic evidence and leaves the decision with the human. The current implementation already supports this story. Tomorrow’s highest-value work is proof and presentation: harden the F12 trust boundary, produce the live multi-agent receipt and give the product a silhouette that only QCG could own.
