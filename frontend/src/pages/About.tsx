import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  ExternalLink, 
  Atom, 
  Cpu, 
  ShieldCheck,
  Globe2
} from 'lucide-react';

const REFERENCES = [
  {
    title: "IBM Quantum Learning & The Qiskit Textbook",
    authors: "IBM Quantum Team",
    url: "https://learning.quantum.ibm.com/",
    desc: "Authoritative pedagogical curriculum for quantum circuits, Dirac ket notation, and gate transformations.",
    topics: ["Superposition", "Bloch Sphere", "Entanglement", "Qiskit SDK"]
  },
  {
    title: "Qiskit SDK v1.x Official Documentation",
    authors: "Qiskit Community / IBM",
    url: "https://docs.quantum.ibm.com/",
    desc: "Technical specification for Statevector simulation, QuantumCircuit primitives, and shot sampling.",
    topics: ["QuantumCircuit", "Statevector.from_instruction", "Sample Counts"]
  },
  {
    title: "Quantum Computation and Quantum Information (10th Anniversary Edition)",
    authors: "Michael A. Nielsen & Isaac L. Chuang (Cambridge University Press)",
    url: "https://doi.org/10.1017/CBO9780511976667",
    desc: "The standard canonical reference textbook on quantum computation, quantum algorithms, and density operators.",
    topics: ["Deutsch-Jozsa Algorithm", "Grover's Search", "Phase Kickback"]
  },
  {
    title: "Lecture Notes on Quantum Computation (Physics 219)",
    authors: "John Preskill (California Institute of Technology)",
    url: "http://theory.caltech.edu/~preskill/ph219/index.html",
    desc: "In-depth mathematical foundations of quantum states, measurement theory, and entanglement fidelity.",
    topics: ["Born's Rule", "Unitary Evolution", "Hilbert Spaces"]
  },
  {
    title: "Rapid Solution of Problems by Quantum Computation (1992)",
    authors: "David Deutsch & Richard Jozsa (Proc. R. Soc. Lond. A)",
    url: "https://doi.org/10.1098/rspa.1992.0167",
    desc: "The original paper introducing the first deterministic quantum algorithm providing exponential separation over classical deterministic algorithms.",
    topics: ["Deutsch-Jozsa Algorithm", "Constant vs Balanced"]
  },
  {
    title: "A Fast Quantum Mechanical Algorithm for Database Search (1996)",
    authors: "Lov K. Grover (Physical Review Letters / ACM STOC)",
    url: "https://doi.org/10.1145/237814.237866",
    desc: "The foundational paper proving optimal O(√N) search in unstructured databases via amplitude amplification.",
    topics: ["Grover Iteration", "Inversion About Mean", "Oracle Operators"]
  }
];

export const About: React.FC = () => (
  <div className="min-h-screen quantum-grid-bg text-slate-200">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">About & Scientific References</h1>
            <p className="text-xs text-slate-400">Authoritative academic grounding, curriculum sources, and platform architecture</p>
          </div>
        </div>
      </div>

      {/* Mission & Pedagogical Standards */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" /> Scientific Accuracy Commitment
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          The <strong>Quantum Algorithm Learning Platform</strong> was developed to eliminate common misconceptions 
          in quantum computing education. Unlike popular science analogies that describe qubits as "being in two states at once", 
          our curriculum grounds every concept in rigorous quantum mechanics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-teal-300 flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5" /> Probability Amplitudes
            </div>
            <p className="text-slate-400 leading-relaxed">
              Qubits exist in definite quantum states characterized by complex probability amplitudes |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Wavefunction Collapse
            </div>
            <p className="text-slate-400 leading-relaxed">
              Measurement irreversibly collapses the superposition into a classical bitstring according to Born's rule.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Pure Simulation Math
            </div>
            <p className="text-slate-400 leading-relaxed">
              All circuits and algorithms are executed via the official Qiskit Statevector runtime rather than mock approximations.
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative References Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">Curriculum References & Literature</h2>
          <p className="text-xs text-slate-400 mt-1">Foundational papers, textbooks, and documentation powering this platform</p>
        </div>

        <div className="space-y-3">
          {REFERENCES.map((ref, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white hover:text-teal-300 transition-colors">
                    {ref.title}
                  </h3>
                  <span className="text-xs text-slate-400">{ref.authors}</span>
                </div>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-mono transition-colors self-start sm:self-auto"
                >
                  <span>Read Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ref.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {ref.topics.map((t, i) => (
                  <span 
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Summary */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-200 block mb-0.5">Platform Architecture:</span>
          <span>React 19 + TypeScript + Vite + Tailwind CSS v4 | Python 3.11 + FastAPI + Qiskit Statevector</span>
        </div>
        <span className="text-[11px] font-mono text-teal-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Hackathon Demo Release v1.0
        </span>
      </div>

    </div>
  </div>
);

export default About;
