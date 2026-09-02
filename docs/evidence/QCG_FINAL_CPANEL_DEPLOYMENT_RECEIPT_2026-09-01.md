# QCG final cPanel deployment receipt

Date: 2026-09-01 22:39 America/Toronto  
Public application: https://qcg.securedme.ca/  
Status: PASS

## Release input

- Source baseline before final hardening commit: `16565d66eeb981f94d43a90f20a61764da4cc805`.
- Immutable deployment archive: `evidence/releases/qcg-console-2026-09-01-final.zip`.
- Archive size: 2,285,746 bytes.
- Archive SHA-256: `15C5599F6EB34742E276D6667CF33BE60C3FD72D8B35715E6AB6040AD3F9833A`.
- cPanel plan: `f9261b8c8c844579bd32315a`.
- The operator retained a pre-deployment backup under the cPanel account and
  removed its staging directory after verification.

The deployment used the SecuredMe Settings and cPanel operator flow. No
credential, token, private path or environment value is recorded here.

## Apply result

- The isolated QCG document root received ten package entries: eight public
  files plus `.htaccess` and `_headers` policy files.
- Every uploaded path passed the operator's post-transfer verification.
- The mutation completed without rollback restoration.
- The public root returned HTTP `200` after deployment.
- Direct directory listing at `/assets/` returned HTTP `403`.
- The QDK WebAssembly asset returned `application/wasm`.

## Public byte-for-byte verification

An independent post-deployment request used `Accept-Encoding: identity` and
compared every public response body with the local production build. All eight
files returned HTTP `200` and matched their local SHA-256:

| Public path | SHA-256 |
|---|---|
| `index.html` | `657980E3A663BD6903C1532FA61672B8117C175A51935A9A990118413D14A776` |
| `qcg-mark.svg` | `18EB92A24AAF10C606BD56069FE985ADE9544C9E3F6EFE58357FB37FE2D1DF73` |
| `assets/index-CJ0G-OIr.js` | `967D119FF486933883A287F6BE1538CA4F476480CB3FE9239941161062B44BFB` |
| `assets/index-JzPod-Ov.css` | `7C79EB759F1E4D31CF7FE2889F9655363B80DD241AFABD021996357E22A6FC43` |
| `assets/qsc_wasm_bg-CCIGAYD7.wasm` | `5F01879BB9B00D2B75E28D14AF6B083A1BF8A92617FFAD933B0325E991D5F280` |
| `assets/qsharp.worker-FTyVsPIM.js` | `75358C62AA149A83804C30070B99FCDFF763A4D551D314907661B76306B107B0` |
| `fixtures/qcg-bell-sample.qasm` | `4FA14FE18813B8643EED4D545FB123BEB4933FB34FD993E17ADB16DD58487FC6` |
| `fixtures/qcg-bell-sample.qs` | `602EC14B539C7AC01513B043EEDD01931894DC00B746F2C55ED22EF0305E17DF` |

## Response-policy verification

The public root returned every required value:

- `Origin-Agent-Cluster: ?1`
- `Permissions-Policy: tools=(self)`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Cross-Origin-Resource-Policy: same-origin`

The deployed `.htaccess` also defines the content-security policy, SPA fallback,
WASM MIME mapping and directory-listing restriction used by this release.

## Claim boundary

This receipt proves that the canonical cPanel site serves the same eight public
files as the validated local build and applies the expected transport headers.
It does not replace the separate Chrome runtime receipts for Q#/OpenQASM or the
remaining manual reload proof for Companion `0.2.4` in F12 and the side panel.
