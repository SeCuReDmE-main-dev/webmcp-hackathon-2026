# Nekuda WebMCP Workbench 1.2.2 — clean-room analysis for QCG

Status: decision-complete research brief  
Date: 2026-09-03  
Target: WebMCP-QCG Companion  
Method: public-source research plus read-only behavioral inspection of the locally installed extension. No code from the installed bundle is reproduced here.

## Executive conclusion

Nekuda Workbench does **not** automate the Gemini conversation built into Chrome DevTools. It implements its own assistant in a Chrome side panel, calls a model provider itself, discovers WebMCP tools in the current page, and returns tool results to its own agent loop.

Chrome exposes APIs for extension side panels, extension-owned DevTools panels and WebMCP tool discovery/execution. No documented extension API exposes the built-in DevTools AI Assistance conversation for third-party read/write automation. QCG must therefore keep native Gemini DevTools as a manual handoff, or provide a separate QCG-owned relay.

The recommended pre-freeze addition is a narrow local relay:

- Codex is the first verified adapter because `codex-cli 0.149.1` is installed;
- Gemini and Antigravity use the same adapter contract but remain disabled until a callable local client is verified;
- every request, response and proposed tool call requires visible human approval;
- the existing Companion 0.2.5 authority, consent and simulation boundaries remain unchanged;
- the implementation is clean-room and does not copy the installed Workbench bundle.

## Evidence snapshot

Installed extension:

- name: `nekuda WebMCP Workbench`;
- Chrome extension ID: `amochnnbmnkjjlblolhpddkokhnalkjp`;
- version: `1.2.2`;
- Manifest V3;
- service worker: `background.js`;
- side panel: `sidebar.html`;
- permissions: `sidePanel`, `storage`, `scripting`, `tabs`;
- host permissions: all HTTP and HTTPS pages;
- provider destinations declared by CSP: OpenAI, Anthropic, Google Generative Language and Nekuda's hosted proxy.

Local evidence hashes:

| File | SHA-256 |
|---|---|
| `manifest.json` | `9318b732ef26eaa53ee72b4c1719688912bad5be797be152411e02a3c9bf1c20` |
| `page-bootstrap.js` | `25fcc19d7088b22ebbe98a22f207d75e7c9d5b7d203df6c1b556ff4f162ca557` |
| `content-bridge.js` | `cf9342fd3f116337e8e467221fe3d7ae61421459599f830a5748f26d2a85afe0` |
| `content.js` | `0eb44605fd28784a8d1a3de81f11fea7d50e183dba69ce4ad4e2a3ddffb0d896` |
| `background.js` | `522e58d3bd570734745d76682e980792fdef6b7269cc5c35c5dc515983b7405e` |

These hashes identify the inspected installation. They do not establish source provenance or a licence.

## Architecture observed

```text
Web page
  document.modelContext / navigator.modelContext
           │
           ▼
MAIN-world page adapter
  discover and execute WebMCP tools
           │ typed browser events
           ▼
ISOLATED-world bridge
  correlate calls and cross the extension boundary
           │ chrome.runtime messaging
           ▼
MV3 service worker
  tab registry, provider loop, approvals, storage, telemetry
           │ long-lived extension port
           ▼
Nekuda side panel
  chat, tools, generated forms, approvals, audit and evals
```

The discovery strategy is deliberately resilient: immediate probes, delayed probes, lifecycle events, WebMCP tool-change events, context-identity checks and service-worker rehydration. Calls use correlation identifiers and timeouts. Before execution, the broker rechecks the active tab, origin, tool presence, schema identity, arguments and consequence annotations.

This is useful architecture, but several Workbench choices do not fit QCG:

- injection across every HTTP(S) site;
- `tabs` and `scripting` permissions;
- an automatic global WebMCP shim;
- provider secrets stored inside the extension boundary;
- hosted proxy traffic and implicit telemetry;
- broad local browsing history;
- a general-purpose executor able to act on arbitrary sites.

QCG should reuse only the public behavioral patterns: deterministic discovery, typed envelopes, context binding, schema revalidation, one-shot approvals, result fencing, reconnection and auditable transcripts.

## Public-source and licence finding

No public repository or public licence was found for Workbench 1.2.2. The installed package has no source map, `LICENSE`, `NOTICE`, repository field or source declaration. The current extension must be treated as proprietary unless its publisher states otherwise.

The strongest public precursor is:

- <https://github.com/Idan-Levin/gemma4-browser-extension/tree/feat/webmcp-page-tools>

Its two WebMCP commits already show the MAIN-to-ISOLATED bridge and page-tool loop:

- <https://github.com/Idan-Levin/gemma4-browser-extension/commit/adfd0a1da3d78fad7941b0e98b2b241f2e53a0b1>
- <https://github.com/Idan-Levin/gemma4-browser-extension/commit/9a855ff7b2c9fbb1c2123d7195c3d2ef3ff5886d>

This branch has no declared licence. Similarity supports probable lineage, but it is not an official provenance statement and grants no reuse right.

Explicitly licensed references suitable for clean-room research are:

- Nekuda WebMCP Kit, MIT: <https://github.com/nekuda-ai/webmcp-kit>
- WebMCP DevTools, MIT: <https://github.com/2019-02-18/WebMCP-DevTools>
- Brow, Apache-2.0: <https://github.com/Shijou87/Brow>
- Chrome DevTools MCP: <https://github.com/ChromeDevTools/chrome-devtools-mcp>
- Chrome WebMCP imperative API: <https://developer.chrome.com/docs/ai/webmcp/imperative-api>
- Chrome Side Panel API: <https://developer.chrome.com/docs/extensions/reference/api/sidePanel>
- Chrome DevTools Panels API: <https://developer.chrome.com/docs/extensions/reference/api/devtools/panels>
- Chrome DevTools AI Assistance: <https://developer.chrome.com/docs/devtools/ai-assistance>

Clean-room rule: use public specifications and independently written tests as the source of truth. Do not copy bundle code, strings, layout, icons, provider prompts or undocumented internal names.

## QCG current state and actual gap

QCG already has a real inbound agent route through Chrome DevTools MCP:

```text
Codex / Gemini-capable MCP client / Antigravity
        │ chrome-devtools-mcp
        ▼
QCG page-defined collaboration tools
        │
        ▼
DebugLedger → Web, F12 and Companion projections
```

The four collaboration tools are `read_debug_context`, `post_debug_message`, `request_human_review` and `export_debug_handoff`. They do not grant quantum authority.

The missing leg is outbound and correlated:

```text
Companion human request → local agent → candidate response → human approval → ledger
```

Current manual Gemini handoffs are stored in a page-memory `Map`. They are not durable, not pushed to an agent and disappear on reload. `HandoffCoordinator` is test-only and is not wired to the extension or a live agent. One contract divergence also needs correction: documentation describes observations, hypotheses, proposals and challenges, while `post_debug_message` currently accepts only an open observation.

## Technology selection

Weights: authority/security 35%, fit with current QCG 25%, reliability 20%, delivery effort 10%, operator usability 10%.

| Candidate | Weighted result | Decision |
|---|---:|---|
| Local loopback relay with Codex-first adapters | 88/100 | Select for bounded pre-freeze implementation |
| Chrome on-device Prompt API / Gemini Nano | 72/100 | Keep as a later private-model adapter |
| Server-side Gemini proxy | 65/100 | Later only, after auth/cost/privacy design |
| BYOK keys stored in the extension | 48/100 | Reject for QCG |
| DOM/internal automation of Gemini DevTools chat | 24/100 | Reject as unsupported and brittle |

The selected path does not pretend to be the native DevTools Gemini assistant. It creates a QCG-owned, provider-neutral relay that can be attached to local agent clients.

## Target architecture

```text
QCG page and DebugLedger
        │ existing sanitized bridge
        ▼
QCG Companion 0.3 relay surface
  compose, approve, cancel, review
        │ authenticated loopback WebSocket
        ▼
qcg-agent-relay local process
  request queue, adapter registry, bounded audit
        │
        ├─ CodexAdapter        ACTIVE and tested
        ├─ GeminiCliAdapter    DISABLED until binary/auth probe passes
        └─ AntigravityAdapter  DISABLED until callable interface is verified
```

The local process binds only to `127.0.0.1`, chooses an ephemeral port, and displays a 256-bit pairing token once. The token is entered by the human into the Companion and retained only in `chrome.storage.session`. It is never placed in a URL, repository, receipt, console line or provider prompt. The WebSocket rejects non-loopback connections, a missing token, a wrong extension origin, replayed nonces and context mismatches.

The extension keeps its current production host allowlist. It adds only loopback `connect-src`; it does not add all-site host access, `tabs`, `scripting`, `nativeMessaging` or provider domains.

### Relay lifecycle

1. The human starts the local relay and pairs the Companion.
2. The Companion displays the verified adapter and current QCG binding.
3. The human composes a bounded request and explicitly approves transmission.
4. The relay creates one ephemeral Codex invocation with the sanitized QCG snapshot and request.
5. Codex runs in read-only mode, with an output schema, no inherited MCP servers and no authority to mutate QCG.
6. The response returns as untrusted `candidate`, bound to the exact request.
7. The Companion displays the candidate; the human explicitly approves or rejects its import.
8. An approved response becomes one ledger observation. Rejection leaves a receipt without importing content.
9. Navigation, reset, tab replacement, session mismatch, timeout or cancellation invalidates the pending exchange.

Every tool call is approval-gated. Read operations are not silently auto-executed. The first version carries a sanitized snapshot in the approved request rather than letting Codex query arbitrary browser state.

## Public contracts

Add a separate protocol instead of changing the evidence receipt schema:

```ts
type RelayEnvelopeV1 =
  | RelayHello
  | RelayRequest
  | RelayCandidate
  | RelayApproval
  | RelayCancellation
  | RelayReceipt

interface RelayBindingV1 {
  tab_id: number
  page_id: string
  session_id: string
  document_epoch: string
  origin: 'https://qcg.securedme.ca' | 'http://127.0.0.1:5173'
}

interface RelayRequestV1 {
  schema_version: 'qcg-agent-relay-request.v1'
  request_id: string
  adapter: 'codex'
  intent: 'debug' | 'search' | 'find' | 'brainstorm' | 'decision'
  prompt: string
  evidence_refs: string[]
  binding: RelayBindingV1
  created_at: string
  expires_at: string
  nonce: string
}

type RelayResultV1 =
  | { ok: true; request_id: string; candidate: string; confidence: 'high' | 'medium' | 'low'; evidence_refs: string[] }
  | { ok: false; request_id: string; error: { code: string; message: string; retryable: boolean } }
```

Constraints:

- prompt and candidate: maximum 1,200 sanitized characters;
- maximum 12 evidence references;
- one active request per QCG session;
- 15-minute request TTL, 120-second invocation timeout;
- one candidate and one final disposition per request;
- all identifiers UUIDs except the existing bounded page routing ID;
- duplicate, late or conflicting replies are rejected;
- error text is coded, sanitized and bounded;
- no raw source, credentials, paths, HTTP bodies, stack traces, consent token or simulation payload crosses the relay.

Add `local_agent_relay` to the collaboration transport enum and keep identity assurance equal to `declared`. Do not change `webmcp-qcg.evidence-receipt.v3`.

## Authority policy

The relay may propose or return an observation. It may never:

- record a human decision;
- acknowledge or dispose of a human review request;
- remember or forget human memory;
- create, revoke or consume consent;
- invoke simulation;
- export the canonical evidence receipt;
- submit to a provider or QPU;
- publish or deploy anything.

All imports and all future tool calls require a fresh, visible, one-use human approval tied to `request_id + tool_name + arguments_digest + binding + expiry`. The relay cannot approve its own request.

## Implementation seams

### Page and ledger

- Make relay requests, candidates, cancellation and expiry durable in the debug session rather than an in-memory handoff map.
- Project only sanitized relay state into the Companion snapshot.
- Resolve the `post_debug_message` contract intentionally: either support all documented non-authority message kinds or narrow the documentation. For the relay, use observations only until additional kinds have explicit tests.
- Preserve the existing four collaboration tools; do not inflate the public WebMCP tool count.

### Companion

- Add a Relay section containing adapter status, pairing, request composer, approval card, candidate preview, reject/import and cancellation.
- Extend the existing MAIN → ISOLATED → background validation chain with a separate `agent-relay` capability. It must not share the nine human command allowlist.
- Persist only reconnection metadata and pending opaque IDs in `storage.session`; keep transcript content in the page ledger.
- Reconnect after service-worker suspension and require a fresh snapshot before enabling approvals.

### Local relay

- Add a small separately packaged Node process under the Companion area with no runtime dependency on the application bundle.
- Define an `AgentAdapter` interface: availability probe, invoke with `AbortSignal`, structured output, cancel and close.
- Implement Codex with `codex exec --ephemeral --ignore-user-config --sandbox read-only --output-schema ...` and a dedicated working directory. Authentication may be reused, but user MCP configuration and repository mutation are not inherited.
- Define Gemini CLI and Antigravity adapter descriptors as unavailable until their command, version and authentication probes pass. Never silently fall back to a cloud provider.
- Redact all stdout/stderr before any UI or ledger projection; raw process output remains local and is discarded after the bounded receipt is formed.

## Test and evaluation gates

Unit and contract tests:

- pairing success, bad token, replayed nonce and wrong extension origin;
- exact tab/page/session/epoch binding;
- request TTL, invocation timeout, cancellation and navigation invalidation;
- duplicate candidate and conflicting responder rejection;
- full sanitizer parity across page, MAIN, ISOLATED, background and relay;
- forbidden source, secret, path, stack, body, consent and simulation fields;
- every request and every candidate import requires a one-shot human approval;
- model output cannot approve itself or create a human/consent command;
- Codex process uses the constrained flags and structured output;
- missing Gemini/Antigravity binaries render `unavailable`, never `connected`;
- existing 94 application tests and five Companion gates remain green.

Browser tests:

- connect, request, candidate, reject, retry and approved import in Chrome;
- service-worker suspension and deterministic reconnection;
- reload, navigation, tab close and stale session;
- Dark/Light, keyboard, focus, zoom and narrow side panel;
- no new console errors, unexpected requests or provider traffic;
- current manual Gemini handoff still works as fallback;
- current direct Chrome DevTools MCP collaboration still works.

Agent evaluation set:

- ordinary debugging question;
- ambiguous request requiring a human clarification;
- malicious prompt attempting to obtain raw Q#/OpenQASM;
- request for consent or simulation;
- stale request after navigation;
- duplicate response race;
- Unicode and maximum-byte boundaries;
- agent hallucination of evidence IDs;
- unavailable adapter and relay crash.

Release is green only when every protected authority/security slice passes, not merely the aggregate score.

## Rollout and rollback

Because the author selected integration before the freeze:

1. Snapshot the current dirty worktree and preserve unrelated hotfix work and user evidence.
2. Implement the relay behind a default-off feature flag.
3. Package it as Companion `0.3.0-rc.1`; keep the validated 0.2.5 ZIP available.
4. Do not change the software DOI, evidence receipt v3, public quantum-tool count or submitted release tag.
5. Run clean clone, application suite, Companion gates, relay tests and real-Chrome evidence.
6. Enable the feature only in the development package until the Codex end-to-end receipt passes.
7. Promote to the production Companion only after the full gate and explicit author freeze decision.
8. Rollback is removal of the RC package and reload of the retained 0.2.5 ZIP; no data migration is required.

If the remaining freeze window cannot accommodate all security gates, freeze 0.2.5 and retain the relay as an experimental branch. A partially validated relay must never replace the known-good Companion.

## Follow-up identity actions

Public profiles to follow or watch manually if not already followed:

- Idan Levin: <https://github.com/Idan-Levin>
- Nekuda organization: <https://github.com/nekuda-ai>

Following is a social-account mutation and is not part of the technical release gate.

## Final decision

QCG is ready for a real local agent channel, but that channel is **not** the native Gemini DevTools conversation. The minimal safe product is a correlated, sanitized and human-approved relay owned by QCG. Codex can be proven now; Gemini and Antigravity become adapters only after a real local interface exists. This preserves the core contribution: agents may observe and propose, while the human alone authorizes evidence-changing action.
