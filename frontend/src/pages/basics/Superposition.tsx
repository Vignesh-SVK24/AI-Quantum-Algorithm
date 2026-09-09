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
    <div className="flex flex-col h-full bg-floral-white text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        Superposition
      </h2>
      
      <div className="space-y-5 text-sm sm:text-base leading-relaxed text-black-olive/80 mb-6 flex-grow">
        <p>
          A qubit can exist in an arbitrary linear combination of basis states, described by:
        </p>
        <div className="text-center font-mono text-xl p-4 rounded-2xl bg-floral-white shadow-neu-pressed text-slate-gray font-bold">
          |ψ⟩ = α|0⟩ + β|1⟩
        </div>
        <p>
          Here, <strong className="text-black-olive font-semibold">α</strong> (alpha) and <strong className="text-black-olive font-semibold">β</strong> (beta) are complex numbers known as <strong className="text-black-olive font-semibold">probability amplitudes</strong>.
        </p>
        <p>
          It is a common misconception to say that a qubit is "both 0 and 1 at the same time." This is scientifically inaccurate! The qubit exists in a <em>single, well-defined quantum state</em> that happens to have a mathematical relationship to both basis vectors.
        </p>
        <p>
          Upon measurement, the state collapses: we obtain |0⟩ with probability <strong className="text-slate-gray font-mono">|α|²</strong> and |1⟩ with probability <strong className="text-slate-gray font-mono">|β|²</strong>. For instance, the Hadamard gate (H) maps |0⟩ into equal superposition: <span className="font-mono">H|0⟩ = (1/√2)|0⟩ + (1/√2)|1⟩</span>.
        </p>
      </div>

      {/* Interactive Neumorphic Card */}
      <div className="bg-floral-white p-6 rounded-2xl shadow-neu-pressed mb-8 space-y-6">
        <h3 className="text-base font-bold text-black-olive flex items-center justify-between">
          <span>Interactive State Adjuster</span>
          <span className="text-xs font-mono text-slate-gray">|α|² + |β|² = 1.0</span>
        </h3>
        
        <div>
          <div className="flex justify-between text-xs text-black-olive/70 mb-2 font-medium">
            <span>Adjust Angle θ (0° to 90°)</span>
            <span className="font-mono">{((theta * 180) / Math.PI).toFixed(1)}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={Math.PI / 2} 
            step="0.01" 
            value={theta}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black-olive/20 accent-[#203C3D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-floral-white shadow-neu-raised">
            <span className="text-black-olive/60 block text-[10px]">Amplitude α:</span>
            <span className="text-slate-gray font-bold text-sm">{alpha}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-floral-white shadow-neu-raised">
            <span className="text-black-olive/60 block text-[10px]">Amplitude β:</span>
            <span className="text-slate-gray font-bold text-sm">{beta}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-black-olive/80 mb-1.5 font-medium">
              <span>Probability of |0⟩ : |α|²</span>
              <span className="font-mono text-slate-gray font-bold">{percent0}%</span>
            </div>
            <div className="w-full bg-floral-white shadow-neu-pressed rounded-full h-3.5 p-0.5 overflow-hidden">
              <div 
                className="bg-slate-gray h-full rounded-full transition-all duration-200" 
                style={{ width: `${percent0}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-black-olive/80 mb-1.5 font-medium">
              <span>Probability of |1⟩ : |β|²</span>
              <span className="font-mono text-black-olive font-bold">{percent1}%</span>
            </div>
            <div className="w-full bg-floral-white shadow-neu-pressed rounded-full h-3.5 p-0.5 overflow-hidden">
              <div 
                className="bg-black-olive/70 h-full rounded-full transition-all duration-200" 
                style={{ width: `${percent1}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-auto pt-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-black-olive/70 bg-floral-white shadow-neu-raised hover:shadow-neu-pressed disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-gray text-floral-white shadow-neu-raised hover:shadow-neu-pressed transition-all"
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

export default Superposition;
