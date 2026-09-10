import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { ChevronRight, Sparkles } from 'lucide-react';

interface GroverVisualization3DProps {
  targetState?: string; // e.g. "|11>"
}

interface GroverStageData {
  name: string;
  desc: string;
  probabilities: Record<string, number>;
  amplitudes: Record<string, number>;
}

export const GroverVisualization3D: React.FC<GroverVisualization3DProps> = ({
  targetState = '|11>'
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  // 2-Qubit Grover algorithmic stages:
  const stages: GroverStageData[] = [
    {
      name: '1. Ground State Initialization',
      desc: 'All qubits are initialized in computational basis state |00⟩.',
      probabilities: { '|00>': 1.0, '|01>': 0.0, '|10>': 0.0, '|11>': 0.0 },
      amplitudes: { '|00>': 1.0, '|01>': 0.0, '|10>': 0.0, '|11>': 0.0 }
    },
    {
      name: '2. Equal Superposition (Hadamards)',
      desc: 'Hadamard gates applied to all qubits. All 4 basis states have equal amplitude 1/2 (25% probability).',
      probabilities: { '|00>': 0.25, '|01>': 0.25, '|10>': 0.25, '|11>': 0.25 },
      amplitudes: { '|00>': 0.5, '|01>': 0.5, '|10>': 0.5, '|11>': 0.5 }
    },
    {
      name: '3. Phase Oracle Inversion',
      desc: `The oracle marks target ${targetState} by inverting its phase (amplitude becomes -1/2). Notice probabilities remain unchanged!`,
      probabilities: { '|00>': 0.25, '|01>': 0.25, '|10>': 0.25, '|11>': 0.25 },
      amplitudes: { '|00>': 0.5, '|01>': 0.5, '|10>': 0.5, '|11>': -0.5 }
    },
    {
      name: '4. Diffusion (Inversion About Mean)',
      desc: `Diffusion operator reflects amplitudes about the mean amplitude (+1/4), boosting target ${targetState} to 100% probability!`,
      probabilities: { '|00>': 0.0, '|01>': 0.0, '|10>': 0.0, '|11>': 1.0 },
      amplitudes: { '|00>': 0.0, '|01>': 0.0, '|10>': 0.0, '|11>': 1.0 }
    }
  ];

  const currentStage = stages[currentStageIdx];
  const entries = Object.entries(currentStage.amplitudes);

  return (
    <div className="w-full space-y-3">
      {/* 3D Scene */}
      <div className="w-full h-72 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10">
        <Canvas camera={{ position: [2.8, 3.2, 3.8], fov: 42 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} />
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={8.0} />

          {/* Zero-Amplitude Reference Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[5, 4]} />
            <meshStandardMaterial color="#FAF7EE" roughness={0.7} opacity={0.5} transparent />
          </mesh>

          {/* 3D Columns for each state: height = amplitude (positive upward, negative downward) */}
          {entries.map(([basis, amp], idx) => {
            const x = (idx - 1.5) * 1.1;
            const height = Math.abs(amp) * 2.2;
            const y = amp >= 0 ? height / 2 : -height / 2;
            const isTarget = basis === targetState;
            const color = isTarget ? '#203C3D' : '#31372B';

            return (
              <group key={basis} position={[x, 0, 0]}>
                <mesh position={[0, y, 0]}>
                  <boxGeometry args={[0.7, Math.max(0.04, height), 0.7]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.25}
                    metalness={isTarget ? 0.4 : 0.1}
                    transparent
                    opacity={Math.abs(amp) > 0.01 ? 0.92 : 0.2}
                  />
                </mesh>

                {/* Amplitude value label */}
                <Html position={[0, (amp >= 0 ? height : -height) + (amp >= 0 ? 0.22 : -0.22), 0]} center distanceFactor={6}>
                  <div className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow-neu-sm-raised select-none whitespace-nowrap ${
                    isTarget ? 'bg-slate-gray text-floral-white' : 'bg-floral-white text-black-olive'
                  }`}>
                    {amp > 0 ? `+${amp.toFixed(2)}` : amp.toFixed(2)}
                  </div>
                </Html>

                {/* Basis Label */}
                <Html position={[0, -0.25, 0.55]} center distanceFactor={6}>
                  <div className={`font-mono text-xs font-bold select-none whitespace-nowrap ${isTarget ? 'text-slate-gray' : 'text-black-olive'}`}>
                    {basis} {isTarget ? '★' : ''}
                  </div>
                </Html>
              </group>
            );
          })}
        </Canvas>

        {/* Floating Title & Stage Indicator */}
        <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-black-olive/80 bg-floral-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-neu-sm-raised border border-black-olive/10">
          <div className="font-bold text-slate-gray text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Grover Amplitude Amplification
          </div>
          <div>Stage: {currentStage.name}</div>
        </div>
      </div>

      {/* Stage Stepping Bar */}
      <div className="p-3 rounded-2xl bg-floral-white shadow-neu-sm-raised border border-black-olive/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-gray uppercase tracking-wider">
            {currentStage.name}
          </span>
          <div className="flex items-center gap-1.5">
            {stages.map((_, sIdx) => (
              <button
                key={`dot-${sIdx}`}
                type="button"
                onClick={() => setCurrentStageIdx(sIdx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStageIdx === sIdx
                    ? 'bg-slate-gray scale-125'
                    : 'bg-black-olive/20 hover:bg-black-olive/40'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-black-olive/80 leading-relaxed">
          {currentStage.desc}
        </p>
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setCurrentStageIdx((prev) => (prev + 1) % stages.length)}
            className="px-3 py-1 rounded-xl bg-slate-gray text-floral-white text-xs font-bold shadow-neu-sm-raised hover:shadow-neu-sm-pressed transition-all inline-flex items-center gap-1"
          >
            <span>{currentStageIdx === stages.length - 1 ? 'Restart' : 'Next Stage'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
