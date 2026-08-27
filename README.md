# WebMCP Hackathon 2026

Private decision and prototyping repository for a WebMCP hackathon project.

The repository preserves three candidate lanes without pretending they are equally active:

| Lane | Status | Current decision |
|---|---|---|
| Quantech Vid | `REJECTED_FOR_THIS_HACKATHON` | Preserved because it was a real candidate, but its video-production scope does not make WebMCP essential. |
| WebCCP | `DEFERRED_BENCH` | Context continuity remains useful above WebMCP, but the data-weight and ingestion-cost model is not mature enough for this hackathon. |
| WebMCP Quantum Connector | `ACTIVE_RESEARCH` | Evaluate ten bounded concepts. The provisional favorite combines concepts 1, 3 and 9. |

## Provisional direction

**Quantum Call Gate + Fermion-to-Qubit Compilation Clinic + Reproducible Quantum Evidence Pack**

The product would use WebMCP to inspect a quantum experiment before execution, determine the minimum evidence path, prevent an unnecessary simulator/QPU/API call, demonstrate a scientifically grounded `qiskit-fermions` compilation case, and export a reproducibility report.

This is a hypothesis, not a selected build. Research and small deterministic probes must decide whether it is feasible and valuable.

## Repository map

- `docs/PROJECT_CHARTER.md` — scope and non-goals.
- `docs/IDEA_PORTFOLIO.md` — three candidate lanes and their status.
- `docs/decisions/` — dated decisions and reversibility conditions.
- `docs/ideas/` — one dossier per candidate.
- `research/webmcp/` — preserved WebMCP/CCP reconnaissance and source registry.
- `research/quantum/` — current four-surface quantum research.
- `evidence/SOURCE_MANIFEST.md` — provenance and hashes for imported research.
- `experiments/` — future falsifiable probes.
- `prototype/` — future selected implementation only.

## Governance

- Private repository; no public claims or submissions are implied.
- WebMCP upstream remains external and read-only.
- No QPU, paid API or provider job is launched without a separate explicit authorization.
- An AI agent may orchestrate and explain; deterministic quantum libraries own calculations and validation.
- A rejected idea remains documented so the decision can be audited or revisited.
- No secret, account credential, Origin Trial token or private email belongs in this repository.

