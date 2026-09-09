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

type GateType = 'H' | 'X' | 'Z' | 'CNOT';

interface PlacedGate {
  id: string;
  type: GateType;
  target: number;
  control?: number;
  step: number;
}

const GATES: { id: GateType; name: string; desc: string; color: string; border: string; text: string }[] = [
  { id: 'H', name: 'Hadamard', desc: 'Creates an equal superposition of |0\u27E9 and |1\u27E9.', color: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-300' },
  { id: 'X', name: 'Pauli-X (NOT)', desc: 'Flips the qubit state: |0\u27E9 \u2194 |1\u27E9.', color: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-300' },
  { id: 'Z', name: 'Pauli-Z (Phase)', desc: 'Applies a 180\u00B0 phase flip to the |1\u27E9 state.', color: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300' },
  { id: 'CNOT', name: 'CNOT', desc: 'Flips target qubit if control qubit is |1\u27E9. (Click control, then target)', color: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-300' }
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
  const [activeTab, setActiveTab] = useState<'all' | 'before-after' | 'bloch' | 'histogram'>('all');

  // Responsive Layout States
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'circuit' | 'results'>('split');
  const [isResultsExpanded, setIsResultsExpanded] = useState<boolean>(false);

  // Auto-adapt palette on mount if screen is smaller than 1280px
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
      setSimError('Circuit is empty \u2014 place at least one gate before running.');
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

      // On smaller laptop screens or when currently in circuit view, ensure results are visible
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
    <div className="flex h-[calc(100vh-4rem)] bg-quantum-950 text-slate-200 overflow-hidden relative">

      {/* ========================================================================= */}
      {/* LEFT PANEL: GATE PALETTE (COLLAPSIBLE) */}
      {/* ========================================================================= */}
      <div 
        className={`border-r border-slate-800 bg-quantum-900/40 flex flex-col flex-shrink-0 transition-all duration-300 relative z-20 ${
          isPaletteCollapsed ? 'w-14' : 'w-48 lg:w-56'
        }`}
      >
        {/* Palette Header */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          {!isPaletteCollapsed && (
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Gate Palette</h2>
          )}
          <button
            onClick={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
            title={isPaletteCollapsed ? "Expand Palette" : "Collapse Palette"}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
          >
            {isPaletteCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Palette Tools & Gates */}
        <div className="p-2 flex-1 overflow-y-auto space-y-4">
          
          {/* Tools */}
          <div className="space-y-1.5">
            {!isPaletteCollapsed && (
              <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Tools</h3>
            )}
            <button
              onClick={() => { setActiveTool('CURSOR'); setPendingCNOT(null); }}
              title="Select / Pointer"
              className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors ${
                isPaletteCollapsed ? 'justify-center p-2' : 'gap-2 px-2.5 py-1.5'
              } ${
                activeTool === 'CURSOR' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' 
                  : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <MousePointer2 className="w-4 h-4 flex-shrink-0" />
              {!isPaletteCollapsed && <span>Select</span>}
            </button>
            <button
              onClick={() => { setActiveTool('ERASER'); setPendingCNOT(null); }}
              title="Eraser"
              className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors ${
                isPaletteCollapsed ? 'justify-center p-2' : 'gap-2 px-2.5 py-1.5'
              } ${
                activeTool === 'ERASER' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Eraser className="w-4 h-4 flex-shrink-0" />
              {!isPaletteCollapsed && <span>Eraser</span>}
            </button>
          </div>

          {/* Gates */}
          <div className="space-y-2">
            {!isPaletteCollapsed && (
              <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Quantum Gates</h3>
            )}
            {GATES.map(gate => (
              <div key={gate.id} className="relative group">
                <button
                  onClick={() => { setActiveTool(gate.id); setPendingCNOT(null); }}
                  title={`${gate.name}: ${gate.desc}`}
                  className={`w-full flex items-center rounded-xl border transition-all ${
                    isPaletteCollapsed ? 'justify-center p-1.5' : 'gap-2.5 px-2.5 py-2'
                  } ${
                    activeTool === gate.id 
                      ? `bg-slate-800 ${gate.border} shadow-lg shadow-indigo-500/10` 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs border flex-shrink-0 ${gate.color} ${gate.border} ${gate.text}`}>
                    {gate.id}
                  </div>
                  {!isPaletteCollapsed && (
                    <span className="text-xs font-semibold text-slate-200 truncate">{gate.name}</span>
                  )}
                </button>

                {/* Tooltip on hover */}
                <div className="absolute left-full ml-2 top-0 w-44 p-2.5 bg-slate-800 text-[11px] text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl border border-slate-700">
                  <div className="font-semibold text-white mb-0.5 flex items-center gap-1"><Info className="w-3 h-3"/> {gate.name}</div>
                  {gate.desc}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTER PANEL: CIRCUIT BUILDER CANVAS */}
      {/* ========================================================================= */}
      {showCircuit && (
        <div className={`flex-1 flex flex-col relative bg-quantum-950 quantum-grid-bg min-w-0 transition-all ${
          viewMode === 'circuit' ? 'w-full' : ''
        }`}>
          
          {/* Canvas Top Bar */}
          <div className="p-3 border-b border-slate-800/80 bg-quantum-900/50 backdrop-blur-md flex flex-wrap justify-between items-center gap-2 z-10">
            
            {/* Left Controls: Title + Qubit Selector + Mode Status */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-400 hidden sm:inline" /> Circuit Builder
              </h1>
              
              {/* Qubit Count Selector */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-xs">
                {[1, 2, 3].map(count => (
                  <button
                    key={count}
                    onClick={() => handleQubitCountChange(count)}
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold transition-all ${
                      numQubits === count 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {count}Q
                  </button>
                ))}
              </div>

              {activeTool !== 'CURSOR' && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono uppercase tracking-wider">
                  {activeTool} {pendingCNOT && '(Click Target)'}
                </span>
              )}
            </div>

            {/* Center: View Switcher for Laptop Convenience */}
            <div className="hidden md:flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setViewMode('split')}
                title="Split View (Circuit + Results)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'split' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3 h-3" /> Split
              </button>
              <button
                onClick={() => setViewMode('circuit')}
                title="Full Circuit View"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'circuit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" /> Circuit
              </button>
              <button
                onClick={() => setViewMode('results')}
                title="Full Results View (Expands all charts)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  (viewMode as string) === 'results' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3 h-3" /> Results {simResult && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
              </button>
            </div>

            {/* Right Actions: Reset & Run Circuit */}
            <div className="flex items-center gap-2">
              <button 
                onClick={clearCircuit} 
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleRunCircuit}
                disabled={isSimulating}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
              >
                {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isSimulating ? 'Simulating...' : 'Run Circuit'}
              </button>
            </div>

          </div>

          {/* Interactive Quantum Wire Canvas */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-center">
            <div className="relative" style={{ width: `${NUM_STEPS * 60 + 90}px`, height: `${numQubits * ROW_HEIGHT}px` }}>
              {Array.from({ length: numQubits }).map((_, qIdx) => (
                <div key={`wire-${qIdx}`} className="absolute left-0 right-0 flex items-center" style={{ top: qIdx * ROW_HEIGHT, height: ROW_HEIGHT }}>
                  <div className="w-14 font-mono text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    |0{'\u27E9'} <span className="text-[10px] text-slate-500">q[{qIdx}]</span>
                  </div>
                  <div className="flex-1 h-px bg-slate-700 shadow-[0_0_8px_rgba(51,65,85,0.5)]"></div>
                </div>
              ))}

              <div className="absolute left-14 top-0 bottom-0 right-0 flex">
                {Array.from({ length: NUM_STEPS }).map((_, sIdx) => (
                  <div key={`col-${sIdx}`} className="flex-1 border-r border-slate-800/30 relative h-full group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    {Array.from({ length: numQubits }).map((_, qIdx) => {
                      const isOccupied = circuit.find(g => g.step === sIdx && (g.target === qIdx || g.control === qIdx));
                      const isPendingCNOTControl = pendingCNOT?.step === sIdx && pendingCNOT?.control === qIdx;
                      return (
                        <div
                          key={`cell-${sIdx}-${qIdx}`}
                          onClick={() => handleCellClick(qIdx, sIdx)}
                          className={`absolute left-0 right-0 cursor-pointer flex items-center justify-center z-20 ${!isOccupied && activeTool !== 'CURSOR' ? 'hover:bg-indigo-500/20' : ''}`}
                          style={{ top: qIdx * ROW_HEIGHT, height: ROW_HEIGHT }}
                        >
                          {isPendingCNOTControl && (
                            <div className="w-3 h-3 rounded-full bg-rose-400 ring-4 ring-rose-400/20" />
                          )}
                        </div>
                      );
                    })}

                    {circuit.filter(g => g.step === sIdx).map(gate => {
                      const gateDef = GATES.find(d => d.id === gate.type);
                      if (gate.type === 'CNOT') {
                        const cY = gate.control! * ROW_HEIGHT + ROW_HEIGHT / 2;
                        const tY = gate.target * ROW_HEIGHT + ROW_HEIGHT / 2;
                        const top = Math.min(cY, tY);
                        const height = Math.abs(cY - tY);
                        return (
                          <div key={gate.id} className="absolute left-0 right-0 pointer-events-none z-10">
                            <div className="absolute left-1/2 w-0.5 bg-rose-500/80 -translate-x-1/2" style={{ top, height }} />
                            <div className="absolute left-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ top: cY }} />
                            <div className="absolute left-1/2 w-7 h-7 rounded-full bg-quantum-900 border-2 border-rose-500 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(244,63,94,0.4)]" style={{ top: tY }}>
                              <div className="w-full h-0.5 bg-rose-500 absolute" />
                              <div className="h-full w-0.5 bg-rose-500 absolute" />
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={gate.id}
                          className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-base border shadow-lg backdrop-blur-sm pointer-events-none z-10 ${gateDef?.color} ${gateDef?.border} ${gateDef?.text}`}
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

          {/* Quick Results Bar if in Circuit mode and results exist */}
          {viewMode === 'circuit' && simResult && (
            <div className="p-2 border-t border-slate-800 bg-quantum-900/60 backdrop-blur-sm flex items-center justify-between text-xs px-4">
              <span className="text-slate-300 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> Simulation complete: {Object.keys(simResult.probabilities).filter(k => simResult.probabilities[k] > 0).length} active basis states
              </span>
              <button
                onClick={() => setViewMode('results')}
                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 text-xs transition-colors"
              >
                View Full Results <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* RIGHT PANEL: ENHANCED STATE VISUALIZATION (RESPONSIVE & EXPANDABLE) */}
      {/* ========================================================================= */}
      {showResults && (
        <div 
          className={`border-l border-slate-800 bg-quantum-900/30 flex flex-col relative overflow-hidden transition-all duration-300 ${
            viewMode === 'results' 
              ? 'flex-1 w-full' 
              : isResultsExpanded 
              ? 'w-full lg:w-[560px] xl:w-[640px] flex-shrink-0' 
              : 'w-80 sm:w-96 lg:w-[380px] xl:w-[420px] flex-shrink-0'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none" />

          {/* Results Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap bg-quantum-900/50">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-teal-400" /> Results & State
              </h2>
              {simResult && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Ready
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Tab Selector */}
              {simResult && (
                <div className="flex gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-2 py-0.5 rounded font-medium ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('before-after')}
                    title="Before -> After Comparison"
                    className={`px-1.5 py-0.5 rounded font-medium ${activeTab === 'before-after' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    B/A
                  </button>
                  <button
                    onClick={() => setActiveTab('bloch')}
                    title="Bloch Sphere"
                    className={`px-1.5 py-0.5 rounded font-medium ${activeTab === 'bloch' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Bloch
                  </button>
                  <button
                    onClick={() => setActiveTab('histogram')}
                    title="1024-shot Measurement Histogram"
                    className={`px-1.5 py-0.5 rounded font-medium ${activeTab === 'histogram' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Shots
                  </button>
                </div>
              )}

              {/* Expand / Maximize Button for Laptop Screens */}
              {viewMode === 'split' && (
                <button
                  onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                  title={isResultsExpanded ? "Standard Width" : "Widen Results for Laptop"}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {isResultsExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {viewMode === 'results' && (
                <button
                  onClick={() => setViewMode('split')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium flex items-center gap-1"
                >
                  Back to Circuit
                </button>
              )}
            </div>
          </div>

          {/* Results Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {/* Error state */}
            {simError && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs">
                <div className="flex items-center gap-1.5 mb-1 font-semibold text-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Error
                </div>
                <p className="whitespace-pre-wrap">{simError}</p>
              </div>
            )}

            {/* Empty state */}
            {!simResult && !simError && !isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-50 py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-300">Awaiting Simulation</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                    Place gates and click <strong>Run Circuit</strong> to visualize amplitudes, Bloch rotations, and measurement histograms.
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-16">
                <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                <p className="text-xs text-slate-300">Simulating quantum state...</p>
              </div>
            )}

            {/* Rendered Results */}
            {simResult && !isSimulating && (
              <div className={`space-y-3 ${
                (isResultsExpanded || viewMode === 'results') ? 'grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0' : ''
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
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-teal-400" /> Dirac Ket Statevector
                    </div>
                    <div className="font-mono text-teal-300 break-all leading-relaxed text-xs">
                      |{'\u03C8\u27E9'} = {formatStatevectorString(simResult.statevector)}
                    </div>
                  </div>
                )}

                {/* 4. Theoretical Probabilities */}
                {(activeTab === 'all') && (
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Probabilities (|c{'\u2099'}|²)
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {Object.entries(simResult.probabilities)
                        .filter(([, prob]) => prob > 0.0001)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([basis, prob]) => (
                        <div key={basis}>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="font-mono text-slate-300 font-bold">{basis}</span>
                            <span className="text-slate-400 font-mono">{(prob * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-3.5 bg-slate-800 rounded-md overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-md transition-all duration-500"
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

              </div>
            )}
          </div>
        </div>
      )}

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
