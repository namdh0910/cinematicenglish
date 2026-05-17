/**
 * Billing Abstraction Layer
 * 
 * Provides a unified interface for all payment providers.
 * Currently architected but NOT fully integrated — ready for Stripe, MoMo, ZaloPay, QR Banking.
 * 
 * To activate a provider: implement the BillingProvider interface and register it below.
 */

export type BillingProvider = 'stripe' | 'momo' | 'zalopay' | 'qr_banking';

export type Currency = 'USD' | 'VND';

export interface PricingTier {
  plan: 'pro' | 'team' | 'school';
  name: string;
  nameVi: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: Currency;
  features: string[];
  featuresVi: string[];
  maxUsers?: number;
}

export interface CheckoutSession {
  provider: BillingProvider;
  sessionId: string;
  checkoutUrl: string;
  plan: string;
  userId: string;
  expiresAt: number;
}

export interface WebhookEvent {
  provider: BillingProvider;
  type: 'subscription.created' | 'subscription.updated' | 'subscription.canceled' | 'payment.succeeded' | 'payment.failed';
  userId: string;
  plan: string;
  status: string;
  metadata?: Record<string, string>;
}

// ─── PRICING TIERS ────────────────────────────────────────────────────────────

export const PRICING_TIERS: PricingTier[] = [
  {
    plan: 'pro',
    name: 'Pro',
    nameVi: 'Học Viên Pro',
    priceMonthly: 9.99,
    priceAnnual: 7.99,
    currency: 'USD',
    features: [
      'Unlimited AI speaking sessions',
      'Full pronunciation coaching',
      'Unlimited AI conversation',
      'Offline downloads',
      'Spaced repetition system',
      'Priority processing',
    ],
    featuresVi: [
      'Luyện phát âm AI không giới hạn',
      'Huấn luyện phát âm toàn diện',
      'Trò chuyện AI không giới hạn',
      'Tải về học offline',
      'Hệ thống ôn tập thông minh',
      'Xử lý ưu tiên',
    ],
  },
  {
    plan: 'team',
    name: 'Team',
    nameVi: 'Nhóm học',
    priceMonthly: 49.99,
    priceAnnual: 39.99,
    currency: 'USD',
    maxUsers: 10,
    features: [
      'Everything in Pro',
      'Up to 10 users',
      'Group dashboard',
      'Team analytics',
      'Classroom creation',
      'CSV export',
      'Custom AI characters',
    ],
    featuresVi: [
      'Tất cả tính năng Pro',
      'Tối đa 10 người dùng',
      'Bảng điều khiển nhóm',
      'Phân tích nhóm',
      'Tạo lớp học',
      'Xuất dữ liệu CSV',
      'Nhân vật AI tùy chỉnh',
    ],
  },
  {
    plan: 'school',
    name: 'School',
    nameVi: 'Trường học',
    priceMonthly: 199.99,
    priceAnnual: 159.99,
    currency: 'USD',
    features: [
      'Everything in Team',
      'Unlimited users',
      'Multi-teacher management',
      'School-wide analytics',
      'Centralized reporting',
      'Priority support',
    ],
    featuresVi: [
      'Tất cả tính năng Team',
      'Không giới hạn người dùng',
      'Quản lý đa giáo viên',
      'Phân tích toàn trường',
      'Báo cáo tập trung',
      'Hỗ trợ ưu tiên',
    ],
  },
];

// ─── PROVIDER INTERFACE ───────────────────────────────────────────────────────

export interface IBillingProvider {
  createCheckoutSession(params: {
    userId: string;
    plan: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;

  createPortalSession(params: {
    userId: string;
    returnUrl: string;
  }): Promise<{ url: string }>;

  handleWebhook(payload: string, signature: string): Promise<WebhookEvent | null>;

  cancelSubscription(subscriptionId: string): Promise<void>;
}

// ─── STUB IMPLEMENTATIONS (ready to wire in real provider) ───────────────────

class StripeBillingProvider implements IBillingProvider {
  async createCheckoutSession(params: { userId: string; plan: string; successUrl: string; cancelUrl: string }): Promise<CheckoutSession> {
    // TODO: Integrate Stripe SDK
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({ ... });
    throw new Error('Stripe not yet configured. Set STRIPE_SECRET_KEY in .env.local');
  }

  async createPortalSession(params: { userId: string; returnUrl: string }): Promise<{ url: string }> {
    throw new Error('Stripe not yet configured.');
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    // TODO: stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    return null;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    throw new Error('Stripe not yet configured.');
  }
}

class MomoBillingProvider implements IBillingProvider {
  async createCheckoutSession(params: { userId: string; plan: string; successUrl: string; cancelUrl: string }): Promise<CheckoutSession> {
    // TODO: Integrate MoMo Payment Gateway API
    // Docs: https://developers.momo.vn/
    throw new Error('MoMo not yet configured. Set MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY in .env.local');
  }

  async createPortalSession(params: { userId: string; returnUrl: string }): Promise<{ url: string }> {
    throw new Error('MoMo does not support customer portal.');
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    return null;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    throw new Error('MoMo not yet configured.');
  }
}

class ZaloPayBillingProvider implements IBillingProvider {
  async createCheckoutSession(params: { userId: string; plan: string; successUrl: string; cancelUrl: string }): Promise<CheckoutSession> {
    // TODO: Integrate ZaloPay API
    // Docs: https://docs.zalopay.vn/
    throw new Error('ZaloPay not yet configured. Set ZALOPAY_APP_ID, ZALOPAY_KEY1, ZALOPAY_KEY2 in .env.local');
  }

  async createPortalSession(params: { userId: string; returnUrl: string }): Promise<{ url: string }> {
    throw new Error('ZaloPay does not support customer portal.');
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    return null;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    throw new Error('ZaloPay not yet configured.');
  }
}

// ─── PROVIDER REGISTRY ───────────────────────────────────────────────────────

const PROVIDERS: Record<BillingProvider, IBillingProvider> = {
  stripe: new StripeBillingProvider(),
  momo: new MomoBillingProvider(),
  zalopay: new ZaloPayBillingProvider(),
  qr_banking: {
    // QR banking is handled differently — static QR code generation
    async createCheckoutSession(params) {
      // TODO: Generate VietQR-compatible QR code
      // Docs: https://www.vietqr.io/
      throw new Error('QR Banking not yet configured. Set VIETQR_BANK_ID, VIETQR_ACCOUNT_NO in .env.local');
    },
    async createPortalSession() { throw new Error('QR Banking does not support customer portal.'); },
    async handleWebhook() { return null; },
    async cancelSubscription() { throw new Error('QR Banking does not support automated cancellation.'); },
  },
};

/**
 * getBillingProvider
 * Returns the active billing provider based on environment config.
 * Defaults to Stripe if BILLING_PROVIDER env var is not set.
 */
export function getBillingProvider(): IBillingProvider {
  const providerKey = (process.env.BILLING_PROVIDER as BillingProvider) || 'stripe';
  return PROVIDERS[providerKey] || PROVIDERS.stripe;
}

/**
 * getActiveProvider
 * Returns the BillingProvider key currently configured.
 */
export function getActiveProviderKey(): BillingProvider {
  return (process.env.BILLING_PROVIDER as BillingProvider) || 'stripe';
}
