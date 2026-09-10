// 90 Scientifically Verified Quantum Practice Questions
// Grounded in the 22 verified database topics

export interface PracticeQuestion {
  id: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  round: 1 | 2 | 3;
  topicId: string;
  topicName: string;
  questionType: 'multiple_choice' | 'true_false' | 'predict' | 'calculation' | 'circuit';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sourceContentId?: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    "id": 1,
    "level": "beginner",
    "round": 1,
    "topicId": "qubit",
    "topicName": "Qubit",
    "questionType": "multiple_choice",
    "question": "What is a qubit in quantum computing?",
    "options": [
      "A transistor switch that stores either 0 or 1 at any moment",
      "The fundamental unit of quantum information described by a 2-dimensional Hilbert space",
      "An analog signal with infinitely many readable voltage states",
      "A microscopic wire carrying optical photons exclusively"
    ],
    "correctIndex": 1,
    "explanation": "A qubit (quantum bit) is the basic unit of quantum information, mathematically described as a state vector in a two-dimensional complex Hilbert space.",
    "difficulty": "beginner",
    "sourceContentId": "qubit"
  },
  {
    "id": 2,
    "level": "beginner",
    "round": 1,
    "topicId": "qubit",
    "topicName": "Qubit",
    "questionType": "multiple_choice",
    "question": "In standard Dirac (ket) notation, what are the two computational basis states for a single qubit?",
    "options": [
      "|0⟩ and |1⟩",
      "|+⟩ and |−⟩",
      "[0] and [1]",
      "|true⟩ and |false⟩"
    ],
    "correctIndex": 0,
    "explanation": "The standard computational basis states are denoted |0⟩ and |1⟩, representing the orthonormal vectors [1, 0]ᵀ and [0, 1]ᵀ.",
    "difficulty": "beginner",
    "sourceContentId": "qubit"
  },
  {
    "id": 3,
    "level": "beginner",
    "round": 1,
    "topicId": "superposition",
    "topicName": "Superposition",
    "questionType": "true_false",
    "question": "True or False: Superposition means that a qubit is physically existing as 0 and 1 at the exact same instant in time.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! A qubit is in a single, well-defined quantum state |ψ⟩ = α|0⟩ + β|1⟩ with complex probability amplitudes. Stating it is '0 and 1 simultaneously' is a misleading classical analogy.",
    "difficulty": "beginner",
    "sourceContentId": "superposition"
  },
  {
    "id": 4,
    "level": "beginner",
    "round": 1,
    "topicId": "superposition",
    "topicName": "Superposition",
    "questionType": "multiple_choice",
    "question": "In the general state equation |ψ⟩ = α|0⟩ + β|1⟩, what are the coefficients α and β called?",
    "options": [
      "Frequencies",
      "Probability amplitudes",
      "Eigenvalues",
      "Boolean weights"
    ],
    "correctIndex": 1,
    "explanation": "α and β are complex numbers known as probability amplitudes. Their squared magnitudes determine measurement probabilities.",
    "difficulty": "beginner",
    "sourceContentId": "superposition"
  },
  {
    "id": 5,
    "level": "beginner",
    "round": 1,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "multiple_choice",
    "question": "What fundamental mathematical rule dictates that the sum of measurement probabilities in |ψ⟩ = α|0⟩ + β|1⟩ must equal 1?",
    "options": [
      "Ohm's Law",
      "Born's Rule Normalization (|α|² + |β|² = 1)",
      "Fourier Inversion",
      "De Morgan's Theorem"
    ],
    "correctIndex": 1,
    "explanation": "By Born's rule, total probability must equal 1: P(0) + P(1) = |α|² + |β|² = 1.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 6,
    "level": "beginner",
    "round": 1,
    "topicId": "qubit",
    "topicName": "Qubit",
    "questionType": "multiple_choice",
    "question": "Which of the following can serve as a physical implementation of a qubit?",
    "options": [
      "Electron spin (spin-up / spin-down)",
      "Photon polarization (horizontal / vertical)",
      "Superconducting Josephson junction circuits",
      "All of the above"
    ],
    "correctIndex": 3,
    "explanation": "All three are prominent physical realizations of qubits: trapped ions / electron spins, optical photons, and superconducting transmon qubits.",
    "difficulty": "beginner",
    "sourceContentId": "qubit"
  },
  {
    "id": 7,
    "level": "beginner",
    "round": 1,
    "topicId": "quantum-interference",
    "topicName": "Quantum Interference",
    "questionType": "multiple_choice",
    "question": "Why can quantum probability amplitudes cancel each other out, unlike classical probabilities?",
    "options": [
      "Because amplitudes are complex numbers with positive, negative, or complex phases",
      "Because qubits lose energy continuously",
      "Because measurement destroys the computer hardware",
      "Because classical bits have imaginary components"
    ],
    "correctIndex": 0,
    "explanation": "Amplitudes are complex numbers with phases. When paths interfere, positive and negative amplitudes cancel destructively, or align constructively.",
    "difficulty": "beginner",
    "sourceContentId": "quantum-interference"
  },
  {
    "id": 8,
    "level": "beginner",
    "round": 1,
    "topicId": "superposition",
    "topicName": "Superposition",
    "questionType": "multiple_choice",
    "question": "What is the state vector representation of the basis state |0⟩?",
    "options": [
      "[0, 1]ᵀ",
      "[1, 0]ᵀ",
      "[1, 1]ᵀ / √2",
      "[0, 0]ᵀ"
    ],
    "correctIndex": 1,
    "explanation": "In standard computational basis, |0⟩ is represented by the column vector [1, 0]ᵀ.",
    "difficulty": "beginner",
    "sourceContentId": "superposition"
  },
  {
    "id": 9,
    "level": "beginner",
    "round": 1,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "true_false",
    "question": "True or False: Measuring a qubit in state |ψ⟩ = (|0⟩ + |1⟩)/√2 allows you to directly read both amplitudes α and β in a single shot.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! A single measurement yields only one classical bit: either 0 or 1, and irreversibly collapses the state. Repeated measurements (sampling) are required to estimate probabilities.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 10,
    "level": "beginner",
    "round": 1,
    "topicId": "qubit",
    "topicName": "Qubit",
    "questionType": "multiple_choice",
    "question": "How many basis states are needed to describe the state space of a system of 3 qubits?",
    "options": [
      "3",
      "6",
      "8 (2³)",
      "16"
    ],
    "correctIndex": 2,
    "explanation": "An n-qubit quantum state has 2ⁿ computational basis states. For n = 3, there are 2³ = 8 basis states (|000⟩ through |111⟩).",
    "difficulty": "beginner",
    "sourceContentId": "qubit"
  },
  {
    "id": 11,
    "level": "beginner",
    "round": 2,
    "topicId": "x-gate",
    "topicName": "X Gate",
    "questionType": "predict",
    "question": "If the Pauli-X gate is applied to the state |0⟩, what is the output state?",
    "options": [
      "|0⟩",
      "|1⟩",
      "-|0⟩",
      "(|0⟩ + |1⟩)/√2"
    ],
    "correctIndex": 1,
    "explanation": "The Pauli-X gate acts as a quantum bit-flip (NOT gate), rotating state |0⟩ into |1⟩ (X|0⟩ = |1⟩).",
    "difficulty": "beginner",
    "sourceContentId": "x-gate"
  },
  {
    "id": 12,
    "level": "beginner",
    "round": 2,
    "topicId": "hadamard-gate",
    "topicName": "Hadamard Gate",
    "questionType": "predict",
    "question": "What state is produced when a Hadamard (H) gate is applied to state |0⟩?",
    "options": [
      "|1⟩",
      "(|0⟩ + |1⟩)/√2 (state |+⟩)",
      "(|0⟩ - |1⟩)/√2 (state |−⟩)",
      "|0⟩"
    ],
    "correctIndex": 1,
    "explanation": "H|0⟩ creates the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.",
    "difficulty": "beginner",
    "sourceContentId": "hadamard-gate"
  },
  {
    "id": 13,
    "level": "beginner",
    "round": 2,
    "topicId": "hadamard-gate",
    "topicName": "Hadamard Gate",
    "questionType": "predict",
    "question": "What state is produced when a Hadamard (H) gate is applied to state |1⟩?",
    "options": [
      "|0⟩",
      "(|0⟩ + |1⟩)/√2",
      "(|0⟩ - |1⟩)/√2 (state |−⟩)",
      "-|1⟩"
    ],
    "correctIndex": 2,
    "explanation": "H|1⟩ maps the computational state |1⟩ to the orthogonal superposition state |−⟩ = (|0⟩ - |1⟩)/√2.",
    "difficulty": "beginner",
    "sourceContentId": "hadamard-gate"
  },
  {
    "id": 14,
    "level": "beginner",
    "round": 2,
    "topicId": "z-gate",
    "topicName": "Z Gate",
    "questionType": "predict",
    "question": "How does the Pauli-Z gate affect the state |0⟩ and state |1⟩?",
    "options": [
      "Flips |0⟩ to |1⟩ and |1⟩ to |0⟩",
      "Leaves |0⟩ unchanged (Z|0⟩ = |0⟩) and introduces a π phase flip to |1⟩ (Z|1⟩ = -|1⟩)",
      "Transforms both into equal superpositions",
      "Collapses the qubit to 0"
    ],
    "correctIndex": 1,
    "explanation": "The Pauli-Z gate is a phase-flip gate: Z|0⟩ = |0⟩ and Z|1⟩ = -|1⟩. It changes the relative phase of |1⟩ by π radians.",
    "difficulty": "beginner",
    "sourceContentId": "z-gate"
  },
  {
    "id": 15,
    "level": "beginner",
    "round": 2,
    "topicId": "bloch-sphere",
    "topicName": "Bloch Sphere",
    "questionType": "multiple_choice",
    "question": "On the standard Bloch sphere representation, where are the states |0⟩ and |1⟩ located?",
    "options": [
      "At the North pole and South pole, respectively",
      "At opposite ends of the equator",
      "At the center of the sphere",
      "Both at the North pole"
    ],
    "correctIndex": 0,
    "explanation": "By convention, |0⟩ is located at the North pole (polar angle θ = 0) and |1⟩ at the South pole (θ = π).",
    "difficulty": "beginner",
    "sourceContentId": "bloch-sphere"
  },
  {
    "id": 16,
    "level": "beginner",
    "round": 2,
    "topicId": "bloch-sphere",
    "topicName": "Bloch Sphere",
    "questionType": "multiple_choice",
    "question": "Where are equal superposition states with different relative phases (such as |+⟩ and |−⟩) located on the Bloch sphere?",
    "options": [
      "Inside the core of the sphere",
      "Along the equator of the sphere (θ = π/2)",
      "Only at the South pole",
      "Outside the sphere surface"
    ],
    "correctIndex": 1,
    "explanation": "States with equal probabilities (|α|² = |β|² = 0.5) lie along the equator of the Bloch sphere where θ = π/2.",
    "difficulty": "beginner",
    "sourceContentId": "bloch-sphere"
  },
  {
    "id": 17,
    "level": "beginner",
    "round": 2,
    "topicId": "y-gate",
    "topicName": "Y Gate",
    "questionType": "multiple_choice",
    "question": "What is the action of the Pauli-Y gate on the computational basis state |0⟩?",
    "options": [
      "Y|0⟩ = i|1⟩",
      "Y|0⟩ = -|0⟩",
      "Y|0⟩ = |0⟩",
      "Y|0⟩ = (|0⟩ + i|1⟩)/√2"
    ],
    "correctIndex": 0,
    "explanation": "The Pauli-Y matrix is [[0, -i], [i, 0]]. Applying it to |0⟩ = [1, 0]ᵀ yields [0, i]ᵀ = i|1⟩.",
    "difficulty": "beginner",
    "sourceContentId": "y-gate"
  },
  {
    "id": 18,
    "level": "beginner",
    "round": 2,
    "topicId": "hadamard-gate",
    "topicName": "Hadamard Gate",
    "questionType": "predict",
    "question": "What is the result of applying two consecutive Hadamard gates to any arbitrary qubit state (H · H |ψ⟩)?",
    "options": [
      "|0⟩",
      "The original state |ψ⟩, because H is its own inverse (H² = I)",
      "-|ψ⟩",
      "A completely randomized state"
    ],
    "correctIndex": 1,
    "explanation": "The Hadamard gate is unitary and Hermitian, meaning H = H† = H⁻¹. Thus, H² = I (identity), returning |ψ⟩.",
    "difficulty": "beginner",
    "sourceContentId": "hadamard-gate"
  },
  {
    "id": 19,
    "level": "beginner",
    "round": 2,
    "topicId": "x-gate",
    "topicName": "X Gate",
    "questionType": "multiple_choice",
    "question": "Geometrically on the Bloch sphere, how does the Pauli-X gate transform a state vector?",
    "options": [
      "A 90-degree rotation about the Z-axis",
      "A 180-degree (π radians) rotation about the X-axis",
      "A contraction toward the center of the sphere",
      "A translation along the Z-axis"
    ],
    "correctIndex": 1,
    "explanation": "Pauli gates correspond to π (180°) rotations around their respective Cartesian axes on the Bloch sphere.",
    "difficulty": "beginner",
    "sourceContentId": "x-gate"
  },
  {
    "id": 20,
    "level": "beginner",
    "round": 2,
    "topicId": "z-gate",
    "topicName": "Z Gate",
    "questionType": "predict",
    "question": "If a Z gate is applied to the state |+⟩ = (|0⟩ + |1⟩)/√2, what state is obtained?",
    "options": [
      "|+⟩",
      "|−⟩ = (|0⟩ - |1⟩)/√2",
      "|0⟩",
      "|1⟩"
    ],
    "correctIndex": 1,
    "explanation": "Z|+⟩ = Z((|0⟩ + |1⟩)/√2) = (Z|0⟩ + Z|1⟩)/√2 = (|0⟩ - |1⟩)/√2 = |−⟩.",
    "difficulty": "beginner",
    "sourceContentId": "z-gate"
  },
  {
    "id": 21,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "calculation",
    "question": "If a qubit is in state |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩, what is the exact probability of measuring outcome 0 in the computational basis?",
    "options": [
      "1/2 (50%)",
      "1/4 (25%)",
      "3/4 (75%)",
      "√3/2 (~86.6%)"
    ],
    "correctIndex": 1,
    "explanation": "By Born's rule, P(0) = |α|² = |1/2|² = 1/4 = 0.25 (25%).",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 22,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "calculation",
    "question": "For state |ψ⟩ = (1/√2)|0⟩ - (1/√2)|1⟩, what is the probability of measuring outcome 1?",
    "options": [
      "-50%",
      "0%",
      "50% (1/2)",
      "100%"
    ],
    "correctIndex": 2,
    "explanation": "Probability is the magnitude squared: P(1) = |-1/√2|² = 1/2 = 50%. The negative sign is a phase factor that squares to a positive real number.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 23,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "multiple_choice",
    "question": "Immediately after measuring a qubit in state |+⟩ and observing outcome 1, what is the new state of the qubit?",
    "options": [
      "|+⟩",
      "|1⟩",
      "|0⟩",
      "A mix of |0⟩ and |1⟩"
    ],
    "correctIndex": 1,
    "explanation": "Under projective measurement in the computational basis, the wavefunction collapses into the eigenstate corresponding to the observed outcome, which is |1⟩.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 24,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "circuit",
    "question": "In a quantum circuit, qubit q0 is initialized to |0⟩, followed by an X gate and then a measurement. What will the classical measurement register always read?",
    "options": [
      "0 with 100% certainty",
      "1 with 100% certainty",
      "50% chance of 0, 50% chance of 1",
      "Undefined"
    ],
    "correctIndex": 1,
    "explanation": "The initial state |0⟩ is flipped to |1⟩ by the X gate. Measuring |1⟩ yields classical bit 1 with 100% certainty.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 25,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "circuit",
    "question": "Qubit q0 is initialized to |0⟩, followed by an H gate and then a measurement. If we run 1,000 shots on an ideal quantum simulator, approximately how many times will 0 be observed?",
    "options": [
      "Exactly 1,000 times",
      "Approximately 500 times (~50%)",
      "Exactly 0 times",
      "Approximately 250 times"
    ],
    "correctIndex": 1,
    "explanation": "H|0⟩ creates (|0⟩ + |1⟩)/√2 with P(0) = 0.5. Over 1,000 shots, the counts will cluster around 500.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 26,
    "level": "beginner",
    "round": 3,
    "topicId": "superposition",
    "topicName": "Superposition",
    "questionType": "calculation",
    "question": "If a qubit state has amplitude α = 0.6 for |0⟩, what must the magnitude of amplitude β be for a normalized pure state?",
    "options": [
      "0.4",
      "0.8",
      "0.64",
      "0.2"
    ],
    "correctIndex": 1,
    "explanation": "|α|² + |β|² = 1 → (0.6)² + |β|² = 1 → 0.36 + |β|² = 1 → |β|² = 0.64 → |β| = 0.8.",
    "difficulty": "beginner",
    "sourceContentId": "superposition"
  },
  {
    "id": 27,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "true_false",
    "question": "True or False: Quantum measurement collapse is reversible using standard unitary quantum gates.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! Standard projective measurement is non-unitary and irreversible. The original superposition amplitudes cannot be restored from the single measured outcome.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 28,
    "level": "beginner",
    "round": 3,
    "topicId": "circuit-builder",
    "topicName": "Circuit Builder",
    "questionType": "circuit",
    "question": "What is the output state of a circuit where qubit 0 starts at |0⟩, passes through H, and then another H gate, before being measured?",
    "options": [
      "0 with 100% probability",
      "1 with 100% probability",
      "50% chance of 0 and 50% chance of 1",
      "State |−⟩"
    ],
    "correctIndex": 0,
    "explanation": "H(H|0⟩) = I|0⟩ = |0⟩. Measurement of state |0⟩ yields classical 0 with 100% certainty.",
    "difficulty": "beginner",
    "sourceContentId": "hadamard-gate"
  },
  {
    "id": 29,
    "level": "beginner",
    "round": 3,
    "topicId": "measurement",
    "topicName": "Measurement",
    "questionType": "multiple_choice",
    "question": "Why do quantum computers run multiple 'shots' (repetitions) of the same circuit?",
    "options": [
      "Because quantum hardware loses power after 1 calculation",
      "To reconstruct the probability distribution of quantum states from projective measurement statistics",
      "To recharge the superconducting magnets",
      "Because gates fail to execute on the first try"
    ],
    "correctIndex": 1,
    "explanation": "Since individual quantum measurements are probabilistic and collapse the state, multiple shots are required to sample the distribution and determine outcome probabilities.",
    "difficulty": "beginner",
    "sourceContentId": "measurement"
  },
  {
    "id": 30,
    "level": "beginner",
    "round": 3,
    "topicId": "bloch-sphere",
    "topicName": "Bloch Sphere",
    "questionType": "multiple_choice",
    "question": "If θ = π and φ = 0 in the Bloch sphere formula |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, which quantum state is represented?",
    "options": [
      "|0⟩",
      "|1⟩",
      "|+⟩",
      "|−⟩"
    ],
    "correctIndex": 1,
    "explanation": "When θ = π, cos(π/2) = 0 and sin(π/2) = 1, giving 0|0⟩ + 1|1⟩ = |1⟩ (the South pole).",
    "difficulty": "beginner",
    "sourceContentId": "bloch-sphere"
  },
  {
    "id": 31,
    "level": "intermediate",
    "round": 1,
    "topicId": "cnot-gate",
    "topicName": "CNOT Gate",
    "questionType": "predict",
    "question": "In a 2-qubit CNOT gate where qubit 0 is the control and qubit 1 is the target, what is the output if the input state is |10⟩?",
    "options": [
      "|10⟩",
      "|11⟩",
      "|00⟩",
      "|01⟩"
    ],
    "correctIndex": 1,
    "explanation": "Since the control qubit (q0) is 1, the target qubit (q1) is inverted from 0 to 1, producing |11⟩.",
    "difficulty": "intermediate",
    "sourceContentId": "cnot-gate"
  },
  {
    "id": 32,
    "level": "intermediate",
    "round": 1,
    "topicId": "bell-state",
    "topicName": "Bell State",
    "questionType": "circuit",
    "question": "Starting from state |00⟩, which gate sequence produces the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2?",
    "options": [
      "H on q0, then CNOT with control q0 and target q1",
      "X on q0, then X on q1",
      "H on q0, then H on q1",
      "CNOT with control q0 and target q1, then H on q0"
    ],
    "correctIndex": 0,
    "explanation": "Applying H on q0 transforms |00⟩ into (|00⟩ + |10⟩)/√2. Then CNOT(q0, q1) flips q1 whenever q0 is 1, creating (|00⟩ + |11⟩)/√2.",
    "difficulty": "intermediate",
    "sourceContentId": "bell-state"
  },
  {
    "id": 33,
    "level": "intermediate",
    "round": 1,
    "topicId": "quantum-entanglement",
    "topicName": "Quantum Entanglement",
    "questionType": "multiple_choice",
    "question": "What defines an entangled two-qubit quantum state mathematically?",
    "options": [
      "The state vector can be written as a direct tensor product of two independent single-qubit states (|ψ⟩ = |a⟩ ⊗ |b⟩)",
      "The state vector CANNOT be factored into a tensor product of two independent single-qubit states",
      "Both qubits must always measure 0",
      "The state has zero energy"
    ],
    "correctIndex": 1,
    "explanation": "A multipartite quantum state is entangled if and only if it cannot be written as a product state |ψ⟩ = |ψA⟩ ⊗ |ψB⟩.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-entanglement"
  },
  {
    "id": 34,
    "level": "intermediate",
    "round": 1,
    "topicId": "bell-state",
    "topicName": "Bell State",
    "questionType": "predict",
    "question": "For the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, if qubit 0 is measured and found to be 1, what is the state of qubit 1?",
    "options": [
      "Immediately collapses to 1 with 100% correlation",
      "Remains in equal superposition (|0⟩ + |1⟩)/√2",
      "Collapses to 0 with 100% certainty",
      "Randomly measures 0 or 1 with equal probability"
    ],
    "correctIndex": 0,
    "explanation": "Measuring q0 as 1 projects the joint state onto the |11⟩ term, instantaneously fixing q1 to state |1|.",
    "difficulty": "intermediate",
    "sourceContentId": "bell-state"
  },
  {
    "id": 35,
    "level": "intermediate",
    "round": 1,
    "topicId": "quantum-entanglement",
    "topicName": "Quantum Entanglement",
    "questionType": "true_false",
    "question": "True or False: Quantum entanglement allows instantaneous transmission of classical information across arbitrary distances (faster-than-light communication).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! According to the No-Communication Theorem, local measurement statistics on one half of an entangled pair are completely random without comparing with the other half via a classical channel.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-entanglement"
  },
  {
    "id": 36,
    "level": "intermediate",
    "round": 1,
    "topicId": "bell-state",
    "topicName": "Bell State",
    "questionType": "multiple_choice",
    "question": "Which of the following is the expression for the Bell state |Ψ⁻⟩ (the singlet state)?",
    "options": [
      "(|00⟩ + |11⟩)/√2",
      "(|00⟩ - |11⟩)/√2",
      "(|01⟩ + |10⟩)/√2",
      "(|01⟩ - |10⟩)/√2"
    ],
    "correctIndex": 3,
    "explanation": "|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2 is the antisymmetric singlet Bell state, invariant under arbitrary rotational transformations.",
    "difficulty": "intermediate",
    "sourceContentId": "bell-state"
  },
  {
    "id": 37,
    "level": "intermediate",
    "round": 1,
    "topicId": "cnot-gate",
    "topicName": "CNOT Gate",
    "questionType": "predict",
    "question": "If the input to a CNOT gate is the product state |++⟩ = H|0⟩ ⊗ H|0⟩, what is the output state?",
    "options": [
      "The entangled state (|00⟩ + |11⟩)/√2",
      "The state |++⟩ unchanged",
      "|--⟩",
      "|11⟩"
    ],
    "correctIndex": 1,
    "explanation": "Since |+⟩ is an eigenstate of the target's X gate with eigenvalue +1, CNOT|++⟩ = |++⟩. The state remains separable and unchanged.",
    "difficulty": "intermediate",
    "sourceContentId": "cnot-gate"
  },
  {
    "id": 38,
    "level": "intermediate",
    "round": 1,
    "topicId": "quantum-entanglement",
    "topicName": "Quantum Entanglement",
    "questionType": "multiple_choice",
    "question": "Which of the following 2-qubit states is a SEPARABLE (non-entangled) product state?",
    "options": [
      "(|00⟩ + |01⟩ + |10⟩ + |11⟩)/2",
      "(|00⟩ + |11⟩)/√2",
      "(|01⟩ - |10⟩)/√2",
      "(|00⟩ - |11⟩)/√2"
    ],
    "correctIndex": 0,
    "explanation": "(|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 factors perfectly into (|0⟩+|1⟩)/√2 ⊗ (|0⟩+|1⟩)/√2 = |+⟩ ⊗ |+⟩.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-entanglement"
  },
  {
    "id": 39,
    "level": "intermediate",
    "round": 1,
    "topicId": "cnot-gate",
    "topicName": "CNOT Gate",
    "questionType": "circuit",
    "question": "How can a SWAP gate between two qubits be constructed using only CNOT gates?",
    "options": [
      "Two CNOT gates in the same direction",
      "Three alternating CNOT gates: CNOT(0,1), CNOT(1,0), CNOT(0,1)",
      "A single CNOT gate with an H gate on both sides",
      "Four CNOT gates in parallel"
    ],
    "correctIndex": 1,
    "explanation": "A canonical SWAP gate is built from three alternating CNOT gates: CNOT(A,B) · CNOT(B,A) · CNOT(A,B).",
    "difficulty": "intermediate",
    "sourceContentId": "cnot-gate"
  },
  {
    "id": 40,
    "level": "intermediate",
    "round": 1,
    "topicId": "bell-state",
    "topicName": "Bell State",
    "questionType": "calculation",
    "question": "In the Bell state |Φ⁻⟩ = (|00⟩ - |11⟩)/√2, what is the probability of measuring the classical bitstring '01'?",
    "options": [
      "50%",
      "0%",
      "25%",
      "-50%"
    ],
    "correctIndex": 1,
    "explanation": "The state has zero amplitude for |01⟩ and |10⟩. The only possible measurement outcomes are '00' (50%) and '11' (50%).",
    "difficulty": "intermediate",
    "sourceContentId": "bell-state"
  },
  {
    "id": 41,
    "level": "intermediate",
    "round": 2,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "multiple_choice",
    "question": "What is the core principle behind the quantum phase kickback mechanism?",
    "options": [
      "Qubits kick energy into the classical control wires",
      "When a controlled operation acts on an eigenstate of the target qubit, the eigenvalue's phase is kicked back into the control qubit",
      "Measurement forces the target qubit to rotate the control qubit's basis",
      "The control qubit is inverted whenever the target is |0⟩"
    ],
    "correctIndex": 1,
    "explanation": "If U|u⟩ = e^(iθ)|u⟩, then Controlled-U on |ψ⟩|u⟩ applies the phase factor e^(iθ) to the control qubit state |1⟩, kicking the phase back to the control.",
    "difficulty": "intermediate",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 42,
    "level": "intermediate",
    "round": 2,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "predict",
    "question": "If a CNOT gate is applied with control qubit in state |+⟩ and target qubit in state |−⟩, what is the output state?",
    "options": [
      "|+⟩|−⟩",
      "|−⟩|−⟩",
      "|0⟩|1⟩",
      "|+⟩|+⟩"
    ],
    "correctIndex": 1,
    "explanation": "|−⟩ is an eigenstate of X with eigenvalue -1. The -1 phase kicks back to the control qubit's |1⟩ component, changing the control from |+⟩ to |−⟩, yielding |−⟩|−⟩.",
    "difficulty": "intermediate",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 43,
    "level": "intermediate",
    "round": 2,
    "topicId": "z-gate",
    "topicName": "Z Gate",
    "questionType": "multiple_choice",
    "question": "What is the difference between a global phase (e.g. e^(iθ)|ψ⟩) and a relative phase (e.g. |0⟩ + e^(iθ)|1⟩)?",
    "options": [
      "Global phases are physically unobservable and have no measurement effect; relative phases cause physical interference",
      "Global phases can be measured, but relative phases cannot",
      "Relative phases always equal zero",
      "There is no difference in quantum mechanics"
    ],
    "correctIndex": 0,
    "explanation": "Global phase factor e^(iθ) does not affect probabilities or expectation values (|e^(iθ)|² = 1). Relative phase between basis components creates observable interference.",
    "difficulty": "intermediate",
    "sourceContentId": "z-gate"
  },
  {
    "id": 44,
    "level": "intermediate",
    "round": 2,
    "topicId": "quantum-interference",
    "topicName": "Quantum Interference",
    "questionType": "predict",
    "question": "In a Mach-Zehnder interferometer equivalent circuit: |0⟩ → H → Phase Shift π → H → Measure. What is the final outcome?",
    "options": [
      "Always 0",
      "Always 1",
      "50% chance 0, 50% chance 1",
      "Undefined"
    ],
    "correctIndex": 1,
    "explanation": "H|0⟩ = |+⟩. Phase shift π applies Z, yielding |−⟩. H|−⟩ = |1⟩. Destructive interference completely eliminates outcome 0, concentrating 100% on 1.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-interference"
  },
  {
    "id": 45,
    "level": "intermediate",
    "round": 2,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "circuit",
    "question": "Why is the target ancilla qubit in the Deutsch-Jozsa algorithm initialized to state |−⟩ = (|0⟩ - |1⟩)/√2?",
    "options": [
      "To absorb thermal noise from the circuit",
      "Because |−⟩ is an eigenstate of the bit-flip operator with eigenvalue (-1)^f(x), facilitating phase kickback",
      "Because |−⟩ cannot be measured",
      "To reset the qubit to zero"
    ],
    "correctIndex": 1,
    "explanation": "Since X|−⟩ = -|−⟩, evaluating f(x) via |y ⊕ f(x)⟩ multiplies the amplitude by (-1)^f(x), transferring the function evaluation into the phase of the input register.",
    "difficulty": "intermediate",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 46,
    "level": "intermediate",
    "round": 2,
    "topicId": "quantum-interference",
    "topicName": "Quantum Interference",
    "questionType": "multiple_choice",
    "question": "What mathematical property of unitary quantum gates guarantees that total probability is conserved throughout any circuit?",
    "options": [
      "U† U = I (the conjugate transpose equals the inverse)",
      "det(U) = 0",
      "All entries of U are real positive numbers",
      "U is a diagonal matrix"
    ],
    "correctIndex": 0,
    "explanation": "Unitary matrices satisfy U† U = I, preserving the inner product and the Euclidean norm of state vectors (conservation of total probability).",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-interference"
  },
  {
    "id": 47,
    "level": "intermediate",
    "round": 2,
    "topicId": "z-gate",
    "topicName": "Z Gate",
    "questionType": "calculation",
    "question": "What is the relative phase angle between |0⟩ and |1⟩ for the state |i⟩ = (|0⟩ + i|1⟩)/√2?",
    "options": [
      "0 radians",
      "π/2 radians (90°)",
      "π radians (180°)",
      "3π/2 radians (270°)"
    ],
    "correctIndex": 1,
    "explanation": "Since i = e^(iπ/2), the relative phase angle φ is π/2 radians (90 degrees).",
    "difficulty": "intermediate",
    "sourceContentId": "bloch-sphere"
  },
  {
    "id": 48,
    "level": "intermediate",
    "round": 2,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "predict",
    "question": "If a controlled-Z gate (CZ) is applied to state |11⟩, what is the output state?",
    "options": [
      "|11⟩",
      "-|11⟩",
      "|10⟩",
      "|01⟩"
    ],
    "correctIndex": 1,
    "explanation": "A CZ gate applies a phase of -1 if and only if both qubits are in state 1: CZ|11⟩ = -|11⟩. Note that CZ is symmetric between both qubits.",
    "difficulty": "intermediate",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 49,
    "level": "intermediate",
    "round": 2,
    "topicId": "quantum-interference",
    "topicName": "Quantum Interference",
    "questionType": "true_false",
    "question": "True or False: Quantum interference can eliminate unwanted computational paths only if those paths have opposite signs (+ and -) or canceling complex phases.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "True! Destructive interference occurs when computational paths arriving at the same classical basis state have probability amplitudes that sum to zero.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-interference"
  },
  {
    "id": 50,
    "level": "intermediate",
    "round": 2,
    "topicId": "hadamard-gate",
    "topicName": "Hadamard Gate",
    "questionType": "calculation",
    "question": "What is the inner product ⟨+|−⟩ between the states |+⟩ and |−⟩?",
    "options": [
      "1",
      "0",
      "1/2",
      "-1"
    ],
    "correctIndex": 1,
    "explanation": "⟨+|−⟩ = (1/√2)[1, 1] · (1/√2)[1, -1]ᵀ = (1 - 1)/2 = 0. The states |+⟩ and |−⟩ form an orthonormal basis.",
    "difficulty": "intermediate",
    "sourceContentId": "hadamard-gate"
  },
  {
    "id": 51,
    "level": "intermediate",
    "round": 3,
    "topicId": "toffoli-gate",
    "topicName": "Toffoli Gate",
    "questionType": "predict",
    "question": "What does the 3-qubit Toffoli (CCNOT) gate do to target qubit 2 when control qubits 0 and 1 are in state |11⟩?",
    "options": [
      "Leaves target qubit 2 unchanged",
      "Inverts (flips) target qubit 2",
      "Puts target qubit 2 into superposition",
      "Measures all three qubits"
    ],
    "correctIndex": 1,
    "explanation": "The Toffoli gate flips the target qubit if and only if both control qubits are 1 (acting as a reversible quantum AND gate).",
    "difficulty": "intermediate",
    "sourceContentId": "toffoli-gate"
  },
  {
    "id": 52,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-teleportation",
    "topicName": "Quantum Teleportation",
    "questionType": "multiple_choice",
    "question": "In the standard quantum teleportation protocol, what resources are consumed to transmit 1 unknown qubit state from Alice to Bob?",
    "options": [
      "1 shared Bell pair and 2 classical bits sent through a classical channel",
      "2 shared Bell pairs and zero classical communication",
      "1 classical bit and a laser beam",
      "A physical quantum wormhole"
    ],
    "correctIndex": 0,
    "explanation": "Teleporting an unknown single qubit state requires 1 pre-shared entangled Bell pair and 2 classical bits communicated from Alice to Bob.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-teleportation"
  },
  {
    "id": 53,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-teleportation",
    "topicName": "Quantum Teleportation",
    "questionType": "true_false",
    "question": "True or False: Quantum teleportation violates the quantum No-Cloning Theorem by copying the original state to the destination.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! Alice's Bell-basis measurement completely destroys the original quantum state at her end. The state is transferred, never duplicated.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-teleportation"
  },
  {
    "id": 54,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-key-distribution",
    "topicName": "Quantum Key Distribution",
    "questionType": "multiple_choice",
    "question": "In the BB84 protocol for Quantum Key Distribution, how do Alice and Bob detect the presence of an eavesdropper (Eve)?",
    "options": [
      "By measuring a higher quantum bit error rate (QBER) in their shared test bits due to measurement disturbance",
      "By checking if Eve's IP address appears in the server log",
      "By looking for dropped photons in the cable",
      "By asking the telecommunications provider"
    ],
    "correctIndex": 0,
    "explanation": "Because measurement collapses quantum states (information-disturbance tradeoff), Eve measuring in the wrong basis introduces ~25% error rate, revealing her presence.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-key-distribution"
  },
  {
    "id": 55,
    "level": "intermediate",
    "round": 3,
    "topicId": "toffoli-gate",
    "topicName": "Toffoli Gate",
    "questionType": "multiple_choice",
    "question": "Why is the Toffoli gate significant for classical reversible computation on a quantum computer?",
    "options": [
      "It is universal for reversible classical Boolean logic (can implement AND, NOT, NAND, OR)",
      "It is the only gate that works at room temperature",
      "It eliminates quantum decoherence entirely",
      "It allows measuring without collapsing state"
    ],
    "correctIndex": 0,
    "explanation": "The Toffoli gate is universal for classical reversible computing because setting target to 0 computes AND(q0, q1), and setting target to 1 computes NAND.",
    "difficulty": "intermediate",
    "sourceContentId": "toffoli-gate"
  },
  {
    "id": 56,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-teleportation",
    "topicName": "Quantum Teleportation",
    "questionType": "circuit",
    "question": "In quantum teleportation, after Alice performs a Bell measurement yielding classical bits (b1, b2), what operations does Bob apply to his qubit?",
    "options": [
      "Pauli-X and Pauli-Z corrections conditioned on the two classical bits",
      "Hadamard gate and measurement",
      "Reset his qubit to |0⟩",
      "No operation is ever needed"
    ],
    "correctIndex": 0,
    "explanation": "Bob applies Z^(b1) X^(b2) conditional Pauli corrections to restore the exact original quantum state |ψ⟩.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-teleportation"
  },
  {
    "id": 57,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-key-distribution",
    "topicName": "Quantum Key Distribution",
    "questionType": "multiple_choice",
    "question": "Which two conjugate bases are typically employed in the BB84 QKD protocol?",
    "options": [
      "Computational basis (|0⟩, |1⟩) and Hadamard diagonal basis (|+⟩, |−⟩)",
      "Z-basis and Z-basis only",
      "Circular polarization only",
      "Binary and hexadecimal bases"
    ],
    "correctIndex": 0,
    "explanation": "BB84 uses two mutually unbiased bases: rectilinear/computational basis {|0⟩, |1⟩} and diagonal/Hadamard basis {|+⟩, |−⟩}.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-key-distribution"
  },
  {
    "id": 58,
    "level": "intermediate",
    "round": 3,
    "topicId": "cnot-gate",
    "topicName": "CNOT Gate",
    "questionType": "calculation",
    "question": "How many non-zero entries exist in the 4x4 matrix representation of a 2-qubit CNOT gate?",
    "options": [
      "2",
      "4",
      "8",
      "16"
    ],
    "correctIndex": 1,
    "explanation": "The CNOT matrix is a 4x4 permutation matrix containing exactly four '1's (one per row and column) and twelve '0's.",
    "difficulty": "intermediate",
    "sourceContentId": "cnot-gate"
  },
  {
    "id": 59,
    "level": "intermediate",
    "round": 3,
    "topicId": "toffoli-gate",
    "topicName": "Toffoli Gate",
    "questionType": "predict",
    "question": "What is the minimum number of single-qubit and 2-qubit CNOT gates required to decompose a 3-qubit Toffoli gate?",
    "options": [
      "1 CNOT gate",
      "6 CNOT gates (along with single-qubit T, T†, and H gates)",
      "100 CNOT gates",
      "Toffoli cannot be decomposed"
    ],
    "correctIndex": 1,
    "explanation": "A standard Barenco et al. decomposition of the Toffoli gate requires 6 CNOT gates and several single-qubit Clifford+T gates.",
    "difficulty": "intermediate",
    "sourceContentId": "toffoli-gate"
  },
  {
    "id": 60,
    "level": "intermediate",
    "round": 3,
    "topicId": "quantum-entanglement",
    "topicName": "Quantum Entanglement",
    "questionType": "true_false",
    "question": "True or False: If two qubits are in the entangled Bell state (|00⟩ + |11⟩)/√2, the density matrix of either individual qubit considered alone is completely mixed (maximal uncertainty).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "True! Tracing out one qubit yields the reduced density matrix ρ = I/2 = 0.5|0⟩⟨0| + 0.5|1⟩⟨1|, showing zero single-qubit information despite perfect joint correlation.",
    "difficulty": "intermediate",
    "sourceContentId": "quantum-entanglement"
  },
  {
    "id": 61,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "multiple_choice",
    "question": "What computational promise does the Deutsch-Jozsa algorithm solve with a single query?",
    "options": [
      "Sorting an unsorted database of N numbers",
      "Determining with 100% certainty whether a Boolean function f(x) is constant (same output for all inputs) or balanced (0 for half, 1 for half)",
      "Finding prime factors of a large composite integer",
      "Finding the shortest path in a graph"
    ],
    "correctIndex": 1,
    "explanation": "Deutsch-Jozsa evaluates whether an oracle function f: {0,1}ⁿ → {0,1} is constant or balanced in exactly 1 quantum query, compared to 2^(n-1)+1 queries classically in the worst case.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 62,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "circuit",
    "question": "In the Deutsch-Jozsa algorithm for n input qubits, what is the final measurement outcome if f(x) is a CONSTANT function?",
    "options": [
      "All n input qubits measure |00...0⟩ with 100% probability",
      "Any state other than |00...0⟩",
      "Completely uniform random measurement across all 2ⁿ states",
      "All qubits measure |11...1⟩"
    ],
    "correctIndex": 0,
    "explanation": "For a constant function, constructive interference aligns all amplitude on the all-zero state |00...0⟩. For a balanced function, destructive interference guarantees amplitude on |00...0⟩ is exactly 0.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 63,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "multiple_choice",
    "question": "What mathematical expression describes the amplitude of the |00...0⟩ state before final measurement in Deutsch-Jozsa?",
    "options": [
      "(1/2ⁿ) ∑_{x=0}^{2ⁿ-1} (-1)^f(x)",
      "∑_{x=0}^{2ⁿ-1} f(x)",
      "(1/√2ⁿ) (-1)^f(0)",
      "f(0) · f(1)"
    ],
    "correctIndex": 0,
    "explanation": "The amplitude for |0⟩^⊗n is (1/2ⁿ) ∑_x (-1)^f(x). If f is constant, this sum is ±1 (100% prob). If f is balanced, positive and negative terms cancel to exactly 0.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 64,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "calculation",
    "question": "For an input size of n = 10 qubits, how many queries does a classical deterministic algorithm require in the worst case to distinguish constant from balanced?",
    "options": [
      "1 query",
      "10 queries",
      "2^(10-1) + 1 = 513 queries",
      "1,024 queries"
    ],
    "correctIndex": 2,
    "explanation": "In the worst case, a classical algorithm could see 512 identical outputs ('0') and still not know if the 513th output is '0' (constant) or '1' (balanced). Quantum requires 1 query.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 65,
    "level": "advanced",
    "round": 1,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "circuit",
    "question": "If an oracle for a 1-qubit balanced function f(x) = x is queried with target qubit in state |−⟩, what gate is physically applied between control and target?",
    "options": [
      "CNOT gate",
      "Identity gate",
      "Hadamard gate",
      "Measurement"
    ],
    "correctIndex": 0,
    "explanation": "Since f(0)=0 and f(1)=1, the unitary mapping |x⟩|y⟩ → |x⟩|y ⊕ x⟩ is precisely the CNOT gate.",
    "difficulty": "advanced",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 66,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "true_false",
    "question": "True or False: The Deutsch-Jozsa algorithm provides a superpolynomial quantum speedup over classical PROBABILISTIC (Monte Carlo) algorithms in practical applications.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! A classical randomized algorithm can identify a balanced function with 99.9% confidence in just a few queries (e.g., ~k queries gives 1 - (1/2)^k confidence). The speedup is exact vs deterministic.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 67,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "multiple_choice",
    "question": "What role do the final Hadamard gates play on the n input qubits in the Deutsch-Jozsa circuit?",
    "options": [
      "They convert the phase information encoded across all basis states into readable computational basis amplitudes",
      "They reset the qubits to thermal ground state",
      "They measure the qubits in the Y-basis",
      "They double the number of qubits"
    ],
    "correctIndex": 0,
    "explanation": "The final H^⊗n transformation performs an interference synthesis, mapping relative phase shifts back to population amplitudes in the computational basis.",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 68,
    "level": "advanced",
    "round": 1,
    "topicId": "quantum-interference",
    "topicName": "Quantum Interference",
    "questionType": "predict",
    "question": "If a balanced oracle has f(x) = 1 for half of inputs and 0 for the other half, what is the probability of measuring |00...0⟩ after the final Hadamard transform?",
    "options": [
      "100%",
      "Exactly 0%",
      "50%",
      "25%"
    ],
    "correctIndex": 1,
    "explanation": "Because exactly half the terms in the sum have factor +1 and half have -1, the sum is exactly 0. The probability of measuring |00...0⟩ is identically 0%.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-interference"
  },
  {
    "id": 69,
    "level": "advanced",
    "round": 1,
    "topicId": "phase-kickback",
    "topicName": "Phase Kickback",
    "questionType": "multiple_choice",
    "question": "How does an oracle implementing f(x) = 0 for all x (constant 0) affect the circuit state?",
    "options": [
      "Applies an identity transformation (no phase change to any term)",
      "Flips all control qubits",
      "Multiplies every state by -1",
      "Collapses the superposition"
    ],
    "correctIndex": 0,
    "explanation": "Since f(x) = 0 for all x, (-1)^f(x) = (-1)^0 = +1. No phase shifts are imparted, leaving the input superposition unchanged.",
    "difficulty": "advanced",
    "sourceContentId": "phase-kickback"
  },
  {
    "id": 70,
    "level": "advanced",
    "round": 1,
    "topicId": "deutsch-jozsa-algorithm",
    "topicName": "Deutsch-Jozsa Algorithm",
    "questionType": "multiple_choice",
    "question": "Which quantum complexity class contains problems solvable with zero-error polynomial-time quantum algorithms like Deutsch-Jozsa?",
    "options": [
      "BQP (Bounded-error Quantum Polynomial time)",
      "EQP (Exact Quantum Polynomial time)",
      "NP-Complete",
      "PSPACE"
    ],
    "correctIndex": 1,
    "explanation": "EQP is the class of decision problems solvable by a quantum computer in polynomial time with zero error (exact algorithms).",
    "difficulty": "advanced",
    "sourceContentId": "deutsch-jozsa-algorithm"
  },
  {
    "id": 71,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "multiple_choice",
    "question": "What is the computational complexity of Grover's search algorithm for an unstructured database of N items?",
    "options": [
      "O(N) queries",
      "O(log N) queries",
      "O(√N) queries",
      "O(1) queries"
    ],
    "correctIndex": 2,
    "explanation": "Grover's algorithm achieves a quadratic speedup, finding a marked target in O(√N) queries compared to O(N) classically.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 72,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "multiple_choice",
    "question": "What are the two operators that comprise a single Grover iteration?",
    "options": [
      "Quantum Oracle (reflection about target state) and Grover Diffusion Operator (reflection about the average amplitude)",
      "Two Hadamard gates",
      "A measurement followed by an X gate",
      "Quantum Fourier Transform and modular exponentiation"
    ],
    "correctIndex": 0,
    "explanation": "Each Grover iteration consists of the phase oracle R_w = I - 2|w⟩⟨w| followed by the diffusion operator R_s = 2|s⟩⟨s| - I (inversion about the mean).",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 73,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "calculation",
    "question": "For an unstructured search space of N = 16 (4 qubits) with 1 marked item, what is the optimal number of Grover iterations (approximately (π/4)√N)?",
    "options": [
      "1 iteration",
      "3 iterations (since (π/4)·4 ≈ 3.14)",
      "8 iterations",
      "16 iterations"
    ],
    "correctIndex": 1,
    "explanation": "Optimal iterations R ≈ (π/4)√N = (π/4)·4 = π ≈ 3 iterations. Applying 3 iterations brings the target probability to >95%.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 74,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "multiple_choice",
    "question": "What geometric operation does a full Grover iteration perform on the 2D subspace spanned by the target state |w⟩ and the non-target superposition |w^⊥⟩?",
    "options": [
      "A rotation by angle θ ≈ 2/√N toward the target state vector",
      "A projection directly onto the X-axis",
      "A random translation",
      "A contraction of the state norm"
    ],
    "correctIndex": 0,
    "explanation": "Geometrically, two consecutive reflections (oracle reflection then diffusion reflection) produce a clean rotation in the 2D plane by angle 2θ, where sin θ = 1/√N.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 75,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "true_false",
    "question": "True or False: If you continue applying Grover iterations well past the optimal number (π/4)√N, the success probability continues increasing toward 100%.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! Grover's algorithm is an oscillation (rotation). Continuing past the optimal iteration rotates the state vector past the target state, causing 'overcooking' and decreasing success probability.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 76,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "circuit",
    "question": "How is the Grover diffusion operator D = 2|s⟩⟨s| - I implemented in a quantum circuit?",
    "options": [
      "H^⊗n followed by phase flip on |0...0⟩ (X^⊗n → Multi-Controlled-Z → X^⊗n) followed by H^⊗n",
      "Applying CNOT across all pairs of qubits",
      "A single Pauli-Y gate on the first qubit",
      "Measuring all qubits and resetting them"
    ],
    "correctIndex": 0,
    "explanation": "D = H^⊗n (2|0⟩⟨0| - I) H^⊗n. The operator 2|0⟩⟨0| - I is implemented by sandwiching a multi-controlled phase flip between X gates.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 77,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "calculation",
    "question": "In a database of N = 4 items with initial uniform amplitude 1/2 for each state, what is the amplitude of the marked item after the oracle inverts its phase to -1/2?",
    "options": [
      "-1/2",
      "+1/2",
      "0",
      "-1"
    ],
    "correctIndex": 0,
    "explanation": "The phase oracle selectively flips the sign of the marked item: α_target = -1/2, while other items remain at +1/2.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 78,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "calculation",
    "question": "Continuing from Q77 (amplitudes: marked = -0.5, three unmarked = +0.5): what is the mean amplitude μ, and what is the new marked amplitude after inversion about the mean (2μ - α)?",
    "options": [
      "Mean = 0.25, new marked amplitude = 2(0.25) - (-0.5) = 1.0 (100% probability!)",
      "Mean = 0.5, new marked amplitude = 0.5",
      "Mean = 0, new marked amplitude = 0",
      "Mean = -0.25, new marked amplitude = 0.5"
    ],
    "correctIndex": 0,
    "explanation": "Mean μ = (-0.5 + 0.5 + 0.5 + 0.5)/4 = 1.0/4 = 0.25. Inversion about the mean: 2(0.25) - (-0.5) = 0.5 + 0.5 = 1.0! For N=4, 1 iteration gives exactly 100% success.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 79,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "multiple_choice",
    "question": "Has it been mathematically proven that Grover's O(√N) query bound is optimal for searching an unstructured database?",
    "options": [
      "Yes, Bennett, Bernstein, Brassard, and Vazirani (BBBV theorem) proved that no quantum algorithm can search an unstructured database in fewer than Ω(√N) queries",
      "No, an O(log N) algorithm has been found",
      "No, classical algorithms can achieve O(√N) with caching",
      "Only for N < 100"
    ],
    "correctIndex": 0,
    "explanation": "The BBBV theorem established that Ω(√N) is a tight fundamental lower bound for quantum unstructured search.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 80,
    "level": "advanced",
    "round": 2,
    "topicId": "grovers-algorithm",
    "topicName": "Grover's Algorithm",
    "questionType": "multiple_choice",
    "question": "What is the primary application of Grover's amplitude amplification in modern cryptography?",
    "options": [
      "Effectively halving the symmetric key security level (e.g. reducing AES-128 brute force to ~2⁶⁴ operations), necessitating 256-bit keys",
      "Breaking RSA-2048 in polynomial time",
      "Decoupling classical optical fibers",
      "Generating pseudo-random strings"
    ],
    "correctIndex": 0,
    "explanation": "Grover search provides a quadratic speedup against symmetric ciphers, reducing the effective security of key length k to k/2, which is why post-quantum standards mandate 256-bit symmetric keys.",
    "difficulty": "advanced",
    "sourceContentId": "grovers-algorithm"
  },
  {
    "id": 81,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-fourier-transform",
    "topicName": "Quantum Fourier Transform",
    "questionType": "multiple_choice",
    "question": "What transformation does the Quantum Fourier Transform (QFT) perform on a computational basis state |j⟩?",
    "options": [
      "Maps |j⟩ to (1/√N) ∑_{k=0}^{N-1} e^(2πi j k / N) |k⟩",
      "Inverts all bits of j",
      "Multiplies j by a random prime number",
      "Measures j in the Bell basis"
    ],
    "correctIndex": 0,
    "explanation": "The QFT is the quantum analogue of the Discrete Fourier Transform, mapping basis state |j⟩ to an equal-magnitude superposition with relative phase angles 2πjk/N.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-fourier-transform"
  },
  {
    "id": 82,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-fourier-transform",
    "topicName": "Quantum Fourier Transform",
    "questionType": "calculation",
    "question": "What is the circuit gate complexity to compute the QFT on n qubits, compared to the classical Fast Fourier Transform (FFT) on N = 2ⁿ points?",
    "options": [
      "Quantum: O(n²); Classical FFT: O(n 2ⁿ)",
      "Quantum: O(2ⁿ); Classical FFT: O(n²)",
      "Quantum: O(1); Classical FFT: O(log n)",
      "Quantum: O(n³); Classical FFT: O(n)"
    ],
    "correctIndex": 0,
    "explanation": "QFT requires only O(n²) quantum gates (Hadamard and controlled phase rotations), whereas classical FFT requires O(N log N) = O(n 2ⁿ) operations — an exponential gate speedup.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-fourier-transform"
  },
  {
    "id": 83,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-phase-estimation",
    "topicName": "Quantum Phase Estimation",
    "questionType": "multiple_choice",
    "question": "What is the objective of the Quantum Phase Estimation (QPE) algorithm?",
    "options": [
      "Given a unitary operator U and an eigenstate |u⟩ such that U|u⟩ = e^(2πi θ)|u⟩, estimate the unknown phase θ",
      "Determine the physical temperature of superconducting qubits",
      "Calculate the determinant of non-unitary matrices",
      "Compress classical video data"
    ],
    "correctIndex": 0,
    "explanation": "QPE estimates the phase eigenvalue θ of a unitary operator U given access to controlled-U powers and eigenstate |u⟩.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-phase-estimation"
  },
  {
    "id": 84,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-phase-estimation",
    "topicName": "Quantum Phase Estimation",
    "questionType": "circuit",
    "question": "What is the final stage of the Quantum Phase Estimation circuit after the controlled-U^(2ʲ) operations are executed?",
    "options": [
      "Inverse Quantum Fourier Transform (QFT†) followed by measurement of the estimation register",
      "Grover diffusion operator",
      "Reset of all qubits to |1⟩",
      "Toffoli cascade"
    ],
    "correctIndex": 0,
    "explanation": "Controlled-U operations write the phase into the Fourier basis of the register; applying QFT† translates the Fourier phase into computational basis states for direct measurement.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-phase-estimation"
  },
  {
    "id": 85,
    "level": "advanced",
    "round": 3,
    "topicId": "shors-algorithm",
    "topicName": "Shor's Algorithm",
    "questionType": "multiple_choice",
    "question": "Which quantum subroutine provides the exponential speedup in Shor's algorithm for factoring composite integers N?",
    "options": [
      "Quantum Order-Finding (Period Finding) using QPE / QFT to find the period r of f(x) = aˣ mod N",
      "Grover search over all primes",
      "Deutsch-Jozsa evaluation of parity",
      "Quantum Teleportation of factors"
    ],
    "correctIndex": 0,
    "explanation": "Shor's algorithm reduces factoring to order-finding (finding the period r of aˣ mod N), which quantum computers solve in polynomial time O((log N)³) via QPE.",
    "difficulty": "advanced",
    "sourceContentId": "shors-algorithm"
  },
  {
    "id": 86,
    "level": "advanced",
    "round": 3,
    "topicId": "shors-algorithm",
    "topicName": "Shor's Algorithm",
    "questionType": "calculation",
    "question": "If order-finding finds an even period r such that aʳ ≡ 1 (mod N) and a^(r/2) ≢ -1 (mod N), how are candidate factors of N obtained classically?",
    "options": [
      "gcd(a^(r/2) ± 1, N) using Euclid's classical algorithm",
      "By trial division from 2 to √N",
      "By taking the square root of N",
      "By running Shor's algorithm again with the same parameters"
    ],
    "correctIndex": 0,
    "explanation": "Since (a^(r/2) - 1)(a^(r/2) + 1) = aʳ - 1 = k N, computing greatest common divisors gcd(a^(r/2) ± 1, N) via Euclid's algorithm reveals non-trivial factors.",
    "difficulty": "advanced",
    "sourceContentId": "shors-algorithm"
  },
  {
    "id": 87,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-error-correction",
    "topicName": "Quantum Error Correction",
    "questionType": "multiple_choice",
    "question": "Why is quantum error correction fundamentally more challenging than classical error correction (which simply duplicates bits 0 → 000)?",
    "options": [
      "The No-Cloning theorem forbids copying unknown quantum states, and measurement collapses superpositions",
      "Quantum computers have no transistors",
      "Quantum errors only occur in hardware memory chips",
      "Qubits have zero resistance"
    ],
    "correctIndex": 0,
    "explanation": "Unknown states cannot be cloned (|ψ⟩ → |ψ⟩|ψ⟩ is impossible), and direct inspection causes wavefunction collapse. QEC must detect errors without learning the data.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-error-correction"
  },
  {
    "id": 88,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-error-correction",
    "topicName": "Quantum Error Correction",
    "questionType": "circuit",
    "question": "In the 3-qubit bit-flip code, how does the decoder diagnose which physical qubit suffered an X bit-flip error without destroying the logical superposition?",
    "options": [
      "By measuring two multi-qubit parity syndromes (Z₁Z₂ and Z₂Z₃) using ancilla qubits",
      "By measuring each of the three data qubits directly in the computational basis",
      "By applying three Hadamard gates and checking if the light glows",
      "By resetting the computer"
    ],
    "correctIndex": 0,
    "explanation": "Syndrome measurement extracts parity eigenvalues (whether adjacent qubits are identical or different) into ancillas, pinpointing the error location while preserving the encoded amplitudes.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-error-correction"
  },
  {
    "id": 89,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-error-correction",
    "topicName": "Quantum Error Correction",
    "questionType": "multiple_choice",
    "question": "What is the minimum number of physical qubits required to encode 1 logical qubit capable of correcting an arbitrary single-qubit error (both bit-flip X and phase-flip Z errors)?",
    "options": [
      "3 qubits",
      "5 qubits (the 5-qubit perfect code / [[5, 1, 3]])",
      "7 qubits (Steane code only)",
      "100 qubits"
    ],
    "correctIndex": 1,
    "explanation": "The quantum Hamming bound establishes that at least 5 physical qubits are needed to protect 1 logical qubit against an arbitrary single-qubit Pauli error [[5, 1, 3]].",
    "difficulty": "advanced",
    "sourceContentId": "quantum-error-correction"
  },
  {
    "id": 90,
    "level": "advanced",
    "round": 3,
    "topicId": "quantum-error-correction",
    "topicName": "Quantum Error Correction",
    "questionType": "true_false",
    "question": "True or False: Because arbitrary quantum errors form a continuous space of rotations, quantum error correction requires an infinite number of syndrome measurements.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False! Any arbitrary single-qubit error can be expanded in the basis of Pauli matrices {I, X, Y, Z}. Measuring discrete Pauli syndromes collapses a continuous error into a discrete Pauli error, which is then corrected.",
    "difficulty": "advanced",
    "sourceContentId": "quantum-error-correction"
  }
];

export function getQuestionsForRound(level: 'beginner' | 'intermediate' | 'advanced', round: 1 | 2 | 3): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter(q => q.level === level && q.round === round);
}

export function getQuestionsForLevel(level: 'beginner' | 'intermediate' | 'advanced'): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter(q => q.level === level);
}
