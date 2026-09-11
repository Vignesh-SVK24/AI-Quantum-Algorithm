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
import { ResearchIndicator } from './ResearchIndicator';
import { TutorMessageRenderer } from './TutorMessageRenderer';

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
  research_category?: string;
  research_reasoning?: string;
  is_web_grounded?: boolean;
  search_provider?: string | null;
  domain_breakdown?: Record<string, number>;
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
        is_verified: response.is_verified ?? true,
        research_category: response.research_category,
        research_reasoning: response.research_reasoning,
        is_web_grounded: response.is_web_grounded,
        search_provider: response.search_provider,
        domain_breakdown: response.domain_breakdown
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
    <div className="flex flex-col h-[740px] bg-slate-glow text-floral-white shadow-xl rounded-3xl overflow-hidden border border-soft-slate/40">
      
      {/* Top Header Bar */}
      <div className="px-6 py-4 bg-deep-slate border-b border-soft-slate/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-glow border border-soft-cyan/40 text-soft-cyan shadow-sm flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-floral-white">Quantum AI Teaching Assistant</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-glow border border-muted-sage/40 text-muted-sage">
                <ShieldCheck className="w-3 h-3 text-muted-sage" />
                Anti-Hallucination Grounded
              </span>
            </div>
            <p className="text-[11px] text-warm-ivory/70">
              Grounded in IBM Quantum Learning · Verified with Qiskit Simulation
            </p>
          </div>
        </div>

        {/* Difficulty Mode Toggle */}
        <div className="flex items-center gap-1 bg-deep-slate border border-soft-slate/50 p-1 rounded-2xl">
          <span className="text-[10px] font-semibold text-warm-ivory/70 px-2 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-soft-cyan" /> Mode:
          </span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDifficultyMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
                difficultyMode === mode
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/30 shadow-sm'
                  : 'text-warm-ivory/60 hover:text-warm-ivory'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Reset conversation & memory"
            className="p-1.5 rounded-xl text-warm-ivory/60 hover:text-warm-ivory hover:bg-slate-glow/50 transition-all ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="px-5 py-2.5 bg-cocoa-noir border-b border-soft-cocoa/40 flex items-center justify-between text-xs text-warm-gold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warm-gold flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[11px] text-warm-ivory underline ml-3 flex-shrink-0 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area (Deep Slate Canvas) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm bg-deep-slate/95">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-glow border border-soft-cyan/40 text-soft-cyan flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 text-soft-cyan" />
                </div>
              )}

              {/* User message = Black Olive, AI response = Slate Glow */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? 'bg-black-olive text-warm-ivory border border-black-olive/70 shadow-md'
                    : 'bg-slate-glow text-floral-white border border-soft-slate/40 shadow-md'
                }`}
              >
                {/* Tutor Status Header */}
                {!isUser && m.is_verified && (
                  <div className="flex items-center justify-between pb-2 border-b border-soft-slate/30 text-[10px] text-soft-cyan">
                    <span className="flex items-center gap-1.5 font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-muted-sage" />
                      <span className="text-muted-sage">✓ Grounded &amp; Mathematically Verified</span>
                    </span>
                    {m.classification && (
                      <span className="text-warm-ivory/60 uppercase tracking-wider font-mono text-[9px] px-2 py-0.5 rounded bg-deep-slate/80 border border-soft-slate/30">
                        {m.classification.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Main Message Text */}
                <div className="leading-relaxed font-sans break-words text-floral-white/95">
                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <TutorMessageRenderer text={m.text} />
                  )}
                </div>

                {/* Interactive Dynamic Practice Question Card */}
                {m.practice_question && (
                  <div className="p-4 rounded-2xl bg-deep-slate border border-soft-slate/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-soft-cyan">
                      <HelpCircle className="w-4 h-4 text-soft-cyan" />
                      <span>Interactive Practice Question</span>
                    </div>
                    <p className="text-xs text-warm-ivory font-medium">
                      {m.practice_question.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {m.practice_question.options.map((opt, oIdx) => {
                        const isSelected = practiceAnswers[m.id] === oIdx;
                        const isAnswered = practiceAnswers[m.id] !== undefined;
                        const isCorrectOption = oIdx === m.practice_question?.correct_index;

                        let btnStyle = 'bg-slate-glow/90 border border-soft-slate/40 text-warm-ivory hover:border-soft-cyan hover:bg-slate-glow';
                        if (isAnswered) {
                          if (isCorrectOption) {
                            btnStyle = 'bg-soft-cyan text-deep-slate font-bold shadow-md';
                          } else if (isSelected) {
                            btnStyle = 'bg-deep-slate border-red-400/40 text-warm-ivory/60';
                          } else {
                            btnStyle = 'bg-deep-slate/50 border-soft-slate/20 text-warm-ivory/30 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isAnswered}
                            onClick={() => handlePracticeSelect(m.id, m.practice_question!, oIdx)}
                            className={`p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2 border ${btnStyle}`}
                          >
                            <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback result */}
                    {practiceFeedback[m.id] && (
                      <div className="p-3.5 rounded-xl bg-slate-glow border border-soft-slate/40 text-xs space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5 text-warm-gold">
                          <Award className="w-4 h-4 text-warm-gold" />
                          <span>{practiceFeedback[m.id].correct ? 'Correct! (+5 Progress Score)' : 'Incorrect — Pedagogical Explanation:'}</span>
                        </div>
                        <p className="text-[11px] text-warm-ivory/85 leading-relaxed">
                          {practiceFeedback[m.id].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Circuit Data Preview & Load Action */}
                {m.circuit_data && (
                  <div className="p-4 rounded-2xl bg-deep-slate border border-soft-slate/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-soft-cyan">
                        <Layers className="w-4 h-4 text-soft-cyan" />
                        <span>Generated Circuit</span>
                      </div>
                      <p className="text-[11px] text-warm-ivory/80 font-mono">
                        {m.circuit_data.num_qubits} Qubits · {m.circuit_data.gates.length} Gates [{m.circuit_data.gates.map(g => g.type).join(', ')}]
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadCircuit(m.circuit_data)}
                      className="px-4 py-2 rounded-xl bg-warm-gold text-deep-slate text-xs font-bold flex items-center gap-2 hover:bg-[#D4BA7F] transition-all shadow-sm flex-shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Load into Circuit Builder</span>
                    </button>
                  </div>
                )}

                {/* Verified Qiskit Code Block */}
                {m.qiskit_code && (
                  <div className="rounded-2xl bg-[#0f151e] border border-soft-slate/40 overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#141b26] border-b border-soft-slate/30 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-soft-cyan">
                        <Code2 className="w-3.5 h-3.5 text-soft-cyan" />
                        <span>{m.qiskit_verified ? '✓ Verified with Qiskit 2.5' : 'Qiskit Python Code'}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(m.qiskit_code!, m.id)}
                        className="text-[11px] text-warm-ivory/70 hover:text-warm-ivory flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCodeId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-muted-sage" />
                            <span className="text-muted-sage font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-[11px] font-mono text-soft-cyan/95 overflow-x-auto leading-relaxed">
                      <code>{m.qiskit_code}</code>
                    </pre>
                  </div>
                )}

                {/* Autonomous Research & Grounded Source Citations */}
                {!isUser && (
                  <div className="pt-2 border-t border-soft-slate/30">
                    <ResearchIndicator 
                      isGrounded={m.is_web_grounded || (Boolean(m.sources) && m.sources!.length > 0)}
                      researchCategory={m.research_category}
                      searchProvider={m.search_provider}
                      sources={m.sources}
                    />
                  </div>
                )}

                {/* Bottom Card Footer: Timestamp & Thumbs Up/Down Feedback */}
                <div className="pt-2 flex items-center justify-between border-t border-soft-slate/30 text-[10px]">
                  {!isUser ? (
                    <div className="flex items-center gap-2 text-warm-ivory/60">
                      <span>Helpful?</span>
                      <button
                        onClick={() => handleFeedback(m, 1)}
                        title="Helpful response"
                        className={`p-1 rounded-lg transition-all ${
                          m.userRating === 1 
                            ? 'text-soft-cyan bg-soft-cyan/20 font-bold' 
                            : 'hover:text-soft-cyan'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(m, -1)}
                        title="Not helpful"
                        className={`p-1 rounded-lg transition-all ${
                          m.userRating === -1 
                            ? 'text-warm-gold bg-warm-gold/20 font-bold' 
                            : 'hover:text-warm-gold'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {m.feedbackSubmitted && (
                        <span className="text-[9px] text-soft-cyan font-semibold">Feedback recorded</span>
                      )}
                    </div>
                  ) : <div />}
                  <span className="font-mono text-warm-ivory/50">
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-black-olive border border-muted-sage/30 text-warm-ivory font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  You
                </div>
              )}
            </div>
          );
        })}

        {/* Loading State */}
        {loading && (
          <div className="flex gap-3 items-center py-2">
            <ResearchIndicator isSearching={true} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="px-6 py-3 bg-deep-slate border-t border-soft-slate/30 overflow-x-auto">
        <div className="flex items-center gap-2 pb-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-warm-ivory/50 flex items-center gap-1 mr-1 flex-shrink-0">
            Prompts:
          </span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-slate-glow border border-soft-slate/40 hover:border-soft-cyan text-xs text-warm-ivory/80 hover:text-floral-white hover:bg-slate-glow/80 whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40 shadow-sm"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field and Send Button */}
      <div className="p-4 sm:p-5 bg-deep-slate border-t border-soft-slate/40">
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
            className="flex-1 bg-slate-glow/90 border border-soft-slate/50 focus:border-soft-cyan rounded-2xl px-5 py-3 text-xs sm:text-sm text-warm-ivory placeholder-warm-ivory/40 outline-none focus:ring-1 focus:ring-soft-cyan/40 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="px-6 py-3 rounded-2xl bg-soft-cyan text-deep-slate font-bold text-xs sm:text-sm shadow-md hover:bg-[#9ED4D5] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 flex-shrink-0"
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
        <div className="mt-2 flex items-center justify-between text-[10px] text-warm-ivory/50 px-2 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-sage" />
            <span>Anti-hallucination grounded in IBM Quantum &amp; Qiskit</span>
          </span>
          <span>{input.length}/2500</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiChat;
