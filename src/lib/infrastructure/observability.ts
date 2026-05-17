// Cinematic English Phase 10: Audit Log & AI Decision Observability
import { LearningEvent } from "./learning_events";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetId?: string;
  status: "success" | "failure";
  latencyMs: number;
  timestamp: string;
}

export interface AIDecisionTrace {
  traceId: string;
  eventId: string;
  inputMetrics: Record<string, any>;
  decisionOutcome: string;
  modelRouteUsed: string;
  timestamp: string;
}

export class ObservabilityPipeline {
  private static auditLogs: AuditLogEntry[] = [];
  private static aiDecisionTraces: AIDecisionTrace[] = [];

  /**
   * Records details of system events for total audit trails.
   */
  static logSystemAction(
    actorId: string,
    action: string,
    targetId: string | undefined,
    status: "success" | "failure",
    latencyMs: number
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `aud_${Math.random().toString(36).substring(2, 11)}`,
      actorId,
      action,
      targetId,
      status,
      latencyMs,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.push(entry);
    return entry;
  }

  /**
   * Records decision outputs of active AI models to guarantee explainability.
   */
  static traceAIDecision(
    eventId: string,
    inputMetrics: Record<string, any>,
    decisionOutcome: string,
    modelRouteUsed: string
  ): AIDecisionTrace {
    const trace: AIDecisionTrace = {
      traceId: `trc_${Math.random().toString(36).substring(2, 11)}`,
      eventId,
      inputMetrics,
      decisionOutcome,
      modelRouteUsed,
      timestamp: new Date().toISOString()
    };

    this.aiDecisionTraces.push(trace);
    return trace;
  }

  /**
   * Retrieves log histories of audit logs.
   */
  static getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  /**
   * Retrieves log histories of AI decision traces.
   */
  static getAIDecisionTraces(): AIDecisionTrace[] {
    return this.aiDecisionTraces;
  }
}
