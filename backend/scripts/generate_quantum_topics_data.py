"""
Data Generator for Verified Quantum Topics Encyclopedia
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform
"""

import json
import os
from datetime import datetime, timezone

NOW = datetime.now(timezone.utc).isoformat()

TOPICS = [
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
        "related_topics": ["Superposition", "Measurement", "Bloch Sphere", "Hadamard Gate"],
        "common_mistakes": [
            "Believing a qubit is '0 and 1 simultaneously' rather than possessing a definite state with probabilistic measurement outcomes.",
            "Assuming reading or measuring a qubit preserves its superposition state."
        ],
        "aliases": ["quantum bit", "qubits", "what is a qubit", "single qubit"],
        "keywords": ["qubit", "quantum bit", "quantum information", "state vector", "amplitudes", "ket 0", "ket 1", "hilbert space"],
        "tags": ["foundations", "qubit", "core-concept", "basis-states"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems",
        "additional_sources": [
            {"title": "Qiskit Documentation: Fundamentals", "url": "https://docs.quantum.ibm.com/guides"},
            {"title": "Nielsen & Chuang: Quantum Computation and Quantum Information", "url": "https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Qubit", "Hadamard Gate", "Quantum Interference", "Measurement"],
        "common_mistakes": [
            "Confusing quantum superposition with classical parallel computing or uncertainty.",
            "Ignoring the relative phase: |+⟩ and |-⟩ have identical measurement probabilities but distinct quantum properties."
        ],
        "aliases": ["quantum superposition", "linear superposition", "superposition principle", "state superposition"],
        "keywords": ["superposition", "probability amplitudes", "linear combination", "plus state", "minus state", "relative phase"],
        "tags": ["foundations", "superposition", "amplitudes", "interference"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#superposition",
        "additional_sources": [
            {"title": "Qiskit Textbook: The Atoms of Computation", "url": "https://learn.qiskit.org/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Qubit", "Superposition", "Bloch Sphere"],
        "common_mistakes": [
            "Assuming measurement only 'reveals' a pre-existing hidden classical value (violation of Bell inequalities).",
            "Thinking you can measure without destroying the quantum superposition."
        ],
        "aliases": ["quantum measurement", "wavefunction collapse", "state collapse", "projective measurement", "born rule", "measuring a qubit", "probability of measuring a qubit"],
        "keywords": ["measurement", "born rule", "collapse", "projective measurement", "probability of measuring a qubit", "detector", "classical register"],
        "tags": ["foundations", "measurement", "born-rule", "collapse"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#measurement",
        "additional_sources": [
            {"title": "Qiskit Guide: Measuring Quantum States", "url": "https://docs.quantum.ibm.com/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Qubit", "Superposition", "Hadamard Gate", "X Gate", "Z Gate"],
        "common_mistakes": [
            "Trying to visualize multi-qubit entangled states on a single Bloch sphere (entanglement cannot be represented on independent spheres).",
            "Confusing state angles (θ) with physical physical rotation angles (a π/2 rotation rotates state by θ=π)."
        ],
        "aliases": ["bloch", "bloch sphere", "bloch representation", "bloch vector", "bloch coordinates", "bloch sphere visualization"],
        "keywords": ["bloch", "bloch sphere", "bloch vector", "polar angle", "azimuthal angle", "theta", "phi", "qubit visualization", "sphere"],
        "tags": ["visualization", "bloch-sphere", "geometry", "qubit"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#the-bloch-sphere",
        "additional_sources": [
            {"title": "Qiskit Visualization Guide: Bloch Sphere", "url": "https://docs.quantum.ibm.com/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Y Gate", "Z Gate", "Hadamard Gate", "Qubit"],
        "common_mistakes": [
            "Assuming X flips the phase (phase-flip is done by Z).",
            "Thinking X has no effect on |+⟩ (it leaves |+⟩ unchanged because |+⟩ is an eigenstate with eigenvalue +1)."
        ],
        "aliases": ["pauli-x", "pauli x gate", "not gate", "quantum not", "bit flip gate", "gate that flips a qubit", "x operator"],
        "keywords": ["x gate", "pauli-x", "not gate", "bit flip", "gate that flips a qubit", "qubit flip", "inversion"],
        "tags": ["gates", "single-qubit", "pauli", "bit-flip"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits#single-qubit-gates",
        "additional_sources": [
            {"title": "Qiskit Circuit Library: XGate", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.XGate"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["X Gate", "Z Gate", "Bloch Sphere"],
        "common_mistakes": [
            "Forgetting the factor of i when calculating transformed state vectors.",
            "Confusing the action of Y with the composite gate XZ (XZ = -iY)."
        ],
        "aliases": ["pauli-y", "pauli y gate", "y operator", "bit and phase flip gate"],
        "keywords": ["y gate", "pauli-y", "imaginary phase", "bloch rotation", "bit phase flip"],
        "tags": ["gates", "single-qubit", "pauli"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits",
        "additional_sources": [
            {"title": "Qiskit API Reference: YGate", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.YGate"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["X Gate", "Y Gate", "Hadamard Gate", "Phase Kickback"],
        "common_mistakes": [
            "Expecting Z to change measurement probabilities in the standard computational basis (it only modifies the relative phase).",
            "Failing to recognize that Z converts |+⟩ into |-⟩."
        ],
        "aliases": ["pauli-z", "pauli z gate", "phase flip gate", "phase flip", "z operator"],
        "keywords": ["z gate", "pauli-z", "phase flip", "relative phase", "sign flip", "bloch sphere"],
        "tags": ["gates", "single-qubit", "pauli", "phase-flip"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits",
        "additional_sources": [
            {"title": "Qiskit API Reference: ZGate", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.ZGate"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Superposition", "Quantum Interference", "Qubit", "Bloch Sphere", "X Gate"],
        "common_mistakes": [
            "Assuming H creates a random classical coin toss rather than a coherent reversible superposition.",
            "Thinking H applied to |1⟩ yields the same state as H applied to |0⟩ (H|1⟩ has a minus sign: |-⟩)."
        ],
        "aliases": ["h gate", "hadamard", "h operator", "hadamard transform", "gate for equal superposition"],
        "keywords": ["hadamard", "h gate", "superposition gate", "gate for equal superposition", "hadamard transform", "plus state", "basis change"],
        "tags": ["gates", "single-qubit", "superposition", "interference"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/quantum-circuits#hadamard-gate",
        "additional_sources": [
            {"title": "Qiskit API Reference: HGate", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.HGate"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Quantum Entanglement", "Bell State", "Hadamard Gate", "Phase Kickback"],
        "common_mistakes": [
            "Thinking CNOT copies the state of the control to the target (violating the No-Cloning Theorem).",
            "Assuming control can never be affected (due to phase kickback, operations on target can alter the control qubit phase)."
        ],
        "aliases": ["controlled-not", "cx gate", "cnot", "controlled x", "cx operator"],
        "keywords": ["cnot", "cx gate", "controlled not", "two qubit gate", "entangling gate", "control target"],
        "tags": ["gates", "two-qubit", "entanglement", "control"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#cnot-gate",
        "additional_sources": [
            {"title": "Qiskit API Reference: CXGate", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.CXGate"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Bell State", "CNOT Gate", "Measurement", "Superposition"],
        "common_mistakes": [
            "Believing entanglement enables faster-than-light communication (No-Communication Theorem proves classical communication is always required to decode shared correlations).",
            "Assuming entanglement means physical particles are physically touching or wired together."
        ],
        "aliases": ["entanglement", "quantum correlations", "spooky action at a distance", "quantum non-locality"],
        "keywords": ["quantum entanglement", "entanglement", "non-separable", "bell pair", "epr", "teleportation", "correlations"],
        "tags": ["phenomena", "entanglement", "multi-qubit", "correlations"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#entanglement",
        "additional_sources": [
            {"title": "Stanford Encyclopedia of Philosophy: Quantum Entanglement", "url": "https://plato.stanford.edu/entries/qt-entangle/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Quantum Entanglement", "CNOT Gate", "Hadamard Gate"],
        "common_mistakes": [
            "Thinking there is only one Bell state (there are four distinct orthogonal Bell states).",
            "Assuming Bell states can be generated without any multi-qubit entangling gates."
        ],
        "aliases": ["bell states", "epr pair", "epr pairs", "bell pair", "bell basis", "maximally entangled state"],
        "keywords": ["bell state", "bell pair", "epr pair", "phi plus", "psi minus", "maximal entanglement", "chsh"],
        "tags": ["phenomena", "bell-state", "entanglement", "two-qubit"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems#bell-states",
        "additional_sources": [
            {"title": "Qiskit Textbook: Bell States and Entanglement", "url": "https://learn.qiskit.org/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Superposition", "Hadamard Gate", "Phase Kickback", "Grover's Algorithm"],
        "common_mistakes": [
            "Believing quantum speedup comes merely from 'trying all answers in parallel' without needing constructive interference to extract the result.",
            "Confusing interference with physical electromagnetic wave collision."
        ],
        "aliases": ["interference", "quantum phase interference", "constructive interference", "destructive interference"],
        "keywords": ["quantum interference", "interference", "constructive", "destructive", "amplitudes", "phase cancellation", "born rule"],
        "tags": ["foundations", "interference", "phase", "speedup"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems#quantum-interference",
        "additional_sources": [
            {"title": "Feynman Lectures on Physics, Vol III: Quantum Behavior", "url": "https://www.feynmanlectures.caltech.edu/III_01.html"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Deutsch-Jozsa Algorithm", "CNOT Gate", "Quantum Interference", "Grover's Algorithm"],
        "common_mistakes": [
            "Thinking control qubits can never have their state altered by controlled gates.",
            "Forgetting that target must be in an eigenstate of the conditional unitary for pure phase kickback to occur."
        ],
        "aliases": ["kickback", "phase kickback effect", "eigenvalue kickback"],
        "keywords": ["phase kickback", "eigenvalue", "control qubit", "target qubit", "deutsch-jozsa", "oracle"],
        "tags": ["techniques", "phase-kickback", "circuits", "algorithms"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/phase-kickback",
        "additional_sources": [
            {"title": "Qiskit Textbook: Phase Kickback", "url": "https://learn.qiskit.org/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Quantum Interference", "Phase Kickback", "Hadamard Gate", "Deutsch-Jozsa Algorithm"],
        "common_mistakes": [
            "Claiming Grover gives an exponential speedup (it provides a polynomial/quadratic speedup O(√N), unlike Shor's exponential speedup).",
            "Running too many iterations (over-rotation: running beyond (π/4)√N decreases the success probability back down)."
        ],
        "aliases": ["grover search", "grover", "quantum search algorithm", "search algorithm", "amplitude amplification"],
        "keywords": ["grover's algorithm", "grover", "search algorithm", "quantum search", "amplitude amplification", "diffusion operator", "oracle"],
        "tags": ["algorithms", "grovers", "search", "amplitude-amplification"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/grovers-algorithm",
        "additional_sources": [
            {"title": "Lov K. Grover: A fast quantum mechanical algorithm for database search", "url": "https://arxiv.org/abs/quant-ph/9605043"},
            {"title": "Qiskit Documentation: Grover's Algorithm", "url": "https://docs.quantum.ibm.com/"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Phase Kickback", "Hadamard Gate", "Quantum Interference", "Grover's Algorithm"],
        "common_mistakes": [
            "Assuming Deutsch-Jozsa computes what the function values f(x) are (it only computes a global property: constant vs balanced).",
            "Overlooking that the quantum oracle must be implemented as a reversible unitary transformation."
        ],
        "aliases": ["deutsch jozsa", "deutsch-jozsa", "deutsch algorithm", "constant vs balanced"],
        "keywords": ["deutsch-jozsa algorithm", "deutsch-jozsa", "constant vs balanced", "oracle", "exponential speedup", "phase kickback"],
        "tags": ["algorithms", "deutsch-jozsa", "oracle", "foundations"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/deutsch-jozsa-algorithm",
        "additional_sources": [
            {"title": "David Deutsch & Richard Jozsa: Rapid Solution of Problems by Quantum Computation", "url": "https://doi.org/10.1098/rspa.1992.0167"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
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
        "related_topics": ["Hadamard Gate", "Quantum Interference", "Phase Kickback", "Grover's Algorithm"],
        "common_mistakes": [
            "Assuming QFT can be used to speed up classical Fourier transforms directly (amplitudes cannot be measured directly due to quantum measurement limits).",
            "Forgetting that qubit endianness and bit-reversal SWAP gates are required at the end of the circuit."
        ],
        "aliases": ["qft", "quantum fourier", "fourier transform", "quantum dft"],
        "keywords": ["quantum fourier transform", "qft", "fourier", "shor's algorithm", "phase estimation", "frequency domain", "phase gates"],
        "tags": ["algorithms", "qft", "transforms", "phase-estimation"],
        "source_name": "IBM Quantum Learning",
        "source_url": "https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-fourier-transform",
        "additional_sources": [
            {"title": "Qiskit Circuit Library: QFT", "url": "https://docs.quantum.ibm.com/api/qiskit/qiskit.circuit.library.QFT"}
        ],
        "verification_status": "verified",
        "created_at": NOW,
        "updated_at": NOW
    }
]

def main():
    target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "data", "quantum_topics.json"))
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(TOPICS, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated {len(TOPICS)} quantum topics at: {target_path}")

if __name__ == "__main__":
    main()
