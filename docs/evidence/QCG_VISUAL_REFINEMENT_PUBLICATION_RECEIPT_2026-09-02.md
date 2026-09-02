# QCG visual refinement publication receipt — 2026-09-02

## Candidate

- Git commit: `acbb3540399fc5b2126e8afab45b82db345c9900`
- Branch: `main`
- GitHub remote parity: local `HEAD` equals `origin/main`
- Canonical build assets: `index-CE5gJ-nr.js` and `index-Doav2hq7.css`
- Immutable cPanel package SHA-256:
  `E188D4786C772D6CB276D044D27A6405D36FC73606A934425AC679FA7CB59D37`

## Validation

- Application suite: `94/94 PASS` before the bounded CSS-only final adjustment.
- Final visual/unit slice: `19/19 PASS`.
- TypeScript and Vite production build: `PASS`.
- Companion gates: Light contrast, trusted-click open/close, package parity,
  snapshot lifecycle and MV3 validation all `PASS`.
- Production dependency audit: `0 vulnerabilities`.
- Real Chrome console on the local candidate and canonical public site:
  `0 errors`, `0 warnings`.

## Publication

- GitHub `main`: pushed at `acbb3540399fc5b2126e8afab45b82db345c9900`.
- Vercel status for that commit: `success`.
- cPanel transaction: `7c22553da724fa8d4f5cd6ec`.
- cPanel result: `25/25` expected paths verified, staging cleaned, rollback
  not required, no secret value exposed.
- Retained rollback backup:
  `/home/<cpanel-account>/public_html/qcg.securedme.ca.backup-7c22553da724fa8d4f5cd6ec`.

The first relative-destination planning attempt failed safely before mutation.
An intermediate package was then found to contain a pre-final CSS build. It was
not used as release evidence. The source was rebuilt from the published
commit and the corrected immutable package above was deployed atomically.

## Public parity

The 23 content-bearing files in the final `dist` tree were downloaded from both
public surfaces and hashed independently:

- `https://qcg.securedme.ca/`: `23/23 MATCH`.
- `https://webmcp-qcg.vercel.app/`: `23/23 MATCH`.

The comparison excludes `.htaccess` and `_headers` because they are deployment
policy inputs rather than public content. The canonical Chrome reload exposed
all five workflow steps, the compact runtime mark and the final ambient image
with the expected high-contrast Dark opacity of `0.18`.

This receipt covers the post-submission visual refinement only. It does not
alter the quantum engine, the eight WebMCP tools, human authority, consent or
the evidence receipt v3 contract.
