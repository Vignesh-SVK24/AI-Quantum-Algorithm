import React from 'react';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Compass
} from 'lucide-react';

interface VisualizationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onResetCamera: () => void;
  onResetExecution: () => void;
  activeView: 'bloch' | 'circuit' | 'probabilities' | 'algorithm';
  onViewChange: (view: 'bloch' | 'circuit' | 'probabilities' | 'algorithm') => void;
  showBlochOption: boolean;
  showAlgorithmOption: boolean;
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onResetCamera,
  onResetExecution,
  activeView,
  onViewChange,
  showBlochOption,
  showAlgorithmOption
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-floral-white shadow-neu-sm-raised border border-black-olive/10 text-xs">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 bg-black-olive/5 p-1 rounded-xl">
        {showBlochOption && (
          <button
            type="button"
            onClick={() => onViewChange('bloch')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeView === 'bloch'
                ? 'bg-slate-gray text-floral-white shadow-neu-sm-pressed'
                : 'text-black-olive hover:text-slate-gray'
            }`}
          >
            Bloch 3D
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewChange('circuit')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            activeView === 'circuit'
              ? 'bg-slate-gray text-floral-white shadow-neu-sm-pressed'
              : 'text-black-olive hover:text-slate-gray'
          }`}
        >
          Circuit 3D
        </button>

        <button
          type="button"
          onClick={() => onViewChange('probabilities')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            activeView === 'probabilities'
              ? 'bg-slate-gray text-floral-white shadow-neu-sm-pressed'
              : 'text-black-olive hover:text-slate-gray'
          }`}
        >
          Probabilities 3D
        </button>

        {showAlgorithmOption && (
          <button
            type="button"
            onClick={() => onViewChange('algorithm')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeView === 'algorithm'
                ? 'bg-slate-gray text-floral-white shadow-neu-sm-pressed'
                : 'text-black-olive hover:text-slate-gray'
            }`}
          >
            Algorithm 3D
          </button>
        )}
      </div>

      {/* Execution Stepping Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onStepBackward}
          disabled={currentStep <= 0}
          title="Step Backward"
          className="p-1.5 rounded-lg bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed disabled:opacity-40 text-black-olive transition-all"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onPlayToggle}
          title={isPlaying ? 'Pause' : 'Play Execution'}
          className="px-2.5 py-1.5 rounded-lg bg-slate-gray text-floral-white font-bold flex items-center gap-1 shadow-neu-sm-raised hover:shadow-neu-sm-pressed transition-all"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          title="Step Forward"
          className="p-1.5 rounded-lg bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed disabled:opacity-40 text-black-olive transition-all"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetExecution}
          title="Reset Execution"
          className="p-1.5 rounded-lg bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-black-olive transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Camera Reset */}
        <button
          type="button"
          onClick={onResetCamera}
          title="Reset 3D Camera"
          className="p-1.5 rounded-lg bg-floral-white shadow-neu-sm-raised hover:shadow-neu-sm-pressed text-slate-gray transition-all ml-1"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
