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
      <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-gray text-xs font-semibold uppercase tracking-wider">
          <Globe2 className="w-4 h-4" /> Bloch Sphere (Single Qubit)
        </div>
        <p className="text-xs text-black-olive/70 leading-relaxed">
          The Bloch sphere represents <strong>single-qubit pure states</strong>. For {numQubits}-qubit circuits (such as entangled Bell states), the global state exists in a higher-dimensional Hilbert space (2^{numQubits} = {Math.pow(2, numQubits)} dimensions).
        </p>
        <div className="text-[11px] font-mono text-slate-gray bg-floral-white p-2.5 rounded-xl shadow-neu-raised">
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
    <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black-olive uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-gray" /> Bloch Sphere
        </span>
        <div className="flex gap-2 text-[10px] font-mono text-black-olive/70">
          <span>&theta; = {thetaDeg}&deg;</span>
          <span>&phi; = {phiDeg}&deg;</span>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <svg viewBox="0 0 260 260" className="w-44 h-44 sm:w-48 sm:h-48 font-sans select-none" fill="none">
          {/* Sphere circle */}
          <circle cx={cx} cy={cy} r={r} stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.3" fill="#FAF7EE" />

          {/* Equator ellipse */}
          <ellipse cx={cx} cy={cy} rx={r * cosA} ry={r * sinA} stroke="#31372B" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.3" />

          {/* Z Axis (|0> North, |1> South) */}
          <line x1={cx} y1={cy - r - 14} x2={cx} y2={cy + r + 14} stroke="#31372B" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
          <text x={cx} y={cy - r - 16} textAnchor="middle" fill="#31372B" fontSize="11" fontWeight="bold" fontFamily="monospace">|0⟩</text>
          <text x={cx} y={cy + r + 24} textAnchor="middle" fill="#31372B" fontSize="11" fontWeight="bold" fontFamily="monospace">|1⟩</text>

          {/* X Axis */}
          <line
            x1={cx - (r + 14) * cosA}
            y1={cy - (r + 14) * sinA}
            x2={cx + (r + 14) * cosA}
            y2={cy + (r + 14) * sinA}
            stroke="#31372B"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeOpacity="0.3"
          />
          <text x={cx + (r + 20) * cosA} y={cy + (r + 20) * sinA + 3} textAnchor="middle" fill="#203C3D" fontSize="10" fontWeight="bold" fontFamily="monospace">|+⟩</text>
          <text x={cx - (r + 20) * cosA} y={cy - (r + 20) * sinA - 2} textAnchor="middle" fill="#31372B" opacity="0.6" fontSize="10" fontFamily="monospace">|−⟩</text>

          {/* Center reference dot */}
          <circle cx={cx} cy={cy} r={2.5} fill="#31372B" opacity="0.4" />

          {/* State vector arrow */}
          <line
            x1={cx}
            y1={cy}
            x2={x2d}
            y2={y2d}
            stroke="#203C3D"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Vector tip */}
          <circle cx={x2d} cy={y2d} r={4.5} fill="#203C3D" />
        </svg>
      </div>

      <div className="bg-floral-white p-3 rounded-xl shadow-neu-raised text-[11px] font-mono text-black-olive/80 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-black-olive/60">Coordinates:</span>
          <span className="text-slate-gray font-bold">
            ({Math.sin(theta) * Math.cos(phi) >= 0 ? '+' : ''}{(Math.sin(theta) * Math.cos(phi)).toFixed(2)},{' '}
            {Math.sin(theta) * Math.sin(phi) >= 0 ? '+' : ''}{(Math.sin(theta) * Math.sin(phi)).toFixed(2)},{' '}
            {Math.cos(theta) >= 0 ? '+' : ''}{(Math.cos(theta)).toFixed(2)})
          </span>
        </div>
        <div className="text-[10px] text-black-olive/70 text-center pt-1 border-t border-black-olive/10">
          |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
        </div>
      </div>
    </div>
  );
};
