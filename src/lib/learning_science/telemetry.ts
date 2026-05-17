// Cinematic English Phase 12: Learning Telemetry Ingestion Core

export type TelemetryMetricType =
  | "hesitation_rate"
  | "replay_frequency"
  | "speaking_retry_loops"
  | "burnout_indicator"
  | "memory_decay_signal"
  | "confidence_drift"
  | "session_abandonment";

export interface TelemetryPayload {
  id: string;
  userId: string;
  metricType: TelemetryMetricType;
  value: number; // e.g. seconds of hesitation, retry counts, or decay ratios
  metadata: Record<string, any>;
  timestamp: string; // ISO date
}

export class LearningTelemetryCore {
  private static telemetryBuffer: TelemetryPayload[] = [];

  /**
   * Captures high-frequency scientific telemetry signals from the learning loop.
   */
  static trackTelemetry(
    userId: string,
    metricType: TelemetryMetricType,
    value: number,
    metadata: Record<string, any> = {}
  ): TelemetryPayload {
    const payload: TelemetryPayload = {
      id: `tel_${Math.random().toString(36).substring(2, 11)}`,
      userId,
      metricType,
      value,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.telemetryBuffer.push(payload);

    // In production environments, this pipes straight to ClickHouse, BigQuery, or timeseries stores
    return payload;
  }

  /**
   * Returns active telemetry buffer for aggregation processing.
   */
  static getBuffer(): TelemetryPayload[] {
    return this.telemetryBuffer;
  }

  /**
   * Resets active buffer after batch uploads.
   */
  static flushBuffer() {
    this.telemetryBuffer = [];
  }
}
