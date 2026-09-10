export type PracticeLevel = 'beginner' | 'intermediate' | 'advanced';

export interface PracticeRoundScore {
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

export interface PracticeTopicPerformance {
  attempted: number;
  correct: number;
}

export interface PracticeProgress {
  currentLevel: PracticeLevel;
  currentRound: 1 | 2 | 3;
  unlockedLevels: PracticeLevel[];
  completedLevels: PracticeLevel[];
  unlockedRounds: Record<PracticeLevel, number>; // level -> highest unlocked round (1, 2, 3)
  roundScores: Record<string, PracticeRoundScore>; // "beginner-1" -> score
  topicPerformance: Record<string, PracticeTopicPerformance>;
  learnedTopics: string[];
  weakTopics: string[];
  strongTopics: string[];
}

export interface PlatformProgress {
  basics: number; // 0 - 100
  gates: number; // 0 - 100
  circuits: number; // 0 - 100
  algorithms: number; // 0 - 100
  quizScore: number | null; // e.g. 80 (%)
  quizTotal: number;
  quizCorrect: number;
  lastActive: string;
  practice?: PracticeProgress;
}

const STORAGE_KEY = 'quantum_platform_progress';
const PRACTICE_STORAGE_KEY = 'quantum_practice_progress';

export const DEFAULT_PRACTICE_PROGRESS: PracticeProgress = {
  currentLevel: 'beginner',
  currentRound: 1,
  unlockedLevels: ['beginner'],
  completedLevels: [],
  unlockedRounds: {
    beginner: 1,
    intermediate: 1,
    advanced: 1,
  },
  roundScores: {},
  topicPerformance: {},
  learnedTopics: [
    'qubit',
    'superposition',
    'measurement',
    'bloch-sphere',
    'x-gate',
    'y-gate',
    'z-gate',
    'hadamard-gate',
    'cnot-gate',
    'quantum-interference',
  ],
  weakTopics: [],
  strongTopics: [],
};

const DEFAULT_PROGRESS: PlatformProgress = {
  basics: 85,
  gates: 75,
  circuits: 60,
  algorithms: 50,
  quizScore: null,
  quizTotal: 10,
  quizCorrect: 0,
  lastActive: new Date().toLocaleDateString(),
};

export function getProgress(): PlatformProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Partial<PlatformProgress>): PlatformProgress {
  try {
    const current = getProgress();
    const updated: PlatformProgress = {
      ...current,
      ...progress,
      lastActive: new Date().toLocaleDateString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function recordQuizCompletion(correct: number, total: number): PlatformProgress {
  const score = Math.round((correct / total) * 100);
  return saveProgress({
    quizScore: score,
    quizTotal: total,
    quizCorrect: correct,
  });
}

// ==========================================
// Practice Section Progressive Learning API
// ==========================================

export function getPracticeProgress(): PracticeProgress {
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(DEFAULT_PRACTICE_PROGRESS));
      return DEFAULT_PRACTICE_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PRACTICE_PROGRESS,
      ...parsed,
      unlockedRounds: {
        ...DEFAULT_PRACTICE_PROGRESS.unlockedRounds,
        ...(parsed.unlockedRounds || {}),
      },
    };
  } catch {
    return DEFAULT_PRACTICE_PROGRESS;
  }
}

export function savePracticeProgress(update: Partial<PracticeProgress>): PracticeProgress {
  try {
    const current = getPracticeProgress();
    const merged: PracticeProgress = {
      ...current,
      ...update,
    };
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return DEFAULT_PRACTICE_PROGRESS;
  }
}

export function recordPracticeRoundAttempt(
  level: PracticeLevel,
  round: 1 | 2 | 3,
  score: number,
  total: number,
  topicResults: { topicId: string; isCorrect: boolean }[]
): {
  progress: PracticeProgress;
  passed: boolean;
  newLevelUnlocked: PracticeLevel | null;
  newRoundUnlocked: number | null;
} {
  const current = getPracticeProgress();
  const passed = total > 0 && score / total >= 0.7; // 70% threshold

  // Update round scores
  const roundKey = `${level}-${round}`;
  const updatedRoundScores = {
    ...current.roundScores,
    [roundKey]: {
      score,
      total,
      passed,
      completedAt: new Date().toISOString(),
    },
  };

  // Update topic performances
  const updatedTopicPerf = { ...current.topicPerformance };
  for (const item of topicResults) {
    const existing = updatedTopicPerf[item.topicId] || { attempted: 0, correct: 0 };
    updatedTopicPerf[item.topicId] = {
      attempted: existing.attempted + 1,
      correct: existing.correct + (item.isCorrect ? 1 : 0),
    };
  }

  // Calculate strong and weak topics
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];
  for (const [tId, stat] of Object.entries(updatedTopicPerf)) {
    if (stat.attempted >= 1) {
      const acc = stat.correct / stat.attempted;
      if (acc < 0.7) {
        weakTopics.push(tId);
      } else if (acc >= 0.8 && stat.attempted >= 2) {
        strongTopics.push(tId);
      }
    }
  }

  // Handle progression and unlocking
  const unlockedLevels = [...current.unlockedLevels];
  const completedLevels = [...current.completedLevels];
  const unlockedRounds = { ...current.unlockedRounds };
  let newLevelUnlocked: PracticeLevel | null = null;
  let newRoundUnlocked: number | null = null;

  if (passed) {
    if (round < 3) {
      const nextR = (round + 1) as 2 | 3;
      if (unlockedRounds[level] < nextR) {
        unlockedRounds[level] = nextR;
        newRoundUnlocked = nextR;
      }
    } else if (round === 3) {
      // Completed all 3 rounds for this level!
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
      }
      if (level === 'beginner' && !unlockedLevels.includes('intermediate')) {
        unlockedLevels.push('intermediate');
        newLevelUnlocked = 'intermediate';
      } else if (level === 'intermediate' && !unlockedLevels.includes('advanced')) {
        unlockedLevels.push('advanced');
        newLevelUnlocked = 'advanced';
      }
    }
  }

  const updatedProgress = savePracticeProgress({
    roundScores: updatedRoundScores,
    topicPerformance: updatedTopicPerf,
    weakTopics,
    strongTopics,
    unlockedLevels,
    completedLevels,
    unlockedRounds,
  });

  // Also update overall quiz stats on Dashboard
  recordQuizCompletion(score, total);

  return {
    progress: updatedProgress,
    passed,
    newLevelUnlocked,
    newRoundUnlocked,
  };
}

export function resetPracticeProgress(): PracticeProgress {
  localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(DEFAULT_PRACTICE_PROGRESS));
  return DEFAULT_PRACTICE_PROGRESS;
}
