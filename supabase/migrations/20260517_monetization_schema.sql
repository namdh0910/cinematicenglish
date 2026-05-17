-- ================================================================
-- Cinematic English — Monetization Database Schema
-- ================================================================
-- Run this in your Supabase SQL Editor to extend the platform
-- with full subscription, quota, and monetization tracking.
-- ================================================================

-- ─── EXTEND PROFILES TABLE ───────────────────────────────────────

-- Add subscription plan column
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_plan IN ('free', 'pro', 'team', 'school'));

-- Add subscription status column
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive'));

-- Add quota tracking (JSONB for flexible daily counter structure)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS quota_usage JSONB NOT NULL DEFAULT '{
    "speaking_today": 0,
    "conversation_minutes_today": 0,
    "lessons_accessed_today": 0,
    "quota_reset_at": "1970-01-01T00:00:00.000Z"
  }'::jsonb;

-- Add team membership
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- ─── TEAMS TABLE ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'team'
    CHECK (plan IN ('team', 'school')),
  max_members INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SUBSCRIPTIONS TABLE ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'momo', 'zalopay', 'qr_banking', 'manual')),
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'team', 'school')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_active_idx
  ON subscriptions (user_id)
  WHERE status IN ('active', 'trialing');

-- ─── MONETIZATION EVENTS TABLE ───────────────────────────────────

CREATE TABLE IF NOT EXISTS monetization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  plan TEXT,
  feature TEXT,
  quota_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS monetization_events_type_idx ON monetization_events (event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS monetization_events_user_idx ON monetization_events (user_id, timestamp DESC);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────

-- profiles: users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    -- Prevent users from elevating their own role or plan
    (role = (SELECT role FROM profiles WHERE id = auth.uid())) AND
    (subscription_plan = (SELECT subscription_plan FROM profiles WHERE id = auth.uid()))
  );

-- subscriptions: users can only read their own; only service_role can write
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- monetization_events: only service_role can write; users cannot read
ALTER TABLE monetization_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "monetization_events_admin_read" ON monetization_events;
CREATE POLICY "monetization_events_admin_read" ON monetization_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- teams: owners can manage their team
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teams_owner_manage" ON teams;
CREATE POLICY "teams_owner_manage" ON teams
  FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "teams_member_read" ON teams;
CREATE POLICY "teams_member_read" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND team_id = teams.id
    )
  );

-- ─── HELPER FUNCTIONS ────────────────────────────────────────────

-- Function: Admin can grant/revoke plans
CREATE OR REPLACE FUNCTION admin_set_user_plan(
  target_user_id UUID,
  new_plan TEXT,
  new_status TEXT DEFAULT 'active'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can call this
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  UPDATE profiles
  SET
    subscription_plan = new_plan,
    subscription_status = new_status
  WHERE id = target_user_id;
END;
$$;
