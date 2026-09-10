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
          <div className="space-y-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-floral-white text-xs font-semibold text-slate-gray shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">Quantum Algorithm Lab</h1>
                <p className="text-xs text-black-olive/70">Interactive walkthroughs of quantum speedup and interference algorithms</p>
              </div>
            </div>
          </div>

          {/* Algorithm Toggle (Neumorphic Segmented Control) */}
          <div className="flex bg-floral-white p-1.5 rounded-2xl shadow-neu-pressed self-start md:self-auto">
            <button
              onClick={() => setActiveAlgorithm('deutsch')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAlgorithm === 'deutsch'
                  ? 'bg-slate-gray text-floral-white shadow-neu-raised'
                  : 'text-black-olive/70 hover:text-black-olive'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Deutsch-Jozsa
            </button>
            <button
              onClick={() => setActiveAlgorithm('grover')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAlgorithm === 'grover'
                  ? 'bg-slate-gray text-floral-white shadow-neu-raised'
                  : 'text-black-olive/70 hover:text-black-olive'
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
            <div className="bg-floral-white rounded-3xl p-6 sm:p-8 shadow-neu-raised space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-gray font-bold text-sm">
                  <Sparkles className="w-4 h-4" /> The Deutsch-Jozsa Problem
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-floral-white shadow-neu-sm-raised text-slate-gray font-semibold">
                  Quantum Advantage: O(1) vs O(2ⁿ⁻¹)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-black-olive block text-xs">
                    1. The Problem
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    Given a black-box function (oracle) f(x) that returns 0 or 1, determine if it is <strong>constant</strong> (same output for all inputs) or <strong>balanced</strong> (returns 0 for half, 1 for half).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-black-olive block text-xs">
                    2. Classical Limitation
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    A classical algorithm must evaluate inputs one by one. In the worst case for n=2 inputs (4 values), a classical computer must test <strong>3 inputs (2ⁿ⁻¹ + 1)</strong> to be certain.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-slate-gray block text-xs">
                    3. Quantum Speedup
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    By preparing all inputs in superposition with an ancilla in |−⟩, <strong>phase kickback</strong> embeds the answer into relative phases. Interference reveals the verdict in <strong>exactly 1 query</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Control & Circuit Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Oracle Picker & Controls */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-4">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">Select Preset Oracle</h3>
                  <div className="space-y-3">
                    {DEUTSCH_PRESETS.map((oracle) => (
                      <button
                        key={oracle.id}
                        onClick={() => setSelectedOracle(oracle.id)}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${
                          selectedOracle === oracle.id
                            ? 'bg-floral-white shadow-neu-pressed border border-slate-gray/40'
                            : 'bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-black-olive">{oracle.name}</span>
                          <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-lg bg-floral-white shadow-neu-sm-raised text-slate-gray font-bold">
                            {oracle.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-black-olive/70 leading-relaxed">{oracle.desc}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunDJ}
                    disabled={djLoading}
                    className="w-full mt-3 py-3.5 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {djLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Deutsch-Jozsa Circuit (1 Query)
                  </button>
                </div>

                {/* Circuit Schematic Card */}
                <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-3">
                  <h3 className="text-xs font-bold text-black-olive/70 uppercase tracking-wider">Circuit Architecture</h3>
                  <div className="p-4 bg-floral-white shadow-neu-pressed rounded-2xl font-mono text-xs text-black-olive space-y-2">
                    <div>q[0]: |0⟩ ──[H]──[   ]──[H]── [Measure]</div>
                    <div>q[1]: |0⟩ ──[H]──[ Uf]──[H]── [Measure]</div>
                    <div>q[2]: |1⟩ ──[H]──[   ]──────── (Ancilla |−⟩)</div>
                  </div>
                  <p className="text-[11px] text-black-olive/70 leading-relaxed">
                    Input qubits q[0], q[1] start at |0⟩; ancilla q[2] is prepared in |1⟩ then Hadamard-transformed to |−⟩ for phase kickback.
                  </p>
                </div>
              </div>

              {/* Right Column: Execution Results & Conclusion */}
              <div className="lg:col-span-7 space-y-6">
                
                {djError && (
                  <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed text-slate-gray text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {djError}
                  </div>
                )}

                {djResult && (
                  <>
                    {/* Scientific Conclusion Card */}
                    <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-gray">
                          <CheckCircle2 className="w-5 h-5 text-slate-gray" /> 
                          Oracle Verdict: {djResult.oracle_type.toUpperCase()}
                        </div>
                        <span className="text-xs font-mono font-semibold bg-floral-white shadow-neu-sm-raised text-black-olive px-3 py-1 rounded-xl">
                          1 Quantum Query
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-black-olive/80">
                        {djResult.conclusion}
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                        <div className="p-3 rounded-xl bg-floral-white shadow-neu-pressed">
                          <span className="text-black-olive/60 block text-[10px]">Measured State:</span>
                          <span className="font-bold text-slate-gray text-xs">
                            {djResult.is_constant ? '|00⟩' : Object.keys(djResult.input_probabilities).find(k => k !== '|00⟩' && djResult.input_probabilities[k] > 0.01)}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-floral-white shadow-neu-pressed">
                          <span className="text-black-olive/60 block text-[10px]">Interference Rule:</span>
                          <span className="font-semibold text-black-olive text-xs">
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
            <div className="bg-floral-white rounded-3xl p-6 sm:p-8 shadow-neu-raised space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-gray font-bold text-sm">
                  <Search className="w-4 h-4" /> Grover's Quantum Search
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-floral-white shadow-neu-sm-raised text-slate-gray font-semibold">
                  Speedup: O(√N) via Amplitude Amplification
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-black-olive block text-xs">
                    1. The Search Problem
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    Search an unstructured database of N=4 items for one specific target. Classically, you must test items sequentially (average 2–3 tries, worst case 4).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-black-olive block text-xs">
                    2. Important Nuance
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    Quantum search is <strong>not instantaneous</strong>. It rotates the statevector geometrically in Hilbert space to systematically amplify the target's amplitude.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-1.5">
                  <span className="font-bold text-slate-gray block text-xs">
                    3. Amplitude Amplification
                  </span>
                  <p className="text-black-olive/70 leading-relaxed">
                    The <strong>Oracle</strong> flips the target's phase (+ to −). Then the <strong>Diffusion Operator</strong> reflects all amplitudes across their average, amplifying the target to ~100%!
                  </p>
                </div>
              </div>
            </div>

            {/* Target Selection & Stage Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Target Selector & Step Indicators */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-4">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">Choose Marked Item to Find</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {GROVER_TARGETS.map((target) => (
                      <button
                        key={target}
                        onClick={() => setSelectedTarget(target)}
                        className={`p-4 rounded-2xl text-center font-mono font-bold transition-all ${
                          selectedTarget === target
                            ? 'bg-floral-white shadow-neu-pressed text-slate-gray border border-slate-gray/40'
                            : 'bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-black-olive/70'
                        }`}
                      >
                        <div className="text-lg">|{target}⟩</div>
                        <span className="text-[10px] text-black-olive/60 font-sans font-normal">Target Key</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunGrover}
                    disabled={groverLoading}
                    className="w-full mt-3 py-3.5 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {groverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Run Grover's Algorithm
                  </button>
                </div>

                {/* Staged Reveal Stepper Pills */}
                {groverResult && (
                  <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-3">
                    <h3 className="text-xs font-bold text-black-olive/70 uppercase tracking-wider">Step-by-Step Evolution</h3>
                    <div className="space-y-2">
                      {groverResult.stages.map((stage, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGroverStageIdx(idx)}
                          className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between ${
                            groverStageIdx === idx
                              ? 'bg-floral-white shadow-neu-pressed text-slate-gray'
                              : 'bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-black-olive/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                              groverStageIdx === idx ? 'bg-slate-gray text-floral-white' : 'bg-black-olive/10 text-black-olive'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="truncate max-w-[190px]">{stage.name.split('.')[1] || stage.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-gray font-bold">
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
                  <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed text-slate-gray text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {groverError}
                  </div>
                )}

                {groverResult && (
                  <>
                    {/* Active Stage Probability Breakdown Card */}
                    <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-black-olive/10">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-black-olive/60 tracking-widest block">Active Stage</span>
                          <h3 className="text-sm font-bold text-black-olive">
                            {groverResult.stages[groverStageIdx].name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-floral-white shadow-neu-sm-raised text-slate-gray font-bold">
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
                                <span className={isTarget ? 'text-slate-gray font-bold flex items-center gap-1.5' : 'text-black-olive/70'}>
                                  {basis} {isTarget && (
                                    <span className="text-[9px] font-sans font-semibold px-2 py-0.5 rounded-md bg-slate-gray text-floral-white shadow-neu-sm-raised">
                                      Target
                                    </span>
                                  )}
                                </span>
                                <span className={isTarget ? 'text-slate-gray font-bold' : 'text-black-olive/70'}>
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-3.5 bg-floral-white shadow-neu-pressed rounded-full overflow-hidden p-0.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isTarget
                                      ? 'bg-slate-gray shadow-neu-sm-raised'
                                      : 'bg-black-olive/40'
                                  }`}
                                  style={{ width: `${Math.max(prob * 100, 2)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation between stages */}
                      <div className="flex justify-between items-center pt-3 text-xs border-t border-black-olive/10">
                        <button
                          onClick={() => setGroverStageIdx(Math.max(0, groverStageIdx - 1))}
                          disabled={groverStageIdx === 0}
                          className="px-4 py-2 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed disabled:opacity-30 disabled:pointer-events-none transition-all font-medium"
                        >
                          &larr; Previous Stage
                        </button>
                        <span className="text-black-olive/70 text-[11px] font-mono">
                          Stage {groverStageIdx + 1} of {groverResult.stages.length}
                        </span>
                        <button
                          onClick={() => setGroverStageIdx(Math.min(groverResult.stages.length - 1, groverStageIdx + 1))}
                          disabled={groverStageIdx === groverResult.stages.length - 1}
                          className="px-4 py-2 rounded-xl bg-floral-white text-black-olive shadow-neu-sm-raised hover:shadow-neu-sm-pressed disabled:opacity-30 disabled:pointer-events-none transition-all font-medium"
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
                    <div className="p-5 rounded-2xl bg-floral-white shadow-neu-pressed text-xs text-black-olive/80 leading-relaxed">
                      <span className="font-bold text-black-olive block mb-1">Theoretical Takeaway:</span>
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
