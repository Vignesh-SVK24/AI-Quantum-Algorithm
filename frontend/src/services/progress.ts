export interface PlatformProgress {
  basics: number; // 0 - 100
  gates: number; // 0 - 100
  circuits: number; // 0 - 100
  algorithms: number; // 0 - 100
  quizScore: number | null; // e.g. 80 (%)
  quizTotal: number;
  quizCorrect: number;
  lastActive: string;
}

const STORAGE_KEY = 'quantum_platform_progress';

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
