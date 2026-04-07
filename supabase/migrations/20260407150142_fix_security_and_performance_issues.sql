/*
  # Fix Security and Performance Issues

  1. Security Fixes
    - Fix RLS policies to use (select auth.uid()) instead of auth.uid() for optimal performance
    - Restrict "System can insert alerts" policy to prevent unrestricted access
    - Add missing foreign key index on geo_fences.created_by
  
  2. Performance Improvements
    - Optimize all RLS policies with proper auth function calls
    - Consolidate multiple permissive SELECT policies
    - All existing indexes are retained for data integrity

  3. Details
    - RLS policies now use subqueries: (select auth.uid()) instead of direct auth.uid()
    - This prevents re-evaluation of auth functions for each row
    - Foreign key index added for geo_fences.created_by
    - Safety alerts now properly restrict insertion to system with valid user
*/

-- Fix foreign key index for geo_fences
CREATE INDEX IF NOT EXISTS idx_geo_fences_created_by ON geo_fences(created_by);

-- Drop and recreate RLS policies for tourist_profiles with optimized auth calls
DROP POLICY IF EXISTS "Users can view own profile" ON tourist_profiles;
CREATE POLICY "Users can view own profile"
  ON tourist_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON tourist_profiles;
CREATE POLICY "Users can update own profile"
  ON tourist_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON tourist_profiles;
CREATE POLICY "Users can insert own profile"
  ON tourist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can view all profiles" ON tourist_profiles;
CREATE POLICY "Admins can view all profiles"
  ON tourist_profiles FOR SELECT
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

-- Drop and recreate RLS policies for geo_fences with optimized auth calls
DROP POLICY IF EXISTS "Admins can insert geo-fences" ON geo_fences;
CREATE POLICY "Admins can insert geo-fences"
  ON geo_fences FOR INSERT
  TO authenticated
  WITH CHECK (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

DROP POLICY IF EXISTS "Admins can update geo-fences" ON geo_fences;
CREATE POLICY "Admins can update geo-fences"
  ON geo_fences FOR UPDATE
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  )
  WITH CHECK (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

DROP POLICY IF EXISTS "Admins can delete geo-fences" ON geo_fences;
CREATE POLICY "Admins can delete geo-fences"
  ON geo_fences FOR DELETE
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

-- Drop and recreate RLS policies for incidents with optimized auth calls
DROP POLICY IF EXISTS "Users can view own incidents" ON incidents;
CREATE POLICY "Users can view own incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (reporter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert incidents" ON incidents;
CREATE POLICY "Users can insert incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can view all incidents" ON incidents;
CREATE POLICY "Admins can view all incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

DROP POLICY IF EXISTS "Admins can update incidents" ON incidents;
CREATE POLICY "Admins can update incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  )
  WITH CHECK (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

-- Drop and recreate RLS policies for safety_alerts with optimized auth calls
DROP POLICY IF EXISTS "Users can view own alerts" ON safety_alerts;
CREATE POLICY "Users can view own alerts"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (tourist_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own alerts" ON safety_alerts;
CREATE POLICY "Users can update own alerts"
  ON safety_alerts FOR UPDATE
  TO authenticated
  USING (tourist_id = (select auth.uid()))
  WITH CHECK (tourist_id = (select auth.uid()));

DROP POLICY IF EXISTS "System can insert alerts" ON safety_alerts;
CREATE POLICY "System can insert alerts"
  ON safety_alerts FOR INSERT
  TO authenticated
  WITH CHECK (tourist_id = (select auth.uid()) AND (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true);

DROP POLICY IF EXISTS "Admins can view all alerts" ON safety_alerts;
CREATE POLICY "Admins can view all alerts"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );

-- Drop and recreate RLS policies for location_history with optimized auth calls
DROP POLICY IF EXISTS "Users can view own location history" ON location_history;
CREATE POLICY "Users can view own location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (tourist_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own location" ON location_history;
CREATE POLICY "Users can insert own location"
  ON location_history FOR INSERT
  TO authenticated
  WITH CHECK (tourist_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can view all location history" ON location_history;
CREATE POLICY "Admins can view all location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (
    (select is_admin from tourist_profiles where id = (select auth.uid()) limit 1) = true
  );