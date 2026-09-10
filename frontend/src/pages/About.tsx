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
  <div className="min-h-screen bg-transparent text-black-olive">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 pb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-semibold text-black-olive shadow-sm hover:bg-soft-sand transition-all mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-warm-gold" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 pt-1">
          <div className="w-10 h-10 rounded-2xl bg-warm-ivory border border-soft-sand flex items-center justify-center text-warm-gold shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black-olive tracking-tight">About &amp; Scientific References</h1>
            <p className="text-xs text-olive-mist">Authoritative academic grounding, curriculum sources, and platform architecture</p>
          </div>
        </div>
      </div>

      {/* Mission & Pedagogical Standards */}
      <div className="p-8 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-black-olive font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-muted-sage" /> Scientific Accuracy Commitment
        </div>
        <p className="text-sm text-black-olive/85 leading-relaxed">
          The <strong>Quantum Algorithm Learning Platform</strong> was developed to eliminate common misconceptions 
          in quantum computing education. Rather than relying on inaccurate popular analogies that describe qubits as &quot;being 0 and 1 at the same time&quot;, 
          our curriculum grounds every concept in rigorous quantum mechanics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5">
            <div className="font-bold text-black-olive flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-warm-gold" /> Probability Amplitudes
            </div>
            <p className="text-olive-mist leading-relaxed">
              Qubits exist in definite quantum states characterized by complex probability amplitudes |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5">
            <div className="font-bold text-black-olive flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-soft-cyan" /> Wavefunction Collapse
            </div>
            <p className="text-olive-mist leading-relaxed">
              Measurement irreversibly collapses the superposition into a classical bitstring according to Born&apos;s rule.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-warm-ivory/60 border border-soft-sand space-y-1.5">
            <div className="font-bold text-black-olive flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-muted-sage" /> Pure Simulation Math
            </div>
            <p className="text-olive-mist leading-relaxed">
              All circuits and algorithms are executed via the official Qiskit Statevector runtime rather than mock approximations.
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative References Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-black-olive">Curriculum References &amp; Literature</h2>
          <p className="text-xs text-olive-mist mt-1">Foundational papers, textbooks, and documentation powering this platform</p>
        </div>

        <div className="space-y-4">
          {REFERENCES.map((ref, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[#FFFDF7] border border-soft-sand hover:border-warm-gold/50 transition-all space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-black-olive">
                    {ref.title}
                  </h3>
                  <span className="text-xs text-olive-mist">{ref.authors}</span>
                </div>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive text-xs font-mono hover:bg-soft-sand transition-all self-start sm:self-auto font-semibold shadow-sm"
                >
                  <span>Read Source</span>
                  <ExternalLink className="w-3 h-3 text-warm-gold" />
                </a>
              </div>

              <p className="text-xs text-black-olive/80 leading-relaxed">
                {ref.desc}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {ref.topics.map((t, i) => (
                  <span 
                    key={i}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-warm-ivory border border-soft-sand text-olive-mist font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Summary - Dark Anchor */}
      <div className="p-6 rounded-3xl bg-black-olive text-floral-white shadow-xl border border-black-olive/40 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-warm-gold block mb-0.5">Platform Architecture:</span>
          <span className="text-warm-ivory/80">React 19 + TypeScript + Vite + Tailwind CSS v4 | Python 3.11 + FastAPI + Qiskit Statevector</span>
        </div>
        <span className="text-[11px] font-mono text-warm-gold bg-black-olive/80 border border-warm-gold/40 px-3.5 py-1.5 rounded-xl font-bold">
          Hackathon Release v1.0
        </span>
      </div>

    </div>
  </div>
);

export default About;
