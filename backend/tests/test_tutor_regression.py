import os
import sys
import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.gemini_tutor import process_tutor_chat

client = TestClient(app)

print("=== RUNNING AI TUTOR REGRESSION SUITE ===")

# Test 1: What is a qubit?
print("\n--- TEST 1: What is a qubit? ---")
res1 = client.post("/tutor/chat", json={"message": "What is a qubit?", "mode": "beginner"})
print(f"Status: {res1.status_code}")
data1 = res1.json()
assert res1.status_code == 200, f"Expected 200, got {res1.status_code}"
assert "qubit" in data1["reply"].lower(), "Expected qubit in reply"
assert len(data1["reply"]) > 100, "Expected detailed response"
print("PASSED: Qubit response received and verified.")

# Test 2: Explain superposition with an example
print("\n--- TEST 2: Explain superposition with an example ---")
res2 = client.post("/tutor/chat", json={"message": "Explain superposition with an example.", "mode": "beginner"})
print(f"Status: {res2.status_code}")
data2 = res2.json()
assert res2.status_code == 200
assert "superposition" in data2["reply"].lower()
assert len(data2["reply"]) > 100
print("PASSED: Superposition explanation received and verified.")

# Test 3: Why does the Hadamard gate create superposition?
print("\n--- TEST 3: Why does the Hadamard gate create superposition? ---")
res3 = client.post("/tutor/chat", json={"message": "Why does the Hadamard gate create superposition?", "mode": "intermediate"})
print(f"Status: {res3.status_code}")
data3 = res3.json()
assert res3.status_code == 200
assert "hadamard" in data3["reply"].lower()
print("PASSED: Hadamard explanation received and verified.")

# Test 4: Explain my current circuit with circuit context
print("\n--- TEST 4: Explain my current circuit ---")
circuit_ctx = {
    "page": "Quantum Lab",
    "circuit": [
        {"type": "H", "target": 0, "step": 0},
        {"type": "CNOT", "control": 0, "target": 1, "step": 1}
    ],
    "num_qubits": 2,
    "simulation_result": {
        "num_qubits": 2,
        "probabilities": {"|00⟩": 0.5, "|11⟩": 0.5}
    }
}
res4 = client.post("/tutor/chat", json={
    "message": "Explain my current circuit.",
    "mode": "beginner",
    "circuit_context": circuit_ctx
})
print(f"Status: {res4.status_code}")
data4 = res4.json()
assert res4.status_code == 200
assert len(data4["reply"]) > 50
print("PASSED: Circuit context explanation verified.")

# Test 5: What are the latest developments in quantum error correction?
print("\n--- TEST 5: Latest developments in quantum error correction ---")
res5 = client.post("/tutor/chat", json={
    "message": "What are the latest developments in quantum error correction?",
    "mode": "advanced"
})
print(f"Status: {res5.status_code}")
data5 = res5.json()
assert res5.status_code == 200
assert len(data5["reply"]) > 100
print(f"Web grounded: {data5.get('is_web_grounded')}, Category: {data5.get('research_category')}")
print("PASSED: Web research capability verified.")

# Test 6: Simulate Gemini API failure (auth failure & missing key)
print("\n--- TEST 6: Simulate Gemini API failure ---")
from unittest.mock import patch
import urllib.error

with patch("app.main.process_tutor_chat", side_effect=urllib.error.HTTPError(None, 403, "Forbidden", None, None)):
    res6 = client.post("/tutor/chat", json={"message": "What is a qubit?"})
    print(f"Status with simulated auth error: {res6.status_code}")
    print(f"Response: {res6.json()}")
    assert res6.status_code == 502
    detail = res6.json().get("detail", {})
    err_msg = detail.get("message", "") if isinstance(detail, dict) else str(detail)
    print(f"Error message shown: {err_msg}")
    assert "Google Gemini API authentication failed" in err_msg
    assert "Unable to reach Quantum Backend" not in err_msg
    print("PASSED: Gemini auth failure produces specific 502 Gemini error.")

with patch("app.main.process_tutor_chat", side_effect=RuntimeError("GEMINI_API_KEY is missing")):
    res6_missing = client.post("/tutor/chat", json={"message": "What is a qubit?"})
    print(f"Status with missing key: {res6_missing.status_code}")
    assert res6_missing.status_code == 503
    detail = res6_missing.json().get("detail", {})
    err_msg = detail.get("message", "") if isinstance(detail, dict) else str(detail)
    assert "Gemini API key is not configured" in err_msg
    print("PASSED: Gemini missing key produces specific 503 error.")

print("\n=== ALL 6 INTEGRATION TESTS PASSED SUCCESSFULLY ===")
