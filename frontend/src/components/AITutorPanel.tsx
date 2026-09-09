import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Loader2, 
  Lightbulb 
} from 'lucide-react';
import { askAITutor, type TutorContext } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  source?: string;
}

interface AITutorPanelProps {
  context: TutorContext;
  compact?: boolean;
}

const QUESTION_CHIPS = [
  'Why did this happen?',
  'Explain this circuit',
  'Explain like a beginner',
  'Explain this gate',
  'Give me a hint'
];

export const AITutorPanel: React.FC<AITutorPanelProps> = ({ context, compact = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(!compact);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "👋 Hello! I'm your **Quantum AI Teaching Assistant**. I can see your circuit and simulation results in real time. Ask me anything or click one of the suggested questions below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await askAITutor(q, context);
      const tutorMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'tutor',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'tutor',
        text: `Sorry, I couldn't process that: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Context summary badge
  const getContextBadge = () => {
    if (context.page === 'Quantum Lab') {
      const gateCount = context.circuit?.length || 0;
      const gates = context.circuit?.map(g => g.type).join(', ') || 'No gates';
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
        ? 'fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl' 
        : 'h-full w-full'
    }`}>
      {/* Floating Toggle Header (when compact and collapsed) */}
      {compact && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-semibold text-xs shadow-xl hover:scale-[1.02] transition-all border border-indigo-400/30"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span>Ask AI Quantum Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </button>
      )}

      {/* Main Panel */}
      {(!compact || isOpen) && (
        <div className="flex flex-col h-[520px] rounded-2xl bg-quantum-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden">
          
          {/* Panel Header */}
          <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Quantum AI Tutor
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h3>
                <div className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
                  <span>Context:</span>
                  <span className="truncate max-w-[160px] text-slate-300">{getContextBadge()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {compact && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-xl p-3 space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200'
                }`}>
                  <div className="leading-relaxed whitespace-pre-wrap font-sans break-words">
                    {m.text}
                  </div>
                  <div className="text-[9px] text-slate-400 text-right font-mono">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-1">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>AI Tutor is analyzing your circuit...</span>
              </div>
            )}
          </div>

          {/* Suggested Question Chips */}
          <div className="p-2.5 bg-slate-950/50 border-t border-slate-800/80 overflow-x-auto">
            <div className="flex gap-1.5 pb-1">
              {QUESTION_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Lightbulb className="w-2.5 h-2.5 text-amber-400" />
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuestion);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask about your circuit, gates, or outcomes..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || loading}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
