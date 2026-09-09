import numpy as np

try:
    from qiskit import QuantumCircuit
    from qiskit.quantum_info import Statevector
    HAS_QISKIT = True
except Exception:
    HAS_QISKIT = False


SUPPORTED_GATES = {"H", "X", "Z", "CNOT"}


def validate_circuit(gates: list[dict], num_qubits: int) -> list[str]:
    """Validate the circuit description, returning a list of error messages (empty = valid)."""
    errors = []
    if not gates:
        errors.append("Circuit is empty — add at least one gate before running.")
        return errors

    for i, g in enumerate(gates):
        gtype = g.get("type")
        target = g.get("target")
        step = g.get("step")

        if gtype not in SUPPORTED_GATES:
            errors.append(f"Gate {i}: unknown gate type '{gtype}'. Supported: {SUPPORTED_GATES}")
            continue

        if not isinstance(target, int) or target < 0 or target >= num_qubits:
            errors.append(f"Gate {i} ({gtype}): target qubit {target} is out of range [0, {num_qubits - 1}].")

        if not isinstance(step, int) or step < 0:
            errors.append(f"Gate {i} ({gtype}): invalid step index {step}.")

        if gtype == "CNOT":
            control = g.get("control")
            if not isinstance(control, int) or control < 0 or control >= num_qubits:
                errors.append(f"Gate {i} (CNOT): control qubit {control} is out of range [0, {num_qubits - 1}].")
            elif control == target:
                errors.append(f"Gate {i} (CNOT): control and target cannot be the same qubit ({control}).")

    return errors


def simulate_hadamard_circuit():
    """
    Creates a 1-qubit circuit with a Hadamard gate:
    |0> -> (|0> + |1>) / sqrt(2)
    Returns the statevector amplitudes, probabilities, and simulated measurement counts.
    """
    if HAS_QISKIT:
        try:
            qc = QuantumCircuit(1)
            qc.h(0)
            sv = Statevector.from_instruction(qc)
            statevector_data = sv.data
            amplitudes = [
                {"basis": "|0>", "real": float(np.real(statevector_data[0])), "imag": float(np.imag(statevector_data[0]))},
                {"basis": "|1>", "real": float(np.real(statevector_data[1])), "imag": float(np.imag(statevector_data[1]))}
            ]
            probabilities = {
                "|0>": float(abs(statevector_data[0]) ** 2),
                "|1>": float(abs(statevector_data[1]) ** 2)
            }
            counts = sv.sample_counts(shots=1024)
            formatted_counts = {f"|{k}>": v for k, v in counts.items()}
            return {
                "circuit_name": "1-Qubit Hadamard Superposition",
                "description": "Applies H gate to |0>, preparing an equal superposition of (|0> + |1>)/sqrt(2)",
                "num_qubits": 1,
                "gates": ["H"],
                "statevector": amplitudes,
                "probabilities": probabilities,
                "measurement_counts": formatted_counts,
                "shots": 1024
            }
        except Exception:
            pass

    # Exact statevector simulation fallback
    res = _simulate_circuit_numpy([{"type": "H", "target": 0, "step": 0}], num_qubits=1, shots=1024)
    return {
        "circuit_name": "1-Qubit Hadamard Superposition",
        "description": "Applies H gate to |0>, preparing an equal superposition of (|0> + |1>)/sqrt(2)",
        "num_qubits": 1,
        "gates": ["H"],
        "statevector": res["statevector"],
        "probabilities": res["probabilities"],
        "measurement_counts": res["measurement_counts"],
        "shots": 1024
    }


def _simulate_circuit_numpy(gates: list[dict], num_qubits: int, shots: int = 1024) -> dict:
    num_states = 2 ** num_qubits
    state = np.zeros(num_states, dtype=complex)
    state[0] = 1.0  # |0...0>

    sorted_gates = sorted(gates, key=lambda g: g["step"])
    inv_sqrt2 = 1.0 / np.sqrt(2.0)

    for g in sorted_gates:
        gtype = g["type"]
        target = g["target"]
        t_shift = num_qubits - 1 - target

        if gtype == "X":
            new_state = state.copy()
            for i in range(num_states):
                flipped = i ^ (1 << t_shift)
                new_state[flipped] = state[i]
            state = new_state

        elif gtype == "Z":
            new_state = state.copy()
            for i in range(num_states):
                if (i >> t_shift) & 1:
                    new_state[i] = -state[i]
            state = new_state

        elif gtype == "H":
            new_state = state.copy()
            for i in range(num_states):
                if not ((i >> t_shift) & 1):
                    i0 = i
                    i1 = i | (1 << t_shift)
                    a0 = state[i0]
                    a1 = state[i1]
                    new_state[i0] = (a0 + a1) * inv_sqrt2
                    new_state[i1] = (a0 - a1) * inv_sqrt2
            state = new_state

        elif gtype == "CNOT":
            control = g["control"]
            c_shift = num_qubits - 1 - control
            new_state = state.copy()
            for i in range(num_states):
                if (i >> c_shift) & 1:
                    flipped = i ^ (1 << t_shift)
                    new_state[flipped] = state[i]
            state = new_state

    basis_labels = [f"|{''.join(str((i >> (num_qubits - 1 - bit)) & 1) for bit in range(num_qubits))}>" for i in range(num_states)]
    amplitudes = [
        {"basis": label, "real": round(float(np.real(state[idx])), 6), "imag": round(float(np.imag(state[idx])), 6)}
        for idx, label in enumerate(basis_labels)
    ]
    probabilities = {
        label: round(float(abs(state[idx]) ** 2), 6)
        for idx, label in enumerate(basis_labels)
    }

    probs_array = np.array([float(abs(x) ** 2) for x in state])
    probs_sum = probs_array.sum()
    if probs_sum > 0:
        probs_array = probs_array / probs_sum
    else:
        probs_array = np.ones(num_states) / num_states

    sampled_indices = np.random.choice(num_states, size=shots, p=probs_array)
    unique, counts = np.unique(sampled_indices, return_counts=True)
    counts_map = dict(zip(unique, counts))

    measurement_counts = {
        label: int(counts_map.get(idx, 0))
        for idx, label in enumerate(basis_labels)
        if counts_map.get(idx, 0) > 0
    }

    return {
        "num_qubits": num_qubits,
        "num_gates": len(sorted_gates),
        "statevector": amplitudes,
        "probabilities": probabilities,
        "measurement_counts": measurement_counts,
        "shots": shots,
    }


def build_and_simulate(gates: list[dict], num_qubits: int, shots: int = 1024) -> dict:
    """
    Build a Qiskit QuantumCircuit from the frontend gate list and simulate it.
    Falls back gracefully to exact linear algebra state evolution if Qiskit is not present.
    """
    sorted_gates = sorted(gates, key=lambda g: g["step"])

    if HAS_QISKIT:
        try:
            qc = QuantumCircuit(num_qubits)
            for g in sorted_gates:
                gtype = g["type"]
                target = g["target"]
                if gtype == "H":
                    qc.h(target)
                elif gtype == "X":
                    qc.x(target)
                elif gtype == "Z":
                    qc.z(target)
                elif gtype == "CNOT":
                    control = g["control"]
                    qc.cx(control, target)

            sv = Statevector.from_instruction(qc)
            sv_data = sv.data

            num_states = 2 ** num_qubits
            basis_labels = [f"|{''.join(str((i >> (num_qubits - 1 - bit)) & 1) for bit in range(num_qubits))}>" for i in range(num_states)]

            amplitudes = []
            for idx, label in enumerate(basis_labels):
                amp = sv_data[idx]
                amplitudes.append({
                    "basis": label,
                    "real": round(float(np.real(amp)), 6),
                    "imag": round(float(np.imag(amp)), 6),
                })

            probabilities = {}
            for idx, label in enumerate(basis_labels):
                prob = float(abs(sv_data[idx]) ** 2)
                probabilities[label] = round(prob, 6)

            raw_counts = sv.sample_counts(shots=shots)
            measurement_counts = {f"|{bitstring}>": count for bitstring, count in raw_counts.items()}

            return {
                "num_qubits": num_qubits,
                "num_gates": len(sorted_gates),
                "statevector": amplitudes,
                "probabilities": probabilities,
                "measurement_counts": measurement_counts,
                "shots": shots,
            }
        except Exception:
            pass

    return _simulate_circuit_numpy(gates, num_qubits, shots)
