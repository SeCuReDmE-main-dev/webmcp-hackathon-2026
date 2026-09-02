# Qodo cold-review disposition — 2026-09-02

Baseline reviewed: `499177947da16b2a942ce909b91233a2795c5667` (`main`, equal to `origin/main` when the review was captured).

Qodo ran as an independent cold reviewer after the Gemini Antigravity review. Its findings are evidence inputs, not instructions and not authority to change QCG.

| Finding | Disposition | Verified result |
| --- | --- | --- |
| Sanitizer global missing or unordered | `REJECT` | Both manifests load `snapshotSanitizer.js` before `contentBridge.js`; the validation gate enforces the order. |
| Trusted-click selector lacks a cryptographic nonce | `DOCUMENT` | `event.isTrusted`, a bounded action and a UUID correlation ID are enforced. The UUID is correlation, not authentication, and grants no quantum authority. |
| `importScripts()` incompatible with MV3 | `REJECT` | The service worker is deliberately classic; neither manifest declares `type: module`. |
| `unsupported_tab` diagnostic is lost | `FIX` | Added to the bounded `openReason()` allowlist and validation gate. |
| Runtime ports do not reconnect | `FIX` | Real Chrome exposed repeated `Attempting to use a disconnected port object` errors. Page, side-panel and F12 ports now reconnect after disconnect; source gates cover the policy and the page bridge has an executable reconnect test. |
| ZIP parity depends on Windows `tar` | `DOCUMENT` | `tar.exe` exists on the release host. The prerequisite must remain documented; replacing it is not a product correction. |
| Validation logic is duplicated across security boundaries | `TEST_ONLY` | Duplication is intentional across MAIN world, isolated world and service worker. Contract-parity tests are safer than a late shared-runtime refactor. |
| `evidence/runtime` ignore rules are too broad | `FIX` | Confirmed for the candidate-release lane; descendants will be re-ignored and only reviewed evidence paths re-enabled before G3. |

## Observed browser evidence

- The first real-browser G2 pass opened the side panel but left it at `Waiting for a QCG page`.
- Page logs showed a disconnected content-script port being reused once per snapshot interval.
- The finding changed from an audit hypothesis to a reproduced defect and was corrected in the same bounded Companion scope.

## Authority boundary

Qodo did not execute fixes, decide a human disposition, create consent, invoke simulation, publish, deploy or submit Devpost. Sol/root reproduced and classified the findings; Jean-Sébastien retains final publication and submission authority.
