/**
 * Cinematic English — Core Monetization & Entitlements Engine
 * 
 * This is the single source of truth for:
 * - User roles and permissions
 * - Subscription plans and entitlements
 * - Usage quota enforcement
 * - Paywall logic
 */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type UserRole = 'guest' | 'student' | 'teacher' | 'admin';

export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'school';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

export type Entitlement =
  | 'unlimited_speaking'
  | 'ai_conversation'
  | 'classroom_creation'
  | 'export_csv'
  | 'offline_download'
  | 'advanced_analytics'
  | 'custom_ai_characters'
  | 'priority_processing'
  | 'spaced_repetition'
  | 'team_dashboard'
  | 'multi_teacher'
  | 'school_analytics'
  | 'centralized_reporting';

export interface QuotaUsage {
  speaking_today: number;
  conversation_minutes_today: number;
  lessons_accessed_today: number;
  quota_reset_at: string; // ISO date string
}

export interface UserSubscription {
  id: string;
  role: UserRole;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  email?: string;
  display_name?: string;
  quota: QuotaUsage;
  entitlements: Set<Entitlement>;
  team_id?: string;
}

// ─── PLAN DEFINITIONS ─────────────────────────────────────────────────────────

export const PLAN_QUOTAS: Record<SubscriptionPlan, {
  maxDailySpeaking: number;
  maxDailyConversationMinutes: number;
  maxDailyLessons: number;
  maxTeamSize: number;
}> = {
  free: {
    maxDailySpeaking: 5,
    maxDailyConversationMinutes: 10,
    maxDailyLessons: 3,
    maxTeamSize: 1,
  },
  pro: {
    maxDailySpeaking: Infinity,
    maxDailyConversationMinutes: Infinity,
    maxDailyLessons: Infinity,
    maxTeamSize: 1,
  },
  team: {
    maxDailySpeaking: Infinity,
    maxDailyConversationMinutes: Infinity,
    maxDailyLessons: Infinity,
    maxTeamSize: 10,
  },
  school: {
    maxDailySpeaking: Infinity,
    maxDailyConversationMinutes: Infinity,
    maxDailyLessons: Infinity,
    maxTeamSize: Infinity,
  },
};

export const PLAN_ENTITLEMENTS: Record<SubscriptionPlan, Entitlement[]> = {
  free: [
    'ai_conversation',
  ],
  pro: [
    'unlimited_speaking',
    'ai_conversation',
    'offline_download',
    'spaced_repetition',
    'priority_processing',
  ],
  team: [
    'unlimited_speaking',
    'ai_conversation',
    'offline_download',
    'spaced_repetition',
    'priority_processing',
    'classroom_creation',
    'team_dashboard',
    'export_csv',
    'advanced_analytics',
    'custom_ai_characters',
  ],
  school: [
    'unlimited_speaking',
    'ai_conversation',
    'offline_download',
    'spaced_repetition',
    'priority_processing',
    'classroom_creation',
    'team_dashboard',
    'export_csv',
    'advanced_analytics',
    'custom_ai_characters',
    'multi_teacher',
    'school_analytics',
    'centralized_reporting',
  ],
};

// Admin and teacher bypass overrides
export const ROLE_ENTITLEMENT_OVERRIDES: Partial<Record<UserRole, Entitlement[]>> = {
  admin: [
    'unlimited_speaking', 'ai_conversation', 'classroom_creation', 'export_csv',
    'offline_download', 'advanced_analytics', 'custom_ai_characters',
    'priority_processing', 'spaced_repetition', 'team_dashboard',
    'multi_teacher', 'school_analytics', 'centralized_reporting',
  ],
  teacher: [
    'unlimited_speaking', 'ai_conversation', 'classroom_creation',
    'team_dashboard', 'advanced_analytics', 'export_csv',
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getEntitlementsForPlan(plan: SubscriptionPlan, role: UserRole): Set<Entitlement> {
  const override = ROLE_ENTITLEMENT_OVERRIDES[role];
  if (override) return new Set(override);
  return new Set(PLAN_ENTITLEMENTS[plan] || PLAN_ENTITLEMENTS.free);
}

export function hasEntitlement(entitlements: Set<Entitlement>, feature: Entitlement): boolean {
  return entitlements.has(feature);
}

export function getQuotaForPlan(plan: SubscriptionPlan) {
  return PLAN_QUOTAS[plan] || PLAN_QUOTAS.free;
}

// ─── UPGRADE PROMPTS (Vietnamese) ─────────────────────────────────────────────

export const UPGRADE_PROMPTS: Record<string, { title: string; message: string; cta: string }> = {
  speaking_quota: {
    title: 'Hết lượt luyện phát âm hôm nay',
    message: 'Bạn đã sử dụng hết 5 lượt luyện phát âm miễn phí hôm nay. Nâng cấp Pro để luyện không giới hạn.',
    cta: 'Nâng cấp Pro ngay',
  },
  conversation_quota: {
    title: 'Hết thời gian trò chuyện AI hôm nay',
    message: 'Bạn đã dùng hết 10 phút trò chuyện AI miễn phí hôm nay. Nâng cấp để học không giới hạn.',
    cta: 'Nâng cấp Pro ngay',
  },
  lesson_quota: {
    title: 'Hết bài học miễn phí hôm nay',
    message: 'Bạn đã học 3 bài miễn phí hôm nay. Nâng cấp Pro để truy cập toàn bộ nội dung.',
    cta: 'Nâng cấp Pro ngay',
  },
  offline_download: {
    title: 'Tính năng chỉ dành cho Pro',
    message: 'Tải xuống nội dung học offline là tính năng độc quyền của gói Pro.',
    cta: 'Dùng thử Pro miễn phí 7 ngày',
  },
  advanced_analytics: {
    title: 'Phân tích nâng cao',
    message: 'Báo cáo chi tiết và phân tích học tập nâng cao dành cho gói Pro trở lên.',
    cta: 'Nâng cấp để mở khóa',
  },
  classroom_creation: {
    title: 'Tạo lớp học',
    message: 'Tạo và quản lý lớp học yêu cầu gói Team hoặc School.',
    cta: 'Xem gói cho nhóm',
  },
  custom_ai_characters: {
    title: 'Nhân vật AI tùy chỉnh',
    message: 'Tạo nhân vật AI học thuật tùy chỉnh là tính năng cao cấp dành riêng cho gói Team+.',
    cta: 'Nâng cấp Team',
  },
  guest: {
    title: 'Đăng nhập để tiếp tục',
    message: 'Tạo tài khoản miễn phí để truy cập toàn bộ bài học và tính năng AI.',
    cta: 'Đăng ký miễn phí',
  },
};

export function getUpgradePrompt(reason: string) {
  return UPGRADE_PROMPTS[reason] || {
    title: 'Tính năng Premium',
    message: 'Tính năng này yêu cầu nâng cấp gói dịch vụ.',
    cta: 'Xem các gói dịch vụ',
  };
}
