-- Insert default scan configurations
INSERT INTO public.scan_configs (name, description, profile_type, config_data, is_default) VALUES
(
  'Passive Scan',
  'Non-intrusive scanning that only observes and analyzes without active probing',
  'passive',
  '{
    "modules": ["ssl_analysis", "header_analysis", "dns_analysis", "port_scan_basic"],
    "timeout": 300,
    "concurrent_requests": 5,
    "follow_redirects": true,
    "max_depth": 3
  }',
  true
),
(
  'Active Light Scan',
  'Lightweight active scanning with minimal impact on target systems',
  'active-light',
  '{
    "modules": ["ssl_analysis", "header_analysis", "dns_analysis", "port_scan_basic", "vulnerability_scan_light", "web_app_scan_basic"],
    "timeout": 600,
    "concurrent_requests": 10,
    "follow_redirects": true,
    "max_depth": 5,
    "rate_limit": 100
  }',
  true
),
(
  'Active Full Scan',
  'Comprehensive active scanning with detailed vulnerability assessment',
  'active-full',
  '{
    "modules": ["ssl_analysis", "header_analysis", "dns_analysis", "port_scan_full", "vulnerability_scan_full", "web_app_scan_full", "compliance_check"],
    "timeout": 1800,
    "concurrent_requests": 20,
    "follow_redirects": true,
    "max_depth": 10,
    "rate_limit": 200,
    "deep_scan": true
  }',
  false
)
ON CONFLICT DO NOTHING;
