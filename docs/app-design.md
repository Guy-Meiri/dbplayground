# Palindrome Car Plates Tracker

## 📋 App Overview

A web application for tracking palindromic license plates collected by different users. The app admin can upload photos of palindromic license plates and assign them to a specific user, and the app tracks who found what, creating a community leaderboard of palindrome hunters.

## 🎯 Core Features

### User Features
- **Authentication**: Sign in with Google (already implemented)
- **Submit Palindromes**: Upload photos with license plate details
- **Personal Dashboard**: View all palindromes found by the user
- **Leaderboard**: See rankings of top palindrome hunters

### Admin Features
- **Moderate Submissions**: Approve/reject palindrome submissions
- **Manage Users**: View and manage user accounts

## 📊 Data Models

### User Profile (Already exists)
```sql
user_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  nextauth_user_id TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Palindrome Submissions
```sql
palindromes (
  id UUID PRIMARY KEY,
  license_plate TEXT NOT NULL,
  image_url TEXT NOT NULL,
  car_type TEXT,
  location_found TEXT,
  found_by_user_id UUID REFERENCES user_profiles(id),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by_user_id UUID REFERENCES user_profiles(id)
)
```

### Image Storage
```sql
palindrome_images (
  id UUID PRIMARY KEY,
  palindrome_id UUID REFERENCES palindromes(id),
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
)
```

## 🎨 UI/UX Design

### Page Structure

#### 1. **Main Dashboard** (`/`)
- **Hero Section**: App title and stats overview
- **Recent Palindromes**: Grid of latest approved submissions
- **Quick Stats**: Total palindromes, active users, etc.
- **Call to Action**: "Submit Your Find" button

#### 2. **All Palindromes** (`/palindromes`)
- **Filter Bar**: Search by license plate, location, user
- **Sort Options**: By date, license plate, user
- **Grid View**: Cards showing image, plate, finder, location
- **Pagination**: Handle large datasets efficiently

#### 3. **Leaderboard** (`/leaderboard`)
- **Sortable Table** with columns:
  - Rank
  - User (name + avatar)
  - Total Palindromes Found
  - Latest Find
  - Join Date
- **Filter Options**: By time period (all time, this year, this month)

#### 4. **User Profile** (`/profile/[userId]`)
- **User Info**: Avatar, name, join date, total finds
- **Achievement Badges**: First find, 10 finds, 50 finds, etc.
- **User's Palindromes**: Grid of all their finds
- **Statistics**: Favorite locations, car types, etc.

#### 5. **Submit Palindrome** (`/submit`)
- **Image Upload**: Drag & drop with preview
- **Form Fields**:
  - License Plate (required, validated for palindrome)
  - Car Type (optional dropdown)
  - Location Found (optional text input with suggestions)
  - Additional Notes (optional textarea)
- **Preview**: Show how it will appear before submission

#### 6. **Admin Dashboard** (`/admin`) - Protected Route
- **Pending Submissions**: Review queue with approve/reject
- **User Management**: View all users and their activity
- **Site Statistics**: Analytics dashboard

## 🔧 Technical Implementation

### Frontend Tech Stack
- **Framework**: Next.js 15 (already set up)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Image Upload**: Supabase Storage
- **State Management**: TanStack Query + useState for local state

### Backend Tech Stack
- **Database**: Supabase PostgreSQL (already set up)
- **Authentication**: NextAuth.js (already implemented)
- **File Storage**: Supabase Storage
- **API**: Next.js API routes

### Database Features
- **Row Level Security**: Users can only edit their own submissions
- **Indexes**: Optimized queries for leaderboard and search
- **Functions**: Database functions for leaderboard calculations
- **Triggers**: Auto-update statistics on new submissions

## 🚀 Development Phases

### Phase 1: Core Foundation
1. **Database Schema**: Create palindromes table with migrations
2. **Basic UI**: Set up shadcn/ui and create layout components
3. **TanStack Query**: Set up data fetching infrastructure

### Phase 2: Palindrome Management
1. **Submit Form**: Create palindrome submission form
2. **Image Upload**: Implement Supabase Storage integration
3. **Validation**: Palindrome validation logic
4. **Personal Dashboard**: User's palindromes page

### Phase 3: Community Features
1. **All Palindromes Page**: Public gallery with filtering
2. **Leaderboard**: Sortable rankings table
3. **Search & Filter**: Advanced filtering capabilities

### Phase 4: Admin & Polish
1. **Admin Dashboard**: Moderation interface
2. **Notifications**: Email/in-app notifications for approvals
3. **Performance**: Optimization and caching
4. **Mobile**: Responsive design refinements

## 📱 User Experience Flow

### New User Journey
1. **Landing**: See recent palindromes and leaderboard preview
2. **Sign Up**: One-click Google authentication
3. **Onboarding**: Brief tutorial on submitting palindromes
4. **First Submission**: Guided form with validation tips

### Regular User Journey
1. **Dashboard**: Quick overview of recent activity
2. **Submit**: Easy access to submission form
3. **Track**: Monitor submission status (pending/approved)
4. **Compete**: Check leaderboard position

### Power User Journey
1. **Batch Upload**: Submit multiple finds efficiently
2. **Analytics**: Personal statistics and trends
3. **Community**: Engage with other collectors
4. **Achievements**: Unlock badges and milestones

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (matching current auth theme)
- **Secondary**: Green for approved, yellow for pending, red for rejected
- **Neutral**: Grays for text and backgrounds
- **Accent**: Fun colors for achievements and highlights

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable font stack (already using Geist)
- **Code**: Monospace for license plates

### Components
- **Card**: Palindrome cards with image, plate, and metadata
- **Table**: Sortable leaderboard table
- **Form**: Consistent form styling across submission forms
- **Badge**: Status indicators and achievement badges
- **Avatar**: User profile images with fallbacks

## 📈 Success Metrics

### Engagement Metrics
- **User Retention**: Monthly active users
- **Submission Rate**: Palindromes submitted per user
- **Approval Rate**: Percentage of approved submissions

### Community Metrics
- **Leaderboard Activity**: Users checking rankings
- **Profile Views**: Users viewing each other's profiles
- **Search Usage**: How users discover palindromes

### Technical Metrics
- **Page Load Speed**: Fast browsing experience
- **Image Load Time**: Optimized image delivery
- **API Response Time**: Quick data fetching

---

**Ready to start building?** This design provides a solid foundation for a fun, engaging palindrome tracking app! 🚗✨
