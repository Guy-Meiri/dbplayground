-- Migration: 002_add_admin_role_to_users
-- Created: 2025-08-22
-- Description: Add admin role support to user_profiles table

-- Add is_admin column to user_profiles
ALTER TABLE user_profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create index for fast admin lookups
CREATE INDEX idx_user_profiles_admin ON user_profiles(is_admin) WHERE is_admin = true;

-- Update RLS policy to allow admins to read all profiles
DROP POLICY IF EXISTS "Allow read access" ON user_profiles;

CREATE POLICY "Allow read access" ON user_profiles FOR SELECT USING (true);

-- Allow admins to update user admin status (service role only)
-- This will be handled by admin management interface

-- Comments:
-- - is_admin: Boolean flag to identify admin users
-- - Only service role can modify admin status
-- - All users can read profiles for leaderboard/display purposes
