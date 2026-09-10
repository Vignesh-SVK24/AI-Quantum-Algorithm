import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)


def test_list_playground_algorithms():
    response = client.get("/api/playground/algorithms")
    assert response.status_code == 200
    algos = response.json()
    assert len(algos) == 12
    ids = [a["id"] for a in algos]
    assert "deutsch" in ids
    assert "deutsch_jozsa" in ids
    assert "grover" in ids
    assert "teleportation" in ids
    assert "shor_order_finding" in ids
    assert "vqe" in ids
    assert "qaoa" in ids


def test_get_single_algorithm():
    response = client.get("/api/playground/algorithms/deutsch")
    assert response.status_code == 200
    algo = response.json()
    assert algo["name"] == "Deutsch Algorithm"
    assert algo["category"] == "Beginner"
    assert len(algo["steps"]) == 4
    assert len(algo["initial_gates"]) > 0


def test_explain_circuit_bell_pair():
    payload = {
        "circuit": [
            {"type": "H", "target": 0, "step": 1, "control": None},
            {"type": "CNOT", "target": 1, "step": 2, "control": 0}
        ],
        "num_qubits": 2,
        "simulation_result": {
            "probabilities": {"|00⟩": 0.5, "|11⟩": 0.5}
        },
        "mode": "simple",
        "algorithm_name": "Bell Pair Test"
    }
    response = client.post("/api/circuit/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "gate_explanations" in data
    assert len(data["gate_explanations"]) == 2
    assert "explanation_markdown" in data
    assert "sources" in data
    assert "circuit_observations" in data


def test_explain_circuit_cancellation_detection():
    # Consecutive H gates cancel: H^2 = I
    payload = {
        "circuit": [
            {"type": "H", "target": 0, "step": 1, "control": None},
            {"type": "H", "target": 0, "step": 2, "control": None}
        ],
        "num_qubits": 1,
        "mode": "detailed"
    }
    response = client.post("/api/circuit/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    obs = data.get("circuit_observations", [])
    has_cancellation_tip = any("H² = I" in o.get("message", "") or "cancel" in o.get("message", "") for o in obs)
    assert has_cancellation_tip is True
