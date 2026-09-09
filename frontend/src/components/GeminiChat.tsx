import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck,
  Cpu,
  BookOpen,
  ExternalLink,
  Code2,
  Check,
  Copy,
  Layers,
  GraduationCap
} from 'lucide-react';
import { sendTutorChat, type TutorContext, type TutorSourceCitation } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  sources?: TutorSourceCitation[];
  classification?: string;
  circuit_data?: {
    num_qubits: number;
    gates: Array<{ type: string; target: number; step: number; control?: number }>;
  } | null;
  qiskit_code?: string | null;
  qiskit_verified?: boolean | null;
}

interface GeminiChatProps {
  circuitContext?: TutorContext | null;
  onLoadCircuit?: (circuitData: any) => void;
}

const STARTER_QUESTIONS = [
  'What does the Hadamard gate do?',
  'Why is superposition not "0 and 1 at the same time"?',
  'Show me a circuit that creates a Bell state',
  'How does Grover search achieve quadratic speedup?',
  'Explain the Deutsch-Jozsa phase kickback'
];

export const GeminiChat: React.FC<GeminiChatProps> = ({ circuitContext, onLoadCircuit }) => {
  const navigate = useNavigate();
  const [difficultyMode, setDifficultyMode] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "👋 Hello! I am your **Quantum Computing AI Tutor**, grounded in IBM Quantum Learning and Qiskit documentation.\n\nI can explain concepts step-by-step, generate quantum circuits for the Circuit Builder, provide verified Qiskit code, and adjust explanation depth to your level.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        {
          name: "IBM Quantum Learning",
          title: "Basics of Quantum Information",
          url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information"
        }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim();
    if (!textToSend || loading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await sendTutorChat(textToSend, difficultyMode, circuitContext);
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        classification: response.classification,
        circuit_data: response.circuit_data,
        qiskit_code: response.qiskit_code,
        qiskit_verified: response.qiskit_verified
      };
      setMessages(prev => [...prev, tutorMessage]);
    } catch (err: any) {
      const displayError = err?.message || 'The tutor is busy, please try again in a moment.';
      setErrorMessage(displayError);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleLoadCircuit = (circuitData: any) => {
    if (!circuitData) return;
    try {
      localStorage.setItem('quantum_active_circuit', JSON.stringify(circuitData.gates || []));
      localStorage.setItem('quantum_active_qubits', String(circuitData.num_qubits || 2));
      if (onLoadCircuit) {
        onLoadCircuit(circuitData);
      } else {
        navigate('/lab');
      }
    } catch (e) {
      console.error('Failed to load circuit into storage', e);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: "👋 Chat cleared. What would you like to explore next in quantum computing?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col h-[680px] bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Quantum Knowledge Assistant</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in IBM Quantum Learning &amp; Qiskit Documentation
            </p>
          </div>
        </div>

        {/* Difficulty Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] font-medium text-slate-400 px-1.5 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-indigo-400" /> Mode:
          </span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDifficultyMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all ${
                difficultyMode === mode
                  ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] text-rose-400 hover:text-rose-200 underline ml-3 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2.5 ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                {/* Main Message Text */}
                <div className="leading-relaxed whitespace-pre-wrap font-sans break-words selection:bg-teal-500/30">
                  {m.text}
                </div>

                {/* Circuit Data Preview & Load Action */}
                {m.circuit_data && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Layers className="w-3.5 h-3.5 text-teal-400" />
                        <span>Generated Quantum Circuit</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {m.circuit_data.num_qubits} Qubit(s) · {m.circuit_data.gates.length} Gate(s) [
                        {m.circuit_data.gates.map(g => g.type).join(', ')}]
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadCircuit(m.circuit_data)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all flex-shrink-0"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Load into Circuit Builder</span>
                    </button>
                  </div>
                )}

                {/* Verified Qiskit Code Block */}
                {m.qiskit_code && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{m.qiskit_verified ? '✓ Verified with Qiskit 2.5' : 'Qiskit Python Code'}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(m.qiskit_code!, m.id)}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedCodeId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto selection:bg-teal-500/30">
                      <code>{m.qiskit_code}</code>
                    </pre>
                  </div>
                )}

                {/* Grounded Source Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-teal-400" /> Grounded Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {m.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url || 'https://learning.quantum.ibm.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-[10px] text-teal-300 hover:text-teal-200 hover:bg-teal-500/20 transition-colors"
                        >
                          <span>{src.title ? `${src.name} — ${src.title}` : src.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono text-right ${
                    isUser ? 'text-indigo-200/70' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">You</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Typing State */}
        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs py-2 animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 text-teal-300/90 font-medium">
              <span>Tutor is consulting knowledge base</span>
              <span className="inline-flex gap-0.5">
                <span className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 pb-0.5">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 flex items-center gap-1 mr-1 flex-shrink-0">
            <Cpu className="w-3 h-3 text-indigo-400" /> Suggestions:
          </span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field and Send Button */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question in ${difficultyMode} mode (e.g. 'What does the Hadamard gate do?' or 'Show me a Bell circuit')...`}
            disabled={loading}
            maxLength={2000}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white font-medium text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span>Grounded via RAG &amp; Rate-Limited (15 req/min)</span>
          </span>
          <span>{input.length}/2000</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiChat;
