/**
 * Types and Interfaces for 3D Quantum Visualization Layer
 * Smart India Hackathon — Interactive Quantum Algorithm Learning Platform
 */

export interface ComplexAmplitude {
  basis: string;
  real: number;
  imag: number;
}

export interface GateOperation {
  id?: string;
  type: string; // 'H' | 'X' | 'Z' | 'CNOT' | 'S' | 'T' | 'MEASURE' | etc.
  target: number;
  step: number;
  control?: number;
}

export interface QuantumVisualizationData {
  numQubits: number;
  circuitOperations: GateOperation[];
  currentStep: number;
  statevector: ComplexAmplitude[];
  basisStateProbabilities: Record<string, number>;
  measurementCounts?: Record<string, number>;
  selectedGate?: string;
  previousState?: ComplexAmplitude[];
  currentState: ComplexAmplitude[];
  algorithmName?: string; // e.g. "grover", "deutsch-jozsa", or undefined for free-form circuits
  circuitTitle?: string;
  circuitDescription?: string;
}

export interface BlochCoordinates {
  x: number; // +X = |+⟩, -X = |−⟩
  y: number; // +Y = |+i⟩, -Y = |−i⟩
  z: number; // +Z = |0⟩, -Z = |1⟩
  theta: number; // polar angle [0, π]
  phi: number; // azimuthal angle [0, 2π)
  p0: number; // probability of measuring |0⟩
  p1: number; // probability of measuring |1⟩
  relativePhase: number; // relative phase φ in radians
}

/**
 * Calculates rigorous 3D Bloch vector coordinates from a 1-qubit statevector.
 *
 * For state |ψ⟩ = α|0⟩ + β|1⟩:
 *   x = 2 · Re(α* · β)
 *   y = 2 · Im(α* · β)
 *   z = |α|² − |β|²
 *
 * Standard Convention:
 *   |0⟩  → ( 0,  0, +1)
 *   |1⟩  → ( 0,  0, -1)
 *   |+⟩  → (+1,  0,  0)
 *   |−⟩  → (-1,  0,  0)
 *   |+i⟩ → ( 0, +1,  0)
 *   |−i⟩ → ( 0, -1,  0)
 */
export function computeBlochCoordinates(statevector: ComplexAmplitude[]): BlochCoordinates {
  if (!statevector || statevector.length === 0) {
    return { x: 0, y: 0, z: 1, theta: 0, phi: 0, p0: 1, p1: 0, relativePhase: 0 };
  }

  const alphaEntry = statevector.find(e => e.basis === '|0>' || e.basis === '|0⟩') || statevector[0] || { real: 1, imag: 0 };
  const betaEntry = statevector.find(e => e.basis === '|1>' || e.basis === '|1⟩') || statevector[1] || { real: 0, imag: 0 };

  const a_r = alphaEntry.real;
  const a_i = alphaEntry.imag;
  const b_r = betaEntry.real;
  const b_i = betaEntry.imag;

  // Normalization safeguard
  const p0 = a_r * a_r + a_i * a_i;
  const p1 = b_r * b_r + b_i * b_i;
  const norm = Math.sqrt(p0 + p1) || 1.0;

  const na_r = a_r / norm;
  const na_i = a_i / norm;
  const nb_r = b_r / norm;
  const nb_i = b_i / norm;

  // α* · β = (na_r - i·na_i)(nb_r + i·nb_i)
  //        = (na_r·nb_r + na_i·nb_i) + i(na_r·nb_i - na_i·nb_r)
  const re_prod = na_r * nb_r + na_i * nb_i;
  const im_prod = na_r * nb_i - na_i * nb_r;

  const x = Math.max(-1, Math.min(1, 2 * re_prod));
  const y = Math.max(-1, Math.min(1, 2 * im_prod));
  const z = Math.max(-1, Math.min(1, (na_r * na_r + na_i * na_i) - (nb_r * nb_r + nb_i * nb_i)));

  // Spherical angles
  const theta = Math.acos(z); // 0 at +Z (|0⟩), π at -Z (|1⟩)
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;

  return {
    x,
    y,
    z,
    theta,
    phi,
    p0: Math.max(0, Math.min(1, p0 / (norm * norm))),
    p1: Math.max(0, Math.min(1, p1 / (norm * norm))),
    relativePhase: phi,
  };
}
