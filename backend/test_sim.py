from app.quantum_sim import build_and_simulate, validate_circuit

print("--- Test 1: 1 qubit with H gate ---")
gates1 = [{"type": "H", "target": 0, "step": 0}]
errs1 = validate_circuit(gates1, num_qubits=1)
assert not errs1, f"Validation errors: {errs1}"
res1 = build_and_simulate(gates1, num_qubits=1, shots=1024)
print("Statevector:", res1["statevector"])
print("Probabilities:", res1["probabilities"])
print("Counts:", res1["measurement_counts"])
assert abs(res1["probabilities"]["|0>"] - 0.5) < 1e-4
assert abs(res1["probabilities"]["|1>"] - 0.5) < 1e-4
print(">>> Test 1 PASSED!")

print("\n--- Test 2: 2 qubits Bell State (H on q0 + CNOT(0, 1)) ---")
gates2 = [
    {"type": "H", "target": 0, "step": 0},
    {"type": "CNOT", "control": 0, "target": 1, "step": 1}
]
errs2 = validate_circuit(gates2, num_qubits=2)
assert not errs2, f"Validation errors: {errs2}"
res2 = build_and_simulate(gates2, num_qubits=2, shots=1024)
print("Statevector:", res2["statevector"])
print("Probabilities:", res2["probabilities"])
print("Counts:", res2["measurement_counts"])
assert abs(res2["probabilities"]["|00>"] - 0.5) < 1e-4
assert abs(res2["probabilities"]["|11>"] - 0.5) < 1e-4
assert res2["probabilities"]["|01>"] < 1e-4
assert res2["probabilities"]["|10>"] < 1e-4
print(">>> Test 2 PASSED!")
print("\nALL QUANTUM TESTS PASSED SUCCESSFULLY!")
