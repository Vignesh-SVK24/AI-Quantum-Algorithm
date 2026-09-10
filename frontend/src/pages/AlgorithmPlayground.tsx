import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  BookOpen, 
  Sliders, 
  Trash2, 
  MousePointer2, 
  Eraser, 
  Split, 
  BarChart3 
} from 'lucide-react';
import { 
  PLAYGROUND_ALGORITHMS, 
  type PlaygroundAlgorithm, 
  type PlaygroundStep, 
  type PlaygroundGate 
} from '../data/playgroundAlgorithmsData';
import { 
  simulateCircuit, 
  type SimulateResponse 
} from '../services/api';
import { MeasurementHistogramWidget } from '../components/MeasurementHistogramWidget';
import { BlochSphereWidget } from '../components/BlochSphereWidget';
import { AITutorPanel } from '../components/AITutorPanel';
import { ExplainCircuitModal } from '../components/ExplainCircuitModal';

const GATE_PALETTE = ['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'CZ', 'SWAP'] as const;
type PaletteGate = typeof GATE_PALETTE[number];

export const AlgorithmPlayground: React.FC = () => {
  // 1. Algorithm Selection State
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('deutsch');

  const activeAlgo: PlaygroundAlgorithm = useMemo(() => {
    return PLAYGROUND_ALGORITHMS.find(a => a.id === selectedAlgoId) || PLAYGROUND_ALGORITHMS[0];
  }, [selectedAlgoId]);

  // 2. Circuit & Execution State
  const [circuit, setCircuit] = useState<PlaygroundGate[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<any>(null);

  // 3. Experiment / Editing Mode State
  const [isExperimentMode, setIsExperimentMode] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<PaletteGate | 'CURSOR' | 'ERASER'>('CURSOR');
  const [pendingTwoQubit, setPendingTwoQubit] = useState<{ control: number; step: number; type: PaletteGate } | null>(null);

  // 4. Simulation & Telemetry State
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simError, setSimError] = useState<string | null>(null);

  // 5. Modals & Tutor State
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);

  // Filtered algorithms list
  const filteredAlgorithms = useMemo(() => {
    if (selectedCategory === 'All') return PLAYGROUND_ALGORITHMS;
    return PLAYGROUND_ALGORITHMS.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  // Load preset circuit when active algorithm changes
  useEffect(() => {
    setCircuit([...activeAlgo.initialGates]);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setPendingTwoQubit(null);
  }, [activeAlgo]);

  // Run simulation whenever circuit changes
  useEffect(() => {
    let isCurrent = true;
    if (circuit.length === 0) {
      setSimResult(null);
      return;
    }

    setSimLoading(true);
    setSimError(null);

    simulateCircuit({
      gates: circuit.map(g => ({
        id: g.id,
        type: g.type,
        target: g.target,
        step: g.step,
        control: g.control ?? undefined
      })),
      num_qubits: activeAlgo.numQubits,
      shots: 1024
    })
      .then(res => {
        if (isCurrent) {
          setSimResult(res);
          setSimLoading(false);
        }
      })
      .catch(err => {
        if (isCurrent) {
          setSimError(err instanceof Error ? err.message : 'Simulation failed');
          setSimLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [circuit, activeAlgo.numQubits]);

  // Auto-play stepper timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setActiveStepIndex(prev => {
          if (prev >= activeAlgo.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, activeAlgo.steps.length]);

  const currentStep: PlaygroundStep | undefined = activeAlgo.steps[activeStepIndex];

  // Maximum step count for canvas grid
  const maxStepNumber = useMemo(() => {
    const fromCircuit = circuit.length > 0 ? Math.max(...circuit.map(g => g.step)) : 4;
    return Math.max(fromCircuit, 6);
  }, [circuit]);

  // Reset to original algorithm preset
  const handleResetToPreset = () => {
    setCircuit([...activeAlgo.initialGates]);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setPendingTwoQubit(null);
  };

  // Clear circuit
  const handleClearCircuit = () => {
    setCircuit([]);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setPendingTwoQubit(null);
  };

  // Step navigation
  const handleNextStep = () => {
    if (activeStepIndex < activeAlgo.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  // Canvas click handler for Experiment Mode
  const handleCanvasCellClick = (qubitIndex: number, stepIndex: number) => {
    if (!isExperimentMode) return;

    if (activeTool === 'ERASER') {
      setCircuit(prev => prev.filter(g => g.step !== stepIndex || (g.target !== qubitIndex && g.control !== qubitIndex)));
      return;
    }

    if (activeTool === 'CURSOR') return;

    const isTwoQubit = ['CNOT', 'CZ', 'SWAP'].includes(activeTool);

    if (isTwoQubit) {
      if (pendingTwoQubit) {
        if (pendingTwoQubit.step !== stepIndex || pendingTwoQubit.control === qubitIndex) {
          setPendingTwoQubit(null);
          return;
        }
        // Place two-qubit gate
        const newGate: PlaygroundGate = {
          id: `g-${Date.now()}`,
          type: activeTool,
          control: pendingTwoQubit.control,
          target: qubitIndex,
          step: stepIndex
        };
        setCircuit(prev => [...prev.filter(g => !(g.step === stepIndex && (g.target === qubitIndex || g.control === qubitIndex))), newGate]);
        setPendingTwoQubit(null);
      } else {
        setPendingTwoQubit({ control: qubitIndex, step: stepIndex, type: activeTool });
      }
      return;
    }

    // Single-qubit gate
    const newGate: PlaygroundGate = {
      id: `g-${Date.now()}`,
      type: activeTool,
      target: qubitIndex,
      step: stepIndex,
      control: null
    };

    setCircuit(prev => [
      ...prev.filter(g => !(g.step === stepIndex && g.target === qubitIndex)),
      newGate
    ]);
  };

  // Active highlighted gate IDs for current step
  const activeGateIds = useMemo(() => {
    return new Set(currentStep?.gateIds || []);
  }, [currentStep]);

  // Telemetry computation
  const telemetry = useMemo(() => {
    if (!simResult || !simResult.probabilities) {
      return { dominantState: '|00⟩', dominantProb: 0, stateCount: 0 };
    }
    const entries = Object.entries(simResult.probabilities);
    let topState = '|00⟩';
    let topProb = 0;
    let nonZeroCount = 0;
    for (const [s, p] of entries) {
      if (p > 0.001) nonZeroCount++;
      if (p > topProb) {
        topProb = p;
        topState = s;
      }
    }
    return {
      dominantState: topState,
      dominantProb: topProb,
      stateCount: nonZeroCount
    };
  }, [simResult]);

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#31372B] flex flex-col selection:bg-[#C5A86A]/20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#202C3D] text-[#FAF7EE] border-b border-[#31372B]/50 px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link 
            to="/" 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#FAF7EE]/70 hover:text-[#FAF7EE] transition-colors"
            title="Back to Platform Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#C5A86A]/20 border border-[#C5A86A]/40 text-[#C5A86A]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-serif tracking-tight flex items-center gap-2">
                Quantum Algorithm Playground
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#C5A86A]/20 text-[#C5A86A] border border-[#C5A86A]/30">
                  Interactive Lab
                </span>
              </h1>
              <p className="text-xs text-[#FAF7EE]/60 hidden sm:block">
                Step-by-step execution, dynamic circuit experimentation, and real-time state analysis
              </p>
            </div>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setIsExplainModalOpen(true)}
            disabled={circuit.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C5A86A] hover:bg-[#D4B779] text-[#151D29] shadow-sm transition-all disabled:opacity-50"
            title="Analyze and explain current circuit"
          >
            <Sparkles className="w-4 h-4 text-[#151D29]" />
            <span className="hidden sm:inline">Explain This Circuit</span>
            <span className="sm:hidden">Explain</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ALGORITHM SELECTOR & KNOWLEDGE PANEL */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-[#FFFDF7] border-r border-[#E0D9C8] overflow-y-auto shrink-0 shadow-sm">
          
          {/* Category Filter Pills */}
          <div className="p-3 border-b border-[#E0D9C8] bg-[#FAF7EE]/70">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#31372B]/60 mb-2 px-1">
              Filter Algorithms
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#202C3D] text-[#FAF7EE] shadow-sm font-semibold'
                      : 'bg-white/60 text-[#31372B]/80 hover:bg-white border border-[#E0D9C8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Algorithm List */}
          <div className="p-2 space-y-1.5 max-h-56 lg:max-h-72 overflow-y-auto border-b border-[#E0D9C8]">
            {filteredAlgorithms.map(algo => {
              const isSelected = algo.id === selectedAlgoId;
              const catColor = 
                algo.category === 'Beginner' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                algo.category === 'Intermediate' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#202C3D] text-[#FAF7EE] border-[#C5A86A] shadow-sm'
                      : 'bg-white hover:bg-[#FAF7EE] border-[#E0D9C8] text-[#31372B]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold truncate">
                      {algo.name}
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${
                        isSelected ? 'bg-white/15 text-[#FAF7EE] border-white/20' : catColor
                      }`}>
                        {algo.category}
                      </span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-[#FAF7EE]/60' : 'text-[#31372B]/60'}`}>
                        {algo.numQubits}Q
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C5A86A]' : 'text-[#31372B]/30'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Algorithm Information Dossier */}
          <div className="p-4 space-y-4 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A86A]">
                  Algorithm Profile
                </span>
                <span className="text-[11px] font-mono font-bold text-[#31372B]/60">
                  {activeAlgo.numQubits} Qubits · {activeAlgo.steps.length} Steps
                </span>
              </div>
              <h2 className="text-base font-bold font-serif text-[#202C3D] mt-0.5">
                {activeAlgo.name}
              </h2>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#31372B]/70 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A86A]" /> Problem Statement
              </div>
              <p className="text-xs text-[#31372B]/85 leading-relaxed bg-[#FAF7EE] p-2.5 rounded-xl border border-[#E0D9C8]">
                {activeAlgo.purpose}
              </p>
            </div>

            {/* Speedup */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Quantum Advantage
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed font-sans">
                {activeAlgo.speedup}
              </p>
            </div>

            {/* Classical vs Quantum Comparison */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#31372B]/70 flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-[#C5A86A]" /> Classical vs Quantum Approach
              </div>
              <p className="text-xs text-[#31372B]/85 leading-relaxed bg-[#FAF7EE] p-2.5 rounded-xl border border-[#E0D9C8]">
                {activeAlgo.classicalVsQuantum}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#31372B]/60">
                Core Prerequisites
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeAlgo.prerequisites.map((req, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#202C3D]/5 border border-[#202C3D]/15 text-[#202C3D]"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: INTERACTIVE WORKBENCH & STEP-BY-STEP CONTROLLER */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col bg-[#FAF7EE] min-w-0 overflow-y-auto">
          
          {/* Controls Header: Mode Switcher & Execution Toolbar */}
          <div className="p-3 sm:p-4 bg-[#FFFDF7] border-b border-[#E0D9C8] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            
            {/* Step-by-Step Progress & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="p-2 rounded-xl border border-[#E0D9C8] bg-white hover:bg-[#FAF7EE] disabled:opacity-40 disabled:cursor-not-allowed text-[#31372B] transition-colors"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isPlaying
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-[#202C3D] text-[#FAF7EE] hover:bg-[#2C3D52]'
                  }`}
                  title={isPlaying ? 'Pause auto-play' : 'Auto-play through algorithm steps'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={activeStepIndex >= activeAlgo.steps.length - 1}
                  className="p-2 rounded-xl border border-[#E0D9C8] bg-white hover:bg-[#FAF7EE] disabled:opacity-40 disabled:cursor-not-allowed text-[#31372B] transition-colors"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-mono font-bold text-[#31372B]">
                Step <span className="text-[#C5A86A] text-sm">{activeStepIndex + 1}</span> of {activeAlgo.steps.length}
              </div>
            </div>

            {/* Experiment Mode Toggle & Canvas Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsExperimentMode(!isExperimentMode)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                  isExperimentMode
                    ? 'bg-[#C5A86A] text-[#151D29] border-[#C5A86A] font-bold shadow-sm'
                    : 'bg-white text-[#31372B] border-[#E0D9C8] hover:bg-[#FAF7EE]'
                }`}
                title="Toggle gate editing mode"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isExperimentMode ? 'Editing Active' : 'Experiment Mode'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToPreset}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E0D9C8] text-[#31372B] hover:bg-[#FAF7EE] flex items-center space-x-1 transition-colors"
                title="Reset circuit to canonical algorithm preset"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#31372B]/70" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={handleClearCircuit}
                className="p-2 rounded-xl text-xs bg-white border border-[#E0D9C8] text-[#31372B]/80 hover:text-rose-600 transition-colors"
                title="Clear circuit canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Step Pedagogical Spotlight Banner */}
          {currentStep && (
            <div className="px-4 sm:px-6 py-3.5 bg-[#202C3D] text-[#FAF7EE] border-b border-[#31372B]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#C5A86A] text-[#151D29] text-xs font-mono font-bold flex items-center justify-center">
                    {currentStep.stepNumber}
                  </span>
                  <h3 className="text-sm font-bold text-[#FAF7EE] font-serif">
                    {currentStep.name}
                  </h3>
                </div>
                <p className="text-xs text-[#FAF7EE]/80 leading-relaxed font-sans max-w-2xl">
                  {currentStep.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#151D29] border border-white/10 text-xs text-emerald-300 font-mono shrink-0 sm:max-w-xs">
                <div className="text-[10px] text-[#FAF7EE]/50 uppercase tracking-wider font-sans mb-0.5">
                  Quantum State Evolution
                </div>
                {currentStep.whatHappens}
              </div>
            </div>
          )}

          {/* Experiment Mode Palette (Visible when Experiment Mode is ON) */}
          {isExperimentMode && (
            <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Gate Palette:
                </span>
                <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
                  {GATE_PALETTE.map(gate => (
                    <button
                      key={gate}
                      type="button"
                      onClick={() => { setActiveTool(gate); setPendingTwoQubit(null); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        activeTool === gate
                          ? 'bg-[#202C3D] text-[#FAF7EE] border-[#C5A86A] shadow-sm'
                          : 'bg-white text-[#31372B] border-[#E0D9C8] hover:bg-amber-100/50'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => { setActiveTool('CURSOR'); setPendingTwoQubit(null); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1 ${
                    activeTool === 'CURSOR' ? 'bg-[#202C3D] text-[#FAF7EE]' : 'bg-white border-[#E0D9C8]'
                  }`}
                  title="Select Tool"
                >
                  <MousePointer2 className="w-3.5 h-3.5" />
                  <span>Select</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTool('ERASER'); setPendingTwoQubit(null); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1 ${
                    activeTool === 'ERASER' ? 'bg-[#202C3D] text-[#FAF7EE]' : 'bg-white border-[#E0D9C8]'
                  }`}
                  title="Eraser Tool"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>
              </div>
            </div>
          )}

          {/* Quantum Wire Circuit Canvas */}
          <div className="flex-1 overflow-auto p-6 sm:p-8 flex items-center justify-center bg-radial from-white to-[#FAF7EE]/60 min-h-[300px]">
            <div 
              className="relative p-4 rounded-2xl bg-white/80 border border-[#E0D9C8] shadow-sm"
              style={{ minWidth: `${(maxStepNumber + 1) * 72 + 80}px` }}
            >
              {/* Step indicator columns */}
              <div className="flex ml-16 mb-2 border-b border-[#E0D9C8]/60 pb-1">
                {Array.from({ length: maxStepNumber + 1 }).map((_, s) => {
                  const isCurrentStepCol = currentStep && currentStep.stepNumber === s;
                  return (
                    <div 
                      key={`hdr-${s}`} 
                      className={`w-18 text-center font-mono text-[11px] font-bold ${
                        isCurrentStepCol ? 'text-[#C5A86A]' : 'text-[#31372B]/40'
                      }`}
                    >
                      t_{s}
                    </div>
                  );
                })}
              </div>

              {/* Qubit Wires */}
              <div className="space-y-6">
                {Array.from({ length: activeAlgo.numQubits }).map((_, qIdx) => (
                  <div key={`wire-${qIdx}`} className="relative flex items-center h-14">
                    {/* Wire Header */}
                    <div className="w-16 font-mono text-xs font-bold text-[#202C3D] flex items-center space-x-1.5 shrink-0">
                      <span className="text-emerald-700 font-extrabold">|0⟩</span>
                      <span className="text-[11px] text-[#31372B]/50 font-sans">q[{qIdx}]</span>
                    </div>

                    {/* Wire horizontal line */}
                    <div className="flex-1 h-0.5 bg-[#31372B]/30 rounded-full relative">
                      {/* Step Cells */}
                      <div className="absolute inset-0 flex -top-6 -bottom-6">
                        {Array.from({ length: maxStepNumber + 1 }).map((_, sIdx) => {
                          const gateOnCell = circuit.find(g => g.step === sIdx && (g.target === qIdx || g.control === qIdx));
                          const isTarget = gateOnCell?.target === qIdx;
                          const isControl = gateOnCell?.control === qIdx;
                          const isHighlighted = gateOnCell && activeGateIds.has(gateOnCell.id);
                          const isPendingCtrl = pendingTwoQubit?.step === sIdx && pendingTwoQubit?.control === qIdx;

                          return (
                            <div
                              key={`cell-${qIdx}-${sIdx}`}
                              onClick={() => handleCanvasCellClick(qIdx, sIdx)}
                              className={`w-18 h-full flex items-center justify-center relative cursor-pointer group transition-all ${
                                isExperimentMode ? 'hover:bg-amber-100/40' : ''
                              }`}
                            >
                              {/* Pending control ping */}
                              {isPendingCtrl && (
                                <div className="w-4 h-4 rounded-full bg-amber-500 animate-ping z-30" />
                              )}

                              {/* Gate Rendering */}
                              {gateOnCell && (
                                <div
                                  className={`z-20 flex items-center justify-center transition-all ${
                                    isHighlighted
                                      ? 'ring-4 ring-[#C5A86A] scale-110 shadow-lg'
                                      : 'shadow-sm'
                                  }`}
                                >
                                  {isControl ? (
                                    /* Control bullet */
                                    <div className="w-4 h-4 rounded-full bg-[#202C3D] border-2 border-white flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A86A]" />
                                    </div>
                                  ) : isTarget && gateOnCell.control !== null && gateOnCell.control !== undefined ? (
                                    /* Target circle with cross */
                                    <div className="w-8 h-8 rounded-full bg-[#202C3D] text-[#FAF7EE] border-2 border-[#C5A86A] flex items-center justify-center font-bold text-xs">
                                      ⊕
                                    </div>
                                  ) : (
                                    /* Standard Gate Chip */
                                    <div className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                                      isHighlighted
                                        ? 'bg-[#202C3D] text-[#FAF7EE] border-[#C5A86A]'
                                        : 'bg-white text-[#202C3D] border-[#E0D9C8] hover:border-[#202C3D]'
                                    }`}>
                                      {gateOnCell.type}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM TELEMETRY DOCK: REAL-TIME SIMULATION & RESULTS */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF7] border-t border-[#E0D9C8] p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#C5A86A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#31372B]">
                  Simulation Telemetry & Probabilities
                </h3>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-[#31372B]/60">
                  Most Likely State:
                </span>
                <span className="font-mono font-bold text-[#202C3D] px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                  {telemetry.dominantState} ({(telemetry.dominantProb * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {simLoading ? (
              <div className="py-6 flex items-center justify-center space-x-2 text-xs text-[#31372B]/60">
                <div className="w-4 h-4 border-2 border-[#C5A86A] border-t-transparent rounded-full animate-spin" />
                <span>Simulating quantum statevector and measurement collapse...</span>
              </div>
            ) : simError ? (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {simError}
              </div>
            ) : simResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Probability Histogram Widget */}
                <div className="p-3 rounded-xl bg-white border border-[#E0D9C8] shadow-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#31372B]/60 mb-2">
                    Basis State Probabilities
                  </div>
                  <MeasurementHistogramWidget
                    probabilities={simResult.probabilities}
                    shots={1024}
                    measurementCounts={simResult.measurement_counts}
                  />
                </div>

                {/* 2. Statevector Amplitudes Table */}
                <div className="p-3 rounded-xl bg-white border border-[#E0D9C8] shadow-xs overflow-y-auto max-h-56">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#31372B]/60 mb-2">
                    Statevector Amplitudes (|ψ⟩)
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    {simResult.statevector.map((amp) => {
                      const prob = Math.pow(amp.real, 2) + Math.pow(amp.imag, 2);
                      return (
                        <div
                          key={amp.basis}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#FAF7EE] border border-transparent hover:border-[#E0D9C8]"
                        >
                          <span className="font-bold text-[#202C3D]">{amp.basis}</span>
                          <span className="text-[#31372B]/70">
                            {amp.real >= 0 ? '+' : ''}{amp.real.toFixed(3)}
                            {amp.imag >= 0 ? '+' : ''}{amp.imag.toFixed(3)}i
                          </span>
                          <span className="text-emerald-700 font-semibold">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Bloch Sphere Representation */}
                <div className="p-3 rounded-xl bg-white border border-[#E0D9C8] shadow-xs flex flex-col items-center justify-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#31372B]/60 mb-2 self-start">
                    Qubit 0 Bloch Sphere
                  </div>
                  <BlochSphereWidget
                    statevector={simResult.statevector}
                    numQubits={activeAlgo.numQubits}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPLAIN THIS CIRCUIT MODAL */}
      {/* ========================================================================= */}
      <ExplainCircuitModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        circuit={circuit.map(g => ({
          id: g.id,
          type: g.type,
          target: g.target,
          step: g.step,
          control: g.control ?? undefined
        }))}
        numQubits={activeAlgo.numQubits}
        simulationResult={simResult}
        algorithmName={activeAlgo.name}
        onHighlightStep={(stepNum) => {
          const matchedStepIdx = activeAlgo.steps.findIndex(s => s.stepNumber === stepNum);
          if (matchedStepIdx !== -1) {
            setActiveStepIndex(matchedStepIdx);
          }
        }}
      />

      {/* ========================================================================= */}
      {/* FLOATING CONTEXT-AWARE AI TUTOR DRAWER */}
      {/* ========================================================================= */}
      <AITutorPanel
        compact
        context={{
          page: `Algorithm Playground - ${activeAlgo.name}`,
          circuit: circuit.map(g => ({
            type: g.type,
            target: g.target,
            step: g.step,
            control: g.control ?? undefined
          })),
          num_qubits: activeAlgo.numQubits,
          simulation_result: simResult,
          algorithm_context: {
            name: activeAlgo.name,
            category: activeAlgo.category,
            current_step: currentStep?.name,
            speedup: activeAlgo.speedup
          }
        }}
      />
    </div>
  );
};

export default AlgorithmPlayground;
