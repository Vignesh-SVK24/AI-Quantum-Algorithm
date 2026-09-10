"""
Ingestion Pipeline Orchestrator — Quantum Knowledge Ingestion System
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

CLI entry point for running the full Stage 1 ingestion pipeline:
  1. Load candidate JSON files from backend/ingestion/data/candidates/
  2. Structure each candidate (structurer.structure_candidate)
  3. Verify each structured record (verifier.verify_candidate)
  4. Stage passing records as pending jobs in Supabase (publisher.create_job)
  5. Print a summary report

Admin must then run:
  python -m ingestion.admin_review
to review, approve, and publish staged jobs.

Usage:
    # Stage all candidates in the candidates/ directory
    python -m ingestion.run_ingestion

    # Dry run: verify but do not create Supabase jobs
    python -m ingestion.run_ingestion --dry-run

    # Target a specific candidate file
    python -m ingestion.run_ingestion --file data/candidates/shors_algorithm.json

    # Filter by topic slug
    python -m ingestion.run_ingestion --topic shors-algorithm

    # Sync source registry to Supabase knowledge_sources table
    python -m ingestion.run_ingestion --sync-sources
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Any

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ingestion.run_ingestion")


# ── Color helpers ─────────────────────────────────────────────────────────

def _green(t: str) -> str:  return f"\033[32m{t}\033[0m"
def _red(t: str) -> str:    return f"\033[31m{t}\033[0m"
def _yellow(t: str) -> str: return f"\033[33m{t}\033[0m"
def _bold(t: str) -> str:   return f"\033[1m{t}\033[0m"
def _cyan(t: str) -> str:   return f"\033[36m{t}\033[0m"


# ── Source sync ───────────────────────────────────────────────────────────

def sync_sources_to_supabase() -> None:
    """Upsert the sources.json registry into Supabase knowledge_sources."""
    from ingestion.config import SOURCES_JSON_PATH

    if not SOURCES_JSON_PATH.exists():
        print(_red(f"sources.json not found at {SOURCES_JSON_PATH}"))
        sys.exit(1)

    with open(SOURCES_JSON_PATH, "r", encoding="utf-8") as f:
        sources = json.load(f)

    print(f"\n  Syncing {len(sources)} source(s) to Supabase knowledge_sources...\n")

    try:
        from ingestion.publisher import _get_supabase_client
        sb = _get_supabase_client()
        for source in sources:
            result = (
                sb.table("knowledge_sources")
                .upsert(source, on_conflict="id")
                .execute()
            )
            icon = _green("✓") if result.data else _red("✗")
            print(f"  {icon}  {source['id']}")
        print(_green("\n  Source sync complete.\n"))
    except Exception as e:
        print(_red(f"\n  Source sync failed: {e}\n"))
        sys.exit(1)


# ── Pipeline ──────────────────────────────────────────────────────────────

class PipelineResult:
    """Tracks outcomes for a single candidate through the pipeline."""
    def __init__(self, filepath: Path, raw: dict[str, Any]):
        self.filepath = filepath
        self.raw = raw
        self.structured: dict[str, Any] | None = None
        self.quality_score: float | None = None
        self.passed_verification = False
        self.job_id: str | None = None
        self.error: str | None = None
        self.stage = "loaded"


def run_pipeline(
    candidates: list[tuple[Path, dict[str, Any]]],
    dry_run: bool = False,
    topic_filter: str | None = None,
) -> list[PipelineResult]:
    """
    Run the full ingestion pipeline on a list of (filepath, raw_candidate) tuples.

    Args:
        candidates: List from fetcher.load_all_candidates() or similar.
        dry_run: If True, verify but do not create Supabase jobs.
        topic_filter: If set, only process candidates whose slug matches.

    Returns:
        List of PipelineResult objects (one per candidate).
    """
    from ingestion.structurer import structure_candidate
    from ingestion.verifier import verify_candidate
    from ingestion.publisher import create_job

    results = []

    for filepath, raw in candidates:
        result = PipelineResult(filepath, raw)
        slug_guess = (
            raw.get("slug")
            or raw.get("id")
            or raw.get("topic_name", "?").lower().replace(" ", "-")
        )

        # Filter
        if topic_filter and topic_filter not in slug_guess:
            continue

        print(f"\n  {_bold('▶')} {filepath.name}  ({slug_guess})")

        # Step 1: Structure
        try:
            source_id = raw.get("source_id") or "manual-curation"
            structured = structure_candidate(raw, source_id=source_id)
            result.structured = structured
            result.stage = "structured"
        except Exception as e:
            result.error = f"Structurer error: {e}"
            result.stage = "failed"
            print(_red(f"    ✗ Structurer failed: {e}"))
            results.append(result)
            continue

        # Step 2: Verify
        try:
            report = verify_candidate(structured)
            result.quality_score = report.quality_score
            result.passed_verification = report.passed
            result.stage = "verified"

            score_str = f"{report.quality_score:.2f}"
            if report.passed:
                print(_green(f"    ✓ Verification PASSED  (score={score_str})"))
            else:
                print(_red(f"    ✗ Verification FAILED  (score={score_str})"))
                for fail in report.blocking_failures:
                    print(_red(f"        [BLOCKING] {fail}"))
                for check in report.checks:
                    if not check.passed:
                        print(_yellow(f"        - {check.name}: {check.message[:80]}"))

            if not report.passed:
                results.append(result)
                continue

        except Exception as e:
            result.error = f"Verifier error: {e}"
            result.stage = "failed"
            print(_red(f"    ✗ Verifier failed: {e}"))
            results.append(result)
            continue

        # Step 3: Stage (create Supabase job)
        if dry_run:
            print(_yellow("    ~ Dry run: skipping Supabase job creation"))
            result.stage = "dry_run"
            results.append(result)
            continue

        try:
            job_id = create_job(
                structured=structured,
                quality_score=report.quality_score,
                quality_report=report.to_dict(),
                source_id=source_id,
            )
            result.job_id = job_id
            result.stage = "staged"
            print(_green(f"    ✓ Staged job {job_id[:16]}... → pending_review"))
        except Exception as e:
            result.error = f"Staging error: {e}"
            result.stage = "failed"
            print(_red(f"    ✗ Staging failed: {e}"))

        results.append(result)

    return results


def print_summary(results: list[PipelineResult], dry_run: bool) -> None:
    """Print a final summary table."""
    staged = [r for r in results if r.stage == "staged"]
    dry = [r for r in results if r.stage == "dry_run"]
    failed_verify = [r for r in results if r.passed_verification is False and r.stage == "verified"]
    failed_err = [r for r in results if r.stage == "failed"]

    print("\n" + "═" * 72)
    print(_bold("  Pipeline Summary"))
    print("─" * 72)
    print(f"  Total candidates processed:  {len(results)}")
    if dry_run:
        print(f"  Passed verification:  {_green(str(len(dry)))}  (dry run — not staged)")
    else:
        print(f"  Staged for review:    {_green(str(len(staged)))}")
    print(f"  Failed verification:  {_red(str(len(failed_verify)))}")
    print(f"  Errors:               {_red(str(len(failed_err)))}")

    if staged:
        print(f"\n  {_bold('Staged jobs')} (run `python -m ingestion.admin_review` to review):")
        for r in staged:
            slug = r.structured.get("slug") if r.structured else "?"
            print(f"    • {slug}  [job: {(r.job_id or '')[:16]}...]")

    if failed_verify:
        print(f"\n  {_bold('Failed verification')}:")
        for r in failed_verify:
            slug = r.structured.get("slug") if r.structured else "?"
            print(f"    ✗ {slug}  (score={r.quality_score:.2f})")

    print("═" * 72 + "\n")


# ── CLI Entry Point ───────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        prog="python -m ingestion.run_ingestion",
        description="Quantum Knowledge Ingestion Pipeline — Stage 1 orchestrator",
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Verify candidates but do not create Supabase staging jobs",
    )
    parser.add_argument(
        "--file", "-f",
        metavar="FILEPATH",
        help="Process a specific candidate JSON file instead of all files in candidates/",
    )
    parser.add_argument(
        "--topic", "-t",
        metavar="SLUG",
        help="Only process candidates whose slug contains this substring",
    )
    parser.add_argument(
        "--sync-sources",
        action="store_true",
        help="Sync sources.json registry to Supabase knowledge_sources and exit",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose logging",
    )
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    print()
    print(_bold("  Quantum Knowledge Ingestion Pipeline — Stage 1"))
    if args.dry_run:
        print(_yellow("  Mode: DRY RUN (no Supabase writes)"))
    print()

    if args.sync_sources:
        sync_sources_to_supabase()
        return

    # Load candidates
    from ingestion.fetcher import load_all_candidates, load_candidate_file
    from ingestion.config import CANDIDATES_DIR

    if args.file:
        filepath = Path(args.file).expanduser().resolve()
        try:
            raw_candidates = [(filepath, c) for c in load_candidate_file(filepath)]
        except Exception as e:
            print(_red(f"  Failed to load file {filepath}: {e}"))
            sys.exit(1)
    else:
        raw_candidates = load_all_candidates(CANDIDATES_DIR)

    if not raw_candidates:
        print(_yellow("  No candidate files found."))
        print(f"  Place .json candidate files in: {CANDIDATES_DIR}")
        print()
        return

    print(f"  Loaded {len(raw_candidates)} candidate record(s)\n")

    # Run pipeline
    results = run_pipeline(raw_candidates, dry_run=args.dry_run, topic_filter=args.topic)
    print_summary(results, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
