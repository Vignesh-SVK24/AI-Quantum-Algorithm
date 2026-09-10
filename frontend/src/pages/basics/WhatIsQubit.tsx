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
    <div className="flex flex-col h-full bg-transparent text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        What is a Qubit?
      </h2>
      
      <div className="flex-grow space-y-5 text-sm sm:text-base leading-relaxed text-black-olive/80">
        <p>
          A <strong className="text-black-olive font-semibold">qubit</strong> (short for quantum bit) is the fundamental unit of quantum information. Just as classical computers process information using bits, quantum computers process information using qubits.
        </p>
        <p>
          Unlike classical bits, qubits are physical systems governed entirely by the laws of quantum mechanics. The mathematical description of a qubit's state is written using Dirac notation (bra-ket notation), yielding expressions like <strong className="text-slate-gray font-mono">|ψ⟩</strong> (read as "ket psi").
        </p>
        <p>
          In practice, a qubit can be realized using various physical systems, as long as the system provides two distinct, quantum-mechanically controllable states.
        </p>

        {/* Botanical Inset SVG Diagram */}
        <div className="my-8 p-6 rounded-2xl bg-warm-ivory/60 border border-soft-sand flex justify-center items-center overflow-x-auto shadow-sm">
          <svg width="600" height="190" viewBox="0 0 600 190" className="max-w-full select-none">
            {/* Electron Spin */}
            <g transform="translate(50, 15)">
              <circle cx="80" cy="55" r="38" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.2" />
              <circle cx="80" cy="55" r="24" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2" />
              {/* Up arrow */}
              <path d="M72,65 L72,38 L62,38 L80,20 L98,38 L88,38 L88,65 Z" fill="#203C3D" />
              <text x="80" y="125" fill="#31372B" fontSize="15" fontWeight="bold" textAnchor="middle">Electron Spin</text>
              <text x="80" y="145" fill="#31372B" opacity="0.7" fontSize="13" textAnchor="middle">(Up / Down)</text>
            </g>

            {/* Photon Polarization */}
            <g transform="translate(250, 15)">
              <circle cx="80" cy="55" r="38" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.2" />
              <circle cx="80" cy="55" r="24" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2" />
              {/* Horizontal / Vertical */}
              <line x1="80" y1="28" x2="80" y2="82" stroke="#203C3D" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="53" y1="55" x2="107" y2="55" stroke="#31372B" strokeWidth="2.5" strokeOpacity="0.4" strokeLinecap="round" />
              
              <text x="80" y="125" fill="#31372B" fontSize="15" fontWeight="bold" textAnchor="middle">Photon</text>
              <text x="80" y="145" fill="#31372B" opacity="0.7" fontSize="13" textAnchor="middle">(Polarization)</text>
            </g>

            {/* Superconducting */}
            <g transform="translate(450, 15)">
              <rect x="40" y="18" width="80" height="75" rx="14" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2" />
              {/* Circuit traces */}
              <path d="M40,38 L60,38 L60,55 L80,55 L80,38 L100,38" stroke="#31372B" strokeWidth="2" fill="none" strokeOpacity="0.6" />
              <circle cx="80" cy="55" r="9" fill="#203C3D" />
              <line x1="40" y1="72" x2="120" y2="72" stroke="#31372B" strokeWidth="2" strokeOpacity="0.4" />
              
              <text x="80" y="125" fill="#31372B" fontSize="15" fontWeight="bold" textAnchor="middle">Superconductor</text>
              <text x="80" y="145" fill="#31372B" opacity="0.7" fontSize="13" textAnchor="middle">(Circuit Loops)</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-black-olive bg-warm-ivory border border-soft-sand shadow-sm hover:bg-soft-sand disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-warm-gold text-cocoa-noir shadow-md hover:bg-warm-gold/90 transition-all"
        >
          {isLast ? (
            <>Complete <Check size={16} /></>
          ) : (
            <>Next <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatIsQubit;
