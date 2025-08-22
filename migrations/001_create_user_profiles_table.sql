-- Migration: 001_create_user_profiles_table
-- Created: 2025-08-22
-- Description: Initial user profiles table for NextAuth integration

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  nextauth_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_nextauth_id ON user_profiles(nextauth_user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Simple policy: users can read all profiles (for now)
CREATE POLICY "Allow read access" ON user_profiles FOR SELECT USING (true);

-- Only allow inserts/updates via service role (admin operations)
-- Regular users won't be able to write directly to this table
-- All writes will go through our NextAuth callbacks using service role

-- Comments for future reference:
-- - email: Used to link NextAuth user to database record
-- - nextauth_user_id: NextAuth's internal user ID for reliability
-- - Service role will handle all write operations
-- - RLS prevents direct user modifications
