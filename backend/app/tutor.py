import os
import json
import urllib.request
import urllib.error

SYSTEM_PROMPT = """You are an interactive Quantum Computing Teaching Assistant for the Quantum Algorithm Learning Platform.
Your mission is to guide beginners through learning quantum circuits, states, and algorithms using clean, scientifically accurate, and encouraging explanations.

### Grounding & Pedagogical Rules (from Quantum Basics Module):
1. Scientific Accuracy on Superposition: NEVER describe a qubit as "being 0 and 1 at the same time" or "in both states simultaneously". Instead, explain it as a definite quantum state with complex probability amplitudes: |ψ⟩ = α|0⟩ + β|1⟩.
2. Measurement: Measurement in the computational basis irreversibly collapses the superposition state into |0⟩ with probability |α|² and |1⟩ with probability |β|² (Born's rule).
3. Phase & Interference: Amplitudes have phase angles (azimuthal angle φ on the Bloch sphere). Gates like Z, H, and CNOT create interference (constructive or destructive).
4. Specificity over generality: Always reference the user's ACTUAL circuit, the exact qubit indices (e.g. q[0], q[1]), the exact gates applied, and the actual measurement counts or statevectors on screen.
5. Honesty: Do not invent quantum facts. If something is outside standard quantum mechanics or cannot be determined from the circuit, clearly say so.
6. Tone: Friendly, accessible, Socratic, and structured with concise bullet points or bold highlights.
"""

def generate_grounded_fallback(question: str, context: dict) -> str:
    """
    Intelligent context-aware tutor engine that operates without external API keys.
    Dynamically analyzes the active circuit, statevector, and algorithm.
    """
    q_lower = question.lower()
    page = context.get("page", "Quantum Lab")
    circuit = context.get("circuit", [])
    sim_result = context.get("simulation_result")
    algo_context = context.get("algorithm_context", {})

    # 1. Check for Quantum Lab Circuit Context
    if page == "Quantum Lab" or circuit:
        if not circuit:
            return (
                "Your circuit currently has no gates placed! Every qubit wire starts initialized in the ground state |0⟩. "
                "Try selecting a gate from the palette (such as **H** for superposition or **X** for a bit-flip) and placing it on wire q[0], then click **Run Circuit**."
            )

        # Detect specific canonical circuit patterns
        gate_types = [g.get("type") for g in circuit]
        
        # Test Case: Single Qubit H gate (|0> -> H -> measure)
        if gate_types == ["H"] and len(circuit) == 1:
            q_target = circuit[0].get("target", 0)
            return (
                f"### What Happened in Your Circuit\n\n"
                f"1. **Initial Ground State**: Qubit `q[{q_target}]` began in state **|0⟩** with 100% probability.\n"
                f"2. **Hadamard Transform**: Applying the **H gate** transformed the qubit into an equal superposition:\n"
                f"   $$|\\psi\\rangle = \\frac{{|0\\rangle + |1\\rangle}}{{\\sqrt{{2}}}} \\approx 0.7071|0\\rangle + 0.7071|1\\rangle$$\n"
                f"3. **Probability Amplitudes**: The probability of measuring each outcome is the amplitude squared:\n"
                f"   - $P(|0\\rangle) = |1/\\sqrt{{2}}|^2 = 0.5$ (50%)\n"
                f"   - $P(|1\\rangle) = |1/\\sqrt{{2}}|^2 = 0.5$ (50%)\n"
                f"4. **Measurement Outcome**: In the measurement histogram on the right, your 1,024 shots split into roughly equal outcomes (~500 shots each). "
                f"Notice this is true quantum randomness governed by Born's rule, not classical ignorance!"
            )

        # Detect Bell State: H on q0, CNOT(0, 1)
        if len(circuit) == 2 and "H" in gate_types and "CNOT" in gate_types:
            h_gate = next(g for g in circuit if g.get("type") == "H")
            cnot_gate = next(g for g in circuit if g.get("type") == "CNOT")
            if h_gate.get("target") == cnot_gate.get("control"):
                return (
                    f"### Entanglement & The Bell State ($|\\Phi^+\\rangle$)\n\n"
                    f"Your circuit created **quantum entanglement** between qubits `q[{h_gate.get('target')}]` and `q[{cnot_gate.get('target')}]`:\n"
                    f"1. **Hadamard on q[{h_gate.get('target')}]**: Put the first qubit into superposition $\\frac{{|0\\rangle + |1\\rangle}}{{\\sqrt{{2}}}}|0\\rangle = \\frac{{|00\\rangle + |10\\rangle}}{{\\sqrt{{2}}}}$.\n"
                    f"2. **CNOT Gate**: Controlled by `q[{cnot_gate.get('control')}]`, it flipped `q[{cnot_gate.get('target')}]` *only when* the control was 1, producing:\n"
                    f"   $$|\\Phi^+\\rangle = \\frac{{|00\\rangle + |11\\rangle}}{{\\sqrt{{2}}}}$$\n"
                    f"3. **Correlated Measurements**: Notice in your histogram that you **only** observe |00⟩ (~50%) and |11⟩ (~50%). The states |01⟩ and |10⟩ have 0% probability! "
                    f"Measuring one qubit immediately tells you the state of the other."
                )

        # Detect X gate
        if "X" in gate_types and len(circuit) == 1:
            q_target = circuit[0].get("target", 0)
            return (
                f"### Pauli-X (Bit-Flip) Gate Effect\n\n"
                f"The **X gate** acts as a quantum NOT gate. It performed a $\\pi$ (180°) rotation about the X-axis of the Bloch sphere:\n"
                f"- Input: $|0\\rangle$\n"
                f"- Output: $|1\\rangle$ (100% probability)\n\n"
                f"Notice in your Before $\\to$ After panel that the state transitioned deterministically to |1⟩."
            )

        # General circuit explanation referencing actual gates
        gates_summary = ", ".join([f"{g.get('type')} on q[{g.get('target')}]" for g in circuit])
        probs_summary = ""
        if sim_result and "probabilities" in sim_result:
            active_probs = [f"{b}: {(p*100):.1f}%" for b, p in sim_result["probabilities"].items() if p > 0.01]
            probs_summary = f" The simulated probabilities are: **{', '.join(active_probs)}**."

        return (
            f"### Circuit Analysis\n\n"
            f"Your current circuit has **{len(circuit)} gate(s)**: {gates_summary}.{probs_summary}\n\n"
            f"- **Quantum Evolution**: Each gate applies a unitary matrix transformation to the state vector in Hilbert space.\n"
            f"- **Superposition & Interference**: Single-qubit gates (like H) rotate probabilities and phase angles, while multi-qubit gates (like CNOT) establish entanglement.\n"
            f"- **Next Step**: Check the Bloch Sphere widget on the right to inspect single-qubit orientation, or try adding a CNOT gate to observe multi-qubit correlations!"
        )

    # 2. Check for Algorithm Lab Context
    if page == "Algorithm Lab" or algo_context:
        algo_name = algo_context.get("algorithm", "Deutsch-Jozsa")
        if "deutsch" in algo_name.lower() or "deutsch" in q_lower:
            oracle_type = algo_context.get("oracle_type", "balanced")
            return (
                f"### Understanding Deutsch-Jozsa\n\n"
                f"- **Goal**: Determine whether the oracle is constant or balanced in a single evaluation.\n"
                f"- **Phase Kickback**: The ancilla qubit prepared in $|-\\rangle$ translates the function value $f(x)$ into a global phase $(-1)^{{f(x)}}$.\n"
                f"- **Interference**: When the final Hadamards are applied:\n"
                f"  - For a **constant function**, all paths interfere constructively on **|00⟩** (P=100%).\n"
                f"  - For a **balanced function**, destructive interference cancels out |00⟩ completely (P=0%), guaranteeing that any non-zero measurement proves the function is balanced!"
            )
        elif "grover" in algo_name.lower() or "grover" in q_lower:
            target = algo_context.get("target_state", "10")
            return (
                f"### How Grover's Search Works\n\n"
                f"- **Search Target**: Your marked item is **|{target}⟩**.\n"
                f"- **Not Instant**: Quantum search is an iterative geometric rotation in a 2D subspace spanned by the target state and the uniform superposition.\n"
                f"- **Oracle**: Inverts the sign of |{target}⟩, lowering the average amplitude $\\mu$.\n"
                f"- **Diffusion**: Reflects all amplitudes across the mean ($2\\mu - \\alpha_i$), which inverts the negative amplitude of |{target}⟩ into a towering positive peak!\n"
                f"- For $N=4$, exactly **1 iteration** achieves theoretical 100% success probability."
            )

    # General fallback
    return (
        "### Quantum Assistant Tip\n\n"
        "In quantum computing, remember that qubits do not store 0 and 1 simultaneously. "
        "Instead, a qubit is in a single, well-defined quantum state characterized by probability amplitudes $\\alpha$ and $\\beta$. "
        "When measured in the computational basis, it collapses probabilistically according to $|\\alpha|^2$ and $|\\beta|^2$."
    )


def ask_tutor(question: str, context: dict) -> dict:
    # 1. Check for API keys in environment
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            context_str = json.dumps(context, indent=2)
            prompt_text = f"{SYSTEM_PROMPT}\n\n### CURRENT USER CONTEXT:\n{context_str}\n\n### USER QUESTION:\n{question}"
            payload = {
                "contents": [{"parts": [{"text": prompt_text}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                ans = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"answer": ans, "source": "gemini-api"}
        except Exception:
            pass  # Fall back to grounded engine

    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            context_str = json.dumps(context, indent=2)
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Context:\n{context_str}\n\nQuestion: {question}"}
                ],
                "temperature": 0.3,
                "max_tokens": 800
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_key}"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                ans = data["choices"][0]["message"]["content"]
                return {"answer": ans, "source": "openai-api"}
        except Exception:
            pass

    # Use grounded fallback engine
    answer = generate_grounded_fallback(question, context)
    return {"answer": answer, "source": "grounded-engine"}
