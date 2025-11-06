-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix RLS policies for seller_applications
DROP POLICY IF EXISTS seller_applications_insert_own ON seller_applications;
DROP POLICY IF EXISTS seller_applications_select_own ON seller_applications;
DROP POLICY IF EXISTS seller_applications_update_own ON seller_applications;
DROP POLICY IF EXISTS seller_applications_admin_update ON seller_applications;

CREATE POLICY seller_apps_insert_own ON seller_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY seller_apps_select_own_or_admin ON seller_applications
  FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY seller_apps_update_admin ON seller_applications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Fix stores RLS to allow admin to insert when approving sellers
DROP POLICY IF EXISTS stores_admin_insert ON stores;
DROP POLICY IF EXISTS stores_update_own ON stores;

CREATE POLICY stores_insert_owner_or_admin ON stores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY stores_update_owner_or_admin ON stores
  FOR UPDATE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Fix products RLS
DROP POLICY IF EXISTS products_owner_all ON products;
DROP POLICY IF EXISTS products_select_published ON products;

CREATE POLICY products_insert_owner_or_admin ON products
  FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM stores WHERE id = products.store_id AND user_id = auth.uid())
  );

CREATE POLICY products_update_owner_or_admin ON products
  FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM stores WHERE id = products.store_id AND user_id = auth.uid())
  );

CREATE POLICY products_delete_owner_or_admin ON products
  FOR DELETE
  USING (
    has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM stores WHERE id = products.store_id AND user_id = auth.uid())
  );

CREATE POLICY products_select_public_or_owner ON products
  FOR SELECT
  USING (
    published = true OR 
    has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM stores WHERE id = products.store_id AND user_id = auth.uid())
  );

-- Create admin_secrets table for storing hashed passphrases
CREATE TABLE IF NOT EXISTS admin_secrets (
  id serial PRIMARY KEY,
  label text UNIQUE NOT NULL,
  passhash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_secrets (only accessible server-side)
ALTER TABLE admin_secrets ENABLE ROW LEVEL SECURITY;

-- No public policies - only service_role can access
CREATE POLICY admin_secrets_service_only ON admin_secrets
  FOR ALL
  USING (false);

-- Insert hashed passphrases
INSERT INTO admin_secrets (label, passhash)
VALUES 
  ('step1', crypt('#market360762635375363', gen_salt('bf', 10))),
  ('step2', crypt('#market360848844747477', gen_salt('bf', 10)))
ON CONFLICT (label) DO NOTHING;

-- Create admin_sessions table to track admin auth sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  step1_verified boolean DEFAULT false,
  step2_verified boolean DEFAULT false,
  session_token text UNIQUE,
  ip_address text,
  user_agent text,
  expires_at timestamptz DEFAULT (now() + interval '30 minutes'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create admin_auth_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS admin_auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  step text NOT NULL,
  success boolean DEFAULT false,
  attempted_at timestamptz DEFAULT now()
);

ALTER TABLE admin_auth_attempts ENABLE ROW LEVEL SECURITY;

-- Update audit_logs to ensure it has all needed columns
ALTER TABLE audit_logs 
  ADD COLUMN IF NOT EXISTS ip_address text,
  ADD COLUMN IF NOT EXISTS user_agent text;