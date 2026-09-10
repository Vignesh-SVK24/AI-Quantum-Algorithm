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
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-ivory border border-soft-sand text-xs font-mono text-black-olive shadow-sm">
                <span className="w-2 h-2 rounded-full bg-warm-gold animate-pulse" />
                <span className="tracking-widest uppercase text-[11px] font-semibold text-olive-mist">
                  Your Quantum Learning Journey
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black-olive leading-[1.15]">
                Explore the <br />
                <span className="text-olive-mist font-serif italic">Quantum World</span>
              </h1>

              <p className="text-base sm:text-lg text-black-olive/80 font-normal leading-relaxed max-w-xl">
                Master quantum concepts, algorithms, circuits, and practical quantum thinking. 
                Follow our proven <span className="font-semibold text-black-olive">Learn → Build → Simulate → Visualize → Understand</span> pathway 
                grounded in live Qiskit simulation and interactive exploration.
              </p>

              {/* Hero Search Bar */}
              <div className="pt-1 pb-1">
                <HeroSearchBar />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/basics"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black-olive text-floral-white font-semibold text-sm shadow-sm hover:bg-deep-olive hover:shadow-md transition-all active:scale-98"
                >
                  <BookOpen className="w-4 h-4 text-warm-gold" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-1.5 border-black-olive text-black-olive font-semibold text-sm hover:bg-warm-ivory transition-all active:scale-98"
                >
                  <FlaskConical className="w-4 h-4 text-olive-mist" />
                  <span>Open Quantum Lab</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive font-semibold text-sm hover:bg-soft-sand transition-all active:scale-98"
                >
                  <LayoutDashboard className="w-4 h-4 text-olive-mist" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Credibility / Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-olive-mist">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-muted-sage" />
                  <span>Exact Qiskit Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-muted-sage" />
                  <span>No Hardware Setup Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-muted-sage" />
                  <span>Bloch &amp; Statevector Visuals</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Schematic Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono text-olive-mist flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-warm-gold" />
                  INTERACTIVE QUANTUM TESTBENCH
                </span>
                <span className="text-deep-olive font-semibold text-[11px] bg-warm-ivory px-2 py-0.5 rounded border border-soft-sand">
                  Statevector Engine
                </span>
              </div>

              <div className="bg-[#FFFDF7] border border-soft-sand rounded-2xl p-4 sm:p-6 shadow-sm">
                <CircuitPlaceholder onRunTest={handleRunTest} isRunning={isSimulating} />

                {/* Simulation Result Inset Card */}
                {testResult && (
                  <div className="mt-4 rounded-xl bg-warm-ivory/80 border border-soft-sand p-4 font-mono text-xs text-black-olive space-y-2.5">
                    <div className="flex items-center justify-between text-black-olive font-semibold">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-warm-gold" />
                        <span>{testResult.circuit_name}</span>
                      </div>
                      <span className="text-[11px] text-olive-mist">{testResult.shots} shots</span>
                    </div>
                    <p className="text-olive-mist text-[11px] font-sans">{testResult.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-floral-white border border-soft-sand">
                        <span className="text-olive-mist block text-[10px] uppercase">Statevector:</span>
                        <span className="text-deep-olive font-bold text-xs">
                          |0⟩: {testResult.statevector[0].real.toFixed(3)}, |1⟩: {testResult.statevector[1].real.toFixed(3)}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-floral-white border border-soft-sand">
                        <span className="text-olive-mist block text-[10px] uppercase">Measured Counts:</span>
                        <span className="text-deep-olive font-bold text-xs">
                          {Object.entries(testResult.measurement_counts).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-4 p-3.5 rounded-xl bg-warm-ivory border border-cocoa-noir/30 text-cocoa-noir text-xs font-mono">
                    Connection notice: {errorMsg} (Ensure backend server is running on port 8000)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Learning Paradigm */}
      <section className="py-16 bg-warm-ivory/40 border-y border-soft-sand/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-mono tracking-widest text-olive-mist uppercase font-semibold">
              Pedagogical Methodology
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-black-olive">
              The 5-Stage Framework for Quantum Intuition
            </p>
            <p className="text-black-olive/75 text-sm leading-relaxed">
              Traditional linear algebra courses overwhelm learners with formal matrix math. 
              Our platform grounds every equation in tangible circuit operations and instant visual feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={step.title}
                className="relative p-5 rounded-2xl bg-[#FFFDF7] border border-soft-sand shadow-sm hover:border-black-olive/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-mono font-bold text-olive-mist">
                      {step.num}
                    </span>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-soft-sand hidden md:block" />
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

      {/* Core Feature Modules Grid: Balanced Light & Dark Anchors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-olive-mist uppercase font-semibold mb-2">
                Core Modules
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-black-olive">
                Everything You Need to Master Quantum Computing
              </p>
            </div>
            <Link 
              to="/lab" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black-olive hover:text-deep-olive hover:underline transition-colors"
            >
              Explore all modules <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Quantum Lab (Light Card) */}
            <div className="p-7 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm flex flex-col justify-between transition-all hover:border-black-olive/30 hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-warm-ivory border border-soft-sand flex items-center justify-center text-black-olive">
                  <FlaskConical className="w-6 h-6 text-soft-cyan" />
                </div>
                <h3 className="text-xl font-bold text-black-olive">Quantum Lab</h3>
                <p className="text-xs text-black-olive/70 leading-relaxed">
                  Drag-and-drop quantum circuit workbench. Place Hadamard, Pauli, Phase, and entangling CNOT gates 
                  with real-time statevector evolution and 3D Bloch sphere projections.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/lab" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive font-semibold text-xs hover:bg-soft-sand transition-all"
                >
                  Enter Circuit Lab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: AI Quantum Tutor (Dark Slate Anchor) */}
            <div className="p-7 rounded-3xl bg-slate-glow text-floral-white shadow-slate-glow flex flex-col justify-between transition-all hover:border-soft-slate/40 border border-deep-slate">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-deep-slate flex items-center justify-center text-soft-cyan border border-soft-slate/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-floral-white">AI Quantum Tutor</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-soft-cyan/20 text-soft-cyan border border-soft-cyan/30">
                    Dual Engine
                  </span>
                </div>
                <p className="text-xs text-floral-white/80 leading-relaxed">
                  Context-aware tutor powered by Gemini and backed by the 55-topic local database. 
                  Explains probability amplitudes, Dirac bra-ket formalism, and scientific distinctions.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/tutor" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-slate text-soft-cyan border border-soft-cyan/30 font-semibold text-xs hover:bg-soft-cyan hover:text-deep-slate transition-all"
                >
                  Consult AI Tutor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Practice Arena (Dark Olive Anchor) */}
            <div className="p-7 rounded-3xl bg-black-olive text-floral-white shadow-botanical-glow flex flex-col justify-between transition-all hover:border-olive-mist/40 border border-deep-olive">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-deep-olive flex items-center justify-center text-warm-gold border border-olive-mist/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-floral-white">Practice Arena</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-gold/20 text-warm-gold border border-warm-gold/30">
                    3 Levels
                  </span>
                </div>
                <p className="text-xs text-floral-white/80 leading-relaxed">
                  Master quantum concepts through a 3-level progressive system: 9 rounds, 90 curated questions, 
                  with a 70% passing threshold and immediate scientific feedback.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/practice" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-olive text-warm-gold border border-warm-gold/30 font-semibold text-xs hover:bg-warm-gold hover:text-deep-olive transition-all"
                >
                  Enter Practice <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Dark Olive Raised Panel */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-black-olive text-floral-white border border-deep-olive shadow-botanical-glow p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            {/* Subtle orbital ring watermark */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-warm-gold/15 pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full border border-soft-cyan/15 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="text-xs font-mono tracking-widest text-warm-gold uppercase font-semibold">
                Start Building Now
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-floral-white tracking-tight">
                Ready to construct your first quantum superposition?
              </h2>
              <p className="text-floral-white/75 text-sm max-w-xl mx-auto leading-relaxed">
                Initialize your qubit in $|0\rangle$, apply the Hadamard transformation, and inspect 
                the resulting statevector $(|0\rangle + |1\rangle)/\sqrt{2}$ in real time.
              </p>
              <div className="pt-3">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-warm-gold text-deep-olive font-bold text-sm shadow-gold-glow hover:bg-opacity-90 transition-all active:scale-98"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Open Quantum Lab</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
