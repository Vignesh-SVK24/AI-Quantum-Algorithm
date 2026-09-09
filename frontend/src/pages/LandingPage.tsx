import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FlaskConical, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { CircuitPlaceholder } from '../components/CircuitPlaceholder';
import { getTestCircuit, type CircuitTestResponse } from '../services/api';

export const LandingPage: React.FC = () => {
  const [testResult, setTestResult] = useState<CircuitTestResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunTest = async () => {
    setIsSimulating(true);
    setErrorMsg(null);
    try {
      const data = await getTestCircuit();
      setTestResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to communicate with Qiskit simulator backend');
    } finally {
      setIsSimulating(false);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Learn',
      desc: 'Intuitive visual expositions on superposition, bra-ket notation, and unitary transformations without dense barriers.'
    },
    {
      num: '02',
      title: 'Build',
      desc: 'Assemble multi-qubit circuits using standard gates: Pauli-X, Hadamard, Phase, CNOT, and Toffoli with drag-and-drop ease.'
    },
    {
      num: '03',
      title: 'Simulate',
      desc: 'Execute circuits on high-performance Qiskit Statevector engines running live on the local backend.'
    },
    {
      num: '04',
      title: 'Visualize',
      desc: 'Inspect interactive Bloch spheres, statevector phase bars, and measurement probability histograms in real time.'
    },
    {
      num: '05',
      title: 'Understand',
      desc: 'Unpack foundational quantum algorithms — Deutsch-Jozsa, Grover search, and Shor factoring — step-by-step.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen quantum-grid-bg">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/40 text-xs font-mono text-teal-300">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Next-Generation Quantum Pedagogy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Learn Quantum Computing by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-300 to-indigo-400">
                  Building and Exploring
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Demystify quantum computing through an interactive, experiential framework. 
                Follow our proven <span className="text-white font-medium">Learn → Build → Simulate → Visualize → Understand</span> pathway 
                from basic superposition to real-world quantum algorithm design.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Open Quantum Lab</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <Link
                  to="/basics"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all hover:border-slate-600"
                >
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span>Start Quantum Basics</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-semibold transition-all hover:border-slate-700"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Badges / Credibility */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Exact Qiskit Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>No Hardware Setup Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Bloch & Statevector Visuals</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Circuit Visualizer Placeholder */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
                <span>LIVE CIRCUIT PREVIEW (INTERACTIVE)</span>
                <span className="text-teal-400">v1.0 Ready</span>
              </div>

              <CircuitPlaceholder onRunTest={handleRunTest} isRunning={isSimulating} />

              {/* Live Backend Simulation Output Badge */}
              {testResult && (
                <div className="rounded-xl border border-teal-500/30 bg-slate-950/90 p-4 font-mono text-xs text-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between text-teal-400 font-semibold">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>{testResult.circuit_name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{testResult.shots} shots</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{testResult.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Statevector:</span>
                      <span className="text-indigo-300 font-bold">
                        |0⟩: {testResult.statevector[0].real.toFixed(3)}, |1⟩: {testResult.statevector[1].real.toFixed(3)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Measured Counts:</span>
                      <span className="text-emerald-300 font-bold">
                        {Object.entries(testResult.measurement_counts).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs font-mono">
                  Connection notice: {errorMsg}. (Ensure backend server is running on port 8000)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Learning Paradigm */}
      <section className="py-16 border-y border-slate-800/80 bg-quantum-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-mono tracking-widest text-teal-400 uppercase">
              Pedagogical Methodology
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              The 5-Stage Framework for Quantum Intuition
            </p>
            <p className="text-slate-400 text-sm">
              Traditional linear algebra courses overwhelm learners with formalism. 
              Our platform grounds every equation in tangible circuit operations and visual feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={step.title}
                className="relative p-5 rounded-xl border border-slate-800 bg-quantum-950/80 hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-700 group-hover:text-indigo-400 transition-colors">
                    {step.num}
                  </span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-teal-400 uppercase mb-2">
                Core Modules
              </h2>
              <p className="text-3xl font-bold text-white">
                Everything You Need to Master Quantum Computing
              </p>
            </div>
            <Link 
              to="/lab" 
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-300 hover:text-teal-200 transition-colors"
            >
              Explore all modules <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-quantum-900/60 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Quantum Lab</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drag-and-drop quantum circuit workbench. Place Hadamard, Pauli, Phase, and entangling CNOT gates 
                  with real-time statevector evolution and probability plots.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/lab" className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
                  Enter Circuit Lab →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-quantum-900/60 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Algorithm Lab</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Walk through famous quantum algorithms including Deutsch-Jozsa oracle analysis, Grover's database 
                  search amplification, and Quantum Fourier Transform.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/algorithms" className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
                  Explore Algorithms →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-quantum-900/60 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Quantum Tutor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Context-aware AI tutor that explains statevector phase angles, debugs circuit collapse mistakes, 
                  and guides you through custom practice challenges.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/tutor" className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
                  Meet AI Tutor →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-b from-transparent to-quantum-900/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/90 via-quantum-900/90 to-teal-950/90 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to construct your first quantum superposition?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Start with one qubit, apply the Hadamard transformation, and watch the wave function collapse in real time.
            </p>
            <div className="pt-2">
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-quantum-950 font-bold text-sm shadow-xl shadow-teal-400/20 transition-all hover:scale-105"
              >
                <FlaskConical className="w-4 h-4" />
                Open Quantum Lab Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
