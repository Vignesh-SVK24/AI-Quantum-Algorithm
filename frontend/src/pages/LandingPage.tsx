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
import { HeroSearchBar } from '../components/HeroSearchBar';
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
    <div className="flex flex-col min-h-screen bg-floral-white text-black-olive">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-floral-white shadow-neu-pressed text-xs font-mono text-slate-gray">
                <Sparkles className="w-3.5 h-3.5 text-slate-gray" />
                <span>Next-Generation Quantum Pedagogy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black-olive leading-[1.15]">
                Learn Quantum Computing by{' '}
                <span className="text-slate-gray underline decoration-slate-gray/30 underline-offset-8">
                  Building and Exploring
                </span>
              </h1>

              <p className="text-base sm:text-lg text-black-olive/80 font-normal leading-relaxed max-w-xl">
                Demystify quantum computing through an interactive, experiential framework. 
                Follow our proven <span className="font-semibold text-black-olive">Learn → Build → Simulate → Visualize → Understand</span> pathway 
                from basic superposition to real-world quantum algorithm design.
              </p>

              {/* Hero Search Bar (Dark Chrome) */}
              <div className="pt-1 pb-1">
                <HeroSearchBar />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-gray text-floral-white font-semibold text-sm shadow-neu-raised transition-all hover:shadow-neu-pressed active:scale-98"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Open Quantum Lab</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <Link
                  to="/basics"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-floral-white text-black-olive font-semibold text-sm shadow-neu-raised transition-all hover:shadow-neu-pressed active:scale-98"
                >
                  <BookOpen className="w-4 h-4 text-slate-gray" />
                  <span>Start Quantum Basics</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-floral-white text-black-olive font-semibold text-sm shadow-neu-raised transition-all hover:shadow-neu-pressed active:scale-98"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-gray" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Credibility / Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-black-olive/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-gray" />
                  <span>Exact Qiskit Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-gray" />
                  <span>No Hardware Setup Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-gray" />
                  <span>Bloch &amp; Statevector Visuals</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Schematic Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono text-black-olive/70 flex items-center justify-between px-1">
                <span>LIVE CIRCUIT PREVIEW (INTERACTIVE)</span>
                <span className="text-slate-gray font-semibold">v1.0 Ready</span>
              </div>

              <CircuitPlaceholder onRunTest={handleRunTest} isRunning={isSimulating} />

              {/* Simulation Result Inset Card */}
              {testResult && (
                <div className="rounded-2xl bg-floral-white p-5 shadow-neu-pressed font-mono text-xs text-black-olive space-y-2.5">
                  <div className="flex items-center justify-between text-slate-gray font-semibold">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>{testResult.circuit_name}</span>
                    </div>
                    <span className="text-[11px] text-black-olive/60">{testResult.shots} shots</span>
                  </div>
                  <p className="text-black-olive/70 text-[11px] font-sans">{testResult.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-floral-white shadow-neu-raised">
                      <span className="text-black-olive/60 block text-[10px] uppercase">Statevector:</span>
                      <span className="text-slate-gray font-bold text-xs">
                        |0⟩: {testResult.statevector[0].real.toFixed(3)}, |1⟩: {testResult.statevector[1].real.toFixed(3)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-floral-white shadow-neu-raised">
                      <span className="text-black-olive/60 block text-[10px] uppercase">Measured Counts:</span>
                      <span className="text-black-olive font-bold text-xs">
                        {Object.entries(testResult.measurement_counts).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-floral-white shadow-neu-pressed text-black-olive text-xs font-mono">
                  Connection notice: {errorMsg} (Ensure backend server is running on port 8000)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Learning Paradigm */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-mono tracking-widest text-slate-gray uppercase">
              Pedagogical Methodology
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-black-olive">
              The 5-Stage Framework for Quantum Intuition
            </p>
            <p className="text-black-olive/70 text-sm">
              Traditional linear algebra courses overwhelm learners with formalism. 
              Our platform grounds every equation in tangible circuit operations and visual feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {steps.map((step, idx) => (
              <div 
                key={step.title}
                className="relative p-5 rounded-2xl bg-floral-white shadow-neu-raised transition-all hover:shadow-neu-pressed flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-mono font-bold text-slate-gray">
                      {step.num}
                    </span>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-black-olive/40 hidden md:block" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-black-olive mb-1.5">{step.title}</h3>
                  <p className="text-xs text-black-olive/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Feature Modules Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-slate-gray uppercase mb-2">
                Core Modules
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-black-olive">
                Everything You Need to Master Quantum Computing
              </p>
            </div>
            <Link 
              to="/lab" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-gray hover:underline transition-colors"
            >
              Explore all modules <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Quantum Lab */}
            <div className="p-7 rounded-3xl bg-floral-white shadow-neu-raised flex flex-col justify-between transition-all hover:shadow-neu-pressed">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black-olive">Quantum Lab</h3>
                <p className="text-xs text-black-olive/70 leading-relaxed">
                  Drag-and-drop quantum circuit workbench. Place Hadamard, Pauli, Phase, and entangling CNOT gates 
                  with real-time statevector evolution and probability plots.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/lab" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-floral-white text-slate-gray font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all"
                >
                  Enter Circuit Lab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Algorithm Lab */}
            <div className="p-7 rounded-3xl bg-floral-white shadow-neu-raised flex flex-col justify-between transition-all hover:shadow-neu-pressed">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black-olive">Algorithm Lab</h3>
                <p className="text-xs text-black-olive/70 leading-relaxed">
                  Walk through famous quantum algorithms including Deutsch-Jozsa oracle analysis, Grover's database 
                  search amplification, and Quantum Fourier Transform.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/algorithms" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-floral-white text-slate-gray font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all"
                >
                  Explore Algorithms <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: AI Quantum Tutor */}
            <div className="p-7 rounded-3xl bg-floral-white shadow-neu-raised flex flex-col justify-between transition-all hover:shadow-neu-pressed">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black-olive">AI Quantum Tutor</h3>
                <p className="text-xs text-black-olive/70 leading-relaxed">
                  Context-aware AI tutor grounded in IBM Quantum Learning. Debugs circuit mistakes, 
                  explains probability amplitudes, and generates custom practice questions.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/tutor" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-floral-white text-slate-gray font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all"
                >
                  Meet AI Tutor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Raised Panel */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-floral-white shadow-neu-raised-lg p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-black-olive tracking-tight">
              Ready to construct your first quantum superposition?
            </h2>
            <p className="text-black-olive/70 text-sm max-w-xl mx-auto">
              Start with one qubit, apply the Hadamard transformation, and watch the statevector update in real time.
            </p>
            <div className="pt-2">
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-gray text-floral-white font-bold text-sm shadow-neu-raised transition-all hover:shadow-neu-pressed active:scale-98"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open Quantum Lab Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
