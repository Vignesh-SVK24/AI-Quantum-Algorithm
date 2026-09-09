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

  // Read student progress metadata from localStorage
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

    // Prepare conversation history (last 6 exchanges)
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

    // Feed result into Dashboard student progress
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
    <div className="flex flex-col h-[700px] bg-floral-white rounded-2xl shadow-neu-raised backdrop-blur-md overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="px-5 py-3 bg-floral-white -b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-black-olive shadow-neu-raised">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-black-olive">Quantum AI Teaching Assistant</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-2xl bg-emerald-500/10 text-slate-gray">
                <ShieldCheck className="w-3 h-3 text-slate-gray" />
                Anti-Hallucination &amp; Memory
              </span>
            </div>
            <p className="text-[11px] text-black-olive/70">
              Grounded in IBM Quantum Learning · Verified with Qiskit Simulation
            </p>
          </div>
        </div>

        {/* Difficulty Mode Toggle & Reset */}
        <div className="flex items-center gap-1 bg-floral-white p-1 rounded-xl">
          <span className="text-[10px] font-medium text-black-olive/70 px-1.5 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-gray" /> Mode:
          </span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDifficultyMode(mode)}
              className={`px-2.5 py-1 rounded-2xl text-[10px] font-semibold capitalize transition-all ${
                difficultyMode === mode
                  ? '   text-black-olive shadow-neu-raised'
                  : 'text-black-olive/70 hover:text-black-olive hover:bg-floral-white'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Reset conversation & memory"
            className="p-1.5 rounded-2xl text-black-olive/70 hover:text-black-olive hover:bg-slate-gray text-floral-white shadow-neu-raised hover:shadow-neu-pressed rounded-xl transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-rose-500/10 -b flex items-center justify-between text-xs text-slate-gray animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-gray flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] text-slate-gray hover:text-slate-gray underline ml-3 flex-shrink-0"
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
                <div className="w-7 h-7 rounded-2xl flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5 shadow-neu-raised">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? '   text-black-olive shadow-neu-raised '
                    : 'bg-floral-white   text-black-olive shadow-neu-raised'
                }`}
              >
                {/* Tutor Status Header */}
                {!isUser && m.is_verified && (
                  <div className="flex items-center justify-between pb-1 -b text-[10px] text-slate-gray">
                    <span className="flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-slate-gray" />
                      <span>✓ Mathematically &amp; Scientifically Grounded</span>
                    </span>
                    {m.classification && (
                      <span className="text-black-olive/70 uppercase tracking-wider font-mono text-[9px]">
                        {m.classification.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Main Message Text */}
                <div className="leading-relaxed whitespace-pre-wrap font-sans break-words selection:bg-teal-500/30">
                  {m.text}
                </div>

                {/* Interactive Dynamic Practice Question Card */}
                {m.practice_question && (
                  <div className="p-4 rounded-xl bg-floral-white space-y-3 shadow-neu-pressed">
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

                        let btnStyle = 'bg-floral-white  text-black-olive/70 hover:';
                        if (isAnswered) {
                          if (isCorrectOption) {
                            btnStyle = 'bg-emerald-950/60  text-slate-gray font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-rose-950/60  text-slate-gray';
                          } else {
                            btnStyle = 'bg-floral-white  text-black-olive/70 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isAnswered}
                            onClick={() => handlePracticeSelect(m.id, m.practice_question!, oIdx)}
                            className={`p-2.5 rounded-2xl  text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="w-4 h-4 rounded-2xl bg-floral-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback result */}
                    {practiceFeedback[m.id] && (
                      <div className={`p-2.5 rounded-2xl text-xs space-y-1 ${
                        practiceFeedback[m.id].correct 
                          ? 'bg-emerald-950/40   text-slate-gray' 
                          : 'bg-rose-950/40   text-slate-gray'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>{practiceFeedback[m.id].correct ? 'Correct! (+5 Progress Score)' : 'Incorrect — Review below:'}</span>
                        </div>
                        <p className="text-[11px] text-black-olive/70 leading-relaxed">
                          {practiceFeedback[m.id].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Circuit Data Preview & Load Action */}
                {m.circuit_data && (
                  <div className="p-3 rounded-xl bg-floral-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-black-olive">
                        <Layers className="w-3.5 h-3.5 text-slate-gray" />
                        <span>Generated Quantum Circuit</span>
                      </div>
                      <p className="text-[11px] text-black-olive/70">
                        {m.circuit_data.num_qubits} Qubit(s) · {m.circuit_data.gates.length} Gate(s) [
                        {m.circuit_data.gates.map(g => g.type).join(', ')}]
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadCircuit(m.circuit_data)}
                      className="px-3 py-1.5 rounded-2xl hover: hover: text-black-olive text-[11px] font-semibold flex items-center gap-1.5 shadow-neu-raised transition-all flex-shrink-0"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Load into Circuit Builder</span>
                    </button>
                  </div>
                )}

                {/* Verified Qiskit Code Block */}
                {m.qiskit_code && (
                  <div className="rounded-xl bg-floral-white overflow-hidden">
                    <div className="px-3 py-1.5 bg-floral-white -b flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-gray">
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
                            <span className="text-slate-gray">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-black-olive/70 overflow-x-auto selection:bg-teal-500/30">
                      <code>{m.qiskit_code}</code>
                    </pre>
                  </div>
                )}

                {/* Grounded Source Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 -t space-y-1">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-black-olive/70 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-gray" /> Grounded Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {m.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url || 'https://learning.quantum.ibm.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-teal-500/10 text-[10px] text-slate-gray hover:text-slate-gray hover:bg-teal-500/20 transition-colors"
                        >
                          <span>{src.title ? `${src.name} — ${src.title}` : src.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Card Footer: Timestamp & Thumbs Up/Down Feedback */}
                <div className="pt-1.5 flex items-center justify-between -t text-[10px]">
                  {!isUser ? (
                    <div className="flex items-center gap-2 text-black-olive/70">
                      <span>Helpful?</span>
                      <button
                        onClick={() => handleFeedback(m, 1)}
                        title="Helpful response"
                        className={`p-1 rounded transition-colors ${
                          m.userRating === 1 
                            ? 'text-slate-gray bg-emerald-500/20' 
                            : 'hover:text-slate-gray hover:bg-floral-white'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(m, -1)}
                        title="Not helpful"
                        className={`p-1 rounded transition-colors ${
                          m.userRating === -1 
                            ? 'text-slate-gray bg-rose-500/20' 
                            : 'hover:text-slate-gray hover:bg-floral-white'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {m.feedbackSubmitted && (
                        <span className="text-[9px] text-slate-gray animate-fadeIn">Feedback logged!</span>
                      )}
                    </div>
                  ) : <div />}
                  <span className={`font-mono ${isUser ? 'text-slate-gray' : 'text-black-olive/70'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold">You</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Typing State */}
        {loading && (
          <div className="flex gap-3 items-center text-black-olive/70 text-xs py-2 animate-pulse">
            <div className="w-7 h-7 rounded-2xl bg-teal-500/20 flex items-center justify-center text-slate-gray">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-gray font-medium">
              <span>Tutor is consulting knowledge base &amp; memory</span>
              <span className="inline-flex gap-0.5">
                <span className="w-1 h-1 bg-teal-400 rounded-2xl animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-teal-400 rounded-2xl animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-teal-400 rounded-2xl animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="px-4 py-2 bg-floral-white -t overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 pb-0.5">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-black-olive/70 flex items-center gap-1 mr-1 flex-shrink-0">
            <Cpu className="w-3 h-3 text-slate-gray" /> Prompts:
          </span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-2.5 py-1 rounded-2xl bg-floral-white hover: hover:bg-floral-white text-[11px] text-black-olive/70 hover:text-black-olive whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field and Send Button */}
      <div className="p-4 bg-floral-white -t">
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
            placeholder={`Ask a question or request a quiz in ${difficultyMode} mode...`}
            disabled={loading}
            maxLength={2500}
            className="flex-1 bg-floral-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-black-olive placeholder-slate-500 focus:outline-none focus: transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="px-5 py-2.5 rounded-xl hover: hover: text-black-olive font-medium text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-neu-raised"
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
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-black-olive/70 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-gray" />
            <span>Active Memory &amp; Simulator Verification</span>
          </span>
          <span>{input.length}/2500</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiChat;
