import React from 'react';
import { Globe2 } from 'lucide-react';

interface AmplitudeEntry {
  basis: string;
  real: number;
  imag: number;
}

interface BlochSphereWidgetProps {
  statevector: AmplitudeEntry[];
  numQubits: number;
}

export const BlochSphereWidget: React.FC<BlochSphereWidgetProps> = ({ statevector, numQubits }) => {
  if (numQubits > 1) {
    return (
      <div className="p-4 rounded-xl bg-floral-white text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-gray text-xs font-semibold uppercase tracking-wider">
          <Globe2 className="w-4 h-4" /> Bloch Sphere (Single Qubit)
        </div>
        <p className="text-xs text-black-olive/70">
          The Bloch sphere represents <strong>single-qubit pure states</strong>. For {numQubits}-qubit circuits (such as entangled Bell states), the global state exists in a higher-dimensional Hilbert space ($2^{numQubits} = {Math.pow(2, numQubits)}$ dimensions).
        </p>
        <div className="text-[11px] font-mono text-slate-gray bg-floral-white p-2 rounded-2xl">
          Tip: Switch to 1 Qubit in the circuit builder to explore single-qubit Bloch rotations!
        </div>
      </div>
    );
  }

  // 1-Qubit extraction
  const alphaEntry = statevector.find(e => e.basis === '|0>' || e.basis === '|0⟩') || statevector[0] || { real: 1, imag: 0 };
  const betaEntry = statevector.find(e => e.basis === '|1>' || e.basis === '|1⟩') || statevector[1] || { real: 0, imag: 0 };

  const magAlpha = Math.sqrt(alphaEntry.real ** 2 + alphaEntry.imag ** 2);
  const magBeta = Math.sqrt(betaEntry.real ** 2 + betaEntry.imag ** 2);
  const norm = Math.sqrt(magAlpha ** 2 + magBeta ** 2) || 1;
  const a = Math.min(1, Math.max(0, magAlpha / norm));

  const theta = 2 * Math.acos(a);

  const argAlpha = Math.atan2(alphaEntry.imag, alphaEntry.real);
  const argBeta = Math.atan2(betaEntry.imag, betaEntry.real);
  let phi = argBeta - argAlpha;
  if (phi < 0) phi += 2 * Math.PI;
  if (phi >= 2 * Math.PI) phi -= 2 * Math.PI;

  // 2D isometric projection
  const cx = 130;
  const cy = 130;
  const r = 85;
  const angle = Math.PI / 6;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const x3d = r * Math.sin(theta) * Math.cos(phi);
  const y3d = r * Math.sin(theta) * Math.sin(phi);
  const z3d = r * Math.cos(theta);

  const x2d = cx + (x3d - y3d) * cosA;
  const y2d = cy + (x3d + y3d) * sinA - z3d;

  const thetaDeg = ((theta * 180) / Math.PI).toFixed(1);
  const phiDeg = ((phi * 180) / Math.PI).toFixed(1);

  return (
    <div className="p-4 rounded-xl bg-floral-white space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-gray" /> Bloch Sphere
        </span>
        <div className="flex gap-2 text-[10px] font-mono text-black-olive/70">
          <span>&theta; = {thetaDeg}&deg;</span>
          <span>&phi; = {phiDeg}&deg;</span>
        </div>
      </div>

      <div className="flex justify-center">
        <svg viewBox="0 0 260 260" className="w-44 h-44 sm:w-48 sm:h-48 font-sans select-none" fill="none">
          {/* Outer glow aura */}
          <circle cx={cx} cy={cy} r={r + 8} className="fill-indigo-500/5 stroke-none" />

          {/* Sphere circle */}
          <circle cx={cx} cy={cy} r={r} className="stroke-slate-700/80 stroke-1 fill-slate-950/40" />

          {/* Equator ellipse */}
          <ellipse cx={cx} cy={cy} rx={r * cosA} ry={r * sinA} className="stroke-slate-700 stroke-1" strokeDasharray="3 3" />

          {/* Z Axis (|0> North, |1> South) */}
          <line x1={cx} y1={cy - r - 14} x2={cx} y2={cy + r + 14} className="stroke-slate-600 stroke-1" strokeDasharray="2 2" />
          <text x={cx} y={cy - r - 18} textAnchor="middle" className="fill-teal-300 text-[11px] font-bold font-mono">|0⟩</text>
          <text x={cx} y={cy + r + 24} textAnchor="middle" className="fill-indigo-300 text-[11px] font-bold font-mono">|1⟩</text>

          {/* X Axis (+|- superposition) */}
          <line
            x1={cx - (r + 14) * cosA}
            y1={cy - (r + 14) * sinA}
            x2={cx + (r + 14) * cosA}
            y2={cy + (r + 14) * sinA}
            className="stroke-slate-700 stroke-1"
            strokeDasharray="2 2"
          />
          <text x={cx + (r + 20) * cosA} y={cy + (r + 20) * sinA + 3} textAnchor="middle" className="fill-slate-400 text-[9px] font-mono">|+⟩</text>
          <text x={cx - (r + 20) * cosA} y={cy - (r + 20) * sinA - 2} textAnchor="middle" className="fill-slate-500 text-[9px] font-mono">|−⟩</text>

          {/* Y Axis */}
          <line
            x1={cx + (r + 12) * cosA}
            y1={cy - (r + 12) * sinA}
            x2={cx - (r + 12) * cosA}
            y2={cy + (r + 12) * sinA}
            className="stroke-slate-800 stroke-1"
            strokeDasharray="2 2"
          />

          {/* Center reference dot */}
          <circle cx={cx} cy={cy} r={2} className="fill-slate-600" />

          {/* State vector arrow */}
          <line
            x1={cx}
            y1={cy}
            x2={x2d}
            y2={y2d}
            className="stroke-teal-400 stroke-2"
            strokeLinecap="round"
          />

          {/* Glowing Vector tip */}
          <circle cx={x2d} cy={y2d} r={5} className="fill-teal-300 shadow-neu-raised" />
          <circle cx={x2d} cy={y2d} r={9} className="stroke-teal-400/50 stroke-1 fill-none animate-ping" />
        </svg>
      </div>

      <div className="bg-floral-white p-2.5 rounded-2xl text-[11px] font-mono text-black-olive/70 space-y-1">
        <div className="flex justify-between">
          <span className="text-black-olive/70">Coordinates:</span>
          <span className="text-slate-gray">
            ({Math.sin(theta) * Math.cos(phi) >= 0 ? '+' : ''}{(Math.sin(theta) * Math.cos(phi)).toFixed(2)},{' '}
            {Math.sin(theta) * Math.sin(phi) >= 0 ? '+' : ''}{(Math.sin(theta) * Math.sin(phi)).toFixed(2)},{' '}
            {Math.cos(theta) >= 0 ? '+' : ''}{(Math.cos(theta)).toFixed(2)})
          </span>
        </div>
        <div className="text-[10px] text-black-olive/70 text-center pt-1 -t">
          |&psi;⟩ = cos(&theta;/2)|0⟩ + e^{'{i\u03C6}'}sin(&theta;/2)|1⟩
        </div>
      </div>
    </div>
  );
};
