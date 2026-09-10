import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeft, 
  BookOpen, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  RotateCcw,
  ExternalLink,
  Award
} from 'lucide-react';
import { getProgress, saveProgress, type PlatformProgress } from '../services/progress';

export const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<PlatformProgress>(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress data in your local session?')) {
      const reset = saveProgress({
        basics: 0,
        gates: 0,
        circuits: 0,
        algorithms: 0,
        quizScore: null,
        quizCorrect: 0
      });
      setProgress(reset);
    }
  };

  const overallAverage = Math.round(
    (progress.basics + progress.gates + progress.circuits + progress.algorithms) / 4
  );

  const MODULES = [
    {
      id: 'basics',
      title: 'Quantum Basics',
      desc: 'Qubit states, superposition, amplitudes, measurement, and Bloch sphere',
      pct: progress.basics,
      link: '/basics',
      icon: BookOpen
    },
    {
      id: 'gates',
      title: 'Quantum Gates',
      desc: 'Single-qubit rotations (X, H, Z) and multi-qubit CNOT operations',
      pct: progress.gates,
      link: '/lab',
      icon: Layers
    },
    {
      id: 'circuits',
      title: 'Circuit Simulation',
      desc: 'Statevector evolution and 1,024-shot probabilistic measurement sampling',
      pct: progress.circuits,
      link: '/lab',
      icon: TrendingUp
    },
    {
      id: 'algorithms',
      title: 'Quantum Algorithms',
      desc: 'Deutsch-Jozsa phase kickback and Grover amplitude amplification',
      pct: progress.algorithms,
      link: '/algorithms',
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen bg-floral-white text-black-olive">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-floral-white text-xs font-semibold text-slate-gray shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">Student Learning Dashboard</h1>
                <p className="text-xs text-black-olive/70">Track your curriculum mastery, simulated circuits, and quiz milestones</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 rounded-xl bg-floral-white text-xs font-semibold text-black-olive/70 hover:text-black-olive shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Data
            </button>
          </div>
        </div>

        {/* Top Metric Cards (Raised Tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-black-olive/60 tracking-wider">Overall Completion</span>
            <div className="text-2xl font-bold text-black-olive font-mono">{overallAverage}%</div>
            {/* Inset progress track with Slate Gray fill */}
            <div className="h-2.5 bg-floral-white shadow-neu-pressed rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-slate-gray rounded-full transition-all duration-500 shadow-neu-sm-raised"
                style={{ width: `${overallAverage}%` }}
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-black-olive/60 tracking-wider">Latest Quiz Score</span>
            <div className="text-2xl font-bold text-slate-gray font-mono">
              {progress.quizScore !== null ? `${progress.quizScore}%` : 'Not Taken'}
            </div>
            <div className="text-[11px] text-black-olive/70">
              {progress.quizScore !== null ? `${progress.quizCorrect} / ${progress.quizTotal} correct answers` : 'Take quiz to evaluate skills'}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-black-olive/60 tracking-wider">Storage State</span>
            <div className="text-sm font-bold text-slate-gray font-mono flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-slate-gray" /> localStorage Sync
            </div>
            <div className="text-[11px] text-black-olive/70">Persisted locally in browser</div>
          </div>

          <div className="p-6 rounded-3xl bg-floral-white shadow-neu-raised space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-black-olive/60 tracking-wider">Last Activity</span>
            <div className="text-sm font-bold text-black-olive font-mono pt-1">{progress.lastActive}</div>
            <div className="text-[11px] text-black-olive/70">Session active</div>
          </div>
        </div>

        {/* Modules Progress List (Raised Tiles) */}
        <div className="p-8 rounded-3xl bg-floral-white shadow-neu-raised space-y-6">
          <div>
            <h2 className="text-lg font-bold text-black-olive">Curriculum Modules</h2>
            <p className="text-xs text-black-olive/70 mt-0.5">Progress tracked across platform learning environments</p>
          </div>

          <div className="space-y-4">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="p-5 rounded-2xl bg-floral-white shadow-neu-raised hover:shadow-neu-pressed transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center text-slate-gray flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-black-olive">{mod.title}</h3>
                        <span className="text-xs font-mono text-slate-gray font-bold">{mod.pct}%</span>
                      </div>
                      <p className="text-xs text-black-olive/70 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-64">
                    {/* Inset progress track with Slate Gray fill */}
                    <div className="flex-1 h-2.5 bg-floral-white shadow-neu-pressed rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-slate-gray rounded-full transition-all duration-500 shadow-neu-sm-raised"
                        style={{ width: `${mod.pct}%` }}
                      />
                    </div>
                    <Link
                      to={mod.link}
                      className="px-3.5 py-1.5 rounded-xl bg-floral-white text-slate-gray text-xs font-semibold shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Quiz Callout (Raised Card) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-floral-white shadow-neu-raised flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-gray uppercase tracking-wider">
              <Award className="w-4 h-4" /> Challenge Your Knowledge
            </div>
            <h3 className="text-xl font-bold text-black-olive">Quantum Practice &amp; Knowledge Quiz</h3>
            <p className="text-xs text-black-olive/70 max-w-xl leading-relaxed">
              10 multiple-choice and output prediction questions covering gates, superposition amplitudes, Born rule probabilities, and algorithm speedups.
            </p>
          </div>
          <Link
            to="/practice"
            className="px-8 py-3.5 rounded-2xl bg-slate-gray text-floral-white font-bold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Start Practice Quiz
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
