import React from 'react';
import { AlertCircle, Globe2, BarChart3 } from 'lucide-react';
import type { QuantumVisualizationData } from './types';
import { computeBlochCoordinates } from './types';

interface WebGLFallbackProps {
  data: QuantumVisualizationData;
  reason?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ data, reason }) => {
  const { numQubits, statevector, basisStateProbabilities, measurementCounts } = data;

  const isSingleQubit = numQubits === 1;
  const bloch = isSingleQubit ? computeBlochCoordinates(statevector) : null;

  // 2D SVG projection parameters
  const cx = 130;
  const cy = 130;
  const r = 80;
  const angle = Math.PI / 6;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const theta = bloch ? bloch.theta : 0;
  const phi = bloch ? bloch.phi : 0;
  const x3d = r * Math.sin(theta) * Math.cos(phi);
  const y3d = r * Math.sin(theta) * Math.sin(phi);
  const z3d = r * Math.cos(theta);

  // Isometric mapping
  const x2d = cx + (x3d - y3d) * cosA;
  const y2d = cy + (x3d + y3d) * sinA - z3d;

  return (
    <div className="w-full p-4 rounded-2xl bg-floral-white shadow-neu-pressed border border-black-olive/10 space-y-4">
      {/* Notice Banner */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-gray/10 text-slate-gray text-xs font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>
          {reason || '2D Fallback View: High-fidelity mathematical representation active.'}
        </span>
      </div>

      {isSingleQubit && bloch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* 2D SVG Bloch Sphere */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-floral-white shadow-neu-raised">
            <span className="text-xs font-bold text-slate-gray uppercase tracking-wider mb-1 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> 2D Bloch Projection
            </span>
            <svg viewBox="0 0 260 260" className="w-48 h-48 select-none" fill="none">
              {/* Outer boundary */}
              <circle cx={cx} cy={cy} r={r} stroke="#31372B" strokeWidth="1.5" strokeOpacity="0.25" fill="#FAF7EE" />
              {/* Equator */}
              <ellipse cx={cx} cy={cy} rx={r * cosA} ry={r * sinA} stroke="#31372B" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.3" />
              {/* Z Axis */}
              <line x1={cx} y1={cy - r - 12} x2={cx} y2={cy + r + 12} stroke="#31372B" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.4" />
              <text x={cx} y={cy - r - 16} textAnchor="middle" fill="#31372B" fontSize="11" fontWeight="bold" fontFamily="monospace">|0⟩ (+Z)</text>
              <text x={cx} y={cy + r + 24} textAnchor="middle" fill="#31372B" fontSize="11" fontWeight="bold" fontFamily="monospace">|1⟩ (-Z)</text>
              {/* State Vector Arrow */}
              <line x1={cx} y1={cy} x2={x2d} y2={y2d} stroke="#203C3D" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={x2d} cy={y2d} r="5" fill="#203C3D" />
            </svg>
          </div>

          {/* Probabilities & Angles */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-floral-white shadow-neu-sm-raised space-y-1.5 font-mono">
              <div className="text-[11px] font-bold text-slate-gray uppercase tracking-wider">Coordinates & Probabilities</div>
              <div className="flex justify-between">
                <span>P(|0⟩):</span>
                <span className="font-bold text-black-olive">{(bloch.p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black-olive/10 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-gray h-full transition-all duration-300" style={{ width: `${bloch.p0 * 100}%` }} />
              </div>

              <div className="flex justify-between pt-1">
                <span>P(|1⟩):</span>
                <span className="font-bold text-black-olive">{(bloch.p1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black-olive/10 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-gray/70 h-full transition-all duration-300" style={{ width: `${bloch.p1 * 100}%` }} />
              </div>

              <div className="pt-2 text-[10px] text-black-olive/70 flex justify-between border-t border-black-olive/10">
                <span>&theta; = {((bloch.theta * 180) / Math.PI).toFixed(1)}&deg;</span>
                <span>&phi; = {((bloch.phi * 180) / Math.PI).toFixed(1)}&deg;</span>
                <span>z = {bloch.z.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-qubit Probabilities Table */}
      {!isSingleQubit && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-gray uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Basis State Probabilities ({numQubits} Qubits)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(basisStateProbabilities).map(([basis, prob]) => {
              const pct = (prob * 100).toFixed(1);
              const counts = measurementCounts?.[basis] || 0;
              return (
                <div key={basis} className="p-2.5 rounded-xl bg-floral-white shadow-neu-sm-raised text-center space-y-1">
                  <div className="font-mono text-xs font-bold text-slate-gray">{basis}</div>
                  <div className="text-sm font-bold text-black-olive">{pct}%</div>
                  {counts > 0 && (
                    <div className="text-[10px] text-black-olive/60 font-mono">{counts} shots</div>
                  )}
                  <div className="w-full bg-black-olive/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-gray h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
