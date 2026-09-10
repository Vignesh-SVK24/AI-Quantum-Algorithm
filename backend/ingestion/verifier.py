"""
Verifier Module — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Performs automated quality and notation-compliance checks on candidate
quantum topic records before they are staged for admin review.

Scientific Accuracy Rule (hard requirement):
  Never state misleading simplifications such as 'a qubit is 0 and 1 at the
  same time'. All superposition/state information must be expressed via
  normalized quantum-state notation: |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1.
"""

import re
import logging
from typing import Any
from dataclasses import dataclass, field
from ingestion.config import (
    FORBIDDEN_SIMPLIFICATIONS,
    MIN_SHORT_DEFINITION_LEN,
    MAX_SHORT_DEFINITION_LEN,
    MIN_DETAILED_EXPLANATION_LEN,
    QUALITY_THRESHOLD,
    VALID_CATEGORIES,
    DIFFICULTY_LEVELS,
)

logger = logging.getLogger("ingestion.verifier")


# ── Result Types ──────────────────────────────────────────────────────────

@dataclass
class CheckResult:
    """Result of a single automated check."""
    name: str
    passed: bool
    score_contribution: float  # 0.0–1.0 weight of this check in total score
    message: str
    is_blocking: bool = False  # If True, auto-reject regardless of total score


@dataclass
class VerificationReport:
    """Full verification report for a candidate quantum topic record."""
    topic_slug: str
    checks: list[CheckResult] = field(default_factory=list)
    quality_score: float = 0.0
    passed: bool = False
    blocking_failures: list[str] = field(default_factory=list)
    summary: str = ""

    def to_dict(self) -> dict[str, Any]:
        return {
            "topic_slug": self.topic_slug,
            "quality_score": round(self.quality_score, 4),
            "passed": self.passed,
            "blocking_failures": self.blocking_failures,
            "summary": self.summary,
            "checks": [
                {
                    "name": c.name,
                    "passed": c.passed,
                    "score_contribution": c.score_contribution,
                    "message": c.message,
                    "is_blocking": c.is_blocking,
                }
                for c in self.checks
            ],
        }


# ── Individual Check Functions ────────────────────────────────────────────

def _check_forbidden_simplifications(candidate: dict[str, Any]) -> CheckResult:
    """
    BLOCKING: No misleading quantum simplifications allowed.
    Checks all text fields for forbidden phrases.
    """
    text_fields = [
        candidate.get("short_definition", ""),
        candidate.get("beginner_explanation", ""),
        candidate.get("detailed_explanation", ""),
        candidate.get("mathematical_explanation", "") or "",
        candidate.get("example", "") or "",
    ]
    combined = " ".join(text_fields).lower()

    found = [phrase for phrase in FORBIDDEN_SIMPLIFICATIONS if phrase in combined]
    if found:
        return CheckResult(
            name="notation_compliance",
            passed=False,
            score_contribution=0.0,
            message=(
                f"BLOCKING: Found {len(found)} forbidden simplification(s): "
                + ", ".join(f'"{p}"' for p in found)
            ),
            is_blocking=True,
        )
    return CheckResult(
        name="notation_compliance",
        passed=True,
        score_contribution=1.0,
        message="No forbidden simplifications found in any text field.",
    )


def _check_required_fields(candidate: dict[str, Any]) -> CheckResult:
    """
    BLOCKING: Ensures all mandatory fields are present and non-empty.
    """
    required = [
        "id", "topic_name", "slug", "category",
        "short_definition", "beginner_explanation", "detailed_explanation",
    ]
    missing = [f for f in required if not candidate.get(f, "").strip()]
    if missing:
        return CheckResult(
            name="required_fields",
            passed=False,
            score_contribution=0.0,
            message=f"BLOCKING: Missing or empty required fields: {missing}",
            is_blocking=True,
        )
    return CheckResult(
        name="required_fields",
        passed=True,
        score_contribution=1.0,
        message="All required fields are present and non-empty.",
    )


def _check_short_definition_length(candidate: dict[str, Any]) -> CheckResult:
    """short_definition must be within the allowed character range."""
    text = candidate.get("short_definition", "")
    length = len(text.strip())
    if length < MIN_SHORT_DEFINITION_LEN:
        return CheckResult(
            name="short_definition_length",
            passed=False,
            score_contribution=0.0,
            message=(
                f"short_definition too short: {length} chars "
                f"(minimum {MIN_SHORT_DEFINITION_LEN})"
            ),
        )
    if length > MAX_SHORT_DEFINITION_LEN:
        return CheckResult(
            name="short_definition_length",
            passed=False,
            score_contribution=0.3,
            message=(
                f"short_definition too long: {length} chars "
                f"(maximum {MAX_SHORT_DEFINITION_LEN}); consider trimming"
            ),
        )
    return CheckResult(
        name="short_definition_length",
        passed=True,
        score_contribution=1.0,
        message=f"short_definition length OK ({length} chars).",
    )


def _check_detailed_explanation_depth(candidate: dict[str, Any]) -> CheckResult:
    """detailed_explanation must be substantive (≥ MIN_DETAILED_EXPLANATION_LEN chars)."""
    text = candidate.get("detailed_explanation", "")
    length = len(text.strip())
    if length < MIN_DETAILED_EXPLANATION_LEN:
        return CheckResult(
            name="detailed_explanation_depth",
            passed=False,
            score_contribution=0.0,
            message=(
                f"detailed_explanation too short: {length} chars "
                f"(minimum {MIN_DETAILED_EXPLANATION_LEN})"
            ),
        )
    return CheckResult(
        name="detailed_explanation_depth",
        passed=True,
        score_contribution=1.0,
        message=f"detailed_explanation depth OK ({length} chars).",
    )


def _check_category_valid(candidate: dict[str, Any]) -> CheckResult:
    """category must be one of the approved values."""
    category = candidate.get("category", "")
    if category not in VALID_CATEGORIES:
        return CheckResult(
            name="category_valid",
            passed=False,
            score_contribution=0.3,
            message=(
                f"Unknown category: '{category}'. "
                f"Valid: {list(VALID_CATEGORIES)}"
            ),
        )
    return CheckResult(
        name="category_valid",
        passed=True,
        score_contribution=1.0,
        message=f"Category '{category}' is valid.",
    )


def _check_has_formula_if_needed(candidate: dict[str, Any]) -> CheckResult:
    """
    Topics in Foundations, Quantum Gates, or Algorithms should have a formula.
    Non-blocking — reduces quality score if absent.
    """
    category = candidate.get("category", "")
    formula = candidate.get("formula", "") or ""
    formula_required_categories = {"Foundations", "Quantum Gates", "Algorithms"}
    if category in formula_required_categories and not formula.strip():
        return CheckResult(
            name="formula_present",
            passed=False,
            score_contribution=0.0,
            message=(
                f"Category '{category}' should include a mathematical formula "
                f"but 'formula' field is empty."
            ),
        )
    return CheckResult(
        name="formula_present",
        passed=True,
        score_contribution=1.0,
        message="Formula check passed.",
    )


def _check_superposition_notation(candidate: dict[str, Any]) -> CheckResult:
    """
    If any text mentions 'superposition', it should contain ket notation
    (|ψ⟩ or |0⟩ or |1⟩ form) in at least one field.
    """
    all_text = " ".join([
        candidate.get("short_definition", ""),
        candidate.get("beginner_explanation", ""),
        candidate.get("detailed_explanation", ""),
        candidate.get("mathematical_explanation", "") or "",
        candidate.get("formula", "") or "",
    ])

    mentions_superposition = "superposition" in all_text.lower()
    has_ket_notation = bool(re.search(r"\|[ψ01\+\-]\⟩", all_text))

    if mentions_superposition and not has_ket_notation:
        return CheckResult(
            name="superposition_notation",
            passed=False,
            score_contribution=0.2,
            message=(
                "Record mentions 'superposition' but lacks ket notation "
                "(|ψ⟩, |0⟩, |1⟩). Include |ψ⟩ = α|0⟩ + β|1⟩ form."
            ),
        )
    return CheckResult(
        name="superposition_notation",
        passed=True,
        score_contribution=1.0,
        message="Superposition notation check passed.",
    )


def _check_normalization_condition(candidate: dict[str, Any]) -> CheckResult:
    """
    If amplitudes α and β are mentioned, the normalization |α|² + |β|² = 1
    must also appear in some form.
    """
    all_text = " ".join([
        candidate.get("short_definition", ""),
        candidate.get("detailed_explanation", ""),
        candidate.get("mathematical_explanation", "") or "",
        candidate.get("formula", "") or "",
    ])

    mentions_amplitudes = bool(re.search(r"\bα\b|\bbeta\b|\bβ\b|\bamplitude", all_text.lower()))
    has_normalization = bool(re.search(
        r"\|α\|²\s*\+\s*\|β\|²\s*=\s*1"
        r"|\|alpha\|.*\+.*\|beta\|.*=\s*1"
        r"|normali[sz]ation",
        all_text,
        re.IGNORECASE,
    ))

    if mentions_amplitudes and not has_normalization:
        return CheckResult(
            name="normalization_condition",
            passed=False,
            score_contribution=0.4,
            message=(
                "Amplitudes α/β are mentioned but normalization condition "
                "|α|² + |β|² = 1 is absent."
            ),
        )
    return CheckResult(
        name="normalization_condition",
        passed=True,
        score_contribution=1.0,
        message="Normalization condition check passed.",
    )


def _check_has_source(candidate: dict[str, Any]) -> CheckResult:
    """Every record should cite at least one source."""
    source_name = candidate.get("source_name", "") or ""
    source_url = candidate.get("source_url", "") or ""
    additional = candidate.get("additional_sources", []) or []

    if not source_name.strip() and not source_url.strip() and not additional:
        return CheckResult(
            name="source_attribution",
            passed=False,
            score_contribution=0.0,
            message="No source cited. At least source_name or source_url is required.",
        )
    return CheckResult(
        name="source_attribution",
        passed=True,
        score_contribution=1.0,
        message="Source attribution present.",
    )


def _check_arrays_are_lists(candidate: dict[str, Any]) -> CheckResult:
    """
    related_topics, common_mistakes, aliases, keywords, tags must be lists.
    """
    array_fields = ["related_topics", "common_mistakes", "aliases", "keywords", "tags"]
    bad = [f for f in array_fields if not isinstance(candidate.get(f), list)]
    if bad:
        return CheckResult(
            name="array_field_types",
            passed=False,
            score_contribution=0.3,
            message=f"These fields must be lists (not strings): {bad}",
        )
    return CheckResult(
        name="array_field_types",
        passed=True,
        score_contribution=1.0,
        message="All array fields are properly typed as lists.",
    )


def _check_difficulty_level(candidate: dict[str, Any]) -> CheckResult:
    """difficulty_level must be one of the allowed values if present."""
    level = candidate.get("difficulty_level")
    if level and level not in DIFFICULTY_LEVELS:
        return CheckResult(
            name="difficulty_level",
            passed=False,
            score_contribution=0.5,
            message=(
                f"Invalid difficulty_level: '{level}'. "
                f"Must be one of: {list(DIFFICULTY_LEVELS)}"
            ),
        )
    return CheckResult(
        name="difficulty_level",
        passed=True,
        score_contribution=1.0,
        message="difficulty_level is valid or not set.",
    )


# ── Check Weights ─────────────────────────────────────────────────────────

# (check_function, weight_in_final_score)
# Weights sum to 1.0. Blocking checks bypass the weight system.
CHECKS_WITH_WEIGHTS: list[tuple] = [
    (_check_forbidden_simplifications,    0.20),  # BLOCKING
    (_check_required_fields,              0.20),  # BLOCKING
    (_check_short_definition_length,      0.08),
    (_check_detailed_explanation_depth,   0.12),
    (_check_category_valid,               0.06),
    (_check_has_formula_if_needed,        0.08),
    (_check_superposition_notation,       0.08),
    (_check_normalization_condition,      0.06),
    (_check_has_source,                   0.08),
    (_check_arrays_are_lists,             0.04),
    (_check_difficulty_level,             0.00),  # zero-weight, informational
]


# ── Main Verification Entry Point ─────────────────────────────────────────

def verify_candidate(candidate: dict[str, Any]) -> VerificationReport:
    """
    Run all automated checks against a candidate quantum topic record.

    Returns a VerificationReport with:
      - quality_score (0.0–1.0)
      - passed (True if score ≥ QUALITY_THRESHOLD and no blocking failures)
      - blocking_failures (list of check names that auto-reject the record)
      - checks (full detail on every individual check)

    Example:
        report = verify_candidate(my_candidate_dict)
        if report.passed:
            stage_for_admin_review(my_candidate_dict, report)
        else:
            print(report.summary)
    """
    slug = candidate.get("slug") or candidate.get("id") or "unknown"
    report = VerificationReport(topic_slug=slug)

    total_weight = 0.0
    weighted_score = 0.0

    for check_fn, weight in CHECKS_WITH_WEIGHTS:
        result = check_fn(candidate)
        # Override the stored score_contribution with the actual weight
        result.score_contribution = weight
        report.checks.append(result)

        if result.is_blocking and not result.passed:
            report.blocking_failures.append(result.name)
            # Blocking failures short-circuit the score — record auto-rejected
            continue

        if weight > 0:
            total_weight += weight
            if result.passed:
                weighted_score += weight
            else:
                # Partial credit for non-blocking failures
                partial = getattr(result, "_partial_credit", 0.0)
                weighted_score += weight * partial

    if total_weight > 0:
        report.quality_score = round(weighted_score / total_weight, 4)
    else:
        report.quality_score = 0.0

    blocking = len(report.blocking_failures) > 0
    report.passed = (not blocking) and (report.quality_score >= QUALITY_THRESHOLD)

    if blocking:
        report.summary = (
            f"AUTO-REJECTED: {len(report.blocking_failures)} blocking failure(s): "
            + ", ".join(report.blocking_failures)
        )
    elif not report.passed:
        report.summary = (
            f"FAILED: quality_score={report.quality_score:.2f} "
            f"(threshold={QUALITY_THRESHOLD:.2f})"
        )
    else:
        report.summary = (
            f"PASSED: quality_score={report.quality_score:.2f} "
            f"(threshold={QUALITY_THRESHOLD:.2f})"
        )

    logger.info(f"[verify] {slug}: {report.summary}")
    return report
