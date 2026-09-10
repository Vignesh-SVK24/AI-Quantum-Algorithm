import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Layers, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  runDeutschJozsa, 
  runGrover, 
  type DeutschJozsaResponse, 
  type GroverResponse 
} from '../services/api';
import { MeasurementHistogramWidget } from '../components/MeasurementHistogramWidget';
import { AITutorPanel } from '../components/AITutorPanel';

const DEUTSCH_PRESETS = [
  { id: 'constant_0', name: 'Constant 0 (f(x) = 0)', type: 'constant', desc: 'Always returns 0. Oracle performs identity on ancilla.' },
  { id: 'constant_1', name: 'Constant 1 (f(x) = 1)', type: 'constant', desc: 'Always returns 1. Oracle flips ancilla with an X gate.' },
  { id: 'balanced_xor', name: 'Balanced XOR (x0 ⊕ x1)', type: 'balanced', desc: 'Returns 1 for |01⟩ & |10⟩; returns 0 for |00⟩ & |11⟩.' },
  { id: 'balanced_x0', name: 'Balanced First Bit (x0)', type: 'balanced', desc: 'Returns the value of qubit x0 via a single CNOT.' },
];

const GROVER_TARGETS = ['00', '01', '10', '11'];

export const AlgorithmLab: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'deutsch' | 'grover'>('deutsch');

  // Deutsch-Jozsa State
  const [selectedOracle, setSelectedOracle] = useState<string>('balanced_xor');
  const [djResult, setDjResult] = useState<DeutschJozsaResponse | null>(null);
  const [djLoading, setDjLoading] = useState<boolean>(false);
  const [djError, setDjError] = useState<string | null>(null);

  // Grover's State
  const [selectedTarget, setSelectedTarget] = useState<string>('10');
  const [groverResult, setGroverResult] = useState<GroverResponse | null>(null);
  const [groverStageIdx, setGroverStageIdx] = useState<number>(0);
  const [groverLoading, setGroverLoading] = useState<boolean>(false);
  const [groverError, setGroverError] = useState<string | null>(null);

  const handleRunDJ = async () => {
    setDjLoading(true);
    setDjError(null);
    try {
      const res = await runDeutschJozsa(selectedOracle);
      setDjResult(res);
    } catch (err) {
      setDjError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setDjLoading(false);
    }
  };

  const handleRunGrover = async () => {
    setGroverLoading(true);
    setGroverError(null);
    try {
      const res = await runGrover(selectedTarget);
      setGroverResult(res);
      setGroverStageIdx(res.stages.length - 1);
    } catch (err) {
      setGroverError(err instanceof Error ? err.message : 'Grover execution failed');
    } finally {
      setGroverLoading(false);
    }
  };

  useEffect(() => {
    if (activeAlgorithm === 'deutsch' && !djResult) {
      handleRunDJ();
    } else if (activeAlgorithm === 'grover' && !groverResult) {
      handleRunGrover();
    }
  }, [activeAlgorithm]);

  return (
    <div className="min-h-screen bg-floral-white text-black-olive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="space-y-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-ivory border border-soft-sand text-xs font-semibold text-black-olive hover:bg-soft-sand transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-olive-mist" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-11 h-11 rounded-2xl bg-black-olive text-floral-white border border-black-olive/40 shadow-md flex items-center justify-center">
                <Cpu className="w-6 h-6 text-warm-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-warm-ivory border border-soft-sand text-black-olive font-bold">
                    Unitary Algorithms
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-black-olive tracking-tight">Quantum Algorithm Lab</h1>
                <p className="text-xs text-olive-mist">Interactive walkthroughs of quantum speedup and interference algorithms</p>
              </div>
            </div>
          </div>

          {/* Algorithm Toggle (Anchored Black Olive Pill Bar) */}
          <div className="flex bg-black-olive p-1.5 rounded-2xl shadow-md border border-black-olive/40 self-start md:self-auto">
            <button
              onClick={() => setActiveAlgorithm('deutsch')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAlgorithm === 'deutsch'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/70 hover:text-warm-ivory'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-muted-sage" /> Deutsch-Jozsa
            </button>
            <button
              onClick={() => setActiveAlgorithm('grover')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAlgorithm === 'grover'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/70 hover:text-warm-ivory'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-warm-gold" /> Grover's Search
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALGORITHM 1: DEUTSCH-JOZSA */}
        {/* ========================================================================= */}
        {activeAlgorithm === 'deutsch' && (
          <div className="space-y-8">
            
            {/* Plain Language Walkthrough Banner */}
            <div className="bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 border border-soft-sand shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black-olive font-bold text-sm font-serif">
                  <Sparkles className="w-4 h-4 text-warm-gold" /> The Deutsch-Jozsa Problem
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive font-semibold">
                  Quantum Advantage: O(1) vs O(2ⁿ⁻¹)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs">
                    1. The Problem
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    Given a black-box function (oracle) f(x) that returns 0 or 1, determine if it is <strong>constant</strong> (same output for all inputs) or <strong>balanced</strong> (returns 0 for half, 1 for half).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs">
                    2. Classical Limitation
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    A classical algorithm must evaluate inputs one by one. In the worst case for n=2 inputs (4 values), a classical computer must test <strong>3 inputs (2ⁿ⁻¹ + 1)</strong> to be certain.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-sage" /> 3. Quantum Speedup
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    By preparing all inputs in superposition with an ancilla in |−⟩, <strong>phase kickback</strong> embeds the answer into relative phases. Interference reveals the verdict in <strong>exactly 1 query</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Control & Circuit Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Oracle Picker & Controls */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">Select Preset Oracle</h3>
                  <div className="space-y-3">
                    {DEUTSCH_PRESETS.map((oracle) => (
                      <button
                        key={oracle.id}
                        onClick={() => setSelectedOracle(oracle.id)}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${
                          selectedOracle === oracle.id
                            ? 'bg-black-olive text-floral-white border-black-olive shadow-md font-medium'
                            : 'bg-warm-ivory/60 hover:bg-warm-ivory text-black-olive border-soft-sand'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${selectedOracle === oracle.id ? 'text-floral-white' : 'text-black-olive'}`}>{oracle.name}</span>
                          <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold ${
                            selectedOracle === oracle.id 
                              ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/30' 
                              : 'bg-warm-ivory border border-soft-sand text-olive-mist'
                          }`}>
                            {oracle.type}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${selectedOracle === oracle.id ? 'text-warm-ivory/80' : 'text-black-olive/70'}`}>{oracle.desc}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunDJ}
                    disabled={djLoading}
                    className="w-full mt-3 py-3.5 rounded-2xl bg-warm-gold text-deep-slate font-bold text-xs hover:bg-[#D4BA7F] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {djLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Deutsch-Jozsa Circuit (1 Query)
                  </button>
                </div>

                {/* Circuit Schematic Card (Dark Slate Technical Identity) */}
                <div className="p-6 rounded-3xl bg-slate-glow text-warm-ivory border border-soft-slate/40 shadow-md space-y-3">
                  <h3 className="text-xs font-bold text-soft-cyan uppercase tracking-wider">Circuit Architecture</h3>
                  <div className="p-4 bg-deep-slate border border-soft-slate/30 rounded-2xl font-mono text-xs text-soft-cyan space-y-2">
                    <div>q[0]: |0⟩ ──[H]──[   ]──[H]── [Measure]</div>
                    <div>q[1]: |0⟩ ──[H]──[ Uf]──[H]── [Measure]</div>
                    <div>q[2]: |1⟩ ──[H]──[   ]──────── (Ancilla |−⟩)</div>
                  </div>
                  <p className="text-[11px] text-warm-ivory/70 leading-relaxed">
                    Input qubits q[0], q[1] start at |0⟩; ancilla q[2] is prepared in |1⟩ then Hadamard-transformed to |−⟩ for phase kickback.
                  </p>
                </div>
              </div>

              {/* Right Column: Execution Results & Conclusion */}
              <div className="lg:col-span-7 space-y-6">
                
                {djError && (
                  <div className="p-4 rounded-2xl bg-cocoa-noir/10 border border-soft-cocoa/40 text-black-olive text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-cocoa-noir" /> {djError}
                  </div>
                )}

                {djResult && (
                  <>
                    {/* Scientific Conclusion Card (Anchored Black Olive Dark Card) */}
                    <div className="p-6 rounded-3xl bg-black-olive text-warm-ivory border border-black-olive/60 shadow-md space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm text-warm-gold">
                          <CheckCircle2 className="w-5 h-5 text-warm-gold" /> 
                          Oracle Verdict: {djResult.oracle_type.toUpperCase()}
                        </div>
                        <span className="text-xs font-mono font-semibold bg-slate-glow border border-soft-slate/40 text-soft-cyan px-3 py-1 rounded-full">
                          1 Quantum Query
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-warm-ivory/85">
                        {djResult.conclusion}
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                        <div className="p-3 rounded-xl bg-deep-slate border border-soft-slate/30">
                          <span className="text-warm-ivory/60 block text-[10px]">Measured State:</span>
                          <span className="font-bold text-soft-cyan text-xs">
                            {djResult.is_constant ? '|00⟩' : Object.keys(djResult.input_probabilities).find(k => k !== '|00⟩' && djResult.input_probabilities[k] > 0.01)}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-deep-slate border border-soft-slate/30">
                          <span className="text-warm-ivory/60 block text-[10px]">Interference Rule:</span>
                          <span className="font-semibold text-warm-ivory text-xs">
                            {djResult.is_constant ? 'Constructive on |00⟩' : 'Destructive on |00⟩ (P=0)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Results Histogram Widget */}
                    <MeasurementHistogramWidget
                      measurementCounts={djResult.measurement_counts}
                      probabilities={djResult.input_probabilities}
                      shots={djResult.shots}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ALGORITHM 2: GROVER'S SEARCH */}
        {/* ========================================================================= */}
        {activeAlgorithm === 'grover' && (
          <div className="space-y-8">
            
            {/* Plain Language Walkthrough Banner */}
            <div className="bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 border border-soft-sand shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black-olive font-bold text-sm font-serif">
                  <Search className="w-4 h-4 text-warm-gold" /> Grover's Quantum Search
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive font-semibold">
                  Speedup: O(√N) via Amplitude Amplification
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs">
                    1. The Search Problem
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    Search an unstructured database of N=4 items for one specific target. Classically, you must test items sequentially (average 2–3 tries, worst case 4).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs">
                    2. Important Nuance
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    Quantum search is <strong>not instantaneous</strong>. It rotates the statevector geometrically in Hilbert space to systematically amplify the target's amplitude.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5 shadow-sm">
                  <span className="font-bold text-black-olive block text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-warm-gold" /> 3. Amplitude Amplification
                  </span>
                  <p className="text-black-olive/75 leading-relaxed">
                    The <strong>Oracle</strong> flips the target's phase (+ to −). Then the <strong>Diffusion Operator</strong> reflects all amplitudes across their average, amplifying the target to ~100%!
                  </p>
                </div>
              </div>
            </div>

            {/* Target Selection & Stage Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Target Selector & Step Indicators */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">Choose Marked Item to Find</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {GROVER_TARGETS.map((target) => (
                      <button
                        key={target}
                        onClick={() => setSelectedTarget(target)}
                        className={`p-4 rounded-2xl text-center font-mono font-bold transition-all border ${
                          selectedTarget === target
                            ? 'bg-black-olive text-warm-gold border-black-olive shadow-md'
                            : 'bg-warm-ivory/60 hover:bg-warm-ivory text-black-olive/80 border border-soft-sand'
                        }`}
                      >
                        <div className="text-lg">|{target}⟩</div>
                        <span className={`text-[10px] font-sans font-normal ${selectedTarget === target ? 'text-warm-ivory/70' : 'text-olive-mist'}`}>Target Key</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunGrover}
                    disabled={groverLoading}
                    className="w-full mt-3 py-3.5 rounded-2xl bg-warm-gold text-deep-slate font-bold text-xs hover:bg-[#D4BA7F] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {groverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Grover's Algorithm
                  </button>
                </div>

                {/* Staged Reveal Stepper Pills */}
                {groverResult && (
                  <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">Step-by-Step Evolution</h3>
                    <div className="space-y-2">
                      {groverResult.stages.map((stage, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGroverStageIdx(idx)}
                          className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between border ${
                            groverStageIdx === idx
                              ? 'bg-black-olive text-floral-white border-black-olive shadow-sm'
                              : 'bg-warm-ivory/60 hover:bg-warm-ivory text-black-olive/80 border-soft-sand'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              groverStageIdx === idx ? 'bg-warm-gold text-deep-slate' : 'bg-soft-sand text-black-olive'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="truncate max-w-[190px]">{stage.name.split('.')[1] || stage.name}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold ${groverStageIdx === idx ? 'text-warm-gold' : 'text-olive-mist'}`}>
                            {(stage.target_prob * 100).toFixed(0)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Stage Inspection & Measurements */}
              <div className="lg:col-span-7 space-y-6">
                {groverError && (
                  <div className="p-4 rounded-2xl bg-cocoa-noir/10 border border-soft-cocoa/40 text-black-olive text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-cocoa-noir" /> {groverError}
                  </div>
                )}

                {groverResult && (
                  <>
                    {/* Active Stage Probability Breakdown Card */}
                    <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-soft-sand">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-olive-mist tracking-widest block">Active Stage</span>
                          <h3 className="text-sm font-bold text-black-olive font-serif">
                            {groverResult.stages[groverStageIdx].name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive font-bold">
                          Target |{groverResult.target_state}⟩: {(groverResult.stages[groverStageIdx].target_prob * 100).toFixed(1)}%
                        </span>
                      </div>

                      <p className="text-xs text-black-olive/80 leading-relaxed">
                        {groverResult.stages[groverStageIdx].description}
                      </p>

                      {/* Probabilities at this stage */}
                      <div className="space-y-3 pt-2">
                        {Object.entries(groverResult.stages[groverStageIdx].probabilities).map(([basis, prob]) => {
                          const isTarget = basis === `|${groverResult.target_state}⟩`;
                          return (
                            <div key={basis} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className={isTarget ? 'text-black-olive font-bold flex items-center gap-1.5' : 'text-black-olive/70'}>
                                  {basis} {isTarget && (
                                    <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-warm-gold text-deep-slate shadow-sm">
                                      Target
                                    </span>
                                  )}
                                </span>
                                <span className={isTarget ? 'text-black-olive font-bold' : 'text-olive-mist'}>
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-3.5 bg-warm-ivory border border-soft-sand rounded-full overflow-hidden p-0.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isTarget
                                      ? 'bg-warm-gold shadow-sm'
                                      : 'bg-black-olive/30'
                                  }`}
                                  style={{ width: `${Math.max(prob * 100, 2)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation between stages */}
                      <div className="flex justify-between items-center pt-3 text-xs border-t border-soft-sand">
                        <button
                          onClick={() => setGroverStageIdx(Math.max(0, groverStageIdx - 1))}
                          disabled={groverStageIdx === 0}
                          className="px-4 py-2 rounded-xl bg-warm-ivory text-black-olive border border-soft-sand hover:bg-soft-sand disabled:opacity-30 disabled:pointer-events-none transition-all font-medium shadow-sm"
                        >
                          &larr; Previous Stage
                        </button>
                        <span className="text-olive-mist text-[11px] font-mono">
                          Stage {groverStageIdx + 1} of {groverResult.stages.length}
                        </span>
                        <button
                          onClick={() => setGroverStageIdx(Math.min(groverResult.stages.length - 1, groverStageIdx + 1))}
                          disabled={groverStageIdx === groverResult.stages.length - 1}
                          className="px-4 py-2 rounded-xl bg-warm-ivory text-black-olive border border-soft-sand hover:bg-soft-sand disabled:opacity-30 disabled:pointer-events-none transition-all font-medium shadow-sm"
                        >
                          Next Stage &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Final Measurement Histogram */}
                    <MeasurementHistogramWidget
                      measurementCounts={groverResult.measurement_counts}
                      probabilities={groverResult.final_probabilities}
                      shots={groverResult.shots}
                    />

                    {/* Explanation Summary (Cocoa Noir Dark Card) */}
                    <div className="p-5 rounded-2xl bg-cocoa-noir text-warm-ivory border border-cocoa-noir/40 shadow-md text-xs leading-relaxed">
                      <span className="font-bold text-warm-gold block mb-1">Theoretical Takeaway:</span>
                      {groverResult.explanation}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Floating Context-Aware AI Tutor Drawer */}
      <AITutorPanel
        compact
        context={{
          page: 'Algorithm Lab',
          algorithm_context: {
            algorithm: activeAlgorithm === 'deutsch' ? 'Deutsch-Jozsa' : "Grover's Search",
            oracle_id: selectedOracle,
            target_state: selectedTarget,
            oracle_type: djResult?.oracle_type,
          }
        }}
      />
    </div>
  );
};

export default AlgorithmLab;
