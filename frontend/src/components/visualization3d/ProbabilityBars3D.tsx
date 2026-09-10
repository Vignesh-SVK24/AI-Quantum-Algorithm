import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ProbabilityBars3DProps {
  probabilities: Record<string, number>;
  measurementCounts?: Record<string, number>;
  numQubits: number;
}

const BarsScene: React.FC<{
  probabilities: Record<string, number>;
  measurementCounts?: Record<string, number>;
}> = ({ probabilities, measurementCounts }) => {
  const entries = Object.entries(probabilities);
  const count = entries.length;

  // Layout bars in a grid or row
  const cols = Math.min(4, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);
  const spacing = 1.2;

  const maxHeight = 2.0;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, -4, -3]} intensity={0.4} />

      {/* Ground Grid Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[cols * spacing + 1, rows * spacing + 1]} />
        <meshStandardMaterial color="#FAF7EE" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* 3D Probability Columns */}
      {entries.map(([basis, prob], idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const x = (c - (cols - 1) / 2) * spacing;
        const z = (r - (rows - 1) / 2) * spacing;

        const barHeight = Math.max(0.04, prob * maxHeight);
        const y = barHeight / 2;

        const isDominant = prob > 0.3;
        const color = isDominant ? '#203C3D' : '#31372B';
        const pct = (prob * 100).toFixed(1);
        const shots = measurementCounts?.[basis];

        return (
          <group key={basis} position={[x, 0, z]}>
            {/* 3D Column Mesh */}
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[0.65, barHeight, 0.65]} />
              <meshStandardMaterial
                color={color}
                roughness={0.25}
                metalness={0.2}
                transparent
                opacity={prob > 0.001 ? 0.92 : 0.25}
              />
            </mesh>

            {/* Base Wireframe Outline */}
            <lineSegments position={[0, 0.01, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.67, 0.02, 0.67)]} />
              <lineBasicMaterial color="#31372B" transparent opacity={0.3} />
            </lineSegments>

            {/* Label at Top of Bar */}
            {prob > 0.02 && (
              <Html position={[0, barHeight + 0.22, 0]} center distanceFactor={6}>
                <div className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-gray text-floral-white shadow-neu-sm-raised select-none whitespace-nowrap">
                  {pct}%{shots ? ` (${shots})` : ''}
                </div>
              </Html>
            )}

            {/* Basis State Label at Base */}
            <Html position={[0, -0.15, 0.45]} center distanceFactor={6}>
              <div className="font-mono text-[11px] font-bold text-black-olive select-none whitespace-nowrap">
                {basis}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

export const ProbabilityBars3D: React.FC<ProbabilityBars3DProps> = ({
  probabilities,
  measurementCounts,
  numQubits
}) => {
  const controlsRef = useRef<any>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-72 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10">
      <Canvas
        camera={{ position: [3.2, 4.0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={9.0}
        />
        <BarsScene
          probabilities={probabilities}
          measurementCounts={measurementCounts}
        />
      </Canvas>

      {/* Floating Header */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-black-olive/80 bg-floral-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-neu-sm-raised border border-black-olive/10">
        <div className="font-bold text-slate-gray text-[11px]">3D Basis State Probabilities</div>
        <div>Dimension: {Math.pow(2, numQubits)} states ({numQubits} Qubits)</div>
      </div>

      {/* Reset Camera Button */}
      <div className="absolute bottom-3 right-3">
        <button
          type="button"
          onClick={handleResetCamera}
          className="text-[10px] font-mono px-2 py-1 rounded-lg bg-floral-white/90 shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-slate-gray font-semibold border border-black-olive/10 transition-all"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};
