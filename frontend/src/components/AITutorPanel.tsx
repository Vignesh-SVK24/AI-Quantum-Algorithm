import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Loader2, 
  ExternalLink
} from 'lucide-react';
import { 
  sendTutorChat, 
  type TutorContext, 
  type TutorSourceCitation 
} from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  sources?: TutorSourceCitation[];
}

interface AITutorPanelProps {
  context: TutorContext;
  compact?: boolean;
}

const QUICK_QUESTIONS = [
  'Explain this circuit step-by-step',
  'Why are these probabilities unequal?',
  'What happens if I add a Hadamard gate?',
  'Give me a practice question'
];

export const AITutorPanel: React.FC<AITutorPanelProps> = ({ context, compact = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(!compact);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "👋 Hello! I'm your **Quantum AI Teaching Assistant**, grounded in IBM Quantum Learning. I can see your circuit and simulation results in real time. Ask me anything or pick a quick question below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText ?? inputQuestion).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setLoading(true);

    const history = messages.slice(-6).map(m => ({
      role: m.sender,
      text: m.text
    }));

    try {
      const res = await sendTutorChat(q, 'beginner', context, history);
      const tutorMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'tutor',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'tutor',
        text: `Sorry, I couldn't process that: ${err instanceof Error ? err.message : 'The tutor service is currently busy.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getContextBadge = () => {
    if (context.page === 'Quantum Lab') {
      const gateCount = context.circuit?.length || 0;
      const gates = context.circuit?.map(g => g.type).join(', ') || 'None';
      return `${gateCount} Gate(s) [${gates}]`;
    }
    if (context.page === 'Algorithm Lab') {
      const algo = context.algorithm_context?.algorithm || 'Algorithm';
      const detail = context.algorithm_context?.oracle_id || context.algorithm_context?.target_state || '';
      return `${algo} (${detail})`;
    }
    return context.page;
  };

  return (
    <div className={`flex flex-col transition-all duration-300 ${
      compact 
        ? 'fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)]' 
        : 'h-full w-full'
    }`}>
      {/* Floating Toggle Header (when compact and collapsed) */}
      {compact && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span>Ask AI Quantum Tutor</span>
          <span className="w-2 h-2 rounded-full bg-floral-white animate-ping ml-1" />
        </button>
      )}

      {/* Main Panel */}
      {(!compact || isOpen) && (
        <div className="flex flex-col h-[520px] rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/10 overflow-hidden">
          
          {/* Panel Header */}
          <div className="p-4 bg-floral-white border-b border-black-olive/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-black-olive flex items-center gap-1.5">
                  Quantum AI Tutor
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-gray" />
                </h3>
                <div className="text-[10px] text-slate-gray font-mono flex items-center gap-1">
                  <span>Context:</span>
                  <span className="truncate max-w-[170px] text-black-olive/70 font-semibold">{getContextBadge()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {compact && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-black-olive/70 hover:text-black-olive shadow-neu-sm-raised hover:shadow-neu-sm-pressed transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'tutor' && (
                  <div className="w-6 h-6 rounded-lg bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* User = Pressed/Inset, Tutor = Raised */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-floral-white shadow-neu-pressed text-black-olive'
                      : 'bg-floral-white shadow-neu-raised text-black-olive'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {/* Grounded Source Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-1.5 border-t border-black-olive/10 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-black-olive/60 flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5 text-slate-gray" /> Sources:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url || 'https://learning.quantum.ibm.com'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-gray/10 text-[9px] font-semibold text-slate-gray hover:bg-slate-gray/20 transition-all"
                          >
                            <span>{src.name}</span>
                            <ExternalLink className="w-2 h-2 opacity-70" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[9px] font-mono text-black-olive/50 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-black-olive/60 text-xs py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-gray" />
                <span>Consulting verified IBM/Qiskit knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips (Small raised pills) */}
          <div className="p-2.5 bg-floral-white border-t border-black-olive/10 overflow-x-auto">
            <div className="flex items-center gap-1.5 pb-0.5">
              <span className="text-[9px] uppercase font-bold text-black-olive/60 flex items-center gap-1 flex-shrink-0">
                <HelpCircle className="w-3 h-3 text-slate-gray" /> Prompt:
              </span>
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-[10px] text-black-olive/80 whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box (Pressed/Inset) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-floral-white border-t border-black-olive/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask about this circuit..."
              disabled={loading}
              className="flex-1 bg-floral-white shadow-neu-pressed rounded-xl px-3.5 py-2 text-xs text-black-olive placeholder-black-olive/50 outline-none focus:ring-1 focus:ring-slate-gray/30 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || loading}
              className="px-3.5 py-2 rounded-xl bg-slate-gray text-floral-white shadow-neu-raised hover:shadow-neu-pressed disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AITutorPanel;
