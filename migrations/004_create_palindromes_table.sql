-- Migration: 004_create_palindromes_table
-- Created: 2025-08-22
-- Description: Create palindromes table for tracking palindromic license plates

-- Create palindromes table
CREATE TABLE palindromes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_storage_path TEXT NOT NULL,
  car_type TEXT,
  location_found TEXT,
  date_found DATE,
  additional_notes TEXT,
  
  -- Relationships
  collector_id UUID NOT NULL REFERENCES collectors(id) ON DELETE RESTRICT,
  uploaded_by_admin_id UUID NOT NULL REFERENCES user_profiles(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_palindromes_license_plate ON palindromes(license_plate);
CREATE INDEX idx_palindromes_collector ON palindromes(collector_id);
CREATE INDEX idx_palindromes_date_found ON palindromes(date_found DESC) WHERE date_found IS NOT NULL;
CREATE INDEX idx_palindromes_created_at ON palindromes(created_at DESC);
CREATE INDEX idx_palindromes_location ON palindromes(location_found) WHERE location_found IS NOT NULL;
CREATE INDEX idx_palindromes_car_type ON palindromes(car_type) WHERE car_type IS NOT NULL;

-- Full text search index for license plates and locations
CREATE INDEX idx_palindromes_search ON palindromes 
USING gin(to_tsvector('english', license_plate || ' ' || COALESCE(location_found, '') || ' ' || COALESCE(car_type, '')));

-- Enable Row Level Security
ALTER TABLE palindromes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read palindromes (public gallery)
CREATE POLICY "Allow read access to palindromes" ON palindromes FOR SELECT USING (true);

-- Only admins can insert/update/delete palindromes
CREATE POLICY "Admin can manage palindromes" ON palindromes 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Comments:
-- - Palindrome validation will be handled in TypeScript for flexibility
-- - Public read access for gallery and leaderboard
-- - Full text search supports advanced filtering
-- - Restrict deletion of collectors if they have palindromes
