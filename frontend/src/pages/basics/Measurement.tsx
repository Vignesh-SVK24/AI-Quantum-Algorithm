import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const Measurement: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const [outcomes, setOutcomes] = useState({ zero: 0, one: 0, total: 0 });

  const simulate = () => {
    const isZero = Math.random() < 0.5;
    setOutcomes(prev => ({
      zero: prev.zero + (isZero ? 1 : 0),
      one: prev.one + (isZero ? 0 : 1),
      total: prev.total + 1
    }));
  };

  const reset = () => setOutcomes({ zero: 0, one: 0, total: 0 });

  const zeroHeight = outcomes.total > 0 ? (outcomes.zero / outcomes.total) * 100 : 0;
  const oneHeight = outcomes.total > 0 ? (outcomes.one / outcomes.total) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-transparent text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        Quantum Measurement
      </h2>
      
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-black-olive/80 mb-6 flex-grow">
        <ul className="list-disc pl-5 space-y-2 text-olive-mist">
          <li><span className="text-black-olive/90"><strong>Measurement</strong> is the irreversible process of extracting classical bits from a quantum system.</span></li>
          <li><span className="text-black-olive/90">Before measurement, a qubit resides in state <span className="font-mono text-black-olive font-semibold">|ψ⟩ = α|0⟩ + β|1⟩</span>.</span></li>
          <li><span className="text-black-olive/90">Upon computational measurement, the wave function instantly collapses to |0⟩ (with probability <span className="font-mono text-black-olive font-bold">|α|²</span>) or |1⟩ (with probability <span className="font-mono text-black-olive font-bold">|β|²</span>).</span></li>
          <li><span className="text-black-olive/90">This collapse is fundamental and irreversible — the original superposition is permanently destroyed.</span></li>
          <li><span className="text-black-olive/90">Repeated trials on identically prepared qubits reveal the exact underlying probability distribution.</span></li>
        </ul>
      </div>

      {/* Botanical Inset SVG Diagram */}
      <div className="bg-warm-ivory/60 border border-soft-sand p-6 rounded-2xl flex justify-center items-center overflow-x-auto mb-8 shadow-sm">
        <svg viewBox="0 0 600 200" className="w-full max-w-2xl font-sans select-none" fill="none">
          {/* Before: Superposition state */}
          <circle cx="90" cy="100" r="36" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2" />
          <text x="90" y="105" textAnchor="middle" fill="#203C3D" fontSize="16" fontWeight="bold">|ψ⟩</text>
          <text x="90" y="155" textAnchor="middle" fill="#31372B" opacity="0.7" fontSize="12" fontFamily="monospace">α|0⟩ + β|1⟩</text>

          {/* Apparatus */}
          <rect x="180" y="80" width="60" height="40" rx="10" fill="#FAF7EE" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M 200 106 A 12 12 0 0 1 220 106" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="210" y1="106" x2="218" y2="92" stroke="#203C3D" strokeWidth="2" strokeLinecap="round" />
          <text x="210" y="70" textAnchor="middle" fill="#31372B" opacity="0.7" fontSize="11" fontWeight="bold">MEASURE</text>
          
          <line x1="128" y1="100" x2="175" y2="100" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" markerEnd="url(#measNeuArrow)" />
          <line x1="242" y1="100" x2="290" y2="100" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Branching */}
          <path d="M 290 100 Q 330 100 350 60 T 400 60" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" fill="none" markerEnd="url(#measNeuArrow)" />
          <path d="M 290 100 Q 330 100 350 140 T 400 140" stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.4" fill="none" markerEnd="url(#measNeuArrow)" />

          {/* Outcomes */}
          <circle cx="450" cy="60" r="28" fill="#FAF7EE" stroke="#203C3D" strokeWidth="2" />
          <text x="450" y="65" textAnchor="middle" fill="#203C3D" fontSize="15" fontWeight="bold">|0⟩</text>
          <text x="450" y="105" textAnchor="middle" fill="#31372B" opacity="0.7" fontSize="12" fontFamily="monospace">Prob: |α|²</text>

          <circle cx="450" cy="140" r="28" fill="#FAF7EE" stroke="#31372B" strokeWidth="2" strokeOpacity="0.6" />
          <text x="450" y="145" textAnchor="middle" fill="#31372B" fontSize="15" fontWeight="bold">|1⟩</text>
          <text x="450" y="185" textAnchor="middle" fill="#31372B" opacity="0.7" fontSize="12" fontFamily="monospace">Prob: |β|²</text>

          <defs>
            <marker id="measNeuArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#31372B" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Interactive Simulation Experiment */}
      <div className="bg-warm-ivory/60 border border-soft-sand p-6 rounded-2xl mb-8 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-black-olive">
          Simulate Quantum Measurement
        </h3>
        <p className="text-olive-mist text-xs">
          Repeatedly sample state <span className="font-mono font-semibold text-black-olive">|+⟩ = (|0⟩ + |1⟩)/√2</span> to observe statistical convergence:
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 items-end pt-2">
          <div className="flex-1 w-full max-w-sm flex gap-6 h-44 items-end justify-center bg-warm-ivory border border-soft-sand p-4 rounded-xl shadow-sm">
            {/* Outcome 0 Bar */}
            <div className="w-16 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-xs font-mono font-bold text-black-olive">{outcomes.zero}</span>
              <div className="w-full bg-floral-white border border-soft-sand rounded-t-lg relative h-28 overflow-hidden p-0.5 flex items-end">
                <div 
                  className="w-full bg-slate-glow rounded-t-md transition-all duration-200" 
                  style={{ height: `${Math.max(zeroHeight, outcomes.total > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-black-olive">|0⟩</span>
            </div>
            
            {/* Outcome 1 Bar */}
            <div className="w-16 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-xs font-mono font-bold text-black-olive">{outcomes.one}</span>
              <div className="w-full bg-floral-white border border-soft-sand rounded-t-lg relative h-28 overflow-hidden p-0.5 flex items-end">
                <div 
                  className="w-full bg-black-olive rounded-t-md transition-all duration-200" 
                  style={{ height: `${Math.max(oneHeight, outcomes.total > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-black-olive">|1⟩</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <div className="text-olive-mist text-xs font-mono">
              Total Shots: <strong className="text-black-olive font-bold">{outcomes.total}</strong>
            </div>
            <button 
              onClick={simulate} 
              className="px-6 py-2.5 bg-black-olive text-floral-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-black-olive/90 transition-all"
            >
              Measure Qubit
            </button>
            <button 
              onClick={reset} 
              className="px-6 py-2.5 bg-warm-ivory border border-soft-sand text-black-olive font-semibold rounded-xl text-xs sm:text-sm shadow-sm hover:bg-soft-sand transition-all"
            >
              Reset Tally
            </button>
          </div>
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

export default Measurement;
