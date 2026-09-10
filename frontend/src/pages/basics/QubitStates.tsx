import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QubitStates: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  return (
    <div className="flex flex-col h-full bg-transparent text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        Qubit States |0⟩ and |1⟩
      </h2>
      
      <div className="flex-grow space-y-5 text-sm sm:text-base leading-relaxed text-black-olive/80">
        <p>
          Every qubit has two primary computational basis states, denoted in Dirac notation as <strong className="text-black-olive font-mono">|0⟩</strong> and <strong className="text-black-olive font-mono">|1⟩</strong>. These correspond directly to classical bit values 0 and 1.
        </p>
        <p>
          By convention, |0⟩ represents the "ground state" (lowest energy level) and |1⟩ represents the "excited state" (higher energy level). If you measure a qubit prepared in the |0⟩ state, you will always get 0. If prepared in |1⟩, you will always get 1.
        </p>
        <p>
          These two states form an <em className="text-slate-gray font-medium">orthonormal basis</em>. Any state of a single qubit can be expressed as a linear combination of these basis vectors:
        </p>

        {/* Botanical Inset SVG Diagram */}
        <div className="my-8 p-6 rounded-2xl bg-warm-ivory/60 border border-soft-sand flex justify-center items-center overflow-x-auto shadow-sm">
          <svg width="500" height="240" viewBox="0 0 500 240" className="max-w-full select-none">
            {/* Basis Vectors */}
            <g transform="translate(70, 15)">
              <text x="30" y="50" fill="#203C3D" fontSize="22" fontWeight="bold">|0⟩ =</text>
              <rect x="90" y="20" width="38" height="66" rx="8" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="109" y="44" fill="#31372B" fontSize="18" textAnchor="middle" fontWeight="bold">1</text>
              <text x="109" y="70" fill="#31372B" opacity="0.4" fontSize="18" textAnchor="middle">0</text>
              
              <text x="240" y="50" fill="#203C3D" fontSize="22" fontWeight="bold">|1⟩ =</text>
              <rect x="300" y="20" width="38" height="66" rx="8" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="319" y="44" fill="#31372B" opacity="0.4" fontSize="18" textAnchor="middle">0</text>
              <text x="319" y="70" fill="#31372B" fontSize="18" textAnchor="middle" fontWeight="bold">1</text>
            </g>

            {/* Energy Level Diagram */}
            <g transform="translate(130, 125)">
              <line x1="0" y1="75" x2="190" y2="75" stroke="#203C3D" strokeWidth="2.5" />
              <text x="205" y="80" fill="#31372B" fontSize="15" fontWeight="medium">|0⟩ (Ground State)</text>
              
              <line x1="0" y1="20" x2="190" y2="20" stroke="#203C3D" strokeWidth="2.5" />
              <text x="205" y="25" fill="#31372B" fontSize="15" fontWeight="medium">|1⟩ (Excited State)</text>
              
              <line x1="95" y1="75" x2="95" y2="23" stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" markerEnd="url(#neuArrowEnergy)" />
              <text x="108" y="52" fill="#31372B" opacity="0.7" fontSize="13">Energy ΔE</text>
            </g>

            <defs>
              <marker id="neuArrowEnergy" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#31372B" />
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

export default QubitStates;
