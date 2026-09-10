"""
Admin Review CLI — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Interactive terminal tool for human review of pending ingestion jobs.

Usage:
    python -m ingestion.admin_review                    # Interactive mode
    python -m ingestion.admin_review --list             # List pending jobs only
    python -m ingestion.admin_review --job <job_id>     # Review a specific job

MANDATORY: No topic record goes live without human approval through this tool.
"""

import argparse
import json
import logging
import sys
from typing import Any

logging.basicConfig(level=logging.WARNING, format="%(levelname)s: %(message)s")
logger = logging.getLogger("ingestion.admin_review")


def _color(text: str, code: str) -> str:
    """Apply ANSI color to terminal output."""
    return f"\033[{code}m{text}\033[0m"


def _green(t: str) -> str:  return _color(t, "32")
def _red(t: str) -> str:    return _color(t, "31")
def _yellow(t: str) -> str: return _color(t, "33")
def _cyan(t: str) -> str:   return _color(t, "36")
def _bold(t: str) -> str:   return _color(t, "1")


def _print_job_header(job: dict[str, Any], index: int, total: int) -> None:
    """Print a formatted header for a pending job."""
    print()
    print("═" * 72)
    print(
        _bold(f"  Job [{index}/{total}]")
        + f"  ID: {_cyan(job['id'][:16])}..."
        + f"  Topic: {_yellow(job.get('target_topic_slug', '?'))}"
        + f"  Score: {_format_score(job.get('quality_score'))}"
    )
    source = job.get("source_id") or "unknown"
    submitted = job.get("submitted_at", "?")[:19].replace("T", " ")
    print(f"  Source: {source}   Submitted: {submitted}")
    print("─" * 72)


def _format_score(score: float | None) -> str:
    """Format quality score with color."""
    if score is None:
        return _yellow("?")
    if score >= 0.80:
        return _green(f"{score:.2f}")
    elif score >= 0.60:
        return _yellow(f"{score:.2f}")
    else:
        return _red(f"{score:.2f}")


def _print_field(label: str, value: Any, max_chars: int = 300) -> None:
    """Print a labelled field value."""
    if value is None or value == "" or value == [] or value == {}:
        return
    if isinstance(value, list):
        value_str = ", ".join(str(v) for v in value[:8])
        if len(value) > 8:
            value_str += f" (+{len(value) - 8} more)"
    elif isinstance(value, dict):
        value_str = json.dumps(value, ensure_ascii=False)[:max_chars]
    else:
        value_str = str(value)

    if len(value_str) > max_chars:
        value_str = value_str[:max_chars] + "..."

    print(f"  {_bold(label + ':')} {value_str}")


def _print_candidate_fields(parsed_fields: dict[str, Any]) -> None:
    """Print all candidate fields for admin review."""
    review_fields = [
        ("topic_name",            "Topic Name"),
        ("category",              "Category"),
        ("subcategory",           "Subcategory"),
        ("difficulty_level",      "Difficulty"),
        ("short_definition",      "Short Definition"),
        ("beginner_explanation",  "Beginner Explanation"),
        ("detailed_explanation",  "Detailed Explanation"),
        ("mathematical_explanation", "Mathematical Explanation"),
        ("formula",               "Formula"),
        ("example",               "Worked Example"),
        ("circuit_example",       "Qiskit Circuit"),
        ("related_topics",        "Related Topics"),
        ("common_mistakes",       "Common Mistakes"),
        ("aliases",               "Aliases"),
        ("keywords",              "Keywords"),
        ("tags",                  "Tags"),
        ("source_name",           "Source"),
        ("source_url",            "Source URL"),
        ("verification_notes",    "Verification Notes"),
    ]
    for field_key, label in review_fields:
        value = parsed_fields.get(field_key)
        _print_field(label, value)


def _print_quality_report(quality_report: dict[str, Any] | None) -> None:
    """Print a condensed quality check summary."""
    if not quality_report:
        return
    print()
    print(_bold("  Quality Checks:"))
    for check in quality_report.get("checks", []):
        icon = _green("✓") if check["passed"] else _red("✗")
        name = check["name"]
        msg = check["message"][:80]
        blocking = " [BLOCKING]" if check.get("is_blocking") and not check["passed"] else ""
        print(f"    {icon}  {name}{_red(blocking)}")
        if not check["passed"]:
            print(f"       {_yellow(msg)}")


def _prompt_review(job_id: str) -> tuple[str, str | None, str | None]:
    """
    Prompt admin for approve / reject / skip decision.

    Returns:
        (action, admin_notes, rejection_reason)
        action is one of: 'approve', 'reject', 'skip'
    """
    print()
    print(_bold("  Decision: ") + "[approve / reject <reason> / skip]")
    try:
        raw = input("  > ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n  Aborted.")
        return ("skip", None, None)

    if not raw:
        return ("skip", None, None)

    parts = raw.split(" ", 1)
    action = parts[0].lower()

    if action == "approve":
        try:
            notes = input("  Admin notes (optional, Enter to skip): ").strip() or None
        except (KeyboardInterrupt, EOFError):
            notes = None
        return ("approve", notes, None)
    elif action == "reject":
        reason = parts[1].strip() if len(parts) > 1 else ""
        if not reason:
            try:
                reason = input("  Rejection reason: ").strip()
            except (KeyboardInterrupt, EOFError):
                reason = "No reason given"
        return ("reject", None, reason)
    elif action == "skip":
        return ("skip", None, None)
    else:
        print(_yellow(f"  Unknown action '{action}'. Type 'approve', 'reject <reason>', or 'skip'."))
        return _prompt_review(job_id)


def review_jobs(job_ids: list[str] | None = None) -> None:
    """
    Run interactive review session for pending jobs.

    Args:
        job_ids: If provided, review only these specific job IDs.
                 If None, review all pending_review jobs.
    """
    from ingestion.publisher import (
        list_pending_jobs,
        update_job_status,
        publish_approved_record,
    )

    pending = list_pending_jobs()
    if not pending:
        print(_green("✓ No pending jobs. All clear."))
        return

    if job_ids:
        pending = [j for j in pending if j["id"] in job_ids or j["id"].startswith(tuple(job_ids))]
        if not pending:
            print(_red("No matching pending jobs found for the given IDs."))
            return

    total = len(pending)
    approved_count = 0
    rejected_count = 0
    skipped_count = 0

    for idx, job in enumerate(pending, start=1):
        _print_job_header(job, idx, total)

        parsed = job.get("parsed_fields") or {}
        quality_report = job.get("quality_report")

        _print_candidate_fields(parsed)
        _print_quality_report(quality_report)

        action, admin_notes, rejection_reason = _prompt_review(job["id"])

        if action == "approve":
            print(f"  {_green('→ Publishing...')}")
            try:
                results = publish_approved_record(
                    record=parsed,
                    job_id=job["id"],
                    admin_notes=admin_notes,
                )
                slug = parsed.get("slug") or parsed.get("id", "?")
                print(f"  {_green('✓ Published')} '{slug}'")
                for dest, status in results.items():
                    icon = _green("✓") if status == "ok" else (_yellow("~") if status == "skipped" else _red("✗"))
                    print(f"    {icon}  {dest}: {status}")
                approved_count += 1
            except Exception as e:
                print(_red(f"  ✗ Publish failed: {e}"))

        elif action == "reject":
            update_job_status(
                job["id"],
                status="rejected",
                rejection_reason=rejection_reason,
            )
            print(f"  {_red('✗ Rejected')} — reason: {rejection_reason}")
            rejected_count += 1

        else:
            print(f"  {_yellow('→ Skipped')}")
            skipped_count += 1

    print()
    print("═" * 72)
    print(
        f"  Review complete: "
        + _green(f"{approved_count} approved")
        + f", "
        + _red(f"{rejected_count} rejected")
        + f", "
        + _yellow(f"{skipped_count} skipped")
        + f"  (of {total} pending)"
    )
    print("═" * 72)
    print()


def list_pending(verbose: bool = False) -> None:
    """Print a summary table of all pending jobs."""
    from ingestion.publisher import list_pending_jobs

    pending = list_pending_jobs()
    if not pending:
        print(_green("No pending jobs."))
        return

    print()
    print(_bold(f"  {'ID':<20}  {'Topic':<30}  {'Score':<6}  {'Source':<25}  Submitted"))
    print("  " + "─" * 90)
    for job in pending:
        job_id_short = job["id"][:16] + "..."
        topic = job.get("target_topic_slug", "?")[:28]
        score = job.get("quality_score")
        score_str = f"{score:.2f}" if score is not None else "?"
        source = (job.get("source_id") or "?")[:23]
        submitted = job.get("submitted_at", "?")[:19].replace("T", " ")
        print(f"  {job_id_short:<20}  {topic:<30}  {score_str:<6}  {source:<25}  {submitted}")
    print()
    print(f"  Total pending: {len(pending)}")
    print()


# ── CLI Entry Point ───────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        prog="python -m ingestion.admin_review",
        description="Admin review CLI for the Quantum Knowledge Ingestion Pipeline",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List pending jobs without entering review mode",
    )
    parser.add_argument(
        "--job", "-j",
        nargs="+",
        metavar="JOB_ID",
        help="Review specific job ID(s) only",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Verbose output",
    )
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.INFO)

    print()
    print(_bold("  Quantum Knowledge Ingestion Pipeline — Admin Review Tool"))
    print()

    if args.list:
        list_pending()
    else:
        review_jobs(job_ids=args.job)


if __name__ == "__main__":
    main()
