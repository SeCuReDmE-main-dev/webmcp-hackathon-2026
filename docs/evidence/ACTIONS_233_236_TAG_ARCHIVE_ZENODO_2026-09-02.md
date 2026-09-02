# Actions 233–236 — tag, archive and Zenodo transport receipt

Date: 2026-09-02

Overall status: `PARTIAL — ZENODO TRANSPORT BLOCKED`

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

## Action 235 — reserved software DOI

- Existing deposition: `22240306`.
- Reserved DOI: `10.5281/zenodo.22240306`.
- Remote title, publication date `2026-09-02`, version
  `v0.1.0-hackathon`, MIT license and reserved DOI were verified.
- Remote state after the incident: unsubmitted, zero files.
- No second deposition or DOI was created.

Transport sequence:

1. the standard preparation command did not complete the 74.5 MB transfer;
2. read-only validation correctly rejected the empty remote file set;
3. the next API probe returned HTTP `504 Gateway Time-out`;
4. the bounded retry reached the file bucket, then the TLS stream closed before
   the object was created;
5. a different native transport was rejected by the Web edge with HTTP `403`
   before upload.

The anti-loop gate stopped further retries. No secret value was printed, no
remote file was left partial, and the deposition remains safely unpublished.

- Result: `FAILED` due to external Zenodo transport availability.
- Recovery: retry the same archive only after the service is responsive, then
  compare remote size/checksum and all metadata before publishing.

## Action 236 — citation and badge

- `CITATION.cff` names the reserved DOI, version, author, ORCID, repository,
  license and release date.
- The README exposes the single software DOI badge in the approved position.
- The README still labels publication as pending because the record is not yet
  public.
- Result: `RUNNING`; final resolution requires Action 235.

## Receipt

Actions 233 and 234 are complete. Actions 235 and 236 are not presented as
complete. Devpost remains unsubmitted, and no video, provider call, QPU call or
spending action occurred during this sequence.
