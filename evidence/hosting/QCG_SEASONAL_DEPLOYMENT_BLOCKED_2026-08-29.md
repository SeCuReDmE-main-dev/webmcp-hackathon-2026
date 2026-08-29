# QCG seasonal deployment — blocked before mutation

Date: 2026-08-29

- Package SHA-256: `9161EFEFD2636ECFB336FB2AF7B0F01181333DA1BC34613314974E6440A6BF87`
- Destination requested: `public_html/qcg.securedme.ca`
- cPanel health: success; brokered settings path; no secret values exposed.
- Deploy plan: `CPANEL_READ_FAILED`.
- Mutation: false.
- Apply: not attempted because no valid confirmation was returned.
- SSH: not used.
- Live origin: remains on the previously accepted QCG release.

Recovery gate: rerun the same operator `plan` with the rebuilt package and 13
expected paths after cPanel read access is restored. Apply only the exact
confirmation returned by that successful plan, then repeat live HTTPS, header,
WASM MIME, seasonal, WebMCP and rollback checks.
