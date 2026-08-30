# QCG canonical cPanel deployment receipt — 2026-08-30

## Decision and scope

Jean-Sébastien approved the current QCG Console and explicitly authorized its
promotion to the canonical address, [https://qcg.securedme.ca/](https://qcg.securedme.ca/).
This receipt closes the accepted **design and implementation deployment phase**.
It does not close the Day 5 article, publish the editorial package, submit
Devpost, authorize a provider call, or authorize a QPU action.

## Pre-deployment baseline

- Baseline captured: `2026-08-30T17:46:55-04:00` (America/Toronto)
- Stable origin: HTTP `200`
- Previous index SHA-256: `980A2400012221F1312004CCABB0484015C60E288583256DBDA75E0F5937C0F6`
- Previous assets: `/assets/index-Ylgm1FK1.js` and `/assets/index-D-PfaGik.css`
- Source branch: `redesign/qcg-console`
- Source/documentation HEAD: `a8faf02a7fbb5b518d6d71667edf87cebb008b7c`
- Accepted product commit: `17e9db2b9c26f41c4ee82395c09054a69627f1c6`

## Immutable package and operator transaction

- Package: `qcg-console-2026-08-30-a8faf02.zip`
- Package bytes: `2,285,184`
- Package entries: `14`
- Package SHA-256: `371A206716FCFCD71699285CCE51A8BB8AA7368B2615505397328DCC86E02269`
- Secret and author-local-path scan: **PASS**
- cPanel plan ID: `9b9525b7738d052dd825c12f`
- Destination: `<CPANEL_HOME>/public_html/qcg.securedme.ca`
- Retained rollback backup:
  `<CPANEL_HOME>/public_html/qcg.securedme.ca.backup-9b9525b7738d052dd825c12f`
- Apply result: **success**
- Rollback restoration during apply: **false**
- Verified expected paths: `14/14`
- Staging cleanup: **complete**

The deployment used the SecuredMe cPanel Operator's bound
`plan → confirmation → apply` flow. No credential value was printed, stored in
the package, or added to the repository.

## Public byte verification

The twelve content-bearing public files below returned HTTP `200` and matched
the local production build exactly by SHA-256:

| Path | SHA-256 |
|---|---|
| `/index.html` | `3D3A5FA503AA746AFCEBA24E7EB68D85BBF840BB2EEB660DB165EF39982D562E` |
| `/qcg-mark.svg` | `18EB92A24AAF10C606BD56069FE985ADE9544C9E3F6EFE58357FB37FE2D1DF73` |
| `/assets/index-Bs5AQAgN.js` | `0EFB1FF1B76EA70601523761AD72B033AF7BB6432DF64D47A91D3A363829BE4B` |
| `/assets/index-CJkXpO-i.css` | `54CA9948ACC0DF1DC22C4F5CBFA25BEBD2335FEE847435F1D491BA33AECCE197` |
| `/assets/qsc_wasm_bg-CCIGAYD7.wasm` | `5F01879BB9B00D2B75E28D14AF6B083A1BF8A92617FFAD933B0325E991D5F280` |
| `/assets/qsharp.worker-FTyVsPIM.js` | `75358C62AA149A83804C30070B99FCDFF763A4D551D314907661B76306B107B0` |
| `/fixtures/qcg-bell-sample.qasm` | `4FA14FE18813B8643EED4D545FB123BEB4933FB34FD993E17ADB16DD58487FC6` |
| `/fixtures/qcg-bell-sample.qs` | `602EC14B539C7AC01513B043EEDD01931894DC00B746F2C55ED22EF0305E17DF` |
| `/seasonal/autumn.svg` | `9F54311776C76BE81798A9FD21669331B6F8A32C81C676BB099C907FC9BF6644` |
| `/seasonal/spring.svg` | `864768B75677B7DF91D7F594C4C1D74080ED62EB3BC3EF864A5949DC56F92C0E` |
| `/seasonal/summer.svg` | `E4833EEE06816EACDF56089EB81A2C12C713C97DE8BFAB49DA67B0DAF9DDC204` |
| `/seasonal/winter.svg` | `7596DC0B813A96625A3EC324F56642DA97F7205A742C46BADC79FF5E2C4BF856` |

The WebAssembly asset is served as `application/wasm`. Directory listing at
`/assets/` is denied with HTTP `403`.

## Stable-origin headers

At `2026-08-30T17:48:53-04:00`, the stable origin returned HTTP `200` with:

- `Origin-Agent-Cluster: ?1`
- `Permissions-Policy: tools=(self)`
- the package Content Security Policy
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Cross-Origin-Resource-Policy: same-origin`

## Live browser smoke

The canonical site rendered the author-approved console with seven centre views,
Dark and Light themes, the Access preferences panel, ten explicit quantum
profiles and the persistent authority inspector.

A human-interface smoke used the published Q# Bell fixture and produced:

- artifact compiler state: `compiled`;
- target: `Q# 1.31 local WebAssembly simulator`;
- recommendation: `simulate_first`;
- reason code: `BOUNDED_LOCAL_EVIDENCE_REQUIRED`;
- inspections: `1`;
- evaluations: `1`;
- metadata validations: `1`;
- local simulations: `0`;
- QPU submissions: `0`;
- human decision: `pending`;
- authority state: `consent_required`.

The smoke deliberately stopped before any human decision. It therefore proves
inspection, compilation, evaluation, navigation and the authority boundary. It
does not claim a fresh native-agent invocation, extension session, Gemini relay,
local simulation, or external execution on this deployment.

## Verdict

**PASS — the accepted QCG Console is live at the canonical cPanel origin.**

The rollback backup is retained. Vercel remains a byte-parity validation surface.
The Day 5 article remains open for Jean-Sébastien's editorial construction and
final publication decisions.
