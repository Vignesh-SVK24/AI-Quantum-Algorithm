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

    def test_gemini_success_does_not_call_groq(self):
        """When Gemini succeeds, Groq must NEVER be called (no dual-calling)."""
        with patch("app.gemini_tutor.invoke_gemini", return_value="Gemini Superposition Explanation") as mock_gemini, \
             patch("app.gemini_tutor.invoke_groq") as mock_groq:
            
            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Grounded Explanation"
            )

            mock_gemini.assert_called_once_with(self.sample_prompt, self.sample_query)
            mock_groq.assert_not_called()
            self.assertEqual(provider, "gemini")
            self.assertEqual(reply, "Gemini Superposition Explanation")

    def test_gemini_failure_triggers_groq_fallback_with_same_context(self):
        """When Gemini fails, Groq is called as fallback with the EXACT same context."""
        with patch("app.gemini_tutor.invoke_gemini", side_effect=RuntimeError("GEMINI_RATE_LIMIT")), \
             patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_mock_key_12345", "GROQ_MODEL": "llama-3.3-70b-versatile"}), \
             patch("app.gemini_tutor.invoke_groq", return_value="Groq Superposition Explanation") as mock_groq:

            reply, provider = dispatch_ai_tutor(
                system_prompt=self.sample_prompt,
                user_message=self.sample_query,
                fallback_fn=lambda: "Grounded Explanation"
            )

            mock_groq.assert_called_once_with(self.sample_prompt, self.sample_query)
            self.assertEqual(provider, "groq")
            self.assertEqual(reply, "Groq Superposition Explanation")

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


if __name__ == "__main__":
    unittest.main()
