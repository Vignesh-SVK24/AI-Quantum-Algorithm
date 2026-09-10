import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ComplexAmplitude } from './types';
import { computeBlochCoordinates } from './types';

interface BlochSphere3DProps {
  statevector: ComplexAmplitude[];
  selectedGate?: string;
  animateTransition?: boolean;
}

// Inner Sphere Scene
const BlochSphereScene: React.FC<{
  bloch: ReturnType<typeof computeBlochCoordinates>;
}> = ({ bloch }) => {
  const arrowRef = useRef<THREE.Group>(null);
  const targetVector = useMemo(() => new THREE.Vector3(bloch.x, bloch.y, bloch.z), [bloch.x, bloch.y, bloch.z]);
  const currentVector = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 1));

  // Latitude and Longitude Lines
  const gridLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = 1.0;
    const segments = 64;

    // Equator (XY plane, z=0)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }

    // Meridian (XZ plane, y=0)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }

    // Meridian (YZ plane, x=0)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(0, Math.cos(theta) * radius, Math.sin(theta) * radius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, []);

  // Smooth SLERP animation towards target vector
  useFrame((_, delta) => {
    if (currentVector.current.distanceTo(targetVector) > 0.001) {
      currentVector.current.lerp(targetVector, Math.min(1, delta * 6));
    } else {
      currentVector.current.copy(targetVector);
    }

    if (arrowRef.current) {
      arrowRef.current.lookAt(currentVector.current);
    }
  });

  const arrowLength = 1.0;
  const arrowColor = "#203C3D"; // Slate Gray

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} />
      <directionalLight position={[-4, -5, -3]} intensity={0.4} />

      {/* Main Frosted Translucent Sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#FAF7EE"
          transparent
          opacity={0.35}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Sphere Grid Wireframes */}
      <lineSegments geometry={gridLines}>
        <lineBasicMaterial color="#31372B" transparent opacity={0.22} />
      </lineSegments>

      {/* Coordinate Axes */}
      {/* Z Axis (|0⟩ top / |1⟩ bottom) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, -1.35, 0, 0, 1.35]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#31372B" opacity={0.5} transparent />
      </line>

      {/* X Axis (|+⟩ / |−⟩) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-1.35, 0, 0, 1.35, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#31372B" opacity={0.5} transparent />
      </line>

      {/* Y Axis (|+i⟩ / |−i⟩) */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, -1.35, 0, 0, 1.35, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#31372B" opacity={0.5} transparent />
      </line>

      {/* Basis State HTML Labels */}
      {/* North Pole: |0⟩ at (0, 0, 1.45) */}
      <Html position={[0, 0, 1.45]} center distanceFactor={6}>
        <div className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-floral-white/90 text-black-olive shadow-neu-sm-raised border border-black-olive/10 select-none">
          |0⟩
        </div>
      </Html>

      {/* South Pole: |1⟩ at (0, 0, -1.45) */}
      <Html position={[0, 0, -1.45]} center distanceFactor={6}>
        <div className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-floral-white/90 text-black-olive shadow-neu-sm-raised border border-black-olive/10 select-none">
          |1⟩
        </div>
      </Html>

      {/* +X: |+⟩ at (1.45, 0, 0) */}
      <Html position={[1.45, 0, 0]} center distanceFactor={6}>
        <div className="font-mono text-[10px] font-bold px-1 py-0.5 rounded bg-floral-white/90 text-slate-gray shadow-neu-sm-raised border border-black-olive/10 select-none">
          |+⟩
        </div>
      </Html>

      {/* -X: |−⟩ at (-1.45, 0, 0) */}
      <Html position={[-1.45, 0, 0]} center distanceFactor={6}>
        <div className="font-mono text-[10px] font-bold px-1 py-0.5 rounded bg-floral-white/90 text-slate-gray shadow-neu-sm-raised border border-black-olive/10 select-none">
          |−⟩
        </div>
      </Html>

      {/* +Y: |+i⟩ at (0, 1.45, 0) */}
      <Html position={[0, 1.45, 0]} center distanceFactor={6}>
        <div className="font-mono text-[10px] font-bold px-1 py-0.5 rounded bg-floral-white/90 text-slate-gray shadow-neu-sm-raised border border-black-olive/10 select-none">
          |+i⟩
        </div>
      </Html>

      {/* -Y: |−i⟩ at (0, -1.45, 0) */}
      <Html position={[0, -1.45, 0]} center distanceFactor={6}>
        <div className="font-mono text-[10px] font-bold px-1 py-0.5 rounded bg-floral-white/90 text-slate-gray shadow-neu-sm-raised border border-black-olive/10 select-none">
          |−i⟩
        </div>
      </Html>

      {/* State Vector (Arrow from Origin to State Point) */}
      <group>
        {/* Line shaft */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, 0, bloch.x * arrowLength, bloch.y * arrowLength, bloch.z * arrowLength]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={arrowColor} linewidth={3} />
        </line>

        {/* Tip Indicator Sphere */}
        <mesh position={[bloch.x * arrowLength, bloch.y * arrowLength, bloch.z * arrowLength]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={arrowColor} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* State Label hovering at vector tip */}
        <Html position={[bloch.x * 1.15, bloch.y * 1.15, bloch.z * 1.15]} center distanceFactor={6}>
          <div className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-gray text-floral-white shadow-neu-raised border border-floral-white/30 select-none whitespace-nowrap">
            |ψ⟩
          </div>
        </Html>
      </group>
    </>
  );
};

export const BlochSphere3D: React.FC<BlochSphere3DProps> = ({ statevector }) => {
  const bloch = useMemo(() => computeBlochCoordinates(statevector), [statevector]);
  const controlsRef = useRef<any>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-72 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [2.2, 2.2, 1.8],
          fov: 48,
          up: [0, 0, 1] // Quantum convention: +Z is vertical UP (North Pole |0⟩)
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.6}
          maxDistance={5.0}
        />
        <BlochSphereScene bloch={bloch} />
      </Canvas>

      {/* Floating Coordinate Overlay */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 font-mono text-[10px] text-black-olive/80 bg-floral-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-neu-sm-raised border border-black-olive/10">
        <div className="font-bold text-slate-gray text-[11px]">3D Bloch Sphere</div>
        <div>x = {bloch.x.toFixed(3)} (|+⟩ / |−⟩)</div>
        <div>y = {bloch.y.toFixed(3)} (|+i⟩ / |−i⟩)</div>
        <div>z = {bloch.z.toFixed(3)} (|0⟩ / |1⟩)</div>
      </div>

      {/* Reset Camera Quick Button */}
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
