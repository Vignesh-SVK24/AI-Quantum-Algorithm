import sys
import logging
from typing import NamedTuple

logger = logging.getLogger("accuracy_test")

class AccuracyTestCase(NamedTuple):
    id: str
    category: str
    query: str
    mode: str
    required_keywords: list[str]
    forbidden_keywords: list[str]
    expected_classification: str

TEST_CASES: list[AccuracyTestCase] = [
    AccuracyTestCase(
        id="TC01_qubit_definition",
        category="Fundamentals",
        query="What is a qubit?",
        mode="beginner",
        required_keywords=["qubit", "quantum", "bit"],
        forbidden_keywords=["is 0 and 1 at the same time"],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC02_superposition_misconception",
        category="Fundamentals",
        query="Isn't a qubit just 0 and 1 at the same time?",
        mode="beginner",
        required_keywords=["not", "amplitude"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC03_computational_basis",
        category="Fundamentals",
        query="What are the basis states |0> and |1>?",
        mode="intermediate",
        required_keywords=["basis", "0", "1"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC04_born_rule_normalization",
        category="Fundamentals",
        query="Explain probability amplitudes and the normalization condition.",
        mode="intermediate",
        required_keywords=["amplitude", "probability", "1"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC05_measurement_collapse",
        category="Measurement",
        query="What happens when a qubit is measured?",
        mode="beginner",
        required_keywords=["collapse", "measure"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC06_bloch_sphere",
        category="Visualization",
        query="How does the Bloch sphere represent a qubit?",
        mode="intermediate",
        required_keywords=["sphere", "north", "south"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC07_hadamard_gate",
        category="Gates",
        query="What does the Hadamard gate do?",
        mode="beginner",
        required_keywords=["hadamard", "superposition"],
        forbidden_keywords=[],
        expected_classification="gate_circuit"
    ),
    AccuracyTestCase(
        id="TC08_pauli_x_gate",
        category="Gates",
        query="Explain the Pauli-X gate.",
        mode="beginner",
        required_keywords=["not", "flip"],
        forbidden_keywords=[],
        expected_classification="gate_circuit"
    ),
    AccuracyTestCase(
        id="TC09_pauli_z_gate",
        category="Gates",
        query="What is the effect of a Pauli-Z gate?",
        mode="intermediate",
        required_keywords=["phase", "z"],
        forbidden_keywords=[],
        expected_classification="gate_circuit"
    ),
    AccuracyTestCase(
        id="TC10_cnot_gate",
        category="Gates",
        query="How does a CNOT gate work with two qubits?",
        mode="beginner",
        required_keywords=["control", "target"],
        forbidden_keywords=[],
        expected_classification="gate_circuit"
    ),
    AccuracyTestCase(
        id="TC11_bell_state_entanglement",
        category="Entanglement",
        query="Show me a circuit that creates a Bell state",
        mode="intermediate",
        required_keywords=["bell", "cnot"],
        forbidden_keywords=[],
        expected_classification="circuit_generation"
    ),
    AccuracyTestCase(
        id="TC12_phase_kickback",
        category="Techniques",
        query="What is quantum phase kickback?",
        mode="advanced",
        required_keywords=["phase", "kickback", "eigenvalue"],
        forbidden_keywords=[],
        expected_classification="concept_explanation"
    ),
    AccuracyTestCase(
        id="TC13_deutsch_jozsa",
        category="Algorithms",
        query="Why is Deutsch-Jozsa faster than classical algorithms?",
        mode="intermediate",
        required_keywords=["constant", "balanced", "1"],
        forbidden_keywords=[],
        expected_classification="algorithm"
    ),
    AccuracyTestCase(
        id="TC14_grovers_search_speedup",
        category="Algorithms",
        query="What is the speedup of Grover's search algorithm?",
        mode="intermediate",
        required_keywords=["quadratic", "grover"],
        forbidden_keywords=[],
        expected_classification="algorithm"
    ),
    AccuracyTestCase(
        id="TC15_amplitude_amplification",
        category="Algorithms",
        query="Explain the diffusion operator in Grover's algorithm.",
        mode="advanced",
        required_keywords=["diffusion", "inversion", "mean"],
        forbidden_keywords=[],
        expected_classification="algorithm"
    ),
    AccuracyTestCase(
        id="TC16_off_topic_redirect",
        category="Safety",
        query="What is the recipe for baking chocolate chip cookies?",
        mode="beginner",
        required_keywords=["focused on quantum computing"],
        forbidden_keywords=["flour", "sugar", "bake at 350"],
        expected_classification="off_topic"
    )
]

def run_accuracy_tests(tutor_processor_func=None) -> dict:
    """
    Executes the accuracy test suite against the AI Tutor engine.
    Returns structured results with pass/fail counts and details.
    """
    if tutor_processor_func is None:
        from app.gemini_tutor import process_tutor_chat
        tutor_processor_func = process_tutor_chat

    results = []
    passed_count = 0
    total_count = len(TEST_CASES)

    for tc in TEST_CASES:
        try:
            res = tutor_processor_func(tc.query, mode=tc.mode)
            reply_lower = res.get("reply", "").lower()
            classification = res.get("classification", "")

            errors = []

            # 1. Classification check
            if classification != tc.expected_classification:
                errors.append(f"Expected class '{tc.expected_classification}', got '{classification}'")

            # 2. Required keywords check
            for kw in tc.required_keywords:
                if kw.lower() not in reply_lower:
                    errors.append(f"Missing required keyword: '{kw}'")

            # 3. Forbidden keywords check
            for fkw in tc.forbidden_keywords:
                if fkw.lower() in reply_lower:
                    errors.append(f"Contains forbidden phrase: '{fkw}'")

            passed = len(errors) == 0
            if passed:
                passed_count += 1

            results.append({
                "id": tc.id,
                "category": tc.category,
                "query": tc.query,
                "mode": tc.mode,
                "passed": passed,
                "errors": errors,
                "classification": classification,
                "reply_preview": res.get("reply", "")[:120] + "..."
            })
        except Exception as e:
            results.append({
                "id": tc.id,
                "category": tc.category,
                "query": tc.query,
                "mode": tc.mode,
                "passed": False,
                "errors": [f"Execution error: {str(e)}"],
                "classification": "error",
                "reply_preview": "N/A"
            })

    pass_percentage = round((passed_count / total_count) * 100, 1) if total_count > 0 else 0.0
    return {
        "total": total_count,
        "passed": passed_count,
        "failed": total_count - passed_count,
        "pass_percentage": pass_percentage,
        "status": "ALL_PASSED" if passed_count == total_count else "HAS_FAILURES",
        "results": results
    }

if __name__ == "__main__":
    from app.gemini_tutor import process_tutor_chat
    print(f"Running {len(TEST_CASES)} AI Tutor Accuracy Tests...")
    summary = run_accuracy_tests(process_tutor_chat)
    print(f"Results: {summary['passed']}/{summary['total']} Passed ({summary['pass_percentage']}%)")
    for r in summary["results"]:
        status_icon = "✓" if r["passed"] else "✗"
        print(f"{status_icon} [{r['id']}] {r['query']} -> {r['classification']}")
        if not r["passed"]:
            print(f"   Errors: {r['errors']}")
    sys.exit(0 if summary["status"] == "ALL_PASSED" else 1)
