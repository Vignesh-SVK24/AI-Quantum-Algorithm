import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  ArrowLeft,
  Sparkles,
  Check,
  TrendingUp,
  Lock,
  AlertCircle,
  BookOpen,
  Layers,
  Zap,
  Target,
  ShieldCheck
} from 'lucide-react';
import { 
  getPracticeProgress, 
  savePracticeProgress, 
  recordPracticeRoundAttempt, 
  type PracticeLevel, 
  type PracticeProgress 
} from '../services/progress';
import { 
  PRACTICE_QUESTIONS, 
  getQuestionsForRound, 
  type PracticeQuestion 
} from '../data/practiceQuestionsData';

const PASSING_THRESHOLD_PCT = 70; // 70% required to advance (7/10)

interface LevelConfig {
  id: PracticeLevel;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  icon: typeof BookOpen;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    tagline: 'Foundations & Single Qubits',
    description: 'Master qubit states, Dirac notation, basic Pauli & Hadamard gates, and measurement collapse.',
    badgeColor: 'text-slate-gray',
    icon: BookOpen,
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    tagline: 'Entanglement & Circuits',
    description: 'Explore 2-qubit CNOT gates, Bell states, phase kickback, teleportation, and BB84 cryptography.',
    badgeColor: 'text-slate-gray',
    icon: Layers,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'Algorithms & Error Correction',
    description: 'Deep dive into Deutsch-Jozsa, Grover search, QFT, Phase Estimation, Shor, and Quantum Error Correction.',
    badgeColor: 'text-slate-gray',
    icon: Zap,
  }
];

export const Practice: React.FC = () => {
  // Load persistent user progress
  const [progress, setProgress] = useState<PracticeProgress>(getPracticeProgress());

  // Navigation state
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel>(progress.currentLevel);
  const [selectedRound, setSelectedRound] = useState<1 | 2 | 3>(progress.currentRound);

  // Active quiz state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Array<{
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
    topicId: string;
  }>>([]);

  // Screen states: 'quiz' | 'round_result' | 'level_summary'
  const [screenMode, setScreenMode] = useState<'quiz' | 'round_result' | 'level_summary'>('quiz');
  const [roundResultData, setRoundResultData] = useState<{
    score: number;
    total: number;
    passed: boolean;
    newRoundUnlocked: number | null;
    newLevelUnlocked: PracticeLevel | null;
  } | null>(null);

  // Network / Loading state
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadedQuestions, setLoadedQuestions] = useState<PracticeQuestion[]>([]);

  // Load questions for the active (level, round) pair
  useEffect(() => {
    let isMounted = true;
    setIsLoadingQuestions(true);
    setApiError(null);

    // Fetch from backend API if available, with robust local fallback
    async function fetchQuestions() {
      try {
        const queryParams = new URLSearchParams({
          level: selectedLevel,
          round: selectedRound.toString(),
          user_id: 'local_student'
        });

        // Add learned topics parameter
        if (progress.learnedTopics.length > 0) {
          queryParams.append('topics', progress.learnedTopics.join(','));
        }

        const resp = await fetch(`http://127.0.0.1:8000/practice/questions?${queryParams.toString()}`, {
          signal: AbortSignal.timeout(1500)
        });

        if (resp.ok) {
          const data = await resp.json();
          if (isMounted && data.questions && data.questions.length > 0) {
            // Map backend schema to PracticeQuestion
            const mapped: PracticeQuestion[] = data.questions.map((q: any) => ({
              id: q.id,
              level: q.level,
              round: q.round,
              topicId: q.topic_id,
              topicName: q.topic_name,
              questionType: q.question_type,
              question: q.question,
              options: q.options,
              correctIndex: q.correct_answer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              sourceContentId: q.source_content_id
            }));
            setLoadedQuestions(mapped);
            setIsLoadingQuestions(false);
            return;
          }
        }
      } catch {
        // Backend offline or unreachable — seamlessly use local verified question corpus
        if (isMounted) {
          setApiError('Quantum Practice operating in offline verified mode.');
        }
      }

      if (isMounted) {
        // Personalization: weight weak topics if present
        let localQs = getQuestionsForRound(selectedLevel, selectedRound);
        if (progress.weakTopics.length > 0) {
          const weakSet = new Set(progress.weakTopics);
          const weakQs = localQs.filter(q => weakSet.has(q.topicId));
          const otherQs = localQs.filter(q => !weakSet.has(q.topicId));
          localQs = [...weakQs, ...otherQs];
        }
        setLoadedQuestions(localQs);
        setIsLoadingQuestions(false);
      }
    }

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [selectedLevel, selectedRound, progress.weakTopics, progress.learnedTopics]);

  // Current active question
  const currentQuestions = loadedQuestions.length > 0 
    ? loadedQuestions 
    : getQuestionsForRound(selectedLevel, selectedRound);

  const q = currentQuestions[currentIdx] || currentQuestions[0];
  const hasAnsweredCurrent = selectedAnswer !== null;

  // Level unlocking checks
  const isLevelUnlocked = (level: PracticeLevel) => {
    return progress.unlockedLevels.includes(level);
  };

  const isLevelCompleted = (level: PracticeLevel) => {
    return progress.completedLevels.includes(level);
  };

  const isRoundUnlocked = (level: PracticeLevel, round: 1 | 2 | 3) => {
    if (!isLevelUnlocked(level)) return false;
    const maxUnlocked = progress.unlockedRounds[level] || 1;
    return round <= maxUnlocked;
  };

  // Switch level
  const handleSelectLevel = (level: PracticeLevel) => {
    if (!isLevelUnlocked(level)) return;
    setSelectedLevel(level);
    const highestRound = (progress.unlockedRounds[level] || 1) as 1 | 2 | 3;
    setSelectedRound(highestRound);
    resetRoundState();
    setScreenMode('quiz');
    savePracticeProgress({ currentLevel: level, currentRound: highestRound });
    setProgress(getPracticeProgress());
  };

  // Switch round
  const handleSelectRound = (round: 1 | 2 | 3) => {
    if (!isRoundUnlocked(selectedLevel, round)) return;
    setSelectedRound(round);
    resetRoundState();
    setScreenMode('quiz');
    savePracticeProgress({ currentLevel: selectedLevel, currentRound: round });
    setProgress(getPracticeProgress());
  };

  const resetRoundState = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredCount(0);
    setRecordedAnswers([]);
    setRoundResultData(null);
  };

  // Answer selection handler
  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent || !q) return;

    setSelectedAnswer(idx);
    const isCorrect = idx === q.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    const newRecord = {
      questionId: q.id,
      selectedOption: idx,
      isCorrect,
      topicId: q.topicId,
    };
    const updatedAnswers = [...recordedAnswers, newRecord];
    setRecordedAnswers(updatedAnswers);
    setAnsweredCount(answeredCount + 1);

    // If last question answered in round, process completion
    if (currentIdx === currentQuestions.length - 1) {
      const topicItems = updatedAnswers.map(a => ({
        topicId: a.topicId,
        isCorrect: a.isCorrect,
      }));

      const attemptResult = recordPracticeRoundAttempt(
        selectedLevel,
        selectedRound,
        newScore,
        currentQuestions.length,
        topicItems
      );

      setProgress(attemptResult.progress);
      setRoundResultData({
        score: newScore,
        total: currentQuestions.length,
        passed: attemptResult.passed,
        newRoundUnlocked: attemptResult.newRoundUnlocked,
        newLevelUnlocked: attemptResult.newLevelUnlocked,
      });

      // Also submit asynchronously to backend if available
      try {
        fetch('http://127.0.0.1:8000/practice/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'local_student',
            level: selectedLevel,
            round: selectedRound,
            answers: updatedAnswers.map(a => ({
              question_id: a.questionId,
              selected_option: a.selectedOption,
              is_correct: a.isCorrect,
              topic_id: a.topicId
            }))
          })
        }).catch(() => {});
      } catch {}
    }
  };

  // Move to next question or show end of round
  const handleNextQuestion = () => {
    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setScreenMode('round_result');
    }
  };

  // Advance to next round or level
  const handleProceedNextRound = () => {
    if (selectedRound < 3) {
      const nextR = (selectedRound + 1) as 2 | 3;
      setSelectedRound(nextR);
      resetRoundState();
      setScreenMode('quiz');
      savePracticeProgress({ currentLevel: selectedLevel, currentRound: nextR });
      setProgress(getPracticeProgress());
    } else {
      // Completed all 3 rounds of the level -> show level summary
      setScreenMode('level_summary');
    }
  };

  // Retry the current round
  const handleRetryRound = () => {
    resetRoundState();
    setScreenMode('quiz');
  };

  // Advance to next unlocked level from level summary
  const handleUnlockAndProceedNextLevel = () => {
    let nextL: PracticeLevel = 'beginner';
    if (selectedLevel === 'beginner' && isLevelUnlocked('intermediate')) {
      nextL = 'intermediate';
    } else if (selectedLevel === 'intermediate' && isLevelUnlocked('advanced')) {
      nextL = 'advanced';
    }
    setSelectedLevel(nextL);
    setSelectedRound(1);
    resetRoundState();
    setScreenMode('quiz');
    savePracticeProgress({ currentLevel: nextL, currentRound: 1 });
    setProgress(getPracticeProgress());
  };

  // Calculate overall level score (across 3 rounds)
  const levelStats = useMemo(() => {
    let totalScore = 0;
    let totalQuestions = 0;
    let roundsPassed = 0;

    for (let r = 1; r <= 3; r++) {
      const rKey = `${selectedLevel}-${r}`;
      const rData = progress.roundScores[rKey];
      if (rData) {
        totalScore += rData.score;
        totalQuestions += rData.total;
        if (rData.passed) roundsPassed += 1;
      }
    }

    const pct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    return { totalScore, totalQuestions, roundsPassed, pct };
  }, [selectedLevel, progress.roundScores]);

  // Topic mastery lists for level summary
  const { strongTopicsList, weakTopicsList } = useMemo(() => {
    const strong: string[] = [];
    const weak: string[] = [];

    // Filter by topics belonging to the selected level
    const levelQuestions = PRACTICE_QUESTIONS.filter(q => q.level === selectedLevel);
    const levelTopicIds = new Set(levelQuestions.map(q => q.topicId));

    for (const tId of levelTopicIds) {
      const stat = progress.topicPerformance[tId];
      if (stat && stat.attempted >= 1) {
        const accuracy = stat.correct / stat.attempted;
        const matchingQ = levelQuestions.find(q => q.topicId === tId);
        const name = matchingQ?.topicName || tId;
        if (accuracy >= 0.8 && stat.attempted >= 2) {
          strong.push(`${name} (${Math.round(accuracy * 100)}%)`);
        } else if (accuracy < 0.7) {
          weak.push(`${name} (${Math.round(accuracy * 100)}%)`);
        }
      }
    }

    return { strongTopicsList: strong, weakTopicsList: weak };
  }, [selectedLevel, progress.topicPerformance]);

  return (
    <div className="min-h-screen bg-floral-white text-black-olive">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header with breadcrumb and Neumorphic controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black-olive/10">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-floral-white text-xs font-semibold text-slate-gray shadow-neu-raised hover:shadow-neu-pressed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-floral-white shadow-neu-raised flex items-center justify-center text-slate-gray">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black-olive tracking-tight">Quantum Progressive Practice</h1>
                <p className="text-xs text-black-olive/70">Master quantum computing through 3 progressive levels and 9 mastery rounds</p>
              </div>
            </div>
          </div>

          {/* Top Quick Status Pill */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="px-4 py-2 rounded-2xl bg-floral-white shadow-neu-pressed text-xs font-mono flex items-center gap-2">
              <span className="text-black-olive/70">Active Level:</span>
              <span className="text-slate-gray font-bold uppercase">{selectedLevel}</span>
              <span className="text-black-olive/40">•</span>
              <span className="text-black-olive/70">R{selectedRound}</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LEVEL SELECTOR: 3 Levels (Beginner, Intermediate, Advanced) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEVEL_CONFIGS.map((cfg) => {
            const unlocked = isLevelUnlocked(cfg.id);
            const completed = isLevelCompleted(cfg.id);
            const isSelected = selectedLevel === cfg.id;
            const Icon = cfg.icon;

            // Distinct visual style per level
            let levelCardStyle = "";
            let badgeStyle = "";
            let textPrimary = "";
            let textSecondary = "";
            let barBg = "";
            let barFill = "";

            if (cfg.id === 'beginner') {
              // Beginner: Floral White / light
              levelCardStyle = isSelected
                ? 'bg-[#FFFDF7] border-2 border-black-olive shadow-md'
                : unlocked
                ? 'bg-[#FFFDF7] border border-soft-sand hover:border-black-olive/40 shadow-sm'
                : 'bg-warm-ivory/60 border border-soft-sand opacity-50 cursor-not-allowed';
              badgeStyle = 'bg-warm-ivory text-deep-olive border border-soft-sand';
              textPrimary = 'text-black-olive';
              textSecondary = 'text-olive-mist';
              barBg = 'bg-warm-ivory';
              barFill = 'bg-deep-olive';
            } else if (cfg.id === 'intermediate') {
              // Intermediate: Black Olive dark card
              levelCardStyle = isSelected
                ? 'bg-black-olive text-floral-white border-2 border-warm-gold shadow-botanical-glow'
                : unlocked
                ? 'bg-black-olive text-floral-white border border-deep-olive hover:border-olive-mist shadow-sm'
                : 'bg-black-olive/60 text-floral-white/50 border border-deep-olive opacity-50 cursor-not-allowed';
              badgeStyle = 'bg-deep-olive text-soft-cyan border border-olive-mist/30';
              textPrimary = 'text-floral-white';
              textSecondary = 'text-soft-cyan';
              barBg = 'bg-deep-olive';
              barFill = 'bg-soft-cyan';
            } else {
              // Advanced: Cocoa Noir deep dark card
              levelCardStyle = isSelected
                ? 'bg-cocoa-noir text-floral-white border-2 border-warm-gold shadow-lg'
                : unlocked
                ? 'bg-cocoa-noir text-floral-white border border-soft-cocoa hover:border-warm-gold/40 shadow-sm'
                : 'bg-cocoa-noir/60 text-floral-white/50 border border-soft-cocoa opacity-50 cursor-not-allowed';
              badgeStyle = 'bg-[#251B17] text-warm-gold border border-warm-gold/30';
              textPrimary = 'text-floral-white';
              textSecondary = 'text-warm-gold';
              barBg = 'bg-[#251B17]';
              barFill = 'bg-warm-gold';
            }

            return (
              <button
                key={cfg.id}
                onClick={() => handleSelectLevel(cfg.id)}
                disabled={!unlocked}
                className={`p-5 rounded-3xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${levelCardStyle}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${badgeStyle}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {completed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-warm-gold text-deep-olive shadow-sm">
                        <Check className="w-3 h-3 text-deep-olive" /> Passed
                      </span>
                    ) : unlocked ? (
                      <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}>
                        30 Questions
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono opacity-60 px-2 py-0.5 rounded-full border border-current">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-base font-bold ${textPrimary}`}>{cfg.name}</h3>
                    <p className={`text-xs font-semibold ${textSecondary}`}>{cfg.tagline}</p>
                  </div>
                  
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${cfg.id === 'beginner' ? 'text-black-olive/75' : 'text-floral-white/75'}`}>
                    {cfg.description}
                  </p>
                </div>

                {/* Progress bar per level */}
                <div className="mt-4 pt-3 border-t border-current border-opacity-10">
                  <div className="flex justify-between text-[10px] font-mono opacity-70 mb-1">
                    <span>Round Progress</span>
                    <span>{(progress.unlockedRounds[cfg.id] || 1)} / 3 Rounds</span>
                  </div>
                  <div className={`h-1.5 ${barBg} rounded-full overflow-hidden p-0.5`}>
                    <div 
                      className={`h-full ${barFill} rounded-full transition-all`}
                      style={{ width: `${Math.min(100, ((progress.unlockedRounds[cfg.id] || 1) / 3) * 100)}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* ROUND SELECTOR TABS (Round 1, Round 2, Round 3)              */}
        {/* ============================================================ */}
        <div className="p-4 rounded-2xl bg-floral-white shadow-neu-raised flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-gray" />
            <span className="text-xs font-bold uppercase tracking-wider text-black-olive font-mono">
              {selectedLevel} Rounds:
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {[1, 2, 3].map((rNum) => {
              const r = rNum as 1 | 2 | 3;
              const unlocked = isRoundUnlocked(selectedLevel, r);
              const isCurrent = selectedRound === r && screenMode === 'quiz';
              const rKey = `${selectedLevel}-${r}`;
              const roundData = progress.roundScores[rKey];

              return (
                <button
                  key={r}
                  onClick={() => handleSelectRound(r)}
                  disabled={!unlocked}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-floral-white shadow-neu-pressed border-2 border-slate-gray text-slate-gray'
                      : unlocked
                      ? 'bg-floral-white shadow-neu-raised hover:shadow-neu-pressed text-black-olive'
                      : 'bg-floral-white shadow-neu-pressed opacity-40 cursor-not-allowed text-black-olive/40'
                  }`}
                >
                  <span>Round {r}</span>
                  {roundData?.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-gray" />
                  ) : !unlocked ? (
                    <Lock className="w-3 h-3 text-black-olive/40" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {apiError && (
          <div className="p-3.5 rounded-2xl bg-floral-white shadow-neu-pressed text-xs text-black-olive/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-gray flex-shrink-0" />
              <span>{apiError}</span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-floral-white shadow-neu-sm-raised text-slate-gray font-bold">
              Autonomous Offline
            </span>
          </div>
        )}

        {isLoadingQuestions && (
          <div className="text-center py-2 text-xs font-mono text-slate-gray">
            Syncing question repository...
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 1: ACTIVE QUIZ VIEW                                    */}
        {/* ============================================================ */}
        {screenMode === 'quiz' && (
          <div className="space-y-6">
            
            {/* Header: Progress, Level, Round & Question Indicator */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center text-xs font-mono text-olive-mist gap-2">
                <span className="font-bold text-deep-olive">
                  {selectedLevel.toUpperCase()} — Round {selectedRound} of 3 — Question {currentIdx + 1} of {currentQuestions.length}
                </span>
                <span>Topic: <strong className="text-black-olive">{q?.topicName || 'Foundations'}</strong></span>
              </div>
              <div className="h-2 bg-soft-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-black-olive rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / currentQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Raised Question Card */}
            {q && (
              <div className="p-6 md:p-8 rounded-3xl bg-[#FFFDF7] border border-soft-sand shadow-sm space-y-6">
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-warm-ivory border border-soft-sand text-deep-olive font-bold">
                      {q.questionType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-warm-ivory border border-soft-sand text-olive-mist">
                      Level: {q.level}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-black-olive leading-snug">
                    {q.question}
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {q.options.map((option, idx) => {
                    let btnStyle = "bg-warm-ivory/60 border border-soft-sand hover:border-black-olive/40 hover:bg-warm-ivory text-black-olive";
                    let icon = null;

                    if (hasAnsweredCurrent) {
                      if (idx === q.correctIndex) {
                        btnStyle = "bg-deep-olive text-floral-white border-2 border-muted-sage font-bold shadow-sm";
                        icon = <CheckCircle2 className="w-5 h-5 text-muted-sage flex-shrink-0" />;
                      } else if (idx === selectedAnswer) {
                        btnStyle = "bg-cocoa-noir text-floral-white border-2 border-soft-cocoa font-bold";
                        icon = <XCircle className="w-5 h-5 text-warm-gold flex-shrink-0" />;
                      } else {
                        btnStyle = "bg-warm-ivory/30 border border-soft-sand/50 opacity-40 text-black-olive/40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={hasAnsweredCurrent}
                        className={`w-full p-4 rounded-2xl text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-floral-white border border-soft-sand flex items-center justify-center font-mono text-xs text-black-olive font-bold flex-shrink-0 shadow-sm">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </div>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Feedback Box Grounded in DB Explanation */}
                {hasAnsweredCurrent && (
                  <div className="p-4 rounded-2xl bg-warm-ivory border border-soft-sand text-xs leading-relaxed space-y-1.5 transition-all">
                    <div className={`font-bold flex items-center gap-1.5 ${
                      selectedAnswer === q.correctIndex ? 'text-deep-olive' : 'text-cocoa-noir'
                    }`}>
                      {selectedAnswer === q.correctIndex ? (
                        <>
                          <Check className="w-4 h-4 text-muted-sage" />
                          <span>Correct! Excellent scientific reasoning.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-warm-gold" />
                          <span>Incorrect — Conceptual Grounding:</span>
                        </>
                      )}
                    </div>
                    <p className="text-black-olive/80">{q.explanation}</p>
                  </div>
                )}

                {/* Navigation Next CTA */}
                {hasAnsweredCurrent && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 rounded-xl bg-black-olive text-floral-white font-semibold text-xs shadow-sm hover:bg-deep-olive hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <span>
                        {currentIdx === currentQuestions.length - 1 
                          ? 'Complete Round' 
                          : 'Next Question'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: END OF ROUND RESULT VIEW                           */}
        {/* ============================================================ */}
        {screenMode === 'round_result' && roundResultData && (
          <div className="p-8 sm:p-12 rounded-3xl bg-floral-white shadow-neu-raised text-center space-y-6">
            <div className={`w-16 h-16 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center mx-auto ${
              roundResultData.passed ? 'text-slate-gray' : 'text-black-olive/60'
            }`}>
              {roundResultData.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black-olive">
                {roundResultData.passed ? `Round ${selectedRound} Passed!` : `Round ${selectedRound} Needs Practice`}
              </h2>
              <p className="text-sm text-black-olive/70">
                You scored <strong className="text-slate-gray font-bold">{roundResultData.score} out of {roundResultData.total}</strong> ({Math.round((roundResultData.score / roundResultData.total) * 100)}%).
              </p>
              <p className="text-xs text-black-olive/60">
                Passing requirement: {PASSING_THRESHOLD_PCT}% (7 out of 10 questions).
              </p>
            </div>

            {/* Threshold Feedback Panel */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-floral-white shadow-neu-pressed text-xs text-black-olive/80 leading-relaxed text-left space-y-2">
              {roundResultData.passed ? (
                <>
                  <p className="font-bold text-slate-gray flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-gray" /> Great mastery of this round!
                  </p>
                  <p>
                    {selectedRound < 3 
                      ? `Round ${selectedRound + 1} is now unlocked. Continue advancing through ${selectedLevel} level.`
                      : `All 3 rounds of ${selectedLevel} level are completed! View your full level mastery summary.`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-black-olive flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-black-olive/70" /> Below passing threshold ({PASSING_THRESHOLD_PCT}%)
                  </p>
                  <p>
                    Don't worry — quantum mechanics requires iteration. Review the concept explanations and retry this round as many times as you need.
                  </p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleRetryRound}
                className="px-6 py-3 rounded-2xl bg-floral-white text-black-olive font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry Round {selectedRound}
              </button>

              {roundResultData.passed && (
                <button
                  onClick={handleProceedNextRound}
                  className="px-6 py-3 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
                >
                  <span>
                    {selectedRound < 3 
                      ? `Next: Round ${selectedRound + 1}` 
                      : `View ${selectedLevel.toUpperCase()} Summary`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: END OF LEVEL SUMMARY VIEW                          */}
        {/* ============================================================ */}
        {screenMode === 'level_summary' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-floral-white shadow-neu-raised text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-floral-white shadow-neu-pressed flex items-center justify-center mx-auto text-slate-gray">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black-olive">
                🎉 {selectedLevel.toUpperCase()} Level Completed!
              </h2>
              <p className="text-sm text-black-olive/70">
                Cumulative score across all 3 rounds: <strong className="text-slate-gray font-bold">{levelStats.totalScore} / {levelStats.totalQuestions || 30}</strong> ({levelStats.pct}%).
              </p>
            </div>

            {/* Dynamic Performance Breakdown (Strong areas vs Needs practice) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
              
              {/* Strong Areas Card */}
              <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-gray">
                  <ShieldCheck className="w-4 h-4 text-slate-gray" />
                  <span>Strong Areas (≥80%):</span>
                </div>
                {strongTopicsList.length > 0 ? (
                  <ul className="space-y-1 text-xs text-black-olive/80 pl-2">
                    {strongTopicsList.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-slate-gray" /> {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-black-olive/60 italic">Complete more attempts to identify top mastery areas.</p>
                )}
              </div>

              {/* Needs Practice Card */}
              <div className="p-4 rounded-2xl bg-floral-white shadow-neu-pressed space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-black-olive">
                  <AlertCircle className="w-4 h-4 text-black-olive/70" />
                  <span>Needs Practice (&lt;70%):</span>
                </div>
                {weakTopicsList.length > 0 ? (
                  <ul className="space-y-1 text-xs text-black-olive/80 pl-2">
                    {weakTopicsList.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-gray" /> {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-black-olive/60 italic">No significant weak areas identified in this level!</p>
                )}
              </div>

            </div>

            {/* Navigation Buttons from Summary */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setSelectedRound(1);
                  resetRoundState();
                  setScreenMode('quiz');
                }}
                className="px-6 py-3 rounded-2xl bg-floral-white text-black-olive font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retake {selectedLevel} Level
              </button>

              {/* Advance to next level if available */}
              {selectedLevel === 'beginner' && isLevelUnlocked('intermediate') && (
                <button
                  onClick={handleUnlockAndProceedNextLevel}
                  className="px-6 py-3 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
                >
                  <span>Proceed to Intermediate Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {selectedLevel === 'intermediate' && isLevelUnlocked('advanced') && (
                <button
                  onClick={handleUnlockAndProceedNextLevel}
                  className="px-6 py-3 rounded-2xl bg-slate-gray text-floral-white font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
                >
                  <span>Proceed to Advanced Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-2xl bg-floral-white text-slate-gray font-semibold text-xs shadow-neu-raised hover:shadow-neu-pressed transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> View Platform Progress
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Practice;
