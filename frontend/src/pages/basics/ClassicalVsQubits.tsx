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
    <div className="flex flex-col h-full bg-transparent text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        Classical Bits vs Qubits
      </h2>
      
      <div className="flex-grow space-y-5 text-sm sm:text-base leading-relaxed text-black-olive/80">
        <p>
          In classical computing, information is processed using classical bits. These bits are like simple physical switches: they are definitively either in a state of 0 or a state of 1. There is no ambiguity.
        </p>
        <p>
          Quantum bits, or <strong className="text-black-olive font-semibold">qubits</strong>, are fundamentally different. A qubit is described by a quantum state, which consists of complex probability amplitudes. Unlike a classical bit, a qubit doesn't simply hold a value of 0 or 1.
        </p>
        <p>
          Instead, a qubit's state determines the <em className="text-slate-gray font-medium">probabilities</em> of different measurement outcomes. When measured, it will yield a 0 or a 1, but the likelihood of each outcome is governed by the state's amplitudes prior to measurement.
        </p>

        {/* Botanical Inset SVG Diagram */}
        <div className="my-8 p-6 rounded-2xl bg-warm-ivory/60 border border-soft-sand flex justify-center items-center overflow-x-auto shadow-sm">
          <svg width="600" height="250" viewBox="0 0 600 250" className="max-w-full select-none">
            {/* Classical Bit */}
            <g transform="translate(90, 35)">
              <rect x="0" y="0" width="170" height="180" rx="20" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.2" />
              <text x="85" y="30" fill="#31372B" fontSize="15" fontWeight="bold" textAnchor="middle">Classical Bit</text>
              
              {/* Switch Base */}
              <rect x="55" y="55" width="60" height="95" rx="30" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.2" />
              {/* Switch Knob (ON) */}
              <circle cx="85" cy="80" r="22" fill="#203C3D" />
              
              <text x="32" y="85" fill="#31372B" opacity="0.7" fontSize="13" textAnchor="middle">ON (1)</text>
              <text x="32" y="130" fill="#31372B" opacity="0.7" fontSize="13" textAnchor="middle">OFF (0)</text>
            </g>

            {/* Qubit */}
            <g transform="translate(340, 35)">
              <rect x="0" y="0" width="200" height="180" rx="20" fill="#FAF7EE" stroke="#203C3D" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="100" y="30" fill="#203C3D" fontSize="15" fontWeight="bold" textAnchor="middle">Qubit</text>
              
              {/* Bloch sphere 2D rep */}
              <circle cx="100" cy="105" r="48" fill="none" stroke="#31372B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.3" />
              <ellipse cx="100" cy="105" rx="48" ry="14" fill="none" stroke="#31372B" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
              
              {/* Z axis */}
              <line x1="100" y1="50" x2="100" y2="160" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="100" y="44" fill="#31372B" fontSize="13" textAnchor="middle" fontWeight="bold">|0⟩</text>
              <text x="100" y="174" fill="#31372B" fontSize="13" textAnchor="middle" fontWeight="bold">|1⟩</text>

              {/* State Vector */}
              <line x1="100" y1="105" x2="135" y2="72" stroke="#203C3D" strokeWidth="2.5" markerEnd="url(#neuArrow)" />
              <text x="145" y="68" fill="#203C3D" fontSize="15" fontWeight="bold">|ψ⟩</text>
              
              <text x="100" y="200" fill="#203C3D" fontSize="13" fontStyle="italic" textAnchor="middle">|ψ⟩ = α|0⟩ + β|1⟩</text>
            </g>

            <defs>
              <marker id="neuArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#203C3D" />
              </marker>
            </defs>
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

export default ClassicalVsQubits;
