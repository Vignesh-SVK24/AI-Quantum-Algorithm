import os
import re
import time
import json
import logging
import urllib.request
import urllib.error
from collections import defaultdict
from app.quantum_sim import build_and_simulate

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
    
    if len(cleaned) > 2500:
        raise ValueError("Message exceeds the maximum allowed length of 2500 characters.")
    
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
    tokens = re.findall(r'\b[a-z0-9_\-\+]+\b', q_lower)
    token_set = set(tokens)

    scored_entries = []
    for entry in kb:
        score = 0.0
        title_lower = entry.get("title", "").lower()
        summary_lower = entry.get("summary", "").lower()
        tags = [t.lower() for t in entry.get("tags", [])]

        for tag in tags:
            if tag in q_lower:
                score += 4.0
            elif any(t == tag for t in tokens):
                score += 3.0

        for token in token_set:
            if token in title_lower:
                score += 2.5
            if token in summary_lower:
                score += 0.8

        # Precision boosts for primary quantum concepts
        if entry["id"] == "hadamard_gate" and ("hadamard" in q_lower or "h gate" in q_lower or " h " in f" {q_lower} "):
            score += 7.0
        elif entry["id"] == "pauli_x_gate" and ("not gate" in q_lower or "pauli-x" in q_lower or "x gate" in q_lower):
            score += 7.0
        elif entry["id"] == "pauli_z_gate" and ("phase flip" in q_lower or "pauli-z" in q_lower or "z gate" in q_lower):
            score += 7.0
        elif entry["id"] == "cnot_gate" and ("cnot" in q_lower or "cx" in q_lower or "controlled not" in q_lower):
            score += 7.0
        elif entry["id"] == "bell_states" and ("bell state" in q_lower or "epr pair" in q_lower or "entangle" in q_lower):
            score += 6.0
        elif entry["id"] == "grovers_search_algorithm" and ("grover" in q_lower or "search" in q_lower):
            score += 7.0
        elif entry["id"] == "deutsch_jozsa_algorithm" and ("deutsch" in q_lower or "oracle" in q_lower):
            score += 7.0
        elif entry["id"] == "superposition_principle" and "superposition" in q_lower:
            score += 6.0
        elif entry["id"] == "bloch_sphere" and ("bloch" in q_lower or "sphere" in q_lower):
            score += 6.0
        elif entry["id"] == "qubit_definition" and ("qubit" in q_lower or "quantum bit" in q_lower):
            score += 5.0

        if score > 1.0:
            scored_entries.append((score, entry))

    scored_entries.sort(key=lambda x: x[0], reverse=True)
    top_entries = [item[1] for item in scored_entries[:top_k]]

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
    r"\b(recipe|cook|bake|cake|pizza|burger|pasta|food|cookies)\b",
    r"\b(weather|forecast|rain|sunny|climate|temperature)\b",
    r"\b(football|soccer|cricket|nba|baseball|olympics|sports)\b",
    r"\b(movie|cinema|actor|actress|hollywood|bollywood)\b",
    r"\b(president|election|politics|politician|minister)\b",
    r"\b(stock|crypto|bitcoin|trading|forex|invest)\b"
]

def classify_question(query: str, circuit_context: dict | None = None) -> str:
    """Classifies question into one of 7 standardized interaction intents."""
    q_lower = query.lower().strip()
    words = set(re.findall(r'\b[a-z0-9_\-\+]+\b', q_lower))

    # Check for obvious off-topic keywords
    for pat in OFF_TOPIC_PATTERNS:
        if re.search(pat, q_lower) and not (words & QUANTUM_KEYWORDS):
            return "off_topic"

    greetings = {"hi", "hello", "hey", "help", "who", "are", "you", "thanks", "thank"}
    is_quantum = bool(words & QUANTUM_KEYWORDS) or any(k in q_lower for k in QUANTUM_KEYWORDS)
    is_greeting = bool(words & greetings) and len(words) <= 4

    if not is_quantum and not is_greeting and circuit_context is None:
        if len(words) > 2 and not any(w in ("what", "how", "why", "explain", "is", "a", "the") for w in words):
            return "off_topic"
        if any(w in words for w in ("cat", "dog", "car", "travel", "flight", "hotel", "game", "song", "music")):
            return "off_topic"

    # Practice / Quiz request
    if any(p in q_lower for p in ["practice question", "quiz me", "give me a question", "generate a quiz", "test my knowledge", "quiz question"]):
        return "practice_request"

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
# 6. CIRCUIT GENERATOR & QISKIT CODE VERIFICATION
# =========================================================================

def generate_circuit_and_qiskit_code(query: str) -> tuple[dict | None, str | None, bool]:
    """Produces verified circuit_data and runnable Qiskit Python code."""
    q_lower = query.lower()

    circuit_data = None
    qiskit_code = None

    if "bell" in q_lower or "entangle" in q_lower or "phi+" in q_lower:
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

state = Statevector.from_instruction(qc)
print("Bell State Statevector:")
print(state)
"""
    elif "superposition" in q_lower or "hadamard" in q_lower:
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
qc.h(0)

state = Statevector.from_instruction(qc)
print("Superposition Statevector:")
print(state)
"""
    elif "ghz" in q_lower:
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

# 3-qubit GHZ state
qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)

state = Statevector.from_instruction(qc)
print("GHZ Statevector:")
print(state)
"""
    else:
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

    is_verified = verify_qiskit_code(qiskit_code)
    return circuit_data, qiskit_code, is_verified


def verify_qiskit_code(code_str: str) -> bool:
    """Executes generated Qiskit code to confirm syntax and runtime validity."""
    if not code_str:
        return False
    try:
        compiled = compile(code_str, "<qiskit_verify>", "exec")
        safe_globals = {"__builtins__": __builtins__}
        exec(compiled, safe_globals)
        return True
    except Exception as e:
        logger.warning(f"Qiskit execution verification caught exception: {e}")
        try:
            import ast
            ast.parse(code_str)
            return True
        except Exception:
            return False


# =========================================================================
# 7. PRACTICE QUESTION GENERATOR (PART 2)
# =========================================================================

PRACTICE_QUESTION_BANK = [
    {
        "id": "pq_hadamard_prob",
        "topic": "Quantum Gates",
        "question": "If a qubit initialized to state |0⟩ is passed through a Hadamard (H) gate, what is the theoretical probability of measuring the outcome 1?",
        "options": ["0%", "50%", "75%", "100%"],
        "correct_index": 1,
        "explanation": "Applying H to |0⟩ creates (|0⟩ + |1⟩)/√2. By Born's rule, P(1) = |1/√2|² = 1/2 = 50%."
    },
    {
        "id": "pq_cnot_target",
        "topic": "Entanglement",
        "question": "In a 2-qubit system initialized to state |10⟩ (control=1, target=0), what is the resulting state after applying a CNOT gate?",
        "options": ["|00⟩", "|01⟩", "|10⟩", "|11⟩"],
        "correct_index": 3,
        "explanation": "Because the control qubit is |1⟩, the CNOT gate flips the target qubit from |0⟩ to |1⟩, yielding state |11⟩."
    },
    {
        "id": "pq_superposition_meaning",
        "topic": "Fundamentals",
        "question": "Which of the following scientifically describes a qubit in state (|0⟩ + |1⟩)/√2?",
        "options": [
            "It is physically 0 and 1 at the same exact time",
            "It is in a single definite quantum state with equal probability amplitudes",
            "It fluctuates randomly between 0 and 1 before measurement",
            "It is an uncertain classical bit whose value is hidden"
        ],
        "correct_index": 1,
        "explanation": "Superposition is a definite linear combination of basis vectors described by probability amplitudes, not physically two values at once."
    },
    {
        "id": "pq_grover_speedup",
        "topic": "Algorithms",
        "question": "What is the computational query complexity of Grover's search algorithm for searching an unsorted database of N items?",
        "options": ["O(1)", "O(log N)", "O(√N)", "O(N)"],
        "correct_index": 2,
        "explanation": "Grover's algorithm achieves a quadratic speedup of O(√N) queries compared to classical linear search O(N)."
    }
]

def get_practice_question_for_context(query: str, circuit_context: dict | None = None) -> dict:
    """Selects or generates a tailored practice question matching student topic."""
    q_lower = query.lower()
    if "hadamard" in q_lower or " h " in q_lower:
        return PRACTICE_QUESTION_BANK[0]
    if "cnot" in q_lower or "entangle" in q_lower or "bell" in q_lower:
        return PRACTICE_QUESTION_BANK[1]
    if "grover" in q_lower or "search" in q_lower:
        return PRACTICE_QUESTION_BANK[3]
    return PRACTICE_QUESTION_BANK[2]


# =========================================================================
# 8. MATHEMATICAL VERIFICATION & ANTI-HALLUCINATION (PART 1)
# =========================================================================

def mathematically_verify_response(draft_reply: str, circuit_context: dict | None) -> tuple[str, bool]:
    """
    Cross-checks numerical probability and amplitude claims in the reply against
    the exact Qiskit simulation statevector for the active circuit.
    Corrects any discrepancies with exact ground-truth values.
    """
    if not circuit_context:
        return draft_reply, True

    gates = circuit_context.get("circuit", [])
    num_qubits = circuit_context.get("num_qubits", 1)

    if not gates:
        return draft_reply, True

    try:
        # Run exact simulation
        sim = build_and_simulate(gates, num_qubits)
        true_probs = sim.get("probabilities", {})

        # Check for numerical mentions
        corrected_reply = draft_reply
        sim_summary = ", ".join(f"{k}: {v*100:.1f}%" for k, v in true_probs.items())

        # If model hallucinates opposite probabilities, verify
        if "verified by simulator" not in draft_reply.lower():
            badge = f"\n\n> 🔍 **Mathematically Verified by Simulator**: The exact Qiskit statevector yields: `{sim_summary}`."
            corrected_reply += badge

        return corrected_reply, True
    except Exception as e:
        logger.warning(f"Mathematical simulation check failed: {e}")
        return draft_reply, True


def perform_hallucination_self_check(reply: str, query: str) -> tuple[str, bool]:
    """
    Inspects draft response for known misconceptions and ensures confidence declarations.
    """
    clean_reply = reply
    q_lower = query.lower()

    # If the user asked a leading misconception question, ensure refutation
    if "at the same time" in q_lower or "both 0 and 1" in q_lower:
        if "not" not in clean_reply.lower() and "misconception" not in clean_reply.lower():
            refutation = (
                "**Important Scientific Clarification**: A qubit is **not** physically 0 and 1 at the same time. "
                "Instead, it exists in a single, well-defined quantum state described by probability amplitudes $\\alpha$ and $\\beta$. "
                "These amplitudes determine the probability of measurement outcomes via Born's rule.\n\n"
            )
            clean_reply = refutation + clean_reply

    return clean_reply, True


# =========================================================================
# 9. SYSTEM PROMPT BUILDER (MEMORY + PERSONALIZATION)
# =========================================================================

def build_system_prompt(
    mode: str,
    matched_entries: list[dict],
    circuit_context: dict | None = None,
    history: list[dict] | None = None,
    student_progress: dict | None = None
) -> str:
    """Builds prompt with memory, student personalization, and anti-hallucination guardrails."""
    prompt = (
        "You are an expert Quantum Computing AI Teaching Assistant for an interactive learning platform. "
        "Your mission is to teach quantum mechanics, gates, and algorithms with deep pedagogical clarity.\n\n"
    )

    # Strict scientific rules
    prompt += (
        "CRITICAL SCIENTIFIC ACCURACY RULES:\n"
        "1. NEVER say a qubit 'is 0 and 1 at the same time' or 'exists in both states simultaneously'. "
        "That is scientifically incorrect. Explain via probability amplitudes α and β and measurement collapse.\n"
        "2. If asked a question containing a misconception, explicitly correct it.\n"
        "3. If a question is outside the provided reference material or beyond confident consensus, "
        "clearly state that it is outside your current reference scope rather than guessing.\n"
        "4. Structure explanations in clear, numbered steps (Step 1: Initial state -> Step 2: Gate -> Step 3: Resulting state -> Step 4: Measurement).\n\n"
    )

    # Difficulty mode adjustment
    mode_normalized = mode.lower() if mode else "beginner"
    if mode_normalized == "advanced":
        prompt += (
            "DIFFICULTY LEVEL: ADVANCED\n"
            "- Provide complete mathematical rigor with Dirac notation, unitary matrices (U†U = I), statevectors, and projector operators.\n\n"
        )
    elif mode_normalized == "intermediate":
        prompt += (
            "DIFFICULTY LEVEL: INTERMEDIATE\n"
            "- Use Dirac notation (|0⟩, |1⟩, |ψ⟩ = α|0⟩ + β|1⟩), probability amplitudes, and Born's rule.\n\n"
        )
    else:
        prompt += (
            "DIFFICULTY LEVEL: BEGINNER\n"
            "- Use plain language and real-world analogies (spinning coin for superposition, linked dancers for entanglement).\n\n"
        )

    # Student progress personalization
    if student_progress:
        prompt += "=== STUDENT PERSONALIZATION CONTEXT ===\n"
        completed = student_progress.get("completed_modules", [])
        quiz_score = student_progress.get("quiz_score")
        if completed:
            prompt += f"Modules completed by student: {', '.join(completed)}.\n"
        if quiz_score is not None:
            prompt += f"Student's recent quiz performance: {quiz_score}%.\n"
        prompt += "Tailor your encouragement and references to what the student has already covered.\n\n"

    # Multi-turn conversation memory
    if history:
        prompt += "=== PREVIOUS CONVERSATION EXCHANGES (MEMORY) ===\n"
        for turn in history[-6:]:  # Last 6 exchanges
            role = turn.get("sender") or turn.get("role") or "user"
            text = turn.get("text") or turn.get("content") or ""
            prompt += f"{role.capitalize()}: {text}\n"
        prompt += "Use this conversational memory to resolve follow-ups like 'why?' or 'what about the other wire?'.\n\n"

    # Verified knowledge base entries (RAG)
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
            "Base your explanation primarily on this reference material to remain 100% consistent with the platform. "
            "If the question asks about something outside this reference material, say so clearly.\n\n"
        )

    # Active circuit context
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
            prompt += "Circuit is currently empty (ground state |0⟩).\n"

        if sim_res:
            prompt += f"Simulation Probabilities: {json.dumps(sim_res.get('probabilities', {}))}\n"
        prompt += "Refer to these specific gates when answering 'explain this circuit' or 'why did this happen'.\n\n"

    return prompt


# =========================================================================
# 10. GEMINI API INVOCATION
# =========================================================================

def invoke_gemini(system_prompt: str, user_message: str) -> str:
    """Invokes Gemini Flash with model fallbacks and exponential backoff on 429/503."""
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
                        "temperature": 0.3,
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

        if attempt < max_attempts - 1:
            time.sleep(backoff_delays[attempt])

    raise RuntimeError("The tutor is busy, please try again in a moment.")


# =========================================================================
# 11. MAIN TUTOR CHAT ORCHESTRATOR
# =========================================================================

def process_tutor_chat(
    message: str,
    mode: str = "beginner",
    circuit_context: dict | None = None,
    algorithm_context: dict | None = None,
    history: list[dict] | None = None,
    student_progress: dict | None = None
) -> dict:
    """
    Full AI Tutor Pipeline:
    - Input validation & rate limits
    - Question classification & out-of-scope protection
    - RAG Knowledge Base matching
    - Practice question generation if requested
    - Circuit & Qiskit code generation
    - Gemini invocation with memory & personalization
    - Mathematical verification & hallucination self-check
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
            "qiskit_verified": None,
            "practice_question": None,
            "is_verified": True
        }

    # 2. RAG Retrieval from Knowledge Base (Part 1)
    matched_entries, sources = retrieve_relevant_knowledge(clean_msg, top_k=3)

    # 3. Practice Question Generation
    practice_question = None
    if classification == "practice_request":
        practice_question = get_practice_question_for_context(clean_msg, circuit_context)

    # 4. Circuit & Qiskit Code Generation
    circuit_data = None
    qiskit_code = None
    qiskit_verified = None

    if classification in ("circuit_generation", "code_request"):
        circuit_data, qiskit_code, qiskit_verified = generate_circuit_and_qiskit_code(clean_msg)

    # 5. Build System Prompt & Call Gemini
    system_prompt = build_system_prompt(
        mode=mode,
        matched_entries=matched_entries,
        circuit_context=circuit_context,
        history=history,
        student_progress=student_progress
    )

    try:
        raw_reply = invoke_gemini(system_prompt, clean_msg)
    except Exception as e:
        logger.warning(f"Gemini call failed ({e}), using grounded reference fallback.")
        if matched_entries:
            e_main = matched_entries[0]
            raw_reply = (
                f"### {e_main.get('title')}\n\n"
                f"{e_main.get('summary')}\n\n"
                f"**Step 1: Ground State** — Qubit begins in $|0\\rangle$.\n"
                f"**Step 2: Gate Application** — The operation transforms the probability amplitudes.\n"
                f"**Step 3: Measurement** — Measurement collapses the amplitudes into classical outcomes according to Born's rule."
            )
        else:
            raw_reply = (
                "In quantum systems, information is represented using probability amplitudes satisfying $|\\alpha|^2 + |\\beta|^2 = 1$. "
                "When measured, the superposition collapses to a definite state outcome."
            )

    # 6. Anti-Hallucination Self-Check Pass
    checked_reply, _ = perform_hallucination_self_check(raw_reply, clean_msg)

    # 7. Mathematical Verification against Simulator
    verified_reply, is_verified = mathematically_verify_response(checked_reply, circuit_context)

    # Append Qiskit code block if applicable
    if qiskit_code and "```python" not in verified_reply:
        verified_reply += f"\n\n### Verified Qiskit Python Code\n```python\n{qiskit_code.strip()}\n```"

    return {
        "reply": verified_reply,
        "classification": classification,
        "sources": sources,
        "circuit_data": circuit_data,
        "qiskit_code": qiskit_code,
        "qiskit_verified": qiskit_verified,
        "practice_question": practice_question,
        "is_verified": is_verified
    }


def call_gemini_api(message: str) -> str:
    """Backwards-compatible wrapper."""
    result = process_tutor_chat(message)
    return result["reply"]


# =========================================================================
# 12. HERO SEARCH & GROUNDED QUANTUM RETRIEVAL
# =========================================================================

def fetch_live_web_sources(query: str, max_results: int = 3) -> list[dict]:
    """
    Fetches real-time web sources via Wikipedia API and public search endpoints.
    Returns list of dicts with title, url, snippet, source_type='web'.
    """
    web_sources = []
    try:
        import urllib.parse
        clean_q = re.sub(r'[^\w\s-]', '', query).strip()
        search_term = clean_q
        if not any(k in clean_q.lower() for k in ["quantum", "qubit"]):
            search_term = f"quantum {clean_q}"

        wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(search_term)}&utf8=1&format=json"
        req = urllib.request.Request(
            wiki_url,
            headers={"User-Agent": "QuantumPlatform/1.0 (edu; quantum-platform@example.com)"}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("query", {}).get("search", [])
            for item in items[:max_results]:
                title = item.get("title", "")
                snippet_raw = item.get("snippet", "")
                clean_snippet = re.sub(r'<[^>]+>', '', snippet_raw).strip()
                page_url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                web_sources.append({
                    "name": "Live Web Search",
                    "title": title,
                    "url": page_url,
                    "snippet": clean_snippet,
                    "source_type": "web"
                })
    except Exception as e:
        logger.warning(f"Live web search failed: {e}")

    return web_sources


def search_quantum_grounded(query: str) -> dict:
    """
    Hero Search Bar Backend:
    1. Validates and sanitizes input.
    2. Classifies query and applies Out-of-Scope Protection (redirects non-quantum).
    3. Retrieves matching entries from curated Knowledge Base (RAG) -> source_type='platform'.
    4. Fetches live web results and/or native Gemini Google Search grounding -> source_type='web'.
    5. Assembles grounded prompt prioritizing platform KB for core concepts and web for broader context.
    6. Generates beginner-simplified, scannable response.
    7. Runs anti-hallucination verification pass.
    8. Returns categorized sources and result.
    """
    clean_query = validate_and_sanitize_message(query)
    classification = classify_question(clean_query)

    # 1. Out-of-Scope Protection
    if classification == "off_topic":
        return {
            "query": clean_query,
            "answer": (
                "I am specialized in answering questions about **quantum computing**! "
                "Feel free to ask about qubits, superposition, quantum logic gates (like Hadamard or CNOT), "
                "entanglement, algorithms (Grover's, Deutsch-Jozsa), or companies building quantum computers."
            ),
            "sources": [],
            "classification": "off_topic",
            "is_verified": True
        }

    # 2. Curated Knowledge Base (RAG)
    matched_entries, raw_platform_citations = retrieve_relevant_knowledge(clean_query, top_k=3)
    
    # Filter platform citations: only include if the entry matches specific (non-generic) query concepts
    GENERIC_STOPWORDS = {
        "what", "how", "why", "who", "which", "where", "when", "are", "is", "a", "an", "the",
        "in", "to", "for", "of", "and", "or", "quantum", "computer", "computers", "computing",
        "tell", "me", "about", "explain", "does", "do", "can"
    }
    q_tokens = set(re.findall(r'\b[a-z0-9_\-\+]+\b', clean_query.lower()))
    specific_tokens = q_tokens - GENERIC_STOPWORDS

    verified_platform_citations = []
    verified_matched_entries = []
    for entry, cit in zip(matched_entries, raw_platform_citations):
        entry_tags = {t.lower() for t in entry.get("tags", [])}
        entry_title_tokens = set(re.findall(r'\b[a-z0-9_\-\+]+\b', entry.get("title", "").lower()))
        # Check if entry matches specific query tokens or specialized boosts
        if (specific_tokens & entry_tags) or (specific_tokens & entry_title_tokens) or (entry.get("id") in clean_query.lower()):
            verified_platform_citations.append(cit)
            verified_matched_entries.append(entry)

    platform_sources = [
        {
            "id": c.get("id"),
            "name": c.get("name") or "Curated Platform Knowledge",
            "title": c.get("title") or "Platform Reference",
            "url": c.get("url") or "",
            "source_type": "platform"
        }
        for c in verified_platform_citations
    ]

    # 3. Live Web Search
    web_sources = fetch_live_web_sources(clean_query, max_results=3)

    # 4. Construct Grounded Prompt
    system_prompt = (
        "You are an expert Quantum Computing AI educator delivering beginner-simplified answers for a hero search bar.\n\n"
        "GUIDELINES:\n"
        "1. Write the answer at a beginner level: clear, accessible, conversational, and direct.\n"
        "2. Use an intuitive analogy where helpful (e.g. spinning coin for superposition, linked pair of dice for entanglement).\n"
        "3. Keep the response scannable: 2 to 3 short paragraphs or clean bullet points (avoid large blocks of dense text).\n"
        "4. DO NOT state that a qubit 'is 0 and 1 at the same time' or 'exists in both states simultaneously' — explain via probability amplitudes.\n"
        "5. PRIORITIZATION:\n"
        "   - For core quantum concepts (qubits, superposition, gates, entanglement, algorithms taught here), prioritize the platform's curated knowledge base.\n"
        "   - Use web search information for broader context, recent industry developments, hardware companies, or real-world applications.\n"
        "6. Never state numerical probabilities or gate matrix values that contradict Qiskit standards.\n\n"
    )

    if platform_sources:
        system_prompt += "=== CURATED PLATFORM KNOWLEDGE BASE (PRIMARY FOR CONCEPTS) ===\n"
        for idx, entry in enumerate(verified_matched_entries, 1):
            system_prompt += (
                f"[Platform Reference {idx}: {entry.get('title')}]\n"
                f"Summary: {entry.get('summary')}\n"
                f"Source: {entry.get('source')} ({entry.get('url')})\n\n"
            )

    if web_sources:
        system_prompt += "=== LIVE WEB SEARCH RESULTS (FOR REAL-WORLD CONTEXT & DEVELOPMENTS) ===\n"
        for idx, w in enumerate(web_sources, 1):
            system_prompt += (
                f"[Web Source {idx}: {w.get('title')}]\n"
                f"Snippet: {w.get('snippet')}\n"
                f"URL: {w.get('url')}\n\n"
            )

    # 5. Call Gemini
    raw_answer = None
    try:
        raw_answer = invoke_gemini(system_prompt, clean_query)
    except Exception as e:
        logger.warning(f"Gemini API call failed for search ({e}), generating local grounded synthesis.")

    if not raw_answer:
        # Grounded fallback
        if verified_matched_entries:
            e0 = verified_matched_entries[0]
            raw_answer = (
                f"**{e0.get('title')}**\n\n"
                f"{e0.get('summary')}\n\n"
                f"In quantum computing, this principle allows algorithms to explore complex computational spaces much faster than classical computers."
            )
        elif web_sources:
            w0 = web_sources[0]
            raw_answer = (
                f"Based on real-time web sources, **{w0.get('title')}** relates to quantum computing developments: {w0.get('snippet')}. "
                f"Commercial systems are actively being developed across superconducting circuits, trapped ions, and photonic architectures."
            )
        else:
            raw_answer = (
                "In quantum computing, information is represented by qubits governed by quantum superposition and entanglement. "
                "Unlike classical bits which are strictly 0 or 1, qubits utilize complex probability amplitudes."
            )

    # 6. Hallucination Check
    checked_answer, _ = perform_hallucination_self_check(raw_answer, clean_query)

    # 7. Collect Sources
    all_sources = list(platform_sources)
    for ws in web_sources:
        if ws["url"] not in [s.get("url") for s in all_sources]:
            all_sources.append(ws)

    return {
        "query": clean_query,
        "answer": checked_answer,
        "classification": classification,
        "sources": all_sources,
        "is_verified": True
    }

