# ADR — Final QCG release scope and authority

- Date: 2026-09-02 (America/Toronto)
- Status: accepted for execution
- Supersedes: the release-gating interpretation of `DAY7_TWO_BLOCK_CLOSEOUT_2026-09-02.md`
- Preserves: all historical evidence and completed action receipts

## Decision

WebMCP-QCG is released and judged as a standalone browser-native, human-in-the-loop quantum preflight workbench. Its public contract remains exactly four quantum tools and four collaboration tools. Q# and OpenQASM Bell programs may run only through the bounded local QDK Worker after a visible human decision and a private, single-use page consent. Static profiles remain inspection-only. Provider calls, QPU submission, payment, credentials and remote quantum execution remain absent.

FNP-QNN and `fnpqnn_gateway_MVP` are separate, adjacent reuse proofs. They may be implemented after the standalone QCG release candidate passes, but they are not a Devpost success criterion, do not enter the principal video path, and must not be described as complete until their own tests and browser proof pass. QCG and Q-Bit remain distinct.

The final release may correct defects, improve accessibility, stabilize lifecycle behavior, refresh documentation, package artifacts, deploy identical builds and produce evidence. It may not add another quantum engine, provider, public tool, authority path, direct Gemini API, OpenClaw dependency or unreviewed feature.

## Authority

Jean-Sébastien retains final authority over public compatibility claims, visual acceptance, Zenodo publication, video publication and Devpost submission. Agents may prepare and validate these surfaces but cannot submit the entry or reinterpret a recommendation as authorization.

## Release invariants

1. A recommendation never grants authority.
2. Consent remains page-private, recommendation-bound, expiring and single-use.
3. Extension, F12 and collaboration tools cannot simulate or create consent.
4. Raw source, secrets, local paths, network bodies and internal stacks do not cross the Companion boundary.
5. QPU submissions remain structurally zero.
6. The evidence schema remains `webmcp-qcg.evidence-receipt.v3`.
7. cPanel remains canonical; Vercel must serve the same accepted candidate before release.
8. Devpost remains a draft until the author gate.

## Consequences

The feature set is closed. New ideas enter a post-hackathon backlog. The final execution register is Actions 175–245, with the author-only Devpost release at Action 245.
