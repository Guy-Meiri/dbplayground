# Database Schema Design

## 📊 Complete Database Schema

### Core Tables

#### 1. user_profiles (Already exists)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  nextauth_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. palindromes (New)
```sql
CREATE TABLE palindromes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL,
  image_url TEXT NOT NULL,
  car_type TEXT,
  location_found TEXT,
  additional_notes TEXT,
  found_by_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status palindrome_status DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by_user_id UUID REFERENCES user_profiles(id),
  rejection_reason TEXT
);

-- Custom enum for palindrome status
CREATE TYPE palindrome_status AS ENUM ('pending', 'approved', 'rejected');
```

#### 3. palindrome_images (New - for multiple images per palindrome)
```sql
CREATE TABLE palindrome_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palindrome_id UUID NOT NULL REFERENCES palindromes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_primary BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. user_statistics (New - for performance)
```sql
CREATE TABLE user_statistics (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_submissions INTEGER DEFAULT 0,
  approved_submissions INTEGER DEFAULT 0,
  pending_submissions INTEGER DEFAULT 0,
  rejected_submissions INTEGER DEFAULT 0,
  first_submission_at TIMESTAMP WITH TIME ZONE,
  latest_submission_at TIMESTAMP WITH TIME ZONE,
  favorite_location TEXT,
  favorite_car_type TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- Palindromes indexes
CREATE INDEX idx_palindromes_status ON palindromes(status);
CREATE INDEX idx_palindromes_found_by_user ON palindromes(found_by_user_id);
CREATE INDEX idx_palindromes_submitted_at ON palindromes(submitted_at DESC);
CREATE INDEX idx_palindromes_approved_at ON palindromes(approved_at DESC) WHERE status = 'approved';
CREATE INDEX idx_palindromes_license_plate ON palindromes(license_plate);
CREATE INDEX idx_palindromes_location ON palindromes(location_found) WHERE location_found IS NOT NULL;

-- Full text search index for license plates and locations
CREATE INDEX idx_palindromes_search ON palindromes USING gin(to_tsvector('english', license_plate || ' ' || COALESCE(location_found, '')));

-- Images indexes
CREATE INDEX idx_palindrome_images_palindrome_id ON palindrome_images(palindrome_id);
CREATE INDEX idx_palindrome_images_primary ON palindrome_images(palindrome_id, is_primary) WHERE is_primary = true;

-- User statistics index
CREATE INDEX idx_user_statistics_approved_desc ON user_statistics(approved_submissions DESC);
```

### Database Functions

#### 1. Update User Statistics Function
```sql
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics when palindrome status changes
  IF TG_OP = 'INSERT' THEN
    INSERT INTO user_statistics (user_id, total_submissions, pending_submissions, first_submission_at, latest_submission_at)
    VALUES (NEW.found_by_user_id, 1, 1, NEW.submitted_at, NEW.submitted_at)
    ON CONFLICT (user_id) DO UPDATE SET
      total_submissions = user_statistics.total_submissions + 1,
      pending_submissions = user_statistics.pending_submissions + 1,
      latest_submission_at = NEW.submitted_at,
      first_submission_at = COALESCE(user_statistics.first_submission_at, NEW.submitted_at);
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Status changed
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
      UPDATE user_statistics SET
        approved_submissions = approved_submissions + 1,
        pending_submissions = pending_submissions - 1
      WHERE user_id = NEW.found_by_user_id;
    ELSIF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
      UPDATE user_statistics SET
        rejected_submissions = rejected_submissions + 1,
        pending_submissions = pending_submissions - 1
      WHERE user_id = NEW.found_by_user_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_user_statistics
  AFTER INSERT OR UPDATE ON palindromes
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();
```

#### 2. Palindrome Validation Function
```sql
CREATE OR REPLACE FUNCTION is_palindrome(plate_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove spaces and convert to uppercase
  plate_text := UPPER(REGEXP_REPLACE(plate_text, '[^A-Z0-9]', '', 'g'));
  
  -- Check if it's a palindrome
  RETURN plate_text = REVERSE(plate_text) AND LENGTH(plate_text) > 1;
END;
$$ LANGUAGE plpgsql;
```

#### 3. Leaderboard Function
```sql
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  rank INTEGER,
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  user_avatar_url TEXT,
  total_finds BIGINT,
  latest_find TIMESTAMP WITH TIME ZONE,
  member_since TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY us.approved_submissions DESC, up.created_at ASC)::INTEGER as rank,
    up.id as user_id,
    up.name as user_name,
    up.email as user_email,
    up.avatar_url as user_avatar_url,
    us.approved_submissions as total_finds,
    us.latest_submission_at as latest_find,
    up.created_at as member_since
  FROM user_profiles up
  JOIN user_statistics us ON up.id = us.user_id
  WHERE us.approved_submissions > 0
  ORDER BY us.approved_submissions DESC, up.created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security Policies

```sql
-- Palindromes RLS
ALTER TABLE palindromes ENABLE ROW LEVEL SECURITY;

-- Users can read approved palindromes and their own submissions
CREATE POLICY "Read palindromes" ON palindromes FOR SELECT USING (
  status = 'approved' OR found_by_user_id = auth.uid()
);

-- Users can insert their own palindromes
CREATE POLICY "Insert own palindromes" ON palindromes FOR INSERT WITH CHECK (
  found_by_user_id = auth.uid()
);

-- Users can update their own pending palindromes
CREATE POLICY "Update own pending palindromes" ON palindromes FOR UPDATE USING (
  found_by_user_id = auth.uid() AND status = 'pending'
);

-- Images RLS
ALTER TABLE palindrome_images ENABLE ROW LEVEL SECURITY;

-- Users can read images for palindromes they can see
CREATE POLICY "Read palindrome images" ON palindrome_images FOR SELECT USING (
  palindrome_id IN (
    SELECT id FROM palindromes WHERE status = 'approved' OR found_by_user_id = auth.uid()
  )
);

-- Users can insert images for their own palindromes
CREATE POLICY "Insert own palindrome images" ON palindrome_images FOR INSERT WITH CHECK (
  palindrome_id IN (
    SELECT id FROM palindromes WHERE found_by_user_id = auth.uid()
  )
);

-- Statistics RLS
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- Everyone can read statistics (for leaderboard)
CREATE POLICY "Read user statistics" ON user_statistics FOR SELECT USING (true);
```

### Sample Data Types

```typescript
// TypeScript interfaces for the frontend
interface Palindrome {
  id: string
  license_plate: string
  image_url: string
  car_type?: string
  location_found?: string
  additional_notes?: string
  found_by_user_id: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  approved_at?: string
  approved_by_user_id?: string
  rejection_reason?: string
  
  // Joined data
  found_by_user?: UserProfile
  primary_image?: PalindromeImage
  images?: PalindromeImage[]
}

interface PalindromeImage {
  id: string
  palindrome_id: string
  image_url: string
  storage_path: string
  file_size?: number
  mime_type?: string
  is_primary: boolean
  uploaded_at: string
}

interface UserStatistics {
  user_id: string
  total_submissions: number
  approved_submissions: number
  pending_submissions: number
  rejected_submissions: number
  first_submission_at?: string
  latest_submission_at?: string
  favorite_location?: string
  favorite_car_type?: string
  updated_at: string
}

interface LeaderboardEntry {
  rank: number
  user_id: string
  user_name: string
  user_email: string
  user_avatar_url?: string
  total_finds: number
  latest_find?: string
  member_since: string
}
```

## 🔄 Migration Strategy

### Migration Files Structure
```
migrations/
├── 001_create_user_profiles_table.sql (already exists)
├── 002_create_palindrome_status_enum.sql
├── 003_create_palindromes_table.sql
├── 004_create_palindrome_images_table.sql
├── 005_create_user_statistics_table.sql
├── 006_create_indexes.sql
├── 007_create_functions_and_triggers.sql
└── 008_create_rls_policies.sql
```

This schema design provides:
- ✅ **Scalability**: Optimized queries with proper indexes
- ✅ **Security**: Row Level Security for data protection
- ✅ **Performance**: Pre-calculated statistics and efficient queries
- ✅ **Flexibility**: Support for multiple images and rich metadata
- ✅ **Data Integrity**: Foreign key constraints and validation functions
