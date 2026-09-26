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
  ['\\mp', '∓'],
  ['^\\dagger', '†'],
  ['\\dagger', '†'],
  ['\\Longrightarrow', '⟹'],
  ['\\longrightarrow', '→'],
  ['\\rightarrow', '→'],
  ['\\to ', '→ '],
  ['\\leftarrow', '←'],
  ['\\in ', '∈ '],
  ['\\perp', '⟂'],
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

  // 0. Normalize unicode spaces, non-breaking hyphens
  s = s.replace(/\u2011/g, '-').replace(/\u2013/g, '-').replace(/\u2014/g, '--');
  s = s.replace(/\u00a0/g, ' ').replace(/\u200b/g, '').replace(/\u2002/g, ' ').replace(/\u2003/g, ' ');

  // 1. Strip display and inline math delimiters: \[ ... \] and \( ... \)
  s = s.replace(/\\\[\s*/g, '\n\n');
  s = s.replace(/\s*\\\]/g, '\n\n');
  s = s.replace(/\\\(\s*/g, '');
  s = s.replace(/\s*\\\)/g, '');

  // 2. Matrix environments: \begin{pmatrix} ... \end{pmatrix}
  s = s.replace(/\\begin\{(?:pmatrix|bmatrix|vmatrix|matrix)\}([\s\S]*?)\\end\{(?:pmatrix|bmatrix|vmatrix|matrix)\}/g, (_, content) => {
    const cleanContent = content.replace(/\\\\\[.*?\]/g, '\\\\');
    const rawRows = cleanContent.split(/\\\\/).map((r: string) => r.trim()).filter(Boolean);
    const formattedRows = rawRows.map((r: string) => {
      const cols = r.split('&').map((c: string) => c.trim());
      return cols.join('   ');
    });
    if (formattedRows.length === 0) return '';
    return '\n\n' + formattedRows.map((row: string) => `[  ${row}  ]`).join('\n') + '\n\n';
  });

  // 3. Static quantum macro replacements
  for (const [target, replacement] of STATIC_REPLACEMENTS) {
    s = s.split(target).join(replacement);
  }

  // 4. Clean style and sizing macros
  s = s.replace(/\\displaystyle\s*/g, '');
  s = s.replace(/\\(qquad|quad|enspace)/g, '  ');
  s = s.replace(/\\[,;:!]/g, ' ');
  s = s.replace(/\\(left|right|Bigl|Bigr|Big|big|bigg|Bigg)/g, '');

  // 5. Common math function names
  s = s.replace(/\\(sin|cos|tan|exp|log|ln|det|dim|tr|lim|min|max)\b/g, '$1');

  // 6. Text wrappers: \text{...}, \mathrm{...}, \mathbf{...}
  s = s.replace(/\\(?:text|mathrm|mathbf|mathit|textbf|texttt)\{([^}]*)\}/g, '$1');
  s = s.replace(/\\bar\{([^}]+)\}/g, '$1̄');
  s = s.replace(/\\bar\s+([a-zA-Z])/g, '$1̄');

  // 7. Dynamic fractions: \frac{a}{b} -> wrap multi-term in parens
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (_, num, den) => {
    let n = num.trim();
    let d = den.trim();
    if (n === '1' && (d === '√2' || d === '\\sqrt{2}' || d === '\\sqrt2')) return '1/√2';
    if (n === '1' && d === '2') return '1/2';
    if (/[+\-\s]/.test(n) && !(n.startsWith('(') && n.endsWith(')'))) {
      n = `(${n})`;
    }
    if (/[+\-\s]/.test(d) && !(d.startsWith('(') && d.endsWith(')'))) {
      d = `(${d})`;
    }
    return `${n}/${d}`;
  });

  // 8. Dynamic square roots: \sqrt{N} -> √N
  s = s.replace(/\\sqrt\{([^}]+)\}/g, '√$1');
  s = s.replace(/\\sqrt\s*([0-9a-zA-Z])/g, '√$1');

  // 9. Dynamic ket/bra: \ket{...} -> |...⟩, \bra{...} -> ⟨...|
  s = s.replace(/\\ket\{([^}]*)\}/g, '|$1⟩');
  s = s.replace(/\\bra\{([^}]*)\}/g, '⟨$1|');

  // 10. Strip math dollar delimiters: $$...$$ and $...$
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  s = s.replace(/\$([^$\n]+)\$/g, '$1');

  // 11. Remove any remaining stray single backslashes before plain letters
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');

  // 12. Clean up extra spaces and excessive newlines
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');

  return s.trim();
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
  const rawLines = text.split('\n');

  // Group contiguous markdown table lines together
  const chunks: Array<
    | { type: 'table'; rows: string[][] }
    | { type: 'line'; line: string }
  > = [];

  let currentTableRows: string[][] = [];

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      chunks.push({ type: 'table', rows: currentTableRows });
      currentTableRows = [];
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      // Check if it's a separator line like |---|---|
      const isSep = /^\|[\s\-:|]+\|$/.test(line);
      if (!isSep) {
        // Extract cells
        const cells = line
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        currentTableRows.push(cells);
      }
    } else {
      flushTable();
      chunks.push({ type: 'line', line });
    }
  }
  flushTable();

  return (
    <div className="space-y-1.5">
      {chunks.map((chunk, cIdx) => {
        if (chunk.type === 'table') {
          return <MarkdownTable key={cIdx} rows={chunk.rows} />;
        }

        const trimmed = chunk.line;
        if (!trimmed) {
          return <div key={cIdx} className="h-1" />;
        }

        // Horizontal dividers (--- or ***)
        if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
          return <hr key={cIdx} className="my-2.5 border-white/10" />;
        }

        // Heading hierarchy
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={cIdx} className="text-sm font-bold text-[#C5A86A] mt-2.5 mb-1 tracking-tight flex items-center gap-1.5">
              <span>{renderInlineFormatting(trimmed.replace(/^####\s*/, ''))}</span>
            </h5>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={cIdx} className="text-sm sm:text-base font-bold text-[#C5A86A] mt-3 mb-1 tracking-tight flex items-center gap-1.5">
              <span>{renderInlineFormatting(trimmed.replace(/^###\s*/, ''))}</span>
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={cIdx} className="text-base sm:text-lg font-extrabold text-floral-white mt-3.5 mb-1.5 tracking-tight">
              {renderInlineFormatting(trimmed.replace(/^##\s*/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={cIdx} className="text-lg sm:text-xl font-black text-floral-white mt-4 mb-2 tracking-tight">
              {renderInlineFormatting(trimmed.replace(/^#\s*/, ''))}
            </h2>
          );
        }

        // Blockquotes (> Note:)
        if (trimmed.startsWith('> ')) {
          return (
            <div key={cIdx} className="pl-3.5 py-1.5 my-1.5 border-l-2 border-[#C5A86A] bg-white/5 rounded-r-lg text-sm text-warm-ivory/90 leading-relaxed">
              {renderInlineFormatting(trimmed.replace(/^>\s*/, ''))}
            </div>
          );
        }

        // Bullet lists (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={cIdx} className="flex items-start gap-2.5 pl-1 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A86A] mt-2 shrink-0" />
              <div className="flex-1 leading-relaxed text-floral-white/95">{renderInlineFormatting(itemText)}</div>
            </div>
          );
        }

        // Numbered steps (1. or Step 1:)
        if (/^(Step\s+\d+:|\d+\.)\s+/i.test(trimmed)) {
          const match = trimmed.match(/^(Step\s+\d+:|\d+\.)\s+(.*)$/i);
          if (match) {
            return (
              <div key={cIdx} className="flex items-start gap-2 pl-0.5 mt-1.5 text-sm sm:text-base">
                <span className="px-2 py-0.5 rounded-md bg-[#C5A86A]/20 text-[#C5A86A] font-mono text-xs font-bold shrink-0 border border-[#C5A86A]/30">
                  {match[1].replace(':', '')}
                </span>
                <div className="flex-1 pt-0.5 leading-relaxed text-floral-white/95">{renderInlineFormatting(match[2])}</div>
              </div>
            );
          }
        }

        // Regular paragraph line
        return (
          <p key={cIdx} className="leading-relaxed text-sm sm:text-base text-floral-white/95">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const MarkdownTable: React.FC<{ rows: string[][] }> = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#121924]/80 shadow-sm">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-[#17202E]">
          <tr>
            {header.map((col, hIdx) => (
              <th
                key={hIdx}
                className="px-3.5 py-2 font-semibold text-[#C5A86A] tracking-wider uppercase text-xs"
              >
                {renderInlineFormatting(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {body.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-white/5 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3.5 py-2 text-floral-white/90">
                  {renderInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
        <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-emerald-300 font-medium">
          {codeText}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
