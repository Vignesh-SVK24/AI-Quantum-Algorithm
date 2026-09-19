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
  Award,
  Lock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileCheck,
  Mail
} from 'lucide-react';
import { 
  getProgress, 
  saveProgress, 
  getPracticeProgress, 
  type PlatformProgress, 
  type PracticeProgress 
} from '../services/progress';
import { CertificateModal } from '../components/CertificateModal';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { profile, isGuest } = useAuth();
  const [progress, setProgress] = useState<PlatformProgress>(getProgress());
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgress>(getPracticeProgress());
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setPracticeProgress(getPracticeProgress());
  }, []);

  const handleResetProgress = () => {
    if (window.confirm('Reset all curriculum progress data in your local session?')) {
      const reset = saveProgress({
        basics: 0,
        gates: 0,
        circuits: 0,
        algorithms: 0,
        quizScore: null,
        quizCorrect: 0
      });
      setProgress(reset);
      setPracticeProgress(getPracticeProgress());
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
      link: '/playground',
      icon: Cpu
    }
  ];

  // Derive dynamic personalized recommendations
  const recommendations = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      reason: string;
      type: 'weak_topic' | 'curriculum' | 'playground' | 'foundations';
      actionLabel: string;
      actionPath: string;
      tag: string;
    }> = [];

    // 1. Weak Topics from actual student practice
    if (practiceProgress.weakTopics.length > 0) {
      practiceProgress.weakTopics.slice(0, 2).forEach((topicSlug) => {
        const readable = topicSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        list.push({
          id: `weak-${topicSlug}`,
          title: `Focus Review: ${readable}`,
          reason: 'Accuracy in practice was below 60%. Reinforce foundational concepts.',
          type: 'weak_topic',
          actionLabel: 'Review in Encyclopedia',
          actionPath: '/home',
          tag: 'Needs Reinforcement'
        });
      });
    }

    // 2. Progressive Practice Pathway
    const completedBeg = practiceProgress.completedLevels.includes('beginner');
    const completedInt = practiceProgress.completedLevels.includes('intermediate');
    const completedAdv = practiceProgress.completedLevels.includes('advanced');

    if (!completedBeg) {
      list.push({
        id: 'rec-beginner',
        title: 'Master Single-Qubit Foundations',
        reason: 'Complete Beginner Round 1 to unlock your first verified badge.',
        type: 'curriculum',
        actionLabel: 'Take Beginner Practice',
        actionPath: '/practice',
        tag: 'Next Milestone'
      });
    } else if (!completedInt) {
      list.push({
        id: 'rec-intermediate',
        title: 'Advance to 2-Qubit Entanglement & Circuits',
        reason: 'You unlocked Intermediate! Tackle Bell States and CNOT operations.',
        type: 'curriculum',
        actionLabel: 'Enter Intermediate Practice',
        actionPath: '/practice',
        tag: 'Level Unlocked'
      });
    } else if (!completedAdv) {
      list.push({
        id: 'rec-advanced',
        title: 'Master Quantum Oracles & Algorithms',
        reason: 'Final frontier: Deutsch-Jozsa, Grover Search, and Quantum Error Correction.',
        type: 'curriculum',
        actionLabel: 'Enter Advanced Practice',
        actionPath: '/practice',
        tag: 'Final Milestone'
      });
    }

    // 3. 3D Algorithm Stepper recommendation
    list.push({
      id: 'rec-playground-grover',
      title: "Explore Grover's Search in 3D",
      reason: 'Observe how quantum diffusion reflects probability amplitudes about the mean.',
      type: 'playground',
      actionLabel: 'Open 3D Playground',
      actionPath: '/playground/grover',
      tag: '3D Simulation'
    });

    return list;
  }, [practiceProgress]);

  // Badges status
  const badges = [
    {
      id: 'foundations',
      title: 'Quantum Foundations',
      description: 'Mastered qubit states, superposition, and measurement in Beginner practice',
      unlocked: practiceProgress.completedLevels.includes('beginner') || (progress.basics >= 70 && progress.gates >= 60),
      tier: 'Beginner',
      icon: BookOpen
    },
    {
      id: 'entanglement',
      title: 'Entanglement Architect',
      description: 'Created 2-qubit Bell states, controlled gates, and phase kickback',
      unlocked: practiceProgress.completedLevels.includes('intermediate') || progress.circuits >= 70,
      tier: 'Intermediate',
      icon: Layers
    },
    {
      id: 'vanguard',
      title: 'Algorithm Vanguard',
      description: 'Mastered quantum oracles, amplitude amplification, and Deutsch-Jozsa interference',
      unlocked: practiceProgress.completedLevels.includes('advanced') || progress.algorithms >= 70,
      tier: 'Advanced',
      icon: Zap
    },
    {
      id: 'grandmaster',
      title: 'Grand Quantum Master',
      description: '100% comprehensive platform mastery with verified credential',
      unlocked: practiceProgress.completedLevels.length >= 3 || overallAverage >= 85,
      tier: 'Mastery',
      icon: Award
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
                <p className="text-xs text-olive-mist">Curriculum mastery, personalized recommendations, and verified badges</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="px-4 py-2 rounded-xl bg-warm-gold text-[#151D29] text-xs font-bold shadow-sm hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" /> View Certificate
            </button>
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-semibold text-olive-mist hover:text-black-olive hover:bg-soft-sand transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Data
            </button>
          </div>
        </div>

        {/* Authenticated Student Identity & Account Card */}
        <div className="rounded-3xl bg-warm-ivory border border-soft-sand shadow-sm p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Student'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-black-olive/10 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-black-olive text-warm-gold text-2xl font-bold flex items-center justify-center shadow-sm">
                {(profile?.full_name || profile?.email || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-black-olive">
                  {profile?.full_name || 'Quantum Scholar'}
                </h2>
                {isGuest ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    Guest Session
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-muted-sage/20 text-deep-olive border border-muted-sage/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-deep-olive" /> Verified Student
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-olive-mist flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profile?.email || (isGuest ? 'Anonymous Scholar' : 'Verified Student')}
                </span>
                <span className="text-soft-sand">•</span>
                <span className="font-mono text-[11px]">
                  Auth Provider: {profile?.auth_provider ? profile.auth_provider.toUpperCase() : (isGuest ? 'ANONYMOUS' : 'SUPABASE')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            {isGuest ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-warm-gold text-[#151D29] text-xs font-bold shadow-sm hover:brightness-105 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Upgrade to Full Account
              </Link>
            ) : (
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-sage block">Account State</span>
                <span className="text-xs font-medium text-black-olive">Active Supabase Session</span>
              </div>
            )}
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

        {/* ========================================================================= */}
        {/* PERSONALIZED RECOMMENDATIONS (ACTIONABLE FOR USER) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C5A86A]" />
                <h2 className="text-lg font-bold text-black-olive">Recommended for You</h2>
              </div>
              <p className="text-xs text-olive-mist mt-0.5">
                Intelligent learning steps based on your quiz performance and curriculum progression
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                      rec.type === 'weak_topic'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : rec.type === 'curriculum'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {rec.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-black-olive group-hover:text-deep-olive transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-black-olive/70 leading-relaxed font-sans">
                    {rec.reason}
                  </p>
                </div>

                <Link
                  to={rec.actionPath}
                  className="px-4 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-bold text-black-olive group-hover:bg-black-olive group-hover:text-floral-white transition-all flex items-center justify-between shadow-xs"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-warm-gold group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRACTICE BADGES & ACHIEVEMENTS SHOWCASE */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-warm-gold" />
                <h2 className="text-lg font-bold text-black-olive">Practice Badges & Milestones</h2>
              </div>
              <p className="text-xs text-olive-mist mt-0.5">
                Earned by achieving a 70% passing threshold in our 3-tier Adaptive Practice Arena
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCertificateOpen(true)}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-semibold text-black-olive hover:bg-soft-sand transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certificate Preview</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    badge.unlocked
                      ? 'bg-warm-ivory/60 border-soft-sand shadow-xs'
                      : 'bg-black-olive/5 border-dashed border-black-olive/15 opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        badge.unlocked
                          ? 'bg-black-olive text-warm-gold shadow-xs'
                          : 'bg-black-olive/20 text-black-olive/40'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive-mist">
                        {badge.tier}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-black-olive">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] text-black-olive/70 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-soft-sand/60 flex items-center justify-between text-[10px] font-mono">
                    {badge.unlocked ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-black-olive/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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

      {/* Completion Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        scorePercentage={progress.quizScore || overallAverage}
      />
    </div>
  );
};

export default Dashboard;
