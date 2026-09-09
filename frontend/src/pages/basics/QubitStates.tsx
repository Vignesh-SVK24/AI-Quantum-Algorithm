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
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Qubit States |0⟩ and |1⟩</h2>
      
      <div className="flex-grow space-y-6">
        <p className="text-lg leading-relaxed">
          Every qubit has two special computational basis states, denoted as <strong>|0⟩</strong> and <strong>|1⟩</strong>. These are analogous to the classical bit values 0 and 1.
        </p>
        <p className="text-lg leading-relaxed">
          By convention, |0⟩ represents the "ground state" (lowest energy) and |1⟩ represents the "excited state" (higher energy). If you measure a qubit that is exactly in the |0⟩ state, you will always get 0. If you measure one in the |1⟩ state, you will always get 1.
        </p>
        <p className="text-lg leading-relaxed">
          These two states form an <em>orthonormal basis</em>. Mathematically, any possible state of a qubit can be expressed as a linear combination of these two vectors:
        </p>

        <div className="my-8 flex justify-center items-center">
          <svg width="500" height="260" viewBox="0 0 500 260" className="max-w-full">
            {/* Vectors */}
            <g transform="translate(80, 20)">
              <text x="30" y="50" fill="#5eead4" fontSize="24" fontWeight="bold">|0⟩ =</text>
              <rect x="90" y="20" width="40" height="70" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
              <text x="110" y="45" fill="#f8fafc" fontSize="20" textAnchor="middle">1</text>
              <text x="110" y="75" fill="#94a3b8" fontSize="20" textAnchor="middle">0</text>
              
              <text x="250" y="50" fill="#818cf8" fontSize="24" fontWeight="bold">|1⟩ =</text>
              <rect x="310" y="20" width="40" height="70" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
              <text x="330" y="45" fill="#94a3b8" fontSize="20" textAnchor="middle">0</text>
              <text x="330" y="75" fill="#f8fafc" fontSize="20" textAnchor="middle">1</text>
            </g>

            {/* Energy Levels */}
            <g transform="translate(150, 140)">
              <line x1="0" y1="80" x2="200" y2="80" stroke="#5eead4" strokeWidth="3" />
              <text x="220" y="85" fill="#5eead4" fontSize="18">|0⟩ (Ground State)</text>
              
              <line x1="0" y1="20" x2="200" y2="20" stroke="#818cf8" strokeWidth="3" />
              <text x="220" y="25" fill="#818cf8" fontSize="18">|1⟩ (Excited State)</text>
              
              <line x1="100" y1="80" x2="100" y2="20" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-energy)" />
              <text x="115" y="55" fill="#cbd5e1" fontSize="14">Energy</text>
            </g>

            <defs>
              <marker id="arrow-energy" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
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

export default QubitStates;
