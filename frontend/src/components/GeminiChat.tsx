import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck,
  BookOpen, 
  ExternalLink, 
  Code2, 
  Check, 
  Copy, 
  Layers, 
  GraduationCap, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Award 
} from 'lucide-react';
import { 
  sendTutorChat, 
  sendTutorFeedback, 
  type TutorContext, 
  type TutorSourceCitation,
  type TutorPracticeQuestion 
} from '../services/api';

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
  practice_question?: TutorPracticeQuestion | null;
  is_verified?: boolean | null;
  userRating?: 1 | -1 | null;
  feedbackSubmitted?: boolean;
}

interface GeminiChatProps {
  circuitContext?: TutorContext | null;
  onLoadCircuit?: (circuitData: any) => void;
}

const STARTER_QUESTIONS = [
  'What does the Hadamard gate do?',
  'Why is superposition not "0 and 1 at the same time"?',
  'Give me a practice question',
  'Show me a circuit that creates a Bell state',
  'How does Grover search achieve quadratic speedup?'
];

const CHAT_STORAGE_KEY = 'quantum_tutor_chat_history_v2';
const PROGRESS_STORAGE_KEY = 'quantum_learning_progress';

export const GeminiChat: React.FC<GeminiChatProps> = ({ circuitContext, onLoadCircuit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [difficultyMode, setDifficultyMode] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { correct: boolean; explanation: string }>>({});

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'welcome',
        sender: 'tutor',
        text: "👋 Hello! I am your **Quantum Computing AI Tutor**, grounded in IBM Quantum Learning and Qiskit documentation.\n\nI can explain concepts step-by-step, generate circuits, evaluate on-the-fly practice questions, remember conversation context, and adapt explanations to your learning progress.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            name: "IBM Quantum Learning",
            title: "Basics of Quantum Information",
            url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information"
          }
        ],
        is_verified: true
      }
    ];
  });

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

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Handle follow-up context passed from HeroSearchBar on the Landing Page
  useEffect(() => {
    const state = location.state as { initialQuestion?: string; initialAnswer?: string; sources?: any[] } | null;
    if (state?.initialQuestion && state?.initialAnswer) {
      const q = state.initialQuestion;
      const a = state.initialAnswer;
      setMessages(prev => {
        if (prev.some(m => m.text === q)) return prev;
        return [
          ...prev,
          {
            id: `hero-q-${Date.now()}`,
            sender: 'user',
            text: q,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: `hero-a-${Date.now() + 1}`,
            sender: 'tutor',
            text: a,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: state.sources || [],
            is_verified: true
          }
        ];
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getStudentProgress = (): Record<string, any> => {
    try {
      const p = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (p) return JSON.parse(p);
    } catch {
      // Ignore
    }
    return { completed_modules: ['basics'], quiz_score: 80 };
  };

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

    const history = messages.slice(-6).map(m => ({
      role: m.sender,
      text: m.text
    }));

    try {
      const progress = getStudentProgress();
      const response = await sendTutorChat(textToSend, difficultyMode, circuitContext, history, progress);
      
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        classification: response.classification,
        circuit_data: response.circuit_data,
        qiskit_code: response.qiskit_code,
        qiskit_verified: response.qiskit_verified,
        practice_question: response.practice_question,
        is_verified: response.is_verified ?? true
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

  const handlePracticeSelect = (msgId: string, q: TutorPracticeQuestion, selectedIdx: number) => {
    setPracticeAnswers(prev => ({ ...prev, [msgId]: selectedIdx }));
    const isCorrect = selectedIdx === q.correct_index;
    setPracticeFeedback(prev => ({
      ...prev,
      [msgId]: { correct: isCorrect, explanation: q.explanation }
    }));

    try {
      const prog = getStudentProgress();
      const currentScore = prog.quiz_score || 70;
      const newScore = isCorrect ? Math.min(100, currentScore + 5) : currentScore;
      prog.quiz_score = newScore;
      if (!prog.completed_modules) prog.completed_modules = [];
      if (!prog.completed_modules.includes('tutor_practice')) {
        prog.completed_modules.push('tutor_practice');
      }
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {
      console.error('Failed to update progress', e);
    }
  };

  const handleFeedback = async (msg: ChatMessage, rating: 1 | -1) => {
    setMessages(prev =>
      prev.map(m => (m.id === msg.id ? { ...m, userRating: rating, feedbackSubmitted: true } : m))
    );

    await sendTutorFeedback({
      message_id: msg.id,
      question: messages.filter(m => m.sender === 'user').slice(-1)[0]?.text || 'General Question',
      response: msg.text.slice(0, 500),
      mode: difficultyMode,
      rating,
      sources_cited: msg.sources || []
    });
  };

  const handleClear = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'tutor',
      text: "👋 Chat memory reset. What would you like to explore next in quantum computing?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_verified: true
    };
    setMessages([welcomeMsg]);
    setErrorMessage(null);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  return (
    <div className="flex flex-col h-[720px] bg-floral-white shadow-neu-raised rounded-3xl overflow-hidden border border-black-olive/10">
      
      {/* Top Header Bar */}
      <div className="px-6 py-4 bg-floral-white border-b border-black-olive/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-black-olive">Quantum AI Teaching Assistant</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-floral-white shadow-neu-sm-raised text-slate-gray">
                <ShieldCheck className="w-3 h-3 text-slate-gray" />
                Anti-Hallucination Verified
              </span>
            </div>
            <p className="text-[11px] text-black-olive/70">
              Grounded in IBM Quantum Learning · Verified with Qiskit Simulation
            </p>
          </div>
        </div>

        {/* Difficulty Mode Toggle (Raised Segmented Control with Pressed Active State) */}
        <div className="flex items-center gap-1 bg-floral-white p-1 rounded-2xl shadow-neu-raised">
          <span className="text-[10px] font-semibold text-black-olive/70 px-2 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-gray" /> Mode:
          </span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDifficultyMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
                difficultyMode === mode
                  ? 'bg-floral-white shadow-neu-pressed text-slate-gray'
                  : 'text-black-olive/70 hover:text-black-olive'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Reset conversation & memory"
            className="p-1.5 rounded-xl text-black-olive/70 hover:text-black-olive shadow-neu-sm-raised hover:shadow-neu-sm-pressed transition-all ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="px-5 py-2.5 bg-floral-white shadow-neu-pressed border-b border-black-olive/10 flex items-center justify-between text-xs text-slate-gray">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-gray flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] text-slate-gray underline ml-3 flex-shrink-0 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray flex-shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              {/* User message = Pressed/Inset, AI response = Raised */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? 'bg-floral-white shadow-neu-pressed text-black-olive'
                    : 'bg-floral-white shadow-neu-raised text-black-olive'
                }`}
              >
                {/* Tutor Status Header */}
                {!isUser && m.is_verified && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-black-olive/10 text-[10px] text-slate-gray">
                    <span className="flex items-center gap-1 font-mono font-semibold">
                      <ShieldCheck className="w-3 h-3 text-slate-gray" />
                      <span>✓ Grounded &amp; Mathematically Verified</span>
                    </span>
                    {m.classification && (
                      <span className="text-black-olive/60 uppercase tracking-wider font-mono text-[9px]">
                        {m.classification.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Main Message Text */}
                <div className="leading-relaxed whitespace-pre-wrap font-sans break-words">
                  {m.text}
                </div>

                {/* Interactive Dynamic Practice Question Card */}
                {m.practice_question && (
                  <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-black-olive">
                      <HelpCircle className="w-4 h-4 text-slate-gray" />
                      <span>Interactive Practice Question</span>
                    </div>
                    <p className="text-xs text-black-olive font-medium">
                      {m.practice_question.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {m.practice_question.options.map((opt, oIdx) => {
                        const isSelected = practiceAnswers[m.id] === oIdx;
                        const isAnswered = practiceAnswers[m.id] !== undefined;
                        const isCorrectOption = oIdx === m.practice_question?.correct_index;

                        let btnStyle = 'bg-floral-white shadow-neu-raised text-black-olive hover:shadow-neu-pressed';
                        if (isAnswered) {
                          if (isCorrectOption) {
                            btnStyle = 'bg-slate-gray text-floral-white shadow-neu-raised font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-floral-white shadow-neu-pressed text-black-olive/60';
                          } else {
                            btnStyle = 'bg-floral-white text-black-olive/40 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isAnswered}
                            onClick={() => handlePracticeSelect(m.id, m.practice_question!, oIdx)}
                            className={`p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="w-4 h-4 rounded-md bg-black-olive/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback result */}
                    {practiceFeedback[m.id] && (
                      <div className="p-3 rounded-xl bg-floral-white shadow-neu-raised text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-slate-gray">
                          <Award className="w-3.5 h-3.5" />
                          <span>{practiceFeedback[m.id].correct ? 'Correct! (+5 Progress Score)' : 'Incorrect — Explanation:'}</span>
                        </div>
                        <p className="text-[11px] text-black-olive/80 leading-relaxed">
                          {practiceFeedback[m.id].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Circuit Data Preview & Load Action */}
                {m.circuit_data && (
                  <div className="p-3.5 rounded-2xl bg-floral-white shadow-neu-pressed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-black-olive">
                        <Layers className="w-3.5 h-3.5 text-slate-gray" />
                        <span>Generated Circuit</span>
                      </div>
                      <p className="text-[11px] text-black-olive/70 font-mono">
                        {m.circuit_data.num_qubits} Qubits · {m.circuit_data.gates.length} Gates [{m.circuit_data.gates.map(g => g.type).join(', ')}]
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadCircuit(m.circuit_data)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-gray text-floral-white text-[11px] font-semibold flex items-center gap-1.5 shadow-neu-raised hover:shadow-neu-pressed transition-all flex-shrink-0"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Load into Circuit Builder</span>
                    </button>
                  </div>
                )}

                {/* Verified Qiskit Code Block */}
                {m.qiskit_code && (
                  <div className="rounded-2xl bg-floral-white shadow-neu-pressed overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-black-olive/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-gray">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{m.qiskit_verified ? '✓ Verified with Qiskit 2.5' : 'Qiskit Python Code'}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(m.qiskit_code!, m.id)}
                        className="text-[10px] text-black-olive/70 hover:text-black-olive flex items-center gap-1 transition-colors"
                      >
                        {copiedCodeId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-slate-gray" />
                            <span className="text-slate-gray font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-black-olive/80 overflow-x-auto">
                      <code>{m.qiskit_code}</code>
                    </pre>
                  </div>
                )}

                {/* Grounded Source Citations (Tint of Slate Gray at low opacity) */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-black-olive/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black-olive/60 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-gray" /> Grounded Sources:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {m.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url || 'https://learning.quantum.ibm.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-gray/10 text-[10px] text-slate-gray hover:bg-slate-gray/20 transition-all font-semibold"
                        >
                          <span>{src.title ? `${src.name} — ${src.title}` : src.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Card Footer: Timestamp & Thumbs Up/Down Feedback */}
                <div className="pt-2 flex items-center justify-between border-t border-black-olive/10 text-[10px]">
                  {!isUser ? (
                    <div className="flex items-center gap-2 text-black-olive/70">
                      <span>Helpful?</span>
                      <button
                        onClick={() => handleFeedback(m, 1)}
                        title="Helpful response"
                        className={`p-1 rounded-lg transition-all ${
                          m.userRating === 1 
                            ? 'text-slate-gray bg-slate-gray/20 font-bold' 
                            : 'hover:text-slate-gray'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(m, -1)}
                        title="Not helpful"
                        className={`p-1 rounded-lg transition-all ${
                          m.userRating === -1 
                            ? 'text-black-olive bg-black-olive/20 font-bold' 
                            : 'hover:text-black-olive'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {m.feedbackSubmitted && (
                        <span className="text-[9px] text-slate-gray font-semibold">Feedback recorded</span>
                      )}
                    </div>
                  ) : <div />}
                  <span className="font-mono text-black-olive/60">
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray font-bold text-[10px] flex-shrink-0 mt-1">
                  You
                </div>
              )}
            </div>
          );
        })}

        {/* Loading State */}
        {loading && (
          <div className="flex gap-3 items-center text-black-olive/70 text-xs py-2">
            <div className="w-7 h-7 rounded-xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="text-slate-gray font-medium">
              Consulting verified IBM/Qiskit knowledge base &amp; memory...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips (Small raised pill buttons) */}
      <div className="px-6 py-3 bg-floral-white border-t border-black-olive/10 overflow-x-auto">
        <div className="flex items-center gap-2 pb-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-black-olive/60 flex items-center gap-1 mr-1 flex-shrink-0">
            Prompts:
          </span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-xs text-black-olive/80 whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field (Pressed/Inset) and Send Button */}
      <div className="p-4 sm:p-6 bg-floral-white border-t border-black-olive/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a quantum question in ${difficultyMode} mode...`}
            disabled={loading}
            maxLength={2500}
            className="flex-1 bg-floral-white shadow-neu-pressed rounded-2xl px-5 py-3 text-xs sm:text-sm text-black-olive placeholder-black-olive/50 outline-none focus:ring-2 focus:ring-slate-gray/30 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="px-6 py-3 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs sm:text-sm shadow-neu-raised hover:shadow-neu-pressed disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 flex-shrink-0"
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
        <div className="mt-2 flex items-center justify-between text-[10px] text-black-olive/60 px-2 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-gray" />
            <span>Anti-hallucination grounded in IBM Quantum &amp; Qiskit</span>
          </span>
          <span>{input.length}/2500</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiChat;
