// Cinematic English Phase 10: Learning Event Pipeline & Ingestion System

export type LearningEventType =
  | "listening_completed"
  | "dictation_failed"
  | "pronunciation_weakness_detected"
  | "assignment_submitted"
  | "rapid_practice_completed"
  | "streak_lost"
  | "recovery_drill_completed"
  | "speaking_recorded"
  | "CEFR_level_up";

export interface LearningEvent {
  id: string;
  userId: string;
  classroomId?: string;
  eventType: LearningEventType;
  skillId: string; // e.g. "s-phonemes" or "v-recall"
  metadata: Record<string, any>;
  timestamp: string; // ISO format
  aiConfidenceScore: number; // 0.0 - 1.0 (indicating confidence of the detection)
}

export class LearningEventPipeline {
  private static eventsLog: LearningEvent[] = [];

  /**
   * Primary ingestion endpoint for all academic progress signals.
   * Dispatches event to listeners (e.g. Skill Graph updater, spaced repetition tracker).
   */
  static ingestEvent(event: Omit<LearningEvent, "id" | "timestamp">): LearningEvent {
    const fullEvent: LearningEvent = {
      ...event,
      id: `evt_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString()
    };

    this.eventsLog.push(fullEvent);

    // In a real production deployment, this triggers async background pub/sub workers:
    // e.g., dispatchToRedisQueue(fullEvent) or sendToSupabase(fullEvent)
    
    return fullEvent;
  }

  /**
   * Retrieves log logs filtered by user and timeframe.
   */
  static queryEvents(userId: string, type?: LearningEventType): LearningEvent[] {
    return this.eventsLog.filter((evt) => {
      const matchUser = evt.userId === userId;
      const matchType = type ? evt.eventType === type : true;
      return matchUser && matchType;
    });
  }

  /**
   * Dumps entire active pipeline buffer.
   */
  static getBuffer(): LearningEvent[] {
    return this.eventsLog;
  }

  /**
   * Clear active pipeline buffer.
   */
  static clearBuffer() {
    this.eventsLog = [];
  }
}
