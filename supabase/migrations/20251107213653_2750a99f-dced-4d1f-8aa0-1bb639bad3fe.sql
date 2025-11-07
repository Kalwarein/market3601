-- Fix RLS policies for seller_applications table
DROP POLICY IF EXISTS "seller_apps_insert_own" ON seller_applications;
DROP POLICY IF EXISTS "seller_apps_select_own_or_admin" ON seller_applications;
DROP POLICY IF EXISTS "seller_apps_update_admin" ON seller_applications;

-- Allow authenticated users to insert their own seller applications
CREATE POLICY "seller_apps_insert_own" ON seller_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own applications, and admins to view all
CREATE POLICY "seller_apps_select_own_or_admin" ON seller_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    has_role(auth.uid(), 'admin')
  );

-- Allow admins to update any application (for approval/rejection)
CREATE POLICY "seller_apps_update_admin" ON seller_applications
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));