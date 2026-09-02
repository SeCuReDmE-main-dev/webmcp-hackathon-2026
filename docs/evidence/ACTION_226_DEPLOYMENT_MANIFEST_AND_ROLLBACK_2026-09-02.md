# Action 226 — deployment manifest and rollback receipt

Status: `PASS — SUPERSEDED BY VERIFIED R2 PACKAGE`

Date: 2026-09-02 (America/Toronto)

## Ground

The deployable input is the `G3_PASS` build recorded in
`ACTIONS_220_225_G3_RELEASE_CANDIDATE_2026-09-02.md`. cPanel remains the
canonical origin. Vercel is a synchronized secondary surface. This action does
not deploy either host.

## Execute

- Packaged the exact validated `dist/` directory as
  `evidence/releases/qcg-console-2026-09-02-v0.1.0-hackathon-docroot.zip`.
- Generated
  `evidence/releases/qcg-console-2026-09-02-v0.1.0-hackathon-deployment-manifest.json`
  with one entry, byte count and SHA-256 for every published file.
- Retained the preceding immutable cPanel package as the rollback input.

## Validate

- New deployment archive: 4,048,155 bytes; 24 files.
- New archive SHA-256:
  `7A287DA766BAF63B0D76807A7913A8D6375719BCFE996CCBC660CA9C4B030447`.
- Deployment-manifest SHA-256:
  `C471CA9E6F6E406C2A474F9FA5D23FD3109579DCD8B592F68FD464BC1BE30F39`.
- Prior rollback archive:
  `evidence/releases/qcg-console-2026-09-01-final-0.2.4-docroot.zip`.
- Prior rollback SHA-256:
  `F8D90102B088B544692A6F90BDC79779165A05A37F72E6FCB38103530A734CF8`.
- Both Companion variants appear twice in the new package only by intentional
  public alias; each alias has the same validated bytes.

## Rollback procedure

1. Stop promotion if commit, archive or manifest hashes differ.
2. Use the cPanel Operator `plan → confirmation → apply` transaction against
   `public_html/qcg.securedme.ca`; do not upload files manually over the live
   document root.
3. Preserve the operator-created pre-deployment backup and the apply receipt.
4. After promotion, compare all 24 public bodies with the manifest using
   identity encoding and verify required headers, WASM MIME, SPA routing and
   directory-listing denial.
5. If any blocking check fails, restore the operator backup. If that recovery
   path is unavailable, plan and apply the retained prior immutable archive
   whose hash is recorded above.
6. For Vercel, keep the previous successful deployment address until byte
   parity passes. On failure, promote that prior deployment from the Vercel
   deployment history rather than rebuilding from an unverified tree.
7. Re-run the public hash and browser checks after rollback and record the new
   public state; never infer recovery from an operator success message alone.

## Output

The immutable deployment archive, machine-readable manifest and rollback input
are ready for Actions 227–232.

## Receipt

`ACTION_226_PASS` — every file intended for publication has a content hash and
source boundary, and both hosting surfaces have a bounded recovery path.

## R2 supersession after browser decode gate

The first package and manifest passed byte-hash comparison but a later Chrome
decode gate found that eight PNG blobs had previously been normalized as text
inside Git. The local design originals were valid; the indexed and deployed
blobs were not. This discovery does not erase the first receipt: it documents
why byte identity alone was insufficient. The release was stopped, the Git
index was repaired with raw binary blobs, and the complete clean-copy, archive,
host-parity and Chrome-decode gates were repeated.

The authoritative package for release is now:

- archive:
  `evidence/releases/qcg-console-2026-09-02-v0.1.0-hackathon-r2-docroot.zip`;
- archive bytes: `4,014,684`;
- archive SHA-256:
  `C4FE4BB205F58B52ECDC30D73855ADF16E29A62EF578A275103632E3D47C4D50`;
- manifest:
  `evidence/releases/qcg-console-2026-09-02-v0.1.0-hackathon-r2-deployment-manifest.json`;
- manifest SHA-256:
  `10A7AAAFBB4EEC52F4479E3280BA2359FD915CCB989C50DFEDF92E393B12CA59`;
- runtime candidate: `938da498312edab8dd41c12f4b9558865993c833`;
- entries: `24`;
- archive extraction/hash validation: `24/24 PASS`;
- PNG decode validation after extraction: `8/8 PASS`.

The original archive remains preserved as incident evidence and is not the
release input. The R2 archive and manifest supersede it for every downstream
deployment, tag and publication claim.
