import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Cpu, 
  Award, 
  LayoutDashboard, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to QuantumPlatform",
    subtitle: "Interactive Quantum Algorithm Learning Environment",
    description: "An interactive, mathematically rigorous quantum education system combining classical-to-quantum progression, deterministic retrieval, and interactive 3D visualizations.",
    highlight: "Designed with rich visual simulations and verified, scientifically grounded quantum concepts.",
    icon: Sparkles,
    tag: "Getting Started"
  },
  {
    title: "Trilingual Deterministic Search",
    subtitle: "English • हिन्दी • தமிழ்",
    description: "Search topics, theorems, and gates with instant keyword matching. Our dual-mode catalog provides 100% offline verification in three languages with instant retrieval.",
    highlight: "Try searching 'Superposition', 'सुपरपोजिशन', or 'க்யூபிட்' directly from the home bar.",
    icon: Search,
    tag: "Deterministic KB"
  },
  {
    title: "Quantum Basics & Dirac Notation",
    subtitle: "Ground-up Quantum Fundamentals",
    description: "Step through 7 foundational pedagogical modules covering qubits, Dirac bra-ket notation, measurement collapse, and interactive 3D Bloch sphere projections.",
    highlight: "Toggle languages on-the-fly and verify amplitude normalization |α|² + |β|² = 1.",
    icon: BookOpen,
    tag: "Interactive Basics"
  },
  {
    title: "Quantum Lab & Circuit Sharing",
    subtitle: "Drag-and-Drop Quantum Circuit Workbench",
    description: "Construct 1-to-3 qubit quantum circuits, place Hadamard, Pauli-X/Z, and CNOT gates, simulate shots in real-time, and view Bloch spheres and measurement histograms.",
    highlight: "Generate portable Base64 share URLs to collaborate with peers without exposing credentials.",
    icon: FlaskConical,
    tag: "Circuit Workbench"
  },
  {
    title: "Algorithm Playground & 3D Telemetry",
    subtitle: "Grover's Search & Deutsch-Jozsa",
    description: "Step through quantum algorithms gate-by-step. Compare 2D state probability telemetry directly alongside WebGL 3D state vector visualizations.",
    highlight: "Observe quantum amplitude amplification step-by-step with synchronized 3D graphics.",
    icon: Cpu,
    tag: "3D Playground"
  },
  {
    title: "Practice & Verifiable Certificates",
    subtitle: "Mastery Challenges & Printable Credentials",
    description: "Test your understanding with 4 graded tiers of quantum problems. Complete challenges to earn an official Certificate of Quantum Proficiency.",
    highlight: "Print or save high-resolution certificates complete with cryptographic credential verification IDs.",
    icon: Award,
    tag: "Certification"
  },
  {
    title: "Personalized Quantum Dashboard",
    subtitle: "Curriculum Analytics & Recommendation Engine",
    description: "Track your learning velocity, review completed exercises, inspect mastery badges, and receive targeted recommendations targeting specific knowledge gaps.",
    highlight: "Your personalized launchpad for mastering quantum computing.",
    icon: LayoutDashboard,
    tag: "Student Dashboard"
  }
];

export const OnboardingTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('quantum_onboarding_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleTriggerTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener('quantum:start-tour', handleTriggerTour);
    return () => window.removeEventListener('quantum:start-tour', handleTriggerTour);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('quantum_onboarding_completed', 'true');
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, handleClose]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Platform Tour"
    >
      <div 
        className="bg-floral-white rounded-3xl max-w-xl w-full border border-soft-sand shadow-2xl overflow-hidden relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-warm-ivory flex">
          {TOUR_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-warm-gold' : 'bg-transparent'
              } ${idx < TOUR_STEPS.length - 1 ? 'border-r border-floral-white/40' : ''}`}
            />
          ))}
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-warm-ivory border border-soft-sand text-deep-olive">
              {step.tag}
            </span>
            <span className="text-xs font-mono text-olive-mist">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-olive-mist hover:text-black-olive hover:bg-soft-sand/50 transition-colors"
            title="Skip Tour"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-warm-gold/20 border border-warm-gold/40 flex items-center justify-center flex-shrink-0 text-cocoa-noir">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-black-olive leading-snug">
                {step.title}
              </h3>
              <p className="text-xs font-medium text-olive-mist mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-black-olive/85 leading-relaxed">
            {step.description}
          </p>

          <div className="p-3.5 bg-warm-ivory rounded-2xl border border-soft-sand/80 text-xs text-black-olive flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-warm-gold flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-deep-olive block">Key Capability</span>
              <span className="text-black-olive/80 leading-relaxed">{step.highlight}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer / Navigation */}
        <div className="p-6 pt-3 border-t border-soft-sand/70 bg-[#FBF9F2] flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-medium text-olive-mist hover:text-black-olive transition-colors px-2 py-1"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-black-olive bg-warm-ivory border border-soft-sand hover:bg-soft-sand transition-all flex items-center gap-1 shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-warm-gold text-deep-slate hover:bg-[#D4BA7F] transition-all flex items-center gap-1.5 shadow-sm"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Get Started
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
