/*
  # Add Sample Geo-Fences for Demonstration

  1. Purpose
    - Populate the geo_fences table with sample data to demonstrate the geo-fencing features
    - Includes both safe zones and restricted areas for testing
  
  2. Sample Data
    - Creates 5 sample geo-fences with different zone types and locations
    - Safe zones: Tourist areas, city centers
    - Restricted zones: High-risk areas, construction zones
*/

-- Insert sample geo-fences only if the table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM geo_fences LIMIT 1) THEN
    INSERT INTO geo_fences (name, zone_type, latitude, longitude, radius, description) VALUES
      ('Downtown Tourist District', 'safe', 40.7589, -73.9851, 2000, 'Well-lit, heavily policed tourist area with many attractions and restaurants'),
      ('City Center Mall', 'safe', 40.7614, -73.9776, 1000, 'Major shopping district with 24/7 security and emergency services nearby'),
      ('Construction Zone Area', 'restricted', 40.7484, -73.9857, 800, 'Active construction site - unsafe for pedestrians, avoid this area'),
      ('High Crime District', 'restricted', 40.7423, -73.9872, 1500, 'Area with elevated crime rates, especially dangerous after dark'),
      ('Central Park North', 'safe', 40.7968, -73.9497, 3000, 'Public park area with regular patrols and well-maintained paths');
  END IF;
END $$;