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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-semibold text-black-olive hover:bg-soft-sand transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-olive-mist" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-black-olive flex items-center justify-center text-warm-gold shadow-sm">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">Student Learning Dashboard</h1>
                <p className="text-xs text-olive-mist">Curriculum mastery, live simulated circuits, and practice achievements</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-semibold text-olive-mist hover:text-black-olive hover:bg-soft-sand transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Data
            </button>
          </div>
        </div>

        {/* Primary Dark Progress Anchor Card (Black Olive #31372B) */}
        <div className="rounded-3xl bg-black-olive text-floral-white border border-deep-olive shadow-botanical-glow p-7 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-deep-olive">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-olive border border-olive-mist/30 text-xs font-mono text-warm-gold">
                <Award className="w-3.5 h-3.5" />
                <span>Quantum Mastery Profile</span>
              </div>
              <h2 className="text-2xl font-bold text-floral-white tracking-tight">
                Curriculum Progression
              </h2>
              <p className="text-xs text-floral-white/70 max-w-md">
                Aggregated progress across Quantum Basics, Circuit Builder, Simulation, and Algorithmic Oracles.
              </p>
            </div>

            {/* Circular / Large Highlight Metric */}
            <div className="flex items-center gap-4 bg-deep-olive/80 p-4 rounded-2xl border border-olive-mist/20">
              <div className="w-16 h-16 rounded-full border-4 border-deep-olive border-t-warm-gold border-r-warm-gold flex items-center justify-center text-xl font-bold font-mono text-warm-gold">
                {overallAverage}%
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-sage block">Total Mastery</span>
                <span className="text-xs text-floral-white/80 font-mono">
                  {overallAverage >= 70 ? 'Advanced Ready' : overallAverage >= 35 ? 'Intermediate' : 'Novice Explorer'}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Metric Columns inside Dark Anchor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-deep-olive/60 border border-olive-mist/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-sage tracking-wider">Overall Progress</span>
              <div className="text-2xl font-bold text-floral-white font-mono">{overallAverage}%</div>
              <div className="h-2 bg-black-olive rounded-full overflow-hidden">
                <div
                  className="h-full bg-warm-gold rounded-full transition-all duration-500"
                  style={{ width: `${overallAverage}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-deep-olive/60 border border-olive-mist/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-sage tracking-wider">Latest Practice</span>
              <div className="text-2xl font-bold text-soft-cyan font-mono">
                {progress.quizScore !== null ? `${progress.quizScore}%` : 'Not Taken'}
              </div>
              <div className="text-[11px] text-floral-white/60">
                {progress.quizScore !== null ? `${progress.quizCorrect} / ${progress.quizTotal} correct answers` : 'Complete rounds to evaluate'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-deep-olive/60 border border-olive-mist/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-sage tracking-wider">Storage Engine</span>
              <div className="text-sm font-bold text-warm-gold font-mono flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-muted-sage" /> Local Persistence
              </div>
              <div className="text-[11px] text-floral-white/60">Zero cloud latency</div>
            </div>

            <div className="p-4 rounded-2xl bg-deep-olive/60 border border-olive-mist/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-sage tracking-wider">Last Activity</span>
              <div className="text-sm font-bold text-floral-white font-mono pt-1">{progress.lastActive}</div>
              <div className="text-[11px] text-floral-white/60">Session active</div>
            </div>
          </div>
        </div>

        {/* Modules Progress List (Light Cards) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-black-olive">Curriculum Modules</h2>
            <p className="text-xs text-olive-mist mt-0.5">Progress tracked across platform learning environments</p>
          </div>

          <div className="space-y-3.5">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="p-4 sm:p-5 rounded-2xl bg-warm-ivory/50 border border-soft-sand hover:border-black-olive/30 hover:bg-warm-ivory transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-floral-white border border-soft-sand flex items-center justify-center text-black-olive flex-shrink-0 shadow-sm">
                      <Icon className="w-5 h-5 text-deep-olive" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-black-olive">{mod.title}</h3>
                        <span className="text-xs font-mono text-olive-mist font-bold">{mod.pct}%</span>
                      </div>
                      <p className="text-xs text-black-olive/70 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-64">
                    <div className="flex-1 h-2 bg-soft-sand rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black-olive rounded-full transition-all duration-500"
                        style={{ width: `${mod.pct}%` }}
                      />
                    </div>
                    <Link
                      to={mod.link}
                      className="px-3.5 py-1.5 rounded-xl bg-black-olive text-floral-white text-xs font-semibold shadow-sm hover:bg-deep-olive transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 text-warm-gold" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Practice Callout: Cocoa Noir #342721 Secondary Dark Anchor */}
        <div className="p-8 sm:p-10 rounded-3xl bg-cocoa-noir text-floral-white border border-soft-cocoa shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-gold uppercase tracking-wider">
              <Award className="w-4 h-4" /> 3-Level Mastery Pathway
            </div>
            <h3 className="text-xl font-bold text-floral-white">Progressive Practice Arena</h3>
            <p className="text-xs text-floral-white/75 max-w-xl leading-relaxed">
              90 scientifically curated questions across Beginner, Intermediate, and Advanced tiers. 
              Earn a 70% passing threshold in each round to unlock higher-order quantum challenges.
            </p>
          </div>
          <Link
            to="/practice"
            className="px-8 py-3.5 rounded-xl bg-warm-gold text-deep-olive font-bold text-xs shadow-gold-glow hover:bg-opacity-90 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Start Practice Arena
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
