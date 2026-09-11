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
    <div className="min-h-screen bg-floral-white text-black-olive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="space-y-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-ivory border border-soft-sand text-xs font-semibold text-black-olive hover:bg-soft-sand transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-olive-mist" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-11 h-11 rounded-2xl bg-slate-glow text-soft-cyan border border-soft-cyan/30 shadow-md flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-muted-sage/20 text-black-olive font-bold border border-muted-sage/40">
                    Grounded Dirac Assistant
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-black-olive tracking-tight">AI Quantum Teaching Assistant</h1>
                <p className="text-xs text-olive-mist">
                  Powered by Google Gemini Flash API with rate limiting, Qiskit simulation grounding, and anti-hallucination guardrails
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs (Anchored Black Olive Pill Bar) */}
          <div className="flex items-center bg-black-olive p-1.5 rounded-2xl shadow-md border border-black-olive/40 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/70 hover:text-warm-ivory'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-warm-gold" />
              <span>Gemini Flash Chat</span>
              <span className="w-2 h-2 rounded-full bg-soft-cyan shadow-sm" />
            </button>
            <button
              onClick={() => setActiveTab('circuit')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'circuit'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/70 hover:text-warm-ivory'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-muted-sage" />
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

            <div className="lg:col-span-4 space-y-5">
              {/* About Card (Light Surface #FFFDF7) */}
              <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-ivory border border-soft-sand flex items-center justify-center text-black-olive shadow-sm">
                    <Sparkles className="w-4 h-4 text-warm-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider">About Gemini Tutor</h3>
                    <p className="text-[11px] text-olive-mist">Google Gemini Flash LLM</p>
                  </div>
                </div>

                <p className="text-xs text-black-olive/80 leading-relaxed">
                  The AI Tutor acts as a quantum computing teaching assistant for beginners, grounded in Dirac bra-ket notation, probability amplitudes, and quantum logic gates.
                </p>

                {/* AI Tutor Video Demonstration */}
                <div className="pt-3 border-t border-soft-sand flex flex-col items-center">
                  <div className="w-full max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-2xl border border-soft-sand bg-warm-ivory/60 shadow-inner flex items-center justify-center">
                    <video
                      controls
                      playsInline
                      muted
                      preload="metadata"
                      className="w-full h-auto object-contain rounded-2xl block"
                      title="AI Quantum Tutor demonstration video"
                      aria-label="AI Quantum Tutor demonstration video"
                    >
                      <source src={`${import.meta.env.BASE_URL}video/Use_the_provided_AI_Quantum_Tu.mp4`} type="video/mp4" />
                      <source src="./video/Use_the_provided_AI_Quantum_Tu.mp4" type="video/mp4" />
                      <source src="/video/Use_the_provided_AI_Quantum_Tu.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* Security & Rate Limits (Dark Anchor Card - Cocoa Noir) */}
              <div className="p-6 rounded-3xl bg-cocoa-noir text-warm-ivory border border-cocoa-noir/40 shadow-md space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-warm-gold">
                  <ShieldAlert className="w-4 h-4 text-warm-gold" /> Security &amp; Rate Limits
                </h3>
                <div className="text-xs text-warm-ivory/80 space-y-2.5 leading-relaxed">
                  <p>
                    Your API key is never transmitted or exposed to browser clients. Requests pass through the local FastAPI backend with rate limiting to prevent quota exhaustion.
                  </p>
                  <div className="bg-deep-slate/80 p-3 rounded-2xl border border-soft-slate/40 font-mono text-[11px] text-soft-cyan">
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
              <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-olive-mist" /> Active Learning Scenario
                  </h3>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-warm-ivory border border-soft-sand text-black-olive">
                    Real Circuit Context
                  </span>
                </div>
                
                <p className="text-xs text-olive-mist leading-relaxed">
                  Select a simulated quantum scenario to load its exact circuit wires, gates, and simulation results into the AI tutor:
                </p>

                <div className="space-y-3">
                  {SAMPLE_SCENARIOS.map((scen) => {
                    const Icon = scen.icon;
                    const isActive = activeScenario === scen.id;
                    return (
                      <button
                        key={scen.id}
                        onClick={() => setActiveScenario(scen.id)}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${
                          isActive
                            ? 'bg-slate-glow text-floral-white border-soft-cyan/40 shadow-md'
                            : 'bg-warm-ivory/70 border-soft-sand hover:border-olive-mist text-black-olive hover:bg-warm-ivory'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isActive ? 'bg-soft-cyan text-deep-slate font-bold' : 'bg-floral-white border border-soft-sand text-black-olive'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-floral-white' : 'text-black-olive'}`}>{scen.name}</span>
                        </div>
                        <p className={`text-[11px] pl-9.5 ${isActive ? 'text-warm-ivory/80' : 'text-black-olive/70'}`}>{scen.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Context Telemetry Card (Slate Glow Dark Technical Card) */}
              <div className="p-6 rounded-3xl bg-slate-glow text-warm-ivory border border-soft-slate/40 shadow-md space-y-3">
                <h3 className="text-xs font-bold text-soft-cyan uppercase tracking-wider">Context Telemetry Passed to AI</h3>
                <pre className="p-4 bg-deep-slate border border-soft-slate/30 rounded-2xl font-mono text-[10px] text-warm-ivory/80 overflow-x-auto">
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
