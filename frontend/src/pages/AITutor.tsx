import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Sparkles, Layers, Cpu, Compass, BookOpen, Zap, ShieldAlert } from 'lucide-react';
import { AITutorPanel } from '../components/AITutorPanel';
import { GeminiChat } from '../components/GeminiChat';
import { type TutorContext } from '../services/api';

const SAMPLE_SCENARIOS: { id: string; name: string; icon: any; context: TutorContext; desc: string }[] = [
  {
    id: 'hadamard',
    name: 'Single Qubit Superposition (|0⟩ → H)',
    icon: Sparkles,
    desc: 'Qubit q[0] initialized to |0⟩, Hadamard gate applied. Expected 50/50 probability distribution.',
    context: {
      page: 'Quantum Lab',
      circuit: [{ type: 'H', target: 0, step: 0 }],
      num_qubits: 1,
      simulation_result: {
        num_qubits: 1,
        num_gates: 1,
        probabilities: { '|0⟩': 0.5, '|1⟩': 0.5 },
        measurement_counts: { '|0⟩': 512, '|1⟩': 512 }
      }
    }
  },
  {
    id: 'bell',
    name: 'Entangled Bell State (|Φ⁺⟩)',
    icon: Layers,
    desc: '2 qubits with H on q[0] and CNOT from q[0] to q[1], producing (|00⟩ + |11⟩)/√2.',
    context: {
      page: 'Quantum Lab',
      circuit: [
        { type: 'H', target: 0, step: 0 },
        { type: 'CNOT', control: 0, target: 1, step: 1 }
      ],
      num_qubits: 2,
      simulation_result: {
        num_qubits: 2,
        num_gates: 2,
        probabilities: { '|00⟩': 0.5, '|11⟩': 0.5 },
        measurement_counts: { '|00⟩': 508, '|11⟩': 516 }
      }
    }
  },
  {
    id: 'deutsch',
    name: 'Deutsch-Jozsa Balanced Function',
    icon: Cpu,
    desc: 'Balanced XOR oracle evaluated in 1 quantum query using phase kickback.',
    context: {
      page: 'Algorithm Lab',
      algorithm_context: {
        algorithm: 'Deutsch-Jozsa',
        oracle_id: 'balanced_xor',
        oracle_type: 'balanced'
      }
    }
  },
  {
    id: 'grover',
    name: "Grover's Search for Target |10⟩",
    icon: Compass,
    desc: 'Amplitude amplification isolating target state |10⟩ with 100% theoretical probability.',
    context: {
      page: 'Algorithm Lab',
      algorithm_context: {
        algorithm: "Grover's Search",
        target_state: '10'
      }
    }
  }
];

export const AITutor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'circuit'>('chat');
  const [activeScenario, setActiveScenario] = useState<string>('hadamard');
  const selected = SAMPLE_SCENARIOS.find(s => s.id === activeScenario) || SAMPLE_SCENARIOS[0];

  return (
    <div className="min-h-screen quantum-grid-bg text-black-olive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-gray hover:text-slate-gray transition-colors shadow-neu-raised hover:shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-slate-gray rounded-xl">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-black-olive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">AI Quantum Teaching Assistant</h1>
                <p className="text-xs text-black-olive/70">
                  Powered by Google Gemini Flash API with rate limiting and secure proxy
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-floral-white p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? '   text-black-olive '
                  : 'text-black-olive/70 hover:text-black-olive hover:bg-floral-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Gemini Flash Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-floral-white animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab('circuit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'circuit'
                  ? '   text-black-olive '
                  : 'text-black-olive/70 hover:text-black-olive hover:bg-floral-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Circuit Context Assistant</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Gemini Flash Direct AI Chat */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <GeminiChat circuitContext={selected.context} />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-floral-white space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-floral-white flex items-center justify-center text-slate-gray">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">About Gemini Tutor</h3>
                    <p className="text-[11px] text-black-olive/70">Google Gemini Flash LLM</p>
                  </div>
                </div>

                <p className="text-xs text-black-olive leading-relaxed">
                  The AI Tutor acts as a quantum computing teaching assistant for beginners, grounded in Dirac bra-ket notation, probability amplitudes, and quantum logic gates.
                </p>

                <div className="space-y-2 pt-3">
                  <h4 className="text-[11px] font-semibold text-slate-gray uppercase tracking-wider">Features</h4>
                  <ul className="space-y-1.5 text-xs text-black-olive/70">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-gray font-bold">•</span>
                      <span>Beginner-friendly explanations without confusing jargon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-gray font-bold">•</span>
                      <span>Strict scientific accuracy (avoids "0 and 1 at same time" trope)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-gray font-bold">•</span>
                      <span>Exponential backoff on 429 rate limit errors (1s, 2s, 4s)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-gray font-bold">•</span>
                      <span>Server-side API key protection with sliding-window rate limit</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-floral-white space-y-3">
                <h3 className="text-xs font-bold text-black-olive/70 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-gray" /> Security &amp; Rate Limits
                </h3>
                <div className="text-xs text-black-olive/70 space-y-2">
                  <p>
                    Your API key is never transmitted or exposed to browser clients. Requests pass through the local FastAPI backend with rate limiting to prevent quota exhaustion.
                  </p>
                  <div className="bg-floral-white p-2.5 rounded-xl font-mono text-[10px] text-slate-gray">
                    Limit: 15 req/min per IP<br />
                    Backoff: 1s, 2s, 4s retry on 429
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Circuit Context-Aware Tutor */}
        {activeTab === 'circuit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Context Scenario Switcher */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-2xl bg-floral-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-gray" /> Active Learning Scenario
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-floral-white text-slate-gray">
                    Real Context
                  </span>
                </div>
                
                <p className="text-xs text-black-olive/70">
                  Select a simulated quantum scenario to load its exact circuit wires, gates, and simulation results into the AI tutor:
                </p>

                <div className="space-y-2.5">
                  {SAMPLE_SCENARIOS.map((scen) => {
                    const Icon = scen.icon;
                    const isActive = activeScenario === scen.id;
                    return (
                      <button
                        key={scen.id}
                        onClick={() => setActiveScenario(scen.id)}
                        className={`w-full text-left p-3.5 rounded-xl  transition-all ${
                          isActive
                            ? 'bg-floral-white   '
                            : 'bg-floral-white  hover:'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${isActive ? 'bg-floral-white text-black-olive' : 'bg-floral-white text-black-olive/70'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-black-olive">{scen.name}</span>
                        </div>
                        <p className="text-[11px] text-black-olive/70 pl-8.5">{scen.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Context Telemetry Card */}
              <div className="p-5 rounded-2xl bg-floral-white space-y-3">
                <h3 className="text-xs font-bold text-black-olive/70 uppercase tracking-wider">Context Telemetry Passed to AI</h3>
                <pre className="p-3.5 bg-floral-white rounded-xl font-mono text-[10px] text-slate-gray overflow-x-auto">
                  {JSON.stringify(selected.context, null, 2)}
                </pre>
              </div>
            </div>

            {/* Right Column: AI Tutor Chat Station */}
            <div className="lg:col-span-7">
              <AITutorPanel
                context={selected.context}
                compact={false}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AITutor;
