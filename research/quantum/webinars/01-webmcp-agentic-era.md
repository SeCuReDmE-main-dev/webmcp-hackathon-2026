# WebMCP — Build your website for the agentic era (source analyzed)

Replay: https://www.youtube.com/watch?v=HdCc-KezQPk · Chrome for Developers · Google I/O 2026 · 2026-05-22 · 38:47. Status: `SOURCE_ANALYZED`, not `WATCHED`.

Key replay evidence: current-context tool registration (12:41–17:40); tab-bound/ephemeral lifecycle (20:09–21:03); imperative/declarative APIs and AbortController (22:01–25:15); explicit types, runtime validation, descriptive errors, graceful rate limits, atomic tools and context registration (26:16–30:24); agentic Lighthouse audit claim from Chrome 150 (30:48–31:23); non-deterministic agent evals (31:32–32:53); DevTools invocation counts, input/output and registration source (33:00–35:25).

Current-doc correction: video wording uses `navigator.modelContext`; current draft formalizes `document.modelContext` with `registerTool`, `getTools`, `executeTool`, `ontoolchange`, origin exposure and abort signals. Draft report (26 Aug 2026), not W3C Standard: https://webmachinelearning.github.io/webmcp/. Chrome docs: https://developer.chrome.com/docs/ai/webmcp.

Canonical description links: AI evals https://developer.chrome.com/docs/ai/evals; Evals repository https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/webmcp-evals; Lighthouse https://github.com/GoogleChrome/lighthouse.

## Quantum transfer (1 + 3 + 9)

Proposed minimal tool: `preflight_quantum_call`, read-only and provider-free. Inputs: workflow, question, circuitHash, compilerVersion, backend, shots, evidenceIds. Outputs: decision (`execute|simulate|recompile|reuse|reject`), reasonCode, `providerCall:false`, evidenceRefs, experimentSignature, qualityChecks, nextAction, limitations. Runtime validation is mandatory.

Proof to test, not claim: baseline always-call vs gated fixture; provider endpoint interception proves zero calls for avoided cases; evidence pack proves reproducibility; quality criterion and false-skip rate are predeclared. Evals `smoke` can verify deterministic calls without an LLM; `browser` repeated runs test agent selection. Lighthouse can be adjunct structural evidence only and cannot establish no-call or decision quality.

Ten-concept mapping: 1 direct gate; 3 scientific fixture; 9 receipt layer; 4 reuse via evidence IDs/hashes; 5 simulate outcome; 6 comparability fields; 7 context-bound registration; 8 later policy extension; 10 out of scope for v1.

No secrets or old corpus modifications included.
