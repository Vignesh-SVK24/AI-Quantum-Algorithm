import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const Superposition: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const [theta, setTheta] = useState<number>(Math.PI / 4);

  const prob0 = Math.cos(theta) ** 2;
  const prob1 = Math.sin(theta) ** 2;

  const alpha = Math.cos(theta).toFixed(3);
  const beta = Math.sin(theta).toFixed(3);

  const percent0 = (prob0 * 100).toFixed(1);
  const percent1 = (prob1 * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full bg-quantum-900/50 p-6 rounded-2xl border border-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold mb-4 text-quantum-300">Superposition</h2>
      
      <div className="space-y-4 text-lg leading-relaxed mb-8 flex-grow">
        <p>
          A qubit can exist in a quantum state described by:
        </p>
        <div className="text-center font-mono text-xl p-4 bg-slate-900 rounded-xl text-quantum-cyan shadow-inner">
          |ψ⟩ = α|0⟩ + β|1⟩
        </div>
        <p>
          Here, <strong>α</strong> (alpha) and <strong>β</strong> (beta) are complex numbers called <strong>probability amplitudes</strong>.
        </p>
        <p>
          It is a common misconception to say the qubit is "both 0 and 1 at the same time." This is inaccurate! The qubit is in a <em>single, definite quantum state</em> that simply does not correspond to a classical 0 or 1. It has a well-defined relationship to both states.
        </p>
        <p>
          When we measure the qubit, we get |0⟩ with probability <strong>|α|²</strong> and |1⟩ with probability <strong>|β|²</strong>. For example, the Hadamard gate (H) creates an equal superposition: H|0⟩ = (1/√2)|0⟩ + (1/√2)|1⟩.
        </p>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-quantum-teal">Interactive State Adjuster</h3>
        
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Adjust Superposition (0 to 90 degrees)</label>
          <input 
            type="range" 
            min="0" 
            max={Math.PI / 2} 
            step="0.01" 
            value={theta}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
            className="w-full accent-quantum-cyan"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center font-mono text-sm mb-4">
          <div>α = {alpha}</div>
          <div>β = {beta}</div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability of |0⟩ : |α|²</span>
              <span>{percent0}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-indigo-500 h-4 transition-all duration-300" 
                style={{ width: `${percent0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability of |1⟩ : |β|²</span>
              <span>{percent1}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-teal-500 h-4 transition-all duration-300" 
                style={{ width: `${percent1}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-auto pt-4 border-t border-slate-700">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          {isLast ? (
            <>Complete <Check className="w-4 h-4 ml-2" /></>
          ) : (
            <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default Superposition;
