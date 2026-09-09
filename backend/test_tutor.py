import sys
sys.stdout.reconfigure(encoding='utf-8')

from app.tutor import ask_tutor

context = {
    "page": "Quantum Lab",
    "circuit": [{"type": "H", "target": 0, "step": 0}],
    "num_qubits": 1,
    "simulation_result": {
        "num_qubits": 1,
        "num_gates": 1,
        "probabilities": {"|0>": 0.5, "|1>": 0.5},
        "measurement_counts": {"|0>": 512, "|1>": 512},
        "shots": 1024
    }
}

question = "why did this happen?"
res = ask_tutor(question, context)
ans = res["answer"]
print("=== AI TUTOR RESPONSE ===")
print(ans)
print("=========================")

assert "H gate" in ans or "Hadamard" in ans, "Should reference Hadamard"
assert "superposition" in ans.lower(), "Should explain superposition"
assert "50%" in ans or "0.5" in ans, "Should reference 50/50 probabilities"
assert "q[0]" in ans, "Should reference qubit q[0]"
print("\n>>> TEST CASE PASSED! The AI Tutor accurately explained the actual circuit and 50/50 outcome!")
