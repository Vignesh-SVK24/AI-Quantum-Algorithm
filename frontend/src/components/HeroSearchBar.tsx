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
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  AlertTriangle,
  Layers,
  Globe2,
  Lightbulb,
  Cpu,
  Languages
} from 'lucide-react';
import { searchQuantum, simulateCircuit, type QuantumTopicSearchResponse } from '../services/api';
import type { QuantumVisualizationData } from './visualization3d';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../data/quantumTranslations';

const QuantumVisualizer = React.lazy(() => import('./visualization3d').then(m => ({ default: m.QuantumVisualizer })));

export const HeroSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchLang, setSearchLang] = useState<SupportedLanguage>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('quantum_preferred_lang');
      if (saved === 'hi' || saved === 'ta' || saved === 'en') return saved;
    }
    return 'en';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuantumTopicSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [is3DExpanded, setIs3DExpanded] = useState(false);
  const [isAlgorithmExpanded, setIsAlgorithmExpanded] = useState(false);
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);
  const [activeExampleTab, setActiveExampleTab] = useState(0);
  const [canonicalSimData, setCanonicalSimData] = useState<QuantumVisualizationData | null>(null);
  const [isSimulating3D, setIsSimulating3D] = useState(false);
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
    setIsDetailsExpanded(false);
    setIs3DExpanded(false);
    setIsAlgorithmExpanded(false);
    setIsAppsExpanded(false);
    setActiveExampleTab(0);
    setCanonicalSimData(null);

    try {
      const data = await searchQuantum(textToSearch);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "No matching quantum topic was found in the Quantum Knowledge Base.");
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
    setIsDetailsExpanded(false);
    setIs3DExpanded(false);
    setIsAlgorithmExpanded(false);
    setIsAppsExpanded(false);
    setActiveExampleTab(0);
    setCanonicalSimData(null);
    inputRef.current?.focus();
  };

  const handleToggle3D = async () => {
    if (is3DExpanded) {
      setIs3DExpanded(false);
      return;
    }

    setIs3DExpanded(true);
    if (!canonicalSimData && result?.topic?.canonical_circuit) {
      const circ = result.topic.canonical_circuit;
      setIsSimulating3D(true);
      try {
        const sim = await simulateCircuit({
          gates: circ.gates,
          num_qubits: circ.num_qubits,
          shots: 1024
        });
        setCanonicalSimData({
          numQubits: circ.num_qubits,
          circuitOperations: circ.gates,
          currentStep: circ.gates.length,
          statevector: sim.statevector,
          basisStateProbabilities: sim.probabilities,
          measurementCounts: sim.measurement_counts,
          currentState: sim.statevector,
          circuitTitle: circ.title,
          circuitDescription: circ.description,
          algorithmName: circ.circuit_type
        });
      } catch (e) {
        console.warn("Canonical circuit simulation failed:", e);
      } finally {
        setIsSimulating3D(false);
      }
    }
  };

  const handleRelatedTopicClick = (topicName: string) => {
    handleSearch(topicName);
  };

  const handleOpenTutorFollowUp = () => {
    if (!result?.topic) {
      navigate('/tutor');
      return;
    }
    navigate('/tutor', {
      state: {
        initialQuestion: `Can you explain more about ${result.topic.topic_name}?`,
        initialAnswer: result.topic.short_definition,
        sources: [
          {
            name: result.topic.source_name || 'IBM Quantum Learning',
            title: result.topic.topic_name,
            url: result.topic.source_url,
            source_type: 'platform'
          }
        ]
      }
    });
  };

  const handleOpenTutorWithPrompt = (promptText: string) => {
    if (!result?.topic) {
      navigate('/tutor');
      return;
    }
    navigate('/tutor', {
      state: {
        initialQuestion: promptText,
        autoSend: true,
        sources: [
          {
            name: result.topic.source_name || 'IBM Quantum Learning',
            title: result.topic.topic_name,
            url: result.topic.source_url,
            source_type: 'platform'
          }
        ]
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
            placeholder={
              searchLang === 'hi' 
                ? "क्वांटम विषय खोजें — जैसे: क्युबिट क्या है? या सुपरपोजिशन" 
                : searchLang === 'ta' 
                ? "குவாண்டம் தலைப்பைத் தேடுங்கள் — எ.கா: க்யூபிட் அல்லது மேற்பொருந்துதல்" 
                : "Ask anything about quantum computing — e.g. What is a qubit?"
            }
            className="flex-1 bg-transparent text-floral-white placeholder:text-floral-white/50 text-sm sm:text-base font-medium outline-none tracking-wide disabled:opacity-60"
            aria-label="Quantum topic encyclopedia search query"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-floral-white/60 hover:text-floral-white hover:bg-floral-white/10 transition-colors"
                title="Clear search input"
                aria-label="Clear search input"
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
                  ? 'bg-warm-gold text-deep-olive hover:brightness-110 shadow-md active:scale-95'
                  : 'bg-floral-white/10 text-floral-white/30 cursor-not-allowed'
              }`}
              title="Search Quantum Encyclopedia"
              aria-label="Search Quantum Encyclopedia"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-deep-olive" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Starters & Language Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-olive-mist">
        {!hasSearched ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-black-olive flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-warm-gold" /> {searchLang === 'hi' ? 'सुझाए गए विषय:' : searchLang === 'ta' ? 'பரிந்துரைக்கப்பட்டவை:' : 'Try topics:'}
            </span>
            {(
              searchLang === 'hi'
                ? ['क्युबिट क्या है?', 'हैडामार्ड गेट', 'क्वांटम एंटैंगलमेंट', 'ग्रोवर']
                : searchLang === 'ta'
                ? ['க்யூபிட் என்றால் என்ன?', 'ஹாடமார்ட் கேட்', 'குவாண்டம் பின்னல்', 'குரோவர்']
                : ['What is a qubit?', 'Hadamard Gate', 'Quantum Entanglement', "Grover's Algorithm"]
            ).map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => handleSearch(promptText)}
                className="px-2.5 py-1 rounded-full bg-warm-ivory border border-soft-sand text-black-olive text-[11px] font-medium hover:border-black-olive/40 hover:bg-soft-sand transition-all"
              >
                {promptText}
              </button>
            ))}
          </div>
        ) : <div />}

        {/* Trilingual Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-warm-ivory/80 px-2 py-1 rounded-full border border-soft-sand">
          <Languages className="w-3.5 h-3.5 text-olive-mist" />
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = searchLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSearchLang(lang.code);
                  try {
                    localStorage.setItem('quantum_preferred_lang', lang.code);
                  } catch {}
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-black-olive text-floral-white'
                    : 'text-black-olive/60 hover:text-black-olive'
                }`}
                title={`Switch encyclopedia search to ${lang.label}`}
              >
                {lang.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/5 animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-gray">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching Quantum Encyclopedia Database...</span>
          </div>
          <div className="h-5 bg-black-olive/10 rounded w-1/3" />
          <div className="h-4 bg-black-olive/10 rounded w-full" />
          <div className="h-4 bg-black-olive/10 rounded w-5/6" />
        </div>
      )}

      {/* Error / Offline Alert */}
      {error && !isLoading && (
        <div className="p-5 sm:p-6 rounded-3xl bg-floral-white shadow-neu-raised border border-black-olive/10 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-black-olive">
                {error}
              </p>
              <p className="text-xs text-black-olive/70">
                Try searching for verified topics like <strong>Qubit</strong>, <strong>Superposition</strong>, <strong>Hadamard Gate</strong>, or <strong>Bloch Sphere</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !isLoading && (
        <div className="p-5 sm:p-7 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-lg space-y-5 animate-in fade-in duration-300">
          
          {/* CASE 1: MATCHED TOPIC */}
          {result.matched && result.topic && (
            <>
              {/* Header: Title, Category badge, Verification status, Close button */}
              <div className="flex items-start justify-between border-b border-soft-sand pb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-black-olive tracking-tight">
                      {result.topic.topic_name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warm-ivory border border-soft-sand text-deep-olive">
                      {result.topic.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-deep-olive font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-sage" />
                    <span>Verified IBM & Qiskit Educational Curriculum</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-olive-mist hover:text-black-olive transition-colors p-1"
                  title="Close result card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Definition & Beginner Explanation */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-black-olive leading-relaxed">
                  {result.topic.short_definition}
                </p>
                <p className="text-xs sm:text-sm text-black-olive/85 leading-relaxed">
                  {result.topic.beginner_explanation}
                </p>
              </div>

              {/* Formula Block (if available) */}
              {result.topic.formula && (
                <div className="p-3.5 rounded-2xl bg-warm-ivory border border-soft-sand space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-olive-mist flex items-center gap-1.5">
                    <Code2 className="w-3 h-3 text-warm-gold" />
                    <span>Mathematical Representation</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-black-olive font-semibold overflow-x-auto py-1">
                    {result.topic.formula}
                  </div>
                </div>
              )}

              {/* Worked Examples Section (Multi-Tab if enriched) */}
              {result.topic.worked_examples && result.topic.worked_examples.length > 0 ? (
                <div className="p-4 rounded-2xl bg-warm-ivory border border-soft-sand space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-black-olive flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-warm-gold" />
                      <span>Worked Examples ({result.topic.worked_examples.length} Distinct Cases)</span>
                    </div>
                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 bg-soft-sand/60 p-1 rounded-xl">
                      {result.topic.worked_examples.map((ex, exIdx) => (
                        <button
                          key={`ex-tab-${exIdx}`}
                          type="button"
                          onClick={() => setActiveExampleTab(exIdx)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            activeExampleTab === exIdx
                              ? 'bg-deep-olive text-floral-white shadow-sm'
                              : 'text-black-olive hover:bg-soft-sand'
                          }`}
                        >
                          Ex {exIdx + 1}: {ex.type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Example Display */}
                  {(() => {
                    const curEx = result.topic.worked_examples[activeExampleTab] || result.topic.worked_examples[0];
                    return (
                      <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-black-olive">
                            {curEx.title}
                          </span>
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-soft-sand text-deep-olive font-semibold">
                            {curEx.type}
                          </span>
                        </div>
                        <p className="text-xs text-black-olive/85 leading-relaxed">
                          {curEx.content}
                        </p>
                        {curEx.circuit_ascii && (
                          <div className="mt-2 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-olive-mist">
                              Circuit ASCII Diagram
                            </span>
                            <pre className="p-3 rounded-xl bg-cocoa-noir text-floral-white text-[11px] font-mono overflow-x-auto leading-snug">
                              {curEx.circuit_ascii}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Quick Follow-up Chips for AI Tutor */}
                  <div className="pt-2 border-t border-soft-sand flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-olive-mist text-[10px] uppercase tracking-wider mr-1">
                      Ask Tutor:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenTutorWithPrompt(`Give me another example of ${result.topic?.topic_name}`)}
                      className="px-2.5 py-1 rounded-full bg-[#FFFDF7] border border-soft-sand hover:border-black-olive/40 text-black-olive text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>💡 Another Example</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenTutorWithPrompt(`Explain ${result.topic?.topic_name} mathematically`)}
                      className="px-2.5 py-1 rounded-full bg-[#FFFDF7] border border-soft-sand hover:border-black-olive/40 text-black-olive text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>📐 Math breakdown</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenTutorWithPrompt(`Show me a quantum circuit example for ${result.topic?.topic_name}`)}
                      className="px-2.5 py-1 rounded-full bg-[#FFFDF7] border border-soft-sand hover:border-black-olive/40 text-black-olive text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>⚡ Circuit code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenTutorWithPrompt(`Explain ${result.topic?.topic_name} simply like I'm a beginner`)}
                      className="px-2.5 py-1 rounded-full bg-[#FFFDF7] border border-soft-sand hover:border-black-olive/40 text-black-olive text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>🧸 Explain simply</span>
                    </button>
                  </div>
                </div>
              ) : result.topic.example ? (
                <div className="p-3.5 rounded-2xl bg-black-olive/5 border border-black-olive/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-black-olive/80">
                    💡 Worked Example
                  </div>
                  <p className="text-xs text-black-olive/85 leading-relaxed">
                    {result.topic.example}
                  </p>
                </div>
              ) : null}

              {/* Algorithm Deep Dive (Classical vs Quantum Complexity) */}
              {result.topic.algorithm_details && (
                <div className="pt-1 border-t border-black-olive/10">
                  <button
                    type="button"
                    onClick={() => setIsAlgorithmExpanded(!isAlgorithmExpanded)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-xs font-bold text-slate-gray transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-warm-gold" />
                      {isAlgorithmExpanded ? 'Hide Algorithm Deep Dive' : 'Algorithm Deep Dive: Classical vs Quantum Complexity'}
                    </span>
                    {isAlgorithmExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isAlgorithmExpanded && (
                    <div className="mt-3 space-y-3.5 p-4 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/5 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-gray">
                          Problem Statement
                        </span>
                        <p className="text-xs text-black-olive/90 leading-relaxed font-medium">
                          {result.topic.algorithm_details.problem_statement}
                        </p>
                      </div>

                      {/* Complexity Comparison Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-black-olive/10 text-[10px] uppercase font-bold text-slate-gray">
                              <th className="py-1.5 pr-3">Approach</th>
                              <th className="py-1.5 px-3">Complexity</th>
                              <th className="py-1.5 pl-3">Mechanism</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black-olive/5 font-mono text-[11px]">
                            <tr>
                              <td className="py-1.5 pr-3 font-sans font-semibold text-black-olive">Classical</td>
                              <td className="py-1.5 px-3 text-[#A34B24] font-bold">{result.topic.algorithm_details.complexity_classical}</td>
                              <td className="py-1.5 pl-3 font-sans text-black-olive/75">{result.topic.algorithm_details.classical_approach || 'Sequential evaluation / brute-force'}</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 pr-3 font-sans font-semibold text-black-olive">Quantum</td>
                              <td className="py-1.5 px-3 text-deep-olive font-bold">{result.topic.algorithm_details.complexity_quantum}</td>
                              <td className="py-1.5 pl-3 font-sans text-black-olive/75">{result.topic.algorithm_details.quantum_approach || 'Quantum superposition & interference'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Key Execution Steps */}
                      {result.topic.algorithm_details.steps && result.topic.algorithm_details.steps.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-gray">
                            Execution Steps
                          </span>
                          <ol className="list-decimal pl-4 space-y-1 text-xs text-black-olive/85">
                            {result.topic.algorithm_details.steps.map((step: string, sIdx: number) => (
                              <li key={`step-${sIdx}`}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Speedup details */}
                      {result.topic.algorithm_details.theoretical_vs_practical && (
                        <div className="p-2.5 rounded-xl bg-warm-ivory border border-soft-sand space-y-1 text-xs">
                          <div>
                            <span className="font-bold text-black-olive">Theoretical vs Practical Reality: </span>
                            <span className="text-deep-olive font-semibold">{result.topic.algorithm_details.theoretical_vs_practical}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Applications & Limitations Grid */}
              {((result.topic.applications && result.topic.applications.length > 0) ||
                (result.topic.limitations && result.topic.limitations.length > 0)) && (
                <div className="pt-1 border-t border-black-olive/10">
                  <button
                    type="button"
                    onClick={() => setIsAppsExpanded(!isAppsExpanded)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-xs font-bold text-slate-gray transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-muted-sage" />
                      {isAppsExpanded ? 'Hide Real-World Applications & Limitations' : 'Real-World Applications & NISQ Limitations'}
                    </span>
                    {isAppsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isAppsExpanded && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/5 animate-in fade-in duration-200">
                      {/* Applications */}
                      {result.topic.applications && result.topic.applications.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-deep-olive flex items-center gap-1">
                            🚀 Real-World Applications
                          </span>
                          <ul className="space-y-1 text-xs text-black-olive/85">
                            {result.topic.applications.map((app, aIdx) => (
                              <li key={`app-${aIdx}`} className="flex items-start gap-1.5">
                                <span className="text-muted-sage font-bold">•</span>
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Limitations */}
                      {result.topic.limitations && result.topic.limitations.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A34B24] flex items-center gap-1">
                            ⚠️ Physical &amp; NISQ Constraints
                          </span>
                          <ul className="space-y-1 text-xs text-black-olive/85">
                            {result.topic.limitations.map((lim, lIdx) => (
                              <li key={`lim-${lIdx}`} className="flex items-start gap-1.5">
                                <span className="text-[#A34B24] font-bold">•</span>
                                <span>{lim}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Expandable "Learn More" Section */}
              <div className="pt-1 border-t border-black-olive/10">
                <button
                  type="button"
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-xs font-bold text-slate-gray transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {isDetailsExpanded ? 'Hide In-Depth Theory & Circuit' : 'Learn More: Detailed Theory & Circuit Example'}
                  </span>
                  {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isDetailsExpanded && (
                  <div className="mt-3 space-y-3.5 p-4 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/5 animate-in fade-in duration-200">
                    {/* Detailed Explanation */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                        Detailed Theory
                      </div>
                      <p className="text-xs text-black-olive/90 leading-relaxed">
                        {result.topic.detailed_explanation}
                      </p>
                    </div>

                    {/* Mathematical Explanation */}
                    {result.topic.mathematical_explanation && (
                      <div className="space-y-1 pt-2 border-t border-black-olive/10">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                          Rigorous Mathematical Formulation
                        </div>
                        <p className="text-xs font-mono text-black-olive/90 leading-relaxed whitespace-pre-line bg-black-olive/5 p-2.5 rounded-xl">
                          {result.topic.mathematical_explanation}
                        </p>
                      </div>
                    )}

                    {/* Circuit Example */}
                    {result.topic.circuit_example && (
                      <div className="space-y-1 pt-2 border-t border-black-olive/10">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-gray flex items-center gap-1">
                          <Code2 className="w-3 h-3" />
                          <span>Qiskit Circuit Code</span>
                        </div>
                        <pre className="p-3 rounded-xl bg-[#203C3D] text-[#FAF7EE] text-[11px] font-mono overflow-x-auto leading-tight">
                          {result.topic.circuit_example}
                        </pre>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {result.topic.common_mistakes && result.topic.common_mistakes.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-black-olive/10">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#A34B24] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#A34B24]" />
                          <span>Common Misconceptions & Pitfalls</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-black-olive/85">
                          {result.topic.common_mistakes.map((mistake, mIdx) => (
                            <li key={`m-${mIdx}`}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible 3D Visualization Section */}
              {result.topic.canonical_circuit && (
                <div className="pt-2 border-t border-black-olive/10 space-y-2">
                  <button
                    type="button"
                    onClick={handleToggle3D}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-floral-white shadow-neu-raised hover:shadow-neu-pressed transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-gray/10 flex items-center justify-center text-slate-gray shadow-neu-sm-pressed group-hover:scale-105 transition-transform">
                        <Globe2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-gray flex items-center gap-1.5">
                          <span>{result.topic.canonical_circuit.title || 'Interactive 3D Quantum Visualization'}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-gray text-floral-white font-mono">
                            3D Engine
                          </span>
                        </div>
                        <div className="text-[11px] text-black-olive/70 line-clamp-1">
                          {result.topic.canonical_circuit.description || 'Explore state evolution on 3D Bloch Sphere & 3D Circuit'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-gray">
                      <span>{is3DExpanded ? 'Close 3D' : 'Explore in 3D'}</span>
                      {is3DExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {is3DExpanded && (
                    <div className="p-3 sm:p-4 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/5 animate-in fade-in duration-200">
                      {isSimulating3D ? (
                        <div className="h-56 flex flex-col items-center justify-center gap-2 text-slate-gray">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-xs font-mono font-medium">Running local deterministic Qiskit simulation...</span>
                        </div>
                      ) : canonicalSimData ? (
                        <React.Suspense
                          fallback={
                            <div className="h-56 flex items-center justify-center text-slate-gray">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          }
                        >
                          <QuantumVisualizer data={canonicalSimData} />
                        </React.Suspense>
                      ) : (
                        <div className="text-xs text-black-olive/60 p-4 text-center">
                          Failed to simulate canonical circuit.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Clickable Related Topics */}
              {result.related_topics && result.related_topics.length > 0 && (
                <div className="pt-2 border-t border-black-olive/10 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black-olive">
                    Related Quantum Topics:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {result.related_topics.map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => handleRelatedTopicClick(rt)}
                        className="px-3 py-1.5 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed active:scale-95 text-xs font-semibold text-slate-gray transition-all hover:text-black-olive"
                        title={`Explore ${rt}`}
                      >
                        {rt} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations / Sources */}
              <div className="pt-2 border-t border-black-olive/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-black-olive/75">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-gray" />
                  <span>Source:</span>
                  {result.topic.source_url ? (
                    <a
                      href={result.topic.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-gray hover:underline inline-flex items-center gap-1"
                    >
                      {result.topic.source_name || 'IBM Quantum Learning'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-bold text-slate-gray">{result.topic.source_name}</span>
                  )}
                </div>

                <span className="font-mono text-[10px] text-slate-gray/80">
                  Engine: {result.storage_engine.replace('_', ' ')}
                </span>
              </div>
            </>
          )}

          {/* CASE 2: MISSPELLED SEARCH / DID YOU MEAN */}
          {!result.matched && result.did_you_mean && (
            <div className="space-y-3.5 text-black-olive">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold">
                    No exact match found for "{result.query}".
                  </p>
                  <p className="text-xs text-black-olive/75">
                    Did you mean:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearch(result.did_you_mean!)}
                    className="mt-1 px-3.5 py-1.5 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-raised hover:shadow-neu-pressed transition-all inline-flex items-center gap-1.5"
                  >
                    <span>→ {result.did_you_mean}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CASE 3: NO MATCH FOUND */}
          {!result.matched && !result.did_you_mean && (
            <div className="space-y-3 text-black-olive">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold">
                    No matching quantum topic was found in the Quantum Knowledge Base.
                  </p>
                  <p className="text-xs text-black-olive/70">
                    Try searching for fundamental concepts such as <strong>Qubit</strong>, <strong>Superposition</strong>, <strong>Hadamard Gate</strong>, <strong>CNOT Gate</strong>, or <strong>Grover's Algorithm</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Separate AI Tutor Note / Link */}
          <div className="pt-2 border-t border-black-olive/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black-olive/5 p-3 rounded-2xl">
            <span className="text-xs text-black-olive/75">
              Need personalized conversational guidance or circuit simulations?
            </span>
            <button
              type="button"
              onClick={handleOpenTutorFollowUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-raised hover:shadow-neu-pressed transition-all whitespace-nowrap active:scale-98"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
