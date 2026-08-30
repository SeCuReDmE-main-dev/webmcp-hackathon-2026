# Action 145 — stable public release and author guard

Date: 2026-08-30
Disposition: `NO_CHANGE_AUTHOR_GUARD`
Public URL: <https://qcg.securedme.ca/>

## Superseding author decision

Jean-Sébastien asked to keep the simple stable interface on the public site and on any future Vercel surface until he approves the graphics. The Day 5 Spring implementation therefore remains a local candidate. Replacing the stable site would violate the current visual-authority gate.

## Live verification

- HTTPS request: PASS, HTTP 200.
- Title: `WebMCP Quantum Call Gate`.
- HTML size: 552 bytes.
- HTML SHA-256: `980a2400012221f1312004ccabb0484015c60e288583256dbda75e0f5937c0f6`.
- Script: `/assets/index-Ylgm1FK1.js`.
- Stylesheet: `/assets/index-D-PfaGik.css`.
- `Permissions-Policy`: `tools=(self)`.
- `Origin-Agent-Cluster`: `?1`.
- HTTP canary: 80/80 HTTP 200, zero errors/timeouts, p95 30.825 ms.

The HTML digest and asset names match `evidence/release/qcg-release-manifest-2026-08-29.json`. The retained package is `webmcp-qcg-2026-08-29.zip`, SHA-256 `6d574985fbff4fe376395beae37f292889a5d187a9b81601eeb445d7e58c4d44`.

## Rollback and mutation receipt

- Public files changed: zero.
- cPanel mutation performed: zero.
- Existing stable release retained as its own rollback point.
- Spring deployment remains pending explicit visual approval.
- Devpost submission remains untouched.

This receipt closes the Day 5 hosting gate without misrepresenting a deployment that the author explicitly deferred.
