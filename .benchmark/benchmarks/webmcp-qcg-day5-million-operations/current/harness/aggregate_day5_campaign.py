#!/usr/bin/env python3
"""Aggregate completed Day 5 engine gates and the separate HTTP canary."""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PASS_GATES = ("e2b-warmup", "e2b-intermediate", "e2b-full", "e2b-repeat")


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def latest_pass(summaries: list[tuple[Path, dict[str, Any]]], gate: str) -> tuple[Path, dict[str, Any]]:
    matches = [(path, item) for path, item in summaries if item.get("gate") == gate and item.get("status") == "pass"]
    if not matches:
        raise RuntimeError(f"No passing campaign summary exists for {gate}.")
    return sorted(matches, key=lambda pair: pair[1].get("completed_at", ""))[-1]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    results = root / "results"

    all_summaries: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(results.glob("e2b-*/campaign-summary.json")):
        item = load(path)
        if item.get("schema_version") == "qcg-e2b-campaign-summary.v1":
            all_summaries.append((path, item))

    selected = [latest_pass(all_summaries, gate) for gate in PASS_GATES]
    failed_diagnostics = [
        {
            "run_id": item.get("run_id"),
            "gate": item.get("gate"),
            "status": item.get("status"),
            "stop_reasons": item.get("stop_reasons", []),
            "operations": item.get("operations", 0),
            "survivors": len(item.get("surviving_owned_sandboxes", [])),
        }
        for _, item in all_summaries
        if item.get("status") != "pass"
    ]

    canary_paths = sorted(results.glob("http-canary-*.json"))
    passing_canaries = [(path, load(path)) for path in canary_paths if load(path).get("status") == "pass"]
    if not passing_canaries:
        raise RuntimeError("No passing HTTP canary receipt exists.")
    canary_path, canary = passing_canaries[-1]

    full = next(item for _, item in selected if item["gate"] == "e2b-full")
    repeat = next(item for _, item in selected if item["gate"] == "e2b-repeat")
    invariant_failures: list[str] = []
    for _, item in selected:
        if item.get("stop_reasons"):
            invariant_failures.append(f"{item['gate']}:stop_reasons")
        if item.get("unauthorized_effects") != 0:
            invariant_failures.append(f"{item['gate']}:unauthorized_effects")
        if item.get("missing_receipts") != 0:
            invariant_failures.append(f"{item['gate']}:missing_receipts")
        if item.get("receipt_digest_mismatches") != 0:
            invariant_failures.append(f"{item['gate']}:receipt_digest_mismatches")
        if item.get("decision_mismatches") != 0:
            invariant_failures.append(f"{item['gate']}:decision_mismatches")
        if item.get("surviving_owned_sandboxes"):
            invariant_failures.append(f"{item['gate']}:sandbox_cleanup")
    if repeat.get("reproducibility", {}).get("mismatched_indices"):
        invariant_failures.append("e2b-repeat:reproducibility")
    if canary.get("stop_reasons") or canary.get("errors") or canary.get("timeouts"):
        invariant_failures.append("http-canary:delivery")

    selected_receipts = [
        {
            "path": str(path.relative_to(root)).replace("\\", "/"),
            "sha256": sha256(path),
            "run_id": item["run_id"],
            "gate": item["gate"],
            "sandboxes": item["sandboxes_completed"],
            "operations": item["operations"],
            "wall_seconds": item["wall_seconds"],
            "throughput_ops_per_second": item["aggregate_throughput_ops_per_second"],
            "p95_max_ms": item["latency_ms"]["p95_max"],
        }
        for path, item in selected
    ]
    selected_receipts.append(
        {
            "path": str(canary_path.relative_to(root)).replace("\\", "/"),
            "sha256": sha256(canary_path),
            "gate": "http-canary",
            "requests": canary["requests"],
            "p95_ms": canary["latency_ms"]["p95"],
        }
    )

    aggregate = {
        "schema_version": "qcg-day5-campaign-aggregate.v1",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "pass" if not invariant_failures else "fail",
        "benchmark_slug": "webmcp-qcg-day5-million-operations",
        "engine_campaign": {
            "passing_gates": list(PASS_GATES),
            "successful_sandboxes": sum(item["sandboxes_completed"] for _, item in selected),
            "validated_operations": sum(item["operations"] for _, item in selected),
            "full_pass_operations": full["operations"],
            "repeat_pass_operations": repeat["operations"],
            "repeat_digest_matches": 100 - len(repeat["reproducibility"]["mismatched_indices"]),
            "repeat_digest_total": repeat["reproducibility"]["prior_results"],
            "unauthorized_effects": sum(item["unauthorized_effects"] for _, item in selected),
            "missing_receipts": sum(item["missing_receipts"] for _, item in selected),
            "receipt_digest_mismatches": sum(item["receipt_digest_mismatches"] for _, item in selected),
            "decision_mismatches": sum(item["decision_mismatches"] for _, item in selected),
            "surviving_owned_sandboxes": sum(len(item["surviving_owned_sandboxes"]) for _, item in selected),
            "resource_profile_observed": {"cpu_count": 2, "memory_mb": 512, "node": "v20.9.0", "internet_access": False},
        },
        "http_canary": {
            "separate_from_engine": True,
            "requests": canary["requests"],
            "http_200": next((entry["count"] for entry in canary["status_counts"] if str(entry["status"]) == "200"), 0),
            "errors": canary["errors"],
            "timeouts": canary["timeouts"],
            "p95_ms": canary["latency_ms"]["p95"],
            "max_ms": canary["latency_ms"]["max"],
        },
        "failed_diagnostic_runs": failed_diagnostics,
        "invariant_failures": invariant_failures,
        "cost_usd": None,
        "cost_note": "No billing receipt was returned by the E2B SDK; no cost is inferred from account credits.",
        "provider_calls": 0,
        "qpu_calls": 0,
        "payment_calls": 0,
        "receipts": selected_receipts,
    }
    output = (args.output or (results / "day5-campaign-aggregate.json")).resolve()
    output.write_text(json.dumps(aggregate, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(aggregate, indent=2, ensure_ascii=False))
    return 0 if aggregate["status"] == "pass" else 2


if __name__ == "__main__":
    raise SystemExit(main())
