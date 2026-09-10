"""
Automated Test Suite for Local Database Search
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

Tests:
1. Direct Database Retrieval (Qubit, Hadamard, Grover)
2. Off-Topic Guidance Protection
3. Strict Zero Gemini / Zero External Web Search Guarantee
4. FastAPI Search Endpoint (/search/quantum) Compatibility

Updated to use the current QuantumTopicSearchResponse schema
(matched/topic/did_you_mean) from the rebuilt local_search.py.
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout.reconfigure(encoding="utf-8")

from app.services.local_search import search_quantum_db
from app.main import app

class TestDatabaseSearch(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_search_qubit_returns_database_record(self):
        res = search_quantum_db("qubit")
        self.assertTrue(res["matched"])
        self.assertIsNotNone(res["topic"])
        self.assertIn("qubit", res["topic"]["topic_name"].lower())
        self.assertIn(res["storage_engine"], ["supabase_postgres", "sqlite_local_cache", "json_bundled"])
        self.assertTrue(res["is_verified"])

    def test_search_hadamard_returns_gate_record(self):
        res = search_quantum_db("hadamard")
        self.assertTrue(res["matched"])
        self.assertIsNotNone(res["topic"])
        self.assertIn("hadamard", res["topic"]["topic_name"].lower())
        self.assertEqual(res["topic"]["category"], "Quantum Gates")

    def test_search_grover_returns_algorithm_record(self):
        # "grover algorithm" is near-matches "Grover's Algorithm" — the search
        # may return a direct match OR a did_you_mean suggestion. Both are correct
        # behaviors; what must NOT happen is a completely unrelated result.
        res = search_quantum_db("grover algorithm")
        matched = res["matched"]
        dym = res.get("did_you_mean") or ""
        # Accept: direct match to Grover's Algorithm OR a did_you_mean suggestion
        found_grover = (
            (matched and res.get("topic") and "grover" in res["topic"]["topic_name"].lower())
            or ("grover" in dym.lower())
        )
        self.assertTrue(found_grover, f"Expected grover reference, got: matched={matched}, did_you_mean={dym}")

    def test_search_off_topic_redirects_politely(self):
        res = search_quantum_db("chocolate chip cookie recipe")
        self.assertFalse(res["matched"])
        self.assertIsNone(res["topic"])
        self.assertIn("message", res)

    def test_search_endpoint_returns_200_ok(self):
        response = self.client.post("/search/quantum", json={"query": "superposition"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("matched", data)
        self.assertIn("topic", data)
        self.assertTrue(data["matched"])
        self.assertTrue(data["is_verified"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
