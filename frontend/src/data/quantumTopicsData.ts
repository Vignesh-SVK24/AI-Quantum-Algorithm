// AUTO-GENERATED FROM SQLite Knowledge Base (55 Curated Quantum Topics)
// Supports full offline search, 0ms latency, and GitHub Pages deployments.

export interface QuantumTopic {
  id: string;
  topic_name: string;
  slug: string;
  category: string;
  short_definition: string;
  beginner_explanation: string;
  detailed_explanation: string;
  mathematical_explanation?: string | null;
  formula?: string | null;
  example?: string | null;
  circuit_example?: string | null;
  related_topics: string[];
  common_mistakes: string[];
  aliases: string[];
  keywords: string[];
  tags: string[];
  source_name?: string | null;
  source_url?: string | null;
  additional_sources?: Array<{ title: string; url: string }>;
  verification_status: string;
  created_at?: string | null;
  updated_at?: string | null;
  status?: string | null;
  knowledge_version?: number | null;
  last_verified_at?: string | null;
  verification_notes?: string | null;
  ingestion_source_id?: string | null;
  difficulty_level?: string | null;
  subcategory?: string | null;
  canonical_circuit?: any;
}

export const QUANTUM_TOPICS_CATALOG: QuantumTopic[] = [
  {
    "id": "amplitude-amplification",
    "topic_name": "Amplitude Amplification",
    "slug": "amplitude-amplification",
    "category": "Algorithms",
    "short_definition": "A fundamental quantum algorithm design technique that generalizes Grover search, boosting the probability of measuring a target subspace from p to near 1 in O(1/√p) iterations.",
    "beginner_explanation": "Suppose you have any randomized quantum algorithm that produces a desired result with a small probability p (say 1%). Classically, to succeed with high probability, you would have to repeat the algorithm ~100 times. Amplitude Amplification acts as a quantum magnifying lens, amplifying the probability amplitude of success so you only need ~√100 = 10 quantum iterations!",
    "detailed_explanation": "Formalized by Brassard, Høyer, Mosca, and Tapp (2000), amplitude amplification generalizes Grover's algorithm to arbitrary initial state preparations A|0⟩ instead of uniform Hadamard superpositions. The Grover iteration Q = -A S₀ A† S_χ consists of an oracle phase reflection S_χ on the good states followed by a diffusion reflection about the state A|0⟩. The state rotates in a 2D subspace spanned by good and bad states by angle 2θ, where sin(θ) = √p.",
    "mathematical_explanation": "Let |ψ⟩ = A|0⟩ = sin(θ)|ψ_good⟩ + cos(θ)|ψ_bad⟩, where p = sin²(θ). The unitary operator Q = -A S₀ A† S_χ rotates the state in this 2D plane: Q^k |ψ⟩ = sin((2k + 1)θ)|ψ_good⟩ + cos((2k + 1)θ)|ψ_bad⟩. Choosing k = ⌊π / (4θ)⌋ ≈ (π/4)/√p yields sin²((2k+1)θ) ≈ 1.",
    "formula": "Q = -A S_0 A^\\dagger S_\\chi, \\quad k_{opt} \\approx \\frac{\\pi}{4\\sqrt{p}} \\text{ queries vs } O(1/p) \\text{ classically}",
    "example": "If a quantum heuristic algorithm finds a valid graph coloring with probability p = 0.0001, classical repetition requires ~10,000 runs. Amplitude amplification requires only ~ (π/4)/√0.0001 ≈ (π/4)·100 ≈ 78 iterations.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Generalized structure: A -> (Oracle -> A_dagger -> Zero_Reflect -> A)^k\nqc = QuantumCircuit(2)\nqc.h([0, 1]) # State preparation A\n# Grover/Amplification operator Q\nqc.cz(0, 1)  # Oracle phase flip\nqc.h([0, 1]); qc.x([0, 1])\nqc.cz(0, 1); qc.x([0, 1]); qc.h([0, 1])",
    "related_topics": [
      "Grover's Algorithm",
      "Quantum Counting",
      "Quantum Amplitude Estimation (QAE)",
      "Quantum Oracle",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Assuming amplitude amplification only works on uniform Hadamard states (it works with any unitary state preparation A).",
      "Overcooking: applying more than the optimal number of iterations rotates past the target state and reduces success probability.",
      "Confusing amplitude amplification with phase estimation (QAE combines both)."
    ],
    "aliases": [
      "amplitude amplification",
      "quantum amplitude amplification",
      "qaa",
      "generalized grover",
      "grover amplification"
    ],
    "keywords": [
      "amplitude amplification",
      "grover",
      "brassard",
      "speedup",
      "quadratic",
      "rotation",
      "magnification",
      "quantum search"
    ],
    "tags": [
      "algorithms",
      "technique",
      "quadratic-speedup",
      "core-concept"
    ],
    "source_name": "Brassard, Høyer, Mosca, & Tapp (2000)",
    "source_url": "https://arxiv.org/abs/quant-ph/0005055",
    "additional_sources": [
      {
        "title": "Qiskit Documentation: Amplitude Amplification",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "amplification_operator",
      "title": "Amplitude Amplification Operator Q",
      "description": "Reflection about target followed by reflection about initial state A|0⟩",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CZ",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 1,
          "step": 2
        },
        {
          "type": "X",
          "target": 0,
          "step": 3
        },
        {
          "type": "X",
          "target": 1,
          "step": 3
        },
        {
          "type": "CZ",
          "target": 1,
          "control": 0,
          "step": 4
        },
        {
          "type": "X",
          "target": 0,
          "step": 5
        },
        {
          "type": "X",
          "target": 1,
          "step": 5
        },
        {
          "type": "H",
          "target": 0,
          "step": 6
        },
        {
          "type": "H",
          "target": 1,
          "step": 6
        }
      ]
    }
  },
  {
    "id": "bell-state",
    "topic_name": "Bell State",
    "slug": "bell-state",
    "category": "Quantum Phenomena",
    "short_definition": "Four specific maximally entangled two-qubit states that form an orthonormal basis for two-qubit Hilbert space.",
    "beginner_explanation": "Bell states (or EPR pairs) are four specific two-qubit states that represent the purest, maximum possible quantum entanglement. They are created in quantum circuits by applying a Hadamard gate to one qubit followed by a CNOT gate connecting both qubits.",
    "detailed_explanation": "The four Bell states {|Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩} form a complete orthonormal basis for the 4-dimensional Hilbert space ℂ⁴. They maximally violate the Bell and CHSH inequalities (reaching the Tsirelson bound of 2√2 ≈ 2.828, exceeding the classical limit of 2).",
    "mathematical_explanation": "The four states are:\n|Φ⁺⟩ = (|00⟩ + |11⟩)/√2\n|Φ⁻⟩ = (|00⟩ - |11⟩)/√2\n|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2\n|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2 (the singlet state)",
    "formula": "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2,  |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2",
    "example": "To generate |Φ⁺⟩: Start with |00⟩ → apply H on q0 to get (|00⟩ + |10⟩)/√2 → apply CNOT(0, 1) to get (|00⟩ + |11⟩)/√2.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)  # Produces |Φ⁺⟩ Bell state",
    "related_topics": [
      "Quantum Entanglement",
      "CNOT Gate",
      "Hadamard Gate"
    ],
    "common_mistakes": [
      "Thinking there is only one Bell state (there are four distinct orthogonal Bell states).",
      "Assuming Bell states can be generated without any multi-qubit entangling gates."
    ],
    "aliases": [
      "bell states",
      "epr pair",
      "epr pairs",
      "bell pair",
      "bell basis",
      "maximally entangled state"
    ],
    "keywords": [
      "bell state",
      "bell pair",
      "epr pair",
      "phi plus",
      "psi minus",
      "maximal entanglement",
      "chsh"
    ],
    "tags": [
      "phenomena",
      "bell-state",
      "entanglement",
      "two-qubit"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#bell-states",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: Bell States and Entanglement",
        "url": "https://learn.qiskit.org/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "bell_state",
      "title": "Maximally Entangled Bell State |Φ⁺⟩",
      "description": "Standard Bell state circuit: H on qubit 0 followed by CNOT(0 → 1)",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "bernstein-vazirani-algorithm",
    "topic_name": "Bernstein–Vazirani Algorithm",
    "slug": "bernstein-vazirani-algorithm",
    "category": "Algorithms",
    "short_definition": "A landmark quantum algorithm that learns an unknown n-bit secret string s hidden inside a linear oracle function f(x) = s · x in exactly 1 query, compared to n classical queries.",
    "beginner_explanation": "Imagine someone sets a secret n-digit binary password, and you have a box that tells you whether your guess shares an even or odd parity with the password. Classically, to uncover an 8-bit password, you must test at least 8 queries (10000000, 01000000, etc.). The Bernstein-Vazirani quantum algorithm finds the entire secret string in just ONE single query, regardless of how long the string is!",
    "detailed_explanation": "The oracle computes the inner product modulo 2: f(x) = s · x = (s₀x₀ ⊕ s₁x₁ ⊕ ... ⊕ s_{n-1}x_{n-1}). The algorithm initializes n input qubits to |0⟩ and an ancilla qubit to |1⟩. Applying Hadamard gates gives |+⟩^⊗n |−⟩. When queried, phase kickback encodes (-1)^(s · x) into each basis amplitude. A final Hadamard transform on the n input qubits inverts the Walsh-Hadamard basis, transforming the state directly into the computational basis state |s⟩.",
    "mathematical_explanation": "Step-by-step state transformation:\n|ψ₀⟩ = |0⟩^⊗n |1⟩\n|ψ₁⟩ = H^⊗(n+1) |ψ₀⟩ = (1/√2ⁿ) ∑_{x} |x⟩ |−⟩\nU_f|ψ₁⟩ = (1/√2ⁿ) ∑_{x} (-1)^{s · x} |x⟩ |−⟩\nH^⊗n (1/√2ⁿ) ∑_{x} (-1)^{s · x} |x⟩ = |s⟩.\nMeasuring the n input qubits yields string s with probability 1.0.",
    "formula": "H^{\\otimes n} \\left( \\frac{1}{\\sqrt{2^n}} \\sum_{x} (-1)^{s \\cdot x} |x\\rangle \\right) = |s\\rangle",
    "example": "For a secret string s = '1011', classical algorithms require 4 separate queries to uncover each bit. Bernstein-Vazirani inputs |0000⟩|1⟩, executes H gates, queries the oracle once, applies H gates, and measures '1011' with 100% probability.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Secret string: s = '101'\nqc = QuantumCircuit(4, 3)\nqc.x(3); qc.h([0,1,2,3])\n# Oracle for s='101': CNOT from q0 and q2 to q3\nqc.cx(0, 3); qc.cx(2, 3)\nqc.h([0,1,2])\nqc.measure([0,1,2], [0,1,2])",
    "related_topics": [
      "Deutsch-Jozsa Algorithm",
      "Quantum Oracle",
      "Hadamard Gate",
      "Phase Kickback",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Assuming Bernstein-Vazirani provides exponential speedup (it provides an O(n) vs 1 query separation, which is a linear speedup in queries).",
      "Forgetting to apply CNOT gates only to qubits where the secret bit s_i is 1.",
      "Thinking the oracle can be any nonlinear function (the promise requires f(x) = s · x)."
    ],
    "aliases": [
      "bernstein-vazirani algorithm",
      "bernstein vazirani",
      "bv algorithm",
      "bv",
      "secret string algorithm",
      "inner product algorithm"
    ],
    "keywords": [
      "bernstein-vazirani",
      "bernstein",
      "vazirani",
      "bv",
      "secret string",
      "inner product",
      "oracle",
      "linear function"
    ],
    "tags": [
      "algorithms",
      "oracle",
      "linear-speedup",
      "exact-algorithm"
    ],
    "source_name": "Bernstein & Vazirani (SIAM J. Comput. 1997)",
    "source_url": "https://doi.org/10.1137/S0097539796300921",
    "additional_sources": [
      {
        "title": "IBM Quantum Learning: Bernstein-Vazirani",
        "url": "https://learning.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 4,
      "circuit_type": "oracle_algorithm",
      "title": "Bernstein-Vazirani Secret String (s='101')",
      "description": "Finds hidden bitstring 101 in a single quantum query",
      "gates": [
        {
          "type": "X",
          "target": 3,
          "step": 0
        },
        {
          "type": "H",
          "target": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 1,
          "step": 1
        },
        {
          "type": "H",
          "target": 2,
          "step": 1
        },
        {
          "type": "H",
          "target": 3,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 0,
          "step": 2
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 2,
          "step": 3
        },
        {
          "type": "H",
          "target": 0,
          "step": 4
        },
        {
          "type": "H",
          "target": 1,
          "step": 4
        },
        {
          "type": "H",
          "target": 2,
          "step": 4
        }
      ]
    }
  },
  {
    "id": "bloch-sphere",
    "topic_name": "Bloch Sphere",
    "slug": "bloch-sphere",
    "category": "Visualization",
    "short_definition": "A unit-sphere geometric representation of all pure states of a single two-level quantum system (qubit).",
    "beginner_explanation": "The Bloch sphere is a 3D globe used to visualize the state of a single qubit. The North Pole corresponds to state |0⟩, the South Pole to state |1⟩, and the equator represents equal superpositions with differing relative phases (like |+⟩, |-⟩, |i⟩, and |-i⟩). Single-qubit quantum gates correspond to rotations of this sphere.",
    "detailed_explanation": "Any pure single-qubit state can be written as |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩, where 0 ≤ θ ≤ π is the polar angle and 0 ≤ φ < 2π is the azimuthal phase angle. This defines a point (x, y, z) = (sin θ cos φ, sin θ sin φ, cos θ) on the surface of the unit sphere. Mixed states reside inside the sphere with radius r < 1.",
    "mathematical_explanation": "Spherical coordinates representation: |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩. Bloch vector components: r_x = ⟨ψ|σ_x|ψ⟩, r_y = ⟨ψ|σ_y|ψ⟩, r_z = ⟨ψ|σ_z|ψ⟩. Pure states satisfy |r| = 1.",
    "formula": "|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩",
    "example": "For θ = π/2 and φ = 0: |ψ⟩ = cos(π/4)|0⟩ + sin(π/4)|1⟩ = (1/√2)(|0⟩ + |1⟩) = |+⟩, located on the equator along the positive X-axis.",
    "circuit_example": "from qiskit.visualization import plot_bloch_multivector\nfrom qiskit.quantum_info import Statevector\nsv = Statevector.from_label('+')\nplot_bloch_multivector(sv)",
    "related_topics": [
      "Qubit",
      "Superposition",
      "Hadamard Gate",
      "X Gate",
      "Z Gate"
    ],
    "common_mistakes": [
      "Trying to visualize multi-qubit entangled states on a single Bloch sphere (entanglement cannot be represented on independent spheres).",
      "Confusing state angles (θ) with physical physical rotation angles (a π/2 rotation rotates state by θ=π)."
    ],
    "aliases": [
      "bloch",
      "bloch sphere",
      "bloch representation",
      "bloch vector",
      "bloch coordinates",
      "bloch sphere visualization"
    ],
    "keywords": [
      "bloch",
      "bloch sphere",
      "bloch vector",
      "polar angle",
      "azimuthal angle",
      "theta",
      "phi",
      "qubit visualization",
      "sphere"
    ],
    "tags": [
      "visualization",
      "bloch-sphere",
      "geometry",
      "qubit"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#the-bloch-sphere",
    "additional_sources": [
      {
        "title": "Qiskit Visualization Guide: Bloch Sphere",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Bloch Sphere State Rotation",
      "description": "Hadamard gate rotating state vector from North Pole (+Z) to the Equator (+X)",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        }
      ]
    }
  },
  {
    "id": "cnot-gate",
    "topic_name": "CNOT Gate",
    "slug": "cnot-gate",
    "category": "Quantum Gates",
    "short_definition": "A two-qubit entangling gate that flips the target qubit if and only if the control qubit is in state |1⟩.",
    "beginner_explanation": "The CNOT (Controlled-NOT) gate operates on two qubits: a control qubit and a target qubit. If the control qubit is 0, the target is left unchanged. If the control qubit is 1, the target qubit is flipped. When combined with a Hadamard gate on the control, CNOT generates quantum entanglement.",
    "detailed_explanation": "In the standard computational basis {|00⟩, |01⟩, |10⟩, |11⟩}, CNOT maps |c⟩|t⟩ to |c⟩|t ⊕ c⟩, where ⊕ denotes addition modulo 2. The 4x4 unitary matrix is [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]. It is an essential component of universal quantum gate sets.",
    "mathematical_explanation": "Matrix: CNOT = [ [1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0] ]. Action: CNOT|00⟩ = |00⟩, CNOT|01⟩ = |01⟩, CNOT|10⟩ = |11⟩, CNOT|11⟩ = |10⟩.",
    "formula": "CNOT|c, t⟩ = |c, c ⊕ t⟩",
    "example": "Starting with state (|0⟩ + |1⟩)/√2 on qubit 0 and |0⟩ on qubit 1: state is (|00⟩ + |10⟩)/√2. Applying CNOT with control 0 and target 1 yields (|00⟩ + |11⟩)/√2, which is the entangled Bell state |Φ⁺⟩.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)  # CNOT with control=0, target=1 (creates Bell state)",
    "related_topics": [
      "Quantum Entanglement",
      "Bell State",
      "Hadamard Gate",
      "Phase Kickback"
    ],
    "common_mistakes": [
      "Thinking CNOT copies the state of the control to the target (violating the No-Cloning Theorem).",
      "Assuming control can never be affected (due to phase kickback, operations on target can alter the control qubit phase)."
    ],
    "aliases": [
      "controlled-not",
      "cx gate",
      "cnot",
      "controlled x",
      "cx operator"
    ],
    "keywords": [
      "cnot",
      "cx gate",
      "controlled not",
      "two qubit gate",
      "entangling gate",
      "control target"
    ],
    "tags": [
      "gates",
      "two-qubit",
      "entanglement",
      "control"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#cnot-gate",
    "additional_sources": [
      {
        "title": "Qiskit API Reference: CXGate",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.CXGate"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "two_qubit",
      "title": "Controlled-NOT (CNOT) Gate",
      "description": "Applies H to control qubit 0, then CNOT(0 → 1) to entangle both qubits into (|00⟩ + |11⟩)/√2",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "deutsch-algorithm",
    "topic_name": "Deutsch Algorithm",
    "slug": "deutsch-algorithm",
    "category": "Algorithms",
    "short_definition": "The historical first quantum algorithm (David Deutsch, 1985) proving that a quantum computer can determine whether a 1-bit function is constant or balanced in a single query.",
    "beginner_explanation": "Imagine you have a black-box coin that can either be fair (balanced: heads on one side, tails on the other) or biased (constant: identical on both sides). Classically, you must look at both sides (2 queries) to know for sure. The Deutsch algorithm uses quantum superposition and interference to determine if the coin is constant or balanced in just ONE single query.",
    "detailed_explanation": "The algorithm examines a function f: {0, 1} → {0, 1}. The circuit initializes input qubit 0 in |0⟩ and ancilla qubit 1 in |1⟩. Both pass through Hadamard gates to create |+⟩|−⟩. The oracle U_f maps |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩. Due to phase kickback from the |−⟩ ancilla, the state becomes (-1)^f(0) [ |0⟩ + (-1)^(f(0)⊕f(1)) |1⟩ ] / √2. A final Hadamard on qubit 0 maps it to |0⟩ if f is constant (f(0) = f(1)) and |1⟩ if f is balanced (f(0) ≠ f(1)).",
    "mathematical_explanation": "Action on the state:\n|ψ₀⟩ = |01⟩\n|ψ₁⟩ = (H ⊗ H)|01⟩ = (|0⟩ + |1⟩)/√2 ⊗ (|0⟩ - |1⟩)/√2\nU_f|ψ₁⟩ = (-1)^f(0) / 2 [ |0⟩ + (-1)^(f(0)⊕f(1)) |1⟩ ] (|0⟩ - |1⟩)\n(H ⊗ I)U_f|ψ₁⟩ = ± |f(0) ⊕ f(1)⟩ |−⟩.\nMeasurement of qubit 0 yields: 0 if constant, 1 if balanced with 100% certainty.",
    "formula": "|\\psi_{\\text{final}}\\rangle = \\pm |f(0) \\oplus f(1)\\rangle |-\\rangle",
    "example": "If f(0)=0 and f(1)=0 (constant), measuring qubit 0 yields 0 with 100% probability. If f(0)=0 and f(1)=1 (balanced), measuring qubit 0 yields 1 with 100% probability.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 1)\nqc.x(1)          # Ancilla to |1>\nqc.h([0, 1])     # Superposition |+>|->\n# [Insert Oracle U_f here]\nqc.h(0)          # Interference on input\nqc.measure(0, 0)",
    "related_topics": [
      "Deutsch-Jozsa Algorithm",
      "Phase Kickback",
      "Hadamard Gate",
      "Quantum Oracle",
      "Superposition"
    ],
    "common_mistakes": [
      "Confusing Deutsch Algorithm (1 input qubit) with Deutsch-Jozsa Algorithm (n input qubits).",
      "Believing the algorithm reveals the actual values f(0) and f(1) (it only extracts the global property f(0) ⊕ f(1)).",
      "Omitting the |1⟩ initialization on the ancilla qubit required for phase kickback."
    ],
    "aliases": [
      "deutsch algorithm",
      "deutsch's algorithm",
      "deutsch problem",
      "single qubit deutsch"
    ],
    "keywords": [
      "deutsch",
      "deutsch algorithm",
      "constant",
      "balanced",
      "oracle",
      "phase kickback",
      "first quantum algorithm"
    ],
    "tags": [
      "algorithms",
      "foundations",
      "oracle",
      "exact-speedup"
    ],
    "source_name": "David Deutsch (Proc. R. Soc. Lond. A 1985)",
    "source_url": "https://doi.org/10.1098/rspa.1985.0070",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: Deutsch-Jozsa Algorithm",
        "url": "https://docs.quantum.ibm.com/guides"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "oracle_algorithm",
      "title": "Deutsch 1-Qubit Algorithm",
      "description": "Determines if 1-bit function is constant or balanced in 1 query",
      "gates": [
        {
          "type": "X",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 1,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "deutsch-jozsa-algorithm",
    "topic_name": "Deutsch-Jozsa Algorithm",
    "slug": "deutsch-jozsa-algorithm",
    "category": "Algorithms",
    "short_definition": "A deterministic quantum algorithm determining whether a Boolean function is constant or balanced in a single query.",
    "beginner_explanation": "The Deutsch-Jozsa algorithm was the first example of a quantum algorithm offering an exponential speedup over classical algorithms. Given a black-box function that is guaranteed to be either constant (returns 0 for all inputs or 1 for all inputs) or balanced (returns 0 for half the inputs and 1 for the other half), Deutsch-Jozsa solves the problem with exactly 1 query, whereas a classical algorithm might need 2^{n-1} + 1 queries in the worst case.",
    "detailed_explanation": "The algorithm initializes n input qubits to |0⟩ and one ancillary qubit to |1⟩. Applying Hadamard gates to all qubits prepares the input in equal superposition and the ancillary qubit in |-⟩. Querying the oracle U_f kicks the function values into the phases of the input register via phase kickback: (1/√2^n) ∑ (-1)^{f(x)} |x⟩. A final layer of Hadamard gates on the input register causes constructive interference on |00...0⟩ if and only if f is constant.",
    "mathematical_explanation": "Final state before measurement: |ψ_final⟩ = (1/2^n) ∑_{y} [ ∑_{x} (-1)^{f(x) + x·y} ] |y⟩. For y = 0...0, the amplitude is (1/2^n) ∑_{x} (-1)^{f(x)}. If f is constant, amplitude is ±1 (measuring |0...0⟩ with probability 1). If f is balanced, amplitude sums to 0 (probability 0).",
    "formula": "1  quantum query vs  2^{n-1} + 1  classical worst-case queries",
    "example": "For n=3 input qubits (8 possible inputs), classical verification may require checking 2² + 1 = 5 inputs in the worst case. Deutsch-Jozsa determines whether f is constant or balanced in 1 evaluation with 100% deterministic success.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 1)\nqc.x(1)  # Ancilla to |1⟩\nqc.h([0, 1])  # Input to |+⟩, ancilla to |-⟩\n# Oracle for balanced f(x) = x\nqc.cx(0, 1)\nqc.h(0)  # Interfere input\nqc.measure(0, 0)  # 1 = balanced, 0 = constant",
    "related_topics": [
      "Phase Kickback",
      "Hadamard Gate",
      "Quantum Interference",
      "Grover's Algorithm"
    ],
    "common_mistakes": [
      "Assuming Deutsch-Jozsa computes what the function values f(x) are (it only computes a global property: constant vs balanced).",
      "Overlooking that the quantum oracle must be implemented as a reversible unitary transformation."
    ],
    "aliases": [
      "deutsch-jozsa algorithm",
      "deutsch jozsa algorithm",
      "deutsch–jozsa algorithm",
      "deutsch-jozsa",
      "deutsch jozsa",
      "deutsch–jozsa",
      "constant vs balanced"
    ],
    "keywords": [
      "deutsch-jozsa algorithm",
      "deutsch-jozsa",
      "constant vs balanced",
      "oracle",
      "exponential speedup",
      "phase kickback"
    ],
    "tags": [
      "algorithms",
      "deutsch-jozsa",
      "oracle",
      "foundations"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/deutsch-jozsa-algorithm",
    "additional_sources": [
      {
        "title": "David Deutsch & Richard Jozsa: Rapid Solution of Problems by Quantum Computation",
        "url": "https://doi.org/10.1098/rspa.1992.0167"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "deutsch_jozsa",
      "title": "Deutsch-Jozsa Algorithm (Balanced Oracle)",
      "description": "Determines function is balanced in 1 query via quantum phase kickback and interference",
      "gates": [
        {
          "type": "X",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 1,
          "step": 1
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "grovers-algorithm",
    "topic_name": "Grover's Algorithm",
    "slug": "grovers-algorithm",
    "category": "Algorithms",
    "short_definition": "A quantum search algorithm providing quadratic speedup O(√N) for searching unstructured databases of N items.",
    "beginner_explanation": "Grover's algorithm searches an unsorted database of N items in roughly √N steps, compared to classical algorithms that require N/2 steps on average. It works by repeatedly flipping the phase of the target item and then inverting all amplitudes about their average (diffusion), amplifying the target item's probability until it is close to 100%.",
    "detailed_explanation": "Grover's algorithm uses two main operators inside a loop executed approximately (π/4)√N times: (1) an Oracle O_f that marks the solution by flipping its phase: O_f|x⟩ = (-1)^{f(x)}|x⟩, and (2) the Grover Diffusion Operator D = 2|s⟩⟨s| - I, which reflects state amplitudes about the mean amplitude. This geometric rotation in 2D state space rotates the state vector toward the solution state.",
    "mathematical_explanation": "Iteration count: R ≈ ⌊(π/4)√(N/M)⌋. State evolution: |ψ_{k+1}⟩ = G |ψ_k⟩ = -(I - 2|s⟩⟨s|) O_f |ψ_k⟩. Each iteration rotates the state vector in the 2D subspace span{|w⟩, |s'⟩} by angle 2θ where sin θ = 1/√N.",
    "formula": "O(√N)  iterations,  G = (2|s⟩⟨s| - I) O_f",
    "example": "In a 4-item database (N=4, 2 qubits), classical search needs up to 4 checks (average 2.25). Grover's algorithm finds the marked item with 100% certainty in exactly 1 iteration because (π/4)√4 = π/2 radians.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h([0, 1])  # Equal superposition\n# Oracle for |11⟩\nqc.cz(0, 1)\n# Diffusion operator\nqc.h([0, 1]); qc.x([0, 1]); qc.cz(0, 1); qc.x([0, 1]); qc.h([0, 1])\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Quantum Interference",
      "Phase Kickback",
      "Hadamard Gate",
      "Deutsch-Jozsa Algorithm"
    ],
    "common_mistakes": [
      "Claiming Grover gives an exponential speedup (it provides a polynomial/quadratic speedup O(√N), unlike Shor's exponential speedup).",
      "Running too many iterations (over-rotation: running beyond (π/4)√N decreases the success probability back down)."
    ],
    "aliases": [
      "grover's algorithm",
      "grovers algorithm",
      "grover's search algorithm",
      "grovers search algorithm",
      "grover search algorithm",
      "grover search",
      "grover",
      "quantum search algorithm",
      "search algorithm",
      "amplitude amplification"
    ],
    "keywords": [
      "grover's algorithm",
      "grover",
      "search algorithm",
      "quantum search",
      "amplitude amplification",
      "diffusion operator",
      "oracle"
    ],
    "tags": [
      "algorithms",
      "grovers",
      "search",
      "amplitude-amplification"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/grovers-algorithm",
    "additional_sources": [
      {
        "title": "Lov K. Grover: A fast quantum mechanical algorithm for database search",
        "url": "https://arxiv.org/abs/quant-ph/9605043"
      },
      {
        "title": "Qiskit Documentation: Grover's Algorithm",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "grover",
      "title": "Grover's Algorithm (2 Qubits)",
      "description": "Superposition -> Oracle -> Diffusion operator, amplifying target state |11⟩ amplitude",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 1
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 2
        },
        {
          "type": "H",
          "target": 1,
          "step": 3
        },
        {
          "type": "H",
          "target": 0,
          "step": 4
        },
        {
          "type": "H",
          "target": 1,
          "step": 4
        },
        {
          "type": "X",
          "target": 0,
          "step": 5
        },
        {
          "type": "X",
          "target": 1,
          "step": 5
        },
        {
          "type": "H",
          "target": 1,
          "step": 6
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 7
        },
        {
          "type": "H",
          "target": 1,
          "step": 8
        },
        {
          "type": "X",
          "target": 0,
          "step": 9
        },
        {
          "type": "X",
          "target": 1,
          "step": 9
        },
        {
          "type": "H",
          "target": 0,
          "step": 10
        },
        {
          "type": "H",
          "target": 1,
          "step": 10
        }
      ]
    }
  },
  {
    "id": "hadamard-gate",
    "topic_name": "Hadamard Gate",
    "slug": "hadamard-gate",
    "category": "Quantum Gates",
    "short_definition": "A fundamental single-qubit gate that maps computational basis states into equal superpositions and vice versa.",
    "beginner_explanation": "The Hadamard gate (H gate) is the essential gate used to create quantum superpositions. Starting from |0⟩, applying H produces an equal superposition where measuring 0 or 1 is equally likely (50% each). Applying H a second time reverses the operation and returns the qubit back to |0⟩.",
    "detailed_explanation": "The Hadamard transformation corresponds to a 180-degree rotation around the diagonal (X+Z)/√2 axis on the Bloch sphere. It maps the Z-basis {|0⟩, |1⟩} to the X-basis {|+⟩, |-⟩}, where |+⟩ = (|0⟩ + |1⟩)/√2 and |-⟩ = (|0⟩ - |1⟩)/√2. Because H is unitary and Hermitian, H² = I.",
    "mathematical_explanation": "Matrix: H = (1/√2) [ [1, 1], [1, -1] ]. Transformation rules: H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2, H|1⟩ = |-⟩ = (|0⟩ - |1⟩)/√2. H|+⟩ = |0⟩, H|-⟩ = |1⟩.",
    "formula": "H = (1/√2) [[1, 1], [1, -1]]",
    "example": "Applying H to state |0⟩: H[1, 0]ᵀ = [1/√2, 1/√2]ᵀ. Applying H again: H(H|0⟩) = H²|0⟩ = I|0⟩ = |0⟩ (demonstrating constructive and destructive quantum interference).",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)  # Puts qubit 0 into equal superposition",
    "related_topics": [
      "Superposition",
      "Quantum Interference",
      "Qubit",
      "Bloch Sphere",
      "X Gate"
    ],
    "common_mistakes": [
      "Assuming H creates a random classical coin toss rather than a coherent reversible superposition.",
      "Thinking H applied to |1⟩ yields the same state as H applied to |0⟩ (H|1⟩ has a minus sign: |-⟩)."
    ],
    "aliases": [
      "h gate",
      "hadamard",
      "h operator",
      "hadamard transform",
      "gate for equal superposition"
    ],
    "keywords": [
      "hadamard",
      "h gate",
      "superposition gate",
      "gate for equal superposition",
      "hadamard transform",
      "plus state",
      "basis change"
    ],
    "tags": [
      "gates",
      "single-qubit",
      "superposition",
      "interference"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits#hadamard-gate",
    "additional_sources": [
      {
        "title": "Qiskit API Reference: HGate",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.HGate"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Hadamard Superposition",
      "description": "Applies H to |0⟩, preparing (|0⟩ + |1⟩)/√2 with 50/50 measurement probability",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        }
      ]
    }
  },
  {
    "id": "hhl-algorithm",
    "topic_name": "HHL Algorithm (Harrow–Hassidim–Lloyd)",
    "slug": "hhl-algorithm",
    "category": "Algorithms",
    "short_definition": "The foundational quantum algorithm for solving systems of linear equations Ax = b, providing an exponential speedup in matrix dimension N over classical solvers.",
    "beginner_explanation": "Linear systems of equations (Ax = b) are used everywhere in science: weather forecasts, aerodynamics, structural engineering, and machine learning. If A is an N x N matrix, classical computers take O(N) or O(N³) operations to solve it. For N = 1 trillion, classical supercomputers grind to a halt. The HHL algorithm solves for the quantum state |x⟩ in time proportional to log(N)—an exponential speedup!",
    "detailed_explanation": "Published in 2009 by Aram Harrow, Avinatan Hassidim, and Seth Lloyd, HHL operates under the assumption that A is a Hermitian s-sparse matrix. The algorithm proceeds in three major stages: 1) Quantum Phase Estimation using unitary e^(i A t) decomposes vector |b⟩ into the eigenbasis of A: ∑_j β_j |u_j⟩ |λ_j⟩. 2) Controlled auxiliary rotation inverts the eigenvalues: |λ_j⟩|0⟩ → |λ_j⟩ (C/λ_j |1⟩ + √(1 - C²/λ_j²) |0⟩). 3) Inverse Phase Estimation uncomputes the eigenvalue register, leaving the state |x⟩ = A⁻¹|b⟩ / ||A⁻¹|b||.",
    "mathematical_explanation": "Let A = \\sum_j \\lambda_j |u_j\\rangle\\langle u_j| and |b\\rangle = \\sum_j \\beta_j |u_j\\rangle.\n1. QPE: \\sum_j \\beta_j |u_j\\rangle |\\lambda_j\\rangle\n2. Controlled rotation on ancilla: \\sum_j \\beta_j |u_j\\rangle |\\lambda_j\\rangle \\left( \\frac{C}{\\lambda_j}|1\\rangle + \\sqrt{1 - \\frac{C^2}{\\lambda_j^2}}|0\\rangle \\right)\n3. QPE^\\dagger and post-selection on ancilla = 1: |x\\rangle \\propto \\sum_j \\frac{\\beta_j}{\\lambda_j} |u_j\\rangle = A^{-1}|b\\rangle.",
    "formula": "T_{HHL} = O\\left( \\kappa^2 s^2 \\frac{\\log N}{\\epsilon} \\right) \\quad \\text{vs} \\quad T_{classical} = O(N s \\kappa \\log(1/\\epsilon))",
    "example": "For a sparse matrix with N = 1,000,000,000 dimensions (10⁹) and condition number κ = 10: classical algorithms require billions of floating-point operations. HHL processes the system on roughly log₂(10⁹) ≈ 30 qubits in O(log N) runtime.",
    "circuit_example": "from qiskit import QuantumCircuit\n# HHL framework: Phase Estimation -> Controlled Rotation -> Inverse QPE\nqc = QuantumCircuit(3, 1)\nqc.h(0)\n# Controlled Hamiltonian evolution e^(iAt)\nqc.cp(1.2, 0, 1)\n# Controlled ancilla rotation based on eigenvalue\nqc.cry(0.8, 0, 2)\nqc.h(0)\nqc.measure(2, 0)",
    "related_topics": [
      "Quantum Phase Estimation",
      "Quantum Linear Systems",
      "Quantum Singular Value Transformation (QSVT)",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Assuming HHL outputs all N entries of vector x as classical numbers (it prepares the quantum state |x⟩; reading all entries would take O(N) measurements!).",
      "Ignoring the condition number κ (if κ is large, the speedup degrades as κ²).",
      "Overlooking the difficulty of efficiently encoding the classical vector b into the quantum state |b⟩."
    ],
    "aliases": [
      "hhl algorithm",
      "harrow-hassidim-lloyd",
      "hhl",
      "quantum linear systems solver",
      "quantum matrix inversion"
    ],
    "keywords": [
      "hhl",
      "linear systems",
      "matrix inversion",
      "ax=b",
      "eigenvalues",
      "exponential speedup",
      "harrow",
      "lloyd"
    ],
    "tags": [
      "algorithms",
      "linear-algebra",
      "exponential-speedup",
      "core-concept"
    ],
    "source_name": "Harrow, Hassidim, & Lloyd (Phys. Rev. Lett. 2009)",
    "source_url": "https://doi.org/10.1103/PhysRevLett.103.150502",
    "additional_sources": [
      {
        "title": "Qiskit Tutorials: Linear Solvers (HHL)",
        "url": "https://qiskit-community.github.io/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "linear_solver",
      "title": "HHL Core Inversion Stage",
      "description": "Eigenvalue estimation, controlled harmonic rotation, and uncomputation",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CZ",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "hidden-subgroup-problem",
    "topic_name": "Hidden Subgroup Problem (HSP)",
    "slug": "hidden-subgroup-problem",
    "category": "Algorithms",
    "short_definition": "The overarching algebraic problem that unifies almost all known exponential quantum speedups (Shor's, Simon's, and Deutsch-Jozsa algorithms) as special cases over group theory.",
    "beginner_explanation": "In mathematics, symmetries are described by groups. The Hidden Subgroup Problem asks: if a function has hidden symmetries (a subgroup H), can a computer discover that symmetry efficiently? For regular 'Abelian' groups (like numbers on a clock), quantum computers solve this exponentially faster than classical computers (which breaks RSA!). For complex 'non-Abelian' groups, it remains one of the deepest frontiers in quantum computing.",
    "detailed_explanation": "Given a group G, a finite set X, and a function f: G → X that is constant on cosets of an unknown subgroup H ≤ G and distinct on different cosets (f(g₁) = f(g₂) ⟺ g₁H = g₂H), the goal is to determine a generating set for H. When G is finite Abelian (G = ℤ_N or ℤ₂ⁿ), the standard quantum Fourier sampling algorithm solves HSP in poly(log |G|) time. When G is non-Abelian (e.g., the symmetric group S_n), solving HSP would yield polynomial-time algorithms for Graph Isomorphism and the Shortest Vector Problem in lattice cryptography.",
    "mathematical_explanation": "General Quantum Algorithm for Abelian HSP:\n1. Prepare |0⟩_G |0⟩_X\n2. Create uniform superposition: (1/√|G|) ∑_{g ∈ G} |g⟩ |0⟩\n3. Query oracle U_f: (1/√|G|) ∑_{g ∈ G} |g⟩ |f(g)⟩\n4. Measure target register, collapsing source to a random coset state |g₀ + H⟩ = (1/√|H|) ∑_{h ∈ H} |g₀ + h⟩\n5. Apply QFT_G and sample: outputs a character χ orthogonal to H (i.e. χ(h) = 1 for all h ∈ H).\nPolynomial samples determine H.",
    "formula": "f(g_1) = f(g_2) \\iff g_1 H = g_2 H, \\quad G = \\mathbb{Z}_2^n \\implies \\text{Simon}, \\quad G = \\mathbb{Z}_N \\implies \\text{Shor}",
    "example": "Deutsch-Jozsa is HSP with G = ℤ₂ and H ∈ {{0}, ℤ₂}. Simon's algorithm is HSP with G = ℤ₂ⁿ and H = {0ⁿ, s}. Shor's factoring algorithm is HSP with G = ℤ and H = rℤ (period finding).",
    "circuit_example": "from qiskit import QuantumCircuit\n# Generalized Abelian HSP framework\nqc = QuantumCircuit(4, 2)\nqc.h([0, 1])     # QFT over G = Z_2 x Z_2\n# [Coset Oracle U_f]\nqc.h([0, 1])     # Inverse QFT over G\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Shor's Algorithm",
      "Simon's Algorithm",
      "Quantum Fourier Transform",
      "Quantum Algorithms",
      "Quantum Cryptography"
    ],
    "common_mistakes": [
      "Assuming non-Abelian HSP is efficiently solved by quantum computers (it remains open and is the foundation of post-quantum lattice security).",
      "Thinking Shor's and Simon's algorithms are unrelated (they are mathematically the same algorithm over different groups).",
      "Believing the coset state measurement immediately gives H (Fourier sampling is required to extract generators)."
    ],
    "aliases": [
      "hidden subgroup problem",
      "hsp",
      "abelian hidden subgroup",
      "non-abelian hsp",
      "coset problem"
    ],
    "keywords": [
      "hsp",
      "hidden subgroup",
      "group theory",
      "abelian",
      "non-abelian",
      "shor",
      "simon",
      "fourier sampling"
    ],
    "tags": [
      "algorithms",
      "algebra",
      "complexity",
      "unifying-framework"
    ],
    "source_name": "Boneh & Lipton (1995) & Mosca & Ekert (1998)",
    "source_url": "https://doi.org/10.1007/3-540-68697-5_34",
    "additional_sources": [
      {
        "title": "Nielsen & Chuang: The Hidden Subgroup Problem",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 4,
      "circuit_type": "algebraic_framework",
      "title": "Hidden Subgroup Fourier Sampling",
      "description": "Group superposition, coset oracle, and Fourier transform extraction",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 1,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "iterative-quantum-phase-estimation",
    "topic_name": "Iterative Quantum Phase Estimation (IQPE)",
    "slug": "iterative-quantum-phase-estimation",
    "category": "Algorithms",
    "short_definition": "A resource-efficient variant of QPE that estimates the phase eigenvalue of a unitary operator bit-by-bit using only a single auxiliary qubit and classical feedback.",
    "beginner_explanation": "Standard Quantum Phase Estimation requires many auxiliary qubits (one for every bit of precision) and a large multi-qubit Inverse Quantum Fourier Transform. Iterative QPE achieves the exact same precision using only ONE single helper qubit by measuring the least significant bit first, applying a phase correction based on the result, and reusing that same qubit for the next bit.",
    "detailed_explanation": "To estimate an m-bit phase φ = 0.φ₁φ₂...φₘ, IQPE runs sequentially for m steps (from k = m down to 1). At step k, the single ancilla is initialized to |+⟩, a controlled-U^(2^(k-1)) gate is applied to the eigenstate register, and a classical phase correction based on previously measured bits is applied. Measuring the ancilla in the X-basis determines bit φ_k with certainty.",
    "mathematical_explanation": "At step k, previously measured bits \\{ \\varphi_{k+1}, \\dots, \\varphi_m \\} produce a known phase shift \\omega_k = 2\\pi \\sum_{l=2}^{m-k+1} \\varphi_{k+l-1} 2^{-l}.\nA phase rotation R_z(-\\omega_k) is applied to the ancilla before the final Hadamard: H R_z(-\\omega_k) |\\psi\\rangle = |\\varphi_k\\rangle.\nQubit requirement is reduced from m + n to 1 + n.",
    "formula": "R_z(-\\omega_k) = \\exp\\left(-i \\pi \\sum_{j=2}^{m-k+1} \\frac{\\varphi_{k+j-1}}{2^{j-1}}\\right)",
    "example": "To estimate a phase to 20 bits of precision, standard QPE requires 20 ancilla qubits. IQPE requires only 1 ancilla qubit, executing 20 successive measurements and dynamic classical feedforward rotations.",
    "circuit_example": "from qiskit import QuantumCircuit\n# 1 ancilla qubit + 1 system qubit\nqc = QuantumCircuit(2, 1)\nqc.h(0)\nqc.cp(0.785, 0, 1) # Controlled-U\nqc.h(0)\nqc.measure(0, 0)\n# Classical feedback resets qubit 0 for next bit",
    "related_topics": [
      "Quantum Phase Estimation",
      "Quantum Fourier Transform",
      "Shor's Algorithm",
      "Variational Quantum Eigensolver (VQE)"
    ],
    "common_mistakes": [
      "Assuming IQPE requires parallel execution of all bits (it is strictly sequential, from least significant to most significant bit).",
      "Thinking IQPE requires mid-circuit measurement without classical feedforward (dynamic circuit reset and feedforward are required).",
      "Believing IQPE has lower accuracy than standard QPE (the precision is mathematically identical)."
    ],
    "aliases": [
      "iterative quantum phase estimation",
      "iterative qpe",
      "iqpe",
      "single ancilla qpe",
      "kitaev phase estimation"
    ],
    "keywords": [
      "iqpe",
      "iterative qpe",
      "phase estimation",
      "single ancilla",
      "nisq",
      "feedforward",
      "kitaev",
      "eigenvalue"
    ],
    "tags": [
      "algorithms",
      "qpe",
      "nisq-friendly",
      "resource-optimization"
    ],
    "source_name": "Kitaev (1995) & Dobšíček et al. (Phys. Rev. A 2007)",
    "source_url": "https://doi.org/10.1103/PhysRevA.76.030306",
    "additional_sources": [
      {
        "title": "Qiskit Tutorials: Iterative Phase Estimation",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "iterative_algorithm",
      "title": "Iterative Phase Estimation Cycle",
      "description": "Single ancilla coupled to eigenstate with dynamic phase feedback",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CZ",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "measurement",
    "topic_name": "Measurement",
    "slug": "measurement",
    "category": "Foundations",
    "short_definition": "The projective operation that extracts classical data from a quantum state according to the Born rule, collapsing the state vector.",
    "beginner_explanation": "Measurement is the bridge connecting the quantum world with our macroscopic classical instruments. When we measure a qubit in superposition, nature picks an outcome with a probability given by the squared amplitude of that outcome. This act irreversibly collapses the superposition, leaving the qubit permanently in the measured basis state.",
    "detailed_explanation": "In standard projective (von Neumann) measurement in the computational Z-basis, the measurement operators are P₀ = |0⟩⟨0| and P₁ = |1⟩⟨1|. The probability of obtaining outcome m ∈ {0, 1} is p(m) = ⟨ψ|P_m|ψ⟩. Post-measurement, the state collapses to P_m|ψ⟩ / √p(m). Quantum measurements are fundamentally non-deterministic and irreversible.",
    "mathematical_explanation": "Born's Rule: For state |ψ⟩ = α|0⟩ + β|1⟩, probability of measuring classical 0 is P(0) = |α|² and outcome 1 is P(1) = |β|². Post-measurement state: |ψ'⟩ = |0⟩ (if measured 0) or |ψ'⟩ = |1⟩ (if measured 1).",
    "formula": "P(m) = |⟨m|ψ⟩|²,  |ψ'⟩ = |m⟩",
    "example": "If |ψ⟩ = √(3/4)|0⟩ + √(1/4)|1⟩, measuring gives 0 with 75% probability and 1 with 25% probability. After getting outcome 0, immediate re-measurement yields 0 with 100% certainty.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)  # Collapses qubit 0 to classical bit 0",
    "related_topics": [
      "Qubit",
      "Superposition",
      "Bloch Sphere"
    ],
    "common_mistakes": [
      "Assuming measurement only 'reveals' a pre-existing hidden classical value (violation of Bell inequalities).",
      "Thinking you can measure without destroying the quantum superposition."
    ],
    "aliases": [
      "quantum measurement",
      "wavefunction collapse",
      "state collapse",
      "projective measurement",
      "born rule",
      "measuring a qubit",
      "probability of measuring a qubit"
    ],
    "keywords": [
      "measurement",
      "born rule",
      "collapse",
      "projective measurement",
      "probability of measuring a qubit",
      "detector",
      "classical register"
    ],
    "tags": [
      "foundations",
      "measurement",
      "born-rule",
      "collapse"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#measurement",
    "additional_sources": [
      {
        "title": "Qiskit Guide: Measuring Quantum States",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": null
  },
  {
    "id": "no-cloning-theorem",
    "topic_name": "No-Cloning Theorem",
    "slug": "no-cloning-theorem",
    "category": "Foundations",
    "short_definition": "A fundamental theorem of quantum mechanics proving that it is mathematically impossible to create an identical, independent copy of an arbitrary unknown quantum state.",
    "beginner_explanation": "In classical computing, copying data is trivial: you copy a file or clone a variable millions of times without altering the original. In quantum computing, copying is forbidden by the laws of physics! If you have an unknown qubit |ψ⟩, no machine can produce |ψ⟩|ψ⟩. This restriction makes quantum computers secure against eavesdropping (BB84), but it also means quantum error correction cannot simply duplicate bits.",
    "detailed_explanation": "Formulated by Wootters, Zurek, and Dieks in 1982, the No-Cloning Theorem is an immediate consequence of the linearity of quantum mechanics and unitary evolution. Suppose there existed a unitary cloning operator U such that for any state |ψ⟩ and blank target |e⟩: U(|ψ⟩|e⟩) = |ψ⟩|ψ⟩. If we test this on two orthogonal states |0⟩ and |1⟩, linearity demands that for a superposition |+⟩ = (|0⟩+|1⟩)/√2, U(|+⟩|e⟩) = (|00⟩+|11⟩)/√2. However, true cloning would require |+⟩|+⟩ = (|00⟩+|01⟩+|10⟩+|11⟩)/2. These two states are completely different!",
    "mathematical_explanation": "Proof by inner product preservation:\nSuppose U|\\psi\\rangle|e\\rangle = |\\psi\\rangle|\\psi\\rangle and U|\\phi\\rangle|e\\rangle = |\\phi\\rangle|\\phi\\rangle.\nSince U is unitary, it preserves inner products:\n\\langle \\psi|\\phi \\rangle \\langle e|e \\rangle = \\langle \\psi|\\phi \\rangle = \\langle \\psi|\\langle \\psi| \\cdot |\\phi\\rangle|\\phi\\rangle = (\\langle \\psi|\\phi \\rangle)^2.\nTherefore:\n\\langle \\psi|\\phi \\rangle - (\\langle \\psi|\\phi \\rangle)^2 = 0 \\implies \\langle \\psi|\\phi \\rangle (1 - \\langle \\psi|\\phi \\rangle) = 0.\nThis equation has only two solutions:\n1) \\langle \\psi|\\phi \\rangle = 0 (orthogonal states)\n2) \\langle \\psi|\\phi \\rangle = 1 (identical states).\nHence, cloning is impossible for non-orthogonal states.",
    "formula": "U|\\psi\\rangle|e\\rangle = |\\psi\\rangle|\\psi\\rangle \\implies \\langle \\psi|\\phi \\rangle = (\\langle \\psi|\\phi \\rangle)^2 \\iff \\langle \\psi|\\phi \\rangle \\in \\{0, 1\\}",
    "example": "Attempting to copy a qubit in state |+⟩ using a CNOT gate with target |0⟩ produces the entangled Bell state (|00⟩+|11⟩)/√2, NOT the cloned independent state |+⟩|+⟩ = (|00⟩+|01⟩+|10⟩+|11⟩)/2.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0) # Prepare |+>\nqc.cx(0, 1) # Entangles instead of cloning! Output is Bell state, not |+>|+>",
    "related_topics": [
      "Quantum Key Distribution",
      "Quantum Teleportation",
      "Quantum Error Correction",
      "Qubit",
      "Quantum State"
    ],
    "common_mistakes": [
      "Thinking known quantum states cannot be prepared multiple times (you CAN prepare 1,000 copies of a KNOWN state; you cannot clone an UNKNOWN arbitrary state).",
      "Believing CNOT clones qubits (CNOT only copies classical computational basis states |0⟩ and |1⟩; on superpositions, it creates entanglement).",
      "Thinking quantum teleportation violates no-cloning (teleportation destroys the original state, transferring it rather than duplicating it)."
    ],
    "aliases": [
      "no-cloning theorem",
      "no cloning",
      "no cloning theorem",
      "quantum no-cloning",
      "wootters zurek theorem"
    ],
    "keywords": [
      "no-cloning",
      "cloning",
      "linearity",
      "unitarity",
      "wootters",
      "zurek",
      "dieks",
      "cryptography",
      "quantum law"
    ],
    "tags": [
      "foundations",
      "theorems",
      "quantum-mechanics",
      "security"
    ],
    "source_name": "Wootters & Zurek (Nature 1982) & Dieks (Phys. Lett. A 1982)",
    "source_url": "https://doi.org/10.1038/299802a0",
    "additional_sources": [
      {
        "title": "Dieks: Communication by EPR devices",
        "url": "https://doi.org/10.1016/0375-9601(82)90084-6"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "theorem_demonstration",
      "title": "CNOT Failed Cloning / Entanglement Test",
      "description": "Shows that trying to clone superposition |+⟩ produces entangled Bell pair instead of independent copy",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "pauli-gates",
    "topic_name": "Pauli Gates",
    "slug": "pauli-gates",
    "category": "Quantum Gates",
    "short_definition": "The foundational set of three single-qubit Hermitian and unitary operators (Pauli-X, Pauli-Y, and Pauli-Z) that represent 180° rotations about the coordinate axes and form a basis for 2x2 matrices.",
    "beginner_explanation": "The Pauli gates (X, Y, and Z) are the building blocks of quantum circuits: Pauli-X is the quantum bit-flip (NOT gate), Pauli-Z is the quantum phase-flip (changing 1 to -1), and Pauli-Y is both a bit-flip and a phase-flip combined. Together with the Identity matrix I, they form the bedrock of quantum error correction and spin mechanics.",
    "detailed_explanation": "The Pauli group on 1 qubit is 𝒫₁ = {±I, ±iI, ±X, ±iX, ±Y, ±iY, ±Z, ±iZ}. The Pauli matrices are both Hermitian (σ = σ†, representing physical observables) and unitary (σ† σ = I, acting as quantum logic gates). They satisfy the commutation and anti-commutation relations: [σ_a, σ_b] = 2i ε_abc σ_c and {σ_a, σ_b} = 2 δ_ab I. Any arbitrary 2x2 complex Hermitian matrix M can be uniquely decomposed as M = c_0 I + c_1 X + c_2 Y + c_3 Z with real coefficients c_i.",
    "mathematical_explanation": "Matrix representations:\nX = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}.\nFundamental algebra:\nX^2 = Y^2 = Z^2 = I,\nXY = iZ, \\quad YZ = iX, \\quad ZX = iY,\nYX = -iZ, \\quad ZY = -iX, \\quad XZ = -iY.",
    "formula": "X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}",
    "example": "Pauli-X flips |0⟩ → |1⟩. Pauli-Z flips |+⟩ → |−⟩. The product XZ applied to |0⟩ yields X(Z|0⟩) = X|0⟩ = |1⟩, while ZX|0⟩ = Z(X|0⟩) = Z|1⟩ = -|1⟩, demonstrating non-commutativity: XZ = -ZX.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.x(0) # Bit-flip\nqc.y(0) # Bit + Phase flip\nqc.z(0) # Phase-flip",
    "related_topics": [
      "X Gate",
      "Y Gate",
      "Z Gate",
      "Bloch Sphere",
      "Quantum Error Correction",
      "Quantum Gates"
    ],
    "common_mistakes": [
      "Assuming Pauli gates commute with each other (they anti-commute: XY = -YX).",
      "Thinking Pauli gates are only gates (they are also the fundamental spin observables measured in quantum physics).",
      "Forgetting that all Pauli matrices square to the Identity matrix (X² = Y² = Z² = I)."
    ],
    "aliases": [
      "pauli gates",
      "pauli-x, y, z gates",
      "pauli-x,y,z gates",
      "pauli-x y z gates",
      "pauli x, y, z gates",
      "pauli x y z gates",
      "pauli xyz gates",
      "pauli matrices",
      "pauli operators",
      "sigma matrices",
      "pauli group",
      "pauli-x y z"
    ],
    "keywords": [
      "pauli",
      "pauli-x",
      "pauli-y",
      "pauli-z",
      "sigma",
      "bit flip",
      "phase flip",
      "hermitian",
      "quantum gates"
    ],
    "tags": [
      "quantum-gates",
      "pauli",
      "foundations",
      "clifford"
    ],
    "source_name": "Wolfgang Pauli (1927) & Nielsen-Chuang",
    "source_url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    "additional_sources": [
      {
        "title": "Qiskit Documentation: Pauli Operators",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.quantum_info.Pauli"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "pauli_sequence",
      "title": "Pauli X, Y, Z Rotation Sequence",
      "description": "Applies Pauli bit-flip, bit-phase flip, and phase-flip operations",
      "gates": [
        {
          "type": "X",
          "target": 0,
          "step": 0
        },
        {
          "type": "Y",
          "target": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "phase-gate",
    "topic_name": "Phase Gate (S Gate)",
    "slug": "phase-gate",
    "category": "Quantum Gates",
    "short_definition": "A fundamental single-qubit Clifford gate that maps |0⟩ → |0⟩ and |1⟩ → i|1⟩, implementing a π/2 (90°) rotation about the Z-axis of the Bloch sphere.",
    "beginner_explanation": "The Phase Gate (commonly called the S gate) is the 'square root of Z'. While the Pauli-Z gate flips the phase by 180° (multiplying |1⟩ by -1), the S gate rotates the phase by 90° (multiplying |1⟩ by the imaginary unit i). Applying two S gates in a row equals a single Z gate (S² = Z).",
    "detailed_explanation": "The S gate is a key element of the single-qubit Clifford group. It leaves the computational basis state |0⟩ invariant while applying a phase factor of e^(iπ/2) = i to |1⟩. On the Bloch sphere, the S gate corresponds to a counter-clockwise rotation by π/2 radians about the Z-axis. It transforms the X-basis states into Y-basis states: S|+⟩ = |+i⟩ = (|0⟩ + i|1⟩)/√2, and S|−⟩ = |−i⟩ = (|0⟩ - i|1⟩)/√2.",
    "mathematical_explanation": "Matrix representation in computational basis:\nS = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/2} \\end{pmatrix}.\nAction on basis states:\nS|0\\rangle = |0\\rangle, \\quad S|1\\rangle = i|1\\rangle.\nAlgebraic properties: S^2 = Z, \\quad S^4 = I, \\quad S^\\dagger = S^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 0 & -i \\end{pmatrix} = S^3.",
    "formula": "S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}, \\quad S^2 = Z, \\quad S|1\\rangle = i|1\\rangle",
    "example": "Applying S to state |+⟩ = (|0⟩+|1⟩)/√2 produces (|0⟩ + i|1⟩)/√2, moving the state vector from the X-axis to the positive Y-axis on the Bloch sphere equator.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0) # Prepare |+>\nqc.s(0) # Rotate to |+i>\nqc.sdg(0) # Inverse S gate (S-dagger)",
    "related_topics": [
      "Z Gate",
      "T Gate",
      "Bloch Sphere",
      "Quantum Gates",
      "Rotation Gates"
    ],
    "common_mistakes": [
      "Confusing S gate with the SWAP gate (S is single-qubit phase gate; SWAP is two-qubit exchange gate).",
      "Assuming S affects measurement probabilities in computational basis (|0⟩, |1⟩ probabilities remain identical; only relative phase changes).",
      "Thinking S is non-Clifford (S is a Clifford gate; T is non-Clifford)."
    ],
    "aliases": [
      "phase gate",
      "s gate",
      "s-gate",
      "sqrt z gate",
      "z90 gate",
      "pi/2 phase gate"
    ],
    "keywords": [
      "phase gate",
      "s gate",
      "z gate",
      "clifford",
      "imaginary",
      "bloch sphere",
      "rotation",
      "pi/2"
    ],
    "tags": [
      "quantum-gates",
      "clifford",
      "single-qubit",
      "phase"
    ],
    "source_name": "Qiskit Gate Documentation & Nielsen-Chuang",
    "source_url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.SGate",
    "additional_sources": [
      {
        "title": "Nielsen & Chuang: Single-qubit operations",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit_gate",
      "title": "Phase (S) Gate Operation",
      "description": "Applies π/2 relative phase shift mapping |+⟩ to |+i⟩",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "S",
          "target": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "phase-kickback",
    "topic_name": "Phase Kickback",
    "slug": "phase-kickback",
    "category": "Techniques",
    "short_definition": "A technique where the eigenvalue phase imparted by a controlled operation on a target qubit is transferred back to the control qubit.",
    "beginner_explanation": "Phase kickback is an ingenious quantum mechanism where an operation applied to a target qubit affects the control qubit instead! When the target is prepared in an eigenstate with eigenvalue -1 (such as the state |-⟩), applying a controlled gate kicks the minus sign back into the control qubit's relative phase.",
    "detailed_explanation": "Suppose a unitary U has eigenstate |u⟩ such that U|u⟩ = e^{iφ}|u⟩. When a controlled-U gate acts on |+⟩|u⟩ = (1/√2)(|0⟩|u⟩ + |1⟩|u⟩), the controlled operation maps |1⟩|u⟩ to e^{iφ}|1⟩|u⟩. The state becomes (1/√2)(|0⟩ + e^{iφ}|1⟩)|u⟩. The phase has been kicked back into the control qubit while the target remains unchanged.",
    "mathematical_explanation": "Controlled-U on control (|0⟩ + |1⟩)/√2 and target |u⟩: C-U [ (|0⟩ + |1⟩)/√2 ⊗ |u⟩ ] = (|0⟩|u⟩ + |1⟩ U|u⟩)/√2 = [ (|0⟩ + e^{iφ}|1⟩)/√2 ] ⊗ |u⟩.",
    "formula": "U_{ctrl} [ (1/√2)(|0⟩ + |1⟩)|u⟩ ] = [ (1/√2)(|0⟩ + e^{iφ}|1⟩) ] |u⟩",
    "example": "With control qubit in |+⟩ and target qubit in |-⟩, applying CNOT yields: CNOT(|+⟩|-⟩) = |-⟩|-⟩. The target |-⟩ is untouched, but the control state flipped from |+⟩ to |-⟩.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)  # Control in |+⟩\nqc.x(1); qc.h(1)  # Target in |-⟩\nqc.cx(0, 1)  # Kicks -1 phase back to qubit 0",
    "related_topics": [
      "Deutsch-Jozsa Algorithm",
      "CNOT Gate",
      "Quantum Interference",
      "Grover's Algorithm"
    ],
    "common_mistakes": [
      "Thinking control qubits can never have their state altered by controlled gates.",
      "Forgetting that target must be in an eigenstate of the conditional unitary for pure phase kickback to occur."
    ],
    "aliases": [
      "kickback",
      "phase kickback effect",
      "eigenvalue kickback"
    ],
    "keywords": [
      "phase kickback",
      "eigenvalue",
      "control qubit",
      "target qubit",
      "deutsch-jozsa",
      "oracle"
    ],
    "tags": [
      "techniques",
      "phase-kickback",
      "circuits",
      "algorithms"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/phase-kickback",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: Phase Kickback",
        "url": "https://learn.qiskit.org/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "two_qubit",
      "title": "Phase Kickback Demonstration",
      "description": "Target in state |−⟩ kicks phase back to control qubit during CNOT",
      "gates": [
        {
          "type": "X",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 1,
          "step": 1
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "qaoa",
    "topic_name": "Quantum Approximate Optimization Algorithm (QAOA)",
    "slug": "qaoa",
    "category": "Algorithms",
    "short_definition": "A hybrid quantum-classical variational algorithm designed to find approximate solutions to combinatorial optimization problems (such as Max-Cut) on NISQ devices.",
    "beginner_explanation": "Many real-world problems (like scheduling flights, logistics routing, or network partitioning) are NP-hard optimization puzzles. QAOA is a quantum algorithm tailored for modern near-term quantum processors. It alternates between applying a 'cost' phase (which rewards good solutions) and a 'mixer' phase (which explores new combinations), letting a classical computer optimize the timing angles to find near-optimal solutions.",
    "detailed_explanation": "Introduced by Farhi, Goldstone, and Gutmann (2014), QAOA maps an optimization problem to an Ising spin Hamiltonian H_C. The circuit starts with an equal superposition |+⟩^⊗n and applies p layers of alternating unitaries: U(C, γ) = e^(-i γ H_C) (cost unitary) and U(B, β) = e^(-i β H_B) (mixer unitary, where H_B = ∑ X_i). The 2p continuous parameters (γ, β) are optimized classically to maximize the expectation value ⟨ψ(γ, β)| H_C |ψ(γ, β)⟩. As layer depth p → ∞, QAOA converges to the exact adiabatic ground state.",
    "mathematical_explanation": "The trial state after p layers:\n|\\psi(\\vec{\\gamma}, \\vec{\\beta})\\rangle = \\prod_{k=1}^{p} e^{-i \\beta_k H_B} e^{-i \\gamma_k H_C} |+\\rangle^{\\otimes n}.\nCost expectation:\nF_p(\\vec{\\gamma}, \\vec{\\beta}) = \\langle \\psi(\\vec{\\gamma}, \\vec{\\beta}) | H_C | \\psi(\\vec{\\gamma}, \\vec{\\beta}) \\rangle.\nClassical optimization solves (\\vec{\\gamma}^*, \\vec{\\beta}^*) = \\arg\\max F_p.",
    "formula": "|\\psi(\\vec{\\gamma}, \\vec{\\beta})\\rangle = e^{-i\\beta_p H_B} e^{-i\\gamma_p H_C} \\dots e^{-i\\beta_1 H_B} e^{-i\\gamma_1 H_C} |+\\rangle^{\\otimes n}",
    "example": "Solving Max-Cut on a 3-node triangle graph: H_C = 0.5(Z₀Z₁ + Z₁Z₂ + Z₀Z₂). QAOA applies parameterized ZZ rotations followed by single-qubit X rotations, optimizing γ and β to yield a cut value of 2 with high probability.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h([0, 1]) # Initial superposition\n# Cost layer (gamma): ZZ rotation\nqc.cx(0, 1); qc.rz(0.5, 1); qc.cx(0, 1)\n# Mixer layer (beta): Rx rotation\nqc.rx(0.8, [0, 1])",
    "related_topics": [
      "Variational Quantum Eigensolver (VQE)",
      "Quantum Annealing",
      "Variational Quantum Algorithms (VQAs)",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Assuming QAOA solves NP-complete problems in polynomial time (it provides approximation ratios, not exact polynomial solutions).",
      "Overlooking that p=1 QAOA is limited in reach on high-degree graphs, requiring deeper layers p > 1.",
      "Confusing QAOA with quantum annealing (QAOA is a digitized, gate-model algorithm with variational optimization)."
    ],
    "aliases": [
      "qaoa",
      "quantum approximate optimization algorithm",
      "quantum approximate optimization",
      "quantum combinatorial optimization"
    ],
    "keywords": [
      "qaoa",
      "optimization",
      "max-cut",
      "variational",
      "farhi",
      "combinatorial",
      "mixer",
      "cost hamiltonian",
      "nisq"
    ],
    "tags": [
      "algorithms",
      "optimization",
      "hybrid-quantum-classical",
      "nisq"
    ],
    "source_name": "Farhi, Goldstone, & Gutmann (arXiv 2014)",
    "source_url": "https://arxiv.org/abs/1411.4028",
    "additional_sources": [
      {
        "title": "Qiskit Optimization Tutorials: QAOA",
        "url": "https://qiskit-community.github.io/qiskit-optimization/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "variational_qaoa",
      "title": "QAOA Layer 1 Circuit",
      "description": "Cost Hamiltonian ZZ evolution followed by transverse-field X mixer",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 1,
          "step": 2
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 3
        },
        {
          "type": "X",
          "target": 0,
          "step": 4
        },
        {
          "type": "X",
          "target": 1,
          "step": 4
        }
      ]
    }
  },
  {
    "id": "qpca",
    "topic_name": "Quantum Principal Component Analysis (qPCA)",
    "slug": "qpca",
    "category": "Machine Learning",
    "short_definition": "A quantum machine learning algorithm that reveals the principal eigenvectors and eigenvalues of an unknown low-rank density matrix ρ in exponential speedup O(log d) time.",
    "beginner_explanation": "Principal Component Analysis (PCA) is the workhorse of data science, compressing massive datasets by finding the most important underlying directions (principal components). For a dataset of dimension d, classical PCA takes O(d²) to O(d³) time, which becomes impossible for billions of dimensions. Quantum PCA performs dimensional reduction exponentially faster in O(log d) time!",
    "detailed_explanation": "Introduced by Lloyd, Mohseni, and Rebentrost (Nature Physics 2014), qPCA treats an unknown density matrix ρ as a Hamiltonian and performs density matrix exponentiation: e^(-i ρ t). By applying Quantum Phase Estimation (QPE) using e^(-i ρ t) as the unitary operator, the algorithm directly reveals the eigenvalues λ_i and projects the state onto the corresponding principal eigenvectors |v_i⟩ in O(log d) gate steps.",
    "mathematical_explanation": "Given multiple copies of quantum state \\rho = \\sum_i \\lambda_i |v_i\\rangle\\langle v_i|:\nUsing swap operators, the operation e^{-i \\rho \\Delta t} is applied to a target state.\nApplying Quantum Phase Estimation yields:\n\\sum_i \\sqrt{\\lambda_i} |v_i\\rangle |\\tilde{\\lambda}_i\\rangle.\nMeasurement of the register outputs the largest eigenvalues and their corresponding principal vectors.",
    "formula": "T_{quantum} = O((\\log d)^2) \\quad \\text{vs} \\quad T_{classical} = O(d^2)",
    "example": "Compressing high-dimensional facial recognition features with d = 1,000,000 dimensions: classical PCA requires calculating a trillion matrix elements (10¹²), whereas qPCA operates on log₂(10⁶) ≈ 20 qubits.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Density matrix exponentiation and Phase Estimation core\nqc = QuantumCircuit(3, 1)\nqc.h(0)\nqc.cswap(0, 1, 2) # Controlled-SWAP for density matrix evolution\nqc.h(0)\nqc.measure(0, 0)",
    "related_topics": [
      "Quantum Machine Learning",
      "Quantum Phase Estimation",
      "HHL Algorithm",
      "Quantum State"
    ],
    "common_mistakes": [
      "Assuming data can be loaded from classical hard drives without state preparation cost (requires efficient quantum RAM or state preparation).",
      "Believing qPCA outputs the full d-dimensional classical vector to screen (it prepares the quantum state |v_i⟩).",
      "Confusing classical linear algebra PCA with density matrix spectral decomposition."
    ],
    "aliases": [
      "qpca",
      "quantum principal component analysis",
      "quantum pca",
      "quantum dimensionality reduction"
    ],
    "keywords": [
      "qpca",
      "principal component analysis",
      "pca",
      "machine learning",
      "eigenvectors",
      "density matrix",
      "exponential speedup",
      "lloyd"
    ],
    "tags": [
      "machine-learning",
      "qml",
      "spectral-analysis",
      "exponential-speedup"
    ],
    "source_name": "Lloyd, Mohseni, & Rebentrost (Nature Physics 2014)",
    "source_url": "https://doi.org/10.1038/nphys3029",
    "additional_sources": [
      {
        "title": "MIT Technology Review: Quantum PCA",
        "url": "https://www.technologyreview.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "spectral_analysis",
      "title": "Quantum PCA Controlled-SWAP Unitary",
      "description": "Density matrix evolution via controlled-swap operations for spectral decomposition",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CSWAP",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "qsvm",
    "topic_name": "Quantum Support Vector Machine (QSVM)",
    "slug": "qsvm",
    "category": "Machine Learning",
    "short_definition": "A quantum machine learning algorithm that maps classical data points into quantum states in a high-dimensional Hilbert space, evaluating kernel functions with quantum speedup.",
    "beginner_explanation": "Classical Support Vector Machines (SVMs) classify data (like spam vs non-spam emails) by finding a dividing boundary. When data cannot be cleanly separated on a flat surface, SVMs use a mathematical 'kernel trick' to map data into higher dimensions where a clean separating boundary exists. QSVM uses quantum circuits as the ultimate feature space, calculating similarities that classical computers cannot compute efficiently!",
    "detailed_explanation": "QSVM operates primarily via Quantum Kernel Estimation (Havlíček et al., Nature 2019). Classical feature vector x is mapped into quantum state |Φ(x)⟩ using a parameterized feature map circuit U_Φ(x). The quantum kernel K(x, x') = |⟨Φ(x)|Φ(x')⟩|² represents transition fidelity between two states, computed by executing U_Φ(x) followed by U_Φ†(x') and measuring all-zero outcome probability |0...0⟩. Once the kernel matrix is evaluated on the quantum computer, a standard classical SVM optimizer determines the optimal separating hyperplane.",
    "mathematical_explanation": "Quantum feature map:\n|\\Phi(x)\\rangle = U_{\\Phi}(x) |0\\rangle^{\\otimes n}.\nQuantum Kernel:\nK(x, x') = |\\langle \\Phi(x') | \\Phi(x) \\rangle|^2 = |\\langle 0^{\\otimes n} | U_{\\Phi}^\\dagger(x') U_{\\Phi}(x) | 0^{\\otimes n} \\rangle|^2.\nMeasurement probability of state |00...0\\rangle directly equals K(x, x').",
    "formula": "K(x_i, x_j) = |\\langle \\Phi(x_j) | \\Phi(x_i) \\rangle|^2 = P(|0\\rangle^{\\otimes n})",
    "example": "Classifying complex biomedical gene expression datasets that have non-linear entanglement correlations: QSVM maps 8 gene markers into an 8-qubit entangled state space (2⁸ = 256 dimensions) where linear separation is achieved.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Quantum Kernel Circuit: U(x) followed by U_dagger(x')\nqc = QuantumCircuit(2, 2)\nqc.h([0, 1]); qc.rz(0.5, [0, 1]); qc.cx(0, 1) # Feature map x\nqc.cx(0, 1); qc.rz(-0.3, [0, 1]); qc.h([0, 1]) # Inverse feature map x'\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Quantum Machine Learning",
      "Quantum Circuits",
      "Variational Quantum Algorithms (VQAs)",
      "Qubit"
    ],
    "common_mistakes": [
      "Believing QSVM replaces all classical machine learning algorithms on tabular data.",
      "Overlooking data encoding overhead (loading classical data into quantum states can become a bottleneck without efficient feature maps).",
      "Assuming quantum kernels always outperform classical RBF kernels without testing dataset structure."
    ],
    "aliases": [
      "qsvm",
      "quantum support vector machine",
      "quantum kernel method",
      "quantum svm",
      "quantum kernel estimation"
    ],
    "keywords": [
      "qsvm",
      "support vector machine",
      "quantum machine learning",
      "qml",
      "kernel",
      "feature map",
      "hilbert space",
      "classification"
    ],
    "tags": [
      "machine-learning",
      "qml",
      "classification",
      "kernel-methods"
    ],
    "source_name": "Havlíček et al. (Nature 2019)",
    "source_url": "https://doi.org/10.1038/s41586-019-0980-2",
    "additional_sources": [
      {
        "title": "Qiskit Machine Learning Documentation",
        "url": "https://qiskit-community.github.io/qiskit-machine-learning/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "quantum_kernel",
      "title": "QSVM Quantum Kernel Estimator",
      "description": "Feature map encoding x followed by adjoint feature map encoding x' to evaluate fidelity",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 2
        },
        {
          "type": "Z",
          "target": 1,
          "step": 3
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 4
        },
        {
          "type": "H",
          "target": 0,
          "step": 5
        },
        {
          "type": "H",
          "target": 1,
          "step": 5
        }
      ]
    }
  },
  {
    "id": "qsvt",
    "topic_name": "Quantum Singular Value Transformation (QSVT)",
    "slug": "qsvt",
    "category": "Algorithms",
    "short_definition": "A monumental unifying framework that transforms the singular values of a block-encoded matrix using polynomial operations, subsuming almost all known quantum algorithms as special cases.",
    "beginner_explanation": "For decades, quantum computing had separate, disparate algorithms: Grover for search, Shor and QPE for eigenvalues, HHL for linear equations, and Trotter for simulation. In 2019, mathematicians discovered Quantum Singular Value Transformation (QSVT)—often called 'the grand unification of quantum algorithms'. QSVT proves that virtually ALL quantum algorithms are just special polynomial transformations applied to the singular values of a matrix!",
    "detailed_explanation": "Introduced by Gilyén, Su, Low, and Wiebe (STOC 2019), QSVT applies polynomial transformations P(A) to any matrix A that has been 'block-encoded' into the top-left corner of a larger unitary matrix U = [[A, *], [*, *]]. By interleaving U, U†, and single-qubit phase rotations e^(i φ_k Π), QSVT transforms each singular value σ_i of A into P(σ_i), where P is an arbitrary polynomial bounded by |P(x)| ≤ 1. When P(x) approximates 1/x, QSVT yields matrix inversion (HHL); when P(x) approximates e^(-i x t), it yields optimal Hamiltonian simulation; when P(x) approximates Chebyshev sign functions, it yields Grover search.",
    "mathematical_explanation": "Singular Value Decomposition: A = W \\Sigma V^\\dagger = \\sum_k \\sigma_k |w_k\\rangle\\langle v_k|.\nBlock encoding: U_A = \\begin{pmatrix} A & \\cdot \\\\ \\cdot & \\cdot \\end{pmatrix}.\nAlternating phase sequence \\Phi = (\\phi_1, \\dots, \\phi_d):\nU_\\Phi = e^{i \\phi_1 \\Pi} U_A e^{i \\phi_2 \\tilde{\\Pi}} U_A^\\dagger \\dots\nTop-left block of U_\\Phi becomes:\nP_{SV}(A) = \\sum_k P(\\sigma_k) |w_k\\rangle\\langle v_k|.",
    "formula": "A = W \\Sigma V^\\dagger \\implies P_{SV}(A) = W P(\\Sigma) V^\\dagger \\quad \\text{via } d \\text{ alternating phase rotations}",
    "example": "To perform optimal Hamiltonian simulation e^(-i H t): QSVT approximates the function f(x) = e^(-i x t) using a Jacobi-Anger expansion of Bessel polynomials of degree d = O(t + log(1/ε)), achieving optimal query complexity matching theoretical lower bounds.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Block-encoding unitary U interleaved with projector phase rotations\nqc = QuantumCircuit(3)\nqc.h(0) # Projector ancilla\nqc.cx(0, 1); qc.rz(0.4, 0); qc.cx(0, 1) # U and phase rotation\nqc.h(0)",
    "related_topics": [
      "HHL Algorithm",
      "Grover's Algorithm",
      "Quantum Linear Systems",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Believing QSVT is limited to square Hermitian matrices (it works on arbitrary rectangular, non-Hermitian matrices).",
      "Assuming finding the phase angles φ_k is trivial (computing angles for high-degree polynomials requires specialized classical optimization algorithms).",
      "Thinking QSVT is an entirely new separate algorithm (it is a unifying mathematical meta-framework)."
    ],
    "aliases": [
      "qsvt",
      "quantum singular value transformation",
      "quantum signal processing",
      "qsp",
      "grand unification of quantum algorithms",
      "block encoding"
    ],
    "keywords": [
      "qsvt",
      "singular value",
      "qsp",
      "quantum signal processing",
      "polynomial",
      "block encoding",
      "gilyen",
      "unification",
      "hamiltonian simulation"
    ],
    "tags": [
      "algorithms",
      "advanced",
      "unifying-framework",
      "meta-algorithm"
    ],
    "source_name": "Gilyén, Su, Low, & Wiebe (STOC 2019)",
    "source_url": "https://doi.org/10.1145/3313276.3316366",
    "additional_sources": [
      {
        "title": "Martyn et al. Grand Unification of Quantum Algorithms (PRX Quantum 2021)",
        "url": "https://doi.org/10.1103/PRXQuantum.2.040203"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "qsvt_sequence",
      "title": "QSVT Alternating Phase Operator",
      "description": "Block-encoding interleaving with single-qubit projector phase rotations",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 2
        },
        {
          "type": "Z",
          "target": 0,
          "step": 3
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 4
        },
        {
          "type": "H",
          "target": 0,
          "step": 5
        }
      ]
    }
  },
  {
    "id": "quantum-advantage",
    "topic_name": "Quantum Advantage",
    "slug": "quantum-advantage",
    "category": "Foundations",
    "short_definition": "The practical and theoretical milestone where a programmable quantum computing device solves a computational problem substantially faster than any feasible classical supercomputer.",
    "beginner_explanation": "Quantum Advantage (also known as Quantum Supremacy) is the historic threshold when a quantum computer performs a task that would take the world's most powerful classical supercomputers thousands of years to compute. It serves as empirical proof that quantum computing provides computational power beyond classical physics.",
    "detailed_explanation": "Demonstrations of quantum advantage have focused on mathematically rigorous sampling problems: Random Circuit Sampling (RCS, e.g. Google's Sycamore in 2019) and Gaussian Boson Sampling (GBS, e.g. USTC Jiuzhang). The goal of current quantum research is 'practical quantum advantage'—achieving speedup on commercially and scientifically valuable problems like drug discovery, catalyst design, battery simulation, and financial portfolio optimization.",
    "mathematical_explanation": "Quantum advantage relies on complexity-theoretic separations under standard assumptions (such as non-collapse of the Polynomial Hierarchy). Sampling the output distribution of random quantum circuits is #P-hard classically, while a quantum processor of depth d on n qubits samples directly in O(d) time using linear-depth unitary transformations.",
    "formula": "T_{classical} \\gg T_{quantum} \\quad \\text{e.g.} \\quad T_{classical} \\sim 10^4 \\text{ years vs } T_{quantum} \\sim 200 \\text{ seconds}",
    "example": "In 2019, Google demonstrated quantum supremacy using the 53-qubit Sycamore processor: it sampled a random quantum circuit in ~200 seconds, a task estimated to take Summit (the top supercomputer at the time) days to years.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Random Circuit Sampling snippet\nqc = QuantumCircuit(3)\nqc.h([0, 1, 2])\nqc.cx(0, 1)\nqc.rz(0.785, 0)\nqc.cx(1, 2)",
    "related_topics": [
      "Quantum Computing",
      "Quantum Algorithms",
      "Quantum Error Correction",
      "Qubit"
    ],
    "common_mistakes": [
      "Thinking quantum advantage means quantum computers are faster at everything.",
      "Confusing synthetic benchmark advantage (e.g. random circuit sampling) with commercial/practical utility.",
      "Assuming classical supercomputer simulation algorithms do not improve to challenge claims."
    ],
    "aliases": [
      "quantum advantage",
      "quantum supremacy",
      "computational advantage",
      "quantum computational supremacy",
      "practical quantum advantage"
    ],
    "keywords": [
      "supremacy",
      "advantage",
      "quantum supremacy",
      "quantum advantage",
      "supercomputer",
      "sampling",
      "sycamore",
      "benchmarking"
    ],
    "tags": [
      "foundations",
      "quantum-advantage",
      "milestone",
      "benchmarking",
      "complexity"
    ],
    "source_name": "Google Quantum AI & Nature",
    "source_url": "https://www.nature.com/articles/s41586-019-1666-5",
    "additional_sources": [
      {
        "title": "Arute et al. Nature (2019) Quantum Supremacy",
        "url": "https://doi.org/10.1038/s41586-019-1666-5"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "advantage_benchmark",
      "title": "Quantum Supremacy Benchmark Circuit",
      "description": "Random entangled circuit exhibiting cross-entropy sampling complexity",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 2,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 1,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "quantum-algorithms",
    "topic_name": "Quantum Algorithms",
    "slug": "quantum-algorithms",
    "category": "Algorithms",
    "short_definition": "Step-by-step computational procedures designed to run on quantum circuits, leveraging superposition, phase kickback, and interference to achieve proven speedups over classical algorithms.",
    "beginner_explanation": "A quantum algorithm is a recipe of quantum gates arranged to solve a specific problem. Unlike classical algorithms that test one possibility at a time, quantum algorithms prepare all inputs in superposition, encode the problem into the phase of the states, and use interference to cancel wrong answers while boosting the correct solution's probability.",
    "detailed_explanation": "Quantum algorithms are classified by the nature of their quantum speedup: polynomial/quadratic speedups (e.g., Grover's unstructured search in O(√N)), exponential speedups (e.g., Shor's factoring in O((log N)³), HHL for linear systems), and oracle separations (Deutsch-Jozsa, Simon's algorithm). Key design primitives include Quantum Fourier Transform (QFT), Amplitude Amplification, Phase Kickback, and Variational hybrid loops.",
    "mathematical_explanation": "Quantum speedups arise from constructive and destructive interference in Hilbert space. If classical algorithms require time T_c(N) = O(N) or O(2^N), a quantum algorithm achieves BQP solvability in time T_q(N) = poly(log N) or O(√N). For instance, Grover achieves quadratic speedup through rotation in a 2D subspace: |s⟩ → (R_s R_w)^k |s⟩ ≈ |w⟩ with k ≈ (π/4)√N iterations.",
    "formula": "T_{quantum}(N) = O(\\sqrt{N}) \\text{ (Grover)} \\quad \\text{vs} \\quad T_{quantum}(N) = O((\\log N)^3) \\text{ (Shor)}",
    "example": "To search an unsorted list of N = 1,000,000 items, classical search requires an average of 500,000 checks. Grover's quantum search finds the item in approximately (π/4)√1,000,000 ≈ 785 iterations.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Generalized quantum algorithm structure: Prepare, Oracle, Amplify, Measure\nqc = QuantumCircuit(3, 3)\nqc.h([0, 1, 2]) # State preparation\n# [Problem Oracle Unitary here]\n# [Interference / Diffusion here]\nqc.measure([0, 1, 2], [0, 1, 2])",
    "related_topics": [
      "Grover's Algorithm",
      "Deutsch-Jozsa Algorithm",
      "Quantum Fourier Transform",
      "Shor's Algorithm",
      "Phase Kickback",
      "Variational Quantum Eigensolver (VQE)"
    ],
    "common_mistakes": [
      "Assuming quantum algorithms speed up all classical algorithms equally (most classical tasks see no speedup).",
      "Confusing quantum parallelism with having millions of computers running independently (interference is required to extract the answer).",
      "Thinking Grover's algorithm solves NP-complete problems in polynomial time (quadratic speedup is not exponential)."
    ],
    "aliases": [
      "quantum algorithms",
      "quantum algorithm",
      "quantum algorithmic speedup",
      "what is a quantum algorithm",
      "quantum speedup",
      "algorithmic speedup"
    ],
    "keywords": [
      "quantum algorithms",
      "quantum algorithm",
      "speedup",
      "grover",
      "shor",
      "deutsch-jozsa",
      "qft",
      "vqe",
      "complexity",
      "bqp",
      "amplitude amplification"
    ],
    "tags": [
      "algorithms",
      "quantum-algorithms",
      "computational-complexity",
      "speedup",
      "core-concept"
    ],
    "source_name": "Nielsen & Chuang & Qiskit Algorithms",
    "source_url": "https://qiskit-community.github.io/qiskit-algorithms/",
    "additional_sources": [
      {
        "title": "Shor's Landmark Paper (1994)",
        "url": "https://ieeexplore.ieee.org/document/365700"
      },
      {
        "title": "Grover's Search Paper (1996)",
        "url": "https://dl.acm.org/doi/10.1145/237814.237866"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "algorithm",
      "title": "Quantum Algorithm Template",
      "description": "3-qubit state preparation and interference transformation",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 2,
          "step": 0
        },
        {
          "type": "X",
          "target": 2,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "quantum-amplitude-estimation",
    "topic_name": "Quantum Amplitude Estimation (QAE)",
    "slug": "quantum-amplitude-estimation",
    "category": "Algorithms",
    "short_definition": "A fundamental quantum subroutine that estimates the probability amplitude a of a quantum state with precision ε in O(1/ε) queries, achieving a quadratic speedup over classical Monte Carlo.",
    "beginner_explanation": "Suppose you want to estimate the probability of a rare financial crash, or evaluate a complex multidimensional integral. Classically, using Monte Carlo simulation, to get an estimate accurate to 1 in 10,000 (ε = 0.0001), you must run 1/ε² = 100,000,000 random samples. Quantum Amplitude Estimation achieves the exact same precision in only 1/ε = 10,000 quantum operations—a quadratic speedup that transforms computational finance!",
    "detailed_explanation": "QAE integrates the Amplitude Amplification operator Q with Quantum Phase Estimation. If A|0⟩ = √a |ψ₁⟩|1⟩ + √(1-a) |ψ₀⟩|0⟩, the Grover operator Q has eigenvalues e^(±i 2θ) where a = sin²(θ). QAE applies QPE with m evaluation qubits to the operator Q, measuring an estimate of 2θ in binary. The estimated probability is then computed as a_est = sin²(θ_est). Modern variations (Maximum Likelihood QAE, Iterative QAE) eliminate the expensive multi-qubit QFT, making it feasible for near-term hardware.",
    "mathematical_explanation": "State decomposition: A|0\\rangle = \\sin(\\theta)|\\psi_1\\rangle|1\\rangle + \\cos(\\theta)|\\psi_0\\rangle|0\\rangle.\nEigenvalues of Q: e^{\\pm i 2\\theta}.\nRunning QPE with m qubits produces an estimate \\tilde{\\theta} such that:\n|a - \\sin^2(\\tilde{\\theta})| \\le \\frac{2\\pi \\sqrt{a(1-a)}}{2^m} + \\frac{\\pi^2}{2^{2m}}.\nTotal queries: N_{queries} = 2^m - 1 = O(1/\\epsilon).",
    "formula": "a = \\sin^2(\\theta), \\quad \\text{Queries: } O\\left(\\frac{1}{\\epsilon}\\right) \\text{ vs } O\\left(\\frac{1}{\\epsilon^2}\\right) \\text{ classical Monte Carlo}",
    "example": "Estimating financial Credit Value at Risk (CVaR) with precision ε = 10⁻⁴: classical Monte Carlo requires 10⁸ sample iterations. QAE achieves this with 10⁴ queries, a 10,000x reduction in query count.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Evaluation register (m qubits) + State register (n qubits)\nqc = QuantumCircuit(4, 2)\nqc.h([0, 1]) # QPE register\nqc.h(2)       # State preparation\n# Controlled-Q and Controlled-Q^2\n# Inverse QFT on [0, 1]\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Amplitude Amplification",
      "Quantum Phase Estimation",
      "Quantum Monte Carlo",
      "Grover's Algorithm"
    ],
    "common_mistakes": [
      "Confusing Amplitude Estimation with Amplitude Amplification (amplification maximizes probability; estimation measures the numerical value of the probability).",
      "Assuming QAE requires fault-tolerant hardware (modern Iterative QAE variants run on NISQ devices).",
      "Overlooking that the quadratic speedup applies to estimation error ε, not problem dimension N."
    ],
    "aliases": [
      "quantum amplitude estimation",
      "qae",
      "amplitude estimation algorithm",
      "quantum monte carlo estimation"
    ],
    "keywords": [
      "qae",
      "amplitude estimation",
      "monte carlo",
      "quadratic speedup",
      "finance",
      "qpe",
      "brassard",
      "risk analysis"
    ],
    "tags": [
      "algorithms",
      "estimation",
      "quadratic-speedup",
      "finance"
    ],
    "source_name": "Brassard, Høyer, Mosca, & Tapp (2000)",
    "source_url": "https://arxiv.org/abs/quant-ph/0005055",
    "additional_sources": [
      {
        "title": "Woerner & Egger: Quantum Risk Analysis (npj Quantum Information 2019)",
        "url": "https://doi.org/10.1038/s41534-019-0130-6"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "amplitude_estimation",
      "title": "Quantum Amplitude Estimation (QAE) Core",
      "description": "Evaluation register coupled to Grover operator Q for phase-based amplitude estimation",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 2,
          "step": 0
        },
        {
          "type": "CZ",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "quantum-annealing",
    "topic_name": "Quantum Annealing",
    "slug": "quantum-annealing",
    "category": "Techniques",
    "short_definition": "A specialized quantum computing method that uses quantum tunneling and adiabatic Hamiltonian evolution to find the global minimum of complex combinatorial optimization problems.",
    "beginner_explanation": "Classical optimization algorithms (like simulated annealing) find optimal solutions by jumping over energy barriers using thermal energy. Quantum annealing allows the system to tunnel directly through steep energy barriers using quantum mechanics, finding the lowest valley (optimal solution) much more efficiently.",
    "detailed_explanation": "Quantum annealing is specifically tailored for solving Quadratic Unconstrained Binary Optimization (QUBO) and Ising spin-glass problems. The system begins in the easily prepared ground state of a strong transverse magnetic field Hamiltonian H_initial. The Hamiltonian is gradually evolved toward the problem Hamiltonian H_problem over annealing time t_a. By the Adiabatic Theorem, if the evolution is slow enough, the system remains in its ground state, which encodes the problem's solution.",
    "mathematical_explanation": "The time-dependent Hamiltonian is H(s) = A(s) H_{initial} + B(s) H_{problem}, where s = t/t_a ∈ [0, 1]. The initial Hamiltonian is H_{initial} = -∑_i σ_i^x (transverse field), and the problem Hamiltonian is H_{problem} = -∑_{i,j} J_{ij} σ_i^z σ_j^z - ∑_i h_i σ_i^z. As s: 0 → 1, A(s) → 0 and B(s) → 1.",
    "formula": "H(t) = A(t/t_a) H_{\\text{initial}} + B(t/t_a) H_{\\text{problem}}, \\quad H_{\\text{problem}} = -\\sum_{i,j} J_{ij}\\sigma_i^z \\sigma_j^z - \\sum_i h_i \\sigma_i^z",
    "example": "Solving the Traveling Salesperson Problem or portfolio optimization by formulating the problem as a 2000-variable QUBO matrix and mapping the couplings J_{ij} onto a D-Wave quantum annealer chip.",
    "circuit_example": "# Quantum annealing is non-gate-based adiabatic evolution\n# Conceptual representation: continuous Hamiltonian interpolation",
    "related_topics": [
      "Quantum Computing",
      "Quantum Algorithms",
      "Variational Quantum Eigensolver (VQE)",
      "Quantum Circuits"
    ],
    "common_mistakes": [
      "Confusing quantum annealing with gate-model universal quantum computing (annealers cannot run Shor's or Grover's algorithms).",
      "Assuming quantum annealing always finds the global minimum (finite temperature and minimum energy gap crossings cause non-adiabatic transitions).",
      "Believing quantum annealing provides an exponential speedup for NP-hard problems (it offers empirical polynomial speedups and better energy minima)."
    ],
    "aliases": [
      "quantum annealing",
      "quantum annealing algorithms",
      "quantum annealing algorithm",
      "adiabatic quantum computation",
      "quantum annealer",
      "d-wave annealing",
      "qubo optimization",
      "adiabatic quantum optimization"
    ],
    "keywords": [
      "annealing",
      "quantum annealing",
      "adiabatic",
      "tunneling",
      "ising model",
      "optimization",
      "qubo",
      "d-wave",
      "energy landscape"
    ],
    "tags": [
      "techniques",
      "quantum-annealing",
      "adiabatic",
      "optimization",
      "combinatorics"
    ],
    "source_name": "Kadowaki & Nishimori (1998) & D-Wave Systems",
    "source_url": "https://journals.aps.org/pre/abstract/10.1103/PhysRevE.58.5355",
    "additional_sources": [
      {
        "title": "Albash & Lidar: Adiabatic quantum computation",
        "url": "https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.90.015002"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "adiabatic_analog",
      "title": "Quantum Annealing Ising Spin Model",
      "description": "2-spin coupled system simulating transverse-field quantum tunneling",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 1,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-circuits",
    "topic_name": "Quantum Circuits",
    "slug": "quantum-circuits",
    "category": "Techniques",
    "short_definition": "A standard computational model where quantum information is represented by quantum wires and transformed by a ordered sequence of quantum logic gates and measurements.",
    "beginner_explanation": "Just as classical electrical circuits route electric current through AND, OR, and NOT gates, a quantum circuit routes quantum states through unitary quantum gates. Time flows from left to right: qubits are initialized, transformed by single and multi-qubit gates, and finally measured to extract classical bits.",
    "detailed_explanation": "The quantum circuit model is universal for quantum computation. A circuit consists of n qubit wires running horizontally. Operations are represented as rectangular gate boxes (single-qubit gates like H, X, Z) or linked control dots and targets (two-qubit gates like CNOT, CZ). Since all closed quantum operations are unitary, circuits without measurements are strictly reversible.",
    "mathematical_explanation": "A circuit on n qubits corresponds to the sequential matrix product of unitary operations U = U_m U_{m-1} ... U_1, where each U_i = G_i ⊗ I represents a gate G_i acting on specific target qubits tensored with identity on spectator qubits. Total circuit depth is the longest path of dependent gates, and circuit size is the total gate count.",
    "formula": "U_{circuit} = \\prod_{t=1}^{T} \\left( \\bigotimes_{k} G_{k,t} \\right) \\quad \\text{with} \\quad U^{\\dagger} U = I",
    "example": "A 2-qubit Bell circuit: Wire 0 passes through H (transforming |0⟩ into (|0⟩+|1⟩)/√2), followed by CNOT targeting wire 1 controlled by wire 0, producing the entangled Bell state (|00⟩+|11⟩)/√2.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.barrier()\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Qubit",
      "Quantum Gates",
      "CNOT Gate",
      "Hadamard Gate",
      "Circuit Builder",
      "Measurement"
    ],
    "common_mistakes": [
      "Assuming quantum wires carry moving electric charges like copper cables (they represent the temporal evolution of qubits).",
      "Placing measurements in the middle of a circuit without realizing it causes irreversible collapse and destroys coherence.",
      "Ignoring circuit depth and qubit connectivity constraints on physical quantum processors."
    ],
    "aliases": [
      "quantum circuit",
      "quantum circuits",
      "circuit model",
      "quantum circuit builder",
      "quantum logic network",
      "quantum wires"
    ],
    "keywords": [
      "circuit",
      "quantum circuit",
      "quantum circuits",
      "quantum wire",
      "gates",
      "unitary evolution",
      "measurement",
      "qiskit circuit",
      "circuit depth"
    ],
    "tags": [
      "techniques",
      "circuit",
      "quantum-circuit",
      "gates",
      "reversibility"
    ],
    "source_name": "IBM Qiskit Documentation & Nielsen-Chuang",
    "source_url": "https://docs.quantum.ibm.com/build",
    "additional_sources": [
      {
        "title": "Qiskit Circuit Library Guide",
        "url": "https://docs.quantum.ibm.com/api/qiskit/circuit_library"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "circuit_model",
      "title": "3-Qubit Quantum Circuit Network",
      "description": "Multi-gate circuit featuring Hadamard, Pauli-X, and CNOT operations",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "X",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 2,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "quantum-computing",
    "topic_name": "Quantum Computing",
    "slug": "quantum-computing",
    "category": "Foundations",
    "short_definition": "A revolutionary computational paradigm that leverages quantum mechanical principles—superposition, entanglement, and interference—to process complex information and solve specific mathematical problems exponentially faster than classical computers.",
    "beginner_explanation": "Classical computers use transistors that represent information as binary bits: strictly 0 or 1. Quantum computing uses quantum bits (qubits), which can exist in quantum states with complex probability amplitudes. By orchestrating quantum superposition, entanglement, and interference, quantum processors explore exponentially vast state spaces simultaneously, amplifying the probability of finding correct answers while canceling wrong paths.",
    "detailed_explanation": "An n-qubit quantum processor operates in a 2^n-dimensional complex Hilbert space. While a classical register of 50 bits can only store one of 2^50 configurations at a time, a 50-qubit quantum register's statevector is a normalized linear combination of all 2^50 basis states. Quantum computation proceeds through unitary transformations (reversible gate operations) governed by the Schrödinger equation, concluding with projective measurements according to Born's rule.",
    "mathematical_explanation": "An n-qubit quantum state is represented as |Ψ⟩ = ∑_{x ∈ {0,1}ⁿ} c_x |x⟩, where c_x ∈ ℂ are probability amplitudes constrained by the normalization condition ∑_{x} |c_x|² = 1. A quantum computation is a sequence of unitary operators U = U_k U_{k-1} ... U_1 acting on |Ψ⟩ such that U† U = I, preserving the norm of the statevector. Measurement projects |Ψ⟩ onto computational basis state |x⟩ with probability P(x) = |⟨x|Ψ⟩|² = |c_x|².",
    "formula": "|Ψ⟩ = ∑_{x=0}^{2ⁿ-1} c_x |x⟩  with  ∑ |c_x|² = 1,  |Ψ_final⟩ = U |Ψ_0⟩",
    "example": "A 3-qubit quantum computer processes a statevector with 2³ = 8 complex amplitudes simultaneously: |Ψ⟩ = c₀|000⟩ + c₁|001⟩ + ... + c₇|111⟩. For n = 300 qubits, 2³⁰⁰ amplitudes exceed the total number of atoms in the observable universe.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)        # Superposition\nqc.cx(0, 1)    # Entanglement\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Qubit",
      "Superposition",
      "Quantum Entanglement",
      "Quantum Algorithms",
      "Quantum Circuits",
      "Quantum Advantage"
    ],
    "common_mistakes": [
      "Believing quantum computers are simply 'faster classical computers' that speed up every program or video game.",
      "Assuming qubits are 'both 0 and 1 simultaneously' rather than possessing a definite state with complex amplitudes.",
      "Thinking quantum computers replace all classical computers, rather than acting as specialized accelerators for specific hard problems."
    ],
    "aliases": [
      "quantum computing",
      "quantum computer",
      "quantum computation",
      "what is quantum computing",
      "intro to quantum computing",
      "quantum information science",
      "quantum tech"
    ],
    "keywords": [
      "quantum computing",
      "quantum computer",
      "qubits",
      "quantum advantage",
      "quantum supremacy",
      "hilbert space",
      "quantum mechanics",
      "quantum processor",
      "quantum technology"
    ],
    "tags": [
      "foundations",
      "quantum-computing",
      "overview",
      "core-concept",
      "architecture"
    ],
    "source_name": "IBM Quantum Learning & Nielsen-Chuang",
    "source_url": "https://learning.quantum.ibm.com/",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: Introduction to Quantum Computing",
        "url": "https://docs.quantum.ibm.com/guides"
      },
      {
        "title": "Nielsen & Chuang: Quantum Computation and Quantum Information",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "entanglement",
      "title": "Foundational Quantum Computing Circuit",
      "description": "2-qubit circuit creating superposition and maximum entanglement (Bell State |Φ⁺⟩)",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-counting",
    "topic_name": "Quantum Counting",
    "slug": "quantum-counting",
    "category": "Algorithms",
    "short_definition": "A hybrid quantum algorithm combining Grover's search operator with Quantum Phase Estimation to estimate the number of solutions M to a search problem in O(√(N/M)) queries.",
    "beginner_explanation": "If you have an unstructured list of N items, Grover's algorithm finds one marked solution, but only if you know roughly how many solutions exist! What if you just want to know HOW MANY solutions exist (e.g. how many paths exist in a network)? Quantum counting solves this by treating the Grover iteration as a rotation and measuring its rotation angle to count solutions with a quadratic speedup.",
    "detailed_explanation": "In Grover search, the iteration operator G rotates the state in a 2D plane by angle 2θ, where sin²(θ) = M/N (with M being the number of solutions among N items). The eigenvalues of G are e^(±i 2θ). Quantum counting applies Quantum Phase Estimation (QPE) to G, estimating the eigenphase 2θ into an auxiliary register. Once θ is determined, M is calculated directly as M = N sin²(θ).",
    "mathematical_explanation": "Eigenvalues of Grover operator G: λ = e^{\\pm i 2\\theta}, where \\sin(\\theta) = \\sqrt{M/N}.\nApplying QPE with t counting qubits yields an estimate \\tilde{\\theta} with precision \\Delta \\theta = O(1/2^t).\nThe estimated count is \\tilde{M} = N \\sin^2(\\tilde{\\theta}).\nQuery complexity is O(\\sqrt{N/M}) to achieve relative error \\epsilon.",
    "formula": "M = N \\sin^2(\\theta), \\quad T_{quantum} = O\\left(\\sqrt{\\frac{N}{M}}\\right) \\text{ vs } O(N) \\text{ classically}",
    "example": "For N = 1024 with M = 64 solutions, classical counting requires checking almost all 1024 items. Quantum counting executes QPE on the Grover operator and estimates M ≈ 64 in roughly √1024 = 32 queries.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Quantum Counting: QPE register (t qubits) + Grover register (n qubits)\nqc = QuantumCircuit(6, 4) # 4 counting qubits, 2 state qubits\nqc.h([0, 1, 2, 3])\nqc.h([4, 5])\n# Controlled-Grover powers here\n# Inverse QFT on [0, 1, 2, 3]\nqc.measure([0, 1, 2, 3], [0, 1, 2, 3])",
    "related_topics": [
      "Grover's Algorithm",
      "Quantum Phase Estimation",
      "Amplitude Amplification",
      "Quantum Amplitude Estimation (QAE)"
    ],
    "common_mistakes": [
      "Assuming quantum counting finds and lists all solutions (it counts the cardinality M without printing the solutions).",
      "Thinking M must be 1 (quantum counting is specifically designed for arbitrary M ≥ 0).",
      "Overlooking that if M = 0, the angle θ = 0, which also diagnoses if NO solutions exist."
    ],
    "aliases": [
      "quantum counting",
      "quantum counting algorithm",
      "counting algorithm",
      "quantum approximate counting",
      "approximate counting",
      "approximate quantum counting",
      "grover counting",
      "brassard hoyer mosca tapp"
    ],
    "keywords": [
      "quantum counting",
      "grover",
      "phase estimation",
      "solution count",
      "qpe",
      "cardinality",
      "quadratic speedup"
    ],
    "tags": [
      "algorithms",
      "counting",
      "quadratic-speedup",
      "qpe"
    ],
    "source_name": "Brassard, Høyer, & Tapp (ICALP 1998)",
    "source_url": "https://doi.org/10.1007/BFb0055082",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: Quantum Counting",
        "url": "https://docs.quantum.ibm.com/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 4,
      "circuit_type": "hybrid_algorithm",
      "title": "Quantum Counting Circuit Core",
      "description": "QPE register coupled via controlled-Grover rotations to determine solution count",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "H",
          "target": 2,
          "step": 0
        },
        {
          "type": "H",
          "target": 3,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 1,
          "step": 1
        },
        {
          "type": "CZ",
          "target": 2,
          "control": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        },
        {
          "type": "H",
          "target": 1,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "quantum-decoherence",
    "topic_name": "Quantum Decoherence",
    "slug": "quantum-decoherence",
    "category": "Foundations",
    "short_definition": "The physical process by which fragile quantum superpositions and phase relationships degrade into classical statistical mixtures through uncontrolled environmental interactions.",
    "beginner_explanation": "Qubits are extremely sensitive to their physical surroundings. Stray electromagnetic fields, temperature fluctuations, and cosmic rays disturb the delicate quantum phases. This loss of quantum information is called decoherence. It is the primary reason quantum computers are housed in dilution refrigerators cooled to near absolute zero (-273°C).",
    "detailed_explanation": "Decoherence is characterized by two fundamental relaxation timescales: T₁ (longitudinal or energy relaxation time, the time a qubit takes to decay from |1⟩ to ground state |0⟩) and T₂ (transverse dephasing time, the time over which the relative phase angle φ between |0⟩ and |1⟩ is randomized). Pure quantum states described by statevectors collapse into mixed states described by density matrices with vanishing off-diagonal coherence terms.",
    "mathematical_explanation": "Under decoherence, the density matrix ρ evolves from a pure state |ψ⟩⟨ψ| (where Tr(ρ²) = 1) to a mixed state (Tr(ρ²) < 1). For phase damping with rate γ, the density matrix elements evolve as ρ₀₁(t) = ρ₀₁(0) e^(-t/T_2). As t → ∞, the off-diagonal interference terms vanish, leaving only classical diagonal probabilities.",
    "formula": "\\rho(t) = \\begin{pmatrix} \\rho_{00} & \\rho_{01}e^{-t/T_2} \\\\ \\rho_{10}e^{-t/T_2} & \\rho_{11} \\end{pmatrix}, \\quad \\frac{1}{T_2} = \\frac{1}{2T_1} + \\frac{1}{T_\\phi}",
    "example": "In superconducting transmon qubits, typical coherence times are T₁ ≈ 100-300 μs and T₂ ≈ 100-200 μs. A two-qubit gate takes ~20-50 ns, allowing several thousand gate operations before decoherence destroys the computation.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Simulating decoherence: state prepared in |+> degrades toward classical mix\nqc = QuantumCircuit(1, 1)\nqc.h(0)\n# Environmental thermal noise delays here\nqc.measure(0, 0)",
    "related_topics": [
      "Qubit",
      "Quantum Error Correction",
      "Bloch Sphere",
      "Superposition",
      "Measurement"
    ],
    "common_mistakes": [
      "Confusing decoherence with active measurement collapse (decoherence is unintentional entanglement with environmental degrees of freedom).",
      "Assuming T₂ can be larger than 2T₁ (the theoretical limit is T₂ ≤ 2T₁).",
      "Believing decoherence completely prevents quantum computing (quantum error correction overcomes it if gate fidelities exceed fault-tolerant thresholds)."
    ],
    "aliases": [
      "quantum decoherence",
      "decoherence",
      "t1 t2 relaxation",
      "quantum noise",
      "dephasing",
      "coherence time",
      "t1 relaxation",
      "t2 dephasing"
    ],
    "keywords": [
      "decoherence",
      "quantum decoherence",
      "noise",
      "relaxation",
      "t1",
      "t2",
      "dephasing",
      "environment",
      "mixed state",
      "density matrix"
    ],
    "tags": [
      "foundations",
      "decoherence",
      "quantum-noise",
      "physics",
      "hardware"
    ],
    "source_name": "Zurek (Physics Today) & Qiskit Hardware Metrics",
    "source_url": "https://doi.org/10.1063/1.881293",
    "additional_sources": [
      {
        "title": "W. H. Zurek: Decoherence and the Transition from Quantum to Classical",
        "url": "https://arxiv.org/abs/quant-ph/0306072"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "environment_coupling",
      "title": "Decoherence Environmental Entanglement Model",
      "description": "System qubit coupling irreversibly with an environmental noise ancilla qubit",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-entanglement",
    "topic_name": "Quantum Entanglement",
    "slug": "quantum-entanglement",
    "category": "Quantum Phenomena",
    "short_definition": "A quantum phenomenon where composite particles cannot be described independently of one another regardless of distance.",
    "beginner_explanation": "Quantum entanglement occurs when two or more qubits become deeply linked such that the state of one qubit cannot be described without referencing the other. Even if separated by light-years, measuring one qubit instantly reveals correlated measurement results for the other, exhibiting correlations stronger than any classical physics allows.",
    "detailed_explanation": "Mathematically, a state |ψ⟩ ∈ ℋ_A ⊗ ℋ_B is entangled if it is non-separable, meaning it cannot be factored as a tensor product |ψ_A⟩ ⊗ |ψ_B⟩. Entanglement is a fundamental resource for quantum teleportation, superdense coding, quantum key distribution (QKD), and quantum error correction.",
    "mathematical_explanation": "Non-separability condition: |ψ⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩. For a Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, tracing out subsystem B yields a maximally mixed reduced density matrix ρ_A = Tr_B(|Φ⁺⟩⟨Φ⁺|) = (1/2)I, indicating maximal entanglement.",
    "formula": "|ψ_{AB}⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩",
    "example": "Two qubits prepared in |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. If Alice measures qubit A and gets 0, Bob will measure qubit B and get 0 with 100% certainty. If Alice gets 1, Bob gets 1. Yet prior to measurement, neither qubit had a predetermined value.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)  # Entangles qubit 0 and qubit 1",
    "related_topics": [
      "Bell State",
      "CNOT Gate",
      "Measurement",
      "Superposition"
    ],
    "common_mistakes": [
      "Believing entanglement enables faster-than-light communication (No-Communication Theorem proves classical communication is always required to decode shared correlations).",
      "Assuming entanglement means physical particles are physically touching or wired together."
    ],
    "aliases": [
      "entanglement",
      "quantum correlations",
      "spooky action at a distance",
      "quantum non-locality"
    ],
    "keywords": [
      "quantum entanglement",
      "entanglement",
      "non-separable",
      "bell pair",
      "epr",
      "teleportation",
      "correlations"
    ],
    "tags": [
      "phenomena",
      "entanglement",
      "multi-qubit",
      "correlations"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#entanglement",
    "additional_sources": [
      {
        "title": "Stanford Encyclopedia of Philosophy: Quantum Entanglement",
        "url": "https://plato.stanford.edu/entries/qt-entangle/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "entanglement",
      "title": "Two-Qubit Entanglement",
      "description": "Creates correlated quantum state where measuring qubit 0 determines qubit 1",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-error-correction",
    "topic_name": "Quantum Error Correction",
    "slug": "quantum-error-correction",
    "category": "Error Correction",
    "short_definition": "A set of techniques that protect quantum information from decoherence and gate errors by encoding a logical qubit into multiple physical qubits, enabling detection and correction of errors without measuring (and thereby collapsing) the encoded state.",
    "beginner_explanation": "Physical quantum hardware is noisy — qubits interact with their environment and accumulate errors over time (decoherence). Quantum error correction (QEC) addresses this by spreading the information of one logical qubit across multiple physical qubits. Crucially, QEC codes allow the detection of which error occurred (through syndrome measurements) without ever learning — or disturbing — the encoded logical quantum state. This is fundamentally different from classical error correction because measuring a quantum state destroys its superposition, so QEC must use ancilla qubits and indirect measurements called syndrome extraction.",
    "detailed_explanation": "Quantum errors can be decomposed into two canonical types on any single qubit: X (bit-flip) errors that map |0⟩↔|1⟩, and Z (phase-flip) errors that introduce a relative phase |+⟩↔|−⟩. Because the Pauli operators {I, X, Y, Z} form a basis for all single-qubit operations, correcting X and Z errors is sufficient to correct any error on a single qubit. The three-qubit bit-flip code encodes |ψ⟩ = α|0⟩ + β|1⟩ as α|000⟩ + β|111⟩. A syndrome measurement (CNOT-based parity check without touching the data qubits directly) identifies which of the three qubits suffered a bit-flip, and a corrective X gate restores the code word. The Shor code (9 physical qubits) extends this to correct arbitrary single-qubit errors. Modern topological codes such as the surface code achieve fault-tolerant thresholds of ~1% physical error rate per gate.",
    "mathematical_explanation": "Three-qubit bit-flip code:\n  Encoding: |0⟩_L = |000⟩, |1⟩_L = |111⟩\n  Logical state: |ψ⟩_L = α|000⟩ + β|111⟩  where |α|² + |β|² = 1\n\nSyndrome operators (stabilizers):\n  S₁ = Z⊗Z⊗I,  S₂ = I⊗Z⊗Z\n  No error: S₁|ψ⟩ = +|ψ⟩, S₂|ψ⟩ = +|ψ⟩\n  Qubit 1 X-error: S₁ → −1, S₂ → +1 → correct qubit 1\n  Qubit 2 X-error: S₁ → −1, S₂ → −1 → correct qubit 2\n  Qubit 3 X-error: S₁ → +1, S₂ → −1 → correct qubit 3\n\nDistance-d surface code: encodes 1 logical qubit in d² physical qubits;\ncorrects ⌊(d−1)/2⌋ arbitrary single-qubit errors.",
    "formula": "Fault-tolerance threshold theorem: if ε_phys < ε_th ≈ 10⁻²,\nthen logical error rate ε_L ∝ (ε_phys / ε_th)^(d+1)/2 → 0 as d → ∞",
    "example": "Shor code (9 qubits, corrects any 1-qubit error):\n  |0⟩_L = (|000⟩ + |111⟩)⊗(|000⟩ + |111⟩)⊗(|000⟩ + |111⟩) / 2√2\n  |1⟩_L = (|000⟩ − |111⟩)⊗(|000⟩ − |111⟩)⊗(|000⟩ − |111⟩) / 2√2\n  This construction corrects any combination of X and Z errors on a single physical qubit.",
    "circuit_example": "from qiskit import QuantumCircuit\n# 3-qubit bit-flip code encoder\nqc = QuantumCircuit(3, 3)\n# Prepare logical |+⟩ state on qubit 0, then spread to code word\nqc.h(0)\nqc.cx(0, 1)  # Encode qubit 0 into qubits 0,1,2\nqc.cx(0, 2)\n# Syndrome measurement uses 2 ancilla qubits (not shown here)\n# Correct and decode:\nqc.cx(0, 1)\nqc.cx(0, 2)\nqc.ccx(1, 2, 0)  # Majority vote correction",
    "related_topics": [
      "Qubit",
      "Quantum Entanglement",
      "Measurement",
      "Superposition",
      "CNOT Gate"
    ],
    "common_mistakes": [
      "Assuming quantum error correction works the same as classical redundancy — QEC uses entanglement and indirect (syndrome) measurements, not direct copying, because cloning an unknown quantum state is forbidden (no-cloning theorem).",
      "Believing QEC eliminates errors entirely — it suppresses the logical error rate below the physical rate, but requires the physical error rate to be below the fault-tolerance threshold.",
      "Confusing decoherence time (T₁, T₂) with the error correction timescale — syndrome extraction must be faster than T₂."
    ],
    "aliases": [
      "quantum error correction",
      "quantum error-correction",
      "quantum error correction algorithms",
      "quantum error-correction algorithms",
      "qec",
      "quantum error correcting codes",
      "fault tolerant quantum computing",
      "surface code",
      "stabilizer codes",
      "shor code",
      "quantum error correcting",
      "error correction quantum computing"
    ],
    "keywords": [
      "error correction",
      "qec",
      "decoherence",
      "surface code",
      "stabilizer",
      "syndrome",
      "logical qubit",
      "fault tolerance",
      "threshold theorem",
      "no-cloning",
      "bit flip",
      "phase flip",
      "shor code"
    ],
    "tags": [
      "error-correction",
      "advanced",
      "fault-tolerance",
      "hardware",
      "stabilizer"
    ],
    "source_name": "IBM Quantum Learning — Error Correction",
    "source_url": "https://learning.quantum.ibm.com/course/foundations-of-quantum-error-correction",
    "additional_sources": [
      {
        "title": "Qiskit Textbook — Introduction to Quantum Error Correction",
        "url": "https://learn.qiskit.org/course/ch-quantum-hardware/introduction-to-quantum-error-correction-via-the-three-qubit-bit-flip-code"
      },
      {
        "title": "Shor (1995) — Scheme for reducing decoherence in quantum computer memory",
        "url": "https://arxiv.org/abs/quant-ph/9605005"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:07.891752+00:00",
    "updated_at": "2026-09-10T08:07:07.891752+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:07.891752+00:00",
    "verification_notes": "Content curated from IBM Quantum Learning and Qiskit Textbook. Threshold theorem statement and Shor code encoding verified against published literature.",
    "ingestion_source_id": "ibm-quantum-learning",
    "difficulty_level": "advanced",
    "subcategory": "Fault-Tolerant Quantum Computing",
    "canonical_circuit": null
  },
  {
    "id": "quantum-fourier-transform",
    "topic_name": "Quantum Fourier Transform",
    "slug": "quantum-fourier-transform",
    "category": "Algorithms",
    "short_definition": "The quantum analogue of the discrete Fourier transform, transforming computational basis states into phase-encoded frequency states.",
    "beginner_explanation": "The Quantum Fourier Transform (QFT) is the quantum version of the classical Discrete Fourier Transform. It translates information stored in the basis states of qubits into the phases of those qubits. It is a key building block in many advanced quantum algorithms, including Shor's factoring algorithm and Quantum Phase Estimation.",
    "detailed_explanation": "QFT maps state |j⟩ to (1/√N) ∑_{k=0}^{N-1} e^{2πi j k / N} |k⟩, where N = 2^n. While classical FFT takes O(n 2^n) operations, QFT performs this transformation on amplitudes using only O(n²) quantum gates (composed of Hadamard gates and controlled phase-rotation gates R_k). Although amplitudes cannot be directly read out, interference enables phase estimation.",
    "mathematical_explanation": "Transformation: QFT|j⟩ = (1/√2^n) ⨂_{l=1}^n [ |0⟩ + e^{2πi j 2^{-l}} |1⟩ ]. Circuit complexity: n Hadamard gates and n(n-1)/2 controlled phase gates R_k = [[1, 0], [0, e^{2πi/2^k}]], totaling O(n²) gates.",
    "formula": "QFT|j⟩ = (1/√2^n) ∑_{k=0}^{2^n-1} e^{2πi jk / 2^n} |k⟩",
    "example": "On 1 qubit, QFT is identical to the Hadamard gate: QFT|0⟩ = (|0⟩ + |1⟩)/√2 and QFT|1⟩ = (|0⟩ - |1⟩)/√2.",
    "circuit_example": "from qiskit.circuit.library import QFT\nqc = QFT(num_qubits=3)  # 3-qubit QFT circuit",
    "related_topics": [
      "Hadamard Gate",
      "Quantum Interference",
      "Phase Kickback",
      "Grover's Algorithm"
    ],
    "common_mistakes": [
      "Assuming QFT can be used to speed up classical Fourier transforms directly (amplitudes cannot be measured directly due to quantum measurement limits).",
      "Forgetting that qubit endianness and bit-reversal SWAP gates are required at the end of the circuit."
    ],
    "aliases": [
      "quantum fourier transform",
      "quantum fourier transform (qft)",
      "quantum fourier transform qft",
      "qft",
      "quantum fourier",
      "fourier transform",
      "quantum dft"
    ],
    "keywords": [
      "quantum fourier transform",
      "qft",
      "fourier",
      "shor's algorithm",
      "phase estimation",
      "frequency domain",
      "phase gates"
    ],
    "tags": [
      "algorithms",
      "qft",
      "transforms",
      "phase-estimation"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-fourier-transform",
    "additional_sources": [
      {
        "title": "Qiskit Circuit Library: QFT",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.QFT"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": null
  },
  {
    "id": "quantum-interference",
    "topic_name": "Quantum Interference",
    "slug": "quantum-interference",
    "category": "Foundations",
    "short_definition": "The wave-like addition or cancellation of complex probability amplitudes across different computational paths.",
    "beginner_explanation": "Quantum algorithms achieve computational speedups primarily through interference. Because probability amplitudes are complex numbers with positive and negative phases, competing computational paths can cancel each other out (destructive interference) or reinforce each other (constructive interference), amplifying the correct solution.",
    "detailed_explanation": "Unlike classical probability theory where probabilities are non-negative real numbers that always sum additively, quantum mechanics adds probability amplitudes α_k before squaring the magnitude to compute probabilities: P = |∑ α_k|² ≠ ∑ |α_k|². The cross-terms represent quantum interference.",
    "mathematical_explanation": "For two paths with amplitudes A = |A|e^{iθ_A} and B = |B|e^{iθ_B}, total probability is P = |A + B|² = |A|² + |B|² + 2|A||B|cos(θ_A - θ_B). When relative phase θ_A - θ_B = π, cos(π) = -1, yielding complete destructive cancellation.",
    "formula": "P = |α₁ + α₂|² = |α₁|² + |α₂|² + 2Re(α₁* α₂)",
    "example": "Applying H twice: H(H|0⟩) = H[(|0⟩ + |1⟩)/√2] = (1/2)[(|0⟩ + |1⟩) + (|0⟩ - |1⟩)] = |0⟩. The paths leading to |1⟩ cancel destructively (+1/2 - 1/2 = 0), while paths to |0⟩ reinforce (+1/2 + 1/2 = 1).",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)\nqc.h(0)  # Destructive interference cancels |1⟩, restoring |0⟩",
    "related_topics": [
      "Superposition",
      "Hadamard Gate",
      "Phase Kickback",
      "Grover's Algorithm"
    ],
    "common_mistakes": [
      "Believing quantum speedup comes merely from 'trying all answers in parallel' without needing constructive interference to extract the result.",
      "Confusing interference with physical electromagnetic wave collision."
    ],
    "aliases": [
      "interference",
      "quantum phase interference",
      "constructive interference",
      "destructive interference"
    ],
    "keywords": [
      "quantum interference",
      "interference",
      "constructive",
      "destructive",
      "amplitudes",
      "phase cancellation",
      "born rule"
    ],
    "tags": [
      "foundations",
      "interference",
      "phase",
      "speedup"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#quantum-interference",
    "additional_sources": [
      {
        "title": "Feynman Lectures on Physics, Vol III: Quantum Behavior",
        "url": "https://www.feynmanlectures.caltech.edu/III_01.html"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Constructive Quantum Interference",
      "description": "Two consecutive Hadamard gates interfere constructively back to original state |0⟩",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-key-distribution",
    "topic_name": "Quantum Key Distribution",
    "slug": "quantum-key-distribution",
    "category": "Cryptography",
    "short_definition": "A cryptographic protocol that uses the properties of quantum mechanics (specifically the no-cloning theorem and measurement disturbance) to allow two parties to establish a shared secret key with information-theoretic security.",
    "beginner_explanation": "Quantum Key Distribution (QKD) allows Alice and Bob to generate a shared random secret key while detecting any eavesdropper (Eve). The most famous protocol is BB84 (Bennett & Brassard, 1984). Alice sends qubits encoded in randomly chosen bases (rectilinear {|0⟩,|1⟩} or diagonal {|+⟩,|−⟩}). Bob measures each qubit in a randomly chosen basis. If Eve intercepts and measures, she inevitably disturbs the quantum states (because measuring an unknown quantum state in the wrong basis changes it irreversibly — the no-cloning theorem prevents Eve from copying the qubits without interaction). Alice and Bob then compare a subset of their bases publicly — mismatches exceed the expected noise level if Eve was present. The undisclosed matching bits form the secret key.",
    "detailed_explanation": "The BB84 protocol uses four non-orthogonal states: |0⟩, |1⟩, |+⟩ = (|0⟩+|1⟩)/√2, |−⟩ = (|0⟩−|1⟩)/√2. Alice encodes classical bits as: bit 0 → |0⟩ (rectilinear) or |+⟩ (diagonal); bit 1 → |1⟩ (rectilinear) or |−⟩ (diagonal), using a random basis choice for each bit. Bob measures each qubit in a randomly chosen basis. When Alice and Bob chose the same basis (probability 1/2), Bob's result matches Alice's bit perfectly. When bases differ, Bob's outcome is random (probability 1/2 correct). After transmission, they publicly compare bases (not results) and keep only the 'sifted key' from matching-basis bits (≈50% of transmitted bits). Security relies on: (1) measuring |+⟩ in the rectilinear basis gives a random outcome, destroying the encoded information; (2) Eve cannot clone the qubit to measure in both bases; (3) any eavesdropping introduces a detectable Quantum Bit Error Rate (QBER) — typically ≥25% for an intercept-resend attack.",
    "mathematical_explanation": "BB84 state encoding:\n  Rectilinear basis (Z): 0 ↦ |0⟩, 1 ↦ |1⟩\n  Diagonal basis (X):    0 ↦ |+⟩ = (|0⟩+|1⟩)/√2, 1 ↦ |−⟩ = (|0⟩−|1⟩)/√2\n\nInner products (non-orthogonal across bases):\n  |⟨0|+⟩|² = 1/2  (rectilinear measurement of diagonal state → 50% error)\n\nEve's intercept-resend QBER:\n  QBER_Eve = 25% (detectable against natural noise threshold)\n\nInformation-theoretic security: guaranteed by Holevo bound and no-cloning theorem.",
    "formula": "QBER = (number of errors in sifted key) / (total sifted bits)\nSecurity threshold: QBER < 11% for BB84 with error correction and privacy amplification",
    "example": "Alice sends 8 qubits, randomly choosing bits and bases:\n  Bits:    0  1  0  0  1  0  1  1\n  Bases:   Z  X  Z  X  Z  X  Z  X\n  States: |0⟩|−⟩|0⟩|+⟩|1⟩|+⟩|1⟩|−⟩\n\nBob measures:\n  Bases:   X  X  Z  Z  Z  X  X  X\n  Matches:    ✓     ✗  ✓  ✓     ✓  (bases agree at positions 2,5,6,8)\n  Sifted key from matching positions: 1,0,1,1 → shared secret bits",
    "circuit_example": "from qiskit import QuantumCircuit\n# BB84: encode bit=1 in diagonal basis (|−⟩ = X then H)\nqc = QuantumCircuit(1, 1)\nqc.x(0)   # Encode bit 1\nqc.h(0)   # Change to diagonal basis → |−⟩\n# Bob decodes in diagonal basis:\nqc.h(0)   # Convert back to rectilinear\nqc.measure(0, 0)  # Measure → should get 1",
    "related_topics": [
      "Superposition",
      "Measurement",
      "Quantum Teleportation",
      "Qubit",
      "Hadamard Gate"
    ],
    "common_mistakes": [
      "Confusing QKD security with computational hardness — QKD provides information-theoretic security (based on physics laws, not algorithmic difficulty), unlike RSA.",
      "Assuming QKD is immune to all attacks — practical implementations have side-channel vulnerabilities not present in the theoretical protocol.",
      "Believing QKD sends the message itself — it only distributes a key; the message is encrypted separately using the key."
    ],
    "aliases": [
      "qkd",
      "bb84",
      "quantum cryptography",
      "bennett brassard 1984",
      "quantum secure communication",
      "quantum key exchange"
    ],
    "keywords": [
      "qkd",
      "bb84",
      "cryptography",
      "eavesdropping",
      "no-cloning",
      "secret key",
      "qber",
      "sifted key",
      "information-theoretic security",
      "privacy amplification"
    ],
    "tags": [
      "cryptography",
      "intermediate",
      "communication",
      "security",
      "bb84"
    ],
    "source_name": "IBM Quantum Learning — Quantum Cryptography",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/entanglement-in-action",
    "additional_sources": [
      {
        "title": "Bennett & Brassard (1984) — Quantum cryptography: Public key distribution and coin tossing",
        "url": "https://arxiv.org/abs/2003.06557"
      },
      {
        "title": "NIST Post-Quantum Cryptography",
        "url": "https://csrc.nist.gov/projects/post-quantum-cryptography"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:08.289291+00:00",
    "updated_at": "2026-09-10T08:07:08.289291+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:08.289291+00:00",
    "verification_notes": "BB84 state encoding table and QBER calculation verified against Bennett & Brassard (1984). Security threshold of 11% is for the full BB84 protocol with error correction.",
    "ingestion_source_id": "ibm-quantum-learning",
    "difficulty_level": "intermediate",
    "subcategory": "Quantum Cryptographic Protocols",
    "canonical_circuit": null
  },
  {
    "id": "quantum-linear-systems",
    "topic_name": "Quantum Linear Systems Algorithms",
    "slug": "quantum-linear-systems",
    "category": "Algorithms",
    "short_definition": "A class of advanced quantum algorithms (including HHL, Fourier series approaches, and QSVT) that solve systems of linear equations and differential equations with exponential speedups.",
    "beginner_explanation": "Solving linear equations (finding x such that Ax = b) is the most computationally intensive calculation in science and big data. Classical computers struggle when equations involve millions of variables. Quantum Linear Systems Algorithms use quantum interference to output a quantum state representing the solution vector exponentially faster than classical computers can compute it.",
    "detailed_explanation": "The field began with the HHL algorithm (2009) with complexity O(κ² s² log(N)/ε). Modern Quantum Linear Systems Algorithms use Quantum Singular Value Transformation (QSVT) and Linear Combinations of Unitaries (LCU) to dramatically improve the dependencies on precision: from polynomial in 1/ε to optimal polylogarithmic dependence O(poly(log(1/ε))). Applications include solving partial differential equations (finite element analysis), electromagnetic scattering, machine learning regression, and PageRank.",
    "mathematical_explanation": "Given s-sparse matrix A ∈ ℂ^{N × N} with condition number κ = λ_max / λ_min, and state |b⟩:\nState prepared: |x⟩ = A⁻¹|b⟩ / ||A⁻¹|b||.\nModern QSVT-based solver runtime:\nT = O(s \\kappa \\log(s \\kappa / \\epsilon) \\log N),\nachieving optimal linear scaling in condition number κ and exponential improvement in precision log(1/ε).",
    "formula": "T_{optimal} = O\\left( s \\kappa \\log\\left(\\frac{1}{\\epsilon}\\right) \\log N \\right)",
    "example": "Simulating heat diffusion or aerodynamic airflows over aircraft wings modeled by a 100,000,000-variable finite difference mesh in minutes rather than weeks.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(3)\nqc.h([0, 1])\nqc.cp(0.6, 0, 1)\nqc.cry(0.5, 0, 2)",
    "related_topics": [
      "HHL Algorithm",
      "Quantum Singular Value Transformation (QSVT)",
      "Quantum Algorithms"
    ],
    "common_mistakes": [
      "Confusing the quantum state |x⟩ with having all classical entries printed out.",
      "Assuming any matrix A can be solved (A must be well-conditioned and efficiently block-encodable).",
      "Overlooking data loading issues for arbitrary non-sparse matrices."
    ],
    "aliases": [
      "quantum linear systems algorithms",
      "quantum linear systems",
      "qlsp",
      "quantum linear solvers",
      "quantum differential equations"
    ],
    "keywords": [
      "quantum linear systems",
      "hhl",
      "linear equations",
      "qsvt",
      "differential equations",
      "matrix inversion",
      "condition number"
    ],
    "tags": [
      "algorithms",
      "linear-algebra",
      "differential-equations",
      "exponential-speedup"
    ],
    "source_name": "Childs, Kothari, & Somma (SIAM J. Comput. 2017)",
    "source_url": "https://doi.org/10.1137/16M1087072",
    "additional_sources": [
      {
        "title": "Ambainis: Variable time amplitude amplification and quantum linear systems",
        "url": "https://arxiv.org/abs/1010.4458"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "linear_system",
      "title": "Quantum Linear Systems Architecture",
      "description": "Block encoding and eigenvalue harmonic inversion circuit",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 1,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "quantum-monte-carlo",
    "topic_name": "Quantum Monte Carlo",
    "slug": "quantum-monte-carlo",
    "category": "Algorithms",
    "short_definition": "A quantum algorithmic paradigm that uses Quantum Amplitude Estimation to compute expected values, high-dimensional integrals, and risk metrics with quadratic speedup over classical Monte Carlo.",
    "beginner_explanation": "Monte Carlo methods solve problems by rolling virtual dice millions of times—simulating everything from stock market fluctuations and insurance risks to neutron transport in nuclear reactors. Classical Monte Carlo converges slowly: to make the estimate 10 times more accurate, you must run 100 times more simulations. Quantum Monte Carlo uses quantum interference to deliver a quadratic speedup, cutting a week of classical computation down to minutes!",
    "detailed_explanation": "Classical Monte Carlo estimates an expectation value E[f(X)] by drawing N independent samples, with statistical error bounded by the Central Limit Theorem: ε = σ / √N. Quantum Monte Carlo encodes probability distribution P(X) into quantum state amplitudes and evaluates function f(x) using quantum arithmetic or Taylor approximations into an ancilla qubit's amplitude. Applying Quantum Amplitude Estimation (QAE) extracts E[f(X)] with error ε = O(1/N_quantum), achieving a quadratic speedup in query complexity.",
    "mathematical_explanation": "State preparation:\n|\\psi\\rangle = \\sum_x \\sqrt{p(x)} |x\\rangle \\left( \\sqrt{1 - f(x)}|0\\rangle + \\sqrt{f(x)}|1\\rangle \\right).\nThe probability of measuring |1\\rangle on the ancilla is exactly:\nP(1) = \\sum_x p(x) f(x) = \\mathbb{E}[f(X)].\nUsing Quantum Amplitude Estimation, \\mathbb{E}[f(X)] is estimated with error \\epsilon in O(1/\\epsilon) queries.",
    "formula": "\\epsilon_{\\text{quantum}} = O\\left(\\frac{1}{N}\\right) \\quad \\text{vs} \\quad \\epsilon_{\\text{classical}} = O\\left(\\frac{1}{\\sqrt{N}}\\right)",
    "example": "Pricing an exotic multi-asset European or barrier option: classical Monte Carlo requires N = 10,000,000 simulation paths for 3-decimal accuracy. Quantum Monte Carlo achieves the same accuracy in ~3,160 quantum circuit evaluations.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Probability distribution preparation + payoff rotation\nqc = QuantumCircuit(3)\nqc.h([0, 1]) # Distribution p(x)\nqc.cry(0.8, 0, 2) # Controlled payoff encoding into qubit 2\nqc.cry(0.4, 1, 2)",
    "related_topics": [
      "Quantum Amplitude Estimation (QAE)",
      "Amplitude Amplification",
      "Quantum Algorithms",
      "Quantum Computing"
    ],
    "common_mistakes": [
      "Confusing quantum algorithms for Monte Carlo estimation with 'classical Quantum Monte Carlo' (QMC is a classical numerical method used in condensed matter physics).",
      "Assuming quantum Monte Carlo eliminates all variance (it provides quadratic query reduction, but the constant factor depends on standard deviation σ).",
      "Ignoring the circuit depth required for nonlinear arithmetic payoff functions."
    ],
    "aliases": [
      "quantum monte carlo",
      "quantum monte carlo estimation",
      "qmc",
      "quantum integration",
      "quantum option pricing"
    ],
    "keywords": [
      "quantum monte carlo",
      "monte carlo",
      "qae",
      "finance",
      "option pricing",
      "integration",
      "risk analysis",
      "quadratic speedup"
    ],
    "tags": [
      "algorithms",
      "finance",
      "numerical-methods",
      "quadratic-speedup"
    ],
    "source_name": "Montanaro (Proc. R. Soc. A 2015)",
    "source_url": "https://doi.org/10.1098/rspa.2015.0301",
    "additional_sources": [
      {
        "title": "Egger et al. Quantum Computing for Finance (IEEE 2020)",
        "url": "https://doi.org/10.1109/MC.2020.3014167"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "monte_carlo",
      "title": "Quantum Monte Carlo Payoff Evaluator",
      "description": "Probability distribution superposition with controlled payoff amplitude encoding",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 2,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "quantum-oracle",
    "topic_name": "Quantum Oracle",
    "slug": "quantum-oracle",
    "category": "Techniques",
    "short_definition": "A unitary black-box subroutine that evaluates a mathematical or Boolean function f(x) on quantum superpositions, encoding answers via phase kickback or register bit-flips.",
    "beginner_explanation": "In quantum algorithm design, an oracle is a 'black box' function that recognizes solutions. Think of it like a lock: you don't need to know the secret combination inside the lock; the lock itself simply tells you 'click' when you try the right key. A quantum oracle evaluates this check on all possible keys in superposition simultaneously!",
    "detailed_explanation": "Because quantum mechanics is strictly reversible, classical non-reversible functions must be embedded into reversible unitary operations. Two primary oracle architectures exist: 1) Bit-flip / Standard Oracles: U_f |x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩, which preserves reversibility using an ancilla register |y⟩. 2) Phase Oracles: O_f |x⟩ = (-1)^f(x) |x⟩ (for Boolean f) or e^(i φ(x)) |x⟩, which directly imparts the function's evaluation into the quantum phase of the computational state.",
    "mathematical_explanation": "Equivalence via Phase Kickback:\nSetting ancilla |y\\rangle = |-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} in a bit-flip oracle:\nU_f |x\\rangle |-\\rangle = \\frac{|x\\rangle |0 \\oplus f(x)\\rangle - |x\\rangle |1 \\oplus f(x)\\rangle}{\\sqrt{2}}\nIf f(x) = 0: |x\\rangle |-\\rangle\nIf f(x) = 1: -|x\\rangle |-\\rangle\nThus: U_f |x\\rangle |-\\rangle = (-1)^{f(x)} |x\\rangle |-\\rangle.\nThe bit-flip oracle automatically functions as a phase oracle without modifying the gate structure!",
    "formula": "U_f |x\\rangle|y\\rangle = |x\\rangle|y \\oplus f(x)\\rangle \\quad \\iff \\quad O_f |x\\rangle = (-1)^{f(x)}|x\\rangle",
    "example": "Grover's search oracle for marked state |11⟩: implemented by a Multi-Controlled-Z (CZ) gate that applies a -1 phase factor only to |11⟩ while leaving |00⟩, |01⟩, and |10⟩ untouched.",
    "circuit_example": "from qiskit import QuantumCircuit\n# Phase Oracle marking state |11>\nqc = QuantumCircuit(2)\nqc.cz(0, 1) # Imparts -1 phase to |11>",
    "related_topics": [
      "Phase Kickback",
      "Grover's Algorithm",
      "Deutsch-Jozsa Algorithm",
      "Bernstein-Vazirani Algorithm",
      "Quantum Circuits"
    ],
    "common_mistakes": [
      "Believing an oracle is a physical hardware chip (it is an algorithmic subroutine representing problem constraints).",
      "Assuming an oracle magically solves the problem on its own (the oracle merely evaluates candidates; interference is required to amplify the answer).",
      "Forgetting to initialize the target ancilla to |−⟩ when relying on phase kickback."
    ],
    "aliases": [
      "quantum oracle",
      "oracle",
      "black box unitary",
      "phase oracle",
      "bit-flip oracle",
      "query complexity oracle"
    ],
    "keywords": [
      "oracle",
      "quantum oracle",
      "black box",
      "phase kickback",
      "grover oracle",
      "deutsch jozsa oracle",
      "boolean function"
    ],
    "tags": [
      "techniques",
      "oracle",
      "query-complexity",
      "core-concept"
    ],
    "source_name": "Nielsen & Chuang & Aaronson",
    "source_url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    "additional_sources": [
      {
        "title": "Scott Aaronson: Quantum Computing Since Democritus",
        "url": "https://www.scottaaronson.com/democritus/"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "oracle_construction",
      "title": "Quantum Bit-Flip & Phase Oracle",
      "description": "Reversible function oracle with ancilla bit-flip and kickback phase shift",
      "gates": [
        {
          "type": "X",
          "target": 2,
          "step": 0
        },
        {
          "type": "H",
          "target": 2,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 2
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 1,
          "step": 3
        },
        {
          "type": "H",
          "target": 2,
          "step": 4
        }
      ]
    }
  },
  {
    "id": "quantum-phase-estimation",
    "topic_name": "Quantum Phase Estimation",
    "slug": "quantum-phase-estimation",
    "category": "Algorithms",
    "short_definition": "A quantum algorithm subroutine that estimates the phase (eigenvalue) φ of a unitary operator U given its eigenvector |ψ⟩, where U|ψ⟩ = e^{2πiφ}|ψ⟩, with precision O(1/2ⁿ) using n ancilla qubits.",
    "beginner_explanation": "Quantum phase estimation (QPE) is a fundamental subroutine used inside many important quantum algorithms, including Shor's algorithm and quantum simulation. Given a unitary gate U and one of its eigenstates |ψ⟩ (satisfying U|ψ⟩ = e^{2πiφ}|ψ⟩), QPE extracts the phase φ as an n-bit binary fraction using n ancilla counting qubits. The key idea is to use the phase kickback phenomenon: controlled-Uᵏ gates imprint the phase information into the computational basis of the counting register, and the inverse Quantum Fourier Transform then reads it out as a binary measurement.",
    "detailed_explanation": "QPE uses two registers: an n-qubit counting register (initialized to |0⟩⊗ⁿ) and a target register containing the eigenstate |ψ⟩. Hadamard gates put the counting register into uniform superposition. Controlled-U^(2^k) gates for k = 0,1,...,n−1 apply phase e^{2πiφ·2ᵏ} to the counting register via phase kickback. After n controlled operations, the counting register holds the state (1/√2ⁿ) Σⱼ e^{2πiφj}|j⟩. Applying QFT⁻¹ maps this to a state sharply peaked at |ñ⟩ where ñ/2ⁿ ≈ φ. Measuring the counting register yields an n-bit approximation of φ with probability ≥ 4/π² ≈ 0.405 for the best approximation, improvable by using more ancilla qubits.",
    "mathematical_explanation": "Setup: U|ψ⟩ = e^{2πiφ}|ψ⟩ where φ ∈ [0,1)\n\nState after controlled-U^(2^k) applications (phase kickback):\n  |Φ⟩ = (1/√2ⁿ) Σⱼ₌₀^{2ⁿ−1} e^{2πiφj} |j⟩ ⊗ |ψ⟩\n\nApply QFT⁻¹:\n  QFT⁻¹|Φ⟩ → |ñ⟩ where ñ = round(φ · 2ⁿ)\n\nPrecision: δφ = 1/2ⁿ (increases as number of counting qubits grows)\nSuccess probability for best n-bit estimate: ≥ 4/π² ≈ 0.405",
    "formula": "U|ψ⟩ = e^{2πiφ}|ψ⟩\nEstimated φ̃ = ñ/2ⁿ  where ñ from measurement of n counting qubits\nPrecision: |φ − φ̃| ≤ 1/2ⁿ",
    "example": "Estimate phase of T gate (T|1⟩ = e^{iπ/4}|1⟩, so φ = 1/8):\n  Use n=3 counting qubits → can represent φ exactly as 0.001₂ = 1/8\n  After QPE: counting register measures |001⟩ = 1₂ → φ̃ = 1/8 ✓",
    "circuit_example": "from qiskit import QuantumCircuit\nfrom qiskit.circuit.library import QFT\nimport numpy as np\n# QPE for T gate (phase = 1/8), n=3 counting qubits\nn = 3\nqpe = QuantumCircuit(n + 1, n)  # n counting + 1 target\nqpe.x(n)                        # Prepare eigenstate |1⟩ of T\nqpe.h(range(n))                 # Superpose counting register\n# Controlled-T^(2^k) gates\nfor k in range(n):\n    angle = 2 * np.pi / (2 ** (n - k))\n    qpe.cp(angle, k, n)         # Controlled phase kickback\n# Inverse QFT on counting register\nqpe.compose(QFT(n, inverse=True), qubits=range(n), inplace=True)\nqpe.measure(range(n), range(n))",
    "related_topics": [
      "Quantum Fourier Transform",
      "Phase Kickback",
      "Shor's Algorithm",
      "Hadamard Gate",
      "Superposition"
    ],
    "common_mistakes": [
      "Confusing QPE with QFT — QPE is an algorithm that uses QFT as a subroutine, not the same thing.",
      "Assuming QPE works for any input state — it only reliably extracts the phase when given an eigenstate of U; arbitrary states give a superposition of eigenvalue estimates.",
      "Forgetting that n counting qubits give precision 1/2ⁿ — doubling precision requires one additional qubit."
    ],
    "aliases": [
      "quantum phase estimation",
      "quantum phase estimation (qpe)",
      "quantum phase estimation qpe",
      "qpe",
      "phase estimation",
      "quantum phase estimation algorithm",
      "eigenvalue estimation",
      "kitaev phase estimation"
    ],
    "keywords": [
      "phase estimation",
      "qpe",
      "eigenvalue",
      "unitary",
      "phase kickback",
      "qft",
      "counting register",
      "ancilla",
      "eigenstate"
    ],
    "tags": [
      "algorithms",
      "advanced",
      "phase",
      "qft",
      "subroutine"
    ],
    "source_name": "Qiskit Textbook — Quantum Phase Estimation",
    "source_url": "https://learn.qiskit.org/course/ch-algorithms/quantum-phase-estimation",
    "additional_sources": [
      {
        "title": "IBM Quantum Learning — Phase Estimation",
        "url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:08.516009+00:00",
    "updated_at": "2026-09-10T08:07:08.516009+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:08.516009+00:00",
    "verification_notes": "Phase kickback mechanism, QFT subroutine connection, and precision bounds verified against Qiskit Textbook and Nielsen & Chuang Chapter 5.",
    "ingestion_source_id": "qiskit-textbook",
    "difficulty_level": "advanced",
    "subcategory": "Phase-Based Subroutines",
    "canonical_circuit": null
  },
  {
    "id": "quantum-state",
    "topic_name": "Quantum State",
    "slug": "quantum-state",
    "category": "Foundations",
    "short_definition": "The complete mathematical description of a quantum physical system, represented as a statevector in Hilbert space for pure states, or as a density matrix for mixed states.",
    "beginner_explanation": "In classical physics, a state is simple: a car is at position x moving at speed v; a coin is either heads or tails. In quantum physics, a state is described by probability amplitudes. A pure quantum state has zero classical uncertainty—it is a specific vector pointing in Hilbert space. When a quantum system interacts with a noisy environment, it becomes a 'mixed state' (a statistical probability mixture of pure states).",
    "detailed_explanation": "For an isolated quantum system, a pure state is represented by a normalized ray in a complex Hilbert space: |ψ⟩ ∈ ℋ with ⟨ψ|ψ⟩ = 1. When a system is entangled with an environment or characterized by classical uncertainty, it is described by a density operator ρ on ℋ. A valid density matrix satisfies three postulates: 1) Hermiticity (ρ = ρ†), 2) Positive semi-definiteness (ρ ≥ 0, all eigenvalues λ_i ≥ 0), and 3) Unit trace (Tr(ρ) = ∑ λ_i = 1). The purity of a state is quantified by Tr(ρ²): Tr(ρ²) = 1 for pure states, and Tr(ρ²) < 1 for mixed states (reaching 1/d for maximally mixed states).",
    "mathematical_explanation": "Pure state:\n|\\psi\\rangle = \\sum_i c_i |i\\rangle, \\quad \\sum_i |c_i|^2 = 1, \\quad \\rho = |\\psi\\rangle\\langle\\psi|.\nMixed state (ensemble of pure states |\\psi_k\\rangle with probabilities p_k):\n\\rho = \\sum_k p_k |\\psi_k\\rangle\\langle\\psi_k|, \\quad p_k \\ge 0, \\quad \\sum_k p_k = 1.\nExpectation value of observable A: \\langle A \\rangle = \\text{Tr}(\\rho A).",
    "formula": "\\rho = \\sum_k p_k |\\psi_k\\rangle\\langle\\psi_k|, \\quad \\text{Tr}(\\rho) = 1, \\quad \\text{Tr}(\\rho^2) \\le 1",
    "example": "A qubit in pure state |+⟩ has density matrix ρ = |+⟩⟨+| = 0.5[[1, 1], [1, 1]], where Tr(ρ²) = 1. A completely decohered qubit has maximally mixed density matrix ρ = 0.5[[1, 0], [0, 1]], where Tr(ρ²) = 0.5.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0) # Prepares pure superposition state |+>",
    "related_topics": [
      "Qubit",
      "Superposition",
      "Measurement",
      "Bloch Sphere",
      "Quantum Decoherence"
    ],
    "common_mistakes": [
      "Confusing a quantum superposition state with a classical mixed state (superpositions have phase coherence and interference; mixed states do not).",
      "Assuming global phase factors e^(iθ) represent different physical states (states differing only by global phase represent the exact same physical ray).",
      "Believing you can determine an unknown quantum state from a single measurement (quantum state tomography requires many identically prepared copies)."
    ],
    "aliases": [
      "quantum state",
      "quantum states",
      "statevector",
      "density matrix",
      "pure state",
      "mixed state",
      "density operator"
    ],
    "keywords": [
      "quantum state",
      "statevector",
      "density matrix",
      "pure state",
      "mixed state",
      "hilbert space",
      "purity",
      "born rule"
    ],
    "tags": [
      "foundations",
      "statevector",
      "density-matrix",
      "core-concept"
    ],
    "source_name": "Nielsen & Chuang (Cambridge University Press)",
    "source_url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    "additional_sources": [
      {
        "title": "Preskill's Quantum Information Notes: Chapter 2",
        "url": "http://theory.caltech.edu/~preskill/ph219/chap2.pdf"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "state_preparation",
      "title": "Quantum State Preparation",
      "description": "Prepares arbitrary pure single-qubit statevector via unitary rotation",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "quantum-teleportation",
    "topic_name": "Quantum Teleportation",
    "slug": "quantum-teleportation",
    "category": "Quantum Phenomena",
    "short_definition": "A quantum communication protocol that transfers the exact quantum state |ψ⟩ of a qubit from a sender (Alice) to a receiver (Bob) using a shared Bell pair and two classical bits, without physically transmitting the qubit.",
    "beginner_explanation": "Quantum teleportation does not transmit matter or energy — it transmits quantum information (a qubit's state) using a pre-shared entangled resource (a Bell pair) plus two classical communication bits. Alice holds the qubit she wants to send and one qubit of a Bell pair; Bob holds the other Bell pair qubit. Alice performs a joint Bell-basis measurement on her two qubits, which collapses Bob's qubit into a state related to the original. Alice sends the two measurement outcomes (classical bits) to Bob, who applies at most two corrective gates to recover the exact original state. Importantly, no information travels faster than light — the two classical bits must be transmitted conventionally.",
    "detailed_explanation": "The protocol proceeds in three stages. First, Alice and Bob share a maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. Alice also holds the qubit to teleport: |ψ⟩ = α|0⟩ + β|1⟩ (with |α|² + |β|² = 1). Second, Alice entangles her qubit with her Bell pair qubit using a CNOT followed by a Hadamard, creating a three-qubit state that can be written as (1/2)[|00⟩(α|0⟩+β|1⟩) + |01⟩(α|1⟩+β|0⟩) + |10⟩(α|0⟩−β|1⟩) + |11⟩(α|1⟩−β|0⟩)]. Alice measures her two qubits in the computational basis, obtaining one of four outcomes. Third, Alice sends the two classical bits to Bob, who applies X and/or Z corrections depending on the bits received, recovering |ψ⟩ exactly. The no-cloning theorem is not violated: Alice's original qubit is always destroyed by her measurement.",
    "mathematical_explanation": "Initial 3-qubit state (Alice holds qubits 0,1; Bob holds qubit 2):\n  |ψ⟩₀ ⊗ |Φ⁺⟩₁₂ = (α|0⟩ + β|1⟩) ⊗ (|00⟩ + |11⟩)/√2\n\nAfter CNOT(0→1) then H(0):\n  = (1/2)[|00⟩(α|0⟩+β|1⟩) + |01⟩(α|1⟩+β|0⟩)\n         + |10⟩(α|0⟩−β|1⟩) + |11⟩(α|1⟩−β|0⟩)]\n\nAlice measures qubits 0,1 → outcome (m₀,m₁); sends to Bob.\nBob applies: Z^(m₀) · X^(m₁) to qubit 2 → recovers α|0⟩ + β|1⟩",
    "formula": "Bob's correction: (Z^m₀)(X^m₁)|Bob's qubit⟩ = α|0⟩ + β|1⟩\nwhere |α|² + |β|² = 1 (original normalized state restored exactly)",
    "example": "Teleport |+⟩ = (1/√2)(|0⟩ + |1⟩):\n  If Alice measures (m₀,m₁) = (1,0): Bob applies Z → (1/√2)(|0⟩ − |1⟩) → Z → (1/√2)(|0⟩ + |1⟩) = |+⟩ ✓\n  If Alice measures (0,0): Bob applies I → already has |+⟩ ✓",
    "circuit_example": "from qiskit import QuantumCircuit\n# Quantum Teleportation circuit (3 qubits: q0=sender, q1=Alice's Bell, q2=Bob's Bell)\nqc = QuantumCircuit(3, 2)\n# Prepare Bell pair between q1 and q2\nqc.h(1)\nqc.cx(1, 2)\n# Prepare state to teleport on q0 (e.g., |+⟩)\nqc.h(0)\n# Alice's Bell measurement\nqc.cx(0, 1)\nqc.h(0)\nqc.measure(0, 0)  # m0\nqc.measure(1, 1)  # m1\n# Bob applies classically-controlled corrections\nqc.z(2).c_if(qc.cregs[0][0], 1)  # Z if m0=1\nqc.x(2).c_if(qc.cregs[0][1], 1)  # X if m1=1",
    "related_topics": [
      "Bell State",
      "Quantum Entanglement",
      "Measurement",
      "CNOT Gate",
      "Hadamard Gate",
      "Superposition"
    ],
    "common_mistakes": [
      "Believing quantum teleportation allows faster-than-light communication — it requires two classical bits sent at conventional speeds to complete the protocol.",
      "Confusing teleportation with copying — the original qubit's state is destroyed by Alice's measurement (no-cloning theorem is preserved).",
      "Assuming the teleported state is |ψ⟩ immediately after Alice's measurement — Bob must still apply the correction gates."
    ],
    "aliases": [
      "teleportation",
      "quantum state transfer",
      "qubit teleportation",
      "quantum communication protocol",
      "bell state teleportation"
    ],
    "keywords": [
      "teleportation",
      "bell pair",
      "entanglement",
      "classical bits",
      "no-cloning",
      "alice bob",
      "bell measurement",
      "correction gates",
      "state transfer"
    ],
    "tags": [
      "quantum-phenomena",
      "intermediate",
      "entanglement",
      "communication",
      "protocol"
    ],
    "source_name": "IBM Quantum Learning — Quantum Teleportation",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/entanglement-in-action",
    "additional_sources": [
      {
        "title": "Qiskit Textbook — Teleportation",
        "url": "https://learn.qiskit.org/course/ch-algorithms/teleportation"
      },
      {
        "title": "Bennett et al. (1993) — Teleporting an Unknown Quantum State via Dual Classical and Einstein-Podolsky-Rosen Channels",
        "url": "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.70.1895"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:08.148068+00:00",
    "updated_at": "2026-09-10T08:07:08.148068+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:08.148068+00:00",
    "verification_notes": "Three-stage protocol and correction matrix verified against IBM Quantum Learning and Bennett et al. (1993). No-cloning note confirmed as correct application of theorem.",
    "ingestion_source_id": "ibm-quantum-learning",
    "difficulty_level": "intermediate",
    "subcategory": "Information Transmission Protocols",
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "teleportation",
      "title": "Quantum Teleportation",
      "description": "Prepares state on q0, entangles Bell pair (q1, q2), performs Bell measurement",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "control": 1,
          "target": 2,
          "step": 1
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 1,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "quantum-walk-algorithms",
    "topic_name": "Quantum Walk Algorithms",
    "slug": "quantum-walk-algorithms",
    "category": "Algorithms",
    "short_definition": "The quantum mechanical counterpart of classical Markov chains and random walks, exhibiting quadratic speedups in propagation speed and spatial search on graphs.",
    "beginner_explanation": "In a classical random walk (like a drop of ink diffusing in water), particles wander randomly, spreading out slowly proportional to the square root of time (√t). In a quantum walk, the walker moves in quantum superposition and interference causes paths to add up coherently, spreading linearly with time (t)—quadratically faster! This powers algorithms that search complex spatial networks and verify graph properties.",
    "detailed_explanation": "Quantum walks exist in two primary formulations: Discrete-Time Quantum Walks (DTQW) and Continuous-Time Quantum Walks (CTQW). In DTQW, the Hilbert space is partitioned into a coin space (governed by a unitary coin operator like Hadamard or Grover) and a position space (governed by a shift operator S). The standard deviation of the position distribution spreads ballistically: σ_q(t) ∝ t, compared to classical diffusive spreading σ_c(t) ∝ √t. Applications include spatial search (finding marked vertices on graphs in O(√N)), element distinctness, and graph isomorphism testing.",
    "mathematical_explanation": "Discrete-Time Walk operator:\nU = S (C \\otimes I),\nwhere C is the coin unitary (e.g. Hadamard coin H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}),\nand S is the conditional shift operator S|d\\rangle|x\\rangle = |d\\rangle|x + (-1)^d\\rangle.\nContinuous-Time Walk: |\\psi(t)\\rangle = e^{-i H t} |\\psi(0)\\rangle, where H is the graph Laplacian or adjacency matrix.",
    "formula": "\\sigma_{\\text{quantum}}(t) \\propto t \\quad \\text{vs} \\quad \\sigma_{\\text{classical}}(t) \\propto \\sqrt{t}",
    "example": "On a 1D line, a classical walker after 100 steps is typically within ±10 steps of the origin. A quantum walker after 100 steps has traveled approximately ±70 steps away, demonstrating ballistic propagation.",
    "circuit_example": "from qiskit import QuantumCircuit\n# 1 coin qubit (0) + 2 position qubits (1, 2)\nqc = QuantumCircuit(3)\nqc.h(0) # Coin flip\n# Conditional position increment\nqc.cx(0, 1)\nqc.ccx(0, 1, 2)",
    "related_topics": [
      "Grover's Algorithm",
      "Quantum Algorithms",
      "Amplitude Amplification",
      "Quantum Computing"
    ],
    "common_mistakes": [
      "Confusing quantum walks with classical Monte Carlo simulations.",
      "Assuming a discrete-time quantum walk requires only position qubits (a coin space is required to maintain unitarity on vertices of degree > 2).",
      "Believing the quantum walker settles into a stationary distribution without measurement or decoherence."
    ],
    "aliases": [
      "quantum walk algorithms",
      "quantum walk algorithm",
      "quantum walk search algorithms",
      "quantum walk search algorithm",
      "quantum walk",
      "quantum walks",
      "discrete time quantum walk",
      "continuous time quantum walk",
      "quantum random walk",
      "spatial search"
    ],
    "keywords": [
      "quantum walk",
      "random walk",
      "ballistic",
      "diffusion",
      "graph search",
      "coin operator",
      "spatial search"
    ],
    "tags": [
      "algorithms",
      "graph-theory",
      "spatial-search",
      "speedup"
    ],
    "source_name": "Aharonov et al. (STOC 2001) & Kempe (Contemp. Phys. 2003)",
    "source_url": "https://doi.org/10.1080/00107151031000110776",
    "additional_sources": [
      {
        "title": "Childs et al. Exponential algorithmic speedup by a quantum walk",
        "url": "https://doi.org/10.1145/780542.780552"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "quantum_walk",
      "title": "Discrete Quantum Walk Step",
      "description": "Hadamard coin flip and conditional position register increment",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "qubit",
    "topic_name": "Qubit",
    "slug": "qubit",
    "category": "Foundations",
    "short_definition": "The fundamental unit of quantum information, represented as a two-level quantum system with continuous state amplitudes.",
    "beginner_explanation": "In classical computing, a bit is like an electric switch that is either strictly OFF (0) or ON (1). A qubit (quantum bit) is described by a quantum state vector whose mathematical weights determine the probability of finding it as 0 or 1 upon measurement. It is not '0 and 1 at the same time'—rather, it has a precise, definite quantum state with complex probability amplitudes.",
    "detailed_explanation": "A physical qubit can be implemented using electron spin, photon polarization, or superconducting transmon circuits. The state is represented in a two-dimensional complex Hilbert space spanned by the orthonormal computational basis vectors |0⟩ and |1⟩. The coefficients α and β are probability amplitudes whose squared magnitudes satisfy the normalization condition |α|² + |β|² = 1.",
    "mathematical_explanation": "State vector in Dirac notation: |ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ. In matrix form, |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ, yielding |ψ⟩ = [α, β]ᵀ. The probability of measuring outcome 0 is P(0) = |⟨0|ψ⟩|² = |α|², and for outcome 1 is P(1) = |⟨1|ψ⟩|² = |β|².",
    "formula": "|ψ⟩ = α|0⟩ + β|1⟩  where  |α|² + |β|² = 1",
    "example": "Consider a state with α = 1/√2 and β = 1/√2: |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩. Measuring this qubit gives outcome 0 with probability |1/√2|² = 1/2 (50%) and outcome 1 with probability |1/√2|² = 1/2 (50%).",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)  # Put qubit 0 into equal superposition\nqc.measure(0, 0)",
    "related_topics": [
      "Superposition",
      "Measurement",
      "Bloch Sphere",
      "Hadamard Gate"
    ],
    "common_mistakes": [
      "Believing a qubit is '0 and 1 simultaneously' rather than possessing a definite state with probabilistic measurement outcomes.",
      "Assuming reading or measuring a qubit preserves its superposition state."
    ],
    "aliases": [
      "quantum bit",
      "qubits",
      "what is a qubit",
      "single qubit"
    ],
    "keywords": [
      "qubit",
      "quantum bit",
      "quantum information",
      "state vector",
      "amplitudes",
      "ket 0",
      "ket 1",
      "hilbert space"
    ],
    "tags": [
      "foundations",
      "qubit",
      "core-concept",
      "basis-states"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems",
    "additional_sources": [
      {
        "title": "Qiskit Documentation: Fundamentals",
        "url": "https://docs.quantum.ibm.com/guides"
      },
      {
        "title": "Nielsen & Chuang: Quantum Computation and Quantum Information",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Single Qubit Ground State",
      "description": "Qubit in standard computational basis ground state |0⟩",
      "gates": []
    }
  },
  {
    "id": "rotation-gates",
    "topic_name": "Rotation Gates",
    "slug": "rotation-gates",
    "category": "Quantum Gates",
    "short_definition": "A parametric family of continuous single-qubit quantum gates that rotate a qubit's state vector by an arbitrary angle θ around the X, Y, or Z axes of the Bloch sphere.",
    "beginner_explanation": "While basic quantum gates like X and Z apply fixed 180° flips, rotation gates allow you to turn the dial smoothly to ANY angle θ! Rx(θ) rotates around the X-axis, Ry(θ) rotates around the Y-axis, and Rz(θ) rotates around the Z-axis. By combining rotations around these axes, you can steer a qubit to any location on the entire Bloch sphere.",
    "detailed_explanation": "Rotation gates are generated by exponentiating the Pauli matrices: R_n(θ) = exp(-i θ (n · σ)/2) = cos(θ/2) I - i sin(θ/2) (n · σ). By Euler's rotation theorem, any arbitrary single-qubit unitary gate U can be decomposed into three rotations: U = e^(iα) R_z(β) R_y(γ) R_z(δ). This property forms the basis for quantum gate synthesis (such as Solovay-Kitaev decomposition) and parameterized ansatz circuits in VQE and QAOA.",
    "mathematical_explanation": "Matrix representations for angle \\theta:\nR_x(\\theta) = e^{-i \\theta X / 2} = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}\nR_y(\\theta) = e^{-i \\theta Y / 2} = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}\nR_z(\\theta) = e^{-i \\theta Z / 2} = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}.\nNotice that rotating by \\theta = 2\\pi produces -I (a global phase flip characteristic of spin-1/2 particles).",
    "formula": "R_x(\\theta) = e^{-i \\frac{\\theta}{2} X}, \\quad R_y(\\theta) = e^{-i \\frac{\\theta}{2} Y}, \\quad R_z(\\theta) = e^{-i \\frac{\\theta}{2} Z}",
    "example": "Applying Ry(π/2) to state |0⟩ produces (|0⟩ + |1⟩)/√2 (state |+⟩). Applying Ry(π) to |0⟩ flips it completely to |1⟩ (acting as a Pauli-X gate up to a global phase).",
    "circuit_example": "from qiskit import QuantumCircuit\nimport numpy as np\nqc = QuantumCircuit(1)\nqc.rx(np.pi/4, 0)\nqc.ry(np.pi/3, 0)\nqc.rz(np.pi/2, 0)",
    "related_topics": [
      "Bloch Sphere",
      "X Gate",
      "Y Gate",
      "Z Gate",
      "Variational Quantum Eigensolver (VQE)"
    ],
    "common_mistakes": [
      "Thinking a 360° rotation (θ = 2π) returns the exact same vector (it multiplies the statevector by -1; a full 720° rotation θ = 4π is required to return to +I).",
      "Confusing Ry with Rx (Ry has purely real matrix entries and changes basis probabilities without imaginary phases).",
      "Assuming rotations about two different axes commute (rotations do not commute: Rx(θ)Ry(ϕ) ≠ Ry(ϕ)Rx(θ))."
    ],
    "aliases": [
      "rotation gates",
      "bloch sphere rotations",
      "rx gate",
      "ry gate",
      "rz gate",
      "parametric rotations",
      "pauli rotations"
    ],
    "keywords": [
      "rotation gates",
      "rx",
      "ry",
      "rz",
      "bloch sphere",
      "euler angles",
      "parameterized gates",
      "continuous rotation"
    ],
    "tags": [
      "quantum-gates",
      "continuous-rotation",
      "bloch-sphere",
      "parameterized"
    ],
    "source_name": "Nielsen & Chuang (Cambridge University Press)",
    "source_url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    "additional_sources": [
      {
        "title": "Qiskit Circuit Library: Standard Rotations",
        "url": "https://docs.quantum.ibm.com/api/qiskit/circuit_library"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "parametric_rotations",
      "title": "Euler Single-Qubit Rotation Sequence",
      "description": "Universal single-qubit parameterization Rz-Ry-Rz reaching any point on Bloch sphere",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "shors-algorithm",
    "topic_name": "Shor's Algorithm",
    "slug": "shors-algorithm",
    "category": "Algorithms",
    "short_definition": "A quantum algorithm for integer factorization that runs in polynomial time O((log N)³), providing exponential speedup over the best known classical algorithms.",
    "beginner_explanation": "Shor's algorithm solves the problem of finding the prime factors of a large integer N. Classical computers require time exponential in the number of digits of N to factor large numbers — this is the hardness assumption behind RSA encryption. Shor's algorithm reduces this to polynomial time using quantum phase estimation and the quantum Fourier transform to find the period r of the modular exponentiation function f(x) = a^x mod N. Once r is known, the greatest common divisor yields the factors of N.",
    "detailed_explanation": "Shor's algorithm proceeds in two conceptually distinct parts. The classical reduction shows that factoring N reduces to finding the period r of f(x) = a^x mod N for a randomly chosen a coprime to N. If r is even and a^(r/2) ≠ −1 (mod N), then gcd(a^(r/2) ± 1, N) yields a non-trivial factor of N with high probability. The quantum subroutine uses a register of n = ⌈log₂ N⌉ qubits to prepare a uniform superposition over x ∈ {0, 1, ..., 2ⁿ−1}, evaluates f(x) into an ancilla register via quantum arithmetic, then applies the Quantum Fourier Transform to extract the period r from the measurement statistics. The QFT maps amplitude peaks that are multiples of 2ⁿ/r into a form readable by classical continued fraction expansion. The algorithm succeeds with probability O(1/log log r) per run and can be repeated O(log log r) times to achieve constant success probability.",
    "mathematical_explanation": "Input: N = p·q (semiprime). Goal: find p, q.\n\nStep 1 (classical): Choose random a with 1 < a < N and gcd(a, N) = 1.\n\nStep 2 (quantum period finding):\n  - Prepare |0⟩|0⟩ on two registers.\n  - Apply H⊗ⁿ to first register: (1/√2ⁿ) Σₓ |x⟩|0⟩\n  - Apply oracle Uₐ: |x⟩|0⟩ → |x⟩|aˣ mod N⟩\n  - Measure second register → collapse first to period-spaced superposition\n  - Apply QFT†: QFT|ψ⟩ → peaks at multiples of 2ⁿ/r\n  - Measure → obtain k·2ⁿ/r; extract r via continued fractions\n\nStep 3 (classical): Compute gcd(a^(r/2) − 1, N) and gcd(a^(r/2) + 1, N).",
    "formula": "Time complexity: O((log N)² (log log N)(log log log N)) — polynomial in log N\nClassical best: sub-exponential O(exp(c(log N)^(1/3)(log log N)^(2/3)))",
    "example": "Factor N = 15 with a = 7:\n  f(x) = 7^x mod 15: f(0)=1, f(1)=7, f(2)=4, f(3)=13, f(4)=1...\n  Period r = 4 (even ✓)\n  a^(r/2) = 7² = 49 ≡ 4 (mod 15); 4 ≠ 14 ≡ −1 (mod 15) ✓\n  gcd(49−1, 15) = gcd(48, 15) = 3  → factor!\n  gcd(49+1, 15) = gcd(50, 15) = 5  → factor!\n  15 = 3 × 5 ✓",
    "circuit_example": "from qiskit import QuantumCircuit\nfrom qiskit.circuit.library import QFT\n# Minimal period-finding circuit for N=15, a=7 (4-qubit example)\nqc = QuantumCircuit(4, 4)\nqc.h(range(4))          # Superposition on counting register\n# (Oracle for 7^x mod 15 implemented as controlled-unitary sequence)\n# Apply inverse QFT to extract period\nqc.compose(QFT(4, inverse=True), inplace=True)\nqc.measure_all()",
    "related_topics": [
      "Quantum Fourier Transform",
      "Phase Kickback",
      "Quantum Phase Estimation",
      "Quantum Entanglement",
      "CNOT Gate"
    ],
    "common_mistakes": [
      "Assuming Shor's algorithm directly factors numbers — it reduces factoring to period finding, which the quantum subroutine solves.",
      "Confusing the quantum part (period finding via QFT) with the classical part (GCD extraction).",
      "Believing current quantum hardware can break RSA-2048 — practical implementation requires millions of error-corrected logical qubits."
    ],
    "aliases": [
      "shor's algorithm",
      "shors algorithm",
      "shor's factoring algorithm",
      "shors factoring algorithm",
      "shor factoring algorithm",
      "shor algorithm",
      "quantum factoring",
      "integer factorization quantum",
      "shor's period finding",
      "rsa breaking"
    ],
    "keywords": [
      "shor",
      "factoring",
      "rsa",
      "period finding",
      "quantum fourier transform",
      "polynomial time",
      "cryptography",
      "prime factorization",
      "modular exponentiation",
      "continued fractions",
      "gcd"
    ],
    "tags": [
      "algorithms",
      "cryptography",
      "advanced",
      "qft",
      "number-theory"
    ],
    "source_name": "IBM Quantum Learning — Fundamentals of Quantum Algorithms",
    "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-query-algorithms",
    "additional_sources": [
      {
        "title": "Qiskit Textbook — Phase Estimation and Factoring",
        "url": "https://learn.qiskit.org/course/ch-algorithms/shor-s-algorithm"
      },
      {
        "title": "Shor (1994) — Algorithms for quantum computation: discrete logarithms and factoring",
        "url": "https://arxiv.org/abs/quant-ph/9508027"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:08.069292+00:00",
    "updated_at": "2026-09-10T08:07:08.069292+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:08.069292+00:00",
    "verification_notes": "Content curated from IBM Quantum Learning and Qiskit Textbook. Mathematical steps verified against Shor (1994). Complexity notation confirmed correct.",
    "ingestion_source_id": "ibm-quantum-learning",
    "difficulty_level": "advanced",
    "subcategory": "Cryptography-Breaking Algorithms",
    "canonical_circuit": null
  },
  {
    "id": "shors-discrete-logarithm-algorithm",
    "topic_name": "Shor's Discrete Logarithm Algorithm",
    "slug": "shors-discrete-logarithm-algorithm",
    "category": "Cryptography",
    "short_definition": "The second major algorithm introduced in Peter Shor's 1994 landmark paper, solving the discrete logarithm problem in polynomial time and breaking Diffie-Hellman and Elliptic Curve Cryptography (ECC).",
    "beginner_explanation": "While Shor's factoring algorithm is famous for breaking RSA encryption, Shor ALSO published a second quantum algorithm in the same 1994 paper for solving 'discrete logarithms'. This second algorithm is even more devastating to modern internet security because it directly breaks Diffie-Hellman key exchanges and Elliptic Curve Cryptography (ECC), which protects Bitcoin, WhatsApp, and HTTPS web traffic!",
    "detailed_explanation": "Given a cyclic group G with generator g and element y = g^x, the discrete logarithm problem asks to find exponent x. Classically, the best known algorithms (Number Field Sieve, Pollard's rho) take sub-exponential or exponential time. Shor's algorithm constructs a 2D periodic function f(a, b) = g^a y^(-b) = g^(a - bx). Because f(a + r, b) = f(a, b) and f(a + x, b + 1) = f(a, b), this function is periodic over the 2D lattice ℤ_p × ℤ_p. Applying a 2D Quantum Fourier Transform extracts x efficiently in polynomial time O((log p)³).",
    "mathematical_explanation": "Function definition: f(a, b) = g^a y^{-b} \\pmod p = g^{a - bx} \\pmod p.\nPeriodicity condition: f(a₁, b₁) = f(a₂, b₂) \\iff a₁ - b₁x \\equiv a₂ - b₂x \\pmod r,\nwhere r is the order of g.\nTwo registers are prepared: |0⟩^⊗m |0⟩^⊗m. After applying QFT on both registers and evaluating f(a, b), a second 2D QFT yields values (u, v) satisfying u x + v \\equiv 0 \\pmod r, yielding x = -v u⁻¹ mod r.",
    "formula": "g^x \\equiv y \\pmod p \\implies x = -v u^{-1} \\pmod r \\quad \\text{in } O((\\log p)^3) \\text{ time}",
    "example": "Breaking 256-bit Elliptic Curve Cryptography (secp256k1 used in Bitcoin): classical computers require ~2¹²⁸ operations (billions of years). Shor's discrete logarithm algorithm can solve it with ~2,330 physical logical qubits in a few hours of runtime.",
    "circuit_example": "from qiskit import QuantumCircuit\n# 2D QFT + Modular Exponentiation\nqc = QuantumCircuit(4, 2)\nqc.h([0, 1])\n# Modular multiplication: g^a * y^(-b)\nqc.h([0, 1])\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Shor's Algorithm",
      "Quantum Fourier Transform",
      "Quantum Phase Estimation",
      "Hidden Subgroup Problem",
      "Quantum Key Distribution"
    ],
    "common_mistakes": [
      "Thinking Shor's algorithm ONLY factors numbers (it factors integers AND computes discrete logarithms).",
      "Believing Elliptic Curve Cryptography is safer than RSA against quantum attacks (ECC actually requires FEWER qubits to break than RSA for equivalent security levels!).",
      "Confusing the 1D period finding of factoring with the 2D lattice Fourier sampling of discrete log."
    ],
    "aliases": [
      "shor's discrete logarithm algorithm",
      "shor discrete log",
      "discrete logarithm quantum algorithm",
      "quantum discrete log",
      "ecc quantum attack"
    ],
    "keywords": [
      "shor",
      "discrete logarithm",
      "ecc",
      "diffie-hellman",
      "cryptography",
      "post-quantum",
      "2d qft",
      "bitcoin security"
    ],
    "tags": [
      "cryptography",
      "algorithms",
      "exponential-speedup",
      "cybersecurity"
    ],
    "source_name": "Peter W. Shor (FOCS 1994 / SIAM J. Comput. 1997)",
    "source_url": "https://doi.org/10.1137/S0097539795293172",
    "additional_sources": [
      {
        "title": "Roetteler et al. Quantum Resource Estimates for Computing Elliptic Curve Discrete Logarithms",
        "url": "https://arxiv.org/abs/1706.06752"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 4,
      "circuit_type": "cryptographic_attack",
      "title": "2D Discrete Logarithm Sampling Core",
      "description": "Two register 2D Fourier sampling evaluating lattice modular periodicity",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 1,
          "step": 1
        },
        {
          "type": "H",
          "target": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 1,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "simons-algorithm",
    "topic_name": "Simon's Algorithm",
    "slug": "simons-algorithm",
    "category": "Algorithms",
    "short_definition": "The first quantum algorithm to demonstrate an exponential speedup over all classical probabilistic algorithms for an oracle problem, finding a hidden XOR period s with O(n) queries.",
    "beginner_explanation": "Suppose a function repeats its outputs with a secret binary shift: f(x) = f(y) if and only if x and y differ by a secret key s (meaning x ⊕ y = s). Classically, you must query about 2^(n/2) times (the birthday paradox) before finding two inputs with the same output. Simon's algorithm samples linear equations perpendicular to s, finding the secret key in just O(n) queries!",
    "detailed_explanation": "Simon's algorithm examines f: {0,1}ⁿ → {0,1}ⁿ with the promise f(x) = f(y) ⟺ x ⊕ y ∈ {0ⁿ, s}. In each run, two n-qubit registers are prepared: |0⟩^⊗n |0⟩^⊗n. After applying H^⊗n to the first register and evaluating the oracle U_f, the registers become entangled: (1/√2ⁿ) ∑_x |x⟩ |f(x)⟩. Measuring the second register collapses the first register into an equal superposition of two inputs {|x₀⟩, |x₀ ⊕ s⟩}. Applying H^⊗n produces an interference pattern where only basis states |y⟩ satisfying s · y ≡ 0 (mod 2) have non-zero amplitude.",
    "mathematical_explanation": "After measurement of the second register, the first register state is (|x₀⟩ + |x₀ ⊕ s⟩)/√2. Applying H^⊗n yields:\n(1/2^{(n+1)/2}) ∑_{y} [ (-1)^{x₀ · y} + (-1)^{(x₀ ⊕ s) · y} ] |y⟩ = (1/2^{(n-1)/2}) ∑_{y: s · y = 0} (-1)^{x₀ · y} |y⟩.\nEach measurement produces a random vector y orthogonal to s (s · y = 0). After O(n) independent vectors are collected, classical Gaussian elimination determines s uniquely.",
    "formula": "s \\cdot y \\equiv 0 \\pmod 2 \\quad \\implies \\quad T_{quantum} = O(n) \\text{ vs } T_{classical} = \\Omega(2^{n/2})",
    "example": "For n = 100 bits, classical algorithms require on the order of 2⁵⁰ ≈ 10¹⁵ queries to find a collision. Simon's algorithm solves it with fewer than 200 quantum queries followed by solving a 100x100 classical linear system.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(6, 3) # 3 input qubits, 3 ancilla qubits\nqc.h([0, 1, 2])\n# [Simon's 2-to-1 Oracle U_f here]\nqc.h([0, 1, 2])\nqc.measure([0, 1, 2], [0, 1, 2])",
    "related_topics": [
      "Shor's Algorithm",
      "Quantum Fourier Transform",
      "Hidden Subgroup Problem",
      "Quantum Algorithms",
      "Phase Kickback"
    ],
    "common_mistakes": [
      "Believing Simon's algorithm directly outputs the secret string s on a single run (it outputs a vector y orthogonal to s; multiple runs are needed).",
      "Assuming Simon's problem is directly useful for business databases (it is an oracle problem, but its technique formed the direct foundation for Shor's factoring algorithm).",
      "Forgetting to perform classical Gaussian elimination on the collected measurement vectors."
    ],
    "aliases": [
      "simon's algorithm",
      "simon algorithm",
      "simons algorithm",
      "simon's problem",
      "hidden period algorithm"
    ],
    "keywords": [
      "simon",
      "simon's algorithm",
      "periodicity",
      "exponential speedup",
      "oracle",
      "xor",
      "collision",
      "shor inspiration"
    ],
    "tags": [
      "algorithms",
      "oracle",
      "exponential-speedup",
      "foundational"
    ],
    "source_name": "Daniel R. Simon (FOCS 1994)",
    "source_url": "https://doi.org/10.1109/SFCS.1994.365701",
    "additional_sources": [
      {
        "title": "Nielsen & Chuang: Simon's Algorithm",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 4,
      "circuit_type": "oracle_algorithm",
      "title": "Simon's Algorithm (2-bit period)",
      "description": "2-qubit input and 2-qubit target oracle extracting orthogonal parity equations",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 2,
          "control": 0,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 1,
          "step": 1
        },
        {
          "type": "CNOT",
          "target": 3,
          "control": 0,
          "step": 2
        },
        {
          "type": "H",
          "target": 0,
          "step": 3
        },
        {
          "type": "H",
          "target": 1,
          "step": 3
        }
      ]
    }
  },
  {
    "id": "superdense-coding",
    "topic_name": "Superdense Coding",
    "slug": "superdense-coding",
    "category": "Protocols",
    "short_definition": "A fundamental quantum communication protocol that transmits two classical bits of information from sender to receiver by physically sending only one entangled qubit.",
    "beginner_explanation": "Classically, transmitting 2 bits of data (00, 01, 10, or 11) requires sending 2 separate physical signals. In superdense coding, Alice and Bob share an entangled Bell pair of qubits beforehand. Alice can manipulate ONLY her single qubit using simple gates, send it to Bob, and Bob can decode all 2 classical bits with 100% accuracy!",
    "detailed_explanation": "Superdense coding is the dual of quantum teleportation (teleportation sends 1 quantum state using 2 classical bits + 1 Bell pair; superdense coding sends 2 classical bits using 1 qubit + 1 Bell pair). Alice and Bob share |Φ⁺⟩ = (|00⟩+|11⟩)/√2. Alice applies one of four local unitary operations {I, X, Z, XZ} corresponding to her two classical bits {00, 01, 10, 11}, transforming the pair into one of the four orthogonal Bell states. Bob performs a Bell-basis measurement (CNOT followed by H) to read both classical bits.",
    "mathematical_explanation": "Mapping of classical message to Bell states:\n- 00: (I ⊗ I)|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 = |Φ⁺⟩\n- 01: (X ⊗ I)|Φ⁺⟩ = (|10⟩ + |01⟩)/√2 = |Ψ⁺⟩\n- 10: (Z ⊗ I)|Φ⁺⟩ = (|00⟩ - |11⟩)/√2 = |Φ⁻⟩\n- 11: (XZ ⊗ I)|Φ⁺⟩ = (-|10⟩ + |01⟩)/√2 = -|Ψ⁻⟩\nBob decodes by applying CNOT(Alice, Bob), then H(Alice), and measuring both in computational basis.",
    "formula": "2 \\text{ classical bits transmitted via } 1 \\text{ physical qubit } + 1 \\text{ shared Bell pair}",
    "example": "Alice wants to transmit message '10' to Bob: Alice applies the Pauli-Z gate to her half of the Bell pair. She sends her qubit to Bob. Bob runs CNOT then H, measures both qubits, and reads '10'.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\n# Prepare Bell pair shared between Alice (0) and Bob (1)\nqc.h(0); qc.cx(0, 1)\n# Alice encodes message '01' by applying X to qubit 0\nqc.x(0)\n# Bob decodes via Bell measurement\nqc.cx(0, 1); qc.h(0)\nqc.measure([0, 1], [0, 1])",
    "related_topics": [
      "Quantum Teleportation",
      "Bell State",
      "Quantum Entanglement",
      "CNOT Gate",
      "Measurement"
    ],
    "common_mistakes": [
      "Thinking superdense coding allows sending 2 bits through an unentangled qubit (pre-shared entanglement is strictly required).",
      "Confusing superdense coding with quantum teleportation.",
      "Assuming Alice and Bob communicate faster than light (the qubit must physically travel through a quantum channel)."
    ],
    "aliases": [
      "superdense coding",
      "dense coding",
      "superdense quantum coding",
      "bennett wiesner protocol"
    ],
    "keywords": [
      "superdense",
      "coding",
      "dense coding",
      "bell state",
      "entanglement",
      "quantum communication",
      "two bits one qubit"
    ],
    "tags": [
      "protocols",
      "quantum-communication",
      "entanglement",
      "bell-basis"
    ],
    "source_name": "Bennett & Wiesner (Phys. Rev. Lett. 1992)",
    "source_url": "https://doi.org/10.1103/PhysRevLett.69.2881",
    "additional_sources": [
      {
        "title": "Nielsen & Chuang: Superdense Coding",
        "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "communication_protocol",
      "title": "Superdense Coding Protocol (Message '11')",
      "description": "Encodes 2 classical bits into 1 qubit using pre-shared Bell state",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        },
        {
          "type": "X",
          "target": 0,
          "step": 3
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 4
        },
        {
          "type": "H",
          "target": 0,
          "step": 5
        }
      ]
    }
  },
  {
    "id": "superposition",
    "topic_name": "Superposition",
    "slug": "superposition",
    "category": "Foundations",
    "short_definition": "The linear combination of quantum basis states weighted by complex probability amplitudes before measurement.",
    "beginner_explanation": "Superposition describes how a quantum state is a linear sum of computational basis states. Before measurement, the qubit is in a single, well-defined quantum state governed by complex numbers called probability amplitudes. When measured, this state collapses into one of the definite classical outcomes according to the Born rule.",
    "detailed_explanation": "The principle of superposition arises directly from the linearity of the underlying Schrödinger wave mechanics. Any linear combination of valid state vectors is itself a valid state vector. Unlike classical probability distributions which only add positive real fractions, quantum probability amplitudes can interfere constructively or destructively because they carry both magnitude and phase.",
    "mathematical_explanation": "Given basis states {|i⟩}, an arbitrary n-qubit superposition is expressed as |ψ⟩ = ∑_{i=0}^{2^n-1} c_i |i⟩ with ∑ |c_i|² = 1. The relative phase between terms (e.g. |+⟩ vs |-⟩) fundamentally alters interference patterns under subsequent unitary transformations.",
    "formula": "|ψ⟩ = c₀|0⟩ + c₁|1⟩  with  |c₀|² + |c₁|² = 1",
    "example": "Applying the Hadamard gate to |0⟩ produces the state |+⟩ = (|0⟩ + |1⟩)/√2. Applying it to |1⟩ yields |-⟩ = (|0⟩ - |1⟩)/√2. Both have 50/50 measurement chances, but their opposite relative phases create opposite interference results when another H gate is applied.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)  # Creates superposition: (|0⟩ + |1⟩)/√2",
    "related_topics": [
      "Qubit",
      "Hadamard Gate",
      "Quantum Interference",
      "Measurement"
    ],
    "common_mistakes": [
      "Confusing quantum superposition with classical parallel computing or uncertainty.",
      "Ignoring the relative phase: |+⟩ and |-⟩ have identical measurement probabilities but distinct quantum properties."
    ],
    "aliases": [
      "quantum superposition",
      "linear superposition",
      "superposition principle",
      "state superposition"
    ],
    "keywords": [
      "superposition",
      "probability amplitudes",
      "linear combination",
      "plus state",
      "minus state",
      "relative phase"
    ],
    "tags": [
      "foundations",
      "superposition",
      "amplitudes",
      "interference"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#superposition",
    "additional_sources": [
      {
        "title": "Qiskit Textbook: The Atoms of Computation",
        "url": "https://learn.qiskit.org/"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Superposition State",
      "description": "Generates equal superposition state |ψ⟩ = (|0⟩ + |1⟩)/√2",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        }
      ]
    }
  },
  {
    "id": "t-gate",
    "topic_name": "T Gate (π/8 Gate)",
    "slug": "t-gate",
    "category": "Quantum Gates",
    "short_definition": "A vital non-Clifford single-qubit quantum gate that applies a π/4 (45°) phase rotation to |1⟩, providing the essential non-stabilizer resource required for universal fault-tolerant quantum computing.",
    "beginner_explanation": "If you only have Clifford gates (Hadamard, CNOT, and Phase S gates), a classical computer can efficiently simulate your quantum circuit (Gottesman-Knill theorem)—meaning you have no quantum speedup! The T gate is the magic key that breaks this classical barrier. Adding the T gate unlocks universal quantum computation.",
    "detailed_explanation": "The T gate is mathematically the fourth root of the Pauli-Z gate (T⁴ = Z, T² = S). It applies a phase shift of e^(iπ/4) = (1 + i)/√2 to state |1⟩. Historically it was called the 'π/8 gate' because up to a global phase e^(iπ/8), it can be written as diag(e^(-iπ/8), e^(iπ/8)). In fault-tolerant quantum error correction, Clifford gates can be implemented transversally with zero noise spread, but the Eastin-Knill theorem proves no error-correcting code can implement all universal gates transversally. The T gate must therefore be injected using specialized, resource-heavy 'magic state distillation'.",
    "mathematical_explanation": "Matrix representation in computational basis:\nT = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & \\frac{1 + i}{\\sqrt{2}} \\end{pmatrix}.\nAlgebraic relations:\nT^2 = S, \\quad T^4 = Z, \\quad T^8 = I, \\quad T^\\dagger = T^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{-i\\pi/4} \\end{pmatrix}.\nAction on basis states: T|0\\rangle = |0\\rangle, \\quad T|1\\rangle = e^{i\\pi/4}|1\\rangle.",
    "formula": "T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix}, \\quad T^2 = S, \\quad T^4 = Z",
    "example": "Applying T to |+⟩: T((|0⟩+|1⟩)/√2) = (|0⟩ + e^(iπ/4)|1⟩)/√2. The state vector rotates 45° counter-clockwise around the Z-axis on the Bloch sphere equator.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)\nqc.t(0)   # T gate\nqc.tdg(0) # T-dagger gate",
    "related_topics": [
      "Phase Gate (S Gate)",
      "Z Gate",
      "Quantum Error Correction",
      "Quantum Gates",
      "Rotation Gates"
    ],
    "common_mistakes": [
      "Confusing the T gate matrix diag(1, e^(iπ/4)) with angle π/8 (the phase on |1⟩ is π/4; π/8 appears only when factored symmetrically as e^(±iπ/8)).",
      "Assuming T gates are cheap to execute on fault-tolerant hardware (T gates account for ~95% of quantum error correction overhead due to magic state distillation).",
      "Thinking Clifford gates alone are universal (Clifford + T is universal; Clifford alone is classically simulable)."
    ],
    "aliases": [
      "t gate",
      "t-gate",
      "pi/8 gate",
      "fourth root of z",
      "magic gate",
      "non-clifford t gate"
    ],
    "keywords": [
      "t gate",
      "t-gate",
      "pi/8",
      "clifford+t",
      "magic state",
      "fault tolerance",
      "universal quantum computing",
      "eastin-knill"
    ],
    "tags": [
      "quantum-gates",
      "non-clifford",
      "universal",
      "fault-tolerance"
    ],
    "source_name": "Nielsen & Chuang & Gottesman",
    "source_url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    "additional_sources": [
      {
        "title": "Bravyi & Kitaev: Universal quantum computation with ideal Clifford gates and noisy ancillas",
        "url": "https://doi.org/10.1103/PhysRevA.71.022316"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit_gate",
      "title": "T Gate Operation",
      "description": "Applies π/4 phase shift, providing universal non-Clifford resource",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "T",
          "target": 0,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "toffoli-gate",
    "topic_name": "Toffoli Gate",
    "slug": "toffoli-gate",
    "category": "Quantum Gates",
    "short_definition": "A three-qubit reversible gate (also called CCX or controlled-controlled-NOT) that applies an X (NOT) operation on the target qubit if and only if both control qubits are in state |1⟩.",
    "beginner_explanation": "The Toffoli gate is the quantum analogue of a classical AND gate combined with a NOT gate. It operates on three qubits: two control qubits (c₁ and c₂) and one target qubit (t). The target qubit is flipped (X applied) only when both controls are |1⟩; otherwise all qubits pass through unchanged. Because it is its own inverse (applying it twice returns to the original state), the Toffoli gate is reversible and unitary. It is also universal for classical reversible computation: any Boolean circuit can be implemented using Toffoli gates, making it important for embedding classical subroutines inside quantum algorithms.",
    "detailed_explanation": "The Toffoli gate (CCX) maps |c₁⟩|c₂⟩|t⟩ → |c₁⟩|c₂⟩|t ⊕ (c₁ ∧ c₂)⟩ where ⊕ denotes XOR and ∧ denotes AND. Its 8×8 unitary matrix is the identity everywhere except the |110⟩ and |111⟩ subspace, where it swaps the amplitudes: M(|110⟩, |111⟩) = [[0,1],[1,0]]. The Toffoli gate cannot be directly decomposed into fewer than 5 two-qubit CNOT gates on arbitrary qubit connectivity. In Qiskit it is implemented as `qc.ccx(c1, c2, target)`. It plays a central role in quantum arithmetic (adders, multipliers), quantum error correction ancilla preparation, and phase oracles in Grover's algorithm.",
    "mathematical_explanation": "Action: |c₁,c₂,t⟩ → |c₁,c₂, t ⊕ (c₁·c₂)⟩\n\n8×8 matrix (computational basis order |000⟩…|111⟩):\n  TOFF = diag(I₆) with |110⟩↔|111⟩ swap:\n  rows 6,7: [[0,1],[1,0]] embedded in identity\n\nDecomposition cost: 5 CNOT gates + single-qubit rotations\nSelf-inverse: TOFF² = I",
    "formula": "|c₁,c₂,t⟩ → |c₁,c₂, t ⊕ (c₁ ∧ c₂)⟩\nActivates when: c₁ = c₂ = 1",
    "example": "|1,1,0⟩ → |1,1,1⟩  (target flipped: 0 ⊕ 1 = 1)\n|1,1,1⟩ → |1,1,0⟩  (target flipped: 1 ⊕ 1 = 0)\n|1,0,1⟩ → |1,0,1⟩  (c₂=0, no flip)\n|0,1,0⟩ → |0,1,0⟩  (c₁=0, no flip)",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(3, 3)\n# Set both controls to |1⟩\nqc.x(0)  # control 1\nqc.x(1)  # control 2\n# Apply Toffoli gate: flips qubit 2 since c1=c2=1\nqc.ccx(0, 1, 2)\nqc.measure_all()\n# Expected output: |111⟩ (both controls remain |1⟩, target flipped 0→1)",
    "related_topics": [
      "CNOT Gate",
      "X Gate",
      "Grover's Algorithm",
      "Quantum Error Correction",
      "Deutsch-Jozsa Algorithm"
    ],
    "common_mistakes": [
      "Confusing the Toffoli gate with CNOT — CNOT has one control; Toffoli has two.",
      "Assuming Toffoli is a native gate on all quantum hardware — it must be decomposed into CNOT + single-qubit gates on most devices.",
      "Forgetting that Toffoli is self-inverse (applying it twice returns the original state)."
    ],
    "aliases": [
      "ccx gate",
      "ccx",
      "controlled controlled not",
      "ccnot",
      "toffoli",
      "controlled-controlled-x",
      "three qubit gate"
    ],
    "keywords": [
      "toffoli",
      "ccx",
      "ccnot",
      "three qubit",
      "reversible",
      "controlled not",
      "classical reversibility",
      "quantum and gate",
      "universal gate"
    ],
    "tags": [
      "quantum-gates",
      "multi-qubit",
      "intermediate",
      "reversible",
      "arithmetic"
    ],
    "source_name": "Qiskit Textbook — Multiple Qubit Gates",
    "source_url": "https://learn.qiskit.org/course/ch-gates/more-circuit-identities",
    "additional_sources": [
      {
        "title": "IBM Quantum Learning — Multi-Qubit Gates",
        "url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T08:07:08.369099+00:00",
    "updated_at": "2026-09-10T08:07:08.369099+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": "2026-09-10T08:07:08.369099+00:00",
    "verification_notes": "Matrix representation and CNOT decomposition cost verified against Qiskit documentation and Nielsen & Chuang.",
    "ingestion_source_id": "qiskit-textbook",
    "difficulty_level": "intermediate",
    "subcategory": "Multi-Qubit Gates",
    "canonical_circuit": {
      "num_qubits": 3,
      "circuit_type": "multi_qubit",
      "title": "Toffoli Gate (CCX)",
      "description": "Applies X on controls 0 & 1, flipping target qubit 2",
      "gates": [
        {
          "type": "X",
          "target": 0,
          "step": 0
        },
        {
          "type": "X",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "control": 0,
          "target": 2,
          "step": 1
        }
      ]
    }
  },
  {
    "id": "variational-quantum-algorithms",
    "topic_name": "Variational Quantum Algorithms (VQAs)",
    "slug": "variational-quantum-algorithms",
    "category": "Algorithms",
    "short_definition": "The dominant meta-heuristic framework for NISQ devices that uses parameterized quantum circuits trained via classical gradient descent or gradient-free optimizers.",
    "beginner_explanation": "Today's quantum computers are noisy and have limited coherence times, making long mathematical algorithms like Shor's impractical today. Variational Quantum Algorithms (VQAs) are hybrid algorithms: the quantum computer runs short, flexible circuits with adjustable dials (angles), and a classical computer measures the output and tweaks the dials to improve the result. VQAs are the foundation of modern near-term quantum chemistry, optimization, and AI!",
    "detailed_explanation": "In a VQA, an ansatz circuit U(θ) prepares state |ψ(θ)⟩ = U(θ)|0⟩. A cost function C(θ) is evaluated by measuring expectation values of problem Hamiltonians ⟨H⟩ = ⟨ψ(θ)|H|ψ(θ)⟩. A classical optimizer (e.g. COBYLA, Adam, SPSA, natural gradient) iteratively updates θ ← θ - η ∇C(θ). Major VQA families include VQE (molecular ground states), QAOA (combinatorial optimization), VQLS (variational linear solver), and QNNs (quantum neural networks).",
    "mathematical_explanation": "Optimization objective:\n\\theta^* = \\arg\\min_\\theta C(\\theta) = \\arg\\min_\\theta \\text{Tr}\\left( O U(\\theta) |0\\rangle\\langle 0| U^\\dagger(\\theta) \\right).\nParameter-Shift Rule for exact analytical gradients:\n\\frac{\\partial C}{\\partial \\theta_i} = \\frac{C\\left(\\theta + \\frac{\\pi}{2} e_i\\right) - C\\left(\\theta - \\frac{\\pi}{2} e_i\\right)}{2}.",
    "formula": "C(\\vec{\\theta}) = \\langle 0 | U^\\dagger(\\vec{\\theta}) H U(\\vec{\\theta}) | 0 \\rangle, \\quad \\vec{\\theta}_{t+1} = \\vec{\\theta}_t - \\eta \\nabla C(\\vec{\\theta}_t)",
    "example": "Training a 4-qubit Quantum Neural Network to classify handwritten digits using alternating layers of parameterized single-qubit rotations Ry(θ) and circular CNOT entanglement.",
    "circuit_example": "from qiskit import QuantumCircuit\nfrom qiskit.circuit import Parameter\ntheta = Parameter('θ')\nqc = QuantumCircuit(2)\nqc.ry(theta, 0)\nqc.cx(0, 1)\nqc.ry(theta, 1)",
    "related_topics": [
      "Variational Quantum Eigensolver (VQE)",
      "Quantum Approximate Optimization Algorithm (QAOA)",
      "Quantum Machine Learning",
      "Quantum Circuits"
    ],
    "common_mistakes": [
      "Ignoring Barren Plateaus: random deep ansatz circuits have exponentially vanishing gradients ∇C(θ) ≈ 0.",
      "Assuming classical optimizers never get stuck in local minima (non-convex optimization landscapes are challenging).",
      "Confusing parameter-shift gradients with finite differences (parameter-shift gives exact analytical gradients on quantum hardware!)."
    ],
    "aliases": [
      "variational quantum algorithms",
      "vqa",
      "vqls",
      "hybrid quantum classical algorithms",
      "parameterized quantum circuits",
      "pqc"
    ],
    "keywords": [
      "vqa",
      "variational",
      "pqc",
      "ansatz",
      "hybrid",
      "nisq",
      "optimization",
      "parameter shift",
      "barren plateau"
    ],
    "tags": [
      "algorithms",
      "hybrid-quantum-classical",
      "nisq",
      "meta-heuristic"
    ],
    "source_name": "Cerezo et al. (Nature Reviews Physics 2021)",
    "source_url": "https://doi.org/10.1038/s42254-021-00348-9",
    "additional_sources": [
      {
        "title": "McClean et al. Barren plateaus in quantum neural network training landscapes",
        "url": "https://doi.org/10.1038/s41467-018-07090-4"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "vqa_ansatz",
      "title": "Variational Quantum Algorithm Parameterized Unitary",
      "description": "Hardware-efficient ansatz with parameterized rotations and entangling gates",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "variational-quantum-eigensolver",
    "topic_name": "Variational Quantum Eigensolver (VQE)",
    "slug": "variational-quantum-eigensolver",
    "category": "Algorithms",
    "short_definition": "A hybrid quantum-classical algorithm that finds the ground state energy of a physical Hamiltonian by parameterizing a quantum circuit and optimizing the parameters classically using the variational principle.",
    "beginner_explanation": "Calculating the lowest energy state (ground state) of molecules is essential for chemistry and materials science, but classically intractable for large systems. VQE solves this by teamwork: a quantum computer prepares trial quantum states and measures their energy, while a classical computer optimizes the gate angles to find the lowest possible energy.",
    "detailed_explanation": "VQE is the flagship algorithm for Noisy Intermediate-Scale Quantum (NISQ) devices because it uses shallow-depth circuits that are robust against decoherence. The quantum processor prepares a parameterized ansatz state |ψ(θ)⟩ = U(θ)|0⟩ and measures expectation values of Pauli string observables ⟨H⟩. A classical optimizer (e.g. COBYLA, SPSA) iteratively adjusts parameters θ to minimize ⟨H⟩.",
    "mathematical_explanation": "By the Rayleigh-Ritz variational principle, for any trial state |ψ(θ)⟩ and Hamiltonian H, the expectation value is an upper bound on the true ground state energy E_0: E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E_0. The Hamiltonian is decomposed into a weighted sum of Pauli strings H = ∑_i w_i P_i (where P_i ∈ {I, X, Y, Z}^⊗n). The classical optimizer solves θ* = argmin_θ E(θ).",
    "formula": "\\langle H \\rangle_{\\theta} = \\langle \\psi(\\theta) | H | \\psi(\\theta) \\rangle \\ge E_0, \\quad \\theta^* = \\arg\\min_{\\theta} \\langle H \\rangle_{\\theta}",
    "example": "Finding the ground state binding energy of the Hydrogen molecule (H₂) as a function of bond distance by encoding the electron orbitals into a 2-qubit Hamiltonian and measuring Pauli strings Z₀, Z₁, and Z₀Z₁.",
    "circuit_example": "from qiskit import QuantumCircuit\nfrom qiskit.circuit import Parameter\ntheta = Parameter('θ')\nqc = QuantumCircuit(2)\nqc.ry(theta, 0)\nqc.cx(0, 1)\nqc.ry(theta, 1)",
    "related_topics": [
      "Quantum Algorithms",
      "Quantum Computing",
      "Quantum Circuits",
      "Phase Kickback"
    ],
    "common_mistakes": [
      "Assuming VQE is a pure quantum algorithm (it relies on a classical optimization feedback loop).",
      "Overlooking barren plateaus—phenomena in deep ansatz circuits where gradients vanish exponentially.",
      "Expecting exact results on unmitigated noisy hardware without error mitigation techniques."
    ],
    "aliases": [
      "vqe",
      "variational quantum eigensolver",
      "variational algorithm",
      "quantum chemistry vqe",
      "hybrid quantum classical algorithm"
    ],
    "keywords": [
      "vqe",
      "variational",
      "eigensolver",
      "ansatz",
      "hamiltonian",
      "ground state",
      "nisq",
      "quantum chemistry",
      "optimization"
    ],
    "tags": [
      "algorithms",
      "vqe",
      "hybrid-quantum-classical",
      "nisq",
      "chemistry"
    ],
    "source_name": "Peruzzo et al. (Nature Communications 2014) & Qiskit Chemistry",
    "source_url": "https://www.nature.com/articles/ncomms5213",
    "additional_sources": [
      {
        "title": "McClean et al. The theory of variational hybrid quantum-classical algorithms",
        "url": "https://iopscience.iop.org/article/10.1088/1367-2630/18/2/023023"
      }
    ],
    "verification_status": "verified",
    "created_at": null,
    "updated_at": null,
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 2,
      "circuit_type": "variational_ansatz",
      "title": "VQE Parameterized Hardware-Efficient Ansatz",
      "description": "2-qubit parameterized rotational circuit for molecular ground-state estimation",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "H",
          "target": 1,
          "step": 0
        },
        {
          "type": "CNOT",
          "target": 1,
          "control": 0,
          "step": 1
        },
        {
          "type": "Z",
          "target": 0,
          "step": 2
        }
      ]
    }
  },
  {
    "id": "x-gate",
    "topic_name": "X Gate",
    "slug": "x-gate",
    "category": "Quantum Gates",
    "short_definition": "The Pauli-X operator that performs a bit-flip operation, rotating the state vector by π radians around the X-axis of the Bloch sphere.",
    "beginner_explanation": "The X gate is the quantum counterpart of the classical NOT gate. It flips |0⟩ into |1⟩, and |1⟩ into |0⟩. On the Bloch sphere, it acts as a 180-degree rotation around the X-axis.",
    "detailed_explanation": "The Pauli-X gate is represented by the 2x2 matrix [[0, 1], [1, 0]]. Because it is both unitary and Hermitian (X = X† and X² = I), applying it twice returns the qubit to its original state. When applied to superpositions, it swaps the coefficients: X(α|0⟩ + β|1⟩) = β|0⟩ + α|1⟩.",
    "mathematical_explanation": "Matrix representation: X = [ [0, 1], [1, 0] ]. Action: X|0⟩ = |1⟩, X|1⟩ = |0⟩. Eigenvectors: |+⟩ with eigenvalue +1, and |-⟩ with eigenvalue -1.",
    "formula": "X = [[0, 1], [1, 0]],  X|0⟩ = |1⟩,  X|1⟩ = |0⟩",
    "example": "If |ψ⟩ = 0.8|0⟩ + 0.6|1⟩, applying the X gate yields X|ψ⟩ = 0.6|0⟩ + 0.8|1⟩.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.x(0)  # Flips |0⟩ to |1⟩",
    "related_topics": [
      "Y Gate",
      "Z Gate",
      "Hadamard Gate",
      "Qubit"
    ],
    "common_mistakes": [
      "Assuming X flips the phase (phase-flip is done by Z).",
      "Thinking X has no effect on |+⟩ (it leaves |+⟩ unchanged because |+⟩ is an eigenstate with eigenvalue +1)."
    ],
    "aliases": [
      "pauli-x",
      "pauli x gate",
      "not gate",
      "quantum not",
      "bit flip gate",
      "gate that flips a qubit",
      "x operator"
    ],
    "keywords": [
      "x gate",
      "pauli-x",
      "not gate",
      "bit flip",
      "gate that flips a qubit",
      "qubit flip",
      "inversion"
    ],
    "tags": [
      "gates",
      "single-qubit",
      "pauli",
      "bit-flip"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits#single-qubit-gates",
    "additional_sources": [
      {
        "title": "Qiskit Circuit Library: XGate",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.XGate"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Pauli-X (NOT) Gate",
      "description": "Flips the ground state |0⟩ to excited state |1⟩",
      "gates": [
        {
          "type": "X",
          "target": 0,
          "step": 0
        }
      ]
    }
  },
  {
    "id": "y-gate",
    "topic_name": "Y Gate",
    "slug": "y-gate",
    "category": "Quantum Gates",
    "short_definition": "The Pauli-Y operator that performs both a bit flip and a phase flip (multiplication by complex unit i), rotating by π around the Y-axis.",
    "beginner_explanation": "The Y gate is a fundamental quantum gate that combines a bit-flip and a phase-flip. It flips |0⟩ to i|1⟩ and |1⟩ to -i|0⟩, introducing an imaginary phase factor.",
    "detailed_explanation": "Pauli-Y is defined by the matrix [[0, -i], [i, 0]]. Like all Pauli matrices, Y is unitary and Hermitian (Y = Y† and Y² = I). Geometrically, it rotates the qubit state by π radians around the Y-axis of the Bloch sphere.",
    "mathematical_explanation": "Matrix: Y = [ [0, -i], [i, 0] ]. Action: Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩. Eigenvectors: |i⟩ = (|0⟩ + i|1⟩)/√2 (eigenvalue +1) and |-i⟩ = (|0⟩ - i|1⟩)/√2 (eigenvalue -1).",
    "formula": "Y = [[0, -i], [i, 0]],  Y|0⟩ = i|1⟩,  Y|1⟩ = -i|0⟩",
    "example": "Applying Y to |0⟩ produces state i|1⟩. In terms of measurement probabilities, |i|² = 1, so the qubit will be measured as 1 with 100% certainty, but carries an imaginary global phase.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.y(0)  # Applies Pauli-Y gate",
    "related_topics": [
      "X Gate",
      "Z Gate",
      "Bloch Sphere"
    ],
    "common_mistakes": [
      "Forgetting the factor of i when calculating transformed state vectors.",
      "Confusing the action of Y with the composite gate XZ (XZ = -iY)."
    ],
    "aliases": [
      "pauli-y",
      "pauli y gate",
      "y operator",
      "bit and phase flip gate"
    ],
    "keywords": [
      "y gate",
      "pauli-y",
      "imaginary phase",
      "bloch rotation",
      "bit phase flip"
    ],
    "tags": [
      "gates",
      "single-qubit",
      "pauli"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits",
    "additional_sources": [
      {
        "title": "Qiskit API Reference: YGate",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.YGate"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": null
  },
  {
    "id": "z-gate",
    "topic_name": "Z Gate",
    "slug": "z-gate",
    "category": "Quantum Gates",
    "short_definition": "The Pauli-Z operator that applies a phase flip (multiplying |1⟩ by -1 while leaving |0⟩ unchanged).",
    "beginner_explanation": "The Z gate is a phase-flip gate. It leaves the |0⟩ basis state completely unaffected, but flips the algebraic sign of the |1⟩ state. On the Bloch sphere, it rotates the state by 180 degrees around the vertical Z-axis.",
    "detailed_explanation": "The matrix representation of Z is [[1, 0], [0, -1]]. Since Z leaves the computational basis states |0⟩ and |1⟩ as eigenstates (with eigenvalues +1 and -1 respectively), measuring a qubit immediately before or after a Z gate gives identical probabilities. However, it changes the relative phase of superpositions, swapping |+⟩ into |-⟩.",
    "mathematical_explanation": "Matrix: Z = [ [1, 0], [0, -1] ]. Action: Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Action on superposition: Z(α|0⟩ + β|1⟩) = α|0⟩ - β|1⟩.",
    "formula": "Z = [[1, 0], [0, -1]],  Z|0⟩ = |0⟩,  Z|1⟩ = -|1⟩",
    "example": "Applying Z to the equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 transforms it into |-⟩ = (|0⟩ - |1⟩)/√2.",
    "circuit_example": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.z(0)  # Flips the phase of state |1⟩",
    "related_topics": [
      "X Gate",
      "Y Gate",
      "Hadamard Gate",
      "Phase Kickback"
    ],
    "common_mistakes": [
      "Expecting Z to change measurement probabilities in the standard computational basis (it only modifies the relative phase).",
      "Failing to recognize that Z converts |+⟩ into |-⟩."
    ],
    "aliases": [
      "pauli-z",
      "pauli z gate",
      "phase flip gate",
      "phase flip",
      "z operator"
    ],
    "keywords": [
      "z gate",
      "pauli-z",
      "phase flip",
      "relative phase",
      "sign flip",
      "bloch sphere"
    ],
    "tags": [
      "gates",
      "single-qubit",
      "pauli",
      "phase-flip"
    ],
    "source_name": "IBM Quantum Learning",
    "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits",
    "additional_sources": [
      {
        "title": "Qiskit API Reference: ZGate",
        "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.ZGate"
      }
    ],
    "verification_status": "verified",
    "created_at": "2026-09-10T06:56:17.431669+00:00",
    "updated_at": "2026-09-10T06:59:29.920777+00:00",
    "status": "approved",
    "knowledge_version": 1,
    "last_verified_at": null,
    "verification_notes": null,
    "ingestion_source_id": "manual-curation",
    "difficulty_level": null,
    "subcategory": null,
    "canonical_circuit": {
      "num_qubits": 1,
      "circuit_type": "single_qubit",
      "title": "Pauli-Z Phase Flip",
      "description": "Applies H to enter |+⟩, then Z to rotate relative phase by 180° into |−⟩",
      "gates": [
        {
          "type": "H",
          "target": 0,
          "step": 0
        },
        {
          "type": "Z",
          "target": 0,
          "step": 1
        }
      ]
    }
  }
];
