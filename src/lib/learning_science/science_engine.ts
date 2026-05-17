// Cinematic English Phase 12: Learning Science & Cognitive Modeling Engine

export interface ForgettingCurveModel {
  elapsedDays: number;
  memoryStrength: number; // Stability index (higher = slower decay)
  predictedRetention: number; // 0.0 - 1.0 (R = e^(-t/S))
}

export interface MasteryConfidenceInterval {
  accuracyMean: number; // average accuracy (0 - 1)
  sampleSize: number; // attempts count (n)
  marginOfError: number;
  lowerBound: number; // average - error margin
  upperBound: number; // average + error margin
}

export class LearningScienceEngine {
  
  /**
   * Models the exponential decay of a memorized item using the classic Hermann Ebbinghaus forgetting curve.
   * Equation: R = e^(-t / S)
   * where:
   * - R = Retrievability (predicted retention)
   * - t = time elapsed in days
   * - S = Memory Strength (stability index)
   */
  static calculateForgettingCurve(
    elapsedDays: number,
    repetitions: number,
    lastEasinessFactor: number
  ): ForgettingCurveModel {
    // Memory strength scales exponentially based on correct spaced repetitions
    const memoryStrength = Math.max(1.0, 1.5 * Math.pow(lastEasinessFactor, repetitions));
    
    // Predicted retention decay
    const predictedRetention = Math.exp(-elapsedDays / memoryStrength);

    return {
      elapsedDays,
      memoryStrength: parseFloat(memoryStrength.toFixed(2)),
      predictedRetention: parseFloat(predictedRetention.toFixed(4))
    };
  }

  /**
   * Calculates the statistical Mastery Confidence Interval for student attempts.
   * Standard 95% Confidence Interval formula:
   * CI = z * sqrt( (p * (1 - p)) / n )
   * where z = 1.96 (for 95% confidence bounds)
   */
  static calculateMasteryConfidenceInterval(
    attemptsCount: number,
    correctAttempts: number
  ): MasteryConfidenceInterval {
    if (attemptsCount === 0) {
      return { accuracyMean: 0, sampleSize: 0, marginOfError: 0, lowerBound: 0, upperBound: 0 };
    }

    const p = correctAttempts / attemptsCount;
    const n = attemptsCount;
    
    // 95% z-score constant
    const z = 1.96;
    
    // Standard margin of error
    const stdError = Math.sqrt((p * (1 - p)) / n);
    const marginOfError = z * stdError;

    return {
      accuracyMean: parseFloat(p.toFixed(4)),
      sampleSize: n,
      marginOfError: parseFloat(marginOfError.toFixed(4)),
      lowerBound: parseFloat(Math.max(0, p - marginOfError).toFixed(4)),
      upperBound: parseFloat(Math.min(1, p + marginOfError).toFixed(4))
    };
  }

  /**
   * Flags phonemes showing rapid regression (significant accuracy drops over time).
   */
  static detectPhonemeRegression(
    historicalScores: { week: number; accuracy: number }[]
  ): {
    regressing: boolean;
    regressionRate: number; // percentage drops
  } {
    if (historicalScores.length < 2) {
      return { regressing: false, regressionRate: 0 };
    }

    // Compare earliest and latest scores
    const sorted = [...historicalScores].sort((a, b) => a.week - b.week);
    const initialAcc = sorted[0].accuracy;
    const finalAcc = sorted[sorted.length - 1].accuracy;

    const rate = initialAcc - finalAcc;
    
    return {
      regressing: rate > 10, // regress if drop exceeds 10%
      regressionRate: rate
    };
  }
}
