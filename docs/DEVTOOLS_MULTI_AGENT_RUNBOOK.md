# WebMCP-QCG — Chrome DevTools multi-agent runbook

Status: implementation runbook for Chrome 151  
Official CLI contract rechecked: 2026-08-29  
Purpose: let Codex, Gemini-oriented clients, Antigravity and the human author inspect one QCG page while keeping quantum authority inside QCG.

## Trust boundary

Chrome DevTools MCP can inspect and modify the connected browser page. Use a dedicated QCG tab containing no unrelated account, credential or personal data. The QCG collaboration tools expose allowlisted evidence references, schema-bounded text and declared agent identities. They do not provide authenticated identities or a security sandbox against a DevTools-capable client.

The built-in Gemini DevTools chat remains a user-facing Chrome feature. QCG uses Chrome DevTools MCP and its own ledger because Chrome currently documents no public API for a third-party page or extension to automate that conversation.

## Requirements

- Google Chrome 151 or newer;
- Node.js LTS or newer;
- QCG at `https://qcg.securedme.ca/` or `http://127.0.0.1:5173/`;
- WebMCP enabled in Chrome;
- remote debugging enabled at `chrome://inspect/#remote-debugging` when using `--auto-connect`;
- explicit user approval for every browser attachment.

Chrome DevTools MCP uses `pageIdRouting` by default. Every page-scoped call must carry the QCG page ID, which prevents one agent from silently acting on another tab.

## Shared server arguments

Use the same functional arguments for each MCP client:

```text
-y
chrome-devtools-mcp@latest
--auto-connect
--categoryExperimentalThirdParty=true
--categoryExperimentalWebmcp=true
--no-usage-statistics
```

`--categoryExperimentalThirdParty=true` exposes the QCG collaboration tools. `--categoryExperimentalWebmcp=true` exposes the four canonical QCG WebMCP tools. Chrome DevTools MCP also accepts the documented kebab-case aliases. The WebMCP category requires Chrome 150+ and the WebMCP feature enabled in the browser.

## Codex

CLI installation:

```powershell
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --auto-connect --categoryExperimentalThirdParty=true --categoryExperimentalWebmcp=true --no-usage-statistics
```

Windows TOML fallback:

```toml
[mcp_servers.chrome-devtools]
command = "cmd"
args = [
  "/c",
  "npx",
  "-y",
  "chrome-devtools-mcp@latest",
  "--auto-connect",
  "--categoryExperimentalThirdParty=true",
  "--categoryExperimentalWebmcp=true",
  "--no-usage-statistics"
]
env = { SystemRoot = "C:\\Windows", PROGRAMFILES = "C:\\Program Files" }
startup_timeout_ms = 20000
```

## Gemini CLI or Gemini Code Assist

Gemini CLI installation:

```powershell
gemini mcp add -s user chrome-devtools npx chrome-devtools-mcp@latest
```

Then use the shared JSON configuration when custom arguments are required:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--auto-connect",
        "--categoryExperimentalThirdParty=true",
        "--categoryExperimentalWebmcp=true",
        "--no-usage-statistics"
      ]
    }
  }
}
```

Gemini Code Assist accepts the same standard MCP server shape through its MCP configuration surface.

## Antigravity-owned browser

When Antigravity owns the browser, start its Chrome surface first and connect each authorized client to the same debugging URL:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222",
        "--categoryExperimentalThirdParty=true",
        "--categoryExperimentalWebmcp=true",
        "--no-usage-statistics"
      ]
    }
  }
}
```

Change port `9222` only when the Antigravity debugging endpoint reports a different port.

## One-page collaboration sequence

1. The human opens QCG and creates or selects one debug session.
2. Each client calls `list_pages` and records the same QCG `pageId`.
3. Each client supplies that `pageId` on every page-scoped command.
4. Codex calls `list_3p_developer_tools`, then `read_debug_context`.
5. Codex posts one bounded open `observation` with evidence references.
6. Gemini or Antigravity reads the same context and posts one distinct open `observation`; either agent may then create an open `decision_request` for human review.
7. The human opens F12 → **QCG**, reviews both entries and acknowledges the active request.
8. QCG exports a debug handoff. The quantum recommendation and human consent remain unchanged.

## Responsibility prompts

### Codex

```text
Target the supplied QCG pageId. Read the QCG debug context before acting. Own code mapping, contracts, regression risks and test evidence. Post one concise observation at a time with existing evidence IDs. Request human review for any change that affects authority, publication or execution. Never represent a debug message as quantum consent.
```

### Gemini or Antigravity

```text
Target the supplied QCG pageId. Read the current ledger and analyze browser-visible DOM, console, network, performance and styling evidence. Post one observation that adds a distinct browser diagnosis, then request human review when an explicit decision is needed. Preserve QCG's deterministic recommendation and leave every authority decision to the human interface.
```

### Human

```text
Compare the evidence behind each agent entry and acknowledge an active collaboration request in the QCG panel. Record a separate human observation when a challenge is needed. Use the main QCG Human Decision tab for accepted, deferred or overridden quantum recommendations. The debug panel records discussion; the main product records authority.
```

## Fallback

If experimental third-party discovery fails once, refresh the QCG page and call `list_3p_developer_tools` again. A persistent failure uses Chrome DevTools MCP `evaluate_script` to read the narrow `window.__QCG_DEVTOOLS_V1__.getCachedPanelSnapshot()` context, then invokes the page-defined `post_debug_observation` tool through the documented `window.__dtmcp.executeTool()` shim with the actual declared agent actor and active session ID. It never calls the panel-only `queueHumanMessage()` method. Record the fallback in the receipt. This path preserves provenance, the active-page session and the authority boundary.

## Evidence required for completion

- one shared page ID;
- one Codex observation;
- one Gemini or Antigravity response;
- one human acknowledgement from the QCG panel;
- unchanged quantum recommendation, consent state and controlled-effect counters;
- screenshot of the panel and exported debug handoff;
- Chrome version and MCP arguments used.

## Primary references

- Chrome DevTools MCP: <https://github.com/ChromeDevTools/chrome-devtools-mcp>
- Third-party developer tools: <https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md>
- DevTools panels API: <https://developer.chrome.com/docs/extensions/reference/api/devtools/panels>
- Gemini AI assistance in DevTools: <https://developer.chrome.com/docs/devtools/ai-assistance>
