import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Video } from 'lucide-react';

export interface BackgroundVideoProps {
  /** Optional custom opacity (0 to 1). Defaults to user preference or 0.3 */
  opacity?: number;
  /** Whether to show the floating control badge */
  showControls?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  opacity: customOpacity,
  showControls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Stored preferences
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quantum_bg_video_playing');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [opacityLevel, setOpacityLevel] = useState<'subtle' | 'medium' | 'high' | 'off'>(() => {
    try {
      const saved = localStorage.getItem('quantum_bg_video_opacity');
      if (saved === 'subtle' || saved === 'medium' || saved === 'high' || saved === 'off') {
        return saved;
      }
      return 'medium';
    } catch {
      return 'medium';
    }
  });

  const [hasError, setHasError] = useState(false);

  // Sync playing state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && opacityLevel !== 'off') {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: muted autoplay is generally allowed
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, opacityLevel]);

  // Persist preference changes
  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    try {
      localStorage.setItem('quantum_bg_video_playing', String(next));
    } catch {}
  };

  const cycleOpacity = () => {
    const levels: Array<'subtle' | 'medium' | 'high' | 'off'> = ['subtle', 'medium', 'high', 'off'];
    const nextIdx = (levels.indexOf(opacityLevel) + 1) % levels.length;
    const nextLevel = levels[nextIdx];
    setOpacityLevel(nextLevel);
    try {
      localStorage.setItem('quantum_bg_video_opacity', nextLevel);
    } catch {}
  };

  const getOpacityClass = () => {
    if (customOpacity !== undefined) return '';
    switch (opacityLevel) {
      case 'off': return 'opacity-0';
      case 'subtle': return 'opacity-20';
      case 'medium': return 'opacity-35';
      case 'high': return 'opacity-60';
    }
  };

  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const videoUrl = `${cleanBase}video/Animate_this_image.mp4`;

  return (
    <>
      {/* Fixed Fullscreen Background Video Container */}
      <div 
        className={`fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden transition-opacity duration-700 select-none ${
          opacityLevel === 'off' ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 filter contrast-105 brightness-100 ${getOpacityClass()}`}
          style={customOpacity !== undefined ? { opacity: customOpacity } : undefined}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="./video/Animate_this_image.mp4" type="video/mp4" />
          <source src="/video/Animate_this_image.mp4" type="video/mp4" />
        </video>

        {/* Ambient Neumorphic Light Overlay & Vignette for Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-floral-white/70 via-floral-white/50 to-floral-white/85 pointer-events-none" />
      </div>

      {/* Subtle Floating Background Video Controls (Bottom-Left) */}
      {showControls && !hasError && (
        <aside 
          aria-label="Background Video Controls"
          className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-floral-white/90 backdrop-blur-md shadow-neu-raised border border-black-olive/10 text-black-olive text-xs transition-all hover:shadow-neu-raised-lg group"
        >
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
            aria-label={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
            className="p-1.5 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed active:scale-95 text-slate-gray transition-all cursor-pointer"
          >
            {isPlaying && opacityLevel !== 'off' ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={cycleOpacity}
            title={`Cycle Background Intensity (Current: ${opacityLevel})`}
            aria-label={`Cycle Background Intensity (Current: ${opacityLevel})`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed active:scale-95 text-[11px] font-mono font-medium text-black-olive/80 transition-all cursor-pointer"
          >
            <Video className="w-3 h-3 text-slate-gray" />
            <span className="capitalize">{opacityLevel}</span>
          </button>
        </aside>
      )}
    </>
  );
};

export default BackgroundVideo;
