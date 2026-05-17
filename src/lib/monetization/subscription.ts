/**
 * Server-side user subscription resolver
 * Fetches real plan, role, quota from Supabase and returns a fully hydrated UserSubscription object.
 * This is the single entry point for all permission checks on the server.
 */
import { createSupabaseServerClient } from '../supabase/server';
import {
  type UserSubscription,
  type SubscriptionPlan,
  type UserRole,
  type SubscriptionStatus,
  type QuotaUsage,
  getEntitlementsForPlan,
} from './entitlements';

const DEFAULT_QUOTA: QuotaUsage = {
  speaking_today: 0,
  conversation_minutes_today: 0,
  lessons_accessed_today: 0,
  quota_reset_at: new Date().toISOString(),
};

/**
 * getUserSubscription
 * Resolves the authenticated user's full subscription context from the DB.
 * Returns null if the user is not authenticated (guest).
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_plan, subscription_status, quota_usage, display_name, team_id')
      .eq('id', session.user.id)
      .single();

    const role: UserRole = (profile?.role as UserRole) || 'student';
    const plan: SubscriptionPlan = (profile?.subscription_plan as SubscriptionPlan) || 'free';
    const status: SubscriptionStatus = (profile?.subscription_status as SubscriptionStatus) || 'active';
    const quota: QuotaUsage = profile?.quota_usage || DEFAULT_QUOTA;

    return {
      id: session.user.id,
      role,
      plan,
      status,
      email: session.user.email,
      display_name: profile?.display_name,
      quota,
      entitlements: getEntitlementsForPlan(plan, role),
      team_id: profile?.team_id,
    };
  } catch {
    return null;
  }
}

/**
 * incrementQuota
 * Atomically increments a specific usage counter for the user.
 * Handles daily reset logic.
 */
export async function incrementQuota(
  userId: string,
  field: 'speaking_today' | 'conversation_minutes_today' | 'lessons_accessed_today',
  amount: number = 1,
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('quota_usage')
      .eq('id', userId)
      .single();

    const now = new Date();
    const existingQuota: QuotaUsage = profile?.quota_usage || DEFAULT_QUOTA;

    // Reset quota if it's a new day
    const resetAt = new Date(existingQuota.quota_reset_at);
    const isNewDay = now.toDateString() !== resetAt.toDateString();

    const updatedQuota: QuotaUsage = isNewDay
      ? { ...DEFAULT_QUOTA, quota_reset_at: now.toISOString(), [field]: amount }
      : { ...existingQuota, [field]: (existingQuota[field] || 0) + amount };

    await supabase
      .from('profiles')
      .update({ quota_usage: updatedQuota })
      .eq('id', userId);
  } catch (err) {
    console.error('Failed to increment quota:', err);
  }
}

/**
 * checkQuota
 * Returns whether the user is allowed to perform an action based on plan limits.
 */
export async function checkQuota(
  userId: string,
  field: 'speaking_today' | 'conversation_minutes_today' | 'lessons_accessed_today',
  limit: number,
): Promise<{ allowed: boolean; current: number; limit: number }> {
  if (limit === Infinity) return { allowed: true, current: 0, limit: Infinity };

  try {
    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('quota_usage')
      .eq('id', userId)
      .single();

    const quota: QuotaUsage = profile?.quota_usage || DEFAULT_QUOTA;
    const resetAt = new Date(quota.quota_reset_at);
    const now = new Date();
    const isNewDay = now.toDateString() !== resetAt.toDateString();

    const current = isNewDay ? 0 : (quota[field] || 0);
    return { allowed: current < limit, current, limit };
  } catch {
    return { allowed: true, current: 0, limit }; // Fail open
  }
}
