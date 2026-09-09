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
    { state: "Equal", alpha: "1/√2", beta: "1/√2", p0: 50, p1: 50 },
    { state: "Definite |0⟩", alpha: "1", beta: "0", p0: 100, p1: 0 },
    { state: "Definite |1⟩", alpha: "0", beta: "1", p0: 0, p1: 100 },
    { state: "Unequal", alpha: "√(1/3)", beta: "√(2/3)", p0: 33.3, p1: 66.7 },
  ];

  return (
    <div className="flex flex-col h-full bg-quantum-900/50 p-6 rounded-2xl border border-slate-800 text-slate-200">
      <h2 className="text-3xl font-bold mb-4 text-quantum-300">Probability Amplitudes</h2>
      
      <div className="space-y-4 text-lg leading-relaxed mb-6 flex-grow">
        <p>
          In the state equation <strong>|ψ⟩ = α|0⟩ + β|1⟩</strong>, the values <strong>α</strong> and <strong>β</strong> are the probability amplitudes.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>They are <em>complex numbers</em>, meaning they have both a magnitude and a phase.</li>
          <li>The probability of measuring |0⟩ is the magnitude squared: <strong>P(0) = |α|²</strong>.</li>
          <li>The probability of measuring |1⟩ is the magnitude squared: <strong>P(1) = |β|²</strong>.</li>
          <li>The phase (angle) of these amplitudes doesn't affect the final measurement probabilities directly, but it is crucial for <em>interference</em> effects during quantum computation.</li>
        </ul>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-quantum-teal">Example States</h3>
        
        <div className="space-y-6">
          {examples.map((ex, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-quantum-cyan">{ex.state} State</span>
                <span className="font-mono text-sm text-slate-400">α={ex.alpha}, β={ex.beta}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-12 text-sm text-right">|0⟩</div>
                <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-3" style={{ width: `${ex.p0}%` }}></div>
                </div>
                <div className="w-12 text-sm text-slate-400">{ex.p0.toFixed(0)}%</div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-12 text-sm text-right">|1⟩</div>
                <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                  <div className="bg-teal-500 h-3" style={{ width: `${ex.p1}%` }}></div>
                </div>
                <div className="w-12 text-sm text-slate-400">{ex.p1.toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-xl text-center shadow-inner">
          <p className="text-sm text-indigo-300 mb-2 uppercase tracking-wider font-semibold">Conservation of Probability</p>
          <p className="text-2xl font-mono text-indigo-100">|α|² + |β|² = 1</p>
          <p className="text-sm text-indigo-200 mt-2">The total probability must always sum to 100%.</p>
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

export default ProbabilityAmplitudes;
