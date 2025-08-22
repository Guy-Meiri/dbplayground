-- Migration: 003_create_collectors_table
-- Created: 2025-08-22
-- Description: Create collectors table for palindrome finders (virtual identities)

-- Create collectors table
CREATE TABLE collectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  location TEXT,
  bio TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_admin_id UUID REFERENCES user_profiles(id)
);

-- Create indexes for performance
CREATE INDEX idx_collectors_name ON collectors(name);
CREATE INDEX idx_collectors_location ON collectors(location) WHERE location IS NOT NULL;
CREATE INDEX idx_collectors_created_by ON collectors(created_by_admin_id);

-- Create unique index for case-insensitive name uniqueness
CREATE UNIQUE INDEX idx_collectors_name_unique ON collectors(LOWER(name));

-- Enable Row Level Security
ALTER TABLE collectors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read collectors (for leaderboard and display)
CREATE POLICY "Allow read access to collectors" ON collectors FOR SELECT USING (true);

-- Only admins can insert/update/delete collectors
CREATE POLICY "Admin can manage collectors" ON collectors 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Comments:
-- - Virtual identities that don't need app accounts
-- - Created by admins when uploading palindromes
-- - Public read access for leaderboard and profiles
-- - Case-insensitive unique names enforced by unique index
