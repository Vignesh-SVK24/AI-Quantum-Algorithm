import React, { useState, Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { QuantumVisualizationData } from './types';
import { WebGLFallback } from './WebGLFallback';
import { VisualizationControls } from './VisualizationControls';
import { QuantumStateInfo } from './QuantumStateInfo';

// Lazy loaded 3D scenes for optimal bundle splitting
const BlochSphere3D = React.lazy(() => import('./BlochSphere3D').then(m => ({ default: m.BlochSphere3D })));
const QuantumCircuit3D = React.lazy(() => import('./QuantumCircuit3D').then(m => ({ default: m.QuantumCircuit3D })));
const ProbabilityBars3D = React.lazy(() => import('./ProbabilityBars3D').then(m => ({ default: m.ProbabilityBars3D })));
const GroverVisualization3D = React.lazy(() => import('./GroverVisualization3D').then(m => ({ default: m.GroverVisualization3D })));
const DeutschJozsaVisualization3D = React.lazy(() => import('./DeutschJozsaVisualization3D').then(m => ({ default: m.DeutschJozsaVisualization3D })));

interface QuantumVisualizerProps {
  data: QuantumVisualizationData;
  defaultView?: 'bloch' | 'circuit' | 'probabilities' | 'algorithm';
  showReadout?: boolean;
}

// WebGL support detector
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({
  data,
  defaultView,
  showReadout = true
}) => {
  const { numQubits, circuitOperations, statevector, basisStateProbabilities, measurementCounts, algorithmName } = data;

  const isSingleQubit = numQubits === 1;
  const hasAlgorithm = !!algorithmName && (algorithmName.includes('grover') || algorithmName.includes('deutsch'));

  // Default active view logic
  const initialView = defaultView || (hasAlgorithm ? 'algorithm' : isSingleQubit ? 'bloch' : 'circuit');
  const [activeView, setActiveView] = useState<'bloch' | 'circuit' | 'probabilities' | 'algorithm'>(initialView);

  // Stepping & playback state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraResetTrigger, setCameraResetTrigger] = useState(0);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  const totalSteps = circuitOperations.length > 0 ? Math.max(...circuitOperations.map(g => g.step), 0) : 0;

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps]);

  if (!webGLSupported) {
    return <WebGLFallback data={data} reason="WebGL is not supported or disabled on this device. Displaying accessible 2D view." />;
  }

  return (
    <div className="w-full space-y-3 font-sans text-black-olive">
      {/* Top Controls & View Mode Switcher */}
      <VisualizationControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onStepForward={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
        onStepBackward={() => setCurrentStep(prev => Math.max(0, prev - 1))}
        onResetCamera={() => setCameraResetTrigger(c => c + 1)}
        onResetExecution={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        activeView={activeView}
        onViewChange={setActiveView}
        showBlochOption={isSingleQubit}
        showAlgorithmOption={hasAlgorithm}
      />

      {/* 3D Scene Viewport with Suspense fallback */}
      <Suspense
        fallback={
          <div className="w-full h-72 sm:h-80 md:h-96 rounded-2xl bg-floral-white shadow-neu-pressed flex flex-col items-center justify-center gap-2 text-slate-gray">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-mono font-medium">Initializing 3D Quantum Engine...</span>
          </div>
        }
      >
        {activeView === 'bloch' && isSingleQubit && (
          <BlochSphere3D statevector={statevector} key={`bloch-${cameraResetTrigger}`} />
        )}

        {activeView === 'circuit' && (
          <QuantumCircuit3D
            numQubits={numQubits}
            gates={circuitOperations}
            currentStep={currentStep}
            key={`circuit-${cameraResetTrigger}`}
          />
        )}

        {activeView === 'probabilities' && (
          <ProbabilityBars3D
            probabilities={basisStateProbabilities}
            measurementCounts={measurementCounts}
            numQubits={numQubits}
            key={`probs-${cameraResetTrigger}`}
          />
        )}

        {activeView === 'algorithm' && algorithmName?.includes('grover') && (
          <GroverVisualization3D key={`grover-${cameraResetTrigger}`} />
        )}

        {activeView === 'algorithm' && algorithmName?.includes('deutsch') && (
          <DeutschJozsaVisualization3D key={`dj-${cameraResetTrigger}`} />
        )}
      </Suspense>

      {/* Numerical State & Coordinates Readout */}
      {showReadout && <QuantumStateInfo data={data} />}
    </div>
  );
};
