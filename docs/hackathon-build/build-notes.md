# Build notes — 2026-08-28

## Confirmed

- The current Chrome documentation uses `document.modelContext.registerTool`.
- Tool registration accepts a lifecycle `signal`.
- The application registers two tools initially, three after evaluation and four only during the consent window.
- The native in-app-browser trace completed four WebMCP calls plus one human consent event.
- The Q# Worker completed 64/64 shots and preserved the Bell-pair correlation invariant.
- Provider, paid and QPU calls remained zero.

## Environment-specific result

The connected external Chrome instance loaded the app and its human fallback. Its page scope exposed no `document.modelContext`, so the native Chrome trace remains pending the experimental flag and restart. This is recorded as a deployment/test environment condition rather than a product success.

## Hosting

The production bundle is ready. Cloudflare Wrangler first reported an unauthenticated account, then its anonymous Workers Assets path rejected the 6,066,574-byte Q# WebAssembly file at a 5,242,880-byte per-file limit. This is a concrete hosting constraint rather than a code failure.

An anonymous Vercel preview accepted the bundle. After adding `vercel.json`, its HTTP response included `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)`. The public preview passed the complete native WebMCP path and a second 64/64 Bell simulation with zero provider calls. The preview expires after one hour and therefore remains evidence rather than a Devpost live URL.
