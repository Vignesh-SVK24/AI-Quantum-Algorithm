export interface PlaygroundStep {
  stepNumber: number;
  name: string;
  description: string;
  gateIds: string[];
  whatHappens: string;
}

export interface PlaygroundGate {
  id: string;
  type: string;
  target: number;
  step: number;
  control?: number | null;
}

export interface PlaygroundAlgorithm {
  id: string;
  name: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  difficulty: number;
  numQubits: number;
  purpose: string;
  speedup: string;
  classicalVsQuantum: string;
  prerequisites: string[];
  initialGates: PlaygroundGate[];
  steps: PlaygroundStep[];
}

export const PLAYGROUND_ALGORITHMS: PlaygroundAlgorithm[] = [
  {
    "id": "deutsch",
    "name": "Deutsch Algorithm",
    "category": "Beginner",
    "difficulty": 1,
    "numQubits": 2,
    "purpose": "Determines whether an unknown 1-bit boolean function f(x) is constant or balanced using exactly 1 quantum evaluation instead of 2 classical queries.",
    "speedup": "Deterministic speedup: 1 query (quantum) vs 2 queries (classical worst-case).",
    "classicalVsQuantum": "Classical computers must query f(0) and f(1) separately. The quantum circuit evaluates f(x) in superposition across both inputs simultaneously and uses constructive/destructive interference to extract global property f(0) \u2295 f(1).",
    "prerequisites": [
      "Superposition",
      "Hadamard Gate",
      "Phase Kickback",
      "CNOT Gate"
    ],
    "initialGates": [
      {
        "id": "d-x1",
        "type": "X",
        "target": 1,
        "step": 1,
        "control": null
      },
      {
        "id": "d-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "d-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "d-cx01",
        "type": "CNOT",
        "target": 1,
        "step": 3,
        "control": 0
      },
      {
        "id": "d-h0-final",
        "type": "H",
        "target": 0,
        "step": 4,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Ancilla Initialization",
        "description": "Prepare ancilla qubit q[1] in excited state |1\u27e9 by applying a Pauli-X (NOT) gate.",
        "gateIds": [
          "d-x1"
        ],
        "whatHappens": "Qubit q[1] transitions from ground state |0\u27e9 to |1\u27e9. Overall system state becomes |01\u27e9."
      },
      {
        "stepNumber": 2,
        "name": "Equal Superposition Creation",
        "description": "Apply Hadamard gates to both qubits. Input qubit q[0] enters |+\u27e9 = (|0\u27e9+|1\u27e9)/\u221a2; ancilla q[1] enters |\u2212\u27e9 = (|0\u27e9\u2212|1\u27e9)/\u221a2.",
        "gateIds": [
          "d-h0",
          "d-h1"
        ],
        "whatHappens": "System enters product state |+\u27e9|\u2212\u27e9. Both basis states 0 and 1 are now present in the input register with equal amplitude."
      },
      {
        "stepNumber": 3,
        "name": "Oracle Query & Phase Kickback",
        "description": "Apply the balanced oracle unitary (CNOT with control q[0] and target q[1]).",
        "gateIds": [
          "d-cx01"
        ],
        "whatHappens": "Because the target qubit is in the eigenstate |\u2212\u27e9 of X, the eigenvalue (-1)^f(x) is kicked back onto the control qubit q[0], changing its state to |\u2212\u27e9."
      },
      {
        "stepNumber": 4,
        "name": "Interference & Readout",
        "description": "Apply a final Hadamard gate on input qubit q[0] to transform phase information back into the computational basis.",
        "gateIds": [
          "d-h0-final"
        ],
        "whatHappens": "H|\u2212\u27e9 collapses deterministically to |1\u27e9. Measuring q[0] gives 1 with 100% probability, proving f(x) is balanced in a single shot."
      }
    ]
  },
  {
    "id": "deutsch_jozsa",
    "name": "Deutsch-Jozsa Algorithm",
    "category": "Beginner",
    "difficulty": 1,
    "numQubits": 3,
    "purpose": "Determines whether an n-bit boolean function f:{0,1}\u207f \u2192 {0,1} is constant (same output everywhere) or balanced (equal 0s and 1s) in a single query.",
    "speedup": "Exponential speedup: 1 quantum query vs 2\u207f\u207b\u00b9 + 1 classical queries in the worst case.",
    "classicalVsQuantum": "Classically, an adversary could produce 2\u207f\u207b\u00b9 identical answers before revealing whether the function is constant or balanced. Quantum superposition tests all 2\u207f inputs at once.",
    "prerequisites": [
      "Multi-Qubit Superposition",
      "Phase Kickback",
      "Quantum Interference"
    ],
    "initialGates": [
      {
        "id": "dj-x2",
        "type": "X",
        "target": 2,
        "step": 1,
        "control": null
      },
      {
        "id": "dj-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "dj-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "dj-h2",
        "type": "H",
        "target": 2,
        "step": 2,
        "control": null
      },
      {
        "id": "dj-cx02",
        "type": "CNOT",
        "target": 2,
        "step": 3,
        "control": 0
      },
      {
        "id": "dj-cx12",
        "type": "CNOT",
        "target": 2,
        "step": 4,
        "control": 1
      },
      {
        "id": "dj-h0-f",
        "type": "H",
        "target": 0,
        "step": 5,
        "control": null
      },
      {
        "id": "dj-h1-f",
        "type": "H",
        "target": 1,
        "step": 5,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Ancilla Setup",
        "description": "Initialize ancilla qubit q[2] to |1\u27e9 with an X gate.",
        "gateIds": [
          "dj-x2"
        ],
        "whatHappens": "Prepares the ancilla for phase kickback."
      },
      {
        "stepNumber": 2,
        "name": "Hadamard Transform Across All Qubits",
        "description": "Apply H gates to all 3 qubits. Creates uniform superposition 1/2 \u2211|x\u27e9 on q[0], q[1], and |\u2212\u27e9 on q[2].",
        "gateIds": [
          "dj-h0",
          "dj-h1",
          "dj-h2"
        ],
        "whatHappens": "All 4 classical 2-bit inputs |00\u27e9, |01\u27e9, |10\u27e9, |11\u27e9 are now superposed with equal positive amplitude."
      },
      {
        "stepNumber": 3,
        "name": "Balanced Oracle Evaluation",
        "description": "Apply CNOTs from input qubits q[0] and q[1] onto ancilla q[2], implementing balanced function f(x) = x\u2080 \u2295 x\u2081.",
        "gateIds": [
          "dj-cx02",
          "dj-cx12"
        ],
        "whatHappens": "Phase kickback modulates the amplitude of each basis state |x\u27e9 by (-1)^f(x)."
      },
      {
        "stepNumber": 4,
        "name": "Interference Transform",
        "description": "Apply Hadamard gates to input qubits q[0] and q[1].",
        "gateIds": [
          "dj-h0-f",
          "dj-h1-f"
        ],
        "whatHappens": "Destructive interference cancels the amplitude of |00\u27e9 to 0. All probability flows into non-zero states (here |11\u27e9), confirming f is balanced."
      }
    ]
  },
  {
    "id": "bernstein_vazirani",
    "name": "Bernstein-Vazirani Algorithm",
    "category": "Beginner",
    "difficulty": 1,
    "numQubits": 3,
    "purpose": "Finds a hidden n-bit secret string s in an inner-product oracle f(x) = s \u00b7 x (mod 2) with 1 query instead of n classical queries.",
    "speedup": "Polynomial speedup: 1 quantum query vs n classical queries.",
    "classicalVsQuantum": "Classical computers must probe e\u2081, e\u2082, ..., e\u2099 sequentially (one bit at a time). Bernstein-Vazirani extracts all n bits of s in a single parallel query.",
    "prerequisites": [
      "Phase Kickback",
      "Inner Product Oracles",
      "Computational Basis Mapping"
    ],
    "initialGates": [
      {
        "id": "bv-x2",
        "type": "X",
        "target": 2,
        "step": 1,
        "control": null
      },
      {
        "id": "bv-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "bv-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "bv-h2",
        "type": "H",
        "target": 2,
        "step": 2,
        "control": null
      },
      {
        "id": "bv-cx02",
        "type": "CNOT",
        "target": 2,
        "step": 3,
        "control": 0
      },
      {
        "id": "bv-cx12",
        "type": "CNOT",
        "target": 2,
        "step": 4,
        "control": 1
      },
      {
        "id": "bv-h0-f",
        "type": "H",
        "target": 0,
        "step": 5,
        "control": null
      },
      {
        "id": "bv-h1-f",
        "type": "H",
        "target": 1,
        "step": 5,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Ancilla Setup",
        "description": "Initialize ancilla qubit q[2] to |1\u27e9 with X gate.",
        "gateIds": [
          "bv-x2"
        ],
        "whatHappens": "Sets target ready for eigenvalue -1 phase kickback."
      },
      {
        "stepNumber": 2,
        "name": "Input Register Superposition",
        "description": "Apply H gates to all qubits.",
        "gateIds": [
          "bv-h0",
          "bv-h1",
          "bv-h2"
        ],
        "whatHappens": "Prepares equal superposition over all candidate binary strings."
      },
      {
        "stepNumber": 3,
        "name": "Secret Encoding Oracle (s = 11)",
        "description": "CNOT from q[0] and CNOT from q[1] target ancilla q[2], encoding secret string s = '11'.",
        "gateIds": [
          "bv-cx02",
          "bv-cx12"
        ],
        "whatHappens": "Inverts the relative phase of basis states proportionally to the inner product s \u00b7 x."
      },
      {
        "stepNumber": 4,
        "name": "Basis Decoding",
        "description": "Apply final Hadamard gates on q[0] and q[1].",
        "gateIds": [
          "bv-h0-f",
          "bv-h1-f"
        ],
        "whatHappens": "The Fourier basis state |s\u27e9 is mapped directly onto computational basis state |11\u27e9 with 100% certainty."
      }
    ]
  },
  {
    "id": "simon",
    "name": "Simon's Algorithm",
    "category": "Beginner",
    "difficulty": 2,
    "numQubits": 3,
    "purpose": "Finds the hidden period string s for a 2-to-1 function satisfying f(x) = f(y) iff x \u2295 y \u2208 {0, s} with exponential quantum speedup.",
    "speedup": "Exponential speedup: O(n) quantum queries vs O(2\u207f/\u00b2) classical queries.",
    "classicalVsQuantum": "Classical collision-finding requires Birthday Paradox sampling (~2\u207f/\u00b2 queries). Simon's algorithm samples linear equations y \u00b7 s = 0 (mod 2) to reconstruct s using classical Gaussian elimination.",
    "prerequisites": [
      "Hadamard Transform",
      "Linear Equations over GF(2)",
      "Periodicity"
    ],
    "initialGates": [
      {
        "id": "sim-h0",
        "type": "H",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "sim-h1",
        "type": "H",
        "target": 1,
        "step": 1,
        "control": null
      },
      {
        "id": "sim-cx02",
        "type": "CNOT",
        "target": 2,
        "step": 2,
        "control": 0
      },
      {
        "id": "sim-cx12",
        "type": "CNOT",
        "target": 2,
        "step": 3,
        "control": 1
      },
      {
        "id": "sim-h0-f",
        "type": "H",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "sim-h1-f",
        "type": "H",
        "target": 1,
        "step": 4,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Input Superposition",
        "description": "Hadamard gates on input qubits q[0] and q[1].",
        "gateIds": [
          "sim-h0",
          "sim-h1"
        ],
        "whatHappens": "Generates uniform superposition over all input domain values."
      },
      {
        "stepNumber": 2,
        "name": "2-to-1 Function Oracle",
        "description": "Entangle input qubits with output qubit q[2] using CNOT gates.",
        "gateIds": [
          "sim-cx02",
          "sim-cx12"
        ],
        "whatHappens": "Maps (|x\u27e9 + |x \u2295 s\u27e9)|f(x)\u27e9, creating quantum correlation between domain pairs and codomain."
      },
      {
        "stepNumber": 3,
        "name": "Interference Transform",
        "description": "Apply final Hadamards on input register q[0] and q[1].",
        "gateIds": [
          "sim-h0-f",
          "sim-h1-f"
        ],
        "whatHappens": "Measurement yields vectors y satisfying y \u00b7 s = 0 (mod 2)."
      }
    ]
  },
  {
    "id": "grover",
    "name": "Grover's Search Algorithm",
    "category": "Intermediate",
    "difficulty": 2,
    "numQubits": 2,
    "purpose": "Finds a unique marked item in an unstructured database of N = 2\u207f elements using only O(\u221aN) oracle queries.",
    "speedup": "Quadratic speedup: O(\u221aN) quantum queries vs O(N) classical queries (provably optimal).",
    "classicalVsQuantum": "Classical linear search must check items one by one (averaging N/2 attempts). Grover's algorithm rotates the statevector towards the target state using amplitude amplification.",
    "prerequisites": [
      "Geometric State Rotations",
      "Phase Inversion",
      "Diffuser Operator",
      "Constructive Interference"
    ],
    "initialGates": [
      {
        "id": "gr-h0",
        "type": "H",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "gr-h1",
        "type": "H",
        "target": 1,
        "step": 1,
        "control": null
      },
      {
        "id": "gr-cz",
        "type": "CZ",
        "target": 1,
        "step": 2,
        "control": 0
      },
      {
        "id": "gr-h0-d1",
        "type": "H",
        "target": 0,
        "step": 3,
        "control": null
      },
      {
        "id": "gr-h1-d1",
        "type": "H",
        "target": 1,
        "step": 3,
        "control": null
      },
      {
        "id": "gr-x0",
        "type": "X",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "gr-x1",
        "type": "X",
        "target": 1,
        "step": 4,
        "control": null
      },
      {
        "id": "gr-cz-d",
        "type": "CZ",
        "target": 1,
        "step": 5,
        "control": 0
      },
      {
        "id": "gr-x0-f",
        "type": "X",
        "target": 0,
        "step": 6,
        "control": null
      },
      {
        "id": "gr-x1-f",
        "type": "X",
        "target": 1,
        "step": 6,
        "control": null
      },
      {
        "id": "gr-h0-f",
        "type": "H",
        "target": 0,
        "step": 7,
        "control": null
      },
      {
        "id": "gr-h1-f",
        "type": "H",
        "target": 1,
        "step": 7,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Uniform Superposition",
        "description": "Hadamard gates on q[0] and q[1] place the register in state |s\u27e9 = 1/2 (|00\u27e9 + |01\u27e9 + |10\u27e9 + |11\u27e9).",
        "gateIds": [
          "gr-h0",
          "gr-h1"
        ],
        "whatHappens": "Every element has equal 25% measurement probability."
      },
      {
        "stepNumber": 2,
        "name": "Phase Oracle (Target = |11\u27e9)",
        "description": "Apply CZ gate between q[0] and q[1]. Flips the sign of state |11\u27e9 to -|11\u27e9 while leaving other states unchanged.",
        "gateIds": [
          "gr-cz"
        ],
        "whatHappens": "The target statevector amplitude is reflected across the orthogonal subspace."
      },
      {
        "stepNumber": 3,
        "name": "Grover Diffuser (Inversion About the Mean)",
        "description": "Apply H, X, CZ, X, H across both qubits to perform operator 2|s\u27e9\u27e8s| - I.",
        "gateIds": [
          "gr-h0-d1",
          "gr-h1-d1",
          "gr-x0",
          "gr-x1",
          "gr-cz-d",
          "gr-x0-f",
          "gr-x1-f",
          "gr-h0-f",
          "gr-h1-f"
        ],
        "whatHappens": "Amplitudes reflect around the mean amplitude. The marked state |11\u27e9 is amplified to 100% probability!"
      }
    ]
  },
  {
    "id": "qft",
    "name": "Quantum Fourier Transform (QFT)",
    "category": "Intermediate",
    "difficulty": 2,
    "numQubits": 3,
    "purpose": "Transforms computational basis states into frequency/phase representations; core engine of Shor's algorithm and Quantum Phase Estimation.",
    "speedup": "Exponential algorithmic speedup: O(n\u00b2) quantum gates vs O(n 2\u207f) classical Fast Fourier Transform (FFT).",
    "classicalVsQuantum": "Classical FFT operates on 2\u207f complex values explicitly. QFT operates on state amplitudes directly via recursive controlled phase rotations.",
    "prerequisites": [
      "Phase Rotations",
      "Controlled Unitaries",
      "Roots of Unity",
      "SWAP Gates"
    ],
    "initialGates": [
      {
        "id": "qft-x0",
        "type": "X",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "qft-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "qft-s01",
        "type": "S",
        "target": 0,
        "step": 3,
        "control": null
      },
      {
        "id": "qft-t02",
        "type": "T",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "qft-h1",
        "type": "H",
        "target": 1,
        "step": 5,
        "control": null
      },
      {
        "id": "qft-s12",
        "type": "S",
        "target": 1,
        "step": 6,
        "control": null
      },
      {
        "id": "qft-h2",
        "type": "H",
        "target": 2,
        "step": 7,
        "control": null
      },
      {
        "id": "qft-sw02",
        "type": "SWAP",
        "target": 2,
        "step": 8,
        "control": 0
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Input State Preparation",
        "description": "Prepare basis state |001\u27e9 by applying Pauli-X to qubit q[0].",
        "gateIds": [
          "qft-x0"
        ],
        "whatHappens": "Initial computational state set to |1\u27e9."
      },
      {
        "stepNumber": 2,
        "name": "Stage 1: Most Significant Qubit Transform",
        "description": "Apply Hadamard on q[0] followed by phase rotations S (\u03c0/2) and T (\u03c0/4).",
        "gateIds": [
          "qft-h0",
          "qft-s01",
          "qft-t02"
        ],
        "whatHappens": "Encodes higher binary fractions into the relative phase of q[0]."
      },
      {
        "stepNumber": 3,
        "name": "Stage 2: Middle Qubit Transform",
        "description": "Apply Hadamard on q[1] and S phase rotation.",
        "gateIds": [
          "qft-h1",
          "qft-s12"
        ],
        "whatHappens": "Encodes remaining binary fraction into q[1]."
      },
      {
        "stepNumber": 4,
        "name": "Stage 3 & Bit Reversal",
        "description": "Hadamard on q[2] and SWAP gate between q[0] and q[2].",
        "gateIds": [
          "qft-h2",
          "qft-sw02"
        ],
        "whatHappens": "Reverses qubit ordering to produce the standardized natural Fourier frequency ordering."
      }
    ]
  },
  {
    "id": "qpe",
    "name": "Quantum Phase Estimation (QPE)",
    "category": "Intermediate",
    "difficulty": 3,
    "numQubits": 3,
    "purpose": "Estimates the unknown phase \u03b8 in the eigenvalue equation U|\u03c8\u27e9 = e\u00b2\u03c0\u2071\u1dbf|\u03c8\u27e9 for a given unitary matrix U.",
    "speedup": "Exponential precision efficiency: finds n bits of phase with O(n\u00b2) operations.",
    "classicalVsQuantum": "Classical matrix diagonalization scales cubically with Hilbert space dimension O(2\u00b3\u207f). QPE directly projects onto the eigenbasis and reads the phase into a register.",
    "prerequisites": [
      "Quantum Fourier Transform",
      "Eigenstates & Eigenvalues",
      "Controlled-Unitary Gates"
    ],
    "initialGates": [
      {
        "id": "qpe-x2",
        "type": "X",
        "target": 2,
        "step": 1,
        "control": null
      },
      {
        "id": "qpe-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "qpe-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "qpe-cz12",
        "type": "CZ",
        "target": 2,
        "step": 3,
        "control": 1
      },
      {
        "id": "qpe-h0-f",
        "type": "H",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "qpe-h1-f",
        "type": "H",
        "target": 1,
        "step": 4,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Eigenstate Initialization",
        "description": "Apply X gate to target qubit q[2] to prepare eigenstate |1\u27e9 of the phase operator Z.",
        "gateIds": [
          "qpe-x2"
        ],
        "whatHappens": "Qubit q[2] is prepared in state |1\u27e9, for which Z|1\u27e9 = -1|1\u27e9 = e^{i\u03c0}|1\u27e9 (phase \u03b8 = 0.5)."
      },
      {
        "stepNumber": 2,
        "name": "Counting Register Superposition",
        "description": "Apply Hadamard gates to counting qubits q[0] and q[1].",
        "gateIds": [
          "qpe-h0",
          "qpe-h1"
        ],
        "whatHappens": "Creates uniform superposition in the counting register."
      },
      {
        "stepNumber": 3,
        "name": "Controlled Phase Application",
        "description": "Apply controlled-Z gate from counting qubit q[1] onto target q[2].",
        "gateIds": [
          "qpe-cz12"
        ],
        "whatHappens": "Phase kickback copies eigenvalue phase 2\u03c0\u03b8 into the relative phase of the counting register."
      },
      {
        "stepNumber": 4,
        "name": "Inverse QFT & Readout",
        "description": "Apply inverse Fourier transform (Hadamards) to decode phase into binary digits.",
        "gateIds": [
          "qpe-h0-f",
          "qpe-h1-f"
        ],
        "whatHappens": "Measuring the counting register yields the binary expansion of phase \u03b8."
      }
    ]
  },
  {
    "id": "teleportation",
    "name": "Quantum Teleportation",
    "category": "Intermediate",
    "difficulty": 2,
    "numQubits": 3,
    "purpose": "Transfers an unknown quantum state |\u03c8\u27e9 from sender (Alice) to receiver (Bob) using a pre-shared EPR entangled pair and 2 classical bits.",
    "speedup": "Fundamental quantum communication protocol; preserves no-cloning theorem.",
    "classicalVsQuantum": "Classical physics cannot transmit an unknown quantum state because measuring it destroys superposition and phase. Teleportation reconstructs the exact state via quantum entanglement.",
    "prerequisites": [
      "EPR Bell Pairs",
      "No-Cloning Theorem",
      "Bell Basis Measurement"
    ],
    "initialGates": [
      {
        "id": "tel-h0",
        "type": "H",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "tel-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "tel-cx12",
        "type": "CNOT",
        "target": 2,
        "step": 3,
        "control": 1
      },
      {
        "id": "tel-cx01",
        "type": "CNOT",
        "target": 1,
        "step": 4,
        "control": 0
      },
      {
        "id": "tel-h0-f",
        "type": "H",
        "target": 0,
        "step": 5,
        "control": null
      },
      {
        "id": "tel-cx12-cor",
        "type": "CNOT",
        "target": 2,
        "step": 6,
        "control": 1
      },
      {
        "id": "tel-cz02-cor",
        "type": "CZ",
        "target": 2,
        "step": 7,
        "control": 0
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "State Preparation",
        "description": "Apply Hadamard on q[0] to create the arbitrary state |\u03c8\u27e9 = |+\u27e9 to teleport.",
        "gateIds": [
          "tel-h0"
        ],
        "whatHappens": "Alice's qubit q[0] holds the secret quantum information."
      },
      {
        "stepNumber": 2,
        "name": "Bell Pair Creation",
        "description": "Apply H on q[1] and CNOT from q[1] to q[2] to form maximally entangled state (|00\u27e9+|11\u27e9)/\u221a2.",
        "gateIds": [
          "tel-h1",
          "tel-cx12"
        ],
        "whatHappens": "Establishes non-local quantum channel between Alice (q[1]) and Bob (q[2])."
      },
      {
        "stepNumber": 3,
        "name": "Bell Measurement (Alice)",
        "description": "Apply CNOT from q[0] to q[1] and H on q[0].",
        "gateIds": [
          "tel-cx01",
          "tel-h0-f"
        ],
        "whatHappens": "Projects Alice's two qubits onto the 4 Bell states, destroying the state on q[0]."
      },
      {
        "stepNumber": 4,
        "name": "Correction Unitary (Bob)",
        "description": "Apply conditional CNOT (X correction) and CZ (Z correction) on Bob's qubit q[2].",
        "gateIds": [
          "tel-cx12-cor",
          "tel-cz02-cor"
        ],
        "whatHappens": "Bob's qubit q[2] is rotated into the exact original state |\u03c8\u27e9 with 100% fidelity!"
      }
    ]
  },
  {
    "id": "superdense_coding",
    "name": "Superdense Coding",
    "category": "Intermediate",
    "difficulty": 2,
    "numQubits": 2,
    "purpose": "Transmits 2 classical bits of information from Alice to Bob by physically sending only 1 single qubit through a pre-shared entangled pair.",
    "speedup": "2x Channel capacity increase over classical limits (Holevo bound = 1 bit per unentangled qubit).",
    "classicalVsQuantum": "Classical bits require sending 2 separate physical signals. Superdense coding uses quantum entanglement to double the information transmission density.",
    "prerequisites": [
      "Bell States",
      "Entanglement Manipulation",
      "Local Unitary Operations"
    ],
    "initialGates": [
      {
        "id": "sdc-h0",
        "type": "H",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "sdc-cx01",
        "type": "CNOT",
        "target": 1,
        "step": 2,
        "control": 0
      },
      {
        "id": "sdc-x0",
        "type": "X",
        "target": 0,
        "step": 3,
        "control": null
      },
      {
        "id": "sdc-z0",
        "type": "Z",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "sdc-cx01-dec",
        "type": "CNOT",
        "target": 1,
        "step": 5,
        "control": 0
      },
      {
        "id": "sdc-h0-dec",
        "type": "H",
        "target": 0,
        "step": 6,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Shared Bell Pair Generation",
        "description": "Create Bell state |\u03a6\u207a\u27e9 = (|00\u27e9+|11\u27e9)/\u221a2 across q[0] (Alice) and q[1] (Bob).",
        "gateIds": [
          "sdc-h0",
          "sdc-cx01"
        ],
        "whatHappens": "Alice and Bob each hold one qubit of the entangled pair."
      },
      {
        "stepNumber": 2,
        "name": "Alice Encodes 2 Bits (Message '11')",
        "description": "Alice applies Pauli-X and Pauli-Z gates to her qubit q[0] to encode classical message '11'.",
        "gateIds": [
          "sdc-x0",
          "sdc-z0"
        ],
        "whatHappens": "Transforms the global entangled state into Bell state |\u03a8\u207b\u27e9 = (|01\u27e9\u2212|10\u27e9)/\u221a2."
      },
      {
        "stepNumber": 3,
        "name": "Bob's Bell Decoding",
        "description": "Bob receives q[0] and applies CNOT and H gates to map the Bell basis back to the computational basis.",
        "gateIds": [
          "sdc-cx01-dec",
          "sdc-h0-dec"
        ],
        "whatHappens": "Measurement yields classical bits '11' with 100% certainty!"
      }
    ]
  },
  {
    "id": "shor_order_finding",
    "name": "Shor's Algorithm (Order Finding)",
    "category": "Advanced",
    "difficulty": 3,
    "numQubits": 3,
    "purpose": "Finds the period r of f(x) = a\u02e3 mod N, the quantum engine behind breaking RSA public-key cryptography.",
    "speedup": "Super-polynomial/exponential speedup: O((log N)\u00b3) vs classical General Number Field Sieve exp(O(\u221b(log N))).",
    "classicalVsQuantum": "Classical factoring is computationally intractable for large numbers. Shor reduces factoring to period finding and solves it efficiently with QFT.",
    "prerequisites": [
      "Modular Arithmetic",
      "Quantum Phase Estimation",
      "Inverse QFT",
      "Continued Fractions"
    ],
    "initialGates": [
      {
        "id": "shor-x2",
        "type": "X",
        "target": 2,
        "step": 1,
        "control": null
      },
      {
        "id": "shor-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "shor-h1",
        "type": "H",
        "target": 1,
        "step": 2,
        "control": null
      },
      {
        "id": "shor-cx12",
        "type": "CNOT",
        "target": 2,
        "step": 3,
        "control": 1
      },
      {
        "id": "shor-h0-iqft",
        "type": "H",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "shor-cz01-iqft",
        "type": "CZ",
        "target": 1,
        "step": 5,
        "control": 0
      },
      {
        "id": "shor-h1-iqft",
        "type": "H",
        "target": 1,
        "step": 6,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Target Register Initialization",
        "description": "Prepare target register q[2] in state |1\u27e9 corresponding to a\u2070 mod N = 1.",
        "gateIds": [
          "shor-x2"
        ],
        "whatHappens": "Prepares modular identity basis state."
      },
      {
        "stepNumber": 2,
        "name": "Control Register Superposition",
        "description": "Apply Hadamard gates to control qubits q[0] and q[1].",
        "gateIds": [
          "shor-h0",
          "shor-h1"
        ],
        "whatHappens": "Generates superposition of all exponents x \u2208 {0, 1, 2, 3}."
      },
      {
        "stepNumber": 3,
        "name": "Controlled Modular Multiplication",
        "description": "Apply controlled modular operation (represented here by CNOT) to map |x\u27e9|1\u27e9 \u2192 |x\u27e9|a\u02e3 mod N\u27e9.",
        "gateIds": [
          "shor-cx12"
        ],
        "whatHappens": "Entangles exponent register with periodic modular values."
      },
      {
        "stepNumber": 4,
        "name": "Inverse Quantum Fourier Transform",
        "description": "Apply inverse QFT (H, CZ, H) to extract the period r from the phase.",
        "gateIds": [
          "shor-h0-iqft",
          "shor-cz01-iqft",
          "shor-h1-iqft"
        ],
        "whatHappens": "Constructive interference peaks at multiples of 1/r, revealing the period upon measurement."
      }
    ]
  },
  {
    "id": "vqe",
    "name": "Variational Quantum Eigensolver (VQE)",
    "category": "Advanced",
    "difficulty": 3,
    "numQubits": 2,
    "purpose": "Finds the ground state energy of a molecular Hamiltonian using a hybrid quantum-classical variational loop on NISQ hardware.",
    "speedup": "Practical polynomial quantum scaling for chemical simulation vs exponential classical CI (Configuration Interaction).",
    "classicalVsQuantum": "Classical chemistry methods like Full CI scale exponentially with electron orbitals. VQE prepares quantum wavefunctions directly on qubits and uses classical optimizers to adjust parameters.",
    "prerequisites": [
      "Variational Principle",
      "Ansatz Parameterization",
      "Pauli Expectation Values",
      "NISQ Architecture"
    ],
    "initialGates": [
      {
        "id": "vqe-x0",
        "type": "X",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "vqe-h0",
        "type": "H",
        "target": 0,
        "step": 2,
        "control": null
      },
      {
        "id": "vqe-s0",
        "type": "S",
        "target": 0,
        "step": 3,
        "control": null
      },
      {
        "id": "vqe-cx01",
        "type": "CNOT",
        "target": 1,
        "step": 4,
        "control": 0
      },
      {
        "id": "vqe-s1",
        "type": "S",
        "target": 1,
        "step": 5,
        "control": null
      },
      {
        "id": "vqe-h1",
        "type": "H",
        "target": 1,
        "step": 6,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Hartree-Fock Reference State",
        "description": "Apply X gate to prepare initial mean-field electron configuration |10\u27e9.",
        "gateIds": [
          "vqe-x0"
        ],
        "whatHappens": "Establishes the classical approximation baseline."
      },
      {
        "stepNumber": 2,
        "name": "Parameterized Rotation Layer",
        "description": "Apply parameterized single-qubit rotations (H and S gates) to explore the Hilbert space.",
        "gateIds": [
          "vqe-h0",
          "vqe-s0"
        ],
        "whatHappens": "Generates variational superposition governed by continuous parameter angles."
      },
      {
        "stepNumber": 3,
        "name": "Entangling Layer (Electron Correlation)",
        "description": "Apply CNOT from q[0] to q[1] to model quantum electron correlation.",
        "gateIds": [
          "vqe-cx01"
        ],
        "whatHappens": "Captures multi-electron entanglement essential for accurate bond dissociation curves."
      },
      {
        "stepNumber": 4,
        "name": "Hamiltonian Measurement Basis",
        "description": "Apply change-of-basis gates (S and H) to measure expectation values of molecular Pauli terms (\u27e8Z\u27e9, \u27e8X\u27e9, \u27e8Y\u27e9).",
        "gateIds": [
          "vqe-s1",
          "vqe-h1"
        ],
        "whatHappens": "Energy \u27e8H\u27e9 = \u2211 c\u1d62 \u27e8P\u1d62\u27e9 is calculated, providing feedback to the classical optimizer."
      }
    ]
  },
  {
    "id": "qaoa",
    "name": "Quantum Approximate Optimization (QAOA)",
    "category": "Advanced",
    "difficulty": 3,
    "numQubits": 2,
    "purpose": "Solves NP-hard combinatorial optimization problems (such as Graph Max-Cut) using alternating cost and mixer Hamiltonians.",
    "speedup": "Heuristic quantum advantage for NP-hard combinatorial graph search on NISQ processors.",
    "classicalVsQuantum": "Classical approximation algorithms struggle with worst-case graph cuts. QAOA leverages quantum tunneling and interference to escape local minima.",
    "prerequisites": [
      "Ising Hamiltonian",
      "Adiabatic Quantum Computing",
      "Problem vs Mixer Unitaries"
    ],
    "initialGates": [
      {
        "id": "qaoa-h0",
        "type": "H",
        "target": 0,
        "step": 1,
        "control": null
      },
      {
        "id": "qaoa-h1",
        "type": "H",
        "target": 1,
        "step": 1,
        "control": null
      },
      {
        "id": "qaoa-cz",
        "type": "CZ",
        "target": 1,
        "step": 2,
        "control": 0
      },
      {
        "id": "qaoa-h0-mix",
        "type": "H",
        "target": 0,
        "step": 3,
        "control": null
      },
      {
        "id": "qaoa-h1-mix",
        "type": "H",
        "target": 1,
        "step": 3,
        "control": null
      },
      {
        "id": "qaoa-z0-mix",
        "type": "Z",
        "target": 0,
        "step": 4,
        "control": null
      },
      {
        "id": "qaoa-z1-mix",
        "type": "Z",
        "target": 1,
        "step": 4,
        "control": null
      },
      {
        "id": "qaoa-h0-f",
        "type": "H",
        "target": 0,
        "step": 5,
        "control": null
      },
      {
        "id": "qaoa-h1-f",
        "type": "H",
        "target": 1,
        "step": 5,
        "control": null
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "name": "Initial Equal Superposition",
        "description": "Apply Hadamard gates to all qubits, representing equal probability over all binary cuts.",
        "gateIds": [
          "qaoa-h0",
          "qaoa-h1"
        ],
        "whatHappens": "System initialized in the ground state of the transverse field mixer Hamiltonian."
      },
      {
        "stepNumber": 2,
        "name": "Cost Hamiltonian Layer U(C, \u03b3)",
        "description": "Apply CZ gate to simulate phase evolution under the cut edge Hamiltonian.",
        "gateIds": [
          "qaoa-cz"
        ],
        "whatHappens": "Encodes problem constraints: states satisfying the cut receive favorable quantum phase."
      },
      {
        "stepNumber": 3,
        "name": "Mixer Hamiltonian Layer U(B, \u03b2)",
        "description": "Apply H-Z-H (= X rotation) across all qubits to induce quantum tunneling between configurations.",
        "gateIds": [
          "qaoa-h0-mix",
          "qaoa-h1-mix",
          "qaoa-z0-mix",
          "qaoa-z1-mix",
          "qaoa-h0-f",
          "qaoa-h1-f"
        ],
        "whatHappens": "Interferes configurations, amplifying states corresponding to maximum cut solutions."
      }
    ]
  }
];

export function getPlaygroundAlgorithmById(id: string): PlaygroundAlgorithm | undefined {
  return PLAYGROUND_ALGORITHMS.find(a => a.id === id);
}
