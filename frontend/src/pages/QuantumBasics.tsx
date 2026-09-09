import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Atom, 
  CircleDot, 
  Waves, 
  BarChart3, 
  Crosshair, 
  Globe2,
  CheckCircle2
} from 'lucide-react';
import ClassicalVsQubits from './basics/ClassicalVsQubits';
import WhatIsQubit from './basics/WhatIsQubit';
import QubitStates from './basics/QubitStates';
import Superposition from './basics/Superposition';
import ProbabilityAmplitudes from './basics/ProbabilityAmplitudes';
import Measurement from './basics/Measurement';
import BlochSphere from './basics/BlochSphere';

const sections = [
  { id: 'classical-vs-qubits', title: 'Classical Bits vs Qubits', icon: CircleDot, component: ClassicalVsQubits },
  { id: 'what-is-qubit', title: 'What is a Qubit?', icon: Atom, component: WhatIsQubit },
  { id: 'qubit-states', title: 'Qubit States |0⟩ and |1⟩', icon: BookOpen, component: QubitStates },
  { id: 'superposition', title: 'Superposition', icon: Waves, component: Superposition },
  { id: 'probability-amplitudes', title: 'Probability Amplitudes', icon: BarChart3, component: ProbabilityAmplitudes },
  { id: 'measurement', title: 'Measurement', icon: Crosshair, component: Measurement },
  { id: 'bloch-sphere', title: 'The Bloch Sphere', icon: Globe2, component: BlochSphere },
];

export const QuantumBasics: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentSection = sections[currentStep].component;

  return (
    <div className="min-h-screen quantum-grid-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">Quantum Basics</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {currentStep + 1} / {sections.length}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentStep(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600/20 text-teal-300 border border-indigo-500/30'
                      : isCompleted
                      ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/30'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Section Content */}
        <CurrentSection
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={currentStep === 0}
          isLast={currentStep === sections.length - 1}
        />

        {/* Completion state */}
        {currentStep === sections.length - 1 && (
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs font-mono">
              Congratulations on completing Quantum Basics! Next up: the Interactive Quantum Lab.
            </p>
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white font-semibold text-sm shadow-lg transition-all hover:scale-[1.02]"
            >
              Continue to Quantum Lab →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
