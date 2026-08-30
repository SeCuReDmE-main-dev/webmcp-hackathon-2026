# Benchmark validity gate

Status: **partial / prepared, not executed**

## Internal target

The target is the bounded QCG decision/evidence flow: profile selection, deterministic recommendation, receipt construction and collaboration-state handling. This is the work QCG owns locally and can measure without a provider or QPU. The repository records a Q# Worker proof, four quantum tools and four collaboration tools; these are product facts, not a claim of universal quantum execution.

## Fair comparisons

- The local baseline is fair for measuring the same deterministic engine on the same corpus, seed, policies and receipt format.
- E2B Professional profiles are fair for measuring sandbox orchestration and resource sensitivity when the same workload image, inputs and output contract are used. The supplied dashboard proves available account capacity, not a completed run.
- Q# and OpenQASM are comparable as the two planned executable local profiles only for bounded compilation/simulation behavior. Compiler facts and dialect are part of the receipt.
- Python, C++, and QIR profiles are fair only for static inspection coverage, digesting and bounded finding generation.

## Misleading comparisons

The benchmark would mislead if it called a static-inspection profile executable, treated an E2B account screenshot as measured throughput, mixed engine timings with HTTP/CDN latency, or compared a protocol fixture to a live Gemini exchange. It also must not infer QPU availability, provider correctness, cost savings or scientific validity for arbitrary circuits from a Bell fixture.

## Valid dimensions

Valid dimensions are operations per second, p50/p95/p99 engine latency, digest reproducibility, receipt completeness, error/effect counts, and resource-profile sensitivity. The cPanel canary is a separate delivery experiment with its own RPS, timeout and status gates.

## Acceptable claims

After a completed run, acceptable claims include: “the declared corpus produced reproducible receipts under the stated configuration” and “the engine measured X operations under profile Y.” Before a completed run, this workspace supports only “prepared” claims. Unacceptable claims include universal framework conformance, live native Gemini automation, QPU execution, or a production cost guarantee.
