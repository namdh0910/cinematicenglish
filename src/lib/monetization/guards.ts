/**
 * Server-side paywall enforcement guards
 * 
 * These functions are called inside Server Actions and API routes.
 * They perform the REAL backend enforcement — not just UI hiding.
 * 
 * Pattern: Call enforceXxx() at the start of any sensitive server action.
 * It throws a PaywallError which the calling action catches and returns as a gated response.
 */

import { getUserSubscription, checkQuota, incrementQuota } from './subscription';
import { getQuotaForPlan, hasEntitlement, type Entitlement, getUpgradePrompt } from './entitlements';
import { trackServerMonetizationEvent } from './analytics';

// ─── PAYWALL ERROR ─────────────────────────────────────────────────────────────

export class PaywallError extends Error {
  public readonly reason: string;
  public readonly upgradePrompt: { title: string; message: string; cta: string };
  public readonly requiresPlan?: string;

  constructor(reason: string, requiresPlan?: string) {
    const prompt = getUpgradePrompt(reason);
    super(prompt.message);
    this.name = 'PaywallError';
    this.reason = reason;
    this.upgradePrompt = prompt;
    this.requiresPlan = requiresPlan;
  }
}

// ─── ENFORCEMENT GUARDS ───────────────────────────────────────────────────────

/**
 * enforceAuth
 * Throws if user is not authenticated. Use at start of any auth-required action.
 */
export async function enforceAuth() {
  const sub = await getUserSubscription();
  if (!sub) {
    await trackServerMonetizationEvent({ event_type: 'paywall_hit', feature: 'auth', plan: 'guest' });
    throw new PaywallError('guest');
  }
  return sub;
}

/**
 * enforceEntitlement
 * Throws if user's plan does not include the required entitlement.
 */
export async function enforceEntitlement(feature: Entitlement, requiredPlan?: string) {
  const sub = await enforceAuth();
  if (!hasEntitlement(sub.entitlements, feature)) {
    await trackServerMonetizationEvent({
      event_type: 'paywall_hit',
      feature,
      plan: sub.plan,
      user_id: sub.id,
    });
    throw new PaywallError(feature, requiredPlan);
  }
  return sub;
}

/**
 * enforceSpeakingQuota
 * Checks and enforces the daily speaking attempt limit.
 * If allowed, atomically increments the counter.
 */
export async function enforceSpeakingQuota() {
  const sub = await enforceAuth();
  const quotaLimits = getQuotaForPlan(sub.plan);

  // Admins and teachers are never quota-limited
  if (sub.role === 'admin' || sub.role === 'teacher') return sub;

  // Pro plan has Infinity — skip DB check
  if (quotaLimits.maxDailySpeaking === Infinity) return sub;

  const quotaCheck = await checkQuota(sub.id, 'speaking_today', quotaLimits.maxDailySpeaking);

  if (!quotaCheck.allowed) {
    await trackServerMonetizationEvent({
      event_type: 'quota_exhausted',
      quota_type: 'speaking_today',
      plan: sub.plan,
      user_id: sub.id,
      metadata: { current: quotaCheck.current, limit: quotaCheck.limit },
    });
    throw new PaywallError('speaking_quota', 'pro');
  }

  // Increment on success
  await incrementQuota(sub.id, 'speaking_today');
  return sub;
}

/**
 * enforceConversationQuota
 * Checks daily AI conversation minutes limit.
 */
export async function enforceConversationQuota(minutesToAdd: number = 1) {
  const sub = await enforceAuth();
  const quotaLimits = getQuotaForPlan(sub.plan);

  if (sub.role === 'admin' || sub.role === 'teacher') return sub;
  if (quotaLimits.maxDailyConversationMinutes === Infinity) return sub;

  const quotaCheck = await checkQuota(sub.id, 'conversation_minutes_today', quotaLimits.maxDailyConversationMinutes);

  if (!quotaCheck.allowed) {
    await trackServerMonetizationEvent({
      event_type: 'quota_exhausted',
      quota_type: 'conversation_minutes_today',
      plan: sub.plan,
      user_id: sub.id,
    });
    throw new PaywallError('conversation_quota', 'pro');
  }

  await incrementQuota(sub.id, 'conversation_minutes_today', minutesToAdd);
  return sub;
}

/**
 * enforceLessonQuota
 * Checks daily lesson access limit.
 */
export async function enforceLessonQuota() {
  const sub = await enforceAuth();
  const quotaLimits = getQuotaForPlan(sub.plan);

  if (sub.role === 'admin' || sub.role === 'teacher') return sub;
  if (quotaLimits.maxDailyLessons === Infinity) return sub;

  const quotaCheck = await checkQuota(sub.id, 'lessons_accessed_today', quotaLimits.maxDailyLessons);

  if (!quotaCheck.allowed) {
    await trackServerMonetizationEvent({
      event_type: 'quota_exhausted',
      quota_type: 'lessons_accessed_today',
      plan: sub.plan,
      user_id: sub.id,
    });
    throw new PaywallError('lesson_quota', 'pro');
  }

  await incrementQuota(sub.id, 'lessons_accessed_today');
  return sub;
}

/**
 * enforceRole
 * Throws if user's role doesn't meet minimum role requirement.
 */
export async function enforceRole(requiredRole: 'teacher' | 'admin') {
  const sub = await enforceAuth();
  const roleHierarchy = { guest: 0, student: 1, teacher: 2, admin: 3 };
  if (roleHierarchy[sub.role] < roleHierarchy[requiredRole]) {
    await trackServerMonetizationEvent({
      event_type: 'paywall_hit',
      feature: `role_${requiredRole}`,
      plan: sub.plan,
      user_id: sub.id,
    });
    throw new PaywallError(`role_${requiredRole}`);
  }
  return sub;
}

/**
 * paywallResult
 * Helper to convert a PaywallError into a standard gated action response.
 */
export function paywallResult(err: PaywallError) {
  return {
    success: false,
    gated: true,
    reason: err.reason,
    upgradePrompt: err.upgradePrompt,
    requiresPlan: err.requiresPlan,
  };
}
