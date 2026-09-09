import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
    <div className="bg-slate-900/50 text-slate-100 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-white">Measurement</h2>
        <div className="prose prose-invert max-w-none text-slate-300">
          <ul className="list-disc pl-5 space-y-2">
            <li>Measurement is the process of extracting classical information from a qubit</li>
            <li>Before measurement, the qubit is in state |ψ⟩ = α|0⟩ + β|1⟩</li>
            <li>After measurement in the computational basis, the qubit collapses to either |0⟩ (with probability |α|²) or |1⟩ (with probability |β|²)</li>
            <li>This collapse is irreversible — the superposition information is destroyed</li>
            <li>Repeated measurements of identically prepared qubits reveal the underlying probabilities</li>
            <li>This is fundamentally probabilistic — not due to ignorance but an intrinsic feature of quantum mechanics</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl flex justify-center items-center border border-slate-700">
        <svg viewBox="0 0 600 200" className="w-full max-w-2xl font-sans" fill="none">
          {/* Before */}
          <circle cx="100" cy="100" r="40" className="fill-indigo-900/50 stroke-indigo-400 stroke-2" />
          <text x="100" y="105" textAnchor="middle" className="fill-indigo-200 text-sm font-semibold">|ψ⟩</text>
          <text x="100" y="160" textAnchor="middle" className="fill-slate-300 text-xs">α|0⟩ + β|1⟩</text>

          {/* Apparatus */}
          <path d="M 190 90 H 250 V 110 H 190 Z" className="fill-slate-700 stroke-slate-500" />
          <path d="M 220 110 L 235 95" className="stroke-teal-400 stroke-2" />
          <text x="220" y="80" textAnchor="middle" className="fill-slate-400 text-xs uppercase tracking-wider">Measure</text>
          <path d="M 140 100 H 190" className="stroke-slate-500 stroke-2" markerEnd="url(#arrow)" />
          <path d="M 250 100 H 300" className="stroke-slate-500 stroke-2" />

          {/* Branching */}
          <path d="M 300 100 Q 330 100 350 60 T 400 60" className="stroke-slate-500 stroke-2" fill="none" markerEnd="url(#arrow)" />
          <path d="M 300 100 Q 330 100 350 140 T 400 140" className="stroke-slate-500 stroke-2" fill="none" markerEnd="url(#arrow)" />

          {/* Outcomes */}
          <circle cx="450" cy="60" r="30" className="fill-indigo-950 stroke-indigo-500 stroke-2" />
          <text x="450" y="65" textAnchor="middle" className="fill-indigo-200 text-sm font-semibold">|0⟩</text>
          <text x="450" y="110" textAnchor="middle" className="fill-indigo-300 text-xs">Prob: |α|²</text>

          <circle cx="450" cy="140" r="30" className="fill-teal-950 stroke-teal-500 stroke-2" />
          <text x="450" y="145" textAnchor="middle" className="fill-teal-200 text-sm font-semibold">|1⟩</text>
          <text x="450" y="190" textAnchor="middle" className="fill-teal-300 text-xs">Prob: |β|²</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
        <h3 className="text-xl font-semibold mb-4 text-indigo-300">Simulate Measurement</h3>
        <p className="text-slate-400 text-sm mb-6">Simulating measurement of state |+⟩ = ( |0⟩ + |1⟩ ) / √2</p>
        
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div className="flex-1 w-full max-w-sm flex gap-4 h-48 items-end justify-center">
            <div className="w-16 flex flex-col items-center gap-2">
              <span className="text-indigo-200 text-xs font-mono">{outcomes.zero}</span>
              <div className="w-full bg-indigo-500/20 rounded-t-sm relative transition-all duration-300" style={{ height: `${Math.max(zeroHeight, 1)}%` }}>
                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-300" style={{ height: '100%' }}></div>
              </div>
              <span className="text-slate-300 font-semibold">|0⟩</span>
            </div>
            
            <div className="w-16 flex flex-col items-center gap-2">
              <span className="text-teal-200 text-xs font-mono">{outcomes.one}</span>
              <div className="w-full bg-teal-500/20 rounded-t-sm relative transition-all duration-300" style={{ height: `${Math.max(oneHeight, 1)}%` }}>
                <div className="absolute bottom-0 w-full bg-teal-500 rounded-t-sm transition-all duration-300" style={{ height: '100%' }}></div>
              </div>
              <span className="text-slate-300 font-semibold">|1⟩</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pb-4">
            <div className="text-slate-400 text-sm mb-2">Total: {outcomes.total} measurements</div>
            <button onClick={simulate} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
              Measure Qubit
            </button>
            <button onClick={reset} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button 
          onClick={onPrev} 
          disabled={isFirst}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFirst ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors"
        >
          {isLast ? <><Check size={18} /> Complete</> : <>Next <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

export default Measurement;
