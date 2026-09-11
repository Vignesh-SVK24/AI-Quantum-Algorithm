import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Activity } from 'lucide-react';
import type { ComplexAmplitude, QuantumVisualizationData } from './visualization3d/types';
import { WebGLFallback } from './visualization3d/WebGLFallback';

// Lazy-load 3D Bloch Sphere to keep initial page load fast
const BlochSphere3D = lazy(() =>
  import('./visualization3d/BlochSphere3D').then((m) => ({ default: m.BlochSphere3D }))
);

const INITIAL_STATEVECTOR: ComplexAmplitude[] = [
  { basis: '|0⟩', real: 1.0, imag: 0.0 },
  { basis: '|1⟩', real: 0.0, imag: 0.0 }
];

const INITIAL_PROBABILITIES: Record<string, number> = {
  '|0⟩': 1.0,
  '|1⟩': 0.0
};

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const LiveBlochDemo: React.FC = () => {
  const [statevector] = useState<ComplexAmplitude[]>(INITIAL_STATEVECTOR);
  const [probabilities] = useState<Record<string, number>>(INITIAL_PROBABILITIES);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');

    // 1. Attempt autoplay with original sound enabled
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay with sound; gracefully fall back to muted autoplay
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    // 2. Once user interacts with the page or video, enable audio
    const handleUserInteraction = () => {
      if (video) {
        video.muted = false;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const fallbackData: QuantumVisualizationData = {
    numQubits: 1,
    circuitOperations: [],
    currentStep: 0,
    statevector,
    basisStateProbabilities: probabilities,
    currentState: statevector
  };

  return (
    <div className="w-full space-y-4">
      {/* 3D Canvas / Fallback Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-floral-white shadow-neu-pressed border border-black-olive/10 min-h-[290px] sm:min-h-[320px] flex items-center justify-center">
        {hasWebGL ? (
          <Suspense
            fallback={
              <div className="w-full h-72 sm:h-80 flex flex-col items-center justify-center gap-3 text-slate-gray font-mono text-xs">
                <Activity className="w-6 h-6 animate-spin text-slate-gray" />
                <span>Loading 3D Bloch Canvas...</span>
              </div>
            }
          >
            <BlochSphere3D statevector={statevector} />
          </Suspense>
        ) : (
          <WebGLFallback data={fallbackData} reason="WebGL hardware acceleration disabled. 2D projection active." />
        )}

        {/* Live Interaction Badge */}
        <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-floral-white/90 backdrop-blur-sm border border-black-olive/10 text-[10px] font-mono text-black-olive font-semibold shadow-neu-sm-raised">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-sage animate-pulse" />
          <span>Real-time Qiskit Engine</span>
        </div>
      </div>

      {/* Quantum Video Showcase */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF7] border border-soft-sand shadow-sm">
        {/* Responsive Video Container */}
        <div className="w-full overflow-hidden rounded-xl border border-soft-sand/80 bg-floral-white/80 shadow-inner flex items-center justify-center">
          <div className="w-full max-w-[700px] aspect-video relative flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
              src={`${import.meta.env.BASE_URL}video/Use_the_provided_image_as_the.mp4`}
              className="w-full h-full object-contain rounded-xl block select-none pointer-events-none"
              title="AI Quantum Tutor demonstrating quantum computing concepts"
              aria-label="AI Quantum Tutor demonstrating quantum computing concepts"
            >
              <source src={`${import.meta.env.BASE_URL}video/Use_the_provided_image_as_the.mp4`} type="video/mp4" />
              <source src="./video/Use_the_provided_image_as_the.mp4" type="video/mp4" />
              <source src="/video/Use_the_provided_image_as_the.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBlochDemo;
