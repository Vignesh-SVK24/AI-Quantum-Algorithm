import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TutorMessageRendererProps {
  text: string;
}

const STATIC_REPLACEMENTS: [string, string][] = [
  ['\\frac{1}{\\sqrt{2}}', '1/√2'],
  ['\\frac{1}{2}', '1/2'],
  ['\\sqrt{2}', '√2'],
  ['\\rangle', '⟩'],
  ['\\langle', '⟨'],
  ['\\Phi^+', 'Φ⁺'],
  ['\\Phi^-', 'Φ⁻'],
  ['\\Psi^+', 'Ψ⁺'],
  ['\\Psi^-', 'Ψ⁻'],
  ['\\Phi', 'Φ'],
  ['\\Psi', 'Ψ'],
  ['\\alpha', 'α'],
  ['\\beta', 'β'],
  ['\\gamma', 'γ'],
  ['\\delta', 'δ'],
  ['\\epsilon', 'ε'],
  ['\\theta', 'θ'],
  ['\\lambda', 'λ'],
  ['\\mu', 'μ'],
  ['\\pi', 'π'],
  ['\\sigma', 'σ'],
  ['\\phi', 'ϕ'],
  ['\\psi', 'ψ'],
  ['\\omega', 'ω'],
  ['\\oplus', '⊕'],
  ['\\otimes', '⊗'],
  ['\\approx', '≈'],
  ['\\neq', '≠'],
  ['\\ne ', '≠ '],
  ['\\leq', '≤'],
  ['\\le ', '≤ '],
  ['\\geq', '≥'],
  ['\\ge ', '≥ '],
  ['\\times', '×'],
  ['\\cdot', '·'],
  ['\\pm', '±'],
  ['^\\dagger', '†'],
  ['\\dagger', '†'],
  ['\\rightarrow', '→'],
  ['\\to ', '→ '],
  ['\\in ', '∈ '],
  ['\\sum', '∑'],
  ['\\prod', '∏'],
  ['\\infty', '∞'],
  ['^2', '²'],
  ['^{2}', '²'],
  ['^n', 'ⁿ'],
  ['^{n}', 'ⁿ'],
  ['_0', '₀'],
  ['_1', '₁'],
  ['_2', '₂'],
  ['_i', 'ᵢ'],
  ['|0>', '|0⟩'],
  ['|1>', '|1⟩']
];

/**
 * Cleans raw LaTeX math macros, unwanted dollar signs, backslashes,
 * and converts them into crisp, beautiful Unicode quantum notation.
 */
export function cleanQuantumText(raw: string): string {
  if (!raw) return '';

  let s = raw;

  // 1. Static quantum macro replacements
  for (const [target, replacement] of STATIC_REPLACEMENTS) {
    s = s.split(target).join(replacement);
  }

  // 2. Text wrappers: \text{...}, \mathrm{...}, \mathbf{...}
  s = s.replace(/\\text\{([^}]*)\}/g, '$1');
  s = s.replace(/\\mathrm\{([^}]*)\}/g, '$1');
  s = s.replace(/\\mathbf\{([^}]*)\}/g, '$1');

  // 3. Dynamic fractions: \frac{a}{b} -> a/b
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');

  // 4. Dynamic square roots: \sqrt{N} -> √N
  s = s.replace(/\\sqrt\{([^}]+)\}/g, '√$1');

  // 5. Dynamic ket/bra: \ket{...} -> |...⟩, \bra{...} -> ⟨...|
  s = s.replace(/\\ket\{([^}]*)\}/g, '|$1⟩');
  s = s.replace(/\\bra\{([^}]*)\}/g, '⟨$1|');

  // 6. Strip math dollar delimiters: $$...$$ and $...$
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  s = s.replace(/\$([^$\n]+)\$/g, '$1');

  // 7. Remove any remaining stray single backslashes before plain letters
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');

  // 8. Clean up extra spaces
  s = s.replace(/[ \t]+/g, ' ');

  return s;
}

export const TutorMessageRenderer: React.FC<TutorMessageRendererProps> = ({ text }) => {
  const cleanedText = cleanQuantumText(text);

  // Split by code blocks
  const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(cleanedText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: cleanedText.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'python',
      content: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanedText.length) {
    parts.push({ type: 'text', content: cleanedText.slice(lastIndex) });
  }

  return (
    <div className="space-y-2.5 text-xs font-sans leading-relaxed text-floral-white/95">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return <CodeBlockCard key={pIdx} code={part.content} language={part.language} />;
        }
        return <FormattedTextChunk key={pIdx} text={part.content} />;
      })}
    </div>
  );
};

const CodeBlockCard: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-xl bg-[#121924] border border-white/10 overflow-hidden shadow-inner">
      <div className="px-3 py-1.5 bg-[#17202E] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-warm-ivory/60">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#C5A86A]" />
          <span>{language || 'python'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/10 text-warm-ivory/70 hover:text-warm-ivory transition-colors text-[10px]"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
};

const FormattedTextChunk: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-[#C5A86A] mt-2 mb-0.5 tracking-tight flex items-center gap-1.5">
              <span>{renderInlineFormatting(trimmed.replace(/^###\s*/, ''))}</span>
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-floral-white mt-2.5 mb-1 tracking-tight">
              {renderInlineFormatting(trimmed.replace(/^##\s*/, ''))}
            </h3>
          );
        }

        // Blockquotes (> Note:)
        if (trimmed.startsWith('> ')) {
          return (
            <div key={idx} className="pl-3 py-1 my-1 border-l-2 border-[#C5A86A] bg-white/5 rounded-r-lg text-[11px] text-warm-ivory/85">
              {renderInlineFormatting(trimmed.replace(/^>\s*/, ''))}
            </div>
          );
        }

        // Bullet lists (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A86A] mt-1.5 shrink-0" />
              <div className="flex-1">{renderInlineFormatting(itemText)}</div>
            </div>
          );
        }

        // Numbered steps (1. or Step 1:)
        if (/^(Step\s+\d+:|\d+\.)\s+/i.test(trimmed)) {
          const match = trimmed.match(/^(Step\s+\d+:|\d+\.)\s+(.*)$/i);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 mt-1 text-xs">
                <span className="px-1.5 py-0.5 rounded-md bg-[#C5A86A]/20 text-[#C5A86A] font-mono text-[10px] font-bold shrink-0 border border-[#C5A86A]/30">
                  {match[1].replace(':', '')}
                </span>
                <div className="flex-1 pt-0.5">{renderInlineFormatting(match[2])}</div>
              </div>
            );
          }
        }

        // Regular paragraph line
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

function renderInlineFormatting(lineText: string): React.ReactNode[] {
  // Regex parsing for bold (**...**) and inline code (`...`)
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = lineText.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-floral-white">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code key={i} className="px-1 py-0.5 mx-0.5 rounded bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-300">
          {codeText}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
