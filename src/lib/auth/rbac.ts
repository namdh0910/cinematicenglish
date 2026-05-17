import { createSupabaseServerClient } from '../supabase/server';

export type UserRole = 'guest' | 'student' | 'teacher' | 'admin';
export type UserPlan = 'free' | 'pro';

export interface UserProfile {
  id: string;
  role: UserRole;
  plan: UserPlan;
  email?: string;
  display_name?: string;
}

export const PLAN_LIMITS = {
  free: {
    maxDailySpeakingAttempts: 5,
    maxConversationMinutes: 15,
    hasAdvancedAnalytics: false,
    hasSpacedRepetition: false,
  },
  pro: {
    maxDailySpeakingAttempts: Infinity,
    maxConversationMinutes: Infinity,
    hasAdvancedAnalytics: true,
    hasSpacedRepetition: true,
  }
};

export function getFeatureEntitlements(plan: UserPlan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, plan, display_name')
    .eq('id', session.user.id)
    .single();

  if (profile) {
    return {
      id: session.user.id,
      role: profile.role || 'student',
      plan: profile.plan || 'free',
      email: session.user.email,
      display_name: profile.display_name,
    };
  }

  // Fallback if profile doesn't exist yet but user is logged in
  return {
    id: session.user.id,
    role: 'student',
    plan: 'free',
    email: session.user.email,
  };
}

export async function checkFeatureAccess(feature: keyof typeof PLAN_LIMITS.free): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.role === 'admin' || profile.role === 'teacher') return true; // Admins and teachers bypass limits
  
  const entitlements = getFeatureEntitlements(profile.plan);
  return entitlements[feature] as boolean;
}

export async function checkSpeakingQuota(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const profile = await getCurrentProfile();
  if (!profile) return { allowed: false, reason: 'Phiên đăng nhập đã hết hạn.' };
  if (profile.role === 'admin' || profile.role === 'teacher') return { allowed: true };
  
  const limits = getFeatureEntitlements(profile.plan);
  if (limits.maxDailySpeakingAttempts === Infinity) return { allowed: true };

  // Count submissions in storage today for this user
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from('speaking-submissions')
    .list(`submissions/${userId}`);
    
  if (error || !data) return { allowed: true }; // Fail open
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayFiles = data.filter(f => f.created_at ? new Date(f.created_at) >= today : false);
  
  if (todayFiles.length >= limits.maxDailySpeakingAttempts) {
    return { 
      allowed: false, 
      reason: `Gói Học viên Free giới hạn ${limits.maxDailySpeakingAttempts} lần chấm điểm phát âm mỗi ngày. Nâng cấp Pro để luyện tập không giới hạn!` 
    };
  }
  
  return { allowed: true };
}
