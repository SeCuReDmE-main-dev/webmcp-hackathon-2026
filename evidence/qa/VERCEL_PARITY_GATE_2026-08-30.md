# Vercel parity gate — 2026-08-30

## Scope and decision

This receipt checks whether a durable Vercel deployment can serve the same
simple, stable QCG frontend as the canonical public release. It does not
change cPanel, DNS, Devpost, QCG product code, quantum logic, or A2A logic.

**Decision: BLOCKED — no Vercel deployment was created or changed.** The only
known Vercel URL is an expired temporary deployment, not a named project. The
current working-tree build is not byte-identical to the canonical release, so
deploying it would violate the parity requirement.

## Canonical release observed

| Check | Observed value |
| --- | --- |
| URL | `https://qcg.securedme.ca/` |
| HTTP | `200 OK` |
| title | `WebMCP Quantum Call Gate` |
| served `index.html` SHA-256 | `980a2400012221f1312004ccabb0484015c60e288583256dbda75e0f5937c0f6` |
| served entry JS | `/assets/index-Ylgm1FK1.js` |
| served entry CSS | `/assets/index-D-PfaGik.css` |
| release manifest | `evidence/release/qcg-release-manifest-2026-08-29.json` |
| release package SHA-256 | `6d574985fbff4fe376395beae37f292889a5d187a9b81601eeb445d7e58c4d44` |

The release manifest identifies this as the validated `prototype/webmcp-qcg/dist`
package created at `2026-08-29T13:33:00-04:00`. Its gates record build pass,
18/18 tests, 2/2 WebMCP smoke checks, accessibility 1.0, and zero QPU
submissions. The site responses include `Origin-Agent-Cluster: ?1` and
`Permissions-Policy: tools=(self)`.

## Vercel evidence and mismatch

The repository contains `prototype/webmcp-qcg/vercel.json`. It correctly
expresses the same two QCG security headers, but it cannot identify a Vercel
project by itself.

The sole Vercel URL retained in public evidence,
`https://temporary-express-coral-5r9ow5p.vercel.app/`, now responds:

```text
307 Temporary Redirect
Location: https://vercel.com/deployment-expired
```

Therefore it has no QCG title, application DOM, entry assets, or visible
interface to compare. It is not a viable public frontend and must not be used
as the Vercel target or rollback source.

The current local build completed successfully, but produced a different entry
set (`index-SmY9IX0e.js` and `index-D-RGuMk1.css`) from the canonical served
assets. Its 2026-08-30 working tree includes unrelated active Day 5 changes.
It is consequently not a safe parity deploy candidate. The canonical archive
named by the manifest is not present in this checkout, so an exact static
Vercel upload cannot be reconstructed from the local artifact alone.

The exact source commit for the 2026-08-29 release remains unproven: the
release manifest predates the first recorded frontend commits that are close to
it (`9dfb62572d3c761be8ae183dc77a7bd224168c87` and
`f3520f573e88d6f90e905c0b26bdf29db6fe74c0`). Hash parity, not a guessed Git
revision, is the release authority.

## Authenticated-linkage gate

Read-only local inspection found no installed Vercel CLI, no `VERCEL_*` or
`NOW_*` environment linkage, no `.vercel/project.json`, and no user-level
Vercel project configuration. The local anonymous deployment record is a
temporary claim artifact; it is deliberately not used as authorization or as
a project identity. No credential, claim URL, or token is included here.

The `qcg.securedme.ca` DNS/CNAME relationship resolves through the existing
SecuredMe hosting path and does not establish a Vercel project association.
Git remote identity also does not establish a Vercel project association.

## Required controlled next action

1. Link or authenticate the intended named Vercel project with root directory
   `prototype/webmcp-qcg`, and identify its production URL/domain.
2. Recover the exact release archive whose SHA-256 is
   `6d574985fbff4fe376395beae37f292889a5d187a9b81601eeb445d7e58c4d44`, or
   rebuild an artifact that proves the manifest's complete file-hash set.
3. Deploy that artifact only to the identified Vercel project; retain the
   prior deployment as rollback.
4. Verify `200`, title, rendered QCG interface, `index.html` hash, entry
   asset hashes, and the two security headers against the canonical release.

Until those gates are satisfied, the correct safe integration result is to
leave Vercel unchanged rather than publish the changing Day 5 frontend.
