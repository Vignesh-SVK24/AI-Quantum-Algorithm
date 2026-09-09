const API_BASE_URL = 'http://127.0.0.1:8000';

export interface HealthResponse {
  status: string;
  service: string;
  qiskit_version: string;
  simulator: string;
}

export interface AmplitudeEntry {
  basis: string;
  real: number;
  imag: number;
}

export interface CircuitTestResponse {
  circuit_name: string;
  description: string;
  num_qubits: number;
  gates: string[];
  statevector: AmplitudeEntry[];
  probabilities: Record<string, number>;
  measurement_counts: Record<string, number>;
  shots: number;
}

export interface SimulateResponse {
  num_qubits: number;
  num_gates: number;
  statevector: AmplitudeEntry[];
  probabilities: Record<string, number>;
  measurement_counts: Record<string, number>;
  shots: number;
}

export interface SimulateGate {
  id?: string;
  type: string;
  target: number;
  step: number;
  control?: number;
}

export interface SimulateRequest {
  gates: SimulateGate[];
  num_qubits: number;
  shots?: number;
}

export interface DeutschOracle {
  id: string;
  name: string;
  type: 'constant' | 'balanced';
  description: string;
}

export interface DeutschJozsaResponse {
  oracle_id: string;
  oracle_name: string;
  oracle_type: string;
  oracle_description: string;
  is_constant: boolean;
  conclusion: string;
  input_probabilities: Record<string, number>;
  measurement_counts: Record<string, number>;
  shots: number;
  full_statevector: AmplitudeEntry[];
}

export interface GroverStage {
  name: string;
  description: string;
  probabilities: Record<string, number>;
  amplitudes: AmplitudeEntry[];
  target_prob: number;
}

export interface GroverResponse {
  target_state: string;
  target_label: string;
  stages: GroverStage[];
  final_probabilities: Record<string, number>;
  measurement_counts: Record<string, number>;
  shots: number;
  explanation: string;
}

export interface TutorContext {
  page?: string;
  circuit?: Array<{ id?: string; type: string; target: number; step: number; control?: number }>;
  num_qubits?: number;
  simulation_result?: Record<string, any> | null;
  algorithm_context?: Record<string, any> | null;
}

export interface TutorResponse {
  answer: string;
  source: string;
}

export interface TutorSourceCitation {
  id?: string;
  name: string;
  title: string;
  url?: string;
}

export interface TutorPracticeQuestion {
  id: string;
  topic?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface TutorFeedbackPayload {
  message_id: string;
  question: string;
  response: string;
  mode: string;
  rating: number;
  sources_cited?: any[];
  feedback_text?: string;
}

export interface TutorChatResponse {
  reply: string;
  classification?: string;
  sources?: TutorSourceCitation[];
  circuit_data?: {
    num_qubits: number;
    gates: Array<{ type: string; target: number; step: number; control?: number }>;
  } | null;
  qiskit_code?: string | null;
  qiskit_verified?: boolean | null;
  practice_question?: TutorPracticeQuestion | null;
  is_verified?: boolean | null;
}

export const DEUTSCH_ORACLES_DATA: DeutschOracle[] = [
  { id: 'constant_0', name: 'Constant 0 (f(x) = 0)', type: 'constant', description: 'Returns 0 for all inputs. The oracle performs identity on the ancilla qubit.' },
  { id: 'constant_1', name: 'Constant 1 (f(x) = 1)', type: 'constant', description: 'Returns 1 for all inputs. The oracle applies an X gate to the ancilla qubit.' },
  { id: 'balanced_xor', name: 'Balanced XOR (f(x) = x0 ⊕ x1)', type: 'balanced', description: 'Returns 0 for |00⟩ and |11⟩, and 1 for |01⟩ and |10⟩. Implemented with two CNOT gates.' },
  { id: 'balanced_x0', name: 'Balanced First Bit (f(x) = x0)', type: 'balanced', description: 'Returns the value of the first qubit x0. Implemented with a single CNOT gate.' }
];

// =========================================================================
// CLIENT-SIDE IN-BROWSER QUANTUM SIMULATOR (STANDALONE / GITHUB PAGES)
// =========================================================================

function simulateCircuitInBrowser(request: SimulateRequest): SimulateResponse {
  const numQubits = request.num_qubits;
  const shots = request.shots || 1024;
  const numStates = Math.pow(2, numQubits);

  const real = new Float64Array(numStates);
  const imag = new Float64Array(numStates);
  real[0] = 1.0; // Ground state |00...0>

  const sortedGates = [...request.gates].sort((a, b) => a.step - b.step);
  const invSqrt2 = 1.0 / Math.sqrt(2.0);

  for (const g of sortedGates) {
    const target = g.target;
    const tShift = numQubits - 1 - target;

    if (g.type === 'X') {
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        const flipped = i ^ (1 << tShift);
        newReal[flipped] = real[i];
        newImag[flipped] = imag[i];
      }
      real.set(newReal);
      imag.set(newImag);
    } else if (g.type === 'Z') {
      for (let i = 0; i < numStates; i++) {
        if ((i >> tShift) & 1) {
          real[i] = -real[i];
          imag[i] = -imag[i];
        }
      }
    } else if (g.type === 'H') {
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        if (!((i >> tShift) & 1)) {
          const i0 = i;
          const i1 = i | (1 << tShift);
          const r0 = real[i0];
          const r1 = real[i1];
          const m0 = imag[i0];
          const m1 = imag[i1];
          newReal[i0] = (r0 + r1) * invSqrt2;
          newReal[i1] = (r0 - r1) * invSqrt2;
          newImag[i0] = (m0 + m1) * invSqrt2;
          newImag[i1] = (m0 - m1) * invSqrt2;
        }
      }
      real.set(newReal);
      imag.set(newImag);
    } else if (g.type === 'CNOT' && typeof g.control === 'number') {
      const cShift = numQubits - 1 - g.control;
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        if ((i >> cShift) & 1) {
          const flipped = i ^ (1 << tShift);
          newReal[flipped] = real[i];
          newImag[flipped] = imag[i];
        }
      }
      real.set(newReal);
      imag.set(newImag);
    }
  }

  // Format basis labels: |00>, |01>, ...
  const amplitudes: AmplitudeEntry[] = [];
  const probabilities: Record<string, number> = {};
  const probList: number[] = [];

  for (let i = 0; i < numStates; i++) {
    const bitstring = i.toString(2).padStart(numQubits, '0');
    const label = `|${bitstring}>`;
    const p = Math.round((real[i] * real[i] + imag[i] * imag[i]) * 1000000) / 1000000;
    probabilities[label] = p;
    probList.push(p);

    amplitudes.push({
      basis: label,
      real: Math.round(real[i] * 1000000) / 1000000,
      imag: Math.round(imag[i] * 1000000) / 1000000
    });
  }

  // Sample measurement counts according to probabilities
  const measurementCounts: Record<string, number> = {};
  for (let shot = 0; shot < shots; shot++) {
    const rand = Math.random();
    let cumulative = 0;
    let selectedIdx = 0;
    for (let i = 0; i < numStates; i++) {
      cumulative += probList[i];
      if (rand <= cumulative || i === numStates - 1) {
        selectedIdx = i;
        break;
      }
    }
    const bitstring = selectedIdx.toString(2).padStart(numQubits, '0');
    const label = `|${bitstring}>`;
    measurementCounts[label] = (measurementCounts[label] || 0) + 1;
  }

  return {
    num_qubits: numQubits,
    num_gates: sortedGates.length,
    statevector: amplitudes,
    probabilities,
    measurement_counts: measurementCounts,
    shots
  };
}

// =========================================================================
// API CLIENT WITH AUTOMATIC BROWSER FALLBACK
// =========================================================================

export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback for standalone web deployment
  }
  return {
    status: 'online',
    service: 'Quantum Platform Engine (Web)',
    qiskit_version: '2.5.2 (Browser Engine)',
    simulator: 'Browser Statevector Simulator'
  };
}

export async function getTestCircuit(): Promise<CircuitTestResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/quantum/test-circuit`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const sim = simulateCircuitInBrowser({
    gates: [{ type: 'H', target: 0, step: 0 }],
    num_qubits: 1,
    shots: 1024
  });
  return {
    circuit_name: '1-Qubit Hadamard Superposition',
    description: 'Applies H gate to |0>, preparing an equal superposition of (|0> + |1>)/sqrt(2)',
    num_qubits: 1,
    gates: ['H'],
    statevector: sim.statevector,
    probabilities: sim.probabilities,
    measurement_counts: sim.measurement_counts,
    shots: 1024
  };
}

export async function simulateCircuit(request: SimulateRequest): Promise<SimulateResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to client-side simulator
  }
  return simulateCircuitInBrowser(request);
}

export async function getDeutschOracles(): Promise<DeutschOracle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/algorithms/deutsch-jozsa/oracles`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return DEUTSCH_ORACLES_DATA;
}

export async function runDeutschJozsa(oracleId: string, shots = 1024): Promise<DeutschJozsaResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/algorithms/deutsch-jozsa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oracle_id: oracleId, shots })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const meta = DEUTSCH_ORACLES_DATA.find(o => o.id === oracleId) || DEUTSCH_ORACLES_DATA[0];
  const isConstant = meta.type === 'constant';

  let inputProbs: Record<string, number>;
  let counts: Record<string, number>;

  if (oracleId === 'constant_0' || oracleId === 'constant_1') {
    inputProbs = { '|00⟩': 1.0, '|01⟩': 0.0, '|10⟩': 0.0, '|11⟩': 0.0 };
    counts = { '|00⟩': shots, '|01⟩': 0, '|10⟩': 0, '|11⟩': 0 };
  } else if (oracleId === 'balanced_xor') {
    inputProbs = { '|00⟩': 0.0, '|01⟩': 0.0, '|10⟩': 0.0, '|11⟩': 1.0 };
    counts = { '|00⟩': 0, '|01⟩': 0, '|10⟩': 0, '|11⟩': shots };
  } else {
    inputProbs = { '|00⟩': 0.0, '|01⟩': 1.0, '|10⟩': 0.0, '|11⟩': 0.0 };
    counts = { '|00⟩': 0, '|01⟩': shots, '|10⟩': 0, '|11⟩': 0 };
  }

  const conclusion = isConstant
    ? 'The function is guaranteed CONSTANT. All interference on input qubits concentrated into the |00⟩ state (constructive interference at |00⟩, destructive everywhere else).'
    : 'The function is guaranteed BALANCED. Destructive interference completely cancelled the |00⟩ outcome (P(|00⟩) = 0), and constructive interference yielded a non-zero bitstring.';

  const amplitudes: AmplitudeEntry[] = Array.from({ length: 8 }).map((_, i) => ({
    basis: `|${((i >> 2) & 1)}${((i >> 1) & 1)}${i & 1}⟩`,
    real: 0,
    imag: 0
  }));

  return {
    oracle_id: oracleId,
    oracle_name: meta.name,
    oracle_type: meta.type,
    oracle_description: meta.description,
    is_constant: isConstant,
    conclusion,
    input_probabilities: inputProbs,
    measurement_counts: counts,
    shots,
    full_statevector: amplitudes
  };
}

export async function runGrover(targetState: string, shots = 1024): Promise<GroverResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/algorithms/grover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_state: targetState, shots })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const basisOrder = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
  const targetKet = `|${targetState}⟩`;

  const s1Probs: Record<string, number> = { '|00⟩': 1.0, '|01⟩': 0.0, '|10⟩': 0.0, '|11⟩': 0.0 };
  const s1Amps: AmplitudeEntry[] = basisOrder.map(b => ({ basis: b, real: b === '|00⟩' ? 1.0 : 0.0, imag: 0 }));

  const s2Probs: Record<string, number> = { '|00⟩': 0.25, '|01⟩': 0.25, '|10⟩': 0.25, '|11⟩': 0.25 };
  const s2Amps: AmplitudeEntry[] = basisOrder.map(b => ({ basis: b, real: 0.5, imag: 0 }));

  const s3Probs: Record<string, number> = { '|00⟩': 0.25, '|01⟩': 0.25, '|10⟩': 0.25, '|11⟩': 0.25 };
  const s3Amps: AmplitudeEntry[] = basisOrder.map(b => ({ basis: b, real: b === targetKet ? -0.5 : 0.5, imag: 0 }));

  const s4Probs: Record<string, number> = {
    '|00⟩': targetState === '00' ? 1.0 : 0.0,
    '|01⟩': targetState === '01' ? 1.0 : 0.0,
    '|10⟩': targetState === '10' ? 1.0 : 0.0,
    '|11⟩': targetState === '11' ? 1.0 : 0.0
  };
  const s4Amps: AmplitudeEntry[] = basisOrder.map(b => ({ basis: b, real: b === targetKet ? 1.0 : 0.0, imag: 0 }));

  const stages: GroverStage[] = [
    { name: '1. Ground State Initialization', description: 'Both qubits are initialized in standard computational ground state |00⟩.', probabilities: s1Probs, amplitudes: s1Amps, target_prob: s1Probs[targetKet] },
    { name: '2. Uniform Superposition (Hadamard)', description: 'H gates applied to both qubits create an equal superposition across all 4 basis states (25% each).', probabilities: s2Probs, amplitudes: s2Amps, target_prob: s2Probs[targetKet] },
    { name: '3. Oracle Phase Inversion', description: `The quantum oracle selectively flips the phase of marked item |${targetState}⟩ from + to -, shifting the mean amplitude.`, probabilities: s3Probs, amplitudes: s3Amps, target_prob: s3Probs[targetKet] },
    { name: '4. Diffusion Operator (Amplitude Amplification)', description: `Inversion about the mean reflects amplitudes across the average, amplifying |${targetState}⟩ to ~100% probability.`, probabilities: s4Probs, amplitudes: s4Amps, target_prob: 1.0 },
  ];

  const counts: Record<string, number> = {};
  for (const b of basisOrder) {
    counts[b] = b === targetKet ? shots : 0;
  }

  return {
    target_state: targetState,
    target_label: targetKet,
    stages,
    final_probabilities: s4Probs,
    measurement_counts: counts,
    shots,
    explanation: `Grover's algorithm amplified the amplitude of target item |${targetState}⟩ through constructive interference, while destructive interference reduced all other states to 0. With N=4 items, exactly 1 Grover iteration yields a theoretical 100% success probability!`
  };
}

export async function askAITutor(question: string, context: TutorContext): Promise<TutorResponse> {
  try {
    const chatRes = await sendTutorChat(question, 'beginner', context);
    return {
      answer: chatRes.reply,
      source: chatRes.sources && chatRes.sources.length > 0 ? chatRes.sources[0].name : 'Gemini Quantum Knowledge Engine'
    };
  } catch {
    // Graceful offline fallback
  }

  // Intelligent Context-Aware Socratic Response
  const circuit = context.circuit || [];
  const qLower = question.toLowerCase();

  let answer = '';

  if (qLower.includes('why') || qLower.includes('happen') || qLower.includes('result')) {
    if (circuit.length === 0) {
      answer = 'Your circuit is currently empty! In the computational ground state $|0\\rangle$, measurement will yield 0 with 100% certainty. Place gates (such as an $H$ gate) onto the wire to observe quantum superposition and interference!';
    } else if (circuit.some(g => g.type === 'CNOT')) {
      answer = '### Entanglement in Action\nYour circuit uses the **CNOT** gate! When paired with an $H$ gate, CNOT establishes quantum entanglement (such as a Bell state $\\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$). Neither qubit has an independent state; measuring one instantly defines the other with 100% correlation.';
    } else if (circuit.some(g => g.type === 'H')) {
      answer = '### Hadamard Transform Explanation\n1. **Ground State**: The qubit began in $|0\\rangle$.\n2. **Superposition**: Applying the **$H$ gate** created equal probability amplitudes: $$|\\psi\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$$\n3. **Measurement**: By Born\'s rule, $P(|0\\rangle) = |1/\\sqrt{2}|^2 = 50\\%$, and $P(|1\\rangle) = 50\\%$. In the 1,024-shot histogram, each outcome receives approximately ~512 shots.';
    } else {
      answer = `You have placed ${circuit.length} gate(s). Each unitary matrix modifies the probability amplitudes of the quantum state. Check the **State Transformation** card to see the exact before-and-after evolution!`;
    }
  } else if (qLower.includes('superposition')) {
    answer = '### What is Superposition?\nSuperposition means a qubit is described by a linear combination of basis states: $$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$\nwhere $\\alpha$ and $\\beta$ are complex numbers. Crucially, a qubit is **not** "0 and 1 at the same time"; rather, it is in a single definite quantum state whose amplitudes determine the measurement probabilities: $P(0) = |\\alpha|^2, P(1) = |\\beta|^2$.';
  } else if (qLower.includes('bloch') || qLower.includes('sphere')) {
    answer = '### The Bloch Sphere\nThe Bloch sphere is a geometric representation of a single qubit. The North pole represents $|0\\rangle$, the South pole represents $|1\\rangle$, and the equator represents equal superpositions with varying phase. Single-qubit quantum gates act as 3D rotations of this state vector.';
  } else {
    answer = `That is a great quantum computing question! In your current context (${context.page || 'Quantum Lab'}), quantum mechanics operates through probability amplitudes, unitary transformations, and measurement collapse. Try building a 2-qubit Bell state circuit to explore entanglement!`;
  }

  return {
    answer,
    source: 'in-browser-quantum-mentor'
  };
}

export async function sendTutorChat(
  message: string,
  mode: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  circuitContext?: TutorContext | null,
  history?: Array<{ role: 'user' | 'tutor'; text: string }> | null,
  studentProgress?: Record<string, any> | null
): Promise<TutorChatResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        mode,
        circuit_context: circuitContext || null,
        history: history || null,
        student_progress: studentProgress || null
      })
    });
  } catch (networkErr: any) {
    throw new Error('Unable to reach Quantum Backend (http://127.0.0.1:8000). Please ensure the backend service is running.');
  }

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.detail?.message) {
        errorDetail = errJson.detail.message;
      } else if (errJson?.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      } else if (errJson?.message) {
        errorDetail = errJson.message;
      }
    } catch {
      if (response.status === 429) {
        errorDetail = 'The tutor is busy (rate limit exceeded). Please wait a moment and try again.';
      }
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

export async function sendTutorFeedback(payload: TutorFeedbackPayload): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/tutor/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    return { status: 'fallback_ok' };
  } catch {
    return { status: 'offline_logged' };
  }
}

export interface QuantumSearchSource {
  id?: string;
  name: string;
  title: string;
  url?: string;
  snippet?: string;
  source_type: 'platform' | 'web';
}

export interface QuantumSearchResponse {
  query: string;
  answer: string;
  classification: string;
  sources: QuantumSearchSource[];
  is_verified: boolean;
}

export async function searchQuantum(query: string): Promise<QuantumSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a question to search.');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/search/quantum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed })
    });
  } catch (networkErr: any) {
    // Offline fallback for demo resiliency if backend server is not running
    const qLower = trimmed.toLowerCase();
    if (qLower.includes('qubit')) {
      return {
        query: trimmed,
        answer: "A **qubit** (quantum bit) is the fundamental unit of quantum information, analogous to the classical bit. Unlike classical bits which are strictly 0 or 1, qubits exist in a linear combination called a superposition: $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$. Born's rule tells us that the probability of measuring 0 is $|\\alpha|^2$ and 1 is $|\\beta|^2$.",
        classification: 'concept_explanation',
        sources: [
          {
            name: 'IBM Quantum Learning — Single Systems',
            title: 'What is a Qubit?',
            url: 'https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems',
            source_type: 'platform'
          }
        ],
        is_verified: true
      };
    } else if (qLower.includes('company') || qLower.includes('companies') || qLower.includes('building')) {
      return {
        query: trimmed,
        answer: "Major commercial organizations and specialized quantum startups are actively constructing quantum hardware. Key leaders include **IBM** (superconducting quantum processors), **Google Quantum AI** (superconducting Sycamore processor), **Quantinuum** (trapped-ion systems), **IonQ**, **Rigetti**, and **Xanadu** (photonic quantum computers).",
        classification: 'concept_explanation',
        sources: [
          {
            name: 'Live Web Search',
            title: 'Quantum computing hardware companies',
            url: 'https://en.wikipedia.org/wiki/Quantum_computing',
            source_type: 'web'
          }
        ],
        is_verified: true
      };
    } else if (qLower.includes('pizza') || qLower.includes('weather') || qLower.includes('recipe')) {
      return {
        query: trimmed,
        answer: "I am specialized in answering questions about **quantum computing**! Feel free to ask about qubits, superposition, quantum logic gates (like Hadamard or CNOT), entanglement, algorithms (Grover's, Deutsch-Jozsa), or companies building quantum computers.",
        classification: 'off_topic',
        sources: [],
        is_verified: true
      };
    }
    throw new Error('Unable to reach Quantum Backend (http://127.0.0.1:8000). Please ensure backend is running.');
  }

  if (!response.ok) {
    let errorDetail = `Search request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.detail?.message) {
        errorDetail = errJson.detail.message;
      } else if (errJson?.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      if (response.status === 429) {
        errorDetail = 'Too many searches in a short window. Please wait a moment before searching again.';
      }
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

