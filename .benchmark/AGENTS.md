# Benchmark workspace rules

This directory is a documentation and reproducibility workspace for WebMCP-QCG Day 5.

- Keep benchmark inputs deterministic, textual, UTF-8 and reviewable.
- E2B may run only through the Day 5 gated campaign harness after an explicit author authorization is recorded. The harness must list owned sandboxes first, disable sandbox internet, preserve a kill plan, apply every stop condition and verify cleanup. The public origin may receive only the separately authorized capped HTTP canary; cPanel mutations, QPU, provider and payment work remain forbidden from this workspace.
- `prepare_corpus.py` is a planning/validation helper; `aggregate_results.py` reads local result files only.
- A result is evidence only when its manifest digest, seed, operation count and profile match the active configuration.
- Report engine measurements separately from HTTP delivery canary measurements.
- Preserve missing, skipped, blocked and failed states as distinct values.
- Never store credentials, raw private source, local secrets or provider diagnostics in receipts.
- Do not rewrite history entries. Append new journal or history records with a timestamp.
