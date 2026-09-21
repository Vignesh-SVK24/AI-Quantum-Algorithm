"""
Tests for Groq API Fallback Provider in AI Quantum Tutor
Verifies:
1. Normal operation with primary provider (Gemini)
2. Fallback to Groq upon Gemini failure (no dual-calling)
3. Preserved grounded context passed to Groq
4. Configurable Groq model (GROQ_MODEL)
5. Graceful fallback to grounded engine when both providers fail or keys are missing
6. Zero leakage of API keys or raw error traces in response
"""

import os
import sys
import unittest
from unittest.mock import patch, MagicMock

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.gemini_tutor import (
    invoke_gemini,
    invoke_groq,
    dispatch_ai_tutor,
    process_tutor_chat
)


class TestGroqFallback(unittest.TestCase):

    def setUp(self):
        self.sample_prompt = "You are an expert Quantum Computing AI Teaching Assistant grounded in IBM Quantum."
        self.sample_query = "What is quantum superposition?"

    def test_groq_primary_success_does_not_call_gemini(self):
        """When Groq (primary) succeeds, Gemini must NEVER be called (no dual-calling)."""
        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key", "PRIMARY_AI_PROVIDER": "groq"}), \
             patch("app.gemini_tutor.invoke_groq", return_value="Groq Superposition Explanation") as mock_groq, \
             patch("app.gemini_tutor.invoke_gemini") as mock_gemini:

            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Grounded Explanation"
            )

            mock_groq.assert_called_once_with(self.sample_prompt, self.sample_query, model_name=None, history=None)
            mock_gemini.assert_not_called()
            self.assertEqual(provider, "groq")
            self.assertEqual(reply, "Groq Superposition Explanation")

    def test_groq_failure_triggers_gemini_fallback(self):
        """When Groq fails, Gemini is called as fallback with the EXACT same context."""
        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_mock_key_12345", "PRIMARY_AI_PROVIDER": "groq"}), \
             patch("app.gemini_tutor.invoke_groq", side_effect=RuntimeError("GROQ_RATE_LIMIT")), \
             patch("app.gemini_tutor.invoke_gemini", return_value="Gemini Fallback Explanation") as mock_gemini:

            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Grounded Explanation"
            )

            mock_gemini.assert_called_once_with(self.sample_prompt, self.sample_query)
            self.assertEqual(provider, "gemini")
            self.assertEqual(reply, "Gemini Fallback Explanation")

    def test_groq_missing_or_placeholder_key_falls_back_to_grounded_engine(self):
        """If GROQ_API_KEY is missing or placeholder, gracefully fall back to grounded engine without crashing."""
        with patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_API_KEY_MISSING")), \
             patch.dict(os.environ, {"GROQ_API_KEY": "YOUR_GROQ_API_KEY"}):

            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Grounded Fallback Explanation"
            )

            self.assertEqual(provider, "grounded_engine")
            self.assertEqual(reply, "Grounded Fallback Explanation")

    def test_both_providers_fail_falls_back_to_grounded_engine(self):
        """When both Gemini and Groq fail, falls back to grounded engine."""
        with patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_ERROR")), \
             patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}), \
             patch("app.gemini_tutor.invoke_groq", side_effect=RuntimeError("GROQ_ERROR")):

            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Authoritative Grounded Explanation"
            )

            self.assertEqual(provider, "grounded_engine")
            self.assertEqual(reply, "Authoritative Grounded Explanation")

    def test_invoke_groq_respects_groq_model_env(self):
        """invoke_groq should use the model specified by GROQ_MODEL or default to llama-3.3-70b-versatile."""
        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_mock_key", "GROQ_MODEL": "llama-3.1-8b-instant"}), \
             patch("urllib.request.urlopen") as mock_urlopen:
            
            # Mock HTTP response
            mock_resp = MagicMock()
            mock_resp.read.return_value = b'{"choices": [{"message": {"content": "Test Groq Answer"}}]}'
            mock_resp.__enter__.return_value = mock_resp
            mock_urlopen.return_value = mock_resp

            ans = invoke_groq(self.sample_prompt, self.sample_query)
            self.assertEqual(ans, "Test Groq Answer")

            # Verify request payload included the configured model
            call_args = mock_urlopen.call_args
            req_obj = call_args[0][0]
            import json
            payload = json.loads(req_obj.data.decode("utf-8"))
            self.assertEqual(payload["model"], "llama-3.1-8b-instant")
            self.assertEqual(req_obj.headers["Authorization"], "Bearer gsk_test_mock_key")

    def test_process_tutor_chat_end_to_end_with_groq_fallback(self):
        """Full end-to-end tutor chat pipeline correctly reports provider and formats response."""
        with patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_TIMEOUT")), \
             patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}), \
             patch("app.gemini_tutor.invoke_groq", return_value="Quantum superposition allows a state |\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle."):

            result = process_tutor_chat("Explain superposition", mode="beginner")

            self.assertEqual(result["provider"], "groq")
            # Math and symbols cleaner should have converted LaTeX to Unicode
            self.assertIn("|ψ⟩", result["reply"])
            self.assertNotIn("\\rangle", result["reply"])
            self.assertNotIn("gsk_test_key", result["reply"])

    def test_security_no_api_keys_leaked_in_output(self):
        """Verifies API keys are never leaked into the output dictionary or reply text."""
        test_groq_key = "gsk_supersecret_groq_key_99999"
        with patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_DOWN")), \
             patch.dict(os.environ, {"GROQ_API_KEY": test_groq_key}), \
             patch("app.gemini_tutor.invoke_groq", side_effect=RuntimeError("GROQ_DOWN")):

            result = process_tutor_chat("What is a qubit?", mode="beginner")

            # Check that response reply does not contain the key
            self.assertNotIn(test_groq_key, str(result))
            self.assertIn("reply", result)
            self.assertTrue(len(result["reply"]) > 50)

    def test_preferred_provider_groq_calls_groq_directly(self):
        """When user selects Groq, Groq is called directly without calling Gemini first."""
        with patch("app.gemini_tutor.invoke_gemini") as mock_gemini, \
             patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}), \
             patch("app.gemini_tutor.invoke_groq", return_value="Direct Groq Response") as mock_groq:

            result = process_tutor_chat(
                "Explain superposition",
                mode="beginner",
                preferred_provider="groq",
                model_name="openai/gpt-oss-120b"
            )

            mock_gemini.assert_not_called()
            mock_groq.assert_called_once()
            self.assertEqual(result["provider"], "groq")
            self.assertEqual(result["model"], "openai/gpt-oss-120b")
            self.assertIn("Direct Groq Response", result["reply"])

    def test_preferred_provider_gemini_calls_gemini_directly(self):
        """When user selects Gemini, Gemini is called directly without calling Groq."""
        with patch("app.gemini_tutor.invoke_gemini", return_value="Direct Gemini Response") as mock_gemini, \
             patch("app.gemini_tutor.invoke_groq") as mock_groq:

            result = process_tutor_chat(
                "Explain entanglement",
                mode="intermediate",
                preferred_provider="gemini"
            )

            mock_gemini.assert_called_once()
            mock_groq.assert_not_called()
            self.assertEqual(result["provider"], "gemini")
            self.assertEqual(result["model"], "gemini-2.5-flash")

    def test_general_ai_question_no_database_search(self):
        """General questions (e.g. Python, recursion) must NOT search the Knowledge Base and must answer via Groq."""
        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key", "PRIMARY_AI_PROVIDER": "groq"}), \
             patch("app.gemini_tutor.invoke_groq", return_value="Python is a versatile programming language.") as mock_groq, \
             patch("app.gemini_tutor.retrieve_relevant_knowledge") as mock_kb:

            result = process_tutor_chat("What is Python?")

            # Knowledge Base must NOT be queried for general questions
            mock_kb.assert_not_called()
            self.assertEqual(result["provider"], "groq")
            self.assertEqual(result["sources"], [])
            self.assertIn("Python is a versatile programming language.", result["reply"])

    def test_database_fallback_when_both_ai_providers_fail(self):
        """When both Groq and Gemini fail, local verified curriculum is used as emergency fallback."""
        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key", "PRIMARY_AI_PROVIDER": "groq"}), \
             patch("app.gemini_tutor.invoke_groq", side_effect=RuntimeError("GROQ_DOWN")), \
             patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_DOWN")):

            result = process_tutor_chat("What is quantum superposition?")

            self.assertEqual(result["provider"], "grounded_engine")
            self.assertIn("Verified Quantum Curriculum Reference", result["reply"])
            self.assertIn("Based on the verified Quantum Learn knowledge base", result["reply"])


if __name__ == "__main__":
    unittest.main()

