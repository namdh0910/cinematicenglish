// Cinematic English Phase 6: Learning Intelligence Engine
import { SkillNode, SubSkill } from "@/lib/skill_graph";

export interface RecoveryMission {
  id: string;
  title: string;
  skillType: "speaking" | "listening" | "vocabulary" | "grammar";
  drillType: string;
  difficulty: "gentle" | "intense" | "mastery";
  emotionalIntensity: number; // 1-10
  recoveryValue: number; // expected XP or score boost
  priorityScore: number;
}

export class LearningIntelligenceEngine {
  
  /**
   * Calculates overall academic metrics.
   */
  static calculateAcademicMetrics(graph: SkillNode[]): {
    masteryScore: number;
    retentionScore: number;
    confidenceScore: number;
  } {
    let totalMastery = 0;
    let totalSubskills = 0;
    
    // Simple mock calculation mapping for spacing trends
    graph.forEach((node) => {
      node.subSkills.forEach((sub) => {
        totalMastery += sub.masteryLevel;
        totalSubskills++;
      });
    });

    const masteryScore = totalSubskills > 0 ? Math.round(totalMastery / totalSubskills) : 0;
    
    // Retention index mapping based on lastTested gaps
    const retentionScore = Math.max(50, Math.min(100, Math.round(masteryScore * 0.95)));
    
    // Vocal confidence mapping (linked to speaking subskills)
    const speakingNode = graph.find(n => n.id === "speaking");
    const confidenceScore = speakingNode ? Math.round(speakingNode.overallMastery * 1.05) : 80;

    return {
      masteryScore,
      retentionScore,
      confidenceScore: Math.min(100, confidenceScore)
    };
  }

  /**
   * Automatically isolates low-accuracy subskills and creates high-priority recovery drills.
   */
  static generateRecoveryDrills(graph: SkillNode[]): RecoveryMission[] {
    const weakSubskills: SubSkill[] = [];
    
    graph.forEach((node) => {
      node.subSkills.forEach((sub) => {
        if (sub.recoveryUrgency === "high" || sub.masteryLevel < 80) {
          weakSubskills.push(sub);
        }
      });
    });

    // Map weak subskills to premium recovery challenges
    return weakSubskills.map((sub, index) => {
      let title = `Focus: ${sub.name}`;
      let drillType = "Standard remediation";
      let skillType: "speaking" | "listening" | "vocabulary" | "grammar" = "speaking";

      if (sub.id.startsWith("s-")) {
        skillType = "speaking";
        if (sub.id.includes("phonemes")) {
          title = "Shadow the /θ/ sound cluster";
          drillType = "Phonemic drill";
        } else {
          title = "Rebuild speaking cadence rhythm";
          drillType = "Oral shadowing";
        }
      } else if (sub.id.startsWith("l-")) {
        skillType = "listening";
        title = "Recover numerical dictation accuracy";
        drillType = "Audio dictation sprint";
      } else {
        skillType = "vocabulary";
        title = "Resurface unstable academic words";
        drillType = "Spaced recall flashcards";
      }

      // Calculate priority score: Lower mastery and higher urgency increases priority
      const priorityScore = Math.round((100 - sub.masteryLevel) * (sub.recoveryUrgency === "high" ? 1.5 : 1.0));

      return {
        id: `rec-${sub.id}-${index}`,
        title,
        skillType,
        drillType,
        difficulty: sub.masteryLevel < 70 ? "intense" : "gentle",
        emotionalIntensity: sub.recoveryUrgency === "high" ? 8 : 5,
        recoveryValue: Math.round(priorityScore * 2.5),
        priorityScore
      } as RecoveryMission;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Adapts exam question thresholds based on current mastery profiles.
   */
  static calculateAdaptiveExamFactor(graph: SkillNode[]): {
    pacingWpmFactor: number;
    hintAccess: boolean;
    restorativeMode: boolean;
  } {
    const metrics = this.calculateAcademicMetrics(graph);
    
    // Burnout & stress mitigation triggers
    if (metrics.masteryScore < 70) {
      return {
        pacingWpmFactor: 0.85, // reduce WPM pacing pressure
        hintAccess: true,      // supply adaptive scaffolding hints
        restorativeMode: true  // prioritize confidence rebuilding
      };
    }
    
    // High-performance stretch triggers
    return {
      pacingWpmFactor: 1.15, // raise pressure
      hintAccess: false,     // strip secondary helpers
      restorativeMode: false
    };
  }
}
