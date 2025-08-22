# Palindrome License Plate Tracker - Project Plan

## 📋 Project Overview

A web application for tracking palindromic license plates found by different collectors. The app is admin-controlled where only the admin can upload palindrome images and assign them to collectors (who don't need to be registered users). The system tracks who found what and displays a community leaderboard.

## 🎯 Core Concept

- **Admin-Only Uploads**: Only the admin can add new palindromes to the system
- **Collector Identities**: Admin creates/assigns collector identities (not real user accounts)
- **Tracking System**: Track which collector found which palindromes
- **Public Display**: Gallery of all palindromes and leaderboard rankings

## 👥 User Roles

### Admin Users
- **Multiple admin accounts** (authenticated via Google)
- **Upload palindromes** with images and details
- **Create collector identities** on-the-fly or select existing ones
- **Edit/delete palindromes** and manage collector data
- **Full system access**

### Public Users (No Authentication Required)
- **View all palindromes** in a gallery format
- **Browse leaderboard** to see top collectors
- **Search and filter** palindromes by various criteria
- **No login required** - completely public access

### Collector Identities (Not Real Users)
- **Virtual identities** created by admin
- **Just a name and optional details** (email, location, etc.)
- **No login capability** - they don't use the app directly
- **Can be created on-demand** when admin uploads palindromes

## 📊 Data Structure

### Collector Identities
- **ID**: Unique identifier
- **Name**: Collector's name (e.g., "Sarah", "Mike from Boston")
- **Email**: Optional contact info
- **Location**: Optional home location/region
- **Bio/Notes**: Optional description
- **Created Date**: When admin added this collector
- **Total Finds**: Calculated field

### Palindromes
- **ID**: Unique identifier
- **License Plate**: The palindrome text (e.g., "MOM", "12321")
- **Image**: Photo of the car/license plate
- **Car Type**: Optional (e.g., "Honda Civic", "Pickup Truck")
- **Location Found**: Optional (e.g., "Downtown Boston", "Highway 101")
- **Date Found**: When the palindrome was discovered
- **Date Added**: When admin uploaded it to the system
- **Collector ID**: Who found this palindrome
- **Additional Notes**: Optional details

## 🎨 Page Structure

### 1. **Home/Gallery Page** (`/`)
- **Header**: App title, search bar, navigation
- **Filters Section**: 
  - Search by license plate
  - Filter by collector
  - Filter by location
  - Filter by car type
  - Sort by date found/added
- **Palindrome Grid**: 
  - Card layout with image, license plate, collector name
  - Click to view details
- **Quick Stats**: Total palindromes, active collectors

### 2. **Palindrome Detail Page** (`/palindrome/[id]`)
- **Large image display**
- **Full details**: License plate, car type, location, date found
- **Collector info**: Name and link to collector profile
- **Admin controls**: Edit/delete (only visible to admin)

### 3. **Leaderboard Page** (`/leaderboard`)
- **Sortable table** with columns:
  - Rank
  - Collector Name
  - Total Palindromes Found
  - Latest Find Date
  - Favorite Location (most common find location)
- **Filtering options**: By time period, location, etc.

### 4. **Collector Profile Page** (`/collector/[id]`)
- **Collector details**: Name, bio, stats
- **All their palindromes**: Grid view of their finds
- **Statistics**: Total finds, favorite locations, car types
- **Timeline**: Chronological list of their discoveries

### 5. **Admin Dashboard** (`/admin`) - Protected
- **Upload new palindrome**: Form with image upload
- **Collector management**: Create/edit collector identities
- **Palindrome management**: Edit existing entries
- **Quick stats**: Recent uploads, system overview

### 6. **Admin Upload Form** (`/admin/upload`)
- **Image upload**: Drag & drop with preview
- **License plate input**: Text field with palindrome validation
- **Collector selection**: Dropdown + "Create New" option
- **Optional fields**: Car type, location, date found, notes
- **Collector creation modal**: Quick form for new collectors

## 🔧 Technical Implementation

### Frontend Stack
- **Framework**: Next.js 15 (already set up)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Tables**: TanStack Table (React Table)
- **Form Handling**: React Hook Form + Zod validation
- **Image Upload**: Supabase Storage
- **Authentication**: NextAuth.js (admin only)

### Backend Stack
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage for images
- **API**: Next.js API routes
- **Authentication**: Admin-only via NextAuth/Google

### Key Features
- **Palindrome Validation**: Ensure license plates are actual palindromes
- **Image Optimization**: Compress and optimize uploaded images
- **Search & Filter**: Fast text search and multiple filter combinations
- **Responsive Design**: Works well on mobile and desktop
- **Admin Security**: Protect admin routes and API endpoints

## 🚀 Development Phases

### Phase 1: Foundation Setup
1. **Database Schema**: Design collector and palindrome tables
2. **Admin Authentication**: Ensure only admin can access upload features
3. **Basic UI Layout**: Set up shadcn/ui and create main layout
4. **TanStack Query Setup**: Configure data fetching infrastructure

### Phase 2: Core Functionality
1. **Admin Upload Form**: Create palindrome submission with collector assignment
2. **Collector Management**: CRUD operations for collector identities
3. **Image Upload**: Supabase Storage integration
4. **Palindrome Gallery**: Public view of all palindromes

### Phase 3: Advanced Features
1. **Search & Filtering**: Advanced filtering and search capabilities
2. **Leaderboard**: Sortable rankings table
3. **Collector Profiles**: Individual collector pages with their finds
4. **Detail Views**: Rich palindrome detail pages

### Phase 4: Polish & Optimization
1. **Performance**: Image optimization, caching, lazy loading
2. **Mobile Optimization**: Responsive design improvements
3. **Admin Dashboard**: Comprehensive admin management interface
4. **Analytics**: Track popular palindromes, search terms, etc.

## 📱 User Flow Examples

### Admin Workflow
1. **Login**: Authenticate as admin via Google
2. **Upload**: Navigate to upload form
3. **Add Palindrome**: Upload image, enter license plate
4. **Assign Collector**: Select existing collector or create new one
5. **Save**: Submit and see in gallery immediately

### Public User Workflow
1. **Browse**: Visit homepage, see latest palindromes
2. **Search**: Look for specific license plates or collectors
3. **Explore**: Check leaderboard, view collector profiles
4. **Discover**: Click through palindrome details

### Collector Identity Creation
1. **During Upload**: Admin realizes collector doesn't exist
2. **Quick Create**: Modal popup with collector name and details
3. **Auto-Assign**: New collector immediately available for assignment
4. **Future Use**: Collector appears in dropdown for future uploads

## 🎨 Design Considerations

### Visual Design
- **Card-based layout** for palindromes with prominent images
- **Clean, modern UI** using shadcn/ui components
- **High contrast** for license plate text readability
- **Responsive grid** that works on all screen sizes

### User Experience
- **Fast loading** with optimized images and efficient queries
- **Intuitive navigation** between gallery, leaderboard, and profiles
- **Clear visual hierarchy** with well-organized information
- **Accessible design** following web accessibility guidelines

### Admin Experience
- **Streamlined upload process** with smart defaults
- **Bulk operations** for managing multiple palindromes
- **Error handling** with clear validation messages
- **Preview functionality** before publishing

## 🔒 Security & Permissions

### Admin Protection
- **Route guards** on all admin pages
- **API endpoint protection** for admin-only operations
- **Image upload validation** to prevent malicious files
- **Input sanitization** on all form inputs

### Public Access
- **Read-only access** to all palindrome and collector data
- **No authentication required** for browsing
- **Rate limiting** to prevent abuse
- **Image optimization** for fast loading

---

**Next Steps**: Once this plan is approved, we'll implement the database schema and start building the core functionality! 🚗✨
