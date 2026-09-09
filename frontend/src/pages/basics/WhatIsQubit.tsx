import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const WhatIsQubit: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">What is a Qubit?</h2>
      
      <div className="flex-grow space-y-6">
        <p className="text-lg leading-relaxed">
          A <strong>qubit</strong> (short for quantum bit) is the fundamental unit of quantum information. Just as classical computers process information using bits, quantum computers process information using qubits.
        </p>
        <p className="text-lg leading-relaxed">
          Unlike classical bits, qubits are physical systems governed entirely by the laws of quantum mechanics. The mathematical description of a qubit's state is often written using Dirac notation, also known as bra-ket notation, yielding expressions like <strong>|ψ⟩</strong> (read as "ket psi").
        </p>
        <p className="text-lg leading-relaxed">
          In practice, a qubit can be realized using various physical systems, as long as the system has two distinct, controllable quantum states.
        </p>

        <div className="my-10 flex justify-around items-center">
          <svg width="600" height="200" viewBox="0 0 600 200" className="max-w-full">
            {/* Electron Spin */}
            <g transform="translate(50, 20)">
              <circle cx="80" cy="60" r="40" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <circle cx="80" cy="60" r="25" fill="#312e81" />
              {/* Up arrow */}
              <path d="M70,70 L70,40 L60,40 L80,20 L100,40 L90,40 L90,70 Z" fill="#818cf8" opacity="0.8" />
              {/* Down arrow */}
              <path d="M70,50 L70,80 L60,80 L80,100 L100,80 L90,80 L90,50 Z" fill="#c7d2fe" opacity="0.4" />
              <text x="80" y="130" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">Electron Spin</text>
              <text x="80" y="150" fill="#94a3b8" fontSize="14" textAnchor="middle">(Up / Down)</text>
            </g>

            {/* Photon Polarization */}
            <g transform="translate(250, 20)">
              <circle cx="80" cy="60" r="40" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
              <circle cx="80" cy="60" r="25" fill="#134e4a" />
              {/* Horizontal / Vertical */}
              <line x1="80" y1="30" x2="80" y2="90" stroke="#5eead4" strokeWidth="4" markerEnd="url(#arrow-cyan)" markerStart="url(#arrow-cyan-rev)" />
              <line x1="45" y1="60" x2="115" y2="60" stroke="#99f6e4" strokeWidth="4" opacity="0.5" />
              
              <text x="80" y="130" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">Photon</text>
              <text x="80" y="150" fill="#94a3b8" fontSize="14" textAnchor="middle">(Polarization)</text>
            </g>

            {/* Superconducting */}
            <g transform="translate(450, 20)">
              <rect x="40" y="20" width="80" height="80" rx="8" fill="#172554" stroke="#3b82f6" strokeWidth="2" />
              {/* Circuit traces */}
              <path d="M40,40 L60,40 L60,60 L80,60 L80,40 L100,40" stroke="#93c5fd" strokeWidth="2" fill="none" />
              <circle cx="80" cy="60" r="10" fill="#60a5fa" />
              <line x1="40" y1="80" x2="120" y2="80" stroke="#93c5fd" strokeWidth="2" />
              
              <text x="80" y="130" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">Superconductor</text>
              <text x="80" y="150" fill="#94a3b8" fontSize="14" textAnchor="middle">(Circuit States)</text>
            </g>

            <defs>
              <marker id="arrow-cyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5eead4" />
              </marker>
              <marker id="arrow-cyan-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5eead4" />
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

export default WhatIsQubit;
