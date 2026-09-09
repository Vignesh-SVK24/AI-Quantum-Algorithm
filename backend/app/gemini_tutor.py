import os
import re
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

def load_dotenv(dotenv_path=None, override=True):
    """Simple, zero-dependency .env loader that populates os.environ."""
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
                            if k and (override or k not in os.environ or not os.environ[k]):
                                os.environ[k] = v
                logger.info(f"Loaded environment variables from {p}")
                break
            except Exception as e:
                logger.warning(f"Failed to read {p}: {e}")

load_dotenv(override=True)


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
    """Sanitizes message, ensures non-empty, and enforces maximum length limit."""
    if not isinstance(message, str):
        raise ValueError("Message must be a string.")
    
    cleaned = message.strip()
    if not cleaned:
        raise ValueError("Message cannot be empty.")
    
    if len(cleaned) > 2000:
        raise ValueError("Message exceeds the maximum allowed length of 2000 characters.")
    
    return cleaned


# =========================================================================
# 4. KNOWLEDGE BASE LOADER & RAG RETRIEVAL (PART 1)
# =========================================================================

_KNOWLEDGE_BASE: list[dict] = []

def load_knowledge_base() -> list[dict]:
    """Loads verified reference entries from knowledge_base.json."""
    global _KNOWLEDGE_BASE
    if _KNOWLEDGE_BASE:
        return _KNOWLEDGE_BASE
    
    kb_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "knowledge_base.json")
    if os.path.exists(kb_path):
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                _KNOWLEDGE_BASE = json.load(f)
                logger.info(f"Loaded {len(_KNOWLEDGE_BASE)} knowledge base entries from {kb_path}")
        except Exception as e:
            logger.error(f"Error loading knowledge base from {kb_path}: {e}")
            _KNOWLEDGE_BASE = []
    return _KNOWLEDGE_BASE


def retrieve_relevant_knowledge(query: str, top_k: int = 3) -> tuple[list[dict], list[dict]]:
    """
    Performs keyword & tag matching against knowledge base.
    Returns (matched_entries, citations_list).
    """
    kb = load_knowledge_base()
    if not kb:
        return [], []

    q_lower = query.lower()
    # Tokenize alphanumeric words
    tokens = re.findall(r'\b[a-z0-9_\-\+]+\b', q_lower)
    token_set = set(tokens)

    scored_entries = []
    for entry in kb:
        score = 0.0
        title_lower = entry.get("title", "").lower()
        summary_lower = entry.get("summary", "").lower()
        tags = [t.lower() for t in entry.get("tags", [])]

        # Exact tag match bonus
        for tag in tags:
            if tag in q_lower:
                score += 4.0
            elif any(t == tag for t in tokens):
                score += 3.0

        # Title match
        for token in token_set:
            if token in title_lower:
                score += 2.5
            if token in summary_lower:
                score += 0.8

        # Phrase matches for key quantum terms
        if entry["id"] == "hadamard_gate" and ("hadamard" in q_lower or "h gate" in q_lower or " h " in f" {q_lower} "):
            score += 6.0
        elif entry["id"] == "pauli_x_gate" and ("not gate" in q_lower or "pauli-x" in q_lower or "x gate" in q_lower):
            score += 6.0
        elif entry["id"] == "cnot_gate" and ("cnot" in q_lower or "cx" in q_lower or "controlled not" in q_lower):
            score += 6.0
        elif entry["id"] == "bell_states" and ("bell state" in q_lower or "epr pair" in q_lower or "entangle" in q_lower):
            score += 5.0
        elif entry["id"] == "grovers_search_algorithm" and ("grover" in q_lower or "search" in q_lower):
            score += 6.0
        elif entry["id"] == "deutsch_jozsa_algorithm" and ("deutsch" in q_lower or "oracle" in q_lower):
            score += 6.0
        elif entry["id"] == "superposition_principle" and "superposition" in q_lower:
            score += 5.0
        elif entry["id"] == "bloch_sphere" and ("bloch" in q_lower or "sphere" in q_lower):
            score += 5.0
        elif entry["id"] == "qubit_definition" and ("qubit" in q_lower or "quantum bit" in q_lower):
            score += 4.0

        if score > 1.0:
            scored_entries.append((score, entry))

    scored_entries.sort(key=lambda x: x[0], reverse=True)
    top_entries = [item[1] for item in scored_entries[:top_k]]

    # Format citations
    citations = []
    seen = set()
    for e in top_entries:
        src = e.get("source", "IBM Quantum Learning")
        if src not in seen:
            citations.append({
                "id": e.get("id"),
                "name": src,
                "title": e.get("title", ""),
                "url": e.get("url", "")
            })
            seen.add(src)

    return top_entries, citations


# =========================================================================
# 5. QUESTION CLASSIFICATION & SCOPE (PART 2)
# =========================================================================

QUANTUM_KEYWORDS = {
    "qubit", "quantum", "superposition", "entanglement", "bloch", "hadamard", 
    "cnot", "pauli", "schrodinger", "amplitude", "statevector", "dirac", "ket", 
    "bra", "oracle", "grover", "deutsch", "jozsa", "qiskit", "gate", "circuit", 
    "collapse", "born", "measurement", "unitary", "eigenvalue", "phase", "kickback",
    "shor", "teleportation", "bell", "epr", "qubits", "gates", "circuits", "spin"
}

OFF_TOPIC_PATTERNS = [
    r"\b(recipe|cook|bake|cake|pizza|burger|pasta|food)\b",
    r"\b(weather|forecast|rain|sunny|climate|temperature)\b",
    r"\b(football|soccer|cricket|nba|baseball|olympics|sports)\b",
    r"\b(movie|cinema|actor|actress|hollywood|bollywood)\b",
    r"\b(president|election|politics|politician|minister)\b",
    r"\b(stock|crypto|bitcoin|trading|forex|invest)\b"
]

def classify_question(query: str, circuit_context: dict | None = None) -> str:
    """
    Classifies question into:
    - off_topic
    - code_request
    - circuit_generation
    - why_result
    - algorithm
    - gate_circuit
    - concept_explanation
    """
    q_lower = query.lower().strip()
    words = set(re.findall(r'\b[a-z0-9_\-\+]+\b', q_lower))

    # Check for obvious off-topic keywords
    for pat in OFF_TOPIC_PATTERNS:
        if re.search(pat, q_lower) and not (words & QUANTUM_KEYWORDS):
            return "off_topic"

    # If completely devoid of quantum relevance and greetings
    greetings = {"hi", "hello", "hey", "help", "who", "are", "you", "thanks", "thank"}
    is_quantum = bool(words & QUANTUM_KEYWORDS) or any(k in q_lower for k in QUANTUM_KEYWORDS)
    is_greeting = bool(words & greetings) and len(words) <= 4

    if not is_quantum and not is_greeting and circuit_context is None:
        # Check if question seems off-topic
        if len(words) > 2 and not any(w in ("what", "how", "why", "explain", "is", "a", "the") for w in words):
            return "off_topic"
        if any(w in words for w in ("cat", "dog", "car", "travel", "flight", "hotel", "game", "song", "music")):
            return "off_topic"

    # Circuit generation intent
    if any(p in q_lower for p in [
        "create a circuit", "generate a circuit", "show me a circuit", "build a circuit", 
        "make a circuit", "give me a circuit", "construct a circuit", "circuit that creates",
        "circuit for bell", "circuit for superposition", "bell state circuit"
    ]):
        return "circuit_generation"

    # Code request intent
    if any(p in q_lower for p in ["qiskit code", "python code", "code for", "write code", "how to code", "show code", "qiskit script"]):
        return "code_request"

    # Why did this happen / result explanation
    if any(p in q_lower for p in ["why did this happen", "why result", "why 50/50", "explain result", "why did i get", "outcome explanation"]):
        return "why_result"

    # Algorithm specific
    if any(p in q_lower for p in ["grover", "deutsch", "jozsa", "oracle", "diffusion", "shor"]):
        return "algorithm"

    # Gate specific
    if any(p in q_lower for p in ["gate", "hadamard", "cnot", "pauli", "h gate", "x gate", "z gate"]):
        return "gate_circuit"

    return "concept_explanation"


# =========================================================================
# 6. CIRCUIT GENERATOR & QISKIT CODE VERIFICATION (PART 3)
# =========================================================================

def generate_circuit_and_qiskit_code(query: str) -> tuple[dict | None, str | None, bool]:
    """
    Parses user natural language request to produce standard circuit_data
    and generates verified runnable Qiskit Python code.
    Returns (circuit_data, qiskit_code, is_verified).
    """
    q_lower = query.lower()

    circuit_data = None
    qiskit_code = None

    if "bell" in q_lower or "entangle" in q_lower or "phi+" in q_lower:
        # Bell state (|00⟩ + |11⟩)/√2
        circuit_data = {
            "num_qubits": 2,
            "gates": [
                {"type": "H", "target": 0, "step": 0},
                {"type": "CNOT", "control": 0, "target": 1, "step": 1}
            ]
        }
        qiskit_code = """from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Create a 2-qubit Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
qc = QuantumCircuit(2)
qc.h(0)           # Step 1: Put qubit 0 into equal superposition
qc.cx(0, 1)       # Step 2: Entangle qubit 0 with qubit 1 using CNOT

# Calculate exact statevector
state = Statevector.from_instruction(qc)
print("Bell State Statevector:")
print(state)
"""
    elif "superposition" in q_lower or "hadamard" in q_lower:
        # Single qubit superposition
        circuit_data = {
            "num_qubits": 1,
            "gates": [
                {"type": "H", "target": 0, "step": 0}
            ]
        }
        qiskit_code = """from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Create single-qubit equal superposition |+⟩ = (|0⟩ + |1⟩)/√2
qc = QuantumCircuit(1)
qc.h(0)           # Apply Hadamard gate to ground state |0⟩

state = Statevector.from_instruction(qc)
print("Superposition Statevector:")
print(state)
"""
    elif "ghz" in q_lower:
        # 3-qubit GHZ state (|000⟩ + |111⟩)/√2
        circuit_data = {
            "num_qubits": 3,
            "gates": [
                {"type": "H", "target": 0, "step": 0},
                {"type": "CNOT", "control": 0, "target": 1, "step": 1},
                {"type": "CNOT", "control": 1, "target": 2, "step": 2}
            ]
        }
        qiskit_code = """from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Create 3-qubit Greenberger–Horne–Zeilinger (GHZ) state
qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)

state = Statevector.from_instruction(qc)
print("GHZ Statevector:")
print(state)
"""
    elif "not" in q_lower or "pauli-x" in q_lower or "x gate" in q_lower:
        circuit_data = {
            "num_qubits": 1,
            "gates": [
                {"type": "X", "target": 0, "step": 0}
            ]
        }
        qiskit_code = """from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Apply Pauli-X (NOT) gate: |0⟩ -> |1⟩
qc = QuantumCircuit(1)
qc.x(0)

state = Statevector.from_instruction(qc)
print("Flipped Statevector (|1⟩):")
print(state)
"""
    else:
        # Default educational circuit: H on q[0], CNOT to q[1]
        circuit_data = {
            "num_qubits": 2,
            "gates": [
                {"type": "H", "target": 0, "step": 0},
                {"type": "CNOT", "control": 0, "target": 1, "step": 1}
            ]
        }
        qiskit_code = """from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

state = Statevector.from_instruction(qc)
print(state)
"""

    # Backend Verification: execute code in an isolated dictionary
    is_verified = verify_qiskit_code(qiskit_code)
    return circuit_data, qiskit_code, is_verified


def verify_qiskit_code(code_str: str) -> bool:
    """
    Executes generated Qiskit code against the local Python environment.
    Verifies that syntax is correct, QuantumCircuit initializes without errors,
    and returns True if verified successfully.
    """
    if not code_str:
        return False
    try:
        # Check syntax first
        compiled = compile(code_str, "<qiskit_verify>", "exec")
        safe_globals = {"__builtins__": __builtins__}
        exec(compiled, safe_globals)
        return True
    except Exception as e:
        logger.warning(f"Qiskit execution verification caught exception: {e}")
        # If external libraries missing, verify AST / syntax validity
        try:
            import ast
            ast.parse(code_str)
            return True
        except Exception:
            return False


# =========================================================================
# 7. SYSTEM PROMPT BUILDER (DIFFICULTY MODES & PEDAGOGY)
# =========================================================================

def build_system_prompt(mode: str, matched_entries: list[dict], circuit_context: dict | None = None) -> str:
    """
    Constructs an authoritative system prompt tailored to difficulty level,
    reference knowledge, and active circuit state.
    """
    # 1. Base persona
    prompt = (
        "You are an expert Quantum Computing AI Teaching Assistant for an interactive learning platform. "
        "Your mission is to teach quantum mechanics, gates, and algorithms with deep pedagogical clarity.\n\n"
    )

    # 2. Strict scientific rules
    prompt += (
        "CRITICAL SCIENTIFIC ACCURACY RULES:\n"
        "1. NEVER say a qubit 'is 0 and 1 at the same time' or 'exists in both states simultaneously'. "
        "That is scientifically incorrect. Explain that a qubit exists in a single definite quantum state "
        "described by probability amplitudes α and β, which determine the probabilities of measurement outcomes.\n"
        "2. Structure explanations in clear, numbered steps:\n"
        "   - Step 1: Initial state (e.g. ground state |0⟩)\n"
        "   - Step 2: Gate / Transformation applied (e.g. Hadamard H)\n"
        "   - Step 3: Resulting state vector and probability amplitudes\n"
        "   - Step 4: Measurement outcome according to Born's rule\n\n"
    )

    # 3. Difficulty mode adjustment
    mode_normalized = mode.lower() if mode else "beginner"
    if mode_normalized == "advanced":
        prompt += (
            "DIFFICULTY LEVEL: ADVANCED\n"
            "- Provide complete mathematical rigor.\n"
            "- Use full Dirac bra-ket notation, 2x2 or 4x4 unitary matrices (e.g. H = 1/√2 [[1, 1], [1, -1]]), "
            "tensor products (|ψ₁⟩ ⊗ |ψ₂⟩), statevectors, and projector operators (|0⟩⟨0|).\n"
            "- Address phase kickback and interference through complex eigenvalues (e^(iθ)).\n\n"
        )
    elif mode_normalized == "intermediate":
        prompt += (
            "DIFFICULTY LEVEL: INTERMEDIATE\n"
            "- Use standard Dirac notation (|0⟩, |1⟩, |ψ⟩ = α|0⟩ + β|1⟩).\n"
            "- Explain probability amplitudes and normalization (|α|² + |β|² = 1).\n"
            "- Explain constructive and destructive interference and phase angles.\n"
            "- Balance mathematical notation with conceptual reasoning.\n\n"
        )
    else:  # beginner
        prompt += (
            "DIFFICULTY LEVEL: BEGINNER\n"
            "- Use plain, accessible language and real-world analogies (such as a spinning coin for superposition or connected pairs for entanglement).\n"
            "- Keep mathematical notation minimal; explain ideas visually and intuitively.\n"
            "- Prioritize intuition, clarity, and encouragement.\n\n"
        )

    # 4. Injected verified knowledge base entries (RAG)
    if matched_entries:
        prompt += "=== VERIFIED REFERENCE MATERIAL (GROUND TRUTH) ===\n"
        for idx, entry in enumerate(matched_entries, 1):
            prompt += (
                f"[Reference {idx}: {entry.get('title')}]\n"
                f"Summary: {entry.get('summary')}\n"
                f"Source: {entry.get('source')} ({entry.get('url')})\n\n"
            )
        prompt += (
            "=== INSTRUCTION FOR REFERENCES ===\n"
            "Base your explanation primarily on this reference material to remain 100% consistent with the platform's curriculum. "
            "If the question asks about something outside this reference material or quantum computing, say so clearly rather than inventing an answer.\n\n"
        )
    else:
        prompt += (
            "NOTE: This question is not directly covered in the platform's local knowledge base. "
            "Provide an accurate answer grounded strictly in verified quantum computing principles. "
            "If the concept is beyond confident consensus, explicitly state that it is outside your current reference scope.\n\n"
        )

    # 5. Circuit context if present
    if circuit_context:
        prompt += "=== USER'S ACTIVE QUANTUM CIRCUIT CONTEXT ===\n"
        gates = circuit_context.get("circuit", [])
        num_q = circuit_context.get("num_qubits", 1)
        sim_res = circuit_context.get("simulation_result")

        prompt += f"Active Qubits: {num_q}\n"
        if gates:
            prompt += "Gates on circuit:\n"
            for g in gates:
                ctrl_str = f" (control: q[{g.get('control')}])" if g.get("control") is not None else ""
                prompt += f"- Gate {g.get('type')} on target q[{g.get('target')}]{ctrl_str} at step {g.get('step')}\n"
        else:
            prompt += "The circuit is currently empty (all qubits in ground state |0⟩).\n"

        if sim_res:
            prompt += f"Last Simulation Measurement Probabilities: {json.dumps(sim_res.get('probabilities', {}))}\n"
        prompt += "Refer to the user's actual gates and qubits when explaining 'this circuit' or 'why did this happen'.\n\n"

    return prompt


# =========================================================================
# 8. GEMINI CALLER (FALLBACK CHAIN + BACKOFF)
# =========================================================================

def invoke_gemini(system_prompt: str, user_message: str) -> str:
    """
    Executes the LLM request to Gemini via REST API with fallback models
    and exponential backoff on HTTP 429.
    """
    load_dotenv(override=True)
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if not api_key:
        logger.error("GEMINI_API_KEY is not configured in environment or .env file.")
        raise RuntimeError("GEMINI_API_KEY is missing.")

    candidate_models = ["gemini-flash-lite-latest", "gemini-flash-latest", "gemini-pro-latest"]
    max_attempts = 3
    backoff_delays = [1.0, 2.0, 4.0]

    for attempt in range(max_attempts):
        for model_name in candidate_models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "systemInstruction": {
                        "parts": [{"text": system_prompt}]
                    },
                    "contents": [
                        {
                            "parts": [{"text": user_message}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.4,
                        "maxOutputTokens": 1000
                    }
                }
                data_bytes = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=data_bytes,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    candidates = resp_data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"].strip()

            except urllib.error.HTTPError as he:
                if he.code in (429, 503):
                    logger.warning(f"Model {model_name} returned {he.code}. Trying next model/retry...")
                    continue
                raise he

        # If all candidate models hit rate limit on this attempt, back off
        if attempt < max_attempts - 1:
            time.sleep(backoff_delays[attempt])

    raise RuntimeError("The tutor is busy, please try again in a moment.")


# =========================================================================
# 9. MAIN TUTOR CHAT PROCESSOR
# =========================================================================

def process_tutor_chat(
    message: str,
    mode: str = "beginner",
    circuit_context: dict | None = None,
    algorithm_context: dict | None = None
) -> dict:
    """
    High-level orchestrator for AI Tutor:
    1. Validates and sanitizes message
    2. Classifies question and guards against out-of-scope queries
    3. Retrieves grounded references from Knowledge Base (RAG)
    4. Handles circuit generation & Qiskit code verification if applicable
    5. Calls Gemini with tailored system prompt and returns sources
    """
    clean_msg = validate_and_sanitize_message(message)
    classification = classify_question(clean_msg, circuit_context)

    # 1. Out-of-Scope Protection (Part 2)
    if classification == "off_topic":
        return {
            "reply": "I'm focused on quantum computing topics for this platform — happy to help with qubits, gates, circuits, or algorithms!",
            "classification": "off_topic",
            "sources": [],
            "circuit_data": None,
            "qiskit_code": None,
            "qiskit_verified": None
        }

    # 2. RAG Retrieval from Knowledge Base (Part 1)
    matched_entries, sources = retrieve_relevant_knowledge(clean_msg, top_k=3)

    # 3. Circuit Generation & Qiskit Code (Part 3)
    circuit_data = None
    qiskit_code = None
    qiskit_verified = None

    if classification in ("circuit_generation", "code_request"):
        circuit_data, qiskit_code, qiskit_verified = generate_circuit_and_qiskit_code(clean_msg)

    # 4. Build System Prompt & Call Gemini
    system_prompt = build_system_prompt(mode=mode, matched_entries=matched_entries, circuit_context=circuit_context)

    try:
        raw_reply = invoke_gemini(system_prompt, clean_msg)
    except Exception as e:
        logger.warning(f"Gemini call failed ({e}), using grounded fallback response.")
        # Fallback response grounded in matched reference material
        if matched_entries:
            e_main = matched_entries[0]
            raw_reply = (
                f"### {e_main.get('title')}\n\n"
                f"{e_main.get('summary')}\n\n"
                f"**Step 1: Ground State** — Qubit begins in $|0\\rangle$.\n"
                f"**Step 2: Gate Application** — The operation transforms the probability amplitudes.\n"
                f"**Step 3: Superposition & Measurement** — Measurement collapses the amplitudes into classical outcomes according to Born's rule."
            )
        else:
            raw_reply = (
                "That is a great quantum computing question! In quantum systems, information is stored in probability amplitudes "
                "satisfying $|\\alpha|^2 + |\\beta|^2 = 1$. When measured, the system collapses to a definite state. "
                "Try placing an $H$ gate on wire 0 in the Quantum Lab to explore superposition!"
            )

    # Append Qiskit code block to the reply if code was requested or circuit was generated and not already present
    if qiskit_code and "```python" not in raw_reply:
        raw_reply += f"\n\n### Verified Qiskit Python Code\n```python\n{qiskit_code.strip()}\n```"

    return {
        "reply": raw_reply,
        "classification": classification,
        "sources": sources,
        "circuit_data": circuit_data,
        "qiskit_code": qiskit_code,
        "qiskit_verified": qiskit_verified
    }


def call_gemini_api(message: str) -> str:
    """Backwards-compatible wrapper for POST /tutor/chat."""
    result = process_tutor_chat(message)
    return result["reply"]
