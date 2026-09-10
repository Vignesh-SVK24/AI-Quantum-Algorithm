import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface StateComparisonWidgetProps {
  numQubits: number;
  probabilities: Record<string, number>;
  numGates: number;
}

export const StateComparisonWidget: React.FC<StateComparisonWidgetProps> = ({
  numQubits,
  probabilities,
  numGates,
}) => {
  const initialStateBasis = `|${'0'.repeat(numQubits)}⟩`;
  const nonZeroStates = Object.entries(probabilities).filter(([, p]) => p > 0.001);

  // Classify resulting state
  let stateTag = 'Quantum State';
  let stateDesc = 'State modified by unitary transformation';

  if (numGates === 0) {
    stateTag = 'Ground State';
    stateDesc = 'Circuit is at identity';
  } else if (nonZeroStates.length === 1 && nonZeroStates[0][0] === initialStateBasis) {
    stateTag = 'Ground State';
    stateDesc = 'Circuit returned qubit to initial ground state';
  } else if (nonZeroStates.length === 1) {
    stateTag = 'Deterministic Basis State';
    stateDesc = `Rotated to pure computational state ${nonZeroStates[0][0]}`;
  } else if (nonZeroStates.length === 2 && Math.abs(nonZeroStates[0][1] - 0.5) < 0.05) {
    if (numQubits > 1 && (nonZeroStates.some(([b]) => b.includes('00')) && nonZeroStates.some(([b]) => b.includes('11')))) {
      stateTag = 'Bell State (|Φ⁺⟩)';
      stateDesc = 'Two qubits are maximally entangled (|00⟩ + |11⟩)/√2';
    } else {
      stateTag = 'Equal Superposition';
      stateDesc = 'Balanced probability amplitudes (|0⟩ + |1⟩)/√2';
    }
  } else if (nonZeroStates.length > 2) {
    stateTag = `Superposition (${nonZeroStates.length} states)`;
    stateDesc = 'Multi-state coherent superposition';
  }

  return (
    <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-soft-sand space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-warm-gold" /> State Transformation
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-warm-ivory border border-soft-sand text-black-olive">
          {stateTag}
        </span>
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-2.5 items-center">
        {/* BEFORE CARD */}
        <div className="bg-warm-ivory/60 border border-soft-sand p-3.5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-black-olive/80">
            <span>BEFORE</span>
            <span className="text-olive-mist text-[9px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-muted-sage" /> Ground
            </span>
          </div>

          <div className="text-center py-1">
            <div className="text-base font-bold font-mono text-black-olive">{initialStateBasis}</div>
            <div className="text-[10px] text-olive-mist mt-0.5">100% Probability</div>
          </div>

          <div className="h-2 bg-floral-white border border-soft-sand rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-slate-glow rounded-full w-full" />
          </div>
          <div className="text-[9px] text-olive-mist text-center font-mono">
            P({initialStateBasis}) = 1.000
          </div>
        </div>

        {/* TRANSFORMATION ARROW */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="w-7 h-7 rounded-xl bg-warm-ivory border border-soft-sand flex items-center justify-center text-black-olive shadow-sm">
            <ArrowRight className="w-3.5 h-3.5 text-warm-gold" />
          </div>
          <span className="text-[9px] font-mono text-olive-mist mt-1">{numGates} gate{numGates === 1 ? '' : 's'}</span>
        </div>

        {/* AFTER CARD */}
        <div className="bg-warm-ivory/60 border border-soft-sand p-3.5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-black-olive/80">
            <span>AFTER</span>
            <span className="text-olive-mist text-[9px] font-mono">{nonZeroStates.length} Active</span>
          </div>

          <div className="space-y-2 py-0.5">
            {nonZeroStates.slice(0, 3).map(([basis, prob]) => (
              <div key={basis} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-black-olive font-bold">{basis}</span>
                  <span className="text-olive-mist font-semibold">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-floral-white border border-soft-sand rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-slate-glow rounded-full transition-all duration-300"
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {nonZeroStates.length > 3 && (
              <div className="text-[9px] text-olive-mist text-right">
                +{nonZeroStates.length - 3} more...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-black-olive bg-warm-ivory border border-soft-sand p-3 rounded-xl flex items-start gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-warm-gold mt-1.5 flex-shrink-0" />
        <span className="leading-relaxed">{stateDesc}</span>
      </div>
    </div>
  );
};
