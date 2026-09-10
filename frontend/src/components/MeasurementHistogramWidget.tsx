import React from 'react';
import { BarChart3, HelpCircle } from 'lucide-react';

interface MeasurementHistogramWidgetProps {
  measurementCounts: Record<string, number>;
  probabilities: Record<string, number>;
  shots: number;
}

export const MeasurementHistogramWidget: React.FC<MeasurementHistogramWidgetProps> = ({
  measurementCounts,
  probabilities,
  shots,
}) => {
  const sortedEntries = Object.entries(measurementCounts).sort(([a], [b]) => a.localeCompare(b));
  const maxCount = Math.max(...Object.values(measurementCounts), 1);

  return (
    <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-soft-sand space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-olive-mist" /> Measurement Histogram
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-warm-ivory border border-soft-sand text-black-olive">
          {shots.toLocaleString()} Shots
        </span>
      </div>

      <p className="text-[11px] text-olive-mist leading-relaxed">
        Repeated measurements collapse the quantum state into classical bitstrings according to Born's rule.
      </p>

      {/* Histogram Screen Inset */}
      <div className="p-4 bg-warm-ivory/60 border border-soft-sand rounded-2xl">
        <div className="flex items-end justify-around gap-2 h-32 pb-2">
          {sortedEntries.map(([basis, count]) => {
            const observedPct = ((count / shots) * 100).toFixed(1);
            const theoreticalProb = probabilities[basis] || 0;
            const theoreticalPct = (theoreticalProb * 100).toFixed(1);
            const heightPct = Math.max((count / maxCount) * 100, 5);

            return (
              <div key={basis} className="flex-1 max-w-[64px] flex flex-col items-center gap-1.5 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black-olive text-warm-ivory text-[10px] rounded-xl px-2.5 py-1.5 pointer-events-none shadow-xl border border-black-olive/40 z-20 whitespace-nowrap">
                  <div className="font-bold text-warm-gold">{basis}: {count} shots ({observedPct}%)</div>
                  <div className="text-warm-ivory/70">Theory: {theoreticalPct}%</div>
                </div>

                {/* Count label */}
                <span className="text-[10px] font-mono font-bold text-black-olive">{count}</span>

                {/* Bar Track & Fill */}
                <div className="w-full bg-warm-ivory border border-soft-sand rounded-t-lg relative flex items-end h-20 overflow-hidden p-0.5">
                  <div
                    className="w-full bg-slate-glow rounded-t-md transition-all duration-500 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                {/* Basis Label */}
                <span className="text-[11px] font-mono font-bold text-black-olive mt-0.5">{basis}</span>
                <span className="text-[9px] font-mono text-olive-mist">{observedPct}%</span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 pt-2 border-t border-soft-sand flex items-center justify-between text-[10px] text-olive-mist px-1 font-mono">
          <span>X: Basis State</span>
          <span>Y: Shot Frequency</span>
        </div>
      </div>

      {/* Comparison with Theoretical */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-black-olive">
          <span>Theoretical vs. Observed Distribution</span>
          <HelpCircle className="w-3 h-3 text-olive-mist" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2.5 rounded-xl bg-warm-ivory border border-soft-sand shadow-sm">
            <span className="text-olive-mist block mb-0.5">Born Rule Amplitude:</span>
            <span className="text-black-olive font-bold">Exact |c_i|² state probabilities</span>
          </div>
          <div className="p-2.5 rounded-xl bg-warm-ivory border border-soft-sand shadow-sm">
            <span className="text-olive-mist block mb-0.5">Simulated Sampling:</span>
            <span className="text-black-olive font-bold">Statistical 1024-shot variance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
