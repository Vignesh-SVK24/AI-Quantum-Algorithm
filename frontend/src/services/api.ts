const API_BASE_URL = 'http://127.0.0.1:8000';

async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error(
      'Unable to reach Quantum Backend (http://127.0.0.1:8000). Please ensure the backend service is running.'
    );
  }
}

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
  oracle_type: 'constant' | 'balanced';
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
  page: string;
  circuit?: Array<{ id?: string; type: string; target: number; step: number; control?: number }>;
  num_qubits?: number;
  simulation_result?: Record<string, any> | null;
  algorithm_context?: Record<string, any> | null;
}

export interface TutorResponse {
  answer: string;
  source: string;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getTestCircuit(): Promise<CircuitTestResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/quantum/test-circuit`);
  if (!response.ok) {
    throw new Error(`Failed to fetch test circuit: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function simulateCircuit(request: SimulateRequest): Promise<SimulateResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail;
    if (detail && typeof detail === 'object' && detail.errors) {
      throw new Error(detail.errors.join('\n'));
    }
    throw new Error(detail?.message || `Simulation failed: ${response.status}`);
  }
  return response.json();
}

export async function getDeutschOracles(): Promise<DeutschOracle[]> {
  const response = await safeFetch(`${API_BASE_URL}/api/algorithms/deutsch-jozsa/oracles`);
  if (!response.ok) {
    throw new Error(`Failed to fetch oracles: ${response.statusText}`);
  }
  return response.json();
}

export async function runDeutschJozsa(oracleId: string, shots = 1024): Promise<DeutschJozsaResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/algorithms/deutsch-jozsa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oracle_id: oracleId, shots }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail?.message || `Deutsch-Jozsa execution failed: ${response.status}`);
  }
  return response.json();
}

export async function runGrover(targetState: string, shots = 1024): Promise<GroverResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/algorithms/grover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_state: targetState, shots }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail?.message || `Grover execution failed: ${response.status}`);
  }
  return response.json();
}

export async function askAITutor(question: string, context: TutorContext): Promise<TutorResponse> {
  const response = await safeFetch(`${API_BASE_URL}/api/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail?.message || `AI Tutor request failed: ${response.status}`);
  }
  return response.json();
}
