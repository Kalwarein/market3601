-- Add RLS policies for admin_sessions (service role only access)
CREATE POLICY admin_sessions_service_only ON admin_sessions
  FOR ALL
  USING (false);

-- Add RLS policies for admin_auth_attempts (service role only access)
CREATE POLICY admin_auth_attempts_service_only ON admin_auth_attempts
  FOR ALL
  USING (false);