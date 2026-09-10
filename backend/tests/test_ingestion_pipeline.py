"""
Test Suite: Ingestion Pipeline Integration (Dry-Run)
Smart India Hackathon — Quantum Knowledge Ingestion Pipeline

Integration tests for the full pipeline:
  fetcher → structurer → verifier

All tests run completely offline — no Supabase, no network.
The publisher (Supabase + SQLite writes) is NOT tested here to keep
tests side-effect-free. Publisher is tested via the admin review CLI.

Run:
    cd backend
    python -m pytest tests/test_ingestion_pipeline.py -v
"""

import sys
import os
import json
from pathlib import Path

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest

from ingestion.fetcher import load_candidate_file, load_all_candidates
from ingestion.structurer import structure_candidate, _slugify, _ensure_list, _normalize_category
from ingestion.verifier import verify_candidate
from ingestion.config import CANDIDATES_DIR


# ── Structurer Unit Tests ─────────────────────────────────────────────────

class TestStructurer:

    def test_slugify_basic(self):
        """Test basic slug generation."""
        assert _slugify("Hadamard Gate") == "hadamard-gate"
        assert _slugify("Shor's Algorithm") == "shors-algorithm"
        assert _slugify("Quantum Fourier Transform") == "quantum-fourier-transform"

    def test_slugify_normalizes_special_chars(self):
        """Slugify removes apostrophes and special characters."""
        assert _slugify("Grover's") == "grovers"

    def test_ensure_list_from_list(self):
        """ensure_list returns a list unchanged."""
        assert _ensure_list(["a", "b", "c"]) == ["a", "b", "c"]

    def test_ensure_list_from_string(self):
        """ensure_list wraps a string in a list."""
        assert _ensure_list("single item") == ["single item"]

    def test_ensure_list_from_csv_string(self):
        """ensure_list splits comma-separated strings."""
        result = _ensure_list("Qubit, Hadamard Gate, CNOT")
        assert result == ["Qubit", "Hadamard Gate", "CNOT"]

    def test_ensure_list_from_none(self):
        """ensure_list returns empty list for None."""
        assert _ensure_list(None) == []

    def test_normalize_category_known_values(self):
        """Known category strings map correctly."""
        assert _normalize_category("gate") == "Quantum Gates"
        assert _normalize_category("algorithm") == "Algorithms"
        assert _normalize_category("Foundations") == "Foundations"
        assert _normalize_category("qec") == "Error Correction"

    def test_normalize_category_unknown_defaults_to_foundations(self):
        """Unknown categories default to 'Foundations'."""
        result = _normalize_category("Something Weird")
        assert result == "Foundations"

    def test_structure_candidate_returns_all_fields(self):
        """structure_candidate should return all required schema fields."""
        required_fields = [
            "id", "topic_name", "slug", "category",
            "short_definition", "beginner_explanation", "detailed_explanation",
            "related_topics", "common_mistakes", "aliases", "keywords", "tags",
            "status", "verification_status", "ingestion_source_id",
        ]
        raw = {
            "topic_name": "Test Gate",
            "short_definition": "A test quantum gate for unit testing.",
            "beginner_explanation": "Beginner explanation text.",
            "detailed_explanation": "Detailed explanation text.",
            "category": "Quantum Gates",
        }
        structured = structure_candidate(raw, source_id="manual-curation")
        for field in required_fields:
            assert field in structured, f"Field '{field}' missing from structured output"

    def test_structure_candidate_sets_pending_status(self):
        """Freshly structured candidates should have status='pending_review'."""
        raw = {
            "topic_name": "New Topic",
            "short_definition": "Definition of new topic.",
            "beginner_explanation": "Beginner explanation.",
            "detailed_explanation": "Detailed explanation.",
        }
        structured = structure_candidate(raw, source_id="manual-curation")
        assert structured["status"] == "pending_review"
        assert structured["verification_status"] == "pending"

    def test_structure_candidate_sets_correct_source_id(self):
        """source_id from argument must appear in structured output."""
        raw = {
            "topic_name": "Source Test",
            "short_definition": "Definition.",
            "beginner_explanation": "Explanation.",
            "detailed_explanation": "Detailed.",
        }
        structured = structure_candidate(raw, source_id="ibm-quantum-learning")
        assert structured["ingestion_source_id"] == "ibm-quantum-learning"

    def test_structure_candidate_raises_on_missing_topic_name(self):
        """structure_candidate raises ValueError if topic_name is missing."""
        with pytest.raises(ValueError, match="topic_name"):
            structure_candidate({"short_definition": "Something"}, source_id="manual-curation")


# ── Fetcher Unit Tests ────────────────────────────────────────────────────

class TestFetcher:

    def test_load_candidate_file_single_dict(self, tmp_path):
        """load_candidate_file should handle a single topic dict."""
        candidate = {"topic_name": "Test", "short_definition": "Test definition."}
        filepath = tmp_path / "test.json"
        filepath.write_text(json.dumps(candidate), encoding="utf-8")
        result = load_candidate_file(filepath)
        assert len(result) == 1
        assert result[0]["topic_name"] == "Test"

    def test_load_candidate_file_list(self, tmp_path):
        """load_candidate_file should handle a list of topic dicts."""
        candidates = [
            {"topic_name": "A", "short_definition": "Def A"},
            {"topic_name": "B", "short_definition": "Def B"},
        ]
        filepath = tmp_path / "test.json"
        filepath.write_text(json.dumps(candidates), encoding="utf-8")
        result = load_candidate_file(filepath)
        assert len(result) == 2

    def test_load_candidate_file_missing_raises(self):
        """load_candidate_file should raise FileNotFoundError for missing files."""
        with pytest.raises(FileNotFoundError):
            load_candidate_file(Path("/nonexistent/path/file.json"))

    def test_load_all_candidates_from_directory(self, tmp_path):
        """load_all_candidates should load all .json files from a directory."""
        for i in range(3):
            (tmp_path / f"topic_{i}.json").write_text(
                json.dumps({"topic_name": f"Topic {i}", "short_definition": f"Def {i}"}),
                encoding="utf-8",
            )
        results = load_all_candidates(tmp_path)
        assert len(results) == 3

    def test_load_all_candidates_empty_directory(self, tmp_path):
        """load_all_candidates on empty directory returns empty list."""
        results = load_all_candidates(tmp_path)
        assert results == []


# ── End-to-End Pipeline Tests (Dry Run, No Supabase) ─────────────────────

class TestPipelineE2E:

    def _make_valid_raw(self, **overrides) -> dict:
        """Minimal valid raw candidate that passes the full pipeline."""
        base = {
            "topic_name": "Pipeline Test Gate",
            "slug": "pipeline-test-gate",
            "category": "Quantum Gates",
            "short_definition": "A test gate used for pipeline integration testing with adequate length.",
            "beginner_explanation": (
                "This is a beginner explanation for the pipeline test gate. "
                "It describes the gate behavior using ket notation: |ψ⟩ = α|0⟩ + β|1⟩ "
                "with |α|² + |β|² = 1. The explanation is long enough to pass validation."
            ),
            "detailed_explanation": (
                "The detailed explanation provides technical depth for the pipeline test gate. "
                "A quantum gate is a unitary operator U satisfying U†U = I. "
                "The gate acts on normalized state vectors |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. "
                "This description is more than 200 characters and meets all validation requirements."
            ),
            "formula": "U†U = I (unitary condition)",
            "related_topics": ["Qubit", "Superposition"],
            "common_mistakes": ["Assuming quantum gates are not reversible."],
            "aliases": ["test gate", "pipeline gate"],
            "keywords": ["test", "gate", "pipeline"],
            "tags": ["test", "gates"],
            "source_name": "IBM Quantum Learning",
            "source_url": "https://learning.quantum.ibm.com",
            "additional_sources": [],
        }
        base.update(overrides)
        return base

    def test_pipeline_valid_candidate_passes_e2e(self):
        """A valid candidate should pass structure → verify with high score."""
        raw = self._make_valid_raw()
        structured = structure_candidate(raw, source_id="manual-curation")
        report = verify_candidate(structured)

        assert report.passed, f"Expected PASS, got: {report.summary}\nChecks: {[(c.name, c.passed, c.message) for c in report.checks if not c.passed]}"
        assert report.quality_score >= 0.60
        assert len(report.blocking_failures) == 0

    def test_pipeline_forbidden_phrase_auto_rejects(self):
        """A candidate with forbidden simplification is auto-rejected by verifier."""
        raw = self._make_valid_raw(
            beginner_explanation="A qubit is 0 and 1 at the same time. This is superposition.",
        )
        structured = structure_candidate(raw, source_id="manual-curation")
        report = verify_candidate(structured)

        assert not report.passed
        assert "notation_compliance" in report.blocking_failures

    def test_pipeline_missing_fields_blocks(self):
        """Missing required fields block the candidate."""
        raw = self._make_valid_raw(short_definition="")
        structured = structure_candidate(raw, source_id="manual-curation")
        report = verify_candidate(structured)

        assert not report.passed
        assert "required_fields" in report.blocking_failures

    def test_pipeline_category_normalization(self):
        """Category is normalized through structure_candidate."""
        raw = self._make_valid_raw(category="gate")  # lowercase alias
        structured = structure_candidate(raw, source_id="manual-curation")
        assert structured["category"] == "Quantum Gates"

    def test_pipeline_report_to_dict_is_json_serializable(self):
        """The full pipeline report should serialize to JSON without errors."""
        raw = self._make_valid_raw()
        structured = structure_candidate(raw, source_id="manual-curation")
        report = verify_candidate(structured)
        report_dict = report.to_dict()
        serialized = json.dumps(report_dict)
        parsed = json.loads(serialized)
        assert parsed["topic_slug"] == "pipeline-test-gate"


# ── Candidate Data Integrity Tests ─────────────────────────────────────────

class TestCandidateDataIntegrity:
    """
    Test that the actual candidate JSON files in data/candidates/
    are valid and pass structure + verify without modification.
    """

    @pytest.mark.skipif(
        not CANDIDATES_DIR.exists(),
        reason="candidates/ directory does not exist yet",
    )
    def test_all_candidate_files_are_valid_json(self):
        """All files in data/candidates/ must be valid JSON."""
        candidate_files = list(CANDIDATES_DIR.glob("*.json"))
        assert len(candidate_files) > 0, "No candidate files found"
        for filepath in candidate_files:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)  # Raises if invalid JSON
            assert data is not None, f"{filepath.name} is empty"

    @pytest.mark.skipif(
        not CANDIDATES_DIR.exists(),
        reason="candidates/ directory does not exist yet",
    )
    def test_candidate_files_pass_structure_and_verify(self):
        """Every candidate file should pass structurer and yield a verification report."""
        all_candidates = load_all_candidates(CANDIDATES_DIR)
        assert len(all_candidates) > 0, "No candidates loaded"

        failed_topics = []
        for filepath, raw in all_candidates:
            topic_name = raw.get("topic_name", f"[unknown from {filepath.name}]")
            try:
                structured = structure_candidate(raw, source_id=raw.get("source_id", "manual-curation"))
                report = verify_candidate(structured)
                if not report.passed:
                    failed_topics.append(
                        f"{topic_name}: {report.summary} "
                        f"[blocking={report.blocking_failures}]"
                    )
            except Exception as e:
                failed_topics.append(f"{topic_name}: EXCEPTION — {e}")

        assert not failed_topics, (
            f"{len(failed_topics)} candidate(s) failed pipeline:\n"
            + "\n".join(f"  - {t}" for t in failed_topics)
        )
