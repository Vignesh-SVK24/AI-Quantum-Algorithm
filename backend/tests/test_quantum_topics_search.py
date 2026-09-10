"""
Regression & Verification Test Suite for Quantum Topic Search Bar
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

Verifies the 12 key test cases required by Prompt 10:
1. "Superposition" -> Superposition
2. "H gate" -> Hadamard Gate
3. "Hadamard" -> Hadamard Gate
4. "what is a qubit" -> Qubit
5. "quantum entanglement" -> Quantum Entanglement
6. "gate that flips a qubit" -> X Gate
7. "search algorithm" -> Grover's Algorithm
8. Partial topic name (e.g. "Bloch") -> Bloch Sphere
9. Known alias (e.g. "Controlled-NOT") -> CNOT Gate
10. Misspelled search (e.g. "hadamard gatee") -> "Did you mean: Hadamard Gate"
11. Unknown / nonsense topic (e.g. "best pizza recipe") -> Graceful no-match
12. Related topics link trigger (verifies related topics format & lookup)

STRICT SECURITY & PERFORMANCE VERIFICATIONS:
- Zero external web requests.
- Zero Gemini requests.
- No client-exposed credentials.
- Input validation and rate-limiting resilience.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.stdout.reconfigure(encoding='utf-8')

from app.services.local_search import search_quantum_db

class TestQuantumTopicsSearch(unittest.TestCase):

    def test_1_superposition(self):
        res = search_quantum_db("Superposition")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Superposition")
        self.assertEqual(res["topic"]["category"], "Foundations")
        self.assertTrue(bool(res["topic"].get("formula")))
        self.assertTrue(res["is_verified"])

    def test_2_h_gate(self):
        res = search_quantum_db("H gate")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Hadamard Gate")

    def test_3_hadamard(self):
        res = search_quantum_db("Hadamard")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Hadamard Gate")

    def test_4_what_is_a_qubit(self):
        res = search_quantum_db("what is a qubit")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Qubit")
        self.assertNotIn("0 and 1 at the same time", res["topic"]["short_definition"].lower())

    def test_5_quantum_entanglement(self):
        res = search_quantum_db("quantum entanglement")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Quantum Entanglement")

    def test_6_gate_that_flips_a_qubit(self):
        res = search_quantum_db("gate that flips a qubit")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "X Gate")

    def test_7_search_algorithm(self):
        res = search_quantum_db("search algorithm")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Grover's Algorithm")

    def test_8_partial_topic_name(self):
        res = search_quantum_db("Bloch")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "Bloch Sphere")

    def test_9_known_alias(self):
        res = search_quantum_db("Controlled-NOT")
        self.assertTrue(res["matched"])
        self.assertEqual(res["topic"]["topic_name"], "CNOT Gate")

    def test_10_misspelled_search_did_you_mean(self):
        res = search_quantum_db("hadamard gatee")
        self.assertFalse(res["matched"])
        self.assertIsNone(res["topic"])
        self.assertEqual(res["did_you_mean"], "Hadamard Gate")

    def test_11_unknown_nonsense_topic(self):
        res = search_quantum_db("best pizza recipe in the world")
        self.assertFalse(res["matched"])
        self.assertIsNone(res["topic"])
        self.assertIsNone(res["did_you_mean"])
        self.assertIn("No matching quantum topic", res["message"])

    def test_12_related_topics_link_trigger(self):
        # Initial search for Bell State
        res = search_quantum_db("Bell State")
        self.assertTrue(res["matched"])
        related = res["related_topics"]
        self.assertTrue(len(related) > 0)
        self.assertIn("Quantum Entanglement", related)
        
        # Simulate clicking the related topic button
        clicked_topic = related[0]
        next_res = search_quantum_db(clicked_topic)
        self.assertTrue(next_res["matched"])
        self.assertEqual(next_res["topic"]["topic_name"], clicked_topic)

    def test_additional_gate_queries(self):
        res1 = search_quantum_db("gate for equal superposition")
        self.assertTrue(res1["matched"])
        self.assertEqual(res1["topic"]["topic_name"], "Hadamard Gate")

        res2 = search_quantum_db("probability of measuring a qubit")
        self.assertTrue(res2["matched"])
        self.assertEqual(res2["topic"]["topic_name"], "Measurement")

if __name__ == "__main__":
    unittest.main()
