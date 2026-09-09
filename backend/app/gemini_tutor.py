import os
import time
import json
import logging
import urllib.request
import urllib.error
from collections import defaultdict

logger = logging.getLogger("gemini_tutor")
logging.basicConfig(level=logging.INFO)

# =========================================================================
# 1. ENVIRONMENT & .ENV LOADER
# =========================================================================

def load_dotenv(dotenv_path=None):
    """Simple, zero-dependency .env loader that populates os.environ without overwriting."""
    paths_to_check = [
        dotenv_path,
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        ".env"
    ]
    for p in paths_to_check:
        if p and os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip("'\"")
                            if k and k not in os.environ:
                                os.environ[k] = v
                logger.info(f"Loaded environment variables from {p}")
                break
            except Exception as e:
                logger.warning(f"Failed to read {p}: {e}")

load_dotenv()


# =========================================================================
# 2. IN-MEMORY RATE LIMITER (PER CLIENT IP)
# =========================================================================

RATE_LIMIT_MAX_REQUESTS = 15
RATE_LIMIT_WINDOW_SECONDS = 60
_ip_request_history = defaultdict(list)

def check_rate_limit(client_ip: str) -> tuple[bool, int]:
    """
    Sliding-window rate limiter per client IP.
    Returns (is_allowed, retry_after_seconds).
    """
    now = time.time()
    timestamps = _ip_request_history[client_ip]
    
    # Remove timestamps older than the window
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS
    _ip_request_history[client_ip] = [t for t in timestamps if t > cutoff]
    
    if len(_ip_request_history[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
        oldest_in_window = _ip_request_history[client_ip][0]
        retry_after = max(1, int(oldest_in_window + RATE_LIMIT_WINDOW_SECONDS - now))
        return False, retry_after

    _ip_request_history[client_ip].append(now)
    return True, 0


# =========================================================================
# 3. MESSAGE SANITIZATION & VALIDATION
# =========================================================================

def validate_and_sanitize_message(message: str) -> str:
    """
    Sanitizes message, ensures non-empty, and enforces maximum length limit.
    """
    if not isinstance(message, str):
        raise ValueError("Message must be a string.")
    
    cleaned = message.strip()
    if not cleaned:
        raise ValueError("Message cannot be empty.")
    
    if len(cleaned) > 2000:
        raise ValueError("Message exceeds the maximum allowed length of 2000 characters.")
    
    return cleaned


# =========================================================================
# 4. GEMINI API CALL WITH EXPONENTIAL BACKOFF
# =========================================================================

SYSTEM_PROMPT = "You are a quantum computing tutor for beginners. Explain concepts clearly, accurately, and without jargon. Never describe a qubit as being 0 and 1 at the same time; explain via probability amplitudes and measurement collapse."

def call_gemini_api(message: str) -> str:
    """
    Invokes the Gemini API using GEMINI_API_KEY with exponential backoff on HTTP 429.
    Never leaks API keys or internal stack traces to the caller.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in environment or .env file.")
        # Pedagogical graceful fallback when key is not configured locally
        if "qubit" in message.lower():
            return (
                "A **qubit** (quantum bit) is the fundamental unit of quantum information! "
                "Unlike a classical bit which is strictly 0 or 1, a qubit exists in a state described by "
                "|ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes. "
                "When measured, it collapses to 0 with probability |α|² or 1 with probability |β|². "
                "(Note: Set GEMINI_API_KEY in backend/.env for live cloud-generated replies!)"
            )
        return (
            "Welcome! I am your quantum computing tutor. "
            "To connect live to Google Gemini, please configure `GEMINI_API_KEY` in `backend/.env`. "
            "Feel free to ask questions like 'What is a qubit?', 'What does a Hadamard gate do?', or 'What is entanglement?'"
        )

    # Try SDK if installed, otherwise use REST API
    use_sdk = False
    try:
        from google import genai
        from google.genai import types
        use_sdk = True
    except Exception:
        use_sdk = False

    max_attempts = 3
    backoff_delays = [1.0, 2.0, 4.0]

    for attempt in range(max_attempts):
        try:
            if use_sdk:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=message,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT
                    )
                )
                if response and response.text:
                    return response.text.strip()
                raise RuntimeError("Empty response received from Gemini SDK.")
            else:
                # Direct REST call to Gemini v1beta endpoint
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                payload = {
                    "systemInstruction": {
                        "parts": [{"text": SYSTEM_PROMPT}]
                    },
                    "contents": [
                        {
                            "parts": [{"text": message}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 800
                    }
                }
                data_bytes = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=data_bytes,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                with urllib.request.urlopen(req, timeout=20) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    candidates = resp_data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"].strip()
                    raise RuntimeError("No text candidate returned by Gemini API.")

        except urllib.error.HTTPError as he:
            if he.code == 429:
                logger.warning(f"Gemini API rate limit 429 encountered (attempt {attempt + 1}/{max_attempts}). Backing off...")
                if attempt < max_attempts - 1:
                    time.sleep(backoff_delays[attempt])
                    continue
                else:
                    raise RateLimitExceededError("The tutor is busy, please try again in a moment.")
            elif he.code in (400, 401, 403):
                logger.error(f"Gemini API authentication/request failure HTTP {he.code}. Check GEMINI_API_KEY.")
                raise AuthenticationError("The tutor service is temporarily unavailable due to an authentication issue.")
            else:
                logger.error(f"Gemini API returned HTTP {he.code}: {he.reason}")
                raise RuntimeError("Unable to communicate with the tutor model at this time.")

        except Exception as e:
            err_str = str(e).lower()
            if "429" in err_str or "quota" in err_str or "rate limit" in err_str:
                logger.warning(f"Rate limit exception (attempt {attempt + 1}/{max_attempts}): {e}")
                if attempt < max_attempts - 1:
                    time.sleep(backoff_delays[attempt])
                    continue
                raise RateLimitExceededError("The tutor is busy, please try again in a moment.")
            
            logger.error(f"Error invoking Gemini model: {type(e).__name__}")
            raise RuntimeError("Unable to generate tutor response at this time.")

    raise RateLimitExceededError("The tutor is busy, please try again in a moment.")


class RateLimitExceededError(Exception):
    pass

class AuthenticationError(Exception):
    pass
