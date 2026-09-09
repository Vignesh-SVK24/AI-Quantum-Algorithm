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
      color: 'from-indigo-500 to-cyan-400',
      link: '/basics',
      icon: BookOpen
    },
    {
      id: 'gates',
      title: 'Quantum Gates',
      desc: 'Single-qubit rotations (X, H, Z) and multi-qubit CNOT operations',
      pct: progress.gates,
      color: 'from-teal-500 to-emerald-400',
      link: '/lab',
      icon: Layers
    },
    {
      id: 'circuits',
      title: 'Circuit Simulation',
      desc: 'Statevector evolution and 1,024-shot probabilistic measurement sampling',
      pct: progress.circuits,
      color: 'from-cyan-500 to-indigo-500',
      link: '/lab',
      icon: TrendingUp
    },
    {
      id: 'algorithms',
      title: 'Quantum Algorithms',
      desc: 'Deutsch-Jozsa phase kickback and Grover amplitude amplification',
      pct: progress.algorithms,
      color: 'from-purple-500 to-teal-400',
      link: '/algorithms',
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen quantum-grid-bg text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Student Learning Dashboard</h1>
                <p className="text-xs text-slate-400">Track your curriculum mastery, simulated circuits, and quiz milestones</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> Reset Data
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Completion</span>
            <div className="text-2xl font-bold text-white font-mono">{overallAverage}%</div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${overallAverage}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Latest Quiz Score</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {progress.quizScore !== null ? `${progress.quizScore}%` : 'Not Taken'}
            </div>
            <div className="text-[10px] text-slate-400">
              {progress.quizScore !== null ? `${progress.quizCorrect} / ${progress.quizTotal} correct answers` : 'Take the quiz to test knowledge'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Storage State</span>
            <div className="text-sm font-bold text-teal-300 font-mono flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> localStorage Sync
            </div>
            <div className="text-[10px] text-slate-400">Zero database dependency (Client MVP)</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Last Activity</span>
            <div className="text-sm font-bold text-slate-200 font-mono pt-1">{progress.lastActive}</div>
            <div className="text-[10px] text-slate-400">Session timestamp saved</div>
          </div>
        </div>

        {/* Modules Progress List */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h2 className="text-base font-bold text-white">Curriculum Modules</h2>
            <p className="text-xs text-slate-400 mt-0.5">Progress tracked across platform learning environments</p>
          </div>

          <div className="space-y-4">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                        <span className="text-xs font-mono text-teal-300 font-semibold">{mod.pct}%</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-64">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${mod.color} rounded-full transition-all duration-500`}
                        style={{ width: `${mod.pct}%` }}
                      />
                    </div>
                    <Link
                      to={mod.link}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
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

        {/* Quick Quiz Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-teal-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Award className="w-4 h-4" /> Challenge Your Knowledge
            </div>
            <h3 className="text-lg font-bold text-white">Quantum Practice & Knowledge Quiz</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              10 multiple-choice and output prediction questions covering gates, superposition amplitudes, Born rule probabilities, and algorithm speedups.
            </p>
          </div>
          <Link
            to="/practice"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" /> Start Practice Quiz
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
