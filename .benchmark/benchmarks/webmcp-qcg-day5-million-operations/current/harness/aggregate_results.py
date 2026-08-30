#!/usr/bin/env python3
"""Aggregate local result JSON files without launching any workload."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def load(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--results", type=Path, default=None)
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()
    root = args.root.resolve()
    results_dir = (args.results or (root / "results")).resolve()
    config = load(root / "config.json")
    plan_path = results_dir / "preparation-plan.json"
    plan = load(plan_path) if plan_path.is_file() else None
    expected_digest = plan.get("corpus_digest") if plan else None
    expected_seed = config["engine"]["seed"]
    files = sorted(path for path in results_dir.glob("*.json") if path.name not in {"preparation-plan.json", "aggregate.json"})
    accepted: list[dict] = []
    rejected: list[dict] = []
    for path in files:
        try:
            item = load(path)
            reasons = []
            if item.get("schema_version") != "qcg-benchmark-result.v1": reasons.append("schema_version")
            if item.get("benchmark_slug") != config["benchmark_slug"]: reasons.append("benchmark_slug")
            if expected_digest and item.get("corpus_digest") != expected_digest: reasons.append("corpus_digest")
            if item.get("seed") != expected_seed: reasons.append("seed")
            if item.get("unauthorized_effects", 0) != 0: reasons.append("unauthorized_effects")
            if reasons: rejected.append({"file": path.name, "reasons": reasons})
            else: accepted.append(item)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            rejected.append({"file": path.name, "reasons": [f"unreadable:{exc}"]})
    operations = sum(item.get("operations", 0) for item in accepted)
    elapsed = [item["elapsed_ms"] for item in accepted if isinstance(item.get("elapsed_ms"), (int, float))]
    statuses = {status: sum(1 for item in accepted if item.get("status") == status) for status in ("pass", "fail", "blocked", "skipped")}
    summary = {
        "schema_version": "qcg-benchmark-aggregate.v1",
        "benchmark_slug": config["benchmark_slug"],
        "status": "no_data" if not files else ("rejected" if not accepted else "aggregated"),
        "engine_only": True,
        "http_canary_included": False,
        "files_seen": len(files),
        "accepted_results": len(accepted),
        "rejected_results": rejected,
        "operations": operations,
        "target_operations": config["engine"]["total_operations"],
        "coverage_ratio": operations / config["engine"]["total_operations"] if config["engine"]["total_operations"] else 0,
        "status_counts": statuses,
        "elapsed_ms": {"min": min(elapsed) if elapsed else None, "max": max(elapsed) if elapsed else None},
        "digest_reproducibility": "unverified" if not accepted else "verify per-run receipt digests before publication",
        "cost_usd": None,
        "next_action": "Keep the campaign unlaunched until explicit authorization and staged gate results exist." if not accepted else "Review receipts and stop conditions before interpreting throughput.",
    }
    output = args.output or (results_dir / "aggregate.json")
    output.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
