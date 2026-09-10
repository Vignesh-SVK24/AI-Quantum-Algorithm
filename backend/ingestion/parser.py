"""
Parser Module — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Extracts structured field candidates from raw text/HTML content fetched
from authoritative quantum sources. Used in HTTP fetch mode.
In JSON feed mode (MVP), the candidate JSON files already contain structured
fields — call structurer.structure_candidate() directly instead.
"""

import re
import logging
from typing import Any

logger = logging.getLogger("ingestion.parser")


def strip_html(html: str) -> str:
    """Minimal HTML → plain text conversion (no external library required)."""
    # Remove script/style blocks
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.DOTALL | re.IGNORECASE)
    # Remove HTML tags
    html = re.sub(r"<[^>]+>", " ", html)
    # Collapse whitespace
    html = re.sub(r"\s+", " ", html)
    return html.strip()


def extract_candidate_fields(
    raw_text: str,
    topic_name: str,
    source_name: str = "",
    source_url: str = "",
) -> dict[str, Any]:
    """
    Heuristically extract quantum topic fields from raw fetched text.

    This is a best-effort extractor for HTTP-fetched content. The output
    is a CANDIDATE dict that must still go through:
      structurer.structure_candidate() → verifier.verify_candidate()

    For JSON feed mode, skip this and use the JSON directly.

    Args:
        raw_text: Plain text (after strip_html if HTML source).
        topic_name: The topic name we're looking for on this page.
        source_name: Human-readable source name for attribution.
        source_url: URL of the fetched page for attribution.

    Returns:
        Dict with best-effort field values — many fields may be empty.
    """
    # Normalize whitespace
    text = re.sub(r"\s+", " ", raw_text).strip()

    # ── Attempt to extract a short definition ────────────────────────────
    # Look for a sentence containing the topic name near the beginning
    short_definition = ""
    sentences = re.split(r"(?<=[.!?])\s+", text[:3000])
    topic_lower = topic_name.lower()
    for sentence in sentences[:20]:
        if topic_lower in sentence.lower() and len(sentence) > 40:
            short_definition = sentence.strip()
            break
    if not short_definition and sentences:
        short_definition = sentences[0].strip()[:500]

    # ── Attempt to extract formula (LaTeX-style or ket notation) ─────────
    formula = ""
    ket_matches = re.findall(r"[|ψ|φ|0|1⟩⟨α-ωΑ-Ω√²±×÷∑∏∈∉∩∪][^\n.]{5,80}", text)
    if ket_matches:
        formula = ket_matches[0].strip()

    # ── Extract a paragraph as beginner_explanation ───────────────────────
    paragraphs = [p.strip() for p in re.split(r"\n{2,}|\.\s{2,}", text) if len(p.strip()) > 100]
    beginner_explanation = paragraphs[0] if paragraphs else text[:500]
    detailed_explanation = " ".join(paragraphs[:3]) if len(paragraphs) > 1 else text[:1500]

    # ── Look for Qiskit code ─────────────────────────────────────────────
    circuit_example = ""
    code_match = re.search(
        r"(from qiskit.*?(?:qc\.measure|\.run|statevector_sim).*?)(?:\n{3,}|$)",
        text,
        re.DOTALL,
    )
    if code_match:
        circuit_example = code_match.group(1).strip()[:800]

    candidate = {
        "topic_name": topic_name,
        "short_definition": short_definition[:500],
        "beginner_explanation": beginner_explanation[:1500],
        "detailed_explanation": detailed_explanation[:3000],
        "formula": formula[:300],
        "circuit_example": circuit_example,
        "source_name": source_name,
        "source_url": source_url,
        # Fields that need manual completion after parsing:
        "mathematical_explanation": "",
        "example": "",
        "related_topics": [],
        "common_mistakes": [],
        "aliases": [],
        "keywords": [],
        "tags": [],
        "additional_sources": [],
        "category": "",  # must be set manually
        "difficulty_level": "",
    }

    logger.info(
        f"[parser] Extracted candidate for '{topic_name}': "
        f"short_def={len(short_definition)} chars, "
        f"detailed={len(detailed_explanation)} chars"
    )
    return candidate


def parse_html_page(
    html: str,
    topic_name: str,
    source_name: str = "",
    source_url: str = "",
) -> dict[str, Any]:
    """
    Convenience wrapper: strip HTML then extract candidate fields.
    """
    plain_text = strip_html(html)
    return extract_candidate_fields(plain_text, topic_name, source_name, source_url)
