-- Create scan configurations table
CREATE TABLE IF NOT EXISTS public.scan_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('passive', 'active-light', 'active-full')),
  config_data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.targets(id) ON DELETE CASCADE,
  config_id UUID REFERENCES public.scan_configs(id),
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  profile_type TEXT NOT NULL CHECK (profile_type IN ('passive', 'active-light', 'active-full')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT,
  total_steps INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  scan_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scan results table
CREATE TABLE IF NOT EXISTS public.scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  technical_details JSONB DEFAULT '{}',
  affected_urls TEXT[],
  cvss_score DECIMAL(3,1),
  cve_ids TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scan logs table for progress tracking
CREATE TABLE IF NOT EXISTS public.scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'debug')),
  message TEXT NOT NULL,
  step_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scan_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scan_configs (public read, admin write)
CREATE POLICY "scan_configs_select_all" ON public.scan_configs FOR SELECT TO authenticated USING (TRUE);

-- RLS Policies for scans
CREATE POLICY "scans_select_own" ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scans_insert_own" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scans_update_own" ON public.scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "scans_delete_own" ON public.scans FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for scan results
CREATE POLICY "scan_results_select_own" ON public.scan_results 
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.scans WHERE id = scan_id));
CREATE POLICY "scan_results_insert_own" ON public.scan_results 
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.scans WHERE id = scan_id));

-- RLS Policies for scan logs
CREATE POLICY "scan_logs_select_own" ON public.scan_logs 
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.scans WHERE id = scan_id));
CREATE POLICY "scan_logs_insert_own" ON public.scan_logs 
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.scans WHERE id = scan_id));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_target_id ON public.scans(target_id);
CREATE INDEX IF NOT EXISTS idx_scans_status ON public.scans(status);
CREATE INDEX IF NOT EXISTS idx_scan_results_scan_id ON public.scan_results(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_severity ON public.scan_results(severity);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scan_id ON public.scan_logs(scan_id);
