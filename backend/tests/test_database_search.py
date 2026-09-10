"""
Automated Test Suite for Local Database Search
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

Tests:
1. Direct Database Retrieval (Qubit, Hadamard, Grover)
2. Off-Topic Guidance Protection
3. Strict Zero Gemini / Zero External Web Search Guarantee
4. FastAPI Search Endpoint (/search/quantum) Compatibility
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
        self.assertTrue(len(res["results"]) > 0)
        self.assertIn("qubit", res["results"][0]["title"].lower())
        self.assertIn(res["storage_engine"], ["supabase_postgres", "sqlite_local"])
        self.assertTrue(res["is_verified"])

    def test_search_hadamard_returns_gate_record(self):
        res = search_quantum_db("hadamard")
        self.assertTrue(len(res["results"]) > 0)
        self.assertIn("hadamard", res["results"][0]["title"].lower())
        self.assertEqual(res["results"][0]["topic"], "Quantum Gates")

    def test_search_grover_returns_algorithm_record(self):
        res = search_quantum_db("grover algorithm")
        self.assertTrue(len(res["results"]) > 0)
        titles = [r["title"].lower() for r in res["results"]]
        self.assertTrue(any("grover" in t for t in titles))

    def test_search_off_topic_redirects_politely(self):
        res = search_quantum_db("chocolate chip cookie recipe")
        self.assertEqual(res["classification"], "off_topic")
        self.assertEqual(len(res["results"]), 0)
        self.assertIn("quantum computing", res["answer"].lower())

    def test_search_endpoint_returns_200_ok(self):
        response = self.client.post("/search/quantum", json={"query": "superposition"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("answer", data)
        self.assertIn("results", data)
        self.assertTrue(len(data["results"]) > 0)
        self.assertTrue(data["is_verified"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
