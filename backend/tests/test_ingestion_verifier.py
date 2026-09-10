"""
Test Suite: Ingestion Verifier
Smart India Hackathon — Quantum Knowledge Ingestion Pipeline

Tests the automated quality and notation-compliance checks in verifier.py.
All tests run offline — no Supabase, no network.

Run:
    cd backend
    python -m pytest tests/test_ingestion_verifier.py -v
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from ingestion.verifier import verify_candidate, VerificationReport


# ── Helpers ────────────────────────────────────────────────────────────────

def _base_candidate(**overrides) -> dict:
    """Returns a valid, fully-populated candidate that passes all checks."""
    base = {
        "id": "test-topic",
        "topic_name": "Test Quantum Topic",
        "slug": "test-topic",
        "category": "Foundations",
        "short_definition": "A test quantum topic used for verification testing of the ingestion pipeline.",
        "beginner_explanation": (
            "This is a beginner explanation that is long enough to pass length checks. "
            "It explains the topic in accessible language without forbidden simplifications. "
            "The state |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1 is mentioned here."
        ),
        "detailed_explanation": (
            "This detailed explanation is longer than 200 characters and provides technical depth. "
            "A qubit's quantum state is a normalized vector |ψ⟩ = α|0⟩ + β|1⟩ in a two-dimensional "
            "complex Hilbert space, where α and β are probability amplitudes satisfying the normalization "
            "condition |α|² + |β|² = 1. Measurement in the computational basis yields outcome 0 with "
            "probability |α|² and outcome 1 with probability |β|². "
            "The normalization condition |α|² + |β|² = 1 is always satisfied for physical quantum states."
        ),
        "formula": "H = (1/√2)[[1,1],[1,-1]]",
        "related_topics": ["Qubit", "Hadamard Gate"],
        "common_mistakes": ["A common mistake about this topic."],
        "aliases": ["test topic alias"],
        "keywords": ["test", "quantum", "topic"],
        "tags": ["foundations", "test"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com",
        "additional_sources": [],
    }
    base.update(overrides)
    return base


# ── Tests: Forbidden Simplifications (BLOCKING) ───────────────────────────

class TestForbiddenSimplifications:

    def test_passes_with_no_forbidden_phrases(self):
        """A candidate with no forbidden phrases should pass the notation check."""
        candidate = _base_candidate()
        report = verify_candidate(candidate)
        notation_check = next(c for c in report.checks if c.name == "notation_compliance")
        assert notation_check.passed, notation_check.message

    def test_blocks_on_zero_and_one_at_same_time(self):
        """'0 and 1 at the same time' is a blocking forbidden simplification."""
        candidate = _base_candidate(
            beginner_explanation="A qubit is 0 and 1 at the same time, which is superposition.",
        )
        report = verify_candidate(candidate)
        assert not report.passed
        assert "notation_compliance" in report.blocking_failures

    def test_blocks_on_both_0_and_1_simultaneously(self):
        """'both 0 and 1 simultaneously' is a blocking forbidden simplification."""
        candidate = _base_candidate(
            short_definition="A qubit can be both 0 and 1 simultaneously during computation.",
        )
        report = verify_candidate(candidate)
        assert not report.passed
        assert "notation_compliance" in report.blocking_failures

    def test_blocks_on_exists_as_both(self):
        """'exists as both' in any text field is a blocking failure."""
        candidate = _base_candidate(
            detailed_explanation=(
                "The qubit exists as both states at once until measured. "
                "This is a simplification that is NOT accurate. "
                "The state |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1."
            ),
        )
        report = verify_candidate(candidate)
        assert not report.passed
        assert "notation_compliance" in report.blocking_failures

    def test_case_insensitive_blocking(self):
        """Forbidden phrases are matched case-insensitively."""
        candidate = _base_candidate(
            beginner_explanation="A QUBIT IS 0 AND 1 AT THE SAME TIME — this is wrong.",
        )
        report = verify_candidate(candidate)
        assert "notation_compliance" in report.blocking_failures


# ── Tests: Required Fields (BLOCKING) ────────────────────────────────────

class TestRequiredFields:

    def test_passes_with_all_required_fields(self):
        """A fully-populated candidate should pass required fields check."""
        report = verify_candidate(_base_candidate())
        req_check = next(c for c in report.checks if c.name == "required_fields")
        assert req_check.passed

    def test_blocks_on_missing_topic_name(self):
        """Missing topic_name is a blocking failure."""
        candidate = _base_candidate(topic_name="")
        report = verify_candidate(candidate)
        assert not report.passed
        assert "required_fields" in report.blocking_failures

    def test_blocks_on_missing_short_definition(self):
        """Missing short_definition is a blocking failure."""
        candidate = _base_candidate(short_definition="")
        report = verify_candidate(candidate)
        assert "required_fields" in report.blocking_failures

    def test_blocks_on_missing_category(self):
        """Missing category is a blocking failure."""
        candidate = _base_candidate(category="")
        report = verify_candidate(candidate)
        assert "required_fields" in report.blocking_failures


# ── Tests: Field Length Checks ─────────────────────────────────────────────

class TestFieldLengths:

    def test_short_definition_too_short_fails(self):
        """short_definition below minimum length should fail."""
        candidate = _base_candidate(short_definition="Too short.")
        report = verify_candidate(candidate)
        sd_check = next(c for c in report.checks if c.name == "short_definition_length")
        assert not sd_check.passed

    def test_short_definition_ok_length_passes(self):
        """short_definition of valid length should pass."""
        candidate = _base_candidate(short_definition="A " + "x" * 50)
        report = verify_candidate(candidate)
        sd_check = next(c for c in report.checks if c.name == "short_definition_length")
        assert sd_check.passed

    def test_detailed_explanation_too_short_fails(self):
        """detailed_explanation below minimum length should fail."""
        candidate = _base_candidate(detailed_explanation="Too short.")
        report = verify_candidate(candidate)
        det_check = next(c for c in report.checks if c.name == "detailed_explanation_depth")
        assert not det_check.passed

    def test_detailed_explanation_adequate_passes(self):
        """detailed_explanation of sufficient length should pass."""
        candidate = _base_candidate(detailed_explanation="A" * 250)
        report = verify_candidate(candidate)
        det_check = next(c for c in report.checks if c.name == "detailed_explanation_depth")
        assert det_check.passed


# ── Tests: Superposition & Normalization Notation ─────────────────────────

class TestQuantumNotation:

    def test_superposition_with_ket_notation_passes(self):
        """Mentioning superposition with ket notation |ψ⟩ passes."""
        candidate = _base_candidate(
            beginner_explanation=(
                "Superposition is described by |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. "
                "This is a full explanation meeting length requirements with more context here."
            )
        )
        report = verify_candidate(candidate)
        sp_check = next(c for c in report.checks if c.name == "superposition_notation")
        assert sp_check.passed

    def test_superposition_without_ket_reduces_score(self):
        """Mentioning 'superposition' without ket notation reduces quality score."""
        candidate = _base_candidate(
            beginner_explanation=(
                "Superposition is a key quantum concept. The qubit can be in a state "
                "that has amplitude information. This explanation is long enough to pass "
                "length checks and does not use forbidden phrases."
            ),
            detailed_explanation=(
                "Superposition allows quantum states to encode amplitude information in "
                "a two-dimensional space. No ket notation is used in this explanation deliberately "
                "for testing purposes. The explanation continues with more text to meet length "
                "requirements for the verification test suite."
            ),
        )
        report = verify_candidate(candidate)
        sp_check = next(c for c in report.checks if c.name == "superposition_notation")
        assert not sp_check.passed

    def test_normalization_condition_passes_when_present(self):
        """Mentioning amplitudes with normalization condition |α|² + |β|² = 1 passes."""
        candidate = _base_candidate()  # base candidate includes normalization
        report = verify_candidate(candidate)
        norm_check = next(c for c in report.checks if c.name == "normalization_condition")
        assert norm_check.passed


# ── Tests: Category and Source ────────────────────────────────────────────

class TestCategoryAndSource:

    def test_valid_category_passes(self):
        """Known valid categories should pass."""
        for category in ["Foundations", "Quantum Gates", "Algorithms", "Error Correction"]:
            candidate = _base_candidate(category=category)
            report = verify_candidate(candidate)
            cat_check = next(c for c in report.checks if c.name == "category_valid")
            assert cat_check.passed, f"Category '{category}' should be valid"

    def test_unknown_category_fails(self):
        """An unrecognized category should fail the category check."""
        candidate = _base_candidate(category="Miscellaneous")
        report = verify_candidate(candidate)
        cat_check = next(c for c in report.checks if c.name == "category_valid")
        assert not cat_check.passed

    def test_missing_source_fails(self):
        """A candidate with no source attribution should fail source check."""
        candidate = _base_candidate(source_name="", source_url="", additional_sources=[])
        report = verify_candidate(candidate)
        src_check = next(c for c in report.checks if c.name == "source_attribution")
        assert not src_check.passed

    def test_source_url_only_passes(self):
        """source_url alone (without source_name) is sufficient for attribution."""
        candidate = _base_candidate(source_name="", source_url="https://example.com")
        report = verify_candidate(candidate)
        src_check = next(c for c in report.checks if c.name == "source_attribution")
        assert src_check.passed


# ── Tests: Formula Presence ───────────────────────────────────────────────

class TestFormulaPresence:

    def test_foundations_topic_with_formula_passes(self):
        """A Foundations-category topic with a formula should pass."""
        candidate = _base_candidate(category="Foundations", formula="|ψ⟩ = α|0⟩ + β|1⟩")
        report = verify_candidate(candidate)
        formula_check = next(c for c in report.checks if c.name == "formula_present")
        assert formula_check.passed

    def test_foundations_topic_without_formula_fails(self):
        """A Foundations-category topic without a formula should fail formula check."""
        candidate = _base_candidate(category="Foundations", formula="")
        report = verify_candidate(candidate)
        formula_check = next(c for c in report.checks if c.name == "formula_present")
        assert not formula_check.passed


# ── Tests: Array Field Types ───────────────────────────────────────────────

class TestArrayFieldTypes:

    def test_lists_pass_array_check(self):
        """Properly typed list fields should pass."""
        candidate = _base_candidate(
            related_topics=["Qubit", "Hadamard Gate"],
            keywords=["quantum", "test"],
        )
        report = verify_candidate(candidate)
        arr_check = next(c for c in report.checks if c.name == "array_field_types")
        assert arr_check.passed

    def test_string_instead_of_list_fails(self):
        """A string value for an array field should fail the type check."""
        candidate = _base_candidate(related_topics="Qubit, Hadamard Gate")  # string, not list
        report = verify_candidate(candidate)
        arr_check = next(c for c in report.checks if c.name == "array_field_types")
        assert not arr_check.passed


# ── Tests: Fully Valid Candidate ─────────────────────────────────────────

class TestFullValidCandidate:

    def test_fully_valid_candidate_passes(self):
        """A fully valid candidate should pass verification with high score."""
        candidate = _base_candidate()
        report = verify_candidate(candidate)
        assert report.passed, f"Expected pass, got: {report.summary}"
        assert report.quality_score >= 0.60, f"Score too low: {report.quality_score}"
        assert len(report.blocking_failures) == 0

    def test_verification_report_has_all_check_names(self):
        """VerificationReport should include results for all expected checks."""
        expected_check_names = {
            "notation_compliance", "required_fields", "short_definition_length",
            "detailed_explanation_depth", "category_valid", "formula_present",
            "superposition_notation", "normalization_condition",
            "source_attribution", "array_field_types", "difficulty_level",
        }
        report = verify_candidate(_base_candidate())
        actual_names = {c.name for c in report.checks}
        assert expected_check_names == actual_names, (
            f"Missing checks: {expected_check_names - actual_names}\n"
            f"Extra checks: {actual_names - expected_check_names}"
        )

    def test_report_to_dict_is_serializable(self):
        """VerificationReport.to_dict() should return a JSON-serializable structure."""
        import json
        report = verify_candidate(_base_candidate())
        report_dict = report.to_dict()
        serialized = json.dumps(report_dict)  # should not raise
        parsed = json.loads(serialized)
        assert "quality_score" in parsed
        assert "checks" in parsed
        assert isinstance(parsed["checks"], list)
