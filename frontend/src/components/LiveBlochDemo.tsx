import React, { useState, useEffect, Suspense, lazy } from 'react';
import { RotateCcw, Zap, Activity, Info } from 'lucide-react';
import { simulateCircuit, type SimulateGate, type SimulateResponse } from '../services/api';
import type { ComplexAmplitude, QuantumVisualizationData } from './visualization3d/types';
import { WebGLFallback } from './visualization3d/WebGLFallback';

// Lazy-load 3D Bloch Sphere to keep initial page load fast
const BlochSphere3D = lazy(() =>
  import('./visualization3d/BlochSphere3D').then((m) => ({ default: m.BlochSphere3D }))
);

const INITIAL_STATEVECTOR: ComplexAmplitude[] = [
  { basis: '|0⟩', real: 1.0, imag: 0.0 },
  { basis: '|1⟩', real: 0.0, imag: 0.0 }
];

const INITIAL_PROBABILITIES: Record<string, number> = {
  '|0⟩': 1.0,
  '|1⟩': 0.0
};

const GATE_DESCRIPTIONS: Record<string, { name: string; action: string }> = {
  H: { name: 'Hadamard', action: 'Creates equal superposition |+⟩ = (|0⟩+|1⟩)/√2 (rotates 90° to +X)' },
  X: { name: 'Pauli-X', action: 'Bit-flip NOT gate (rotates 180° around X-axis, flips |0⟩ ↔ |1⟩)' },
  Y: { name: 'Pauli-Y', action: 'Bit and phase flip (rotates 180° around Y-axis, maps to |+i⟩ / |−i⟩)' },
  Z: { name: 'Pauli-Z', action: 'Phase-flip gate (rotates 180° around Z-axis, flips relative sign |+⟩ ↔ |−⟩)' }
};

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const LiveBlochDemo: React.FC = () => {
  const [appliedGates, setAppliedGates] = useState<SimulateGate[]>([]);
  const [statevector, setStatevector] = useState<ComplexAmplitude[]>(INITIAL_STATEVECTOR);
  const [probabilities, setProbabilities] = useState<Record<string, number>>(INITIAL_PROBABILITIES);
  const [lastGate, setLastGate] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  const handleApplyGate = async (gateType: 'H' | 'X' | 'Y' | 'Z') => {
    if (isSimulating) return;
    setIsSimulating(true);

    const newGate: SimulateGate = {
      id: `live-g-${Date.now()}-${appliedGates.length}`,
      type: gateType,
      target: 0,
      step: appliedGates.length
    };

    const nextGates = [...appliedGates, newGate];
    setAppliedGates(nextGates);
    setLastGate(gateType);

    try {
      const res: SimulateResponse = await simulateCircuit({
        num_qubits: 1,
        gates: nextGates
      });

      if (res && res.statevector && res.statevector.length >= 2) {
        setStatevector(res.statevector);
      }
      if (res && res.probabilities) {
        setProbabilities(res.probabilities);
      }
    } catch (err) {
      console.error('Failed to simulate live single qubit gate:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setAppliedGates([]);
    setStatevector(INITIAL_STATEVECTOR);
    setProbabilities(INITIAL_PROBABILITIES);
    setLastGate(null);
  };

  const p0 = probabilities['|0⟩'] ?? probabilities['|0>'] ?? 1.0;
  const p1 = probabilities['|1⟩'] ?? probabilities['|1>'] ?? 0.0;
  const p0Percent = (p0 * 100).toFixed(1);
  const p1Percent = (p1 * 100).toFixed(1);

  const alpha = statevector[0] || { real: 1, imag: 0 };
  const beta = statevector[1] || { real: 0, imag: 0 };

  const formatComplex = (real: number, imag: number) => {
    const r = real.toFixed(3);
    if (Math.abs(imag) < 0.001) return r;
    const sign = imag >= 0 ? '+' : '-';
    return `${r} ${sign} ${Math.abs(imag).toFixed(3)}i`;
  };

  const fallbackData: QuantumVisualizationData = {
    numQubits: 1,
    circuitOperations: appliedGates,
    currentStep: appliedGates.length,
    statevector,
    basisStateProbabilities: probabilities,
    currentState: statevector
  };

  return (
    <div className="w-full space-y-4">
      {/* 3D Canvas / Fallback Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10 min-h-[290px] sm:min-h-[320px] flex items-center justify-center">
        {hasWebGL ? (
          <Suspense
            fallback={
              <div className="w-full h-72 sm:h-80 flex flex-col items-center justify-center gap-3 text-slate-gray font-mono text-xs">
                <Activity className="w-6 h-6 animate-spin text-slate-gray" />
                <span>Loading 3D Bloch Canvas...</span>
              </div>
            }
          >
            <BlochSphere3D statevector={statevector} selectedGate={lastGate || undefined} />
          </Suspense>
        ) : (
          <WebGLFallback data={fallbackData} reason="WebGL hardware acceleration disabled. 2D projection active." />
        )}

        {/* Live Interaction Badge */}
        <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-floral-white/90 backdrop-blur-sm border border-black-olive/10 text-[10px] font-mono text-black-olive font-semibold shadow-neu-sm-raised">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-sage animate-pulse" />
          <span>Real-time Qiskit Engine</span>
        </div>
      </div>

      {/* Interactive Gate Buttons & Controls */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-warm-gold" />
            Apply Single-Qubit Gates:
          </span>

          <button
            type="button"
            onClick={handleReset}
            disabled={appliedGates.length === 0 || isSimulating}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-floral-white text-black-olive border border-soft-sand shadow-neu-sm-raised hover:shadow-neu-sm-pressed disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset |0⟩</span>
          </button>
        </div>

        {/* Gate Palette Row */}
        <div className="grid grid-cols-4 gap-2">
          {(['H', 'X', 'Y', 'Z'] as const).map((g) => {
            const isLast = lastGate === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => handleApplyGate(g)}
                disabled={isSimulating}
                className={`py-2 px-1 sm:px-3 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  isLast
                    ? 'bg-slate-gray text-floral-white border-slate-gray shadow-neu-pressed'
                    : 'bg-floral-white text-black-olive border-soft-sand shadow-neu-raised hover:shadow-neu-sm-pressed active:scale-95'
                }`}
                title={GATE_DESCRIPTIONS[g]?.action}
              >
                <span>{g}</span>
                <span className={`text-[9px] font-sans font-normal ${isLast ? 'text-floral-white/80' : 'text-olive-mist'}`}>
                  {GATE_DESCRIPTIONS[g]?.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chained Gate Sequence History */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-olive-mist overflow-x-auto py-1 px-1">
          <span className="font-semibold text-black-olive flex-shrink-0">Sequence:</span>
          <span className="px-1.5 py-0.5 rounded bg-floral-white border border-soft-sand text-deep-olive font-bold">|0⟩</span>
          {appliedGates.length === 0 ? (
            <span className="italic text-olive-mist/70">(Click any gate above to apply)</span>
          ) : (
            appliedGates.map((g, idx) => (
              <React.Fragment key={g.id || idx}>
                <span className="text-soft-sand">→</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-gray text-floral-white font-bold text-[10px]">
                  {g.type}
                </span>
              </React.Fragment>
            ))
          )}
        </div>

        {/* Statevector & Probability Readout Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Probability Bars */}
          <div className="p-2.5 rounded-xl bg-floral-white border border-soft-sand space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-olive-mist uppercase flex items-center justify-between">
              <span>Measurement Odds</span>
              <span className="text-[9px] font-normal text-olive-mist/70">Born Rule (|α|², |β|²)</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-black-olive">P(|0⟩):</span>
                <span className="font-bold text-deep-olive">{p0Percent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-soft-sand/50 overflow-hidden">
                <div
                  className="h-full bg-slate-gray transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, p0 * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="font-bold text-black-olive">P(|1⟩):</span>
                <span className="font-bold text-deep-olive">{p1Percent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-soft-sand/50 overflow-hidden">
                <div
                  className="h-full bg-warm-gold transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, p1 * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Complex Amplitudes */}
          <div className="p-2.5 rounded-xl bg-floral-white border border-soft-sand flex flex-col justify-between font-mono text-[11px]">
            <div>
              <span className="text-[10px] font-bold text-olive-mist uppercase block mb-1">State Vector |ψ⟩</span>
              <div className="text-deep-olive font-semibold text-xs leading-tight">
                ({formatComplex(alpha.real, alpha.imag)})|0⟩ + ({formatComplex(beta.real, beta.imag)})|1⟩
              </div>
            </div>
            <div className="text-[10px] text-olive-mist pt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-warm-gold flex-shrink-0" />
              <span>
                {lastGate ? GATE_DESCRIPTIONS[lastGate]?.action : 'Qubit initialized in pure ground state |0⟩.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBlochDemo;
