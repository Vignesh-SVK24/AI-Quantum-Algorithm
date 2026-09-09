import React, { useState } from 'react';
import { Play, Activity, Layers } from 'lucide-react';

interface CircuitPlaceholderProps {
  onRunTest?: () => void;
  isRunning?: boolean;
}

export const CircuitPlaceholder: React.FC<CircuitPlaceholderProps> = ({ onRunTest, isRunning }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="relative rounded-3xl bg-floral-white p-6 shadow-neu-raised overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-black-olive/30 shadow-neu-sm-pressed" />
            <div className="w-2.5 h-2.5 rounded-full bg-black-olive/30 shadow-neu-sm-pressed" />
            <div className="w-2.5 h-2.5 rounded-full bg-black-olive/30 shadow-neu-sm-pressed" />
          </div>
          <span className="text-xs font-mono text-black-olive/70 ml-2 font-medium">
            circuit://bell-state-generator.qc
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-floral-white shadow-neu-pressed text-black-olive/80">
            2 Qubits • 2 Classical Bits
          </span>
          {onRunTest && (
            <button
              onClick={onRunTest}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-gray text-floral-white text-xs font-medium shadow-neu-raised hover:shadow-neu-pressed active:scale-95 disabled:opacity-50 transition-all"
            >
              <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Simulating...' : 'Run Simulation'}
            </button>
          )}
        </div>
      </div>

      {/* Quantum Circuit Schematic (Neumorphic SVG) */}
      <div className="w-full overflow-x-auto py-4 px-2 rounded-2xl bg-floral-white shadow-neu-pressed">
        <svg
          viewBox="0 0 680 180"
          className="w-full min-w-[580px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wire 0 */}
          <text x="20" y="55" fill="#31372B" fontSize="13" fontFamily="monospace" fontWeight="bold">
            |0⟩ q[0]
          </text>
          <line x1="85" y1="50" x2="640" y2="50" stroke="#31372B" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />

          {/* Wire 1 */}
          <text x="20" y="125" fill="#31372B" fontSize="13" fontFamily="monospace" fontWeight="bold">
            |0⟩ q[1]
          </text>
          <line x1="85" y1="120" x2="640" y2="120" stroke="#31372B" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />

          {/* Step 1: Hadamard Gate */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setActiveStep(1)}
          >
            <rect
              x="140"
              y="28"
              width="44"
              height="44"
              rx="10"
              fill="#FAF7EE"
              stroke="#203C3D"
              strokeWidth="2"
            />
            <text x="162" y="55" fill="#203C3D" fontSize="18" fontWeight="bold" textAnchor="middle">
              H
            </text>
          </g>

          {/* Step 2: CNOT */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveStep(2)}
          >
            <line x1="280" y1="50" x2="280" y2="120" stroke="#203C3D" strokeWidth="2.5" />
            <circle cx="280" cy="50" r="7" fill="#203C3D" />
            <circle cx="280" cy="120" r="15" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2.5" />
            <line x1="280" y1="108" x2="280" y2="132" stroke="#203C3D" strokeWidth="2.5" />
            <line x1="268" y1="120" x2="292" y2="120" stroke="#203C3D" strokeWidth="2.5" />
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
              rx="10"
              fill="#FAF7EE"
              stroke="#31372B"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <path d="M 432 58 A 12 12 0 0 1 454 58" fill="none" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="443" y1="58" x2="451" y2="42" stroke="#203C3D" strokeWidth="1.5" strokeLinecap="round" />
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
              rx="10"
              fill="#FAF7EE"
              stroke="#31372B"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <path d="M 432 128 A 12 12 0 0 1 454 128" fill="none" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="443" y1="128" x2="451" y2="112" stroke="#203C3D" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Classical Bus lines */}
          <line x1="466" y1="50" x2="560" y2="50" stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="466" y1="120" x2="560" y2="120" stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />

          {/* Output Indicators */}
          <rect x="560" y="32" width="90" height="36" rx="8" fill="#FAF7EE" stroke="#31372B" strokeWidth="1" strokeOpacity="0.3" />
          <text x="605" y="54" fill="#31372B" fontSize="11" fontFamily="monospace" textAnchor="middle">
            c[0] ← |0/1⟩
          </text>

          <rect x="560" y="102" width="90" height="36" rx="8" fill="#FAF7EE" stroke="#31372B" strokeWidth="1" strokeOpacity="0.3" />
          <text x="605" y="124" fill="#31372B" fontSize="11" fontFamily="monospace" textAnchor="middle">
            c[1] ← |0/1⟩
          </text>
        </svg>
      </div>

      {/* Inset Screen State Transformation & Amplitude Probabilities */}
      <div className="mt-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-black-olive/70 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-gray" />
            <span>State Transformation:</span>
          </div>
          <div className="p-3 rounded-2xl bg-floral-white shadow-neu-pressed font-mono text-xs text-black-olive flex items-center justify-between">
            <span className="font-semibold text-slate-gray">
              {activeStep === 1 && '|ψ₁⟩ = (|00⟩ + |10⟩) / √2'}
              {activeStep === 2 && '|ψ₂⟩ = (|00⟩ + |11⟩) / √2 (Bell State |Φ⁺⟩)'}
              {activeStep === 3 && 'Measurement Collapse: 50% |00⟩, 50% |11⟩'}
            </span>
            <span className="text-[10px] text-black-olive/60 font-sans">Click gates to inspect</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-black-olive/70 font-medium">
            <Activity className="w-3.5 h-3.5 text-slate-gray" />
            <span>Amplitude Probabilities:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-between">
              <span className="text-black-olive/70">P(|00⟩):</span>
              <span className="text-slate-gray font-bold">50.0%</span>
            </div>
            <div className="p-3 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-between">
              <span className="text-black-olive/70">P(|11⟩):</span>
              <span className="text-slate-gray font-bold">50.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
