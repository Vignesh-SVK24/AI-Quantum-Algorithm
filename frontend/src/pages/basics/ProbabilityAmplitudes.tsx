import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ProbabilityAmplitudes: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const examples = [
    { state: "Equal Superposition", alpha: "1/√2", beta: "1/√2", p0: 50, p1: 50 },
    { state: "Definite |0⟩", alpha: "1", beta: "0", p0: 100, p1: 0 },
    { state: "Definite |1⟩", alpha: "0", beta: "1", p0: 0, p1: 100 },
    { state: "Unequal State", alpha: "√(1/3)", beta: "√(2/3)", p0: 33.3, p1: 66.7 },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        Probability Amplitudes
      </h2>
      
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-black-olive/80 mb-6 flex-grow">
        <p>
          In the state equation <strong className="text-black-olive font-mono">|ψ⟩ = α|0⟩ + β|1⟩</strong>, the values <strong className="text-black-olive font-mono">α</strong> and <strong className="text-black-olive font-mono">β</strong> are the probability amplitudes.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-olive-mist">
          <li><span className="text-black-olive/90">They are <em>complex numbers</em> with both magnitude and relative phase.</span></li>
          <li><span className="text-black-olive/90">The probability of measuring |0⟩ is the squared magnitude: <strong className="text-black-olive font-mono">P(0) = |α|²</strong>.</span></li>
          <li><span className="text-black-olive/90">The probability of measuring |1⟩ is the squared magnitude: <strong className="text-black-olive font-mono">P(1) = |β|²</strong>.</span></li>
          <li><span className="text-black-olive/90">While phase does not alter a single isolated measurement probability, it is responsible for the <em>quantum interference</em> effects that enable algorithmic speedups.</span></li>
        </ul>
      </div>

      {/* Botanical Inset Card for Examples */}
      <div className="bg-warm-ivory/60 border border-soft-sand p-6 rounded-2xl mb-8 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-black-olive">
          Example States &amp; Measurement Probabilities
        </h3>
        
        <div className="space-y-4">
          {examples.map((ex, i) => (
            <div key={i} className="bg-warm-ivory border border-soft-sand p-4 rounded-xl space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black-olive">{ex.state}</span>
                <span className="font-mono text-olive-mist font-medium">α = {ex.alpha}, β = {ex.beta}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 text-xs font-mono text-right text-black-olive font-semibold">|0⟩</div>
                <div className="flex-1 bg-floral-white border border-soft-sand rounded-full h-3 p-0.5 overflow-hidden">
                  <div className="bg-slate-glow h-full rounded-full transition-all duration-300" style={{ width: `${ex.p0}%` }} />
                </div>
                <div className="w-10 text-xs font-mono text-right text-olive-mist font-semibold">{ex.p0.toFixed(0)}%</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 text-xs font-mono text-right text-black-olive font-semibold">|1⟩</div>
                <div className="flex-1 bg-floral-white border border-soft-sand rounded-full h-3 p-0.5 overflow-hidden">
                  <div className="bg-black-olive h-full rounded-full transition-all duration-300" style={{ width: `${ex.p1}%` }} />
                </div>
                <div className="w-10 text-xs font-mono text-right text-olive-mist font-semibold">{ex.p1.toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Conservation Highlight */}
        <div className="p-4 bg-warm-ivory border border-soft-sand rounded-xl text-center space-y-1 shadow-sm">
          <p className="text-[11px] text-olive-mist uppercase tracking-widest font-semibold">Conservation of Probability</p>
          <p className="text-2xl font-mono text-black-olive font-bold">|α|² + |β|² = 1</p>
          <p className="text-xs text-olive-mist">The sum of all measurement probabilities in any basis is always exactly 100%.</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-auto pt-6">
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

export default ProbabilityAmplitudes;
