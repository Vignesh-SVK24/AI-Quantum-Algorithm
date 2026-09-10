import React from 'react';
import { Activity, Sparkles, Hash } from 'lucide-react';
import type { QuantumVisualizationData } from './types';
import { computeBlochCoordinates } from './types';

interface QuantumStateInfoProps {
  data: QuantumVisualizationData;
}

export const QuantumStateInfo: React.FC<QuantumStateInfoProps> = ({ data }) => {
  const { numQubits, statevector, measurementCounts, algorithmName } = data;
  const isSingleQubit = numQubits === 1;
  const bloch = isSingleQubit ? computeBlochCoordinates(statevector) : null;

  // Format complex amplitude
  const formatAmp = (real: number, imag: number): string => {
    const threshold = 0.0001;
    const r = Math.abs(real) < threshold ? 0 : real;
    const i = Math.abs(imag) < threshold ? 0 : imag;
    if (r === 0 && i === 0) return '0';
    if (i === 0) return r.toFixed(3);
    if (r === 0) return `${i.toFixed(3)}i`;
    const sign = i > 0 ? '+' : '-';
    return `${r.toFixed(3)} ${sign} ${Math.abs(i).toFixed(3)}i`;
  };

  return (
    <div className="p-3.5 rounded-2xl bg-floral-white shadow-neu-sm-raised border border-black-olive/10 space-y-3 text-black-olive">
      <div className="flex items-center justify-between border-b border-black-olive/10 pb-2">
        <span className="text-xs font-bold text-slate-gray uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> Quantum State Readout
        </span>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-gray/10 text-slate-gray">
          {numQubits} Qubit{numQubits > 1 ? 's' : ''} ({Math.pow(2, numQubits)} Dim)
        </span>
      </div>

      {isSingleQubit && bloch && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-floral-white shadow-neu-sm-pressed text-center">
            <div className="text-[10px] text-slate-gray font-semibold">P(|0⟩)</div>
            <div className="font-bold text-black-olive">{(bloch.p0 * 100).toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded-xl bg-floral-white shadow-neu-sm-pressed text-center">
            <div className="text-[10px] text-slate-gray font-semibold">P(|1⟩)</div>
            <div className="font-bold text-black-olive">{(bloch.p1 * 100).toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded-xl bg-floral-white shadow-neu-sm-pressed text-center">
            <div className="text-[10px] text-slate-gray font-semibold">Polar &theta;</div>
            <div className="font-bold text-black-olive">{((bloch.theta * 180) / Math.PI).toFixed(1)}&deg;</div>
          </div>
          <div className="p-2 rounded-xl bg-floral-white shadow-neu-sm-pressed text-center">
            <div className="text-[10px] text-slate-gray font-semibold">Azimuth &phi;</div>
            <div className="font-bold text-black-olive">{((bloch.phi * 180) / Math.PI).toFixed(1)}&deg;</div>
          </div>
        </div>
      )}

      {/* Statevector Amplitudes Table */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-gray uppercase tracking-wider flex items-center gap-1">
          <Hash className="w-3 h-3" /> State Amplitudes & Probabilities
        </div>
        <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
          {statevector.map((amp) => {
            const prob = (Math.pow(amp.real, 2) + Math.pow(amp.imag, 2)) * 100;
            if (prob < 0.01 && statevector.length > 4) return null; // hide negligible amplitudes on large spaces
            const counts = measurementCounts?.[amp.basis];
            return (
              <div key={amp.basis} className="flex items-center justify-between p-1.5 rounded-lg bg-black-olive/5">
                <span className="font-bold text-slate-gray">{amp.basis}</span>
                <span className="text-black-olive/75">{formatAmp(amp.real, amp.imag)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black-olive">{prob.toFixed(1)}%</span>
                  {counts !== undefined && counts > 0 && (
                    <span className="text-[10px] text-slate-gray/70">({counts})</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {algorithmName && (
        <div className="pt-2 border-t border-black-olive/10 text-[11px] text-slate-gray font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Context: {algorithmName.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
