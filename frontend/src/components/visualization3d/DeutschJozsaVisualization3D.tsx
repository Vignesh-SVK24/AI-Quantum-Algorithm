import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Sparkles, ChevronRight } from 'lucide-react';

interface DeutschJozsaVisualization3DProps {
  oracleType?: 'constant' | 'balanced';
}

export const DeutschJozsaVisualization3D: React.FC<DeutschJozsaVisualization3DProps> = ({
  oracleType = 'balanced'
}) => {
  const [stageIdx, setStageIdx] = useState(0);
  const isBalanced = oracleType === 'balanced';

  const stages = [
    {
      name: '1. State Initialization',
      desc: 'Input qubit initialized to |0⟩, ancilla qubit initialized to |1⟩: state |01⟩.',
      probs: { '|00>': 0.0, '|01>': 1.0, '|10>': 0.0, '|11>': 0.0 }
    },
    {
      name: '2. Dual Hadamard Superposition',
      desc: 'Hadamard on both qubits creates (|0⟩+|1⟩)(|0⟩−|1⟩)/2, placing the ancilla in phase-sensitive |−⟩ state.',
      probs: { '|00>': 0.25, '|01>': 0.25, '|10>': 0.25, '|11>': 0.25 }
    },
    {
      name: '3. Quantum Phase Oracle Query',
      desc: isBalanced
        ? 'Balanced Oracle applies phase kickback: states where f(x)=1 acquire a π phase flip (-1), creating destructive interference.'
        : 'Constant Oracle f(x)=c applies uniform global phase without altering relative phase.',
      probs: { '|00>': 0.25, '|01>': 0.25, '|10>': 0.25, '|11>': 0.25 }
    },
    {
      name: '4. Interference & Measurement',
      desc: isBalanced
        ? 'Final Hadamard on input qubit causes complete destructive interference for |0⟩. Input measures |1⟩ with 100% certainty → BALANCED!'
        : 'Final Hadamard on input qubit causes constructive interference at |0⟩. Input measures |0⟩ with 100% certainty → CONSTANT!',
      probs: isBalanced
        ? { '|00>': 0.0, '|01>': 0.0, '|10>': 0.5, '|11>': 0.5 }
        : { '|00>': 0.5, '|01>': 0.5, '|10>': 0.0, '|11>': 0.0 }
    }
  ];

  const current = stages[stageIdx];
  const entries = Object.entries(current.probs);

  return (
    <div className="w-full space-y-3">
      <div className="w-full h-72 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10">
        <Canvas camera={{ position: [3.0, 3.5, 4.0], fov: 42 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={8.0} />

          {/* Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <planeGeometry args={[5, 4]} />
            <meshStandardMaterial color="#FAF7EE" roughness={0.7} />
          </mesh>

          {/* 3D Probability Columns */}
          {entries.map(([basis, prob], idx) => {
            const x = (idx - 1.5) * 1.1;
            const barHeight = Math.max(0.04, prob * 2.2);
            const y = barHeight / 2;
            const isNonZero = prob > 0.01;

            return (
              <group key={basis} position={[x, 0, 0]}>
                <mesh position={[0, y, 0]}>
                  <boxGeometry args={[0.7, barHeight, 0.7]} />
                  <meshStandardMaterial
                    color={isNonZero ? '#203C3D' : '#31372B'}
                    roughness={0.25}
                    metalness={0.2}
                    transparent
                    opacity={isNonZero ? 0.92 : 0.2}
                  />
                </mesh>

                {prob > 0.05 && (
                  <Html position={[0, barHeight + 0.22, 0]} center distanceFactor={6}>
                    <div className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-gray text-floral-white shadow-neu-sm-raised select-none whitespace-nowrap">
                      {(prob * 100).toFixed(0)}%
                    </div>
                  </Html>
                )}

                <Html position={[0, -0.22, 0.5]} center distanceFactor={6}>
                  <div className="font-mono text-xs font-bold text-black-olive select-none whitespace-nowrap">
                    {basis}
                  </div>
                </Html>
              </group>
            );
          })}
        </Canvas>

        {/* Floating Info */}
        <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-black-olive/80 bg-floral-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-neu-sm-raised border border-black-olive/10">
          <div className="font-bold text-slate-gray text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Deutsch-Jozsa Quantum Interference
          </div>
          <div>Oracle: {isBalanced ? 'Balanced Function' : 'Constant Function'}</div>
          <div>Stage: {current.name}</div>
        </div>
      </div>

      {/* Stepping controls */}
      <div className="p-3 rounded-2xl bg-floral-white shadow-neu-sm-raised border border-black-olive/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-gray uppercase tracking-wider">
            {current.name}
          </span>
          <div className="flex items-center gap-1.5">
            {stages.map((_, sIdx) => (
              <button
                key={`dot-${sIdx}`}
                type="button"
                onClick={() => setStageIdx(sIdx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  stageIdx === sIdx
                    ? 'bg-slate-gray scale-125'
                    : 'bg-black-olive/20 hover:bg-black-olive/40'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-black-olive/80 leading-relaxed">
          {current.desc}
        </p>
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setStageIdx((prev) => (prev + 1) % stages.length)}
            className="px-3 py-1 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-sm-raised hover:shadow-neu-sm-pressed transition-all inline-flex items-center gap-1"
          >
            <span>{stageIdx === stages.length - 1 ? 'Restart' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
