/*
  # Smart Tourist Safety Monitoring System - Database Schema

  1. New Tables
    - `tourist_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `country` (text)
      - `phone` (text)
      - `emergency_contact_name` (text)
      - `emergency_contact_phone` (text)
      - `blood_type` (text)
      - `medical_conditions` (text)
      - `digital_id` (text, unique)
      - `profile_image` (text)
      - `is_admin` (boolean, default false)
      - `current_latitude` (numeric)
      - `current_longitude` (numeric)
      - `safety_status` (text, default 'safe')
      - `last_activity` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `geo_fences`
      - `id` (uuid, primary key)
      - `name` (text)
      - `zone_type` (text: 'safe' or 'restricted')
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `radius` (numeric, in meters)
      - `description` (text)
      - `created_by` (uuid, references tourist_profiles)
      - `created_at` (timestamptz)
    
    - `incidents`
      - `id` (uuid, primary key)
      - `reporter_id` (uuid, references tourist_profiles)
      - `incident_type` (text)
      - `description` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `severity` (text)
      - `status` (text, default 'open')
      - `response_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `safety_alerts`
      - `id` (uuid, primary key)
      - `tourist_id` (uuid, references tourist_profiles)
      - `alert_type` (text)
      - `message` (text)
      - `severity` (text)
      - `is_read` (boolean, default false)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `location_history`
      - `id` (uuid, primary key)
      - `tourist_id` (uuid, references tourist_profiles)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `recorded_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for admins to view all data
*/

-- Create tourist_profiles table
CREATE TABLE IF NOT EXISTS tourist_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  country text DEFAULT '',
  phone text DEFAULT '',
  emergency_contact_name text DEFAULT '',
  emergency_contact_phone text DEFAULT '',
  blood_type text DEFAULT '',
  medical_conditions text DEFAULT '',
  digital_id text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  profile_image text DEFAULT '',
  is_admin boolean DEFAULT false,
  current_latitude numeric,
  current_longitude numeric,
  safety_status text DEFAULT 'safe',
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tourist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON tourist_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON tourist_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON tourist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON tourist_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create geo_fences table
CREATE TABLE IF NOT EXISTS geo_fences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  zone_type text NOT NULL CHECK (zone_type IN ('safe', 'restricted')),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  radius numeric NOT NULL DEFAULT 1000,
  description text DEFAULT '',
  created_by uuid REFERENCES tourist_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE geo_fences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view geo-fences"
  ON geo_fences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert geo-fences"
  ON geo_fences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update geo-fences"
  ON geo_fences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete geo-fences"
  ON geo_fences FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES tourist_profiles(id),
  incident_type text NOT NULL,
  description text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  response_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create safety_alerts table
CREATE TABLE IF NOT EXISTS safety_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id uuid REFERENCES tourist_profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  is_read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = tourist_id);

CREATE POLICY "Users can update own alerts"
  ON safety_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = tourist_id)
  WITH CHECK (auth.uid() = tourist_id);

CREATE POLICY "System can insert alerts"
  ON safety_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all alerts"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create location_history table
CREATE TABLE IF NOT EXISTS location_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id uuid REFERENCES tourist_profiles(id) ON DELETE CASCADE,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (auth.uid() = tourist_id);

CREATE POLICY "Users can insert own location"
  ON location_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tourist_id);

CREATE POLICY "Admins can view all location history"
  ON location_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tourist_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_digital_id ON tourist_profiles(digital_id);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_id ON incidents(reporter_id);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_tourist_id ON safety_alerts(tourist_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_created_at ON safety_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_history_tourist_id ON location_history(tourist_id);
CREATE INDEX IF NOT EXISTS idx_geo_fences_zone_type ON geo_fences(zone_type);