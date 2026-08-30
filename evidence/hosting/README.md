# WebMCP-QCG hosting baseline

## Result

The read-only baseline confirms that `qcg.securedme.ca` now exists in cPanel and resolves publicly. Its exact cPanel-relative document root is `public_html/qcg.securedme.ca`. The absolute account path is intentionally redacted in this repository.

The domain presents a valid TLS 1.3 certificate for `qcg.securedme.ca` and `www.qcg.securedme.ca`. Its current origin response is an HTTP `301` redirect to `https://securedme.ca/`. The origin body and the followed destination body were hashed without storing either body.

## Operator path

- Settings source: `<SETTINGS_WORKSPACE>/.env`
- Python runtime: `<SETTINGS_WORKSPACE>/.venv`
- Settings validation: valid, zero errors
- cPanel transport: brokered cPanel UAPI
- SSH: unused
- Mutation during this baseline: none

## Current destination and rollback anchor

- Current document root: `public_html/qcg.securedme.ca`
- Current directory inventory: `cgi-bin/` only
- Rollback document root: `public_html/qcg.securedme.ca`
- Proposed isolated staging base: `public_html/qcg.securedme.ca/releases`
- Proposed release destination: `public_html/qcg.securedme.ca/releases/<artifact-sha256-prefix>`

The creation workflow is no longer applicable because the subdomain already exists. Deployment planning and application remain gated until a deployable artifact has a stable hash and the cPanel plugin exposes a tested UAPI-only release-directory preparation contract. Uploading directly into the live document root would remove the clean rollback boundary.

Machine-readable evidence: [`qcg-securedme-ca-baseline-2026-08-29.json`](./qcg-securedme-ca-baseline-2026-08-29.json)
