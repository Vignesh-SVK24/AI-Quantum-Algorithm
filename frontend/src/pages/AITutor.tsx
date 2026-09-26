import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Sparkles, Layers, Cpu, Compass, BookOpen, Zap } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM assignments to bypass mobile WebKit/React JSX muted bug
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Autoplay policy: will start on first touch/interaction
        });
      }
    };

    playVideo();

    // Fallback: start on first touch or click on mobile devices
    const handleInteraction = () => {
      playVideo();
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-floral-white text-black-olive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="space-y-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-ivory border border-soft-sand text-sm font-semibold text-black-olive hover:bg-soft-sand transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-olive-mist" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-glow text-soft-cyan border border-soft-cyan/30 shadow-md flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-wider px-3 py-1 rounded-full bg-muted-sage/20 text-black-olive font-bold border border-muted-sage/40">
                    AI Quantum Assistant
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-black-olive tracking-tight mt-0.5">AI Quantum Teaching Assistant</h1>
                <p className="text-sm text-black-olive/80 font-medium">
                  Ask questions, explore quantum circuits, and get instant verified explanations.
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs (Anchored Black Olive Pill Bar) */}
          <div className="flex items-center bg-black-olive p-1.5 rounded-2xl shadow-md border border-black-olive/40 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/80 hover:text-warm-ivory'
              }`}
            >
              <Zap className="w-4 h-4 text-warm-gold" />
              <span>Interactive Tutor Chat</span>
              <span className="w-2 h-2 rounded-full bg-soft-cyan shadow-sm" />
            </button>
            <button
              onClick={() => setActiveTab('circuit')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'circuit'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/40 shadow-sm'
                  : 'text-warm-ivory/80 hover:text-warm-ivory'
              }`}
            >
              <BookOpen className="w-4 h-4 text-muted-sage" />
              <span>Circuit Context Assistant</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Gemini & Groq Direct AI Chat */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* About Card with AI Tutor Video (Order 2 on mobile, Col-span-4 on desktop) */}
            <div className="order-2 lg:order-2 lg:col-span-4 space-y-5">
              {/* About Card (Light Surface #FFFDF7) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-ivory border border-soft-sand flex items-center justify-center text-black-olive shadow-sm">
                    <Sparkles className="w-5 h-5 text-warm-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black-olive uppercase tracking-wider">About AI Tutor</h3>
                    <p className="text-xs text-olive-mist font-medium">Smart Quantum Assistant</p>
                  </div>
                </div>

                <p className="text-sm text-black-olive/85 leading-relaxed">
                  Your personalized quantum computing guide. Ask questions about superposition, bra-ket notation, quantum gates, or algorithms, and receive clear, step-by-step explanations.
                </p>

                {/* AI Tutor Video Demonstration (Mobile-Optimized & Autoplay Safe) */}
                <div className="pt-3 border-t border-soft-sand flex flex-col items-center">
                  <div className="w-full max-w-[240px] sm:max-w-[280px] aspect-[9/16] min-h-[380px] sm:min-h-[440px] overflow-hidden rounded-2xl border border-soft-sand bg-warm-ivory/60 shadow-inner flex items-center justify-center relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      preload="auto"
                      src={`${import.meta.env.BASE_URL}video/Use_the_provided_AI_Quantum_Tu.mp4`}
                      className="w-full h-full object-contain rounded-2xl block select-none pointer-events-none"
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
            </div>

            {/* Main Chat: Order 1 on mobile, Col-span-8 on desktop */}
            <div className="order-1 lg:order-1 lg:col-span-8 space-y-5">
              <GeminiChat circuitContext={selected.context} />
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
                  <h3 className="text-sm font-bold text-black-olive uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-olive-mist" /> Learning Scenarios
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive">
                    Live Circuit Context
                  </span>
                </div>
                
                <p className="text-sm text-black-olive/80 leading-relaxed">
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
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-soft-cyan text-deep-slate font-bold' : 'bg-floral-white border border-soft-sand text-black-olive'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-sm font-bold ${isActive ? 'text-floral-white' : 'text-black-olive'}`}>{scen.name}</span>
                        </div>
                        <p className={`text-xs pl-10 leading-relaxed ${isActive ? 'text-warm-ivory/85' : 'text-black-olive/75'}`}>{scen.desc}</p>
                      </button>
                    );
                  })}
                </div>
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
