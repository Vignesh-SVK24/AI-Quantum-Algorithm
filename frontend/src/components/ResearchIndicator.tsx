import React, { useState } from 'react';
import { 
  Globe, 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Layers 
} from 'lucide-react';
import { type TutorSourceCitation } from '../services/api';

interface ResearchIndicatorProps {
  isSearching?: boolean;
  isGrounded?: boolean;
  researchCategory?: string;
  searchProvider?: string | null;
  sources?: TutorSourceCitation[];
}

export const ResearchIndicator: React.FC<ResearchIndicatorProps> = ({
  isSearching = false,
  isGrounded = false,
  researchCategory,
  searchProvider,
  sources = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Active searching state
  if (isSearching) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-floral-white shadow-neu-sm-pressed text-xs text-slate-gray font-medium animate-pulse border border-slate-gray/15 my-2">
        <Globe className="w-3.5 h-3.5 text-slate-gray animate-spin" />
        <span>Researching authoritative quantum sources (IBM, Google, arXiv, Nature)...</span>
      </div>
    );
  }

  // If not grounded and no external sources, show internal knowledge badge if relevant
  if (!isGrounded && (!sources || sources.length === 0)) {
    return null;
  }

  const academicSources = sources.filter(s => s.source_type === 'academic');
  const industrySources = sources.filter(s => s.source_type === 'industry_leader');
  const platformSources = sources.filter(s => s.source_type === 'platform');
  const otherSources = sources.filter(s => 
    s.source_type !== 'academic' && 
    s.source_type !== 'industry_leader' && 
    s.source_type !== 'platform'
  );

  const getCategoryLabel = () => {
    switch (researchCategory) {
      case 'ACADEMIC_RESEARCH':
        return 'Academic arXiv / Journal Literature';
      case 'QUANTUM_DOCUMENTATION_RESEARCH':
        return 'Hardware Architecture & Vendor Documentation';
      case 'CURRENT_INFORMATION':
        return 'Industry Landscape & Commercial Roadmaps';
      case 'HYBRID':
        return 'Platform Knowledge + Live Web Grounding';
      case 'WEB_RESEARCH_REQUIRED':
        return 'Live Web Research Grounding';
      default:
        return 'Curated Platform Knowledge';
    }
  };

  return (
    <div className="my-2.5 space-y-2 text-xs">
      {/* Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-floral-white shadow-neu-sm-raised border border-black-olive/10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray">
            {isGrounded ? <Globe className="w-3 h-3 text-slate-gray" /> : <BookOpen className="w-3 h-3 text-slate-gray" />}
          </div>
          <span className="font-semibold text-black-olive">
            {isGrounded ? (
              <span className="flex items-center gap-1.5 text-slate-gray">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-gray" />
                Answer grounded in {sources.length} authoritative source{sources.length === 1 ? '' : 's'}
              </span>
            ) : (
              <span className="text-black-olive/80">
                Grounded in Curated Platform Knowledge
              </span>
            )}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold bg-slate-gray/10 text-slate-gray">
            {getCategoryLabel()}
          </span>
        </div>

        {/* Expand / Collapse Button */}
        {sources.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-[11px] font-semibold text-slate-gray transition-all active:scale-95"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Sources' : 'View Sources'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded Sources Drawer */}
      {isExpanded && sources.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/10 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between text-[11px] text-black-olive/60 border-b border-black-olive/10 pb-1.5">
            <span className="font-mono">
              Provider: {searchProvider === 'tavily' ? 'Tavily AI Search Engine' : 'arXiv & Curated Quantum Repositories'}
            </span>
            <span className="text-[10px]">All citations verified against live literature</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Industry Leaders */}
            {industrySources.map((s, i) => (
              <SourceCard key={`ind-${i}`} source={s} icon={Building2} badgeColor="text-slate-gray bg-slate-gray/10" badgeText="Industry Lab" />
            ))}

            {/* Academic Papers */}
            {academicSources.map((s, i) => (
              <SourceCard key={`acad-${i}`} source={s} icon={FileText} badgeColor="text-black-olive bg-black-olive/10" badgeText="arXiv / Journal" />
            ))}

            {/* Platform Reference */}
            {platformSources.map((s, i) => (
              <SourceCard key={`plat-${i}`} source={s} icon={BookOpen} badgeColor="text-slate-gray bg-slate-gray/10" badgeText="Platform Curriculum" />
            ))}

            {/* Other Web Sources */}
            {otherSources.map((s, i) => (
              <SourceCard key={`oth-${i}`} source={s} icon={Layers} badgeColor="text-black-olive/70 bg-black-olive/5" badgeText="Web Documentation" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface SourceCardProps {
  source: TutorSourceCitation;
  icon: any;
  badgeColor: string;
  badgeText: string;
}

const SourceCard: React.FC<SourceCardProps> = ({ source, icon: Icon, badgeColor, badgeText }) => {
  return (
    <div className="p-2.5 rounded-xl bg-floral-white shadow-neu-sm-raised border border-black-olive/5 flex flex-col justify-between gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className="w-3.5 h-3.5 text-slate-gray flex-shrink-0" />
          <span className="text-xs font-semibold text-black-olive truncate" title={source.title}>
            {source.title}
          </span>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md flex-shrink-0 font-bold ${badgeColor}`}>
          {badgeText}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-black-olive/70 pt-0.5">
        <span className="truncate max-w-[160px] text-slate-gray font-medium">
          {source.organization || source.name}
        </span>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-gray hover:underline font-semibold text-[10px]"
          >
            <span>Open</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </div>
  );
};
