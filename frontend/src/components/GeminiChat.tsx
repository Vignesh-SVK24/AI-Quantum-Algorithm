import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { sendTutorChat } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

const STARTER_QUESTIONS = [
  'What is a qubit?',
  'Why is superposition not "0 and 1 at the same time"?',
  'What does the Hadamard (H) gate do?',
  'How does quantum entanglement work?',
  'Explain the Bloch sphere in simple terms',
  'What is quantum measurement collapse?'
];

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "👋 Hello! I am your **Quantum Computing AI Tutor**, powered by Google Gemini Flash.\n\nI am here to help you understand quantum concepts step-by-step from first principles. Feel free to ask any beginner or advanced quantum question, or click one of the suggested topics below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      const response = await sendTutorChat(textToSend);
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    <div className="flex flex-col h-[650px] bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Gemini Quantum Tutor</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Flash API
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive beginner-friendly Q&amp;A powered by Google Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Secure Proxy (No key exposure)</span>
          </div>
          <button
            onClick={handleClear}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-fadeIn">
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
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap font-sans break-words selection:bg-teal-500/30">
                  {m.text}
                </div>
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
              <span>Tutor is typing</span>
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
            <Cpu className="w-3 h-3 text-indigo-400" /> Prompts:
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
            placeholder="Ask a quantum computing question (e.g. 'What is a qubit?')..."
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
          <span>Protected by sliding-window rate limit (15 req/min)</span>
          <span>{input.length}/2000</span>
        </div>
      </div>

    </div>
  );
};

export default GeminiChat;
