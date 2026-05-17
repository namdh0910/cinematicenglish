// Cinematic English Phase 15: Context-Aware Smart Reminders Generator

export interface StudentContextProfile {
  weakSkillId: string;
  weakSkillName: string;
  hasUnfinishedSession: boolean;
  unfinishedLessonTitle?: string;
  daysSinceLastActive: number;
  burnoutRiskLevel: "Low" | "Medium" | "High";
}

export class SmartRemindersEngine {
  
  /**
   * Generates highly tailored, non-generic reminder notifications 
   * targeting student habit restoration loops.
   */
  static generateContextReminder(profile: StudentContextProfile): {
    notificationTitle: string;
    notificationBody: string;
    priorityWeight: number; // 0 - 100 scale
    targetRoute: string;
  } {
    // 1. High Priority: Unfinished session resumption
    if (profile.hasUnfinishedSession && profile.unfinishedLessonTitle) {
      return {
        notificationTitle: "Resume your progress ⚡",
        notificationBody: `Pick up right where you left off on "${profile.unfinishedLessonTitle}". Just one tap to continue.`,
        priorityWeight: 95,
        targetRoute: "/dashboard"
      };
    }

    // 2. High Priority: Spaced Repetition Critical timing (Inactive > 2 days)
    if (profile.daysSinceLastActive >= 3) {
      return {
        notificationTitle: "Spaced retrieval cue 🧠",
        notificationBody: `Memory decay is starting for your "${profile.weakSkillName}" skill. Secure your retention now in 2 mins.`,
        priorityWeight: 90,
        targetRoute: "/practice"
      };
    }

    // 3. Medium Priority: Weakness Recovery drills
    if (profile.weakSkillId) {
      return {
        notificationTitle: "Targeted skill recovery 🎯",
        notificationBody: `We detected a quick 3-question drill to level up your "${profile.weakSkillName}" mastery. Let's do it!`,
        priorityWeight: 80,
        targetRoute: "/practice"
      };
    }

    // 4. Low Priority: Burnout Recovery cooldown
    if (profile.burnoutRiskLevel === "High") {
      return {
        notificationTitle: "Mindful break recommended 🧘",
        notificationBody: "Great work this week. Rest your voice today—active retention requires structural pause windows.",
        priorityWeight: 50,
        targetRoute: "/dashboard"
      };
    }

    return {
      notificationTitle: "Ready for your daily ritual?",
      notificationBody: "A quick 2-minute practice sprint is waiting for you to keep your momentum active.",
      priorityWeight: 40,
      targetRoute: "/practice"
    };
  }
}
