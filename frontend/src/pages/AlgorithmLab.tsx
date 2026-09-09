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

  // Run Deutsch-Jozsa
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

  // Run Grover
  const handleRunGrover = async () => {
    setGroverLoading(true);
    setGroverError(null);
    try {
      const res = await runGrover(selectedTarget);
      setGroverResult(res);
      setGroverStageIdx(res.stages.length - 1); // jump to final stage or let user explore
    } catch (err) {
      setGroverError(err instanceof Error ? err.message : 'Grover execution failed');
    } finally {
      setGroverLoading(false);
    }
  };

  // Run on mount or tab change
  useEffect(() => {
    if (activeAlgorithm === 'deutsch' && !djResult) {
      handleRunDJ();
    } else if (activeAlgorithm === 'grover' && !groverResult) {
      handleRunGrover();
    }
  }, [activeAlgorithm]);

  return (
    <div className="min-h-screen quantum-grid-bg text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Quantum Algorithm Lab</h1>
                <p className="text-xs text-slate-400">Interactive walkthroughs of quantum speedup and interference algorithms</p>
              </div>
            </div>
          </div>

          {/* Algorithm Toggle */}
          <div className="flex bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveAlgorithm('deutsch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeAlgorithm === 'deutsch'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Deutsch-Jozsa
            </button>
            <button
              onClick={() => setActiveAlgorithm('grover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeAlgorithm === 'grover'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Grover's Search
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALGORITHM 1: DEUTSCH-JOZSA */}
        {/* ========================================================================= */}
        {activeAlgorithm === 'deutsch' && (
          <div className="space-y-8">
            
            {/* Plain Language Walkthrough Banner */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" /> The Deutsch-Jozsa Problem
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Quantum Advantage: O(1) vs O(2ⁿ⁻¹)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    1. The Question
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Given a black-box function (oracle) that returns either 0 or 1, is it <strong>constant</strong> (returns the same output for all inputs) or <strong>balanced</strong> (returns 0 for half, 1 for half)?
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    2. Classical Limitation
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    A classical computer must query the oracle sequentially. In the worst case, checking 2 inputs is not enough: for n=2 inputs (4 states), you must test at least <strong>3 inputs (2ⁿ⁻¹ + 1)</strong> to be certain.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-teal-300 flex items-center gap-1.5">
                    3. Quantum Solution
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    By feeding an equal superposition of all inputs through the oracle with an ancilla in |−⟩, <strong>phase kickback</strong> imprints the function into quantum phases. Interference reveals the answer in <strong>exactly 1 query</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Control & Circuit Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Oracle Picker & Controls */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Preset Oracle</h3>
                  <div className="space-y-2.5">
                    {DEUTSCH_PRESETS.map((oracle) => (
                      <button
                        key={oracle.id}
                        onClick={() => setSelectedOracle(oracle.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedOracle === oracle.id
                            ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-200">{oracle.name}</span>
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                            oracle.type === 'constant'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          }`}>
                            {oracle.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{oracle.desc}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunDJ}
                    disabled={djLoading}
                    className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 font-semibold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {djLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Deutsch-Jozsa Circuit
                  </button>
                </div>

                {/* Circuit Schematic Card */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Circuit Architecture</h3>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                    <div>q[0]: |0⟩ ──[H]──[   ]──[H]── [Measure]</div>
                    <div>q[1]: |0⟩ ──[H]──[ Uf]──[H]── [Measure]</div>
                    <div>q[2]: |1⟩ ──[H]──[   ]──────── (Ancilla)</div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Input qubits q[0], q[1] start at |0⟩; ancilla q[2] is prepared in |1⟩ then Hadamard-transformed to |−⟩ for phase kickback.
                  </p>
                </div>
              </div>

              {/* Right Column: Execution Results & Conclusion */}
              <div className="lg:col-span-8 space-y-6">
                
                {djError && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {djError}
                  </div>
                )}

                {djResult && (
                  <>
                    {/* Scientific Conclusion Card */}
                    <div className={`p-6 rounded-2xl border ${
                      djResult.is_constant 
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200' 
                        : 'bg-teal-950/20 border-teal-800/60 text-teal-200'
                    } space-y-3 shadow-xl`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5" /> 
                          Oracle Verdict: {djResult.oracle_type.toUpperCase()}
                        </div>
                        <span className="text-xs font-mono bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                          1 Quantum Query
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {djResult.conclusion}
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono border-t border-slate-800/60">
                        <div>
                          <span className="text-slate-500 block">Measured State:</span>
                          <span className="font-bold text-white">
                            {djResult.is_constant ? '|00⟩' : Object.keys(djResult.input_probabilities).find(k => k !== '|00⟩' && djResult.input_probabilities[k] > 0.01)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Interference Rule:</span>
                          <span>{djResult.is_constant ? 'Constructive on |00⟩' : 'Destructive on |00⟩ (P=0)'}</span>
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
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                  <Search className="w-4 h-4" /> Grover's Quantum Search
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Speedup: O(√N) via Amplitude Amplification
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    1. The Search Problem
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Search through an unstructured database of N=4 items for one specific target. Classically, you must test items one-by-one (average 2–3 tries, worst case 4).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    2. Important Nuance
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Quantum search is <strong>not instant</strong>. It does not magically check all items at once; rather, it performs geometric rotations in state space to iteratively boost the target's probability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="font-bold text-teal-300 flex items-center gap-1.5">
                    3. Amplitude Amplification
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    A two-step cycle: the <strong>Oracle</strong> flips the marked item's phase, then the <strong>Diffusion Operator</strong> reflects all amplitudes across their average, concentrating probability onto the target.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Selection & Stage Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Target Selector */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Choose Marked Item to Find</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {GROVER_TARGETS.map((target) => (
                      <button
                        key={target}
                        onClick={() => setSelectedTarget(target)}
                        className={`p-4 rounded-xl border text-center font-mono font-bold transition-all ${
                          selectedTarget === target
                            ? 'bg-teal-950/60 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-base">|{target}⟩</div>
                        <span className="text-[10px] text-slate-500 font-sans font-normal">Target Key</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunGrover}
                    disabled={groverLoading}
                    className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-400 font-semibold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {groverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Grover's Algorithm
                  </button>
                </div>

                {/* Staged Reveal Stepper Pills */}
                {groverResult && (
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step-by-Step Evolution</h3>
                    <div className="space-y-1.5">
                      {groverResult.stages.map((stage, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGroverStageIdx(idx)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            groverStageIdx === idx
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                              : 'text-slate-400 hover:bg-slate-800/40 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono">
                              {idx + 1}
                            </span>
                            <span className="truncate max-w-[190px]">{stage.name.split('.')[1] || stage.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-teal-400">
                            {(stage.target_prob * 100).toFixed(0)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Stage Inspection & Measurements */}
              <div className="lg:col-span-8 space-y-6">
                {groverError && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {groverError}
                  </div>
                )}

                {groverResult && (
                  <>
                    {/* Active Stage Probability Breakdown Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">Active Stage</span>
                          <h3 className="text-sm font-bold text-white">
                            {groverResult.stages[groverStageIdx].name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-teal-300">
                          Target |{groverResult.target_state}⟩ Prob: {(groverResult.stages[groverStageIdx].target_prob * 100).toFixed(1)}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {groverResult.stages[groverStageIdx].description}
                      </p>

                      {/* Probabilities at this stage */}
                      <div className="space-y-3 pt-2">
                        {Object.entries(groverResult.stages[groverStageIdx].probabilities).map(([basis, prob]) => {
                          const isTarget = basis === `|${groverResult.target_state}⟩`;
                          return (
                            <div key={basis} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className={isTarget ? 'text-teal-300 font-bold flex items-center gap-1.5' : 'text-slate-400'}>
                                  {basis} {isTarget && <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Target</span>}
                                </span>
                                <span className={isTarget ? 'text-teal-300 font-bold' : 'text-slate-400'}>
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-3 bg-slate-800/80 rounded-md overflow-hidden">
                                <div
                                  className={`h-full rounded-md transition-all duration-500 ${
                                    isTarget
                                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_12px_rgba(20,184,166,0.5)]'
                                      : 'bg-slate-700'
                                  }`}
                                  style={{ width: `${Math.max(prob * 100, 1)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation between stages */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
                        <button
                          onClick={() => setGroverStageIdx(Math.max(0, groverStageIdx - 1))}
                          disabled={groverStageIdx === 0}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          &larr; Previous Stage
                        </button>
                        <span className="text-slate-500 text-[11px] font-mono">
                          Stage {groverStageIdx + 1} of {groverResult.stages.length}
                        </span>
                        <button
                          onClick={() => setGroverStageIdx(Math.min(groverResult.stages.length - 1, groverStageIdx + 1))}
                          disabled={groverStageIdx === groverResult.stages.length - 1}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

                    {/* Explanation Summary */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-white block mb-1">Theoretical Takeaway:</span>
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
