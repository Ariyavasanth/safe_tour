/*
  # Fix Infinite Recursion in RLS Policies

  1. Security Changes
    - Added a `SECURITY DEFINER` function `get_is_admin(user_id)` to securely check admin status without triggering RLS recursively.
    - Updated all "Admins can..." policies to use the new function, fixing the `infinite recursion detected` error.
*/

-- 1. Create a secure function to check admin status that bypasses RLS
CREATE OR REPLACE FUNCTION get_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin FROM tourist_profiles WHERE id = user_id;
$$;

-- 2. Update tourist_profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON tourist_profiles;
CREATE POLICY "Admins can view all profiles"
  ON tourist_profiles FOR SELECT
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true);

-- 3. Update geo_fences policies
DROP POLICY IF EXISTS "Admins can insert geo-fences" ON geo_fences;
CREATE POLICY "Admins can insert geo-fences"
  ON geo_fences FOR INSERT
  TO authenticated
  WITH CHECK (get_is_admin((select auth.uid())) = true);

DROP POLICY IF EXISTS "Admins can update geo-fences" ON geo_fences;
CREATE POLICY "Admins can update geo-fences"
  ON geo_fences FOR UPDATE
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true)
  WITH CHECK (get_is_admin((select auth.uid())) = true);

DROP POLICY IF EXISTS "Admins can delete geo-fences" ON geo_fences;
CREATE POLICY "Admins can delete geo-fences"
  ON geo_fences FOR DELETE
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true);

-- 4. Update incidents policies
DROP POLICY IF EXISTS "Admins can view all incidents" ON incidents;
CREATE POLICY "Admins can view all incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true);

DROP POLICY IF EXISTS "Admins can update incidents" ON incidents;
CREATE POLICY "Admins can update incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true)
  WITH CHECK (get_is_admin((select auth.uid())) = true);

-- 5. Update safety_alerts policies
DROP POLICY IF EXISTS "System can insert alerts" ON safety_alerts;
CREATE POLICY "System can insert alerts"
  ON safety_alerts FOR INSERT
  TO authenticated
  WITH CHECK (tourist_id = (select auth.uid()) AND get_is_admin((select auth.uid())) = true);

DROP POLICY IF EXISTS "Admins can view all alerts" ON safety_alerts;
CREATE POLICY "Admins can view all alerts"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true);

-- 6. Update location_history policies  
DROP POLICY IF EXISTS "Admins can view all location history" ON location_history;
CREATE POLICY "Admins can view all location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (get_is_admin((select auth.uid())) = true);
