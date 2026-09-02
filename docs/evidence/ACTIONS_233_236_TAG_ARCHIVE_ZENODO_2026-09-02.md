# Actions 233–236 — tag, archive and Zenodo publication receipt

Date: 2026-09-02

Overall status: `PASS`

## Action 233 — public release tag

- Tag: `v0.1.0-hackathon`.
- Type: annotated Git tag.
- Target commit:
  `6b669fe204b2d5f04257d8b274bc91629c183ab0`.
- Remote verification: `refs/tags/v0.1.0-hackathon^{}` resolves to the same
  commit on `origin`.
- Result: `DONE`.

## Action 234 — tagged source archive

The source archive was produced with `git archive` from the public tag, not
from an uncommitted working tree.

- File: `webmcp-qcg-v0.1.0-hackathon.zip`.
- Prefix: `webmcp-qcg-v0.1.0-hackathon/`.
- Bytes: `74,508,273`.
- Archive entries: `817`, with zero prefix failures.
- SHA-256:
  `7B7198BD0FAE128ADD66725FC238DE7009E2072AFFB72066F72DBC9810663D00`.
- Suspicious filenames: zero.
- Unexpected high-confidence secret signatures: zero.
- Expected synthetic secret-shaped fixture: one, inside
  `snapshotLifecycle.test.mjs`, where it verifies redaction.
- Result: `DONE`.

The local archive resides in the established Zenodo publication workspace and
is not copied into the Git repository.

## Action 235 — published software DOI

- Existing deposition: `22240306`.
- Published DOI: `10.5281/zenodo.22240306`.
- Public record: `https://zenodo.org/record/22240306`.
- Remote title, version `v0.1.0-hackathon`, MIT license and DOI were verified.
- Remote state after recovery: published with the canonical source archive.
- No second deposition or DOI was created.

Recovery sequence:

1. the standard preparation command did not complete the 74.5 MB transfer;
2. read-only validation correctly rejected the empty remote file set;
3. the next API probe returned HTTP `504 Gateway Time-out`;
4. the bounded retry reached the file bucket, then the TLS stream closed before
   the object was created;
5. a different native transport was rejected by the Web edge with HTTP `403`
   before upload;
6. the later idempotent preparation state contained
   `webmcp-qcg-v0.1.0-hackathon.zip` with the expected size and SHA-256;
7. validation passed and the existing deposition was published.

No secret value was printed and no replacement deposition was created.

- Result: `DONE`.

## Action 236 — citation and badge

- `CITATION.cff` names the published DOI, version, author, ORCID, repository,
  license and release date.
- The README exposes the single software DOI badge in the approved position.
- The README labels the DOI as published and links only the software DOI badge
  in the opening block.
- Result: `DONE`.

## Receipt

Actions 233–236 are complete. The published software DOI is
`10.5281/zenodo.22240306`. No provider call, QPU call or spending action
occurred during this sequence.
