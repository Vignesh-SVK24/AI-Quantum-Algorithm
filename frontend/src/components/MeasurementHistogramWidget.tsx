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
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-teal-400" /> Measurement Histogram
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
          {shots.toLocaleString()} Shots
        </span>
      </div>

      <p className="text-[11px] text-slate-400">
        Repeated measurements collapse the quantum state into classical bitstrings according to Born's rule.
      </p>

      {/* Histogram Bars */}
      <div className="pt-3 pb-2 px-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <div className="flex items-end justify-around gap-2 h-28 border-b border-slate-800 pb-2">
          {sortedEntries.map(([basis, count]) => {
            const observedPct = ((count / shots) * 100).toFixed(1);
            const theoreticalProb = probabilities[basis] || 0;
            const theoreticalPct = (theoreticalProb * 100).toFixed(1);
            const heightPct = Math.max((count / maxCount) * 100, 4);

            return (
              <div key={basis} className="flex-1 max-w-[64px] flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 text-[10px] rounded px-2 py-1 pointer-events-none shadow-xl z-20 whitespace-nowrap">
                  <div className="font-bold text-white">{basis}: {count} shots ({observedPct}%)</div>
                  <div className="text-slate-400">Theory: {theoreticalPct}%</div>
                </div>

                {/* Count label */}
                <span className="text-[10px] font-mono font-bold text-teal-300">{count}</span>

                {/* Bar */}
                <div className="w-full bg-slate-800/60 rounded-t-md relative flex items-end h-20 overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 via-teal-500 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                {/* Basis Label */}
                <span className="text-[11px] font-mono font-bold text-slate-300 mt-1">{basis}</span>
                <span className="text-[9px] font-mono text-slate-500">{observedPct}%</span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>X-axis: Basis State</span>
          <span>Y-axis: Shot Frequency</span>
        </div>
      </div>

      {/* Comparison with Theoretical */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
          <span>Theoretical vs. Observed Distribution</span>
          <HelpCircle className="w-3 h-3 text-slate-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-slate-500 block mb-0.5">Theoretical Born Probabilities:</span>
            <span className="text-indigo-300">Exact $|c_i|^2$ state amplitudes</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="text-slate-500 block mb-0.5">Simulated Sampling:</span>
            <span className="text-teal-300">Real statistical variance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
