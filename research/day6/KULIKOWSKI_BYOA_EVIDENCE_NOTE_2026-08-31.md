# Day 6 evidence note — Bring Your Own Agent

Date: 2026-08-31  
Status: research only; no QCG code or public claim modified

## Sources

- https://www.kulikowski.me/blog/bring-your-own-agent
- https://www.kulikowski.me/blog/bring-your-own-agent.md
- https://www.kulikowski.me/blog/agents-talking-to-each-other
- https://github.com/Kulikowski/agents-talking-to-each-other
- https://www.kulikowski.me/blog/webmcp-skills-and-agentic-resource-discovery
- https://github.com/Kulikowski/webmcp-ard-exploration
- https://bandarra.me/apps/webmcp-text-editor/
- https://bandarra.me/posts/webmcp-tools-as-skills

## Mechanism actually demonstrated

The BYOA proposal separates the user's agent from a website-side harness that represents the site's capabilities, business context, policies, and approval rules.

The verified WebMCP sequence is:

1. The website exposes tools to the visitor.
2. The user's agent preserves the general objective.
3. The site may delegate a bounded part of the work to a local specialized agent.
4. Tools expose capabilities, skills describe a journey, and Agentic Resource Discovery points to additional resources.
5. Tool registration remains distinct from authentication, validation, permission, and authorization.

The `agents-talking-to-each-other` repository implements three separate paths:

- direct WebMCP tool calls by the extension agent;
- a page agent exposed as a WebMCP tool;
- an A2A flow using messages, an Agent Card, `contextId`, tasks, and the state progression `working → input-required → completed`.

Two A2A-shaped transports are present:

- a Node backend over HTTP/SSE with `/a2a`, `/.well-known/agent-card.json`, illustrative bearer identities, and task continuation after `input-required`;
- a local page path through `window.postMessage` with an A2A-shaped envelope.

The `postMessage` path is explicitly experimental: it has no independently addressable URL, insufficient caller authentication, tab-local scope, and page-lifetime persistence. The repository describes itself as an educational demonstration rather than a production service.

Forge Titan separately demonstrates static and state-dependent tools, skills loaded through `/.well-known/ai-catalog.json`, delegation to a provider MCP server, and a distinction between tools, journey instructions, and resource discovery. It is an experiment rather than a benchmark. Its `application/ai-skill` and `application/webmcp+json` media types are example-grade or speculative rather than standardized.

## Verified capabilities versus projections

Verified:

- WebMCP delegation to a page agent;
- backend A2A task lifecycle and continuation;
- experimental page/extension transport through `postMessage`;
- separate page and backend states;
- a skills catalog and dynamic tools;
- WebMCP tools used for progressive disclosure.

Editorial or future-facing projections:

- a complete harness with memory, sessions, business identity, policy, and compute placement;
- hub-and-spoke coordination across multiple site agents;
- eventual convergence around A2A;
- rich observability of sub-agents inside a WebMCP call;
- standardized skills or Agentic Resource Discovery catalogs.

These sources do not prove universal compatibility, production authentication, certified security, or native A2A support in QCG.

## Comparison with QCG

Shared principles:

- capability stays separate from authority;
- context is bounded;
- the interaction targets a specific page;
- a punctual tool call stays distinct from a longer journey;
- evidence and provenance remain visible.

QCG's intentionally narrower contract:

- four collaborative tools observe, propose, request review, and export;
- `mcp_direct` uses Chrome DevTools MCP and `pageIdRouting`;
- `native_gemini_manual` uses a sanitized, previewed, human-relayed handoff;
- the `HandoffCoordinator` is deterministic and model-free;
- decisions, memory, consent, and authorization remain human;
- QCG does not implement a site-side business agent, Agent Card, A2A HTTP/SSE service, persistent tasks, or `input-required` lifecycle;
- Q# and OpenQASM remain its two bounded local executable paths.

QCG therefore has a collaboration and relay architecture that is compatible with BYOA's lessons. Its current evidence does not support describing it as an A2A server, a site-side agent, or a native Gemini integration.

## Reusable after the Day 5 feature freeze

Documentation and editorial use:

- introduce the triad `tool = capability`, `skill = journey`, `discovery = resource`;
- document `registration is not permission` as a parallel to QCG consent;
- describe receipts through transport, actor, page, context, state, and authority holder;
- compare a punctual MCP call, a human relay, and a true A2A lifecycle;
- explain QCG's choice to avoid an autonomous business agent as an explicit safety boundary.

Backlog only:

- a page agent such as `ask_page_agent`;
- a QCG A2A server with Agent Card, tasks, and streaming;
- an operational skills or ARD catalog;
- cross-site sessions, authenticated identity, and hub-and-spoke coordination;
- real-time sub-agent observability;
- separate billing models for user and site agents.

## Day 6 editorial angles

1. A site can represent its rules while the user retains their own agent.
2. A tool describes what is possible; a skill describes how to traverse a journey.
3. A2A becomes relevant when a task has lifecycle, state, and continuation—not merely because two messages exist.
4. Technical capability, transport, and human authority remain separate contracts.
5. QCG's decision to avoid autonomous business-agent behavior is a safety decision rather than a missing feature.
