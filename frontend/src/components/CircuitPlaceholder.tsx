import React, { useState } from 'react';
import { Play, Activity, Layers } from 'lucide-react';

interface CircuitPlaceholderProps {
  onRunTest?: () => void;
  isRunning?: boolean;
}

export const CircuitPlaceholder: React.FC<CircuitPlaceholderProps> = ({ onRunTest, isRunning }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-quantum-900/90 p-6 shadow-2xl backdrop-blur-xl overflow-hidden group">
      {/* Decorative subtle background accents */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-400/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-400/60" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
            circuit://bell-state-generator.qc
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            2 Qubits • 2 Classical Bits
          </span>
          {onRunTest && (
            <button
              onClick={onRunTest}
              disabled={isRunning}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : 'fill-teal-300'}`} />
              {isRunning ? 'Simulating...' : 'Run Simulation'}
            </button>
          )}
        </div>
      </div>

      {/* Quantum Circuit Schematic (SVG Diagram) */}
      <div className="w-full overflow-x-auto py-3">
        <svg
          viewBox="0 0 680 180"
          className="w-full min-w-[580px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hGateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f70e8" />
              <stop offset="100%" stopColor="#3452b0" />
            </linearGradient>
            <linearGradient id="measGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Qubit Wire 0: q[0] */}
          <text x="20" y="55" fill="#94a3b8" fontSize="13" fontFamily="monospace" fontWeight="bold">
            |0⟩ q[0]
          </text>
          <line x1="85" y1="50" x2="640" y2="50" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Qubit Wire 1: q[1] */}
          <text x="20" y="125" fill="#94a3b8" fontSize="13" fontFamily="monospace" fontWeight="bold">
            |0⟩ q[1]
          </text>
          <line x1="85" y1="120" x2="640" y2="120" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Step 1: Hadamard Gate on q[0] */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setActiveStep(1)}
          >
            <rect
              x="140"
              y="28"
              width="44"
              height="44"
              rx="8"
              fill="url(#hGateGrad)"
              stroke="#718ff0"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <text x="162" y="56" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">
              H
            </text>
          </g>

          {/* CNOT Control on q[0] and Target on q[1] */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveStep(2)}
          >
            {/* Control line */}
            <line x1="280" y1="50" x2="280" y2="120" stroke="#06d6a0" strokeWidth="2" />
            
            {/* Control node */}
            <circle cx="280" cy="50" r="7" fill="#06d6a0" stroke="#0c132c" strokeWidth="1.5" />
            
            {/* Target symbol (+) */}
            <circle cx="280" cy="120" r="15" fill="#0c132c" stroke="#06d6a0" strokeWidth="2" />
            <line x1="280" y1="109" x2="280" y2="131" stroke="#06d6a0" strokeWidth="2" />
            <line x1="269" y1="120" x2="291" y2="120" stroke="#06d6a0" strokeWidth="2" />
          </g>

          {/* Step 3: Measurement Meters */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveStep(3)}
          >
            <rect
              x="420"
              y="28"
              width="46"
              height="44"
              rx="8"
              fill="url(#measGrad)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <path d="M 432 58 A 12 12 0 0 1 454 58" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="443" y1="58" x2="451" y2="42" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveStep(3)}
          >
            <rect
              x="420"
              y="98"
              width="46"
              height="44"
              rx="8"
              fill="url(#measGrad)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <path d="M 432 128 A 12 12 0 0 1 454 128" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="443" y1="128" x2="451" y2="112" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Classical Output Bus lines */}
          <line x1="466" y1="50" x2="560" y2="50" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="466" y1="120" x2="560" y2="120" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Output State Indicators */}
          <rect x="560" y="32" width="90" height="36" rx="6" fill="#1e293b" stroke="#334155" />
          <text x="605" y="54" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
            c[0] ← |0/1⟩
          </text>

          <rect x="560" y="102" width="90" height="36" rx="6" fill="#1e293b" stroke="#334155" />
          <text x="605" y="124" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
            c[1] ← |0/1⟩
          </text>
        </svg>
      </div>

      {/* Interactive Statevector & Explanation Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800/70 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>State Transformation:</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-teal-300 flex items-center justify-between">
            <span>
              {activeStep === 1 && '|ψ₁⟩ = (|00⟩ + |10⟩) / √2'}
              {activeStep === 2 && '|ψ₂⟩ = (|00⟩ + |11⟩) / √2  (Bell State |Φ⁺⟩)'}
              {activeStep === 3 && 'Measurement Collapse: 50% |00⟩, 50% |11⟩'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans">Click gates to inspect</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Amplitude Probabilities:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">P(|00⟩):</span>
              <span className="text-emerald-400 font-bold">50.0%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">P(|11⟩):</span>
              <span className="text-emerald-400 font-bold">50.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
