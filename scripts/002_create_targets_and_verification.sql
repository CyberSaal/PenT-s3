-- Create targets table
CREATE TABLE IF NOT EXISTS public.targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  display_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'expired')),
  verification_method TEXT CHECK (verification_method IN ('dns', 'http', 'email')),
  verification_token TEXT,
  verification_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  last_scan_at TIMESTAMPTZ,
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create target verification attempts table
CREATE TABLE IF NOT EXISTS public.target_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID NOT NULL REFERENCES public.targets(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('dns', 'http', 'email')),
  token TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'expired')),
  verification_data JSONB,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for targets
CREATE POLICY "targets_select_own" ON public.targets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "targets_insert_own" ON public.targets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "targets_update_own" ON public.targets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "targets_delete_own" ON public.targets FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for target verifications
CREATE POLICY "target_verifications_select_own" ON public.target_verifications 
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.targets WHERE id = target_id));
CREATE POLICY "target_verifications_insert_own" ON public.target_verifications 
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.targets WHERE id = target_id));
CREATE POLICY "target_verifications_update_own" ON public.target_verifications 
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.targets WHERE id = target_id));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_targets_user_id ON public.targets(user_id);
CREATE INDEX IF NOT EXISTS idx_targets_domain ON public.targets(domain);
CREATE INDEX IF NOT EXISTS idx_target_verifications_target_id ON public.target_verifications(target_id);
