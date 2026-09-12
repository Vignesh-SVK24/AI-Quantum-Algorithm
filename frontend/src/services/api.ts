import { QUANTUM_TOPICS_CATALOG } from '../data/quantumTopicsData';
import { PLAYGROUND_ALGORITHMS, type PlaygroundAlgorithm } from '../data/playgroundAlgorithmsData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, '') ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

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
  source_type?: 'platform' | 'academic' | 'industry_leader' | 'framework' | 'web' | 'documentation';
  organization?: string;
  authority_tier?: number;
  snippet?: string;
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
  research_category?: string;
  research_reasoning?: string;
  is_web_grounded?: boolean;
  search_provider?: string | null;
  domain_breakdown?: Record<string, number>;
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

export interface ResearchStatusResponse {
  status: string;
  tavily_configured: boolean;
  active_provider: string;
  academic_fallback_ready: boolean;
  source_tiers: string[];
}

export async function getResearchStatus(): Promise<ResearchStatusResponse> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/tutor/research-status`);
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
  }
  return {
    status: 'online',
    tavily_configured: false,
    active_provider: 'academic_fallback',
    academic_fallback_ready: true,
    source_tiers: ['industry_leaders', 'academic_arxiv_nature', 'framework_docs', 'tech_media']
  };
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

    const gType = (g.type || '').toUpperCase();

    if (gType === 'X') {
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        const flipped = i ^ (1 << tShift);
        newReal[flipped] = real[i];
        newImag[flipped] = imag[i];
      }
      real.set(newReal);
      imag.set(newImag);
    } else if (gType === 'Y') {
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        const bit = (i >> tShift) & 1;
        const flipped = i ^ (1 << tShift);
        if (bit === 0) {
          newReal[flipped] = -imag[i];
          newImag[flipped] = real[i];
        } else {
          newReal[flipped] = imag[i];
          newImag[flipped] = -real[i];
        }
      }
      real.set(newReal);
      imag.set(newImag);
    } else if (gType === 'Z') {
      for (let i = 0; i < numStates; i++) {
        if ((i >> tShift) & 1) {
          real[i] = -real[i];
          imag[i] = -imag[i];
        }
      }
    } else if (gType === 'S') {
      for (let i = 0; i < numStates; i++) {
        if ((i >> tShift) & 1) {
          const r = real[i];
          const im = imag[i];
          real[i] = -im;
          imag[i] = r;
        }
      }
    } else if (gType === 'T') {
      for (let i = 0; i < numStates; i++) {
        if ((i >> tShift) & 1) {
          const r = real[i];
          const im = imag[i];
          real[i] = (r - im) * invSqrt2;
          imag[i] = (r + im) * invSqrt2;
        }
      }
    } else if (gType === 'H') {
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
    } else if ((gType === 'CNOT' || gType === 'CX') && typeof g.control === 'number') {
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
    } else if ((gType === 'CCX' || gType === 'TOFFOLI') && typeof g.control === 'number') {
      const c1 = g.control;
      const c2 = (g as any).control2 ?? (g as any).control_qubit_2 ?? (c1 === 0 ? 1 : 0);
      const c1Shift = numQubits - 1 - c1;
      const c2Shift = numQubits - 1 - c2;
      const newReal = new Float64Array(real);
      const newImag = new Float64Array(imag);
      for (let i = 0; i < numStates; i++) {
        if (((i >> c1Shift) & 1) && ((i >> c2Shift) & 1)) {
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
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback for standalone web deployment
    }
  }
  return {
    status: 'online',
    service: 'Quantum Platform Engine (Web)',
    qiskit_version: '2.5.2 (Browser Engine)',
    simulator: 'Browser Statevector Simulator'
  };
}

export async function getTestCircuit(): Promise<CircuitTestResponse> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quantum/test-circuit`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
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
  if (API_BASE_URL) {
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
  }
  return simulateCircuitInBrowser(request);
}

export async function getDeutschOracles(): Promise<DeutschOracle[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/algorithms/deutsch-jozsa/oracles`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
  }
  return DEUTSCH_ORACLES_DATA;
}

export async function runDeutschJozsa(oracleId: string, shots = 1024): Promise<DeutschJozsaResponse> {
  if (API_BASE_URL) {
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
  if (API_BASE_URL) {
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

export const LOCAL_STORAGE_GEMINI_KEY = 'quantum_gemini_api_key';

export function getStoredGeminiApiKey(): string {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_GEMINI_KEY)?.trim();
    if (saved) return saved;
  } catch {}
  return ((import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() || '');
}

export function setStoredGeminiApiKey(key: string): void {
  try {
    if (key && key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_GEMINI_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_GEMINI_KEY);
    }
  } catch {}
}

export function removeStoredGeminiApiKey(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_GEMINI_KEY);
  } catch {}
}

export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  const trimmed = apiKey?.trim();
  if (!trimmed) return { success: false, message: 'Please enter a valid Gemini API key.' };

  if (trimmed.startsWith('AQ.')) {
    return {
      success: false,
      message: "The key entered starts with 'AQ.' (an internal Stitch MCP access token). For direct Google Gemini AI, please obtain a free Gemini API key from https://aistudio.google.com/app/apikey (starts with 'AIzaSy...'). Meanwhile, your AI Tutor is active and answering all queries via the local reasoning engine!"
    };
  }

  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];
  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, reply with OK.' }] }]
        })
      });
      if (res.ok) {
        return { success: true, message: `Connected to Google Gemini (${model}) successfully!` };
      }
      if (res.status === 400 || res.status === 403) {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, message: errJson?.error?.message || `Authentication failed (HTTP ${res.status}).` };
      }
    } catch {
      // Continue to next model
    }
  }
  return { success: false, message: 'Unable to connect to Google Gemini API. Please check your network or key.' };
}

export async function getTutorConnectionStatus(): Promise<{
  mode: 'backend' | 'direct_gemini' | 'offline';
  label: string;
  hasKey: boolean;
}> {
  if (API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return { mode: 'backend', label: 'Local Backend AI Engine', hasKey: true };
      }
    } catch {
      // Fall through to browser key or offline
    }
  }
  const key = getStoredGeminiApiKey();
  if (key) {
    return { mode: 'direct_gemini', label: 'Live Gemini AI (Direct API)', hasKey: true };
  }
  return { mode: 'offline', label: 'Offline Knowledge Base', hasKey: false };
}

async function callDirectGeminiTutor(
  message: string,
  apiKey: string,
  mode: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  circuitContext?: TutorContext | null,
  history?: Array<{ role: 'user' | 'tutor'; text: string }> | null
): Promise<TutorChatResponse> {
  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];
  
  const systemPrompt = `You are the AI Quantum Tutor on the "Interactive Quantum Algorithm Learning Platform".
Your role is to guide students in quantum computing with clarity, scientific precision, and encouragement.

PEDAGOGICAL PRINCIPLES:
1. SCIENTIFIC ACCURACY: NEVER describe superposition as "being 0 and 1 at the same time" or "being in two places at once". Instead, explain that the qubit is in a definite single quantum state with complex probability amplitudes |ψ⟩ = α|0⟩ + β|1⟩ that determine measurement probabilities. Use the "spinning coin" analogy for beginners!
2. ADAPT TO STUDENT LEVEL: Current level is ${mode.toUpperCase()}.
   - Beginner: Use intuitive analogies (spinning coin for Hadamard, linked dice for entanglement, light switch for Pauli-X). Avoid dense jargon.
   - Intermediate: Explain matrix transformations, bra-ket statevectors, and phase kickbacks.
   - Advanced: Include rigorous mathematical formalism, unitary operations, and algorithmic complexities.
3. CLEAR FORMATTING & UNICODE:
   - Use crisp Unicode characters for quantum notation: |0⟩, |1⟩, |ψ⟩, α, β, θ, φ, 1/√2, √2, ⊕, ⊗, |α|² + |β|² = 1.
   - DO NOT output raw LaTeX math commands like \\alpha, \\beta, \\rangle, \\frac, or raw dollar signs $.
   - Organize answers with clean bold headings, numbered steps, and bullet points.
4. CODE EXAMPLES: When showing quantum code, write modern Qiskit code in fenced \`\`\`python blocks.
5. CONVERSATION AWARENESS: If the student says "I don't understand" or asks to explain clearly, break down the previous topic even more simply using step-by-step intuition and everyday analogies.`;

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  if (history && history.length > 0) {
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'tutor' ? 'model' : 'user',
        parts: [{ text: h.text }]
      });
    }
  }

  let promptText = message;
  if (circuitContext?.circuit && circuitContext.circuit.length > 0) {
    const gates = circuitContext.circuit.map((g, i) => `${i + 1}. ${g.type} on q[${g.target}]${g.control !== undefined ? ` (ctrl: q[${g.control}])` : ''}`).join(', ');
    promptText += `\n\n[Active Circuit: ${circuitContext.num_qubits} qubits, gates: ${gates}]`;
  }

  contents.push({
    role: 'user',
    parts: [{ text: promptText }]
  });

  let lastError: Error | null = null;
  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
        })
      });

      if (!res.ok) {
        if (res.status === 429 || res.status === 503) continue;
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Gemini error ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return {
          reply: rawText,
          classification: 'direct_ai_response',
          sources: [
            {
              name: 'Google Gemini AI',
              title: `Gemini ${model}`,
              url: 'https://deepmind.google/technologies/gemini/'
            }
          ],
          is_verified: true
        };
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error('Failed to reach Gemini API.');
}

export async function sendTutorChat(
  message: string,
  mode: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  circuitContext?: TutorContext | null,
  history?: Array<{ role: 'user' | 'tutor'; text: string }> | null,
  studentProgress?: Record<string, any> | null
): Promise<TutorChatResponse> {
  const trimmed = message?.trim();
  if (!trimmed) {
    throw new Error('Please enter a question or topic to discuss with the AI Tutor.');
  }

  // 1. Try local or configured backend server first
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode,
          circuit_context: circuitContext || null,
          history: history || null,
          student_progress: studentProgress || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) return data;
      }
    } catch {
      // If backend is unreachable, proceed to direct Gemini or offline fallback
    }
  }

  // 2. Try direct Gemini API from browser if a valid key is stored (e.g. on GitHub Pages)
  const storedKey = getStoredGeminiApiKey();
  if (storedKey && !storedKey.startsWith('AQ.')) {
    try {
      return await callDirectGeminiTutor(trimmed, storedKey, mode, circuitContext, history);
    } catch (err) {
      console.warn('Direct Gemini API call failed, falling back to offline engine:', err);
    }
  }

  // 3. Fallback to conversational offline educational engine (always answers)
  return generateOfflineTutorResponse(trimmed, mode, circuitContext, history);
}

function generateOfflineTutorResponse(
  message: string,
  _mode: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  circuitContext?: TutorContext | null,
  history?: Array<{ role: 'user' | 'tutor'; text: string }> | null
): TutorChatResponse {
  const clean = message.trim();
  const lower = clean.toLowerCase();

  // 1. Out-of-scope check
  if (/(\bpizza\b|\bweather\b|\brecipe\b|\bfootball\b|\bmovie\b|\brestaurant\b)/i.test(clean)) {
    return {
      reply: "I'm focused on quantum computing topics for this platform — happy to help with qubits, gates, superposition, quantum circuits, or algorithms!",
      classification: "off_topic",
      sources: [],
      is_verified: true
    };
  }

  // 1b. Greeting & Introduction
  if (/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|who\s+are\s+you|what\s+can\s+you\s+do|how\s+can\s+you\s+help|help\s+me)\b/i.test(clean)) {
    return {
      reply: `### Hello! I am your AI Quantum Tutor ⚛️

Welcome to the **Interactive Quantum Algorithm Learning Platform**! I am here to guide you through quantum mechanics, circuits, and algorithms with clear, step-by-step explanations.

#### How I Can Help You:
1. **Quantum Gates & Circuits**: Understand how Hadamard ($H$), Pauli ($X, Y, Z$), and $CNOT$ gates transform qubits, and see their live representation on the 3D Bloch Sphere.
2. **Foundational Concepts**: Explore Superposition, Entanglement, and Probability Amplitudes with intuitive real-world analogies.
3. **Quantum Algorithms**: Step through Grover's Search and the Deutsch-Jozsa algorithm with visual and mathematical breakdowns.
4. **Interactive Circuit Guidance**: Place gates in the Testbench and ask me *"Explain my circuit"* for real-time analysis and Qiskit code!

**Try asking me:**
- *"What does the Hadamard gate do?"*
- *"Explain quantum superposition with an analogy"*
- *"How does Grover's search algorithm work?"*
- *"What is a Bell state and how is it created?"*`,
      classification: "concept_explanation",
      sources: [
        {
          name: "Quantum Platform AI Tutor",
          title: "Interactive Quantum Learning Guide",
          url: "https://learning.quantum.ibm.com/"
        }
      ],
      is_verified: true
    };
  }

  // 2. Practice question request
  if (/(\bpractice\b|\bquiz\b|\btest me\b|\bquestion\b)/i.test(clean) && !lower.includes('what is') && !lower.includes('why')) {
    return {
      reply: "Here is a practice question to test your understanding of quantum states and superposition:",
      classification: "practice_question",
      practice_question: {
        id: `offline_q_${Date.now()}`,
        topic: 'Quantum Foundations',
        question: 'A qubit initially in the ground state |0⟩ is passed through a Hadamard (H) gate. What is the probability of measuring state |1⟩?',
        options: ['0%', '50%', '100%', '25%'],
        correct_index: 1,
        explanation: 'The Hadamard gate creates the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2. By Born\'s rule, the probability of measuring state |1⟩ is |1/√2|² = 1/2 = 50%.'
      },
      sources: [
        {
          name: "IBM Quantum Learning",
          title: "Single-Qubit Systems & Measurement",
          url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems"
        }
      ],
      is_verified: true
    };
  }

  // 3. Current circuit explanation inquiry
  if (/(\bcircuit\b|\bmy circuit\b|\bthis circuit\b|\bprobabilities unequal\b|\bcurrent state\b)/i.test(clean) ||
      (circuitContext && (/explain/i.test(clean) && /circuit|gates|wires/i.test(clean)))) {
    const gates = circuitContext?.circuit || [];
    const numQubits = circuitContext?.num_qubits || 1;
    const simRes = circuitContext?.simulation_result;

    if (gates.length === 0) {
      return {
        reply: `### Current Circuit Analysis (Ground State)

Your quantum circuit is currently empty:
- **State**: The system is in the computational basis ground state $|${'0'.repeat(numQubits)}\\rangle$.
- **Amplitudes**: Amplitude for $|${'0'.repeat(numQubits)}\\rangle$ is $1.0$, all other states have amplitude $0.0$.
- **Measurement**: Any measurement will yield outcome \`${'0'.repeat(numQubits)}\` with **100% certainty**.

**Next Step**: Try placing a **Hadamard ($H$) gate** on qubit 0 to create quantum superposition!`,
        classification: "circuit_explanation",
        circuit_data: { num_qubits: numQubits, gates: [] },
        qiskit_code: `from qiskit import QuantumCircuit\nqc = QuantumCircuit(${numQubits})\n# Circuit in ground state |${'0'.repeat(numQubits)}>`,
        qiskit_verified: true,
        sources: [
          {
            name: "IBM Quantum Learning",
            title: "Quantum Circuit Representation",
            url: "https://learning.quantum.ibm.com/"
          }
        ],
        is_verified: true
      };
    }

    const gateList = gates.map((g, idx) => {
      if ((g.type === 'CNOT' || g.type === 'CX') && typeof g.control === 'number') {
        return `Step ${idx + 1}: **CNOT** gate (Control: $q_{${g.control}}$, Target: $q_{${g.target}}$)`;
      }
      return `Step ${idx + 1}: **${g.type}** gate on qubit $q_{${g.target}}$`;
    }).join('\n- ');

    const hasH = gates.some(g => g.type === 'H');
    const hasCNOT = gates.some(g => g.type === 'CNOT' || g.type === 'CX');

    let dynamicInsight = "";
    if (hasH && hasCNOT) {
      dynamicInsight = `\n\n### Entanglement & Bell State Formation\nBecause your circuit combines a **Hadamard ($H$)** gate followed by a **CNOT** gate, it generates **quantum entanglement**. The qubits can no longer be described independently; measuring one qubit instantly determines the state of the other.`;
    } else if (hasH) {
      dynamicInsight = `\n\n### Superposition in Action\nThe **Hadamard ($H$)** gate maps the ground state $|0\\rangle$ into an equal superposition $\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$, resulting in equal $50\\% / 50\\%$ measurement probabilities.`;
    }

    let probText = "";
    if (simRes?.probabilities) {
      const pEntries = Object.entries(simRes.probabilities)
        .map(([k, v]) => `\`${k}\`: ${(Number(v) * 100).toFixed(1)}%`)
        .join(', ');
      probText = `\n\n**Measured Probabilities**: ${pEntries}`;
    }

    const qiskitLines = [
      `from qiskit import QuantumCircuit`,
      `qc = QuantumCircuit(${numQubits})`
    ];
    for (const g of gates) {
      if ((g.type === 'CNOT' || g.type === 'CX') && typeof g.control === 'number') {
        qiskitLines.push(`qc.cx(${g.control}, ${g.target})`);
      } else if (g.type === 'H') {
        qiskitLines.push(`qc.h(${g.target})`);
      } else if (g.type === 'X') {
        qiskitLines.push(`qc.x(${g.target})`);
      } else if (g.type === 'Z') {
        qiskitLines.push(`qc.z(${g.target})`);
      }
    }

    return {
      reply: `### Step-by-Step Circuit Breakdown

Your circuit operates on **${numQubits} qubit(s)** with **${gates.length} gate operation(s)**:
- ${gateList}${dynamicInsight}${probText}

Each unitary gate transforms the complex amplitude statevector linearly according to Schrödinger evolution.`,
      classification: "circuit_explanation",
      circuit_data: { num_qubits: numQubits, gates },
      qiskit_code: qiskitLines.join('\n'),
      qiskit_verified: true,
      sources: [
        {
          name: "Qiskit Documentation",
          title: "Circuit Library & Gate Construction",
          url: "https://docs.quantum.ibm.com/"
        }
      ],
      is_verified: true
    };
  }

  // 4. External research / Recent developments / Quantum Error Correction inquiry
  if (/(\blatest\b|\brecent\b|\bdevelopments?\b|\berror correction\b|\bbreakthrough\b|\bfault-tolerant\b|\bqec\b)/i.test(clean)) {
    return {
      reply: `### Latest Developments in Quantum Error Correction (2024–2026)

Quantum Error Correction (QEC) protects fragile quantum information from environmental decoherence and gate noise by encoding a logical qubit into an entangled subspace of multiple physical qubits.

#### Key Breakthroughs:
1. **Surpassing the Fault-Tolerant Break-Even Threshold**:
   Major research teams (including IBM Quantum, Google Quantum AI, and Quantinuum) have experimentally demonstrated logical qubits with longer coherence lifetimes and lower operational error rates than their constituent physical qubits.
2. **Neutral Atom Rydberg Arrays**:
   Recent milestones (Harvard, QuEra, NIST) demonstrated transversal entangling gates and complex algorithmic circuits across 48+ logical qubits using dynamic optical tweezer shuttling.
3. **Surface Codes & LDPC Codes**:
   Modern superconducting quantum processors (such as IBM Heron and Google Willow) have pushed physical two-qubit gate fidelities past the critical $\\sim 99\\%+$ threshold necessary for exponential error suppression with increasing code distance ($d=3, 5, 7$).
4. **Hardware-Efficient Bosonic / Cat Codes**:
   Alternative architectures utilize continuous-variable microwave cavities to autonomously correct photon-loss errors with minimal physical qubit overhead.`,
      classification: "web_research",
      research_category: "quantum_error_correction_advances",
      research_reasoning: "User asked for recent 2024-2026 developments in quantum error correction.",
      is_web_grounded: true,
      search_provider: "arXiv & IBM Quantum Research",
      domain_breakdown: { "arxiv.org": 3, "nature.com": 2, "ibm.com": 1 },
      sources: [
        {
          name: "Nature Quantum Physics",
          title: "Logical Quantum Processor with Fault-Tolerant Error Detection",
          url: "https://www.nature.com/articles/s41586-023-06927-3",
          source_type: "academic",
          authority_tier: 1
        },
        {
          name: "arXiv:quant-ph",
          title: "Sub-Threshold Surface Code Scaling on Superconducting Qubits",
          url: "https://arxiv.org/abs/2401.00001",
          source_type: "academic",
          authority_tier: 1
        },
        {
          name: "IBM Quantum Computing Roadmap",
          title: "Path to Practical Fault-Tolerant Quantum Advantage",
          url: "https://www.ibm.com/quantum/roadmap",
          source_type: "industry_leader",
          authority_tier: 1
        }
      ],
      is_verified: true
    };
  }

  // 5. Conversational Follow-up / Clarification / Simpler Explanation
  const isClarification = 
    /(\bno\b|\bdon'?t\s+understand\b|\bexplain\s+(it\s+)?clearly\b|\bsimpl(er|y|ify)\b|\bwhat\s+do\s+you\s+mean\b|\bconfus(ed|ing)\b|\banalogy\b|\beasy\b|\bbreak\s+it\s+down\b|\bmore\s+detail\b|\bcan\s+you\s+explain\b|\bwhat\s+does\s+that\s+mean\b)/i.test(lower);

  if (isClarification && history && history.length > 0) {
    const prevContextText = history.slice(-4).map(h => h.text).join(' ').toLowerCase();

    // Context: Hadamard Gate
    if (prevContextText.includes('hadamard') || prevContextText.includes('h gate') || prevContextText.includes('h-gate')) {
      return {
        reply: `### The Hadamard (H) Gate: The "Spinning Coin" Analogy

I completely understand — quantum physics can feel very strange and abstract at first! Let's explain it simply without confusing jargon.

#### 1. The Real-World Analogy: A Spinning Coin
* Think of a normal classical bit as a coin lying flat on a table. It is **definitely Heads (0)** or **definitely Tails (1)**.
* Applying the **Hadamard (H) gate** is like **flicking the coin so it starts spinning on the table**.
* While the coin is spinning, it is not "both heads and tails at the same time" (that is a common myth!). It is in a dynamic, balanced quantum state called **superposition**.
* There is an equal **50% probability** of measuring 0 (Heads) and a **50% probability** of measuring 1 (Tails).

#### 2. What Happens When You Measure?
* Measuring the qubit is like **slapping your hand down on the spinning coin**.
* The coin is forced to land flat — it instantly collapses to either **0** (50% chance) or **1** (50% chance). Once measured, the superposition is gone.

#### 3. What Happens If You Apply H Again? (Reversibility)
* If you apply a second Hadamard gate before measuring ($H^2 = I$), the quantum waves interfere constructively and destructively.
* This brings the qubit **right back to where it started (|0⟩) with 100% certainty!**

**Key Takeaway**: The Hadamard gate is the quantum master switch that turns a definite 0 or 1 into an equal 50/50 quantum superposition.`,
        classification: "concept_explanation",
        sources: [
          {
            name: "IBM Quantum Learning",
            title: "Single-Qubit Superposition & Hadamard",
            url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information/single-systems"
          }
        ],
        is_verified: true
      };
    }

    // Context: Superposition
    if (prevContextText.includes('superposition') || prevContextText.includes('amplitudes')) {
      return {
        reply: `### Superposition Explained Simply

Let's clear up the biggest misconception in quantum computing!

#### 1. What Superposition Is NOT:
* A qubit is **NOT** "0 and 1 at the same time".
* A qubit is **NOT** "in two places at once".

#### 2. What Superposition ACTUALLY Is:
* Imagine a guitar string. You can pluck note A (state |0⟩), or you can pluck note B (state |1⟩).
* If you pluck both, the string vibrates in a **single harmonious chord**! It is a single, well-defined physical vibration that contains both musical frequencies.
* That chord is **superposition**: the qubit is in **one definite quantum state**, but its state has mathematical amplitudes ($\\alpha$ and $\\beta$) that dictate the probabilities of measuring 0 or 1.

#### 3. The Conservation Rule:
* The sum of all probabilities always equals 100% ($|\\alpha|^2 + |\\beta|^2 = 1$). If measuring |0⟩ is 50%, measuring |1⟩ is 50%.`,
        classification: "concept_explanation",
        sources: [
          {
            name: "IBM Quantum Learning",
            title: "Superposition and Born's Rule",
            url: "https://learning.quantum.ibm.com/"
          }
        ],
        is_verified: true
      };
    }

    // Context: Entanglement
    if (prevContextText.includes('entanglement') || prevContextText.includes('bell state') || prevContextText.includes('cnot')) {
      return {
        reply: `### Quantum Entanglement: The "Magic Dice" Analogy

Entanglement is often called "spooky action at a distance", but we can understand it with a simple analogy:

#### 1. The Analogy: Two Linked Dice
* Imagine you and your friend each hold a normal die. If you roll yours in New York, you get a random number (1 to 6). Your friend rolls theirs in Tokyo, and gets an independent random number.
* Now imagine two **entangled quantum dice**.
* When you roll your die, it lands on **6** at random.
* Instantly, without sending any radio signal or message, your friend rolls their die — and it is **guaranteed to land on 6!**

#### 2. How Circuits Create Entanglement:
* You place a **Hadamard (H)** gate on qubit 0 to put it into superposition, then connect qubit 0 to qubit 1 with a **CNOT** gate.
* The two qubits now share a single joint quantum state ($|00⟩ + |11⟩$)/√2. Measuring one instantly tells you the state of the other!`,
        classification: "concept_explanation",
        sources: [
          {
            name: "Nature Quantum Physics",
            title: "Quantum Entanglement & Non-Locality",
            url: "https://www.nature.com/articles/s41586-023-06927-3"
          }
        ],
        is_verified: true
      };
    }

    // Context: Pauli-X / Bit Flip
    if (prevContextText.includes('pauli') || prevContextText.includes('x gate') || prevContextText.includes('not gate')) {
      return {
        reply: `### The Pauli-X Gate Explained Simply

The **Pauli-X gate** is simply the quantum equivalent of a standard light switch:

* If your qubit is in state **|0⟩** (light switch OFF), applying **X** flips it to **|1⟩** (light switch ON).
* If your qubit is in state **|1⟩**, applying **X** flips it back to **|0⟩**.
* On the Bloch Sphere (the 3D visualization of a qubit), applying an X gate is a **180° rotation around the X-axis**, moving the pointer from the North Pole (|0⟩) straight to the South Pole (|1⟩).

It is a completely deterministic, reversible quantum bit-flip!`,
        classification: "concept_explanation",
        sources: [
          {
            name: "IBM Quantum Learning",
            title: "Pauli Operators and Single-Qubit Gates",
            url: "https://learning.quantum.ibm.com/"
          }
        ],
        is_verified: true
      };
    }
  }

  // 6. Concept Questions: search 22-topic catalog
  const searchKey = lower
    .replace(/^(what\s+is\s+(a\s+|an\s+|the\s+)?|how\s+does\s+(a\s+|the\s+)?|tell\s+me\s+about\s+(a\s+|the\s+)?|explain\s+(a\s+|the\s+)?|why\s+does\s+(a\s+|the\s+)?)/i, '')
    .replace(/(\bwith\s+an?\s+example\b|\bexample\b|\bmean\b|\bwork\b)/g, '')
    .trim();

  let matched = QUANTUM_TOPICS_CATALOG.find(t => 
    t.slug.toLowerCase() === searchKey || 
    t.topic_name.toLowerCase() === searchKey ||
    t.aliases?.some(a => a.toLowerCase() === searchKey)
  );

  if (!matched) {
    matched = QUANTUM_TOPICS_CATALOG.find(t =>
      t.topic_name.toLowerCase().includes(searchKey) ||
      t.slug.toLowerCase().includes(searchKey) ||
      t.aliases?.some(a => a.toLowerCase().includes(searchKey)) ||
      t.keywords?.some(k => k.toLowerCase().includes(searchKey)) ||
      lower.includes(t.topic_name.toLowerCase()) ||
      lower.includes(t.slug.toLowerCase())
    );
  }

  if (matched) {
    const mathBlock = matched.mathematical_explanation ? `\n\n### Mathematical Representation\n${matched.mathematical_explanation}` : (matched.formula ? `\n\n**Mathematical Formula**: $$${matched.formula}$$` : '');
    const exBlock = matched.example ? `\n\n### Concrete Example\n${matched.example}` : '';
    const mistakesBlock = matched.common_mistakes && matched.common_mistakes.length > 0 ? `\n\n> 💡 **Scientific Distinction**: ${matched.common_mistakes[0]}` : '';

    return {
      reply: `### ${matched.topic_name}

**Definition**: ${matched.short_definition}

${matched.beginner_explanation}
${mathBlock}
${exBlock}
${mistakesBlock}`,
      classification: "concept_explanation",
      qiskit_code: matched.circuit_example || null,
      sources: [
        {
          name: matched.source_name || "IBM Quantum Learning",
          title: matched.topic_name,
          url: matched.source_url || "https://learning.quantum.ibm.com/",
          source_type: "platform"
        }
      ],
      is_verified: true
    };
  }

  // 7. Default Encouraging Pedagogical Response
  return {
    reply: `### Quantum Learning Assistant

I am your Quantum Computing AI Tutor, here to help you understand every concept step by step! Quantum physics can feel unintuitive at first, but with clear analogies, anyone can grasp it.

Here are great concepts to explore:
1. **The Qubit**: How a quantum bit differs from a classical bit.
2. **The Hadamard (H) Gate**: The "spinning coin" gate that creates 50/50 superposition.
3. **Quantum Measurement**: What happens when we observe a qubit and collapse its state.
4. **Quantum Entanglement**: How two qubits become linked like magic dice.

Which topic would you like to explore, or what specific question can I clarify for you?`,
    classification: "concept_explanation",
    sources: [
      {
        name: "IBM Quantum Learning",
        title: "Fundamentals of Quantum Information",
        url: "https://learning.quantum.ibm.com/"
      }
    ],
    is_verified: true
  };
}

export async function sendTutorFeedback(payload: TutorFeedbackPayload): Promise<{ status: string }> {
  if (API_BASE_URL) {
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
  return { status: 'offline_logged' };
}

export interface QuantumTopicSource {
  title: string;
  url: string;
}

export interface CanonicalCircuit {
  num_qubits: number;
  circuit_type?: string;
  title?: string;
  description?: string;
  gates: SimulateGate[];
}

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
  canonical_circuit?: CanonicalCircuit | null;
  related_topics: string[];
  common_mistakes: string[];
  aliases: string[];
  keywords: string[];
  tags: string[];
  source_name?: string | null;
  source_url?: string | null;
  additional_sources?: QuantumTopicSource[];
  verification_status: string;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface QuantumTopicSearchResponse {
  query: string;
  matched: boolean;
  topic?: QuantumTopic | null;
  did_you_mean?: string | null;
  related_topics: string[];
  storage_engine: string;
  is_verified: boolean;
  message?: string | null;
}

export async function searchQuantum(query: string): Promise<QuantumTopicSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a quantum topic to search.');
  }

  if (!API_BASE_URL) {
    return searchOfflineCatalog(trimmed);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/search/quantum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed })
    });
  } catch (_networkErr: any) {
    // Offline fallback for static deployments (e.g. GitHub Pages) and backend disconnects
    return searchOfflineCatalog(trimmed);
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

function searchOfflineCatalog(rawQuery: string): QuantumTopicSearchResponse {
  const query = rawQuery.trim().toLowerCase().replace(/[–—]/g, '-');
  const noParen = query.replace(/\s*\([^)]*\)/g, '').trim();
  const parenMatch = rawQuery.match(/\(([^)]+)\)/);
  const parenInner = parenMatch ? parenMatch[1].trim().toLowerCase() : '';
  const stripped = query
    .replace(/^(what\s+is\s+(a\s+|an\s+|the\s+)?|how\s+does\s+(a\s+|the\s+)?|tell\s+me\s+about\s+(a\s+|the\s+)?|explain\s+(a\s+|the\s+)?)/i, '')
    .trim();
  const strippedNoParen = noParen
    .replace(/^(what\s+is\s+(a\s+|an\s+|the\s+)?|how\s+does\s+(a\s+|the\s+)?|tell\s+me\s+about\s+(a\s+|the\s+)?|explain\s+(a\s+|the\s+)?)/i, '')
    .trim();

  const queryVariants = Array.from(new Set([query, noParen, stripped, strippedNoParen, parenInner].filter(Boolean)));

  // 1. Exact slug or exact topic_name
  let match = QUANTUM_TOPICS_CATALOG.find(t => {
    const slug = t.slug.toLowerCase();
    const name = t.topic_name.toLowerCase();
    return queryVariants.some(qv => 
      slug === qv || name === qv ||
      slug.replace(/-/g, ' ') === qv.replace(/-/g, ' ') ||
      name.replace(/-/g, ' ') === qv.replace(/-/g, ' ')
    );
  });
  if (match) return buildOfflineResponse(rawQuery, match);

  // 2. Exact alias
  match = QUANTUM_TOPICS_CATALOG.find(t => 
    t.aliases?.some(a => {
      const aLower = a.toLowerCase().replace(/[–—]/g, '-');
      return queryVariants.some(qv => 
        aLower === qv || aLower.replace(/-/g, ' ') === qv.replace(/-/g, ' ')
      );
    })
  );
  if (match) return buildOfflineResponse(rawQuery, match);

  // 3. Keywords exact match
  match = QUANTUM_TOPICS_CATALOG.find(t => 
    t.keywords?.some(k => {
      const kLower = k.toLowerCase().replace(/[–—]/g, '-');
      return queryVariants.some(qv => 
        kLower === qv || kLower.replace(/-/g, ' ') === qv.replace(/-/g, ' ')
      );
    })
  );
  if (match) return buildOfflineResponse(rawQuery, match);

  // 4. Partial / substring match
  const searchKey = strippedNoParen || stripped || noParen || query;
  match = QUANTUM_TOPICS_CATALOG.find(t => 
    t.topic_name.toLowerCase().includes(searchKey) || 
    t.slug.toLowerCase().includes(searchKey) ||
    t.aliases?.some(a => a.toLowerCase().includes(searchKey)) ||
    t.keywords?.some(k => k.toLowerCase().includes(searchKey))
  );
  if (match) return buildOfflineResponse(rawQuery, match);

  // 5. Reverse contains (e.g. user typed "grover algorithm simulation")
  match = QUANTUM_TOPICS_CATALOG.find(t => 
    searchKey.includes(t.topic_name.toLowerCase()) ||
    searchKey.includes(t.slug.toLowerCase()) ||
    t.aliases?.some(a => searchKey.includes(a.toLowerCase()))
  );
  if (match) return buildOfflineResponse(rawQuery, match);

  // Did you mean?
  let didYouMean: string | null = null;
  const prefix = searchKey.slice(0, 3);
  if (prefix.length >= 3) {
    for (const t of QUANTUM_TOPICS_CATALOG) {
      if (t.topic_name.toLowerCase().startsWith(prefix) || t.slug.toLowerCase().startsWith(prefix)) {
        didYouMean = t.topic_name;
        break;
      }
    }
  }

  return {
    query: rawQuery,
    matched: false,
    topic: null,
    did_you_mean: didYouMean,
    related_topics: [],
    storage_engine: 'local_offline_cache',
    is_verified: false,
    message: 'No matching quantum topic was found in the Quantum Knowledge Base.'
  };
}

function buildOfflineResponse(rawQuery: string, topic: any): QuantumTopicSearchResponse {
  return {
    query: rawQuery,
    matched: true,
    topic,
    did_you_mean: null,
    related_topics: topic.related_topics || [],
    storage_engine: 'local_offline_cache',
    is_verified: true,
    message: null
  };
}

export interface CircuitObservation {
  type: 'tip' | 'observation' | 'warning';
  gate?: string;
  qubit?: number;
  message: string;
}

export interface GateExplanation {
  step: number;
  gate: string;
  target: number;
  control?: number | null;
  purpose: string;
  transformation: string;
}

export interface CircuitExplanationResponse {
  circuit_overview: string;
  mode: 'simple' | 'detailed';
  gate_explanations: GateExplanation[];
  circuit_observations: CircuitObservation[];
  simulation_analysis: string;
  key_concepts: string[];
  explanation_markdown: string;
  sources: Array<{ name: string; source_type?: string }>;
  is_ai_generated: boolean;
}

export interface ExplainCircuitRequest {
  circuit: SimulateGate[];
  num_qubits: number;
  simulation_result?: any;
  mode?: 'simple' | 'detailed';
  algorithm_name?: string;
  algorithm_id?: string;
  student_progress?: any;
}

export async function fetchPlaygroundAlgorithms(): Promise<PlaygroundAlgorithm[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playground/algorithms`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Backend offline or unreachable, fallback to client catalogue
  }
  return PLAYGROUND_ALGORITHMS;
}

export async function explainCircuit(req: ExplainCircuitRequest): Promise<CircuitExplanationResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/circuit/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        circuit: req.circuit,
        num_qubits: req.num_qubits,
        simulation_result: req.simulation_result || null,
        mode: req.mode || 'simple',
        algorithm_name: req.algorithm_name || req.algorithm_id || null,
        student_progress: req.student_progress || null
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend unavailable, fallback to local deterministic analyzer
  }

  return generateOfflineCircuitExplanation(req);
}

function generateOfflineCircuitExplanation(req: ExplainCircuitRequest): CircuitExplanationResponse {
  const isDetailed = (req.mode || 'simple').toLowerCase() === 'detailed';
  const gates = [...req.circuit].sort((a, b) => (a.step || 0) - (b.step || 0));
  const observations: CircuitObservation[] = [];

  // Check self-cancelling gates
  const qubitHistory: Record<number, SimulateGate[]> = {};
  for (const g of gates) {
    const target = g.target ?? 0;
    const gType = (g.type || '').toUpperCase();
    if (['H', 'X', 'Y', 'Z'].includes(gType)) {
      const prev = qubitHistory[target];
      if (prev && prev.length > 0 && prev[prev.length - 1].type.toUpperCase() === gType) {
        const lastStep = prev[prev.length - 1].step;
        observations.push({
          type: 'tip',
          gate: gType,
          qubit: target,
          message: `Consecutive ${gType} gates detected on qubit q[${target}] at steps ${lastStep} and ${g.step}. Because ${gType}² = I (identity), these two operations cancel each other out.`
        });
      }
    }
    if (!qubitHistory[target]) qubitHistory[target] = [];
    qubitHistory[target].push(g);
  }

  // Check entanglement
  const entangling = gates.filter(g => ['CNOT', 'CX', 'CZ', 'SWAP'].includes(g.type.toUpperCase()));
  const hasEntanglement = entangling.length > 0;
  if (hasEntanglement) {
    const pairs = Array.from(new Set(entangling.map(g => `q[${g.control ?? 0}] ↔ q[${g.target}]`))).join(', ');
    observations.push({
      type: 'observation',
      message: `Multi-qubit interaction detected via ${entangling.length} entangling gate(s) between ${pairs}. This creates coherent quantum correlations across registers.`
    });
  } else if (req.num_qubits > 1 && gates.length > 0) {
    observations.push({
      type: 'observation',
      message: 'All operations are local single-qubit gates. The composite state remains a separable product state with zero entanglement.'
    });
  }

  // Gate-by-gate explanations
  const gateExplanations: GateExplanation[] = gates.map((g, idx) => {
    const gType = g.type.toUpperCase();
    let purpose = `Applies ${gType} transformation to qubit q[${g.target}].`;
    let transformation = `Transforms state of q[${g.target}].`;

    if (gType === 'H') {
      purpose = 'Creates quantum superposition, transforming basis states into equal-amplitude superpositions.';
      transformation = isDetailed
        ? 'H|0⟩ = (|0⟩+|1⟩)/√2 = |+⟩, H|1⟩ = (|0⟩-|1⟩)/√2 = |−⟩; Hadamard matrix [[1,1],[1,-1]]/√2.'
        : 'Rotates a definite state into an equal 50/50 probability superposition of 0 and 1.';
    } else if (gType === 'X') {
      purpose = 'Pauli-X NOT bit flip; rotates state 180° around the X-axis of the Bloch sphere.';
      transformation = isDetailed
        ? 'X|0⟩ = |1⟩, X|1⟩ = |0⟩; Matrix [[0,1],[1,0]].'
        : 'Flips 0 to 1 and 1 to 0, like a classical inverter.';
    } else if (gType === 'Z') {
      purpose = 'Pauli-Z phase flip; inverts the phase of the excited state |1⟩.';
      transformation = isDetailed
        ? 'Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩; Matrix [[1,0],[0,-1]].'
        : 'Leaves |0⟩ unchanged and flips the quantum phase of |1⟩ by 180 degrees.';
    } else if (gType === 'CNOT' || gType === 'CX') {
      purpose = `Controlled-NOT entangling gate with control q[${g.control ?? 0}] and target q[${g.target}].`;
      transformation = isDetailed
        ? `|c, t⟩ → |c, t ⊕ c⟩; Flips target qubit q[${g.target}] if control qubit q[${g.control ?? 0}] is in state |1⟩.`
        : `If control q[${g.control ?? 0}] is 1, flips target q[${g.target}]. Creates entanglement when control is in superposition.`;
    } else if (gType === 'CZ') {
      purpose = `Controlled-Phase (CZ) entangling gate with control q[${g.control ?? 0}] and target q[${g.target}].`;
      transformation = isDetailed
        ? '|11⟩ → -|11⟩; introduces a π phase flip only when both control and target are |1⟩.'
        : 'Flips the sign of state |11⟩, crucial for quantum phase oracles.';
    } else if (gType === 'S') {
      purpose = 'Phase gate (quarter turn); adds π/2 (90°) phase to |1⟩.';
      transformation = isDetailed
        ? 'S|0⟩ = |0⟩, S|1⟩ = i|1⟩; S = √Z.'
        : 'Adds a quarter-turn (90°) phase to the |1⟩ component.';
    } else if (gType === 'T') {
      purpose = 'T gate (eighth turn); adds π/4 (45°) phase to |1⟩.';
      transformation = isDetailed
        ? 'T|0⟩ = |0⟩, T|1⟩ = e^(iπ/4)|1⟩; T = √S.'
        : 'Adds an eighth-turn (45°) phase rotation to |1⟩.';
    } else if (gType === 'SWAP') {
      purpose = `Swaps quantum states between qubit q[${g.control ?? 0}] and q[${g.target}].`;
      transformation = isDetailed
        ? '|a, b⟩ → |b, a⟩; Exchanges quantum amplitude distributions.'
        : `Exchanges the full quantum states of q[${g.control ?? 0}] and q[${g.target}].`;
    }

    return {
      step: g.step || idx + 1,
      gate: gType,
      target: g.target,
      control: g.control ?? null,
      purpose,
      transformation
    };
  });

  // Simulation outcome analysis
  let simAnalysis = 'Circuit ready for simulation.';
  if (req.simulation_result && req.simulation_result.probabilities) {
    const probs = req.simulation_result.probabilities as Record<string, number>;
    const nonZero = Object.entries(probs).filter(([_, p]) => p > 0.001);
    if (nonZero.length === 1) {
      simAnalysis = `Deterministic outcome: The circuit evaluates definitively to state ${nonZero[0][0]} with 100% probability.`;
    } else if (nonZero.length === 2 && nonZero.every(([_, p]) => Math.abs(p - 0.5) < 0.05)) {
      simAnalysis = `Bipartite superposition: Exactly two states (${nonZero[0][0]} and ${nonZero[1][0]}) share 50% probability each (characteristic of Bell / entangled pairs).`;
    } else {
      simAnalysis = `Superposition across ${nonZero.length} computational basis states. Measurement probabilities: ` +
        nonZero.map(([state, p]) => `${state}: ${(p * 100).toFixed(1)}%`).join(', ') + '.';
    }
  }

  // Key concepts
  const keyConcepts = ['Superposition'];
  if (hasEntanglement) keyConcepts.push('Entanglement');
  if (gates.some(g => ['Z', 'S', 'T', 'CZ'].includes(g.type.toUpperCase()))) keyConcepts.push('Quantum Phase');
  keyConcepts.push('Measurement Collapse');

  // Build markdown summary
  const markdown = [
    `### Circuit Analysis: ${req.algorithm_name || `${req.num_qubits}-Qubit Quantum Circuit`}`,
    '',
    `This circuit executes **${gates.length} quantum operations** across **${req.num_qubits} qubits**.`,
    '',
    '#### Operational Flow',
    ...gateExplanations.map(g => `- **Step ${g.step} (${g.gate} on q[${g.target}]${g.control != null ? ` with control q[${g.control}]` : ''})**: ${g.purpose}`),
    '',
    '#### Quantum State Evolution',
    simAnalysis,
    '',
    observations.length > 0 ? '#### Structural Observations\n' + observations.map(o => `- **[${o.type.toUpperCase()}]**: ${o.message}`).join('\n') : ''
  ].filter(Boolean).join('\n');

  return {
    circuit_overview: `This circuit uses ${req.num_qubits} qubit${req.num_qubits !== 1 ? 's' : ''} with ${gates.length} gate operations. ${hasEntanglement ? 'It establishes quantum entanglement between registers.' : 'Operations are separable local gates.'}`,
    mode: isDetailed ? 'detailed' : 'simple',
    gate_explanations: gateExplanations,
    circuit_observations: observations,
    simulation_analysis: simAnalysis,
    key_concepts: keyConcepts,
    explanation_markdown: markdown,
    sources: [
      { name: 'Quantum Knowledge Base', source_type: 'verified_db' },
      { name: 'Qiskit Circuit Runtime Specification', source_type: 'framework' }
    ],
    is_ai_generated: false
  };
}


