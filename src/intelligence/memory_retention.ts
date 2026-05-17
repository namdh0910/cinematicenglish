// Cinematic English Phase 6: Spaced Repetition Memory Retention System

export interface MemorizedItem {
  id: string;
  itemType: "vocabulary" | "phoneme" | "grammar";
  content: string; // e.g. "anomaly", "θ", "Present Perfect"
  repetitions: number;
  easinessFactor: number; // SM-2 standard default: 2.5
  intervalDays: number;
  lastReviewed: string; // ISO date
  nextDue: string; // ISO date
  stabilityScore: number; // 0 - 100
}

export class MemoryRetentionManager {
  
  /**
   * SuperMemo SM-2 Algorithm mapping to calculate optimal review intervals.
   * Grades:
   * - 5: Perfect response
   * - 4: Correct response after hesitation
   * - 3: Correct response with serious difficulty
   * - 2: Incorrect response; where recall was easy
   * - 1: Incorrect response; where recall was difficult
   * - 0: Complete blackout
   */
  static evaluateRecallAttempt(
    item: MemorizedItem,
    grade: number
  ): MemorizedItem {
    let repetitions = item.repetitions;
    let easinessFactor = item.easinessFactor;
    let intervalDays = item.intervalDays;

    if (grade >= 3) {
      if (repetitions === 0) {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easinessFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      intervalDays = 1;
    }

    // Adjust easiness factor: EF'=EF+(0.1-(5-q)*(0.08+(5-q)*0.02))
    easinessFactor = easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easinessFactor < 1.3) {
      easinessFactor = 1.3;
    }

    const today = new Date();
    const nextDueDate = new Date(today);
    nextDueDate.setDate(today.getDate() + intervalDays);

    // Calculate stability score based on interval length (longer interval = higher stability)
    const stabilityScore = Math.min(100, Math.round((intervalDays / 90) * 100));

    return {
      ...item,
      repetitions,
      easinessFactor: parseFloat(easinessFactor.toFixed(2)),
      intervalDays,
      lastReviewed: today.toISOString().split("T")[0],
      nextDue: nextDueDate.toISOString().split("T")[0],
      stabilityScore
    };
  }

  /**
   * Resolves list of due review items from database stores.
   */
  static filterDueReviewItems(items: MemorizedItem[]): MemorizedItem[] {
    const todayStr = new Date().toISOString().split("T")[0];
    return items.filter((item) => item.nextDue <= todayStr);
  }
}
