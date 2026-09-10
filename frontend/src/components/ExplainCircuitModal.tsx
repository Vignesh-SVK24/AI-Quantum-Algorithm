import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Split 
} from 'lucide-react';
import { 
  explainCircuit, 
  type SimulateGate, 
  type CircuitExplanationResponse 
} from '../services/api';

interface ExplainCircuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuit: SimulateGate[];
  numQubits: number;
  simulationResult?: any;
  algorithmName?: string;
  onAskTutor?: (question: string) => void;
  onHighlightStep?: (step: number) => void;
}

export const ExplainCircuitModal: React.FC<ExplainCircuitModalProps> = ({
  isOpen,
  onClose,
  circuit,
  numQubits,
  simulationResult,
  algorithmName,
  onAskTutor,
  onHighlightStep
}) => {
  const [mode, setMode] = useState<'simple' | 'detailed'>('simple');
  const [loading, setLoading] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<CircuitExplanationResponse | null>(null);
  const [selectedGateStep, setSelectedGateStep] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    explainCircuit({
      circuit,
      num_qubits: numQubits,
      simulation_result: simulationResult,
      mode,
      algorithm_name: algorithmName
    })
      .then(res => {
        if (isMounted) {
          setExplanation(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching circuit explanation:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, circuit, numQubits, simulationResult, mode, algorithmName]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStepClick = (stepNum: number) => {
    setSelectedGateStep(prev => (prev === stepNum ? null : stepNum));
    if (onHighlightStep) {
      onHighlightStep(stepNum);
    }
  };

  const handleAskTutor = () => {
    const query = algorithmName 
      ? `Explain why the ${algorithmName} circuit uses these specific gates and how the quantum state evolves.`
      : `Explain what this ${numQubits}-qubit circuit does step by step and why the measured probabilities appear as they do.`;
    if (onAskTutor) {
      onAskTutor(query);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#202C3D] text-[#FAF7EE] rounded-2xl border border-[#C5A86A]/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#31372B]/60 bg-[#1A2433]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#C5A86A]/15 text-[#C5A86A] border border-[#C5A86A]/30 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-[#FAF7EE]">
                  Explain This Circuit
                </h2>
                {algorithmName && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#C5A86A]/20 text-[#C5A86A] border border-[#C5A86A]/40">
                    {algorithmName}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#FAF7EE]/60 mt-0.5">
                Scientific circuit breakdown, gate interactions, and quantum state evolution
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Simple / Detailed Mode Toggle */}
            <div className="flex items-center bg-[#151D29] p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMode('simple')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mode === 'simple'
                    ? 'bg-[#C5A86A] text-[#151D29] shadow-sm font-semibold'
                    : 'text-[#FAF7EE]/70 hover:text-[#FAF7EE]'
                }`}
              >
                Beginner
              </button>
              <button
                type="button"
                onClick={() => setMode('detailed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mode === 'detailed'
                    ? 'bg-[#C5A86A] text-[#151D29] shadow-sm font-semibold'
                    : 'text-[#FAF7EE]/70 hover:text-[#FAF7EE]'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#FAF7EE]/60 hover:text-[#FAF7EE] hover:bg-white/10 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#C5A86A]/20 border-t-[#C5A86A] rounded-full animate-spin" />
              <p className="text-sm font-medium text-[#FAF7EE]/70">
                Analyzing circuit gates, entanglement correlations, and quantum state amplitudes...
              </p>
            </div>
          ) : explanation ? (
            <>
              {/* Circuit High-Level Summary Card */}
              <div className="p-4 rounded-xl bg-[#1A2433] border border-[#C5A86A]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-[#C5A86A] font-bold">
                    Circuit Overview
                  </div>
                  <p className="text-sm text-[#FAF7EE]/90 leading-relaxed">
                    {explanation.circuit_overview}
                  </p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="px-3 py-2 rounded-lg bg-[#151D29] border border-white/5 text-center">
                    <div className="text-xs text-[#FAF7EE]/50 font-mono">Qubits</div>
                    <div className="text-base font-bold text-[#C5A86A]">{numQubits}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#151D29] border border-white/5 text-center">
                    <div className="text-xs text-[#FAF7EE]/50 font-mono">Gates</div>
                    <div className="text-base font-bold text-[#C5A86A]">{circuit.length}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#151D29] border border-white/5 text-center">
                    <div className="text-xs text-[#FAF7EE]/50 font-mono">Depth</div>
                    <div className="text-base font-bold text-[#C5A86A]">
                      {circuit.length > 0 ? Math.max(...circuit.map(g => g.step || 1)) : 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Observations (e.g. H^2=I cancellations, Entanglement) */}
              {explanation.circuit_observations && explanation.circuit_observations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7EE]/70 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#C5A86A]" />
                    <span>Structural Insights & Diagnostics</span>
                  </h3>
                  <div className="space-y-2">
                    {explanation.circuit_observations.map((obs, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-start space-x-3 leading-relaxed ${
                          obs.type === 'tip'
                            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200/90'
                            : obs.type === 'warning'
                            ? 'bg-rose-950/30 border-rose-500/30 text-rose-200/90'
                            : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200/90'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {obs.type === 'tip' ? (
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                          ) : obs.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Split className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold uppercase tracking-wider text-[10px] mr-1.5 px-1.5 py-0.5 rounded bg-white/10">
                            {obs.type}
                          </span>
                          {obs.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gate-by-Gate Chronological Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7EE]/70 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C5A86A]" />
                    <span>Chronological Gate Flow ({explanation.gate_explanations.length} Steps)</span>
                  </h3>
                  <span className="text-[11px] text-[#FAF7EE]/40 italic">
                    Click any step to inspect details
                  </span>
                </div>

                <div className="space-y-2">
                  {explanation.gate_explanations.map((step) => {
                    const isSelected = selectedGateStep === step.step;
                    const isTwoQubit = step.control !== null && step.control !== undefined;

                    return (
                      <div
                        key={step.step}
                        onClick={() => handleStepClick(step.step)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#28374D] border-[#C5A86A] shadow-md'
                            : 'bg-[#182230] border-white/5 hover:border-white/15 hover:bg-[#1E2B3D]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 rounded-full bg-[#121924] border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-[#C5A86A]">
                              {step.step}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-[#C5A86A]/20 text-[#C5A86A] border border-[#C5A86A]/30">
                                {step.gate}
                              </span>
                              <span className="text-xs text-[#FAF7EE]/80 font-mono">
                                {isTwoQubit ? (
                                  <>
                                    <span className="text-amber-300">ctrl q[{step.control}]</span>
                                    {' → '}
                                    <span className="text-emerald-300">tgt q[{step.target}]</span>
                                  </>
                                ) : (
                                  <span className="text-emerald-300">q[{step.target}]</span>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-[#FAF7EE]/50">
                            {isSelected ? 'Collapse' : 'Expand'}
                          </div>
                        </div>

                        {/* Gate Description */}
                        <p className="text-xs text-[#FAF7EE]/85 mt-2 leading-relaxed">
                          {step.purpose}
                        </p>

                        {/* Mathematical Transformation Details */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs animate-in fade-in duration-150">
                            <div className="p-2.5 rounded-lg bg-[#121924] border border-white/5 font-mono text-emerald-300/90 leading-relaxed">
                              <span className="text-xs text-[#FAF7EE]/40 uppercase tracking-wider block mb-1 font-sans">
                                Mathematical Operation
                              </span>
                              {step.transformation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Result Analysis */}
              <div className="p-4 rounded-xl bg-[#1A2433] border border-[#C5A86A]/20 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A86A] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C5A86A]" />
                  <span>State Evolution & Simulation Interpretation</span>
                </h3>
                <p className="text-xs text-[#FAF7EE]/90 leading-relaxed font-sans">
                  {explanation.simulation_analysis}
                </p>
              </div>

              {/* Key Scientific Concepts */}
              {explanation.key_concepts && explanation.key_concepts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7EE]/70 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A86A]" />
                    <span>Relevant Principles</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {explanation.key_concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#C5A86A]/10 text-[#C5A86A] border border-[#C5A86A]/30"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Sources & Grounding */}
              {explanation.sources && explanation.sources.length > 0 && (
                <div className="pt-2 border-t border-[#31372B]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#FAF7EE]/50">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Grounded in:</span>
                    {explanation.sources.map((s, i) => (
                      <span key={i} className="text-[#FAF7EE]/70 font-medium underline decoration-dotted">
                        {s.name}
                        {i < explanation.sources.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                  {explanation.is_ai_generated && (
                    <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px]">
                      Gemini 2.5 Flash Grounded
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-sm text-[#FAF7EE]/60">
              No circuit data available to analyze. Add gates to your circuit canvas to see explanations.
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#31372B]/60 bg-[#1A2433]/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAskTutor}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2A374A] hover:bg-[#34465F] text-[#FAF7EE] border border-white/10 transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-[#C5A86A]" />
            <span>Ask AI Tutor About This Circuit</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#C5A86A] hover:bg-[#D4B779] text-[#151D29] shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
