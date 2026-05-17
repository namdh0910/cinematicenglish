// Cinematic English Phase 12: A/B Testing & Feature Flags Infrastructure

export type ExperimentCohort = "control" | "treatment";

export interface FeatureFlagConfig {
  flagKey: string;
  isEnabled: boolean;
  rolloutPercentage: number; // 0 - 100
}

export class ExperimentationInfrastructure {
  private static flags: FeatureFlagConfig[] = [
    { flagKey: "adaptive-pacing-v2", isEnabled: true, rolloutPercentage: 50 },
    { flagKey: "spaced-retrieval-recalculation", isEnabled: true, rolloutPercentage: 100 },
    { flagKey: "ai-streak-shields", isEnabled: false, rolloutPercentage: 0 }
  ];

  /**
   * Deterministically allocates a user to either control or treatment cohorts using standard hashing.
   */
  static allocateCohort(
    userId: string,
    experimentName: string
  ): ExperimentCohort {
    // Generate a simple deterministic hash from the userId + experiment string
    let hash = 0;
    const combined = `${userId}::${experimentName}`;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to absolute value and check parity
    const bucket = Math.abs(hash) % 100;
    
    // Allocate to treatment if bucket is within the top 50%
    return bucket < 50 ? "control" : "treatment";
  }

  /**
   * Evaluates feature flag status for a specific user.
   */
  static isFeatureEnabled(
    userId: string,
    flagKey: string
  ): boolean {
    const flag = this.flags.find((f) => f.flagKey === flagKey);
    if (!flag || !flag.isEnabled) return false;
    
    // Dynamic rollout checking
    if (flag.rolloutPercentage === 100) return true;
    if (flag.rolloutPercentage === 0) return false;

    // Use hash bucket matching for deterministic rollout percentages
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const bucket = Math.abs(hash) % 100;

    return bucket < flag.rolloutPercentage;
  }
}
