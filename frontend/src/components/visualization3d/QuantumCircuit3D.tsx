import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GateOperation } from './types';

interface QuantumCircuit3DProps {
  numQubits: number;
  gates: GateOperation[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

const CircuitScene: React.FC<{
  numQubits: number;
  gates: GateOperation[];
  currentStep: number;
}> = ({ numQubits, gates, currentStep }) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  // Maximum step in the circuit
  const maxStep = useMemo(() => {
    if (gates.length === 0) return 4;
    return Math.max(...gates.map(g => g.step), 4);
  }, [gates]);

  const wireSpacing = 1.4;
  const stepSpacing = 1.8;
  const circuitLength = (maxStep + 2) * stepSpacing;

  // Pulse animation along circuit
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.8) % (maxStep + 2);
      pulseRef.current.position.x = (t - (maxStep + 2) / 2) * stepSpacing;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <directionalLight position={[-4, -3, -4]} intensity={0.3} />

      {/* Qubit Wires */}
      {Array.from({ length: numQubits }).map((_, qIdx) => {
        const y = (numQubits - 1 - qIdx - (numQubits - 1) / 2) * wireSpacing;
        return (
          <group key={`wire-${qIdx}`}>
            {/* Wire Line (Cylinder) */}
            <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, circuitLength, 16]} />
              <meshStandardMaterial color="#31372B" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Qubit Input Label */}
            <Html position={[-circuitLength / 2 - 0.4, y, 0]} center distanceFactor={7}>
              <div className="font-mono text-xs font-bold text-slate-gray bg-floral-white px-2 py-0.5 rounded shadow-neu-sm-raised border border-black-olive/10 select-none">
                q{qIdx}: |0⟩
              </div>
            </Html>
          </group>
        );
      })}

      {/* Active Step Pulse Line */}
      <mesh ref={pulseRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.04, numQubits * wireSpacing, 0.04]} />
        <meshBasicMaterial color="#203C3D" transparent opacity={0.4} />
      </mesh>

      {/* Gates */}
      {gates.map((gate, gIdx) => {
        const x = (gate.step - (maxStep + 2) / 2 + 1) * stepSpacing;
        const targetY = (numQubits - 1 - gate.target - (numQubits - 1) / 2) * wireSpacing;
        const isCurrentStep = gate.step === currentStep;

        if (gate.type === 'CNOT' && typeof gate.control === 'number') {
          const controlY = (numQubits - 1 - gate.control - (numQubits - 1) / 2) * wireSpacing;
          const minY = Math.min(targetY, controlY);
          const maxY = Math.max(targetY, controlY);
          const midY = (minY + maxY) / 2;
          const height = Math.abs(maxY - minY);

          return (
            <group key={`cnot-${gIdx}`}>
              {/* Vertical Control-Target Connector */}
              <mesh position={[x, midY, 0]}>
                <cylinderGeometry args={[0.035, 0.035, height, 16]} />
                <meshStandardMaterial color={isCurrentStep ? '#203C3D' : '#31372B'} roughness={0.3} metalness={0.7} />
              </mesh>

              {/* Control Dot */}
              <mesh position={[x, controlY, 0]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color={isCurrentStep ? '#203C3D' : '#31372B'} roughness={0.2} metalness={0.8} />
              </mesh>

              {/* Target Symbol (⊕ Circle with Cross) */}
              <mesh position={[x, targetY, 0]}>
                <cylinderGeometry args={[0.26, 0.26, 0.12, 24]} />
                <meshStandardMaterial color="#FAF7EE" roughness={0.3} metalness={0.4} />
              </mesh>
              <Html position={[x, targetY, 0.12]} center distanceFactor={7}>
                <div className="font-bold text-slate-gray text-xs select-none">⊕</div>
              </Html>
            </group>
          );
        }

        // Single Qubit Gate (H, X, Z, S, T, etc.)
        const gateColor = gate.type === 'H' ? '#203C3D' : gate.type === 'X' ? '#31372B' : '#2C4A4B';

        return (
          <group key={`gate-${gIdx}`} position={[x, targetY, 0]}>
            {/* 3D Gate Box */}
            <mesh>
              <boxGeometry args={[0.65, 0.65, 0.35]} />
              <meshStandardMaterial
                color={isCurrentStep ? '#182E2F' : gateColor}
                roughness={0.25}
                metalness={0.5}
              />
            </mesh>

            {/* Gate Label */}
            <Html position={[0, 0, 0.22]} center distanceFactor={7}>
              <div className="font-mono text-[11px] font-bold text-floral-white select-none pointer-events-none">
                {gate.type}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

export const QuantumCircuit3D: React.FC<QuantumCircuit3DProps> = ({
  numQubits,
  gates,
  currentStep = 0
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
        camera={{ position: [0, 1.2, 5.2], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={12.0}
        />
        <CircuitScene
          numQubits={numQubits}
          gates={gates}
          currentStep={currentStep}
        />
      </Canvas>

      {/* Floating Info */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-black-olive/80 bg-floral-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-neu-sm-raised border border-black-olive/10">
        <div className="font-bold text-slate-gray text-[11px]">3D Interactive Circuit</div>
        <div>{numQubits} Qubits &bull; {gates.length} Gates</div>
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
