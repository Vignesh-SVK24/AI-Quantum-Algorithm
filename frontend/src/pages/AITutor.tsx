import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Sparkles, Layers, Cpu, Compass, BookOpen } from 'lucide-react';
import { AITutorPanel } from '../components/AITutorPanel';
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
  const [activeScenario, setActiveScenario] = useState<string>('hadamard');
  const selected = SAMPLE_SCENARIOS.find(s => s.id === activeScenario) || SAMPLE_SCENARIOS[0];

  return (
    <div className="min-h-screen quantum-grid-bg text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AI Quantum Teaching Assistant</h1>
                <p className="text-xs text-slate-400">
                  Context-aware Socratic tutor grounded in your circuit states and algorithm parameters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Context Scenario Switcher */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" /> Active Learning Scenario
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Real Context
                </span>
              </div>
              
              <p className="text-xs text-slate-400">
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
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">{scen.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-8.5">{scen.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Context Telemetry Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Context Telemetry Passed to AI</h3>
              <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-teal-300 overflow-x-auto">
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

      </div>
    </div>
  );
};

export default AITutor;
