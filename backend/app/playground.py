"""
Curated Quantum Algorithms specification for the Quantum Algorithm Playground.
Provides 12 algorithms spanning Beginner, Intermediate, and Advanced tiers with
exact step definitions, starting circuits, and educational metadata.
"""

PLAYGROUND_ALGORITHMS = [
    # ----------------------------------------------------
    # BEGINNER
    # ----------------------------------------------------
    {
        "id": "deutsch",
        "name": "Deutsch Algorithm",
        "category": "Beginner",
        "difficulty": 1,
        "num_qubits": 2,
        "purpose": "Determines whether an unknown 1-bit boolean function f(x) is constant or balanced using exactly 1 quantum evaluation instead of 2 classical queries.",
        "speedup": "Deterministic speedup: 1 query (quantum) vs 2 queries (classical worst-case).",
        "classical_vs_quantum": "Classical computers must query f(0) and f(1) separately. The quantum circuit evaluates f(x) in superposition across both inputs simultaneously and uses constructive/destructive interference to extract global property f(0) ⊕ f(1).",
        "prerequisites": ["Superposition", "Hadamard Gate", "Phase Kickback", "CNOT Gate"],
        "initial_gates": [
            {"id": "d-x1", "type": "X", "target": 1, "step": 1, "control": None},
            {"id": "d-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "d-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "d-cx01", "type": "CNOT", "target": 1, "step": 3, "control": 0},
            {"id": "d-h0-final", "type": "H", "target": 0, "step": 4, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Ancilla Initialization",
                "description": "Prepare ancilla qubit q[1] in excited state |1⟩ by applying a Pauli-X (NOT) gate.",
                "gate_ids": ["d-x1"],
                "what_happens": "Qubit q[1] transitions from ground state |0⟩ to |1⟩. Overall system state becomes |01⟩."
            },
            {
                "step_number": 2,
                "name": "Equal Superposition Creation",
                "description": "Apply Hadamard gates to both qubits. Input qubit q[0] enters |+⟩ = (|0⟩+|1⟩)/√2; ancilla q[1] enters |−⟩ = (|0⟩−|1⟩)/√2.",
                "gate_ids": ["d-h0", "d-h1"],
                "what_happens": "System enters product state |+⟩|−⟩. Both basis states 0 and 1 are now present in the input register with equal amplitude."
            },
            {
                "step_number": 3,
                "name": "Oracle Query & Phase Kickback",
                "description": "Apply the balanced oracle unitary (CNOT with control q[0] and target q[1]).",
                "gate_ids": ["d-cx01"],
                "what_happens": "Because the target qubit is in the eigenstate |−⟩ of X, the eigenvalue (-1)^f(x) is kicked back onto the control qubit q[0], changing its state to |−⟩."
            },
            {
                "step_number": 4,
                "name": "Interference & Readout",
                "description": "Apply a final Hadamard gate on input qubit q[0] to transform phase information back into the computational basis.",
                "gate_ids": ["d-h0-final"],
                "what_happens": "H|−⟩ collapses deterministically to |1⟩. Measuring q[0] gives 1 with 100% probability, proving f(x) is balanced in a single shot."
            }
        ]
    },
    {
        "id": "deutsch_jozsa",
        "name": "Deutsch-Jozsa Algorithm",
        "category": "Beginner",
        "difficulty": 1,
        "num_qubits": 3,
        "purpose": "Determines whether an n-bit boolean function f:{0,1}ⁿ → {0,1} is constant (same output everywhere) or balanced (equal 0s and 1s) in a single query.",
        "speedup": "Exponential speedup: 1 quantum query vs 2ⁿ⁻¹ + 1 classical queries in the worst case.",
        "classical_vs_quantum": "Classically, an adversary could produce 2ⁿ⁻¹ identical answers before revealing whether the function is constant or balanced. Quantum superposition tests all 2ⁿ inputs at once.",
        "prerequisites": ["Multi-Qubit Superposition", "Phase Kickback", "Quantum Interference"],
        "initial_gates": [
            {"id": "dj-x2", "type": "X", "target": 2, "step": 1, "control": None},
            {"id": "dj-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "dj-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "dj-h2", "type": "H", "target": 2, "step": 2, "control": None},
            {"id": "dj-cx02", "type": "CNOT", "target": 2, "step": 3, "control": 0},
            {"id": "dj-cx12", "type": "CNOT", "target": 2, "step": 4, "control": 1},
            {"id": "dj-h0-f", "type": "H", "target": 0, "step": 5, "control": None},
            {"id": "dj-h1-f", "type": "H", "target": 1, "step": 5, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Ancilla Setup",
                "description": "Initialize ancilla qubit q[2] to |1⟩ with an X gate.",
                "gate_ids": ["dj-x2"],
                "what_happens": "Prepares the ancilla for phase kickback."
            },
            {
                "step_number": 2,
                "name": "Hadamard Transform Across All Qubits",
                "description": "Apply H gates to all 3 qubits. Creates uniform superposition 1/2 ∑|x⟩ on q[0], q[1], and |−⟩ on q[2].",
                "gate_ids": ["dj-h0", "dj-h1", "dj-h2"],
                "what_happens": "All 4 classical 2-bit inputs |00⟩, |01⟩, |10⟩, |11⟩ are now superposed with equal positive amplitude."
            },
            {
                "step_number": 3,
                "name": "Balanced Oracle Evaluation",
                "description": "Apply CNOTs from input qubits q[0] and q[1] onto ancilla q[2], implementing balanced function f(x) = x₀ ⊕ x₁.",
                "gate_ids": ["dj-cx02", "dj-cx12"],
                "what_happens": "Phase kickback modulates the amplitude of each basis state |x⟩ by (-1)^f(x)."
            },
            {
                "step_number": 4,
                "name": "Interference Transform",
                "description": "Apply Hadamard gates to input qubits q[0] and q[1].",
                "gate_ids": ["dj-h0-f", "dj-h1-f"],
                "what_happens": "Destructive interference cancels the amplitude of |00⟩ to 0. All probability flows into non-zero states (here |11⟩), confirming f is balanced."
            }
        ]
    },
    {
        "id": "bernstein_vazirani",
        "name": "Bernstein-Vazirani Algorithm",
        "category": "Beginner",
        "difficulty": 1,
        "num_qubits": 3,
        "purpose": "Finds a hidden n-bit secret string s in an inner-product oracle f(x) = s · x (mod 2) with 1 query instead of n classical queries.",
        "speedup": "Polynomial speedup: 1 quantum query vs n classical queries.",
        "classical_vs_quantum": "Classical computers must probe e₁, e₂, ..., eₙ sequentially (one bit at a time). Bernstein-Vazirani extracts all n bits of s in a single parallel query.",
        "prerequisites": ["Phase Kickback", "Inner Product Oracles", "Computational Basis Mapping"],
        "initial_gates": [
            {"id": "bv-x2", "type": "X", "target": 2, "step": 1, "control": None},
            {"id": "bv-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "bv-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "bv-h2", "type": "H", "target": 2, "step": 2, "control": None},
            {"id": "bv-cx02", "type": "CNOT", "target": 2, "step": 3, "control": 0},
            {"id": "bv-cx12", "type": "CNOT", "target": 2, "step": 4, "control": 1},
            {"id": "bv-h0-f", "type": "H", "target": 0, "step": 5, "control": None},
            {"id": "bv-h1-f", "type": "H", "target": 1, "step": 5, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Ancilla Setup",
                "description": "Initialize ancilla qubit q[2] to |1⟩ with X gate.",
                "gate_ids": ["bv-x2"],
                "what_happens": "Sets target ready for eigenvalue -1 phase kickback."
            },
            {
                "step_number": 2,
                "name": "Input Register Superposition",
                "description": "Apply H gates to all qubits.",
                "gate_ids": ["bv-h0", "bv-h1", "bv-h2"],
                "what_happens": "Prepares equal superposition over all candidate binary strings."
            },
            {
                "step_number": 3,
                "name": "Secret Encoding Oracle (s = 11)",
                "description": "CNOT from q[0] and CNOT from q[1] target ancilla q[2], encoding secret string s = '11'.",
                "gate_ids": ["bv-cx02", "bv-cx12"],
                "what_happens": "Inverts the relative phase of basis states proportionally to the inner product s · x."
            },
            {
                "step_number": 4,
                "name": "Basis Decoding",
                "description": "Apply final Hadamard gates on q[0] and q[1].",
                "gate_ids": ["bv-h0-f", "bv-h1-f"],
                "what_happens": "The Fourier basis state |s⟩ is mapped directly onto computational basis state |11⟩ with 100% certainty."
            }
        ]
    },
    {
        "id": "simon",
        "name": "Simon's Algorithm",
        "category": "Beginner",
        "difficulty": 2,
        "num_qubits": 3,
        "purpose": "Finds the hidden period string s for a 2-to-1 function satisfying f(x) = f(y) iff x ⊕ y ∈ {0, s} with exponential quantum speedup.",
        "speedup": "Exponential speedup: O(n) quantum queries vs O(2ⁿ/²) classical queries.",
        "classical_vs_quantum": "Classical collision-finding requires Birthday Paradox sampling (~2ⁿ/² queries). Simon's algorithm samples linear equations y · s = 0 (mod 2) to reconstruct s using classical Gaussian elimination.",
        "prerequisites": ["Hadamard Transform", "Linear Equations over GF(2)", "Periodicity"],
        "initial_gates": [
            {"id": "sim-h0", "type": "H", "target": 0, "step": 1, "control": None},
            {"id": "sim-h1", "type": "H", "target": 1, "step": 1, "control": None},
            {"id": "sim-cx02", "type": "CNOT", "target": 2, "step": 2, "control": 0},
            {"id": "sim-cx12", "type": "CNOT", "target": 2, "step": 3, "control": 1},
            {"id": "sim-h0-f", "type": "H", "target": 0, "step": 4, "control": None},
            {"id": "sim-h1-f", "type": "H", "target": 1, "step": 4, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Input Superposition",
                "description": "Hadamard gates on input qubits q[0] and q[1].",
                "gate_ids": ["sim-h0", "sim-h1"],
                "what_happens": "Generates uniform superposition over all input domain values."
            },
            {
                "step_number": 2,
                "name": "2-to-1 Function Oracle",
                "description": "Entangle input qubits with output qubit q[2] using CNOT gates.",
                "gate_ids": ["sim-cx02", "sim-cx12"],
                "what_happens": "Maps (|x⟩ + |x ⊕ s⟩)|f(x)⟩, creating quantum correlation between domain pairs and codomain."
            },
            {
                "step_number": 3,
                "name": "Interference Transform",
                "description": "Apply final Hadamards on input register q[0] and q[1].",
                "gate_ids": ["sim-h0-f", "sim-h1-f"],
                "what_happens": "Measurement yields vectors y satisfying y · s = 0 (mod 2)."
            }
        ]
    },

    # ----------------------------------------------------
    # INTERMEDIATE
    # ----------------------------------------------------
    {
        "id": "grover",
        "name": "Grover's Search Algorithm",
        "category": "Intermediate",
        "difficulty": 2,
        "num_qubits": 2,
        "purpose": "Finds a unique marked item in an unstructured database of N = 2ⁿ elements using only O(√N) oracle queries.",
        "speedup": "Quadratic speedup: O(√N) quantum queries vs O(N) classical queries (provably optimal).",
        "classical_vs_quantum": "Classical linear search must check items one by one (averaging N/2 attempts). Grover's algorithm rotates the statevector towards the target state using amplitude amplification.",
        "prerequisites": ["Geometric State Rotations", "Phase Inversion", "Diffuser Operator", "Constructive Interference"],
        "initial_gates": [
            {"id": "gr-h0", "type": "H", "target": 0, "step": 1, "control": None},
            {"id": "gr-h1", "type": "H", "target": 1, "step": 1, "control": None},
            {"id": "gr-cz", "type": "CZ", "target": 1, "step": 2, "control": 0},
            {"id": "gr-h0-d1", "type": "H", "target": 0, "step": 3, "control": None},
            {"id": "gr-h1-d1", "type": "H", "target": 1, "step": 3, "control": None},
            {"id": "gr-x0", "type": "X", "target": 0, "step": 4, "control": None},
            {"id": "gr-x1", "type": "X", "target": 1, "step": 4, "control": None},
            {"id": "gr-cz-d", "type": "CZ", "target": 1, "step": 5, "control": 0},
            {"id": "gr-x0-f", "type": "X", "target": 0, "step": 6, "control": None},
            {"id": "gr-x1-f", "type": "X", "target": 1, "step": 6, "control": None},
            {"id": "gr-h0-f", "type": "H", "target": 0, "step": 7, "control": None},
            {"id": "gr-h1-f", "type": "H", "target": 1, "step": 7, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Uniform Superposition",
                "description": "Hadamard gates on q[0] and q[1] place the register in state |s⟩ = 1/2 (|00⟩ + |01⟩ + |10⟩ + |11⟩).",
                "gate_ids": ["gr-h0", "gr-h1"],
                "what_happens": "Every element has equal 25% measurement probability."
            },
            {
                "step_number": 2,
                "name": "Phase Oracle (Target = |11⟩)",
                "description": "Apply CZ gate between q[0] and q[1]. Flips the sign of state |11⟩ to -|11⟩ while leaving other states unchanged.",
                "gate_ids": ["gr-cz"],
                "what_happens": "The target statevector amplitude is reflected across the orthogonal subspace."
            },
            {
                "step_number": 3,
                "name": "Grover Diffuser (Inversion About the Mean)",
                "description": "Apply H, X, CZ, X, H across both qubits to perform operator 2|s⟩⟨s| - I.",
                "gate_ids": ["gr-h0-d1", "gr-h1-d1", "gr-x0", "gr-x1", "gr-cz-d", "gr-x0-f", "gr-x1-f", "gr-h0-f", "gr-h1-f"],
                "what_happens": "Amplitudes reflect around the mean amplitude. The marked state |11⟩ is amplified to 100% probability!"
            }
        ]
    },
    {
        "id": "qft",
        "name": "Quantum Fourier Transform (QFT)",
        "category": "Intermediate",
        "difficulty": 2,
        "num_qubits": 3,
        "purpose": "Transforms computational basis states into frequency/phase representations; core engine of Shor's algorithm and Quantum Phase Estimation.",
        "speedup": "Exponential algorithmic speedup: O(n²) quantum gates vs O(n 2ⁿ) classical Fast Fourier Transform (FFT).",
        "classical_vs_quantum": "Classical FFT operates on 2ⁿ complex values explicitly. QFT operates on state amplitudes directly via recursive controlled phase rotations.",
        "prerequisites": ["Phase Rotations", "Controlled Unitaries", "Roots of Unity", "SWAP Gates"],
        "initial_gates": [
            {"id": "qft-x0", "type": "X", "target": 0, "step": 1, "control": None},
            {"id": "qft-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "qft-s01", "type": "S", "target": 0, "step": 3, "control": None},
            {"id": "qft-t02", "type": "T", "target": 0, "step": 4, "control": None},
            {"id": "qft-h1", "type": "H", "target": 1, "step": 5, "control": None},
            {"id": "qft-s12", "type": "S", "target": 1, "step": 6, "control": None},
            {"id": "qft-h2", "type": "H", "target": 2, "step": 7, "control": None},
            {"id": "qft-sw02", "type": "SWAP", "target": 2, "step": 8, "control": 0}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Input State Preparation",
                "description": "Prepare basis state |001⟩ by applying Pauli-X to qubit q[0].",
                "gate_ids": ["qft-x0"],
                "what_happens": "Initial computational state set to |1⟩."
            },
            {
                "step_number": 2,
                "name": "Stage 1: Most Significant Qubit Transform",
                "description": "Apply Hadamard on q[0] followed by phase rotations S (π/2) and T (π/4).",
                "gate_ids": ["qft-h0", "qft-s01", "qft-t02"],
                "what_happens": "Encodes higher binary fractions into the relative phase of q[0]."
            },
            {
                "step_number": 3,
                "name": "Stage 2: Middle Qubit Transform",
                "description": "Apply Hadamard on q[1] and S phase rotation.",
                "gate_ids": ["qft-h1", "qft-s12"],
                "what_happens": "Encodes remaining binary fraction into q[1]."
            },
            {
                "step_number": 4,
                "name": "Stage 3 & Bit Reversal",
                "description": "Hadamard on q[2] and SWAP gate between q[0] and q[2].",
                "gate_ids": ["qft-h2", "qft-sw02"],
                "what_happens": "Reverses qubit ordering to produce the standardized natural Fourier frequency ordering."
            }
        ]
    },
    {
        "id": "qpe",
        "name": "Quantum Phase Estimation (QPE)",
        "category": "Intermediate",
        "difficulty": 3,
        "num_qubits": 3,
        "purpose": "Estimates the unknown phase θ in the eigenvalue equation U|ψ⟩ = e²πⁱᶿ|ψ⟩ for a given unitary matrix U.",
        "speedup": "Exponential precision efficiency: finds n bits of phase with O(n²) operations.",
        "classical_vs_quantum": "Classical matrix diagonalization scales cubically with Hilbert space dimension O(2³ⁿ). QPE directly projects onto the eigenbasis and reads the phase into a register.",
        "prerequisites": ["Quantum Fourier Transform", "Eigenstates & Eigenvalues", "Controlled-Unitary Gates"],
        "initial_gates": [
            {"id": "qpe-x2", "type": "X", "target": 2, "step": 1, "control": None},
            {"id": "qpe-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "qpe-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "qpe-cz12", "type": "CZ", "target": 2, "step": 3, "control": 1},
            {"id": "qpe-h0-f", "type": "H", "target": 0, "step": 4, "control": None},
            {"id": "qpe-h1-f", "type": "H", "target": 1, "step": 4, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Eigenstate Initialization",
                "description": "Apply X gate to target qubit q[2] to prepare eigenstate |1⟩ of the phase operator Z.",
                "gate_ids": ["qpe-x2"],
                "what_happens": "Qubit q[2] is prepared in state |1⟩, for which Z|1⟩ = -1|1⟩ = e^{iπ}|1⟩ (phase θ = 0.5)."
            },
            {
                "step_number": 2,
                "name": "Counting Register Superposition",
                "description": "Apply Hadamard gates to counting qubits q[0] and q[1].",
                "gate_ids": ["qpe-h0", "qpe-h1"],
                "what_happens": "Creates uniform superposition in the counting register."
            },
            {
                "step_number": 3,
                "name": "Controlled Phase Application",
                "description": "Apply controlled-Z gate from counting qubit q[1] onto target q[2].",
                "gate_ids": ["qpe-cz12"],
                "what_happens": "Phase kickback copies eigenvalue phase 2πθ into the relative phase of the counting register."
            },
            {
                "step_number": 4,
                "name": "Inverse QFT & Readout",
                "description": "Apply inverse Fourier transform (Hadamards) to decode phase into binary digits.",
                "gate_ids": ["qpe-h0-f", "qpe-h1-f"],
                "what_happens": "Measuring the counting register yields the binary expansion of phase θ."
            }
        ]
    },
    {
        "id": "teleportation",
        "name": "Quantum Teleportation",
        "category": "Intermediate",
        "difficulty": 2,
        "num_qubits": 3,
        "purpose": "Transfers an unknown quantum state |ψ⟩ from sender (Alice) to receiver (Bob) using a pre-shared EPR entangled pair and 2 classical bits.",
        "speedup": "Fundamental quantum communication protocol; preserves no-cloning theorem.",
        "classical_vs_quantum": "Classical physics cannot transmit an unknown quantum state because measuring it destroys superposition and phase. Teleportation reconstructs the exact state via quantum entanglement.",
        "prerequisites": ["EPR Bell Pairs", "No-Cloning Theorem", "Bell Basis Measurement"],
        "initial_gates": [
            {"id": "tel-h0", "type": "H", "target": 0, "step": 1, "control": None},
            {"id": "tel-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "tel-cx12", "type": "CNOT", "target": 2, "step": 3, "control": 1},
            {"id": "tel-cx01", "type": "CNOT", "target": 1, "step": 4, "control": 0},
            {"id": "tel-h0-f", "type": "H", "target": 0, "step": 5, "control": None},
            {"id": "tel-cx12-cor", "type": "CNOT", "target": 2, "step": 6, "control": 1},
            {"id": "tel-cz02-cor", "type": "CZ", "target": 2, "step": 7, "control": 0}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "State Preparation",
                "description": "Apply Hadamard on q[0] to create the arbitrary state |ψ⟩ = |+⟩ to teleport.",
                "gate_ids": ["tel-h0"],
                "what_happens": "Alice's qubit q[0] holds the secret quantum information."
            },
            {
                "step_number": 2,
                "name": "Bell Pair Creation",
                "description": "Apply H on q[1] and CNOT from q[1] to q[2] to form maximally entangled state (|00⟩+|11⟩)/√2.",
                "gate_ids": ["tel-h1", "tel-cx12"],
                "what_happens": "Establishes non-local quantum channel between Alice (q[1]) and Bob (q[2])."
            },
            {
                "step_number": 3,
                "name": "Bell Measurement (Alice)",
                "description": "Apply CNOT from q[0] to q[1] and H on q[0].",
                "gate_ids": ["tel-cx01", "tel-h0-f"],
                "what_happens": "Projects Alice's two qubits onto the 4 Bell states, destroying the state on q[0]."
            },
            {
                "step_number": 4,
                "name": "Correction Unitary (Bob)",
                "description": "Apply conditional CNOT (X correction) and CZ (Z correction) on Bob's qubit q[2].",
                "gate_ids": ["tel-cx12-cor", "tel-cz02-cor"],
                "what_happens": "Bob's qubit q[2] is rotated into the exact original state |ψ⟩ with 100% fidelity!"
            }
        ]
    },
    {
        "id": "superdense_coding",
        "name": "Superdense Coding",
        "category": "Intermediate",
        "difficulty": 2,
        "num_qubits": 2,
        "purpose": "Transmits 2 classical bits of information from Alice to Bob by physically sending only 1 single qubit through a pre-shared entangled pair.",
        "speedup": "2x Channel capacity increase over classical limits (Holevo bound = 1 bit per unentangled qubit).",
        "classical_vs_quantum": "Classical bits require sending 2 separate physical signals. Superdense coding uses quantum entanglement to double the information transmission density.",
        "prerequisites": ["Bell States", "Entanglement Manipulation", "Local Unitary Operations"],
        "initial_gates": [
            {"id": "sdc-h0", "type": "H", "target": 0, "step": 1, "control": None},
            {"id": "sdc-cx01", "type": "CNOT", "target": 1, "step": 2, "control": 0},
            {"id": "sdc-x0", "type": "X", "target": 0, "step": 3, "control": None},
            {"id": "sdc-z0", "type": "Z", "target": 0, "step": 4, "control": None},
            {"id": "sdc-cx01-dec", "type": "CNOT", "target": 1, "step": 5, "control": 0},
            {"id": "sdc-h0-dec", "type": "H", "target": 0, "step": 6, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Shared Bell Pair Generation",
                "description": "Create Bell state |Φ⁺⟩ = (|00⟩+|11⟩)/√2 across q[0] (Alice) and q[1] (Bob).",
                "gate_ids": ["sdc-h0", "sdc-cx01"],
                "what_happens": "Alice and Bob each hold one qubit of the entangled pair."
            },
            {
                "step_number": 2,
                "name": "Alice Encodes 2 Bits (Message '11')",
                "description": "Alice applies Pauli-X and Pauli-Z gates to her qubit q[0] to encode classical message '11'.",
                "gate_ids": ["sdc-x0", "sdc-z0"],
                "what_happens": "Transforms the global entangled state into Bell state |Ψ⁻⟩ = (|01⟩−|10⟩)/√2."
            },
            {
                "step_number": 3,
                "name": "Bob's Bell Decoding",
                "description": "Bob receives q[0] and applies CNOT and H gates to map the Bell basis back to the computational basis.",
                "gate_ids": ["sdc-cx01-dec", "sdc-h0-dec"],
                "what_happens": "Measurement yields classical bits '11' with 100% certainty!"
            }
        ]
    },

    # ----------------------------------------------------
    # ADVANCED
    # ----------------------------------------------------
    {
        "id": "shor_order_finding",
        "name": "Shor's Algorithm (Order Finding)",
        "category": "Advanced",
        "difficulty": 3,
        "num_qubits": 3,
        "purpose": "Finds the period r of f(x) = aˣ mod N, the quantum engine behind breaking RSA public-key cryptography.",
        "speedup": "Super-polynomial/exponential speedup: O((log N)³) vs classical General Number Field Sieve exp(O(∛(log N))).",
        "classical_vs_quantum": "Classical factoring is computationally intractable for large numbers. Shor reduces factoring to period finding and solves it efficiently with QFT.",
        "prerequisites": ["Modular Arithmetic", "Quantum Phase Estimation", "Inverse QFT", "Continued Fractions"],
        "initial_gates": [
            {"id": "shor-x2", "type": "X", "target": 2, "step": 1, "control": None},
            {"id": "shor-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "shor-h1", "type": "H", "target": 1, "step": 2, "control": None},
            {"id": "shor-cx12", "type": "CNOT", "target": 2, "step": 3, "control": 1},
            {"id": "shor-h0-iqft", "type": "H", "target": 0, "step": 4, "control": None},
            {"id": "shor-cz01-iqft", "type": "CZ", "target": 1, "step": 5, "control": 0},
            {"id": "shor-h1-iqft", "type": "H", "target": 1, "step": 6, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Target Register Initialization",
                "description": "Prepare target register q[2] in state |1⟩ corresponding to a⁰ mod N = 1.",
                "gate_ids": ["shor-x2"],
                "what_happens": "Prepares modular identity basis state."
            },
            {
                "step_number": 2,
                "name": "Control Register Superposition",
                "description": "Apply Hadamard gates to control qubits q[0] and q[1].",
                "gate_ids": ["shor-h0", "shor-h1"],
                "what_happens": "Generates superposition of all exponents x ∈ {0, 1, 2, 3}."
            },
            {
                "step_number": 3,
                "name": "Controlled Modular Multiplication",
                "description": "Apply controlled modular operation (represented here by CNOT) to map |x⟩|1⟩ → |x⟩|aˣ mod N⟩.",
                "gate_ids": ["shor-cx12"],
                "what_happens": "Entangles exponent register with periodic modular values."
            },
            {
                "step_number": 4,
                "name": "Inverse Quantum Fourier Transform",
                "description": "Apply inverse QFT (H, CZ, H) to extract the period r from the phase.",
                "gate_ids": ["shor-h0-iqft", "shor-cz01-iqft", "shor-h1-iqft"],
                "what_happens": "Constructive interference peaks at multiples of 1/r, revealing the period upon measurement."
            }
        ]
    },
    {
        "id": "vqe",
        "name": "Variational Quantum Eigensolver (VQE)",
        "category": "Advanced",
        "difficulty": 3,
        "num_qubits": 2,
        "purpose": "Finds the ground state energy of a molecular Hamiltonian using a hybrid quantum-classical variational loop on NISQ hardware.",
        "speedup": "Practical polynomial quantum scaling for chemical simulation vs exponential classical CI (Configuration Interaction).",
        "classical_vs_quantum": "Classical chemistry methods like Full CI scale exponentially with electron orbitals. VQE prepares quantum wavefunctions directly on qubits and uses classical optimizers to adjust parameters.",
        "prerequisites": ["Variational Principle", "Ansatz Parameterization", "Pauli Expectation Values", "NISQ Architecture"],
        "initial_gates": [
            {"id": "vqe-x0", "type": "X", "target": 0, "step": 1, "control": None},
            {"id": "vqe-h0", "type": "H", "target": 0, "step": 2, "control": None},
            {"id": "vqe-s0", "type": "S", "target": 0, "step": 3, "control": None},
            {"id": "vqe-cx01", "type": "CNOT", "target": 1, "step": 4, "control": 0},
            {"id": "vqe-s1", "type": "S", "target": 1, "step": 5, "control": None},
            {"id": "vqe-h1", "type": "H", "target": 1, "step": 6, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Hartree-Fock Reference State",
                "description": "Apply X gate to prepare initial mean-field electron configuration |10⟩.",
                "gate_ids": ["vqe-x0"],
                "what_happens": "Establishes the classical approximation baseline."
            },
            {
                "step_number": 2,
                "name": "Parameterized Rotation Layer",
                "description": "Apply parameterized single-qubit rotations (H and S gates) to explore the Hilbert space.",
                "gate_ids": ["vqe-h0", "vqe-s0"],
                "what_happens": "Generates variational superposition governed by continuous parameter angles."
            },
            {
                "step_number": 3,
                "name": "Entangling Layer (Electron Correlation)",
                "description": "Apply CNOT from q[0] to q[1] to model quantum electron correlation.",
                "gate_ids": ["vqe-cx01"],
                "what_happens": "Captures multi-electron entanglement essential for accurate bond dissociation curves."
            },
            {
                "step_number": 4,
                "name": "Hamiltonian Measurement Basis",
                "description": "Apply change-of-basis gates (S and H) to measure expectation values of molecular Pauli terms (⟨Z⟩, ⟨X⟩, ⟨Y⟩).",
                "gate_ids": ["vqe-s1", "vqe-h1"],
                "what_happens": "Energy ⟨H⟩ = ∑ cᵢ ⟨Pᵢ⟩ is calculated, providing feedback to the classical optimizer."
            }
        ]
    },
    {
        "id": "qaoa",
        "name": "Quantum Approximate Optimization (QAOA)",
        "category": "Advanced",
        "difficulty": 3,
        "num_qubits": 2,
        "purpose": "Solves NP-hard combinatorial optimization problems (such as Graph Max-Cut) using alternating cost and mixer Hamiltonians.",
        "speedup": "Heuristic quantum advantage for NP-hard combinatorial graph search on NISQ processors.",
        "classical_vs_quantum": "Classical approximation algorithms struggle with worst-case graph cuts. QAOA leverages quantum tunneling and interference to escape local minima.",
        "prerequisites": ["Ising Hamiltonian", "Adiabatic Quantum Computing", "Problem vs Mixer Unitaries"],
        "initial_gates": [
            {"id": "qaoa-h0", "type": "H", "target": 0, "step": 1, "control": None},
            {"id": "qaoa-h1", "type": "H", "target": 1, "step": 1, "control": None},
            {"id": "qaoa-cz", "type": "CZ", "target": 1, "step": 2, "control": 0},
            {"id": "qaoa-h0-mix", "type": "H", "target": 0, "step": 3, "control": None},
            {"id": "qaoa-h1-mix", "type": "H", "target": 1, "step": 3, "control": None},
            {"id": "qaoa-z0-mix", "type": "Z", "target": 0, "step": 4, "control": None},
            {"id": "qaoa-z1-mix", "type": "Z", "target": 1, "step": 4, "control": None},
            {"id": "qaoa-h0-f", "type": "H", "target": 0, "step": 5, "control": None},
            {"id": "qaoa-h1-f", "type": "H", "target": 1, "step": 5, "control": None}
        ],
        "steps": [
            {
                "step_number": 1,
                "name": "Initial Equal Superposition",
                "description": "Apply Hadamard gates to all qubits, representing equal probability over all binary cuts.",
                "gate_ids": ["qaoa-h0", "qaoa-h1"],
                "what_happens": "System initialized in the ground state of the transverse field mixer Hamiltonian."
            },
            {
                "step_number": 2,
                "name": "Cost Hamiltonian Layer U(C, γ)",
                "description": "Apply CZ gate to simulate phase evolution under the cut edge Hamiltonian.",
                "gate_ids": ["qaoa-cz"],
                "what_happens": "Encodes problem constraints: states satisfying the cut receive favorable quantum phase."
            },
            {
                "step_number": 3,
                "name": "Mixer Hamiltonian Layer U(B, β)",
                "description": "Apply H-Z-H (= X rotation) across all qubits to induce quantum tunneling between configurations.",
                "gate_ids": ["qaoa-h0-mix", "qaoa-h1-mix", "qaoa-z0-mix", "qaoa-z1-mix", "qaoa-h0-f", "qaoa-h1-f"],
                "what_happens": "Interferes configurations, amplifying states corresponding to maximum cut solutions."
            }
        ]
    }
]


def get_playground_algorithms() -> list[dict]:
    """Returns the full catalog of curated playground algorithms."""
    return PLAYGROUND_ALGORITHMS


def get_playground_algorithm_by_id(algo_id: str) -> dict | None:
    """Finds a specific algorithm by its unique identifier."""
    for algo in PLAYGROUND_ALGORITHMS:
        if algo["id"] == algo_id:
            return algo
    return None
