"""
Structurer Module — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Maps raw candidate dictionaries (from JSON feed or parser) to the exact
schema of the quantum_topics table, applying defaults, type coercion,
and field normalization.

Input:  a dict from a candidate JSON file or parsed web content
Output: a fully-structured dict ready for verify → stage → publish
"""

import re
import logging
from typing import Any
from datetime import datetime, timezone

from ingestion.config import VALID_CATEGORIES, DIFFICULTY_LEVELS

logger = logging.getLogger("ingestion.structurer")


# ── Allowed final schema fields ───────────────────────────────────────────

QUANTUM_TOPICS_FIELDS = (
    # Core identity
    "id", "topic_name", "slug", "category", "subcategory",
    # Explanations
    "short_definition", "beginner_explanation", "detailed_explanation",
    "mathematical_explanation",
    # Mathematical content
    "formula", "example", "circuit_example",
    # Relations
    "related_topics", "common_mistakes", "aliases", "keywords", "tags",
    # Sources
    "source_name", "source_url", "additional_sources",
    # Status & ingestion tracking
    "verification_status", "status", "knowledge_version",
    "last_verified_at", "verification_notes", "ingestion_source_id",
    "difficulty_level",
)


def _slugify(text: str) -> str:
    """Convert a topic name to a URL-safe slug."""
    slug = text.lower().strip()
    slug = re.sub(r"[''`]", "", slug)
    slug = re.sub(r"[^a-z0-9\s\-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def _ensure_list(value: Any) -> list:
    """Ensure a value is always a list, converting from string if needed."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if item]
    if isinstance(value, str):
        # Accept comma-separated strings as a fallback
        if "," in value:
            return [item.strip() for item in value.split(",") if item.strip()]
        return [value.strip()] if value.strip() else []
    return [str(value)]


def _normalize_category(raw_category: str) -> str:
    """Attempt to map a raw category string to a known valid category."""
    if not raw_category:
        return "Foundations"

    raw_lower = raw_category.lower().strip()
    mapping = {
        "foundation": "Foundations",
        "foundations": "Foundations",
        "basics": "Foundations",
        "basic": "Foundations",
        "fundamental": "Foundations",
        "fundamentals": "Foundations",
        "gate": "Quantum Gates",
        "gates": "Quantum Gates",
        "quantum gate": "Quantum Gates",
        "quantum gates": "Quantum Gates",
        "algorithm": "Algorithms",
        "algorithms": "Algorithms",
        "quantum algorithm": "Algorithms",
        "phenomena": "Quantum Phenomena",
        "quantum phenomena": "Quantum Phenomena",
        "technique": "Techniques",
        "techniques": "Techniques",
        "visualization": "Visualization",
        "visualisation": "Visualization",
        "error correction": "Error Correction",
        "quantum error correction": "Error Correction",
        "qec": "Error Correction",
        "hardware": "Hardware",
        "cryptography": "Cryptography",
        "quantum cryptography": "Cryptography",
    }
    if raw_lower in mapping:
        return mapping[raw_lower]

    # Direct match (case-insensitive)
    for valid in VALID_CATEGORIES:
        if valid.lower() == raw_lower:
            return valid

    logger.warning(f"[structurer] Unknown category '{raw_category}' — defaulting to 'Foundations'")
    return "Foundations"


def _normalize_difficulty(raw: str | None) -> str | None:
    """Normalize difficulty_level to one of the allowed values."""
    if not raw:
        return None
    raw_lower = raw.lower().strip()
    mapping = {
        "beginner": "beginner",
        "intro": "beginner",
        "introductory": "beginner",
        "easy": "beginner",
        "basic": "beginner",
        "intermediate": "intermediate",
        "medium": "intermediate",
        "mid": "intermediate",
        "advanced": "advanced",
        "expert": "advanced",
        "hard": "advanced",
    }
    return mapping.get(raw_lower)


def structure_candidate(
    raw: dict[str, Any],
    source_id: str = "manual-curation",
) -> dict[str, Any]:
    """
    Map a raw candidate dict to the quantum_topics schema.

    Required raw fields: topic_name (or id), short_definition,
    beginner_explanation, detailed_explanation.

    Optional raw fields: all others — defaults are applied where possible.

    Args:
        raw: Input dict (from JSON file or parser output).
        source_id: The knowledge_sources.id that this candidate came from.

    Returns:
        Structured dict with all schema fields populated (missing → None or []).
        Does NOT validate quality — call verifier.verify_candidate() next.
    """
    # ── Identity fields ───────────────────────────────────────────────────
    topic_name = str(raw.get("topic_name") or raw.get("name") or "").strip()
    if not topic_name:
        raise ValueError("Candidate must have a non-empty 'topic_name' field.")

    raw_id = str(raw.get("id") or raw.get("slug") or "").strip()
    slug = _slugify(raw_id if raw_id else topic_name)

    # ── Category ──────────────────────────────────────────────────────────
    category = _normalize_category(str(raw.get("category") or ""))
    subcategory = (str(raw.get("subcategory") or "").strip()) or None

    # ── Explanation fields ────────────────────────────────────────────────
    short_definition = str(raw.get("short_definition") or "").strip()
    beginner_explanation = str(raw.get("beginner_explanation") or "").strip()
    detailed_explanation = str(raw.get("detailed_explanation") or "").strip()
    mathematical_explanation = str(raw.get("mathematical_explanation") or "").strip() or None

    # ── Mathematical content ──────────────────────────────────────────────
    formula = str(raw.get("formula") or "").strip() or None
    example = str(raw.get("example") or "").strip() or None
    circuit_example = str(raw.get("circuit_example") or "").strip() or None

    # ── Array fields ──────────────────────────────────────────────────────
    related_topics = _ensure_list(raw.get("related_topics"))
    common_mistakes = _ensure_list(raw.get("common_mistakes"))
    aliases = _ensure_list(raw.get("aliases"))
    keywords = _ensure_list(raw.get("keywords"))
    tags = _ensure_list(raw.get("tags"))

    # ── Sources ───────────────────────────────────────────────────────────
    source_name = str(raw.get("source_name") or "").strip() or None
    source_url = str(raw.get("source_url") or "").strip() or None
    additional_sources = raw.get("additional_sources") or []
    if not isinstance(additional_sources, list):
        additional_sources = []

    # ── Tracking fields ───────────────────────────────────────────────────
    difficulty_level = _normalize_difficulty(raw.get("difficulty_level"))
    verification_notes = str(raw.get("verification_notes") or "").strip() or None

    now_iso = datetime.now(timezone.utc).isoformat()

    structured: dict[str, Any] = {
        # Identity
        "id": slug,
        "topic_name": topic_name,
        "slug": slug,
        "category": category,
        "subcategory": subcategory,
        # Explanations
        "short_definition": short_definition,
        "beginner_explanation": beginner_explanation,
        "detailed_explanation": detailed_explanation,
        "mathematical_explanation": mathematical_explanation,
        # Mathematical
        "formula": formula,
        "example": example,
        "circuit_example": circuit_example,
        # Relations
        "related_topics": related_topics,
        "common_mistakes": common_mistakes,
        "aliases": aliases,
        "keywords": keywords,
        "tags": tags,
        # Sources
        "source_name": source_name,
        "source_url": source_url,
        "additional_sources": additional_sources,
        # Ingestion tracking (set at publish time, not now)
        "verification_status": "pending",
        "status": "pending_review",
        "knowledge_version": 1,
        "last_verified_at": None,
        "verification_notes": verification_notes,
        "ingestion_source_id": source_id,
        "difficulty_level": difficulty_level,
    }

    logger.info(f"[structurer] Structured candidate: '{topic_name}' → slug='{slug}', category='{category}'")
    return structured
