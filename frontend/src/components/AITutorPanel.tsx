import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Loader2 
} from 'lucide-react';
import { 
  sendTutorChat, 
  type TutorContext, 
  type TutorSourceCitation 
} from '../services/api';
import { ResearchIndicator } from './ResearchIndicator';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  sources?: TutorSourceCitation[];
  research_category?: string;
  research_reasoning?: string;
  is_web_grounded?: boolean;
  search_provider?: string | null;
  domain_breakdown?: Record<string, number>;
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
        sources: res.sources,
        research_category: res.research_category,
        research_reasoning: res.research_reasoning,
        is_web_grounded: res.is_web_grounded,
        search_provider: res.search_provider,
        domain_breakdown: res.domain_breakdown
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
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-glow text-floral-white font-semibold text-xs border border-soft-cyan/40 shadow-xl hover:bg-deep-slate transition-all"
        >
          <Bot className="w-5 h-5 text-soft-cyan animate-pulse" />
          <span>Ask AI Quantum Tutor</span>
          <span className="w-2 h-2 rounded-full bg-soft-cyan animate-ping ml-1" />
        </button>
      )}

      {/* Main Panel */}
      {(!compact || isOpen) && (
        <div className="flex flex-col h-[520px] rounded-3xl bg-slate-glow text-warm-ivory shadow-2xl border border-soft-slate/40 overflow-hidden">
          
          {/* Panel Header */}
          <div className="p-4 bg-deep-slate border-b border-soft-slate/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-glow border border-soft-cyan/40 flex items-center justify-center text-soft-cyan shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-floral-white flex items-center gap-1.5">
                  Quantum AI Tutor
                  <span className="w-1.5 h-1.5 rounded-full bg-soft-cyan" />
                </h3>
                <div className="text-[10px] text-soft-cyan font-mono flex items-center gap-1">
                  <span className="text-warm-ivory/60">Context:</span>
                  <span className="truncate max-w-[170px] text-warm-ivory font-semibold">{getContextBadge()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {compact && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-warm-ivory/60 hover:text-warm-ivory hover:bg-slate-glow/50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-deep-slate/95">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'tutor' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-glow border border-soft-cyan/40 flex items-center justify-center text-soft-cyan flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-soft-cyan" />
                  </div>
                )}

                {/* User = Black Olive, Tutor = Slate Glow */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-black-olive text-warm-ivory border border-black-olive/60 shadow-md'
                      : 'bg-slate-glow text-floral-white border border-soft-slate/40 shadow-md'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {/* Autonomous Research & Grounded Source Citations */}
                  {m.sender === 'tutor' && (
                    <div className="pt-1.5 border-t border-soft-slate/30">
                      <ResearchIndicator 
                        isGrounded={m.is_web_grounded || (Boolean(m.sources) && m.sources!.length > 0)}
                        researchCategory={m.research_category}
                        searchProvider={m.search_provider}
                        sources={m.sources}
                      />
                    </div>
                  )}

                  <span className="block text-[9px] font-mono text-warm-ivory/40 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="py-2">
                <ResearchIndicator isSearching={true} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2.5 bg-deep-slate border-t border-soft-slate/30 overflow-x-auto">
            <div className="flex items-center gap-1.5 pb-0.5">
              <span className="text-[9px] uppercase font-bold text-warm-ivory/50 flex items-center gap-1 flex-shrink-0">
                <HelpCircle className="w-3 h-3 text-soft-cyan" /> Prompt:
              </span>
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-slate-glow border border-soft-slate/40 hover:border-soft-cyan text-[10px] text-warm-ivory/80 whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-40 hover:text-floral-white shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-deep-slate border-t border-soft-slate/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask about this circuit..."
              disabled={loading}
              className="flex-1 bg-slate-glow/90 border border-soft-slate/50 focus:border-soft-cyan rounded-xl px-3.5 py-2 text-xs text-warm-ivory placeholder-warm-ivory/40 outline-none focus:ring-1 focus:ring-soft-cyan/40 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || loading}
              className="px-3.5 py-2 rounded-xl bg-soft-cyan text-deep-slate font-bold hover:bg-[#9ED4D5] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm"
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
