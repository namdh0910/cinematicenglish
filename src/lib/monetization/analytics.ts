/**
 * Monetization Analytics Tracker
 * 
 * Tracks paywall hits, upgrade prompts, quota exhaustion, and feature usage
 * for conversion rate optimization.
 * 
 * Writes to: Supabase table `monetization_events`
 */

export type MonetizationEventType =
  | 'paywall_hit'
  | 'upgrade_prompt_shown'
  | 'upgrade_cta_clicked'
  | 'quota_exhausted'
  | 'feature_usage'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'subscription_canceled'
  | 'checkout_started'
  | 'checkout_completed';

export interface MonetizationEvent {
  event_type: MonetizationEventType;
  user_id?: string;
  plan?: string;
  feature?: string;
  quota_type?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ─── CLIENT-SIDE TRACKING ─────────────────────────────────────────────────────
// These functions fire analytics events from client components via a lightweight API route.

/**
 * trackMonetizationEvent
 * Fires a client-side monetization analytics event via /api/analytics/monetization
 */
export async function trackMonetizationEvent(event: Omit<MonetizationEvent, 'timestamp'>): Promise<void> {
  try {
    await fetch('/api/analytics/monetization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
    });
  } catch {
    // Non-blocking: analytics failure should never block user experience
  }
}

export function trackPaywallHit(feature: string, plan: string, userId?: string) {
  return trackMonetizationEvent({ event_type: 'paywall_hit', feature, plan, user_id: userId });
}

export function trackUpgradePromptShown(feature: string, plan: string, userId?: string) {
  return trackMonetizationEvent({ event_type: 'upgrade_prompt_shown', feature, plan, user_id: userId });
}

export function trackUpgradeCTAClicked(feature: string, plan: string, userId?: string) {
  return trackMonetizationEvent({ event_type: 'upgrade_cta_clicked', feature, plan, user_id: userId });
}

export function trackQuotaExhausted(quotaType: string, plan: string, userId?: string) {
  return trackMonetizationEvent({ event_type: 'quota_exhausted', quota_type: quotaType, plan, user_id: userId });
}

export function trackFeatureUsage(feature: string, plan: string, userId?: string) {
  return trackMonetizationEvent({ event_type: 'feature_usage', feature, plan, user_id: userId });
}

// ─── SERVER-SIDE TRACKING ─────────────────────────────────────────────────────

/**
 * trackServerMonetizationEvent
 * Writes a monetization event directly to Supabase from a Server Action or API route.
 */
export async function trackServerMonetizationEvent(
  event: Omit<MonetizationEvent, 'timestamp'>,
): Promise<void> {
  try {
    const { createSupabaseServerClient } = await import('../supabase/server');
    const supabase = await createSupabaseServerClient();
    await supabase.from('monetization_events').insert({
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Non-blocking
  }
}
