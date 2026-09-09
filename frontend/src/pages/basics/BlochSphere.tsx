import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface SectionProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const BlochSphere: React.FC<SectionProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);

  const r = 120;
  const cx = 200;
  const cy = 200;
  
  const x3d = r * Math.sin(theta) * Math.cos(phi);
  const y3d = r * Math.sin(theta) * Math.sin(phi);
  const z3d = r * Math.cos(theta);

  const angle = Math.PI / 6;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const x2d = x3d * cosA - y3d * cosA;
  const y2d = x3d * sinA + y3d * sinA - z3d;

  const alpha = Math.cos(theta / 2).toFixed(3);
  const betaMag = Math.sin(theta / 2).toFixed(3);
  const phaseStr = phi === 0 ? '' : `e^(${((phi / Math.PI)).toFixed(2)}πi)`;
  
  return (
    <div className="bg-slate-900/50 text-slate-100 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-white">The Bloch Sphere</h2>
        <div className="prose prose-invert max-w-none text-slate-300">
          <ul className="list-disc pl-5 space-y-2">
            <li>The Bloch sphere is a geometric representation of a single qubit's state</li>
            <li>Any pure qubit state |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ maps to a point on the sphere</li>
            <li>|0⟩ is at the north pole, |1⟩ at the south pole</li>
            <li>The equator represents equal superpositions with different phases: |+⟩, |−⟩, |i⟩, |−i⟩</li>
            <li>θ (theta) controls the polar angle — how much |0⟩ vs |1⟩</li>
            <li>φ (phi) controls the azimuthal angle — the relative phase</li>
            <li>Single-qubit gates correspond to rotations of the Bloch sphere</li>
            <li>The Hadamard gate, for example, rotates |0⟩ from the north pole to the equator at |+⟩</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
        <div className="flex-1 w-full flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full max-w-md font-sans" fill="none">
            {/* Sphere outline */}
            <circle cx={cx} cy={cy} r={r} className="stroke-slate-600 stroke-2 fill-slate-900/40" />
            
            {/* Equator */}
            <ellipse cx={cx} cy={cy} rx={r * cosA} ry={r * sinA} className="stroke-slate-600 stroke-1 stroke-dasharray-4" strokeDasharray="4 4" />
            
            {/* Z axis */}
            <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} className="stroke-slate-500 stroke-1" strokeDasharray="2 2" />
            <text x={cx} y={cy - r - 25} textAnchor="middle" className="fill-white text-sm font-semibold">|0⟩</text>
            <text x={cx} y={cy + r + 35} textAnchor="middle" className="fill-white text-sm font-semibold">|1⟩</text>

            {/* X axis */}
            <line x1={cx - r * cosA - 20 * cosA} y1={cy - r * sinA - 20 * sinA} x2={cx + r * cosA + 20 * cosA} y2={cy + r * sinA + 20 * sinA} className="stroke-slate-500 stroke-1" strokeDasharray="2 2" />
            <text x={cx + r * cosA + 30 * cosA} y={cy + r * sinA + 30 * sinA} textAnchor="middle" className="fill-white text-sm font-semibold">|+⟩</text>

            {/* Y axis */}
            <line x1={cx + r * cosA + 20 * cosA} y1={cy - r * sinA - 20 * sinA} x2={cx - r * cosA - 20 * cosA} y2={cy + r * sinA + 20 * sinA} className="stroke-slate-500 stroke-1" strokeDasharray="2 2" />
            <text x={cx - r * cosA - 30 * cosA} y={cy + r * sinA + 30 * sinA} textAnchor="middle" className="fill-white text-sm font-semibold">|i⟩</text>
            
            {/* -X axis label */}
            <text x={cx - r * cosA - 30 * cosA} y={cy - r * sinA - 15 * sinA} textAnchor="middle" className="fill-white text-sm font-semibold">|−⟩</text>

            {/* State vector */}
            <line x1={cx} y1={cy} x2={cx + x2d} y2={cy + y2d} className="stroke-teal-400 stroke-[3]" markerEnd="url(#arrow-teal)" />
            <circle cx={cx + x2d} cy={cy + y2d} r="4" className="fill-teal-300" />
            <text x={cx + x2d + 15} y={cy + y2d - 5} className="fill-teal-200 text-sm font-semibold">|ψ⟩</text>

            {/* Origin */}
            <circle cx={cx} cy={cy} r="3" className="fill-slate-400" />

            <defs>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-teal-400" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full">
          <div>
            <label className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Polar Angle (θ)</span>
              <span className="text-indigo-300 font-mono">{(theta / Math.PI).toFixed(2)}π</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max={Math.PI} 
              step="0.01" 
              value={theta} 
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0</span>
              <span>π</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Azimuthal Angle (φ)</span>
              <span className="text-teal-300 font-mono">{(phi / Math.PI).toFixed(2)}π</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max={2 * Math.PI} 
              step="0.01" 
              value={phi} 
              onChange={(e) => setPhi(parseFloat(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0</span>
              <span>2π</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700/50 mt-2">
            <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Current State Equation</div>
            <div className="font-mono text-sm md:text-base text-slate-200">
              |ψ⟩ = {alpha}|0⟩ + {phaseStr}{phaseStr ? ' ' : ''}{betaMag}|1⟩
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button 
          onClick={onPrev} 
          disabled={isFirst}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFirst ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors"
        >
          {isLast ? <><Check size={18} /> Complete</> : <>Next <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

export default BlochSphere;
