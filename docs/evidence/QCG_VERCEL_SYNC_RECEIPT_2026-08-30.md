# QCG Vercel synchronization receipt — 2026-08-30

## Decision and scope

Jean-Sébastien accepted the current QCG Console baseline and authorized Vercel
synchronization. This receipt covers the Vercel production surface only. It does
not record a cPanel promotion, Devpost submission, provider call or QPU action.

## Source and deployment

- Accepted source commit: `17e9db2b9c26f41c4ee82395c09054a69627f1c6`
- Source branch: `redesign/qcg-console`
- GitHub `main`: fast-forwarded to the accepted commit
- GitHub production deployment ID: `6171585797`
- Vercel deployment state: `success`
- Vercel production deployment: `https://webmcp-5znk6npof-ffed.vercel.app`
- Stable Vercel validation address: `https://webmcp-qcg.vercel.app/`
- Canonical retained product address: `https://qcg.securedme.ca/`
- cPanel mutation in this operation: **none**

The branch preview was created successfully but remained behind Vercel's preview
authentication. It was not promoted as a public or canonical URL. The stable
production domain returned the application publicly without that preview login.

## Live HTTP verification

The stable Vercel address returned:

- HTTP `200`;
- title `WebMCP Quantum Call Gate`;
- `Origin-Agent-Cluster: ?1`;
- `Permissions-Policy: tools=(self)`;
- content type `text/html; charset=utf-8`;
- the QCG mark plus the expected hashed JavaScript and CSS assets.

An authenticated Chrome check rendered the accepted console with all seven
views, the Access control, Dark/Light themes, ten quantum profiles and the
human-authority inspector. This verifies presentation availability, not native
WebMCP or extension functionality on the remote origin.

## Byte-for-byte parity

| Path | Bytes | Remote/local SHA-256 | Match |
|---|---:|---|---|
| `/index.html` | 552 | `3D3A5FA503AA746AFCEBA24E7EB68D85BBF840BB2EEB660DB165EF39982D562E` | exact |
| `/assets/index-Bs5AQAgN.js` | 371,029 | `0EFB1FF1B76EA70601523761AD72B033AF7BB6432DF64D47A91D3A363829BE4B` | exact |
| `/assets/index-CJkXpO-i.css` | 14,115 | `54CA9948ACC0DF1DC22C4F5CBFA25BEBD2335FEE847435F1D491BA33AECCE197` | exact |

## Verdict

**PASS — Vercel synchronized with the author-accepted build.**

`qcg.securedme.ca` remains the canonical retained release and was not changed.
Tomorrow's graphic and user-experience refinements begin from this accepted,
reproducible baseline.
