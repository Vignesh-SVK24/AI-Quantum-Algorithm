import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ClassicalVsQubits: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Classical Bits vs Qubits</h2>
      
      <div className="flex-grow space-y-6">
        <p className="text-lg leading-relaxed">
          In classical computing, information is processed using classical bits. These bits are like simple switches: they are definitively either in a state of 0 or a state of 1. There is no ambiguity.
        </p>
        <p className="text-lg leading-relaxed">
          Quantum bits, or <strong>qubits</strong>, are fundamentally different. A qubit is described by a quantum state, which consists of probability amplitudes. Unlike a classical bit, a qubit doesn't just hold a value of 0 or 1.
        </p>
        <p className="text-lg leading-relaxed">
          Instead, a qubit's state determines the <em>probabilities</em> of different measurement outcomes. When measured, it will yield a 0 or a 1, but the likelihood of each outcome is governed by the state's amplitudes prior to measurement.
        </p>

        <div className="my-8 flex justify-center items-center">
          <svg width="600" height="250" viewBox="0 0 600 250" className="max-w-full">
            {/* Classical Bit */}
            <g transform="translate(100, 40)">
              <rect x="0" y="0" width="160" height="180" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <text x="80" y="30" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle">Classical Bit</text>
              
              {/* Switch Base */}
              <rect x="50" y="60" width="60" height="100" rx="30" fill="#0f172a" />
              {/* Switch Knob (ON) */}
              <circle cx="80" cy="85" r="24" fill="#3b82f6" />
              
              <text x="30" y="90" fill="#64748b" fontSize="14" textAnchor="middle">ON (1)</text>
              <text x="30" y="145" fill="#64748b" fontSize="14" textAnchor="middle">OFF (0)</text>
            </g>

            {/* Qubit */}
            <g transform="translate(340, 40)">
              <rect x="0" y="0" width="200" height="180" rx="16" fill="#0f172a" stroke="#0d9488" strokeWidth="2" />
              <text x="100" y="30" fill="#5eead4" fontSize="16" fontWeight="bold" textAnchor="middle">Qubit</text>
              
              {/* Bloch sphere 2D rep */}
              <circle cx="100" cy="110" r="50" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <ellipse cx="100" cy="110" rx="50" ry="15" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Z axis */}
              <line x1="100" y1="50" x2="100" y2="170" stroke="#475569" strokeWidth="2" />
              <text x="100" y="45" fill="#94a3b8" fontSize="14" textAnchor="middle">|0⟩</text>
              <text x="100" y="185" fill="#94a3b8" fontSize="14" textAnchor="middle">|1⟩</text>

              {/* State Vector */}
              <line x1="100" y1="110" x2="135" y2="75" stroke="#2dd4bf" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="145" y="70" fill="#2dd4bf" fontSize="16" fontWeight="bold">|ψ⟩</text>
              
              <text x="100" y="215" fill="#5eead4" fontSize="14" fontStyle="italic" textAnchor="middle">|ψ⟩ = α|0⟩ + β|1⟩</text>
            </g>

            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isFirst ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowLeft size={18} /> Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          {isLast ? (
            <>Complete <Check size={18} /></>
          ) : (
            <>Next <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClassicalVsQubits;
