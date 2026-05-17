// Cinematic English Phase 6: Skill Graph Architecture

export interface SubSkill {
  id: string;
  name: string;
  masteryLevel: number; // 0 - 100
  confidenceTrend: "up" | "stable" | "down";
  recoveryUrgency: "low" | "medium" | "high";
  lastTested: string; // ISO date string
}

export interface SkillNode {
  id: string;
  name: string; // e.g. "Speaking", "Listening", "Vocabulary", "Grammar", "Reading"
  overallMastery: number; // 0 - 100
  subSkills: SubSkill[];
}

export const INITIAL_SKILL_GRAPH: SkillNode[] = [
  {
    id: "speaking",
    name: "Speaking & Pronunciation",
    overallMastery: 84,
    subSkills: [
      { id: "s-phonemes", name: "Phoneme accuracy (θ, ð, ʃ)", masteryLevel: 76, confidenceTrend: "down", recoveryUrgency: "high", lastTested: "2026-05-16" },
      { id: "s-cadence", name: "Cadence & stress rhythm", masteryLevel: 88, confidenceTrend: "up", recoveryUrgency: "low", lastTested: "2026-05-17" },
      { id: "s-pacing", name: "Speech pacing (WPM control)", masteryLevel: 85, confidenceTrend: "stable", recoveryUrgency: "medium", lastTested: "2026-05-17" },
      { id: "s-hesitation", name: "Hesitation & filler control", masteryLevel: 87, confidenceTrend: "up", recoveryUrgency: "low", lastTested: "2026-05-15" }
    ]
  },
  {
    id: "listening",
    name: "Listening & Dictation",
    overallMastery: 88,
    subSkills: [
      { id: "l-phoneme-rec", name: "Phoneme recognition", masteryLevel: 90, confidenceTrend: "stable", recoveryUrgency: "low", lastTested: "2026-05-16" },
      { id: "l-dictation", name: "Spelling & dictation accuracy", masteryLevel: 82, confidenceTrend: "down", recoveryUrgency: "high", lastTested: "2026-05-17" },
      { id: "l-numbers", name: "Numerical recognition", masteryLevel: 92, confidenceTrend: "up", recoveryUrgency: "low", lastTested: "2026-05-14" }
    ]
  },
  {
    id: "vocabulary",
    name: "Vocabulary Mastery",
    overallMastery: 85,
    subSkills: [
      { id: "v-recall", name: "Spaced recall retention", masteryLevel: 84, confidenceTrend: "stable", recoveryUrgency: "medium", lastTested: "2026-05-17" },
      { id: "v-academic", name: "Academic C1-C2 tier words", masteryLevel: 86, confidenceTrend: "up", recoveryUrgency: "low", lastTested: "2026-05-15" }
    ]
  }
];

export class SkillGraphManager {
  /**
   * Calculates the overall average mastery of a primary SkillNode based on its subskills.
   */
  static recalculateOverallMastery(node: SkillNode): number {
    if (node.subSkills.length === 0) return 0;
    const total = node.subSkills.reduce((acc, sub) => acc + sub.masteryLevel, 0);
    return Math.round(total / node.subSkills.length);
  }

  /**
   * Mutates the SkillGraph based on an learning signal (attempt response).
   */
  static processLearningSignal(
    graph: SkillNode[],
    subSkillId: string,
    score: number // 0 to 100
  ): SkillNode[] {
    return graph.map((node) => {
      const updatedSubskills = node.subSkills.map((sub) => {
        if (sub.id === subSkillId) {
          const oldLevel = sub.masteryLevel;
          const newLevel = Math.max(0, Math.min(100, Math.round(oldLevel * 0.7 + score * 0.3)));
          
          return {
            ...sub,
            masteryLevel: newLevel,
            confidenceTrend: newLevel > oldLevel ? "up" as const : newLevel < oldLevel ? "down" as const : "stable" as const,
            recoveryUrgency: newLevel < 80 ? "high" as const : newLevel < 90 ? "medium" as const : "low" as const,
            lastTested: new Date().toISOString().split("T")[0]
          };
        }
        return sub;
      });

      const updatedNode = { ...node, subSkills: updatedSubskills };
      return {
        ...updatedNode,
        overallMastery: this.recalculateOverallMastery(updatedNode)
      };
    });
  }
}
