import json
import logging
from typing import Any
from app.gemini_tutor import invoke_gemini, retrieve_relevant_knowledge, load_knowledge_base

logger = logging.getLogger("circuit_analyzer")


def analyze_circuit_structure(gates: list[dict], num_qubits: int, sim_result: dict | None = None) -> dict:
    """
    Inspects actual quantum circuit gates, detects cancellations, issues,
    multi-qubit entanglement, and extracts chronological gate actions.
    """
    sorted_gates = sorted(gates, key=lambda g: g.get("step", 0))
    observations = []
    
    # 1. Check for consecutive self-cancelling gates on each wire
    qubit_gate_history: dict[int, list[dict]] = {q: [] for q in range(num_qubits)}
    for g in sorted_gates:
        gtype = (g.get("type") or "").upper()
        target = g.get("target", 0)
        
        # Check single-qubit self-inverting gates (H^2 = I, X^2 = I, Z^2 = I, Y^2 = I)
        if gtype in ("H", "X", "Y", "Z"):
            prev_gates = qubit_gate_history.get(target, [])
            if prev_gates:
                last_g = prev_gates[-1]
                if last_g.get("type") == gtype:
                    observations.append({
                        "type": "tip",
                        "gate": gtype,
                        "qubit": target,
                        "message": (
                            f"Consecutive {gtype} gates detected on qubit q[{target}] at steps {last_g.get('step')} and {g.get('step')}. "
                            f"Since {gtype}² = I (identity), these two operations cancel each other out."
                        )
                    })
        qubit_gate_history.setdefault(target, []).append(g)

    # 2. Entanglement / Multi-qubit relations
    entangling_gates = [g for g in sorted_gates if (g.get("type") or "").upper() in ("CNOT", "CX", "CZ", "SWAP")]
    has_entanglement = len(entangling_gates) > 0
    if has_entanglement:
        pairs = set()
        for eg in entangling_gates:
            pairs.add(f"q[{eg.get('control')}] <-> q[{eg.get('target')}]")
        observations.append({
            "type": "observation",
            "message": f"Multi-qubit interaction detected via {len(entangling_gates)} entangling gate(s) between {', '.join(pairs)}. This creates coherent quantum correlations across registers."
        })
    elif num_qubits > 1 and len(sorted_gates) > 0:
        observations.append({
            "type": "observation",
            "message": "All operations are local single-qubit gates. The composite quantum state remains a separable product state with zero entanglement."
        })

    # 3. Gate-by-gate chronological explanations
    gate_steps = []
    for idx, g in enumerate(sorted_gates, start=1):
        gtype = (g.get("type") or "").upper()
        target = g.get("target", 0)
        control = g.get("control")
        step_num = g.get("step", 0)
        
        purpose = ""
        trans_simple = ""
        trans_detailed = ""

        if gtype == "H":
            purpose = f"Creates an equal superposition on qubit q[{target}]."
            trans_simple = f"Transforms q[{target}] into an equal 50/50 superposition between 0 and 1."
            trans_detailed = f"H|0⟩ = (|0⟩ + |1⟩)/√2, H|1⟩ = (|0⟩ - |1⟩)/√2. Creates probability amplitudes α = 1/√2, β = ±1/√2."
        elif gtype == "X":
            purpose = f"Flips the computational basis of qubit q[{target}] (quantum NOT)."
            trans_simple = f"Inverts q[{target}]: 0 becomes 1, and 1 becomes 0."
            trans_detailed = f"Pauli-X: X|0⟩ = |1⟩, X|1⟩ = |0⟩. Permutes amplitudes across basis states."
        elif gtype == "Z":
            purpose = f"Applies a 180° phase flip to the excited state |1⟩ on qubit q[{target}]."
            trans_simple = f"Leaves |0⟩ unchanged, but flips the quantum phase of |1⟩."
            trans_detailed = f"Pauli-Z: Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Preserves measurement probabilities while enabling phase interference."
        elif gtype == "Y":
            purpose = f"Applies both bit-flip and phase-flip with complex amplitude to qubit q[{target}]."
            trans_simple = f"Rotates the qubit around the Y-axis of the Bloch sphere."
            trans_detailed = f"Pauli-Y: Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩."
        elif gtype == "S":
            purpose = f"Applies a π/2 (90°) phase rotation to qubit q[{target}]."
            trans_simple = f"Quarter-turn phase rotation on state |1⟩."
            trans_detailed = f"S|0⟩ = |0⟩, S|1⟩ = i|1⟩ (√Z gate)."
        elif gtype == "T":
            purpose = f"Applies a π/4 (45°) phase rotation to qubit q[{target}]."
            trans_simple = f"Eighth-turn phase rotation on state |1⟩."
            trans_detailed = f"T|0⟩ = |0⟩, T|1⟩ = e^(iπ/4)|1⟩ (fourth root of Z)."
        elif gtype in ("CNOT", "CX"):
            purpose = f"Conditionally flips qubit q[{target}] if control qubit q[{control}] is |1⟩."
            trans_simple = f"Entangles q[{control}] and q[{target}]. Flips q[{target}] only when q[{control}] is 1."
            trans_detailed = f"CNOT|c, t⟩ = |c, c ⊕ t⟩. Maps (|00⟩ + |10⟩)/√2 to Bell state (|00⟩ + |11⟩)/√2."
        elif gtype == "CZ":
            purpose = f"Applies a conditional phase flip to state |11⟩ between q[{control}] and q[{target}]."
            trans_simple = f"Changes sign of the quantum state only when both qubits are 1."
            trans_detailed = f"CZ|c, t⟩ = (-1)^(c·t) |c, t⟩. Symmetric 2-qubit phase gate."
        elif gtype == "SWAP":
            purpose = f"Exchanges the quantum states of qubits q[{control}] and q[{target}]."
            trans_simple = f"Swaps whatever quantum information was in q[{control}] with q[{target}]."
            trans_detailed = f"SWAP|a, b⟩ = |b, a⟩. Equivalent to three alternating CNOT gates."
        else:
            purpose = f"Applies {gtype} operation on qubit q[{target}]."
            trans_simple = f"Unitary operation on q[{target}]."
            trans_detailed = f"Unitary evolution U on q[{target}]."

        gate_steps.append({
            "step_index": idx,
            "circuit_step": step_num,
            "gate": gtype,
            "target": target,
            "control": control,
            "purpose": purpose,
            "transformation_simple": trans_simple,
            "transformation_detailed": trans_detailed
        })

    # 4. Simulation results analysis
    sim_analysis_simple = ""
    sim_analysis_detailed = ""
    if sim_result and sim_result.get("probabilities"):
        probs = sim_result["probabilities"]
        non_zero = {k: v for k, v in probs.items() if v > 0.005}
        sorted_probs = sorted(non_zero.items(), key=lambda x: x[1], reverse=True)
        
        if len(sorted_probs) == 1:
            top_k, top_p = sorted_probs[0]
            sim_analysis_simple = f"The circuit yields a deterministic outcome: {top_k} with {(top_p*100):.1f}% probability."
            sim_analysis_detailed = f"State is purely collapsed into computational eigenstate {top_k} with unity probability (P({top_k}) = {top_p:.4f})."
        elif len(sorted_probs) == 2 and abs(sorted_probs[0][1] - 0.5) < 0.05:
            k1, k2 = sorted_probs[0][0], sorted_probs[1][0]
            if ("00" in k1 or "00" in k2) and ("11" in k1 or "11" in k2):
                sim_analysis_simple = f"The circuit prepared a maximally entangled Bell state: outcomes are correlated between {k1} and {k2} (~50% each)."
                sim_analysis_detailed = f"Maximally entangled Bell pair |Φ⁺⟩ = ({k1} + {k2}) / √2 with balanced amplitudes and zero marginal independence."
            else:
                sim_analysis_simple = f"Equal superposition between two basis states: {k1} and {k2} (~50% each)."
                sim_analysis_detailed = f"Two-state superposition (|ψ⟩ = ({k1} + {k2}) / √2) with orthogonal constructive cancellation on other basis vectors."
        elif len(sorted_probs) == 2 ** num_qubits:
            sim_analysis_simple = f"Uniform superposition across all {2**num_qubits} computational basis states (~{(100/(2**num_qubits)):.1f}% each)."
            sim_analysis_detailed = f"Complete uniform superposition state |+⟩^{{⊗{num_qubits}}} = (1/√{2**num_qubits}) ∑ |x⟩ prepared via Hadamard transform."
        else:
            top_items = [f"{k} ({(v*100):.1f}%)" for k, v in sorted_probs[:3]]
            sim_analysis_simple = f"The circuit creates a coherent superposition dominated by: {', '.join(top_items)}."
            sim_analysis_detailed = f"Superposition state across {len(sorted_probs)} active basis states with dominant amplitudes in {sorted_probs[0][0]}."
    else:
        sim_analysis_simple = "Circuit begins in initial ground state |0...0⟩ (100% certainty of measuring 0s)."
        sim_analysis_detailed = "Statevector is identity initialized at computational ground state |0⟩^{⊗n}."

    return {
        "num_qubits": num_qubits,
        "num_gates": len(sorted_gates),
        "circuit_depth": max([g.get("step", 0) for g in sorted_gates], default=0) + 1 if sorted_gates else 0,
        "observations": observations,
        "gate_steps": gate_steps,
        "has_entanglement": has_entanglement,
        "sim_analysis_simple": sim_analysis_simple,
        "sim_analysis_detailed": sim_analysis_detailed
    }


def generate_offline_circuit_explanation(
    analysis: dict,
    mode: str = "simple",
    algorithm_name: str | None = None
) -> dict:
    """
    Generates a high-quality, scientifically grounded explanation
    entirely offline when Gemini API is unavailable.
    """
    num_q = analysis["num_qubits"]
    num_g = analysis["num_gates"]
    depth = analysis["circuit_depth"]
    steps = analysis["gate_steps"]
    is_detailed = mode.lower() == "detailed"

    algo_prefix = f"### Algorithm: {algorithm_name}\n\n" if algorithm_name else ""
    
    # Overview
    overview = (
        f"{algo_prefix}This quantum circuit operates on **{num_q} qubit{'s' if num_q != 1 else ''}** "
        f"across **{num_g} gate{'s' if num_g != 1 else ''}** with a circuit depth of **{depth}**. "
    )
    if analysis["has_entanglement"]:
        overview += "It includes multi-qubit entangling operations that generate quantum correlations between registers."
    else:
        overview += "It consists of local single-qubit transformations with separable registers."

    # Gate-by-Gate
    gate_bullets = []
    for s in steps:
        ctrl_part = f" controlled by q[{s['control']}]" if s['control'] is not None else ""
        desc = s["transformation_detailed"] if is_detailed else s["transformation_simple"]
        gate_bullets.append(
            f"**Step {s['circuit_step']} — {s['gate']} on q[{s['target']}]{ctrl_part}**:\n"
            f"- *Purpose*: {s['purpose']}\n"
            f"- *Quantum State Effect*: {desc}"
        )
    gate_breakdown_text = "\n\n".join(gate_bullets) if gate_bullets else "*No gates placed. Circuit is in ground state |0...0⟩.*"

    # Scientific Conclusion / Simulation interpretation
    sim_text = analysis["sim_analysis_detailed"] if is_detailed else analysis["sim_analysis_simple"]
    
    # Key Concepts
    concepts = ["Quantum State", "Measurement"]
    if any(s["gate"] == "H" for s in steps):
        concepts.append("Superposition")
    if analysis["has_entanglement"]:
        concepts.append("Quantum Entanglement")
    if any(s["gate"] in ("Z", "S", "T", "CZ") for s in steps):
        concepts.append("Quantum Phase")
    if any(s["gate"] == "X" for s in steps):
        concepts.append("Pauli-X (NOT)")

    # Full formatted markdown
    markdown = f"""## Circuit Architecture & Overview
{overview}

### Chronological Gate Walkthrough
{gate_breakdown_text}

### Simulation Analysis & Expected Behavior
{sim_text}

### Key Quantum Principles
{', '.join([f'`{c}`' for c in concepts])}
"""

    return {
        "circuit_overview": overview,
        "mode": "detailed" if is_detailed else "simple",
        "gate_explanations": [
            {
                "step": s["circuit_step"],
                "gate": s["gate"],
                "target": s["target"],
                "control": s["control"],
                "purpose": s["purpose"],
                "transformation": s["transformation_detailed"] if is_detailed else s["transformation_simple"]
            }
            for s in steps
        ],
        "circuit_observations": analysis["observations"],
        "simulation_analysis": sim_text,
        "key_concepts": concepts,
        "explanation_markdown": markdown.strip(),
        "sources": [
            {"name": "Qiskit Quantum Circuit Runtime", "source_type": "framework"},
            {"name": "Nielsen & Chuang (Quantum Computation and Information)", "source_type": "academic"}
        ],
        "is_ai_generated": False
    }


def explain_circuit(
    circuit: list[dict],
    num_qubits: int,
    simulation_result: dict | None = None,
    mode: str = "simple",
    algorithm_id: str | None = None,
    algorithm_name: str | None = None,
    student_progress: dict | None = None
) -> dict:
    """
    Main orchestrator for 'Explain This Circuit':
    1. Analyzes circuit structure and detects anomalies/cancellations.
    2. Gathers verified platform knowledge base citations (RAG).
    3. Prompts Google Gemini with complete structured context.
    4. Falls back gracefully to offline explanation if Gemini is offline.
    """
    analysis = analyze_circuit_structure(circuit, num_qubits, simulation_result)
    is_detailed = mode.lower() == "detailed"

    # Gather algorithm name if provided or look it up by id
    resolved_name = algorithm_name
    target_id = algorithm_id or algorithm_name
    if target_id and not resolved_name:
        kb = load_knowledge_base()
        for item in kb:
            if item.get("id") == target_id or item.get("slug") == target_id or item.get("topic_name") == target_id:
                resolved_name = item.get("title") or item.get("topic_name")
                break
        if not resolved_name:
            resolved_name = target_id
    elif resolved_name:
        resolved_name = algorithm_name

    algorithm_name = resolved_name

    # 1. Retrieve relevant knowledge base concepts
    query_text = " ".join([(g.get("type") or "") for g in circuit]) + " " + (algorithm_name or "quantum circuit")
    matched_entries, citations = retrieve_relevant_knowledge(query_text, top_k=2)

    # 2. Build Gemini prompt
    system_prompt = (
        "You are an expert Quantum Circuit Pedagogy AI for an interactive educational laboratory.\n"
        "Your task is to explain the user's specific quantum circuit with scientific accuracy.\n\n"
        "STRICT SCIENTIFIC GUIDELINES:\n"
        "1. Base your explanation strictly on the provided circuit gates and simulation probabilities. Do NOT invent gates or measurements not present.\n"
        "2. NEVER describe superposition as 'being 0 and 1 at the same time'. Describe it via probability amplitudes and measurement collapse according to Born's rule.\n"
        "3. Address the learner at the requested difficulty mode:\n"
        f"   - Mode: {'DETAILED (use Dirac notation, state amplitudes, matrices, and interference)' if is_detailed else 'SIMPLE (clear, beginner-friendly analogies and intuitive mechanics)'}\n"
        "4. Structure your response into clear sections:\n"
        "   - Overview\n"
        "   - Gate-by-Gate Analysis\n"
        "   - Expected Behavior & Measurement Interpretation\n"
        "   - Key Takeaways\n"
    )

    if student_progress:
        system_prompt += f"\nStudent Progress Context: {json.dumps(student_progress)}\n"

    # Format circuit details for prompt
    circuit_prompt = f"Target Circuit: {num_qubits} qubits, {len(circuit)} gates.\n"
    if algorithm_name:
        circuit_prompt += f"Algorithm context: {algorithm_name}\n"
    circuit_prompt += "Gates:\n"
    for s in analysis["gate_steps"]:
        ctrl_str = f", control: q[{s['control']}]" if s['control'] is not None else ""
        circuit_prompt += f"- Step {s['circuit_step']}: Gate {s['gate']} on target q[{s['target']}]{ctrl_str}\n"

    if simulation_result and simulation_result.get("probabilities"):
        circuit_prompt += f"Actual Measured Probabilities: {json.dumps(simulation_result.get('probabilities'))}\n"

    if analysis["observations"]:
        circuit_prompt += "Diagnostic Observations:\n"
        for obs in analysis["observations"]:
            circuit_prompt += f"- [{obs.get('type')}] {obs.get('message')}\n"

    user_query = f"Please explain this {num_qubits}-qubit quantum circuit in {'detailed advanced mathematical depth' if is_detailed else 'accessible, beginner-friendly clarity'}."

    try:
        raw_ai_text = invoke_gemini(system_prompt, f"{circuit_prompt}\n\n{user_query}")
        
        valid_concepts = [
            "Superposition" if any(s["gate"] == "H" for s in analysis["gate_steps"]) else None,
            "Entanglement" if analysis["has_entanglement"] else None,
            "Measurement",
            "Phase Flip" if any(s["gate"] in ("Z", "S", "T", "CZ") for s in analysis["gate_steps"]) else None
        ]
        
        return {
            "circuit_overview": (
                f"This circuit uses {num_qubits} qubit{'s' if num_qubits != 1 else ''} with {len(circuit)} gate operations. "
                f"{'It establishes quantum entanglement between registers.' if analysis['has_entanglement'] else 'Operations are separable local gates.'}"
            ),
            "mode": "detailed" if is_detailed else "simple",
            "gate_explanations": [
                {
                    "step": s["circuit_step"],
                    "gate": s["gate"],
                    "target": s["target"],
                    "control": s["control"],
                    "purpose": s["purpose"],
                    "transformation": s["transformation_detailed"] if is_detailed else s["transformation_simple"]
                }
                for s in analysis["gate_steps"]
            ],
            "circuit_observations": analysis["observations"],
            "simulation_analysis": analysis["sim_analysis_detailed"] if is_detailed else analysis["sim_analysis_simple"],
            "key_concepts": [c for c in valid_concepts if c is not None],
            "explanation_markdown": raw_ai_text.strip(),
            "sources": citations if citations else [
                {"name": "Qiskit Quantum Circuit Specification", "source_type": "framework"},
                {"name": "Nielsen & Chuang", "source_type": "academic"}
            ],
            "is_ai_generated": True
        }
    except Exception as e:
        logger.warning(f"Gemini circuit explanation unavailable ({e}), using verified rule-based analyzer.")
        return generate_offline_circuit_explanation(analysis, mode=mode, algorithm_name=algorithm_name)
