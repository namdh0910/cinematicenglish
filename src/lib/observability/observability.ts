/**
 * =========================================================================
 * CINEMATIC ENGLISH — LIGHTWEIGHT OBSERVABILITY & INSTRUMENTATION CORE
 * CLIENT-SIDE REAL-TIME METRICS TRACKING (PRODUCTION READY)
 * =========================================================================
 */

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

export type TelemetryEventType = 
  | 'crash' 
  | 'rage_click' 
  | 'hydration_error' 
  | 'latency' 
  | 'slow_interaction' 
  | 'abandonment'
  | 'speaking_started'
  | 'speaking_completed'
  | 'speaking_failed'
  | 'mic_permission_denied'
  | 'retry_recording'
  | 'upload_timeout'
  | 'guest_demo_started'
  | 'guest_demo_completed'
  | 'signup_started'
  | 'signup_completed'
  | 'classroom_joined'
  | 'lesson_resumed'
  | 'session_abandoned'
  | 'streak_saved'
  | 'reminder_clicked'
  | 'daily_return'
  | 'classroom_created'
  | 'assignment_dispatched'
  | 'csv_exported';

// External integration variables (Mocked fallback or active depending on credentials)
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let activeUserId: string | null = null;

/**
 * Update user context for telemetry logs
 */
export function setObservabilityUser(userId: string | null) {
  activeUserId = userId;
}

/**
 * Dispatch metric event to database and external telemetry pipelines
 */
export async function trackTelemetry(eventType: TelemetryEventType, metadata: Record<string, any> = {}) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'SSR';
  const timestamp = new Date().toISOString();
  
  const payload = {
    user_id: activeUserId,
    event_type: eventType,
    page_url: pageUrl,
    metadata: {
      ...metadata,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      timestamp
    }
  };

  // 1. Log to server console in dev
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Telemetry: ${eventType}]`, payload);
  }

  // 2. Persist directly to Supabase telemetry_events table
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from('telemetry_events')
      .insert(payload);
    
    if (error && process.env.NODE_ENV === 'development') {
      console.warn("Failed to persist telemetry event to database:", error.message);
    }
  } catch (err) {
    // Fail silently in production to avoid crashing page
  }

  // 3. Forward to Vercel Analytics / Sentry / PostHog if initialized
  if (SENTRY_DSN) {
    if (eventType === 'crash' || eventType === 'hydration_error' || eventType.includes('failed') || eventType.includes('timeout') || eventType === 'mic_permission_denied') {
      Sentry.captureMessage(`[${eventType}] ${metadata.message || metadata.errorMessage || 'Issue detected'}`, {
        extra: payload
      });
    }
  }
  if (POSTHOG_KEY && typeof window !== 'undefined') {
    posthog.capture(eventType, payload);
  }
}

/**
 * Initialize system-level global telemetry listeners
 */
export function initObservability() {
  if (typeof window === 'undefined') return;

  // Initialize Sentry
  if (SENTRY_DSN && !Sentry.isInitialized()) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.1, // low sampling
      debug: false,
    });
  }

  // Initialize PostHog
  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      autocapture: false, // Save bandwidth
      capture_pageview: false,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug(false);
      }
    });
  }

  // --- A. DETECT CRASHES & UNHANDLED EXCEPTIONS ---
  window.addEventListener('error', (event) => {
    trackTelemetry('crash', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || 'No stack trace available'
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackTelemetry('crash', {
      message: 'Unhandled Promise Rejection',
      reason: String(event.reason?.message || event.reason)
    });
  });

  // --- B. DETECT RAGE CLICKS (4 clicks in < 1.5 seconds on same element) ---
  let clickHistory: { target: HTMLElement; time: number }[] = [];
  window.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const now = Date.now();
    // Flush logs older than 2.0s
    clickHistory = clickHistory.filter(c => now - c.time < 2000);
    clickHistory.push({ target, time: now });

    // Verify if same target clicked repeatedly
    const matchingClicks = clickHistory.filter(c => c.target === target);
    if (matchingClicks.length >= 4) {
      trackTelemetry('rage_click', {
        elementTag: target.tagName,
        elementId: target.id || 'N/A',
        elementClass: target.className || 'N/A',
        innerText: target.innerText?.substring(0, 30) || 'N/A',
        clickCount: matchingClicks.length
      });
      // Clear to prevent double logs
      clickHistory = [];
    }
  });

  // --- C. DETECT HYDRATION MISMATCHES ---
  const originalError = console.error;
  console.error = function (...args) {
    const errorString = args.join(' ');
    if (
      errorString.includes('Hydration') || 
      errorString.includes('did not match') || 
      errorString.includes('Text content did not match')
    ) {
      trackTelemetry('hydration_error', {
        errorMessage: errorString.substring(0, 200),
        trace: new Error().stack?.substring(0, 300)
      });
    }
    originalError.apply(console, args);
  };

  // --- D. DETECT SLOW INTERACTIONS (INP > 200ms) ---
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          // Track inputs with duration over 200ms
          if (entry.duration > 200) {
            trackTelemetry('slow_interaction', {
              name: entry.name,
              entryType: entry.entryType,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
      });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'event', buffered: true });
    } catch (e) {
      // Browser doesn't fully support layout-shift / input metrics
    }
  }

  // --- E. ESTIMATE MOBILE SYSTEM LATENCY ---
  if (typeof navigator !== 'undefined' && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.rtt > 400) {
      trackTelemetry('latency', {
        rtt: conn.rtt, // Round Trip Time estimation
        effectiveType: conn.effectiveType, // '4g', '3g', etc.
        downlink: conn.downlink
      });
    }
  }
}
