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
    <div className="min-h-screen bg-transparent text-black-olive">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-floral-white text-xs font-semibold text-slate-gray shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="w-1 h-4 rounded-full bg-black-olive/20" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-gray" />
              <span className="text-sm font-semibold text-black-olive">Quantum Basics</span>
            </div>
          </div>
          <span className="text-xs font-mono text-black-olive/70 px-3 py-1 rounded-xl bg-floral-white shadow-neu-pressed">
            Step {currentStep + 1} of {sections.length}
          </span>
        </div>

        {/* Progress Navigation Pills */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 pb-3">
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-floral-white text-slate-gray shadow-neu-pressed font-bold'
                      : isCompleted
                      ? 'bg-floral-white text-slate-gray shadow-neu-sm-raised'
                      : 'bg-floral-white text-black-olive/70 shadow-neu-sm-raised hover:shadow-neu-sm-pressed'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-gray" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Neumorphic Inset Progress Bar */}
          <div className="mt-3 h-2.5 bg-floral-white shadow-neu-pressed rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-slate-gray rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Section Content (Rendered as Raised Card) */}
        <div className="rounded-3xl bg-floral-white shadow-neu-raised p-6 sm:p-10">
          <CurrentSection
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentStep === 0}
            isLast={currentStep === sections.length - 1}
          />
        </div>

        {/* Completion CTA */}
        {currentStep === sections.length - 1 && (
          <div className="mt-10 text-center p-8 rounded-3xl bg-floral-white shadow-neu-raised max-w-xl mx-auto">
            <p className="text-black-olive text-sm font-semibold mb-1">
              🎉 Congratulations on completing Quantum Basics!
            </p>
            <p className="text-black-olive/70 text-xs mb-5">
              You are ready to test these principles on live simulated circuits in the Quantum Lab.
            </p>
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-gray text-floral-white font-semibold text-sm shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              Continue to Quantum Lab →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
