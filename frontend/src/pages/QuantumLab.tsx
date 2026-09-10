import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Trash2, 
  Eraser, 
  MousePointer2, 
  Info, 
  Activity, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Columns,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { simulateCircuit, type SimulateResponse } from '../services/api';
import { BlochSphereWidget } from '../components/BlochSphereWidget';
import { StateComparisonWidget } from '../components/StateComparisonWidget';
import { MeasurementHistogramWidget } from '../components/MeasurementHistogramWidget';
import { AITutorPanel } from '../components/AITutorPanel';
import { ExplainCircuitModal } from '../components/ExplainCircuitModal';
import type { QuantumVisualizationData } from '../components/visualization3d';

const QuantumVisualizer = React.lazy(() => import('../components/visualization3d').then(m => ({ default: m.QuantumVisualizer })));

type GateType = 'H' | 'X' | 'Z' | 'CNOT';

interface PlacedGate {
  id: string;
  type: GateType;
  target: number;
  control?: number;
  step: number;
}

const GATES: { id: GateType; name: string; desc: string }[] = [
  { id: 'H', name: 'Hadamard', desc: 'Creates an equal superposition of |0⟩ and |1⟩.' },
  { id: 'X', name: 'Pauli-X (NOT)', desc: 'Flips the qubit state: |0⟩ ↔ |1⟩.' },
  { id: 'Z', name: 'Pauli-Z (Phase)', desc: 'Applies a 180° phase flip to the |1⟩ state.' },
  { id: 'CNOT', name: 'CNOT', desc: 'Flips target qubit if control qubit is |1⟩. (Click control, then target)' }
];

const NUM_STEPS = 10;
const ROW_HEIGHT = 64;

function formatAmplitude(real: number, imag: number): string {
  const threshold = 0.0001;
  const absReal = Math.abs(real);
  const absImag = Math.abs(imag);
  if (absReal < threshold && absImag < threshold) return '0';
  if (absImag < threshold) return real.toFixed(4);
  if (absReal < threshold) {
    if (Math.abs(imag - 1) < threshold) return 'i';
    if (Math.abs(imag + 1) < threshold) return '-i';
    return `${imag.toFixed(4)}i`;
  }
  const sign = imag >= 0 ? '+' : '-';
  return `${real.toFixed(4)} ${sign} ${Math.abs(imag).toFixed(4)}i`;
}

function formatStatevectorString(sv: SimulateResponse['statevector']): string {
  const parts: string[] = [];
  for (const entry of sv) {
    const amp = formatAmplitude(entry.real, entry.imag);
    if (amp === '0') continue;
    const prefix = parts.length > 0 ? ' + ' : '';
    if (amp === '1' || amp === '1.0000') {
      parts.push(`${prefix}${entry.basis}`);
    } else if (amp === '-1' || amp === '-1.0000') {
      parts.push(`${parts.length > 0 ? ' - ' : '-'}${entry.basis}`);
    } else {
      parts.push(`${prefix}${amp}${entry.basis}`);
    }
  }
  return parts.join('') || '0';
}

export const QuantumLab: React.FC = () => {
  const [numQubits, setNumQubits] = useState<number>(3);
  const [circuit, setCircuit] = useState<PlacedGate[]>([]);
  const [activeTool, setActiveTool] = useState<GateType | 'ERASER' | 'CURSOR'>('CURSOR');
  const [pendingCNOT, setPendingCNOT] = useState<{ control: number; step: number } | null>(null);
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);
  const [simError, setSimError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'before-after' | 'bloch' | 'histogram' | '3d'>('all');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);

  const visualizationData: QuantumVisualizationData = React.useMemo(() => {
    return {
      numQubits: simResult ? simResult.num_qubits : numQubits,
      circuitOperations: circuit,
      currentStep: circuit.length,
      statevector: simResult ? simResult.statevector : [],
      basisStateProbabilities: simResult ? simResult.probabilities : {},
      measurementCounts: simResult ? simResult.measurement_counts : {},
      currentState: simResult ? simResult.statevector : []
    };
  }, [simResult, circuit, numQubits]);

  // Responsive Layout States
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'circuit' | 'results'>('split');
  const [isResultsExpanded, setIsResultsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsPaletteCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleQubitCountChange = (count: number) => {
    setNumQubits(count);
    setCircuit(prev => prev.filter(g => g.target < count && (!g.control || g.control < count)));
    setPendingCNOT(null);
    setSimResult(null);
  };

  const handleCellClick = (qubitIndex: number, stepIndex: number) => {
    if (activeTool === 'ERASER') {
      setCircuit(prev => prev.filter(g => g.step !== stepIndex || (g.target !== qubitIndex && g.control !== qubitIndex)));
      return;
    }

    if (activeTool === 'CURSOR') return;

    const occupiedBy = circuit.find(g => g.step === stepIndex && (g.target === qubitIndex || g.control === qubitIndex));

    if (activeTool === 'CNOT') {
      if (pendingCNOT) {
        if (pendingCNOT.step !== stepIndex) {
          setPendingCNOT({ control: qubitIndex, step: stepIndex });
          return;
        }
        if (pendingCNOT.control === qubitIndex) {
          setPendingCNOT(null);
          return;
        }
        if (occupiedBy) return;

        setCircuit(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          type: 'CNOT',
          control: pendingCNOT.control,
          target: qubitIndex,
          step: stepIndex
        }]);
        setPendingCNOT(null);
      } else {
        if (occupiedBy) return;
        setPendingCNOT({ control: qubitIndex, step: stepIndex });
      }
      return;
    }

    if (occupiedBy) return;

    setCircuit(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTool as GateType,
      target: qubitIndex,
      step: stepIndex
    }]);
  };

  const clearCircuit = () => {
    setCircuit([]);
    setPendingCNOT(null);
    setSimResult(null);
    setSimError(null);
  };

  const handleRunCircuit = async () => {
    if (circuit.length === 0) {
      setSimError('Circuit is empty — place at least one gate before running.');
      setSimResult(null);
      return;
    }

    setIsSimulating(true);
    setSimError(null);
    setSimResult(null);

    try {
      const result = await simulateCircuit({
        gates: circuit.map(g => ({
          id: g.id,
          type: g.type,
          target: g.target,
          step: g.step,
          control: g.control,
        })),
        num_qubits: numQubits,
        shots: 1024,
      });
      setSimResult(result);

      if (viewMode === 'circuit' || window.innerWidth < 1024) {
        setViewMode('split');
      }
    } catch (err) {
      setSimError(err instanceof Error ? err.message : 'Unknown error during simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  const showCircuit = viewMode === 'split' || viewMode === 'circuit';
  const showResults = viewMode === 'split' || viewMode === 'results';

  return (
    <div className="flex h-[calc(100vh-4.5rem)] bg-floral-white text-black-olive overflow-hidden relative">

      {/* ========================================================================= */}
      {/* LEFT PANEL: GATE PALETTE */}
      {/* ========================================================================= */}
      <div 
        className={`bg-[#FFFDF7] flex flex-col flex-shrink-0 transition-all duration-300 relative z-20 border-r border-soft-sand shadow-sm ${
          isPaletteCollapsed ? 'w-14' : 'w-48 lg:w-56'
        }`}
      >
        {/* Palette Header */}
        <div className="p-3 flex items-center justify-between border-b border-soft-sand">
          {!isPaletteCollapsed && (
            <h2 className="text-xs font-bold text-black-olive uppercase tracking-wider">Gate Palette</h2>
          )}
          <button
            onClick={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
            title={isPaletteCollapsed ? "Expand Palette" : "Collapse Palette"}
            className="p-1.5 rounded-xl bg-warm-ivory text-black-olive/80 hover:bg-soft-sand border border-soft-sand transition-all mx-auto shadow-sm"
          >
            {isPaletteCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Palette Tools & Gates */}
        <div className="p-2.5 flex-1 overflow-y-auto space-y-4">
          
          {/* Tools */}
          <div className="space-y-1.5">
            {!isPaletteCollapsed && (
              <h3 className="text-[10px] font-semibold text-olive-mist uppercase tracking-widest px-2 mb-1">Tools</h3>
            )}
            <button
              onClick={() => { setActiveTool('CURSOR'); setPendingCNOT(null); }}
              title="Select / Pointer"
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
                isPaletteCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
              } ${
                activeTool === 'CURSOR' 
                  ? 'bg-black-olive text-floral-white font-bold shadow-sm' 
                  : 'bg-warm-ivory/60 hover:bg-warm-ivory text-black-olive/80 border border-soft-sand'
              }`}
            >
              <MousePointer2 className="w-4 h-4 flex-shrink-0" />
              {!isPaletteCollapsed && <span>Select</span>}
            </button>
            <button
              onClick={() => { setActiveTool('ERASER'); setPendingCNOT(null); }}
              title="Eraser"
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
                isPaletteCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
              } ${
                activeTool === 'ERASER' 
                  ? 'bg-black-olive text-floral-white font-bold shadow-sm' 
                  : 'bg-warm-ivory/60 hover:bg-warm-ivory text-black-olive/80 border border-soft-sand'
              }`}
            >
              <Eraser className="w-4 h-4 flex-shrink-0" />
              {!isPaletteCollapsed && <span>Eraser</span>}
            </button>
          </div>

          {/* Quantum Gates as Distinctive Botanical Chips */}
          <div className="space-y-2">
            {!isPaletteCollapsed && (
              <h3 className="text-[10px] font-semibold text-olive-mist uppercase tracking-widest px-2 mb-1">Gates</h3>
            )}
            {GATES.map(gate => {
              const isH = gate.id === 'H';
              const isX = gate.id === 'X';
              const isZ = gate.id === 'Z';
              const isCNOT = gate.id === 'CNOT';
              const isActive = activeTool === gate.id;

              let gateBadgeStyle = 'bg-warm-ivory text-black-olive border-soft-sand';
              if (isH) gateBadgeStyle = 'bg-soft-cyan/25 text-deep-slate border-soft-cyan/60';
              if (isX) gateBadgeStyle = 'bg-muted-sage/25 text-black-olive border-muted-sage/60';
              if (isZ) gateBadgeStyle = 'bg-dusty-lavender/25 text-black-olive border-dusty-lavender/60';
              if (isCNOT) gateBadgeStyle = 'bg-warm-gold/25 text-cocoa-noir border-warm-gold/60';

              return (
                <div key={gate.id} className="relative group">
                  <button
                    onClick={() => { setActiveTool(gate.id); setPendingCNOT(null); }}
                    title={`${gate.name}: ${gate.desc}`}
                    className={`w-full flex items-center rounded-xl transition-all border ${
                      isPaletteCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                    } ${
                      isActive 
                        ? 'bg-black-olive text-floral-white border-black-olive shadow-sm font-bold' 
                        : 'bg-warm-ivory/50 hover:bg-warm-ivory text-black-olive border-soft-sand'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 border ${
                      isActive ? 'bg-floral-white text-black-olive border-transparent' : gateBadgeStyle
                    }`}>
                      {gate.id}
                    </div>
                    {!isPaletteCollapsed && (
                      <span className="text-xs font-semibold truncate">{gate.name}</span>
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 top-0 w-52 p-3 bg-black-olive text-warm-ivory text-[11px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl border border-black-olive/50">
                    <div className="font-semibold text-warm-gold mb-0.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5"/> {gate.name}
                    </div>
                    <p className="text-warm-ivory/80">{gate.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTER PANEL: CIRCUIT BUILDER CANVAS */}
      {/* ========================================================================= */}
      {showCircuit && (
        <div className={`flex-1 flex flex-col relative bg-floral-white min-w-0 transition-all ${
          viewMode === 'circuit' ? 'w-full' : ''
        }`}>
          
          {/* Canvas Top Bar */}
          <div className="p-3 bg-[#FFFDF7] flex flex-wrap justify-between items-center gap-2 border-b border-soft-sand z-10 shadow-sm">
            
            {/* Left Controls: Title + Qubit Selector */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold font-serif text-black-olive flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-olive-mist hidden sm:inline" /> Circuit Workbench
              </h1>
              
              {/* Qubit Count Selector */}
              <div className="flex items-center gap-1 bg-warm-ivory border border-soft-sand p-1 rounded-xl text-xs">
                {[1, 2, 3].map(count => (
                  <button
                    key={count}
                    onClick={() => handleQubitCountChange(count)}
                    className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                      numQubits === count 
                        ? 'bg-black-olive text-floral-white shadow-sm' 
                        : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    {count}Q
                  </button>
                ))}
              </div>

              {activeTool !== 'CURSOR' && (
                <span className="px-2.5 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive text-[10px] font-mono uppercase tracking-wider font-bold">
                  {activeTool} {pendingCNOT && '(Select Target Wire)'}
                </span>
              )}
            </div>

            {/* Center: View Switcher */}
            <div className="hidden md:flex items-center bg-warm-ivory border border-soft-sand p-1 rounded-xl text-[11px]">
              <button
                onClick={() => setViewMode('split')}
                title="Split View (Circuit + Results)"
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'split' ? 'bg-black-olive text-floral-white shadow-sm' : 'text-black-olive/70 hover:text-black-olive'
                }`}
              >
                <Columns className="w-3 h-3" /> Split
              </button>
              <button
                onClick={() => setViewMode('circuit')}
                title="Full Circuit View"
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'circuit' ? 'bg-black-olive text-floral-white shadow-sm' : 'text-black-olive/70 hover:text-black-olive'
                }`}
              >
                <Layers className="w-3 h-3" /> Circuit
              </button>
              <button
                onClick={() => setViewMode('results')}
                title="Full Results View"
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition-all ${
                  (viewMode as string) === 'results' ? 'bg-black-olive text-floral-white shadow-sm' : 'text-black-olive/70 hover:text-black-olive'
                }`}
              >
                <BarChart3 className="w-3 h-3" /> Results
              </button>
            </div>

            {/* Right Actions: Reset & Run Circuit (Warm Gold Primary Button) */}
            <div className="flex items-center gap-2">
              <button 
                onClick={clearCircuit} 
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-black-olive/80 bg-warm-ivory border border-soft-sand hover:bg-soft-sand transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5 text-olive-mist" /> Reset
              </button>
              <button
                type="button"
                onClick={() => setIsExplainModalOpen(true)}
                disabled={circuit.length === 0}
                title={circuit.length === 0 ? "Place at least one gate to explain circuit" : "Explain this circuit in detail"}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-black-olive bg-warm-gold/20 border border-warm-gold/40 hover:bg-warm-gold/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cocoa-noir" /> Explain Circuit
              </button>
              <button
                onClick={handleRunCircuit}
                disabled={isSimulating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-warm-gold text-deep-slate hover:bg-[#D4BA7F] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
              >
                {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isSimulating ? 'Simulating...' : 'Run Circuit'}
              </button>
            </div>

          </div>

          {/* Interactive Quantum Wire Canvas */}
          <div className="flex-1 overflow-auto p-6 sm:p-8 flex justify-center items-center">
            <div className="relative" style={{ width: `${NUM_STEPS * 64 + 90}px`, height: `${numQubits * ROW_HEIGHT}px` }}>
              {/* Qubit Wires */}
              {Array.from({ length: numQubits }).map((_, qIdx) => (
                <div key={`wire-${qIdx}`} className="absolute left-0 right-0 flex items-center" style={{ top: qIdx * ROW_HEIGHT, height: ROW_HEIGHT }}>
                  <div className="w-14 font-mono text-xs font-bold text-black-olive flex items-center gap-1">
                    |0⟩ <span className="text-[10px] text-olive-mist font-medium">q[{qIdx}]</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-black-olive/25 rounded-full"></div>
                </div>
              ))}

              <div className="absolute left-14 top-0 bottom-0 right-0 flex">
                {Array.from({ length: NUM_STEPS }).map((_, sIdx) => (
                  <div key={`col-${sIdx}`} className="flex-1 relative h-full group">
                    <div className="absolute inset-0 hover:bg-black-olive/5 rounded-xl transition-colors pointer-events-none" />
                    {Array.from({ length: numQubits }).map((_, qIdx) => {
                      const isOccupied = circuit.find(g => g.step === sIdx && (g.target === qIdx || g.control === qIdx));
                      const isPendingCNOTControl = pendingCNOT?.step === sIdx && pendingCNOT?.control === qIdx;
                      return (
                        <div
                          key={`cell-${sIdx}-${qIdx}`}
                          onClick={() => handleCellClick(qIdx, sIdx)}
                          className={`absolute left-0 right-0 cursor-pointer flex items-center justify-center z-20 ${!isOccupied && activeTool !== 'CURSOR' ? 'hover:scale-105' : ''}`}
                          style={{ top: qIdx * ROW_HEIGHT, height: ROW_HEIGHT }}
                        >
                          {isPendingCNOTControl && (
                            <div className="w-3.5 h-3.5 rounded-full bg-warm-gold animate-ping" />
                          )}
                        </div>
                      );
                    })}

                    {/* Placed Gates: Rendered with Botanical Identity Colors */}
                    {circuit.filter(g => g.step === sIdx).map(gate => {
                      if (gate.type === 'CNOT') {
                        const cY = gate.control! * ROW_HEIGHT + ROW_HEIGHT / 2;
                        const tY = gate.target * ROW_HEIGHT + ROW_HEIGHT / 2;
                        const top = Math.min(cY, tY);
                        const height = Math.abs(cY - tY);
                        return (
                          <div key={gate.id} className="absolute left-0 right-0 pointer-events-none z-10">
                            {/* Connecting vertical line */}
                            <div className="absolute left-1/2 w-1.5 bg-warm-gold -translate-x-1/2 rounded-full" style={{ top, height }} />
                            {/* Control Node */}
                            <div className="absolute left-1/2 w-4 h-4 rounded-full bg-warm-gold shadow-md -translate-x-1/2 -translate-y-1/2" style={{ top: cY }} />
                            {/* Target Node (+) */}
                            <div className="absolute left-1/2 w-8 h-8 rounded-full bg-[#FFFDF7] shadow-md border-2 border-warm-gold flex items-center justify-center -translate-x-1/2 -translate-y-1/2" style={{ top: tY }}>
                              <div className="w-full h-0.5 bg-warm-gold absolute" />
                              <div className="h-full w-0.5 bg-warm-gold absolute" />
                            </div>
                          </div>
                        );
                      }

                      let chipStyle = 'bg-warm-ivory text-black-olive border-soft-sand';
                      if (gate.type === 'H') chipStyle = 'bg-soft-cyan text-deep-slate border-soft-cyan/80';
                      if (gate.type === 'X') chipStyle = 'bg-muted-sage text-black-olive border-muted-sage/80';
                      if (gate.type === 'Z') chipStyle = 'bg-dusty-lavender text-black-olive border-dusty-lavender/80';

                      return (
                        <div
                          key={gate.id}
                          className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold font-mono text-base shadow-md pointer-events-none z-10 ${chipStyle}`}
                          style={{ top: gate.target * ROW_HEIGHT + ROW_HEIGHT / 2 }}
                        >
                          {gate.type}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Results Bar */}
          {viewMode === 'circuit' && simResult && (
            <div className="p-3 bg-floral-white border-t border-black-olive/10 flex items-center justify-between text-xs px-6">
              <span className="text-black-olive font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-gray animate-pulse" /> 
                Simulation complete: {Object.keys(simResult.probabilities).filter(k => simResult.probabilities[k] > 0).length} basis states
              </span>
              <button
                onClick={() => setViewMode('results')}
                className="px-4 py-1.5 rounded-xl bg-slate-gray text-floral-white font-medium flex items-center gap-1.5 text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all"
              >
                View Full Results <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* RIGHT PANEL: ENHANCED STATE VISUALIZATION */}
      {/* ========================================================================= */}
      {showResults && (
        <div 
          className={`bg-[#FFFDF7] border-l border-soft-sand flex flex-col relative overflow-hidden transition-all duration-300 shadow-sm ${
            viewMode === 'results' 
              ? 'flex-1 w-full' 
              : isResultsExpanded 
              ? 'w-full lg:w-[560px] xl:w-[640px] flex-shrink-0' 
              : 'w-80 sm:w-96 lg:w-[380px] xl:w-[420px] flex-shrink-0'
          }`}
        >
          {/* Results Header */}
          <div className="p-3.5 flex items-center justify-between gap-2 flex-wrap bg-[#FFFDF7] border-b border-soft-sand">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-olive-mist" /> Results &amp; Telemetry
              </h2>
              {simResult && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-muted-sage/20 border border-muted-sage/40 text-black-olive">
                  Ready
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Tab Selector */}
              {simResult && (
                <div className="flex gap-1 bg-warm-ivory border border-soft-sand p-1 rounded-xl text-[10px]">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      activeTab === 'all' ? 'bg-black-olive text-floral-white shadow-sm font-bold' : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('before-after')}
                    title="Before -> After Comparison"
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      activeTab === 'before-after' ? 'bg-black-olive text-floral-white shadow-sm font-bold' : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    B/A
                  </button>
                  <button
                    onClick={() => setActiveTab('bloch')}
                    title="Bloch Sphere"
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      activeTab === 'bloch' ? 'bg-black-olive text-floral-white shadow-sm font-bold' : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    Bloch
                  </button>
                  <button
                    onClick={() => setActiveTab('histogram')}
                    title="1024-shot Measurement Histogram"
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      activeTab === 'histogram' ? 'bg-black-olive text-floral-white shadow-sm font-bold' : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    Shots
                  </button>
                  <button
                    onClick={() => setActiveTab('3d')}
                    title="Interactive 3D Quantum Engine"
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      activeTab === '3d' ? 'bg-black-olive text-floral-white shadow-sm font-bold' : 'text-black-olive/70 hover:text-black-olive'
                    }`}
                  >
                    3D
                  </button>
                </div>
              )}

              {viewMode === 'split' && (
                <button
                  onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                  title={isResultsExpanded ? "Standard Width" : "Widen Results"}
                  className="p-1.5 rounded-xl bg-warm-ivory text-black-olive/70 hover:text-black-olive border border-soft-sand transition-all shadow-sm"
                >
                  {isResultsExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {viewMode === 'results' && (
                <button
                  onClick={() => setViewMode('split')}
                  className="px-3 py-1 rounded-xl bg-warm-ivory text-black-olive text-[10px] font-semibold border border-soft-sand hover:bg-soft-sand transition-all flex items-center gap-1 shadow-sm"
                >
                  Back to Circuit
                </button>
              )}
            </div>
          </div>

          {/* Results Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Error state */}
            {simError && (
              <div className="p-3.5 rounded-2xl bg-cocoa-noir/10 border border-soft-cocoa/40 text-black-olive text-xs">
                <div className="flex items-center gap-1.5 mb-1 font-bold text-cocoa-noir">
                  <AlertTriangle className="w-4 h-4" /> Simulation Notice
                </div>
                <p className="whitespace-pre-wrap text-black-olive/80">{simError}</p>
              </div>
            )}

            {/* Empty state */}
            {!simResult && !simError && !isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60 py-20">
                <div className="w-14 h-14 rounded-2xl bg-warm-ivory border border-soft-sand flex items-center justify-center shadow-sm">
                  <Activity className="w-7 h-7 text-olive-mist" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-black-olive">Awaiting Simulation</p>
                  <p className="text-[11px] text-olive-mist mt-1 max-w-[220px]">
                    Place gates on the wires and click <strong>Run Circuit</strong> to visualize amplitudes, Bloch rotations, and measurement histograms.
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2.5 py-20">
                <Loader2 className="w-8 h-8 text-black-olive animate-spin" />
                <p className="text-xs font-semibold text-black-olive">Simulating quantum state via Qiskit...</p>
              </div>
            )}

            {/* Rendered Results */}
            {simResult && !isSimulating && (
              <div className={`space-y-4 ${
                (isResultsExpanded || viewMode === 'results') ? 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0' : ''
              }`}>
                
                {/* 1. Before -> After State Comparison */}
                {(activeTab === 'all' || activeTab === 'before-after') && (
                  <StateComparisonWidget
                    numQubits={simResult.num_qubits}
                    probabilities={simResult.probabilities}
                    numGates={simResult.num_gates}
                  />
                )}

                {/* 2. Bloch Sphere Visualization */}
                {(activeTab === 'all' || activeTab === 'bloch') && (
                  <BlochSphereWidget
                    statevector={simResult.statevector}
                    numQubits={simResult.num_qubits}
                  />
                )}

                {/* 3. Formatted Statevector */}
                {(activeTab === 'all' || activeTab === 'before-after') && (
                  <div className="p-4 bg-warm-ivory/60 border border-soft-sand rounded-2xl text-xs space-y-1 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-olive-mist tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-warm-gold" /> Dirac Ket Statevector
                    </div>
                    <div className="font-mono text-black-olive font-bold break-all leading-relaxed text-xs pt-1">
                      |ψ⟩ = {formatStatevectorString(simResult.statevector)}
                    </div>
                  </div>
                )}

                {/* 4. Theoretical Probabilities */}
                {(activeTab === 'all') && (
                  <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-black-olive uppercase tracking-wider">
                        Probabilities (|cₙ|²)
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(simResult.probabilities)
                        .filter(([, prob]) => prob > 0.0001)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([basis, prob]) => (
                        <div key={basis} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-mono text-black-olive font-bold">{basis}</span>
                            <span className="text-olive-mist font-mono">{(prob * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-3 bg-warm-ivory border border-soft-sand rounded-full overflow-hidden p-0.5">
                            <div
                              className="h-full bg-slate-glow rounded-full transition-all duration-300 shadow-sm"
                              style={{ width: `${prob * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Measurement Histogram (Simulated Shots) */}
                {(activeTab === 'all' || activeTab === 'histogram') && (
                  <div className={viewMode === 'results' || isResultsExpanded ? 'md:col-span-2' : ''}>
                    <MeasurementHistogramWidget
                      measurementCounts={simResult.measurement_counts}
                      probabilities={simResult.probabilities}
                      shots={simResult.shots}
                    />
                  </div>
                )}

                {/* 6. 3D Interactive Quantum Engine */}
                {(activeTab === '3d') && (
                  <div className="col-span-full">
                    <React.Suspense
                      fallback={
                        <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-gray">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-xs font-mono">Loading 3D Visualizer...</span>
                        </div>
                      }
                    >
                      <QuantumVisualizer data={visualizationData} />
                    </React.Suspense>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* Explain Circuit Interactive Modal */}
      <ExplainCircuitModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        circuit={circuit.map(g => ({
          id: g.id,
          type: g.type,
          target: g.target,
          step: g.step,
          control: g.control
        }))}
        numQubits={numQubits}
        simulationResult={simResult}
        algorithmName="Custom Quantum Lab Circuit"
      />

      {/* Floating Context-Aware AI Tutor Drawer */}
      <AITutorPanel
        compact
        context={{
          page: 'Quantum Lab',
          circuit: circuit.map(g => ({ type: g.type, target: g.target, step: g.step, control: g.control })),
          num_qubits: numQubits,
          simulation_result: simResult
        }}
      />
    </div>
  );
};

export default QuantumLab;
