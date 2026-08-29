# Public link check receipt

Date: 2026-08-29
Scope: current repository Markdown plus every public URL introduced or modified in the working change set

## Local cross-references

- Markdown files inspected: `73`
- Relative links resolved: `26`
- Broken relative links: `0`
- One historical out-of-repository source pointer was converted from a broken relative hyperlink into an explicit workspace provenance note.

## Public URLs

- Public URLs checked: `55`
- Reachable with HTTP 2xx/3xx: `51`
- Server-restricted but present: `4`
- Failed or unresolved: `0`

The four restricted responses were Devpost project/resources pages, Q-CTRL documentation and the Infleqtion announcement. Their servers returned `403` or `429` to the automated request. They remain attributed references and are classified as restricted rather than broken.

## Stable QCG origin

- `https://qcg.securedme.ca/`: HTTP `200`
- Official live WebMCP smoke evaluation: `2/2` passing
- Eight browser-addressable release files match the local production build byte for byte.
- `.htaccess` correctly returns HTTP `403` to a public request and was separately verified by the cPanel deployment operator before promotion.
- The Q# WebAssembly asset is served as `application/wasm`.

## Result

`PASS` — no unresolved public URL or broken local cross-reference remains in the checked scope.
