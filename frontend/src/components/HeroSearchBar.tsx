import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Loader2, 
  X, 
  ArrowRight, 
  BookOpen, 
  ExternalLink, 
  MessageSquare, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { searchQuantum, type QuantumSearchResponse } from '../services/api';

export const HeroSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuantumSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (overrideQuery?: string) => {
    const textToSearch = (overrideQuery ?? query).trim();
    if (!textToSearch || isLoading) return;

    if (overrideQuery) {
      setQuery(overrideQuery);
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchQuantum(textToSearch);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Couldn't find a confident answer — try rephrasing, or ask the AI Tutor directly.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleOpenTutorFollowUp = () => {
    if (!result) {
      navigate('/tutor');
      return;
    }
    navigate('/tutor', {
      state: {
        initialQuestion: result.query || query,
        initialAnswer: result.answer,
        sources: result.sources
      }
    });
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Dark Chrome Search Bar Container */}
      <div className="relative group">
        {/* Brushed Metal Chrome Edge Gradient */}
        <div className="dark-chrome-edge" />
        
        {/* Subtle Sweeping Light Sheen */}
        <div className="dark-chrome-shine" />

        {/* Inner Search Surface */}
        <div className="dark-chrome-bar relative z-10 flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 transition-all">
          {/* Left Sparkle / Search Icon */}
          <div className="flex-shrink-0 flex items-center justify-center text-floral-white/85">
            <Sparkles className="w-5 h-5 animate-pulse text-[#FAF7EE]" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything about quantum computing — e.g. What is a qubit?"
            className="flex-1 bg-transparent text-floral-white placeholder:text-floral-white/50 text-sm sm:text-base font-medium outline-none tracking-wide disabled:opacity-60"
            aria-label="Quantum knowledge search query"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-floral-white/60 hover:text-floral-white hover:bg-floral-white/10 transition-colors"
                title="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-200 ${
                query.trim() && !isLoading
                  ? 'bg-slate-gray text-floral-white hover:brightness-110 shadow-md active:scale-95'
                  : 'bg-floral-white/10 text-floral-white/30 cursor-not-allowed'
              }`}
              title="Search quantum knowledge"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-floral-white" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Starters (shown when idle) */}
      {!hasSearched && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-black-olive/75">
          <span className="font-semibold text-slate-gray flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Try asking:
          </span>
          {[
            'What is a qubit?',
            'What companies are building quantum computers?',
            'How does the Hadamard gate work?'
          ].map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => handleSearch(promptText)}
              className="px-2.5 py-1 rounded-lg bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-black-olive/80 hover:text-slate-gray transition-all text-left text-[11px]"
            >
              {promptText}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/5 animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-gray">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Querying Quantum Knowledge Base (PostgreSQL)...</span>
          </div>
          <div className="h-4 bg-black-olive/10 rounded w-3/4" />
          <div className="h-4 bg-black-olive/10 rounded w-full" />
          <div className="h-4 bg-black-olive/10 rounded w-5/6" />
        </div>
      )}

      {/* Error / Empty State Panel */}
      {error && !isLoading && (
        <div className="p-5 sm:p-6 rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/10 space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-black-olive">
                {error}
              </p>
              <p className="text-xs text-black-olive/70">
                Try searching for fundamental topics like <strong>qubit</strong>, <strong>superposition</strong>, <strong>Hadamard</strong>, or <strong>Grover's algorithm</strong>.
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={handleOpenTutorFollowUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask the AI Tutor Directly</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Results Panel: Light Neumorphic Raised Card */}
      {result && !isLoading && (
        <div className="p-5 sm:p-6 rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/5 space-y-4 animate-in fade-in duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-black-olive/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-floral-white shadow-neu-pressed text-slate-gray">
                {result.classification === 'off_topic' ? 'Scope Guide' : 'Database Knowledge Match'}
              </span>
              {result.is_verified && (
                <span className="text-[11px] text-slate-gray font-medium flex items-center gap-1">
                  • Verified IBM / Qiskit Curriculum
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-xs text-black-olive/50 hover:text-black-olive transition-colors p-1"
              title="Close results"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Answer Content */}
          <div className="prose prose-sm max-w-none text-black-olive/90 leading-relaxed text-xs sm:text-sm space-y-2 whitespace-pre-line">
            {result.answer}
          </div>

          {/* Verified Database Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="pt-2 border-t border-black-olive/10 space-y-2.5">
              <div className="text-[11px] font-bold text-black-olive uppercase tracking-wider flex items-center justify-between">
                <span>Verified Documentation References:</span>
                <span className="text-[10px] text-slate-gray font-mono font-normal">
                  ⚡ Direct Local Database Query
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {result.sources.map((s, idx) => (
                  <div
                    key={`src-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-floral-white shadow-neu-sm-raised text-[11px] text-slate-gray font-medium border border-slate-gray/15"
                    title={s.title}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-gray flex-shrink-0" />
                    <span className="font-bold text-slate-gray">{s.name}:</span>
                    <span className="truncate max-w-[170px] sm:max-w-[240px] text-black-olive/90">{s.title}</span>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-slate-gray ml-0.5"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-gray" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black-olive/5 p-3 rounded-2xl">
            <span className="text-xs text-black-olive/75">
              Want to dive deeper, ask follow-up questions, or build a circuit?
            </span>
            <button
              type="button"
              onClick={handleOpenTutorFollowUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-raised hover:shadow-neu-pressed transition-all whitespace-nowrap active:scale-98"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask a follow-up in the AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
