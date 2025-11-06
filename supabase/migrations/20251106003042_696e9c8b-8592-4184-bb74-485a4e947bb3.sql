-- Fix RLS policy for seller_applications to allow authenticated users to insert their own applications
DROP POLICY IF EXISTS seller_apps_insert_own ON seller_applications;

CREATE POLICY seller_apps_insert_own ON seller_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure SELECT policy allows users to see their own applications
DROP POLICY IF EXISTS seller_apps_select_own_or_admin ON seller_applications;

CREATE POLICY seller_apps_select_own_or_admin ON seller_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Allow UPDATE for admins only
DROP POLICY IF EXISTS seller_apps_update_admin ON seller_applications;

CREATE POLICY seller_apps_update_admin ON seller_applications
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Clean up complex admin auth tables (no longer needed)
DROP TABLE IF EXISTS admin_secrets CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_auth_attempts CASCADE;

-- Create a function to check if a user is admin by email
CREATE OR REPLACE FUNCTION public.is_admin_email(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_email = 'market.360@gmail.com';
$$;

-- Update RLS policies that referenced admin_secrets to use has_role instead
-- (The has_role function already exists and checks user_roles table)