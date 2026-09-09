import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-floral-white text-black-olive">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black-olive tracking-tight">
        The Bloch Sphere
      </h2>
      
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-black-olive/80 mb-6 flex-grow">
        <ul className="list-disc pl-5 space-y-2">
          <li>The <strong>Bloch sphere</strong> is a geometric representation of any single pure qubit state on the surface of a 3D unit sphere.</li>
          <li>Any pure state maps to <span className="font-mono text-slate-gray font-semibold">|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</span>.</li>
          <li>The North pole corresponds to <span className="font-mono font-bold text-black-olive">|0⟩</span>, and the South pole to <span className="font-mono font-bold text-black-olive">|1⟩</span>.</li>
          <li>The equator represents equal superposition states with varying relative phase: |+⟩, |−⟩, |i⟩, and |−i⟩.</li>
          <li>Quantum gates physically act as unitary rotations of this state vector about the sphere's axes.</li>
        </ul>
      </div>

      {/* Neumorphic Inset Panel */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-floral-white p-6 rounded-2xl shadow-neu-pressed mb-8">
        <div className="flex-1 w-full flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full max-w-sm font-sans select-none" fill="none">
            {/* Sphere outline */}
            <circle cx={cx} cy={cy} r={r} stroke="#31372B" strokeWidth="2" strokeOpacity="0.3" fill="#FAF7EE" />
            
            {/* Equator */}
            <ellipse cx={cx} cy={cy} rx={r * cosA} ry={r * sinA} stroke="#31372B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
            
            {/* Z axis */}
            <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
            <text x={cx} y={cy - r - 25} textAnchor="middle" fill="#31372B" fontSize="14" fontWeight="bold">|0⟩</text>
            <text x={cx} y={cy + r + 35} textAnchor="middle" fill="#31372B" fontSize="14" fontWeight="bold">|1⟩</text>

            {/* X axis */}
            <line x1={cx - r * cosA - 20 * cosA} y1={cy - r * sinA - 20 * sinA} x2={cx + r * cosA + 20 * cosA} y2={cy + r * sinA + 20 * sinA} stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
            <text x={cx + r * cosA + 28 * cosA} y={cy + r * sinA + 28 * sinA} textAnchor="middle" fill="#203C3D" fontSize="14" fontWeight="bold">|+⟩</text>

            {/* Y axis */}
            <line x1={cx + r * cosA + 20 * cosA} y1={cy - r * sinA - 20 * sinA} x2={cx - r * cosA - 20 * cosA} y2={cy + r * sinA + 20 * sinA} stroke="#31372B" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
            <text x={cx - r * cosA - 28 * cosA} y={cy + r * sinA + 28 * sinA} textAnchor="middle" fill="#31372B" fontSize="13" fontWeight="bold">|i⟩</text>
            
            {/* -X label */}
            <text x={cx - r * cosA - 28 * cosA} y={cy - r * sinA - 15 * sinA} textAnchor="middle" fill="#31372B" fontSize="13" fontWeight="bold">|−⟩</text>

            {/* State vector */}
            <line x1={cx} y1={cy} x2={cx + x2d} y2={cy + y2d} stroke="#203C3D" strokeWidth="3.5" markerEnd="url(#blochNeuArrow)" />
            <circle cx={cx + x2d} cy={cy + y2d} r="4" fill="#203C3D" />
            <text x={cx + x2d + 14} y={cy + y2d - 4} fill="#203C3D" fontSize="15" fontWeight="bold">|ψ⟩</text>

            {/* Center Origin */}
            <circle cx={cx} cy={cy} r="3" fill="#31372B" opacity="0.6" />

            <defs>
              <marker id="blochNeuArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#203C3D" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="flex-1 flex flex-col gap-5 w-full">
          <div>
            <div className="flex justify-between text-xs text-black-olive/80 mb-2 font-medium">
              <span>Polar Angle (θ)</span>
              <span className="text-slate-gray font-mono font-bold">{(theta / Math.PI).toFixed(2)}π</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={Math.PI} 
              step="0.01" 
              value={theta} 
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black-olive/20 accent-[#203C3D]"
            />
            <div className="flex justify-between text-[10px] text-black-olive/50 font-mono mt-1">
              <span>0 (North: |0⟩)</span>
              <span>π (South: |1⟩)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-black-olive/80 mb-2 font-medium">
              <span>Azimuthal Angle (φ) — Relative Phase</span>
              <span className="text-slate-gray font-mono font-bold">{(phi / Math.PI).toFixed(2)}π</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={2 * Math.PI} 
              step="0.01" 
              value={phi} 
              onChange={(e) => setPhi(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black-olive/20 accent-[#203C3D]"
            />
            <div className="flex justify-between text-[10px] text-black-olive/50 font-mono mt-1">
              <span>0</span>
              <span>2π</span>
            </div>
          </div>

          <div className="bg-floral-white p-4 rounded-xl shadow-neu-raised mt-2 space-y-1">
            <div className="text-[10px] text-black-olive/60 uppercase tracking-wider font-semibold">Current State Equation</div>
            <div className="font-mono text-sm md:text-base text-slate-gray font-bold">
              |ψ⟩ = {alpha}|0⟩ + {phaseStr}{phaseStr ? ' ' : ''}{betaMag}|1⟩
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-auto pt-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-black-olive/70 bg-floral-white shadow-neu-raised hover:shadow-neu-pressed disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-gray text-floral-white shadow-neu-raised hover:shadow-neu-pressed transition-all"
        >
          {isLast ? (
            <>Complete <Check size={16} /></>
          ) : (
            <>Next <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default BlochSphere;
