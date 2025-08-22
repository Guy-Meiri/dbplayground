// Utility functions for palindrome validation and data processing
// This replaces all database functions and views

// Types for our data structures
export interface Collector {
  id: string
  name: string
  email?: string | null
  location?: string | null
  bio?: string | null
  created_at: string
  updated_at: string
}

export interface Palindrome {
  id: string
  license_plate: string
  image_url: string
  image_storage_path: string
  car_type?: string | null
  location_found?: string | null
  date_found?: string | null
  additional_notes?: string | null
  collector_id: string
  uploaded_by_admin_id: string
  created_at: string
  updated_at: string
}

export interface PalindromeWithCollector extends Palindrome {
  collector_name: string
  collector_location?: string | null
  collector_bio?: string | null
  uploaded_by_admin_name?: string | null
  uploaded_by_admin_email?: string | null
}

export interface UserProfile {
  id: string
  email: string
  name?: string | null
  avatar_url?: string | null
  nextauth_user_id?: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

/**
 * Join palindromes with collector data (replaces the database view)
 */
export function joinPalindromesWithCollectors(
  palindromes: Palindrome[],
  collectors: Collector[],
  admins: UserProfile[] = []
): PalindromeWithCollector[] {
  const collectorsMap = new Map(collectors.map(c => [c.id, c]))
  const adminsMap = new Map(admins.map(a => [a.id, a]))
  
  return palindromes.map(palindrome => {
    const collector = collectorsMap.get(palindrome.collector_id)
    const admin = adminsMap.get(palindrome.uploaded_by_admin_id)
    
    return {
      ...palindrome,
      collector_name: collector?.name || 'Unknown Collector',
      collector_location: collector?.location,
      collector_bio: collector?.bio,
      uploaded_by_admin_name: admin?.name,
      uploaded_by_admin_email: admin?.email
    }
  })
}

/**
 * Check if a license plate is a valid palindrome
 */
export function isPalindrome(licenseplate: string): boolean {
  // Remove non-alphanumeric characters and convert to uppercase
  const cleaned = licenseplate.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  
  // Check if it's at least 2 characters and is a palindrome
  if (cleaned.length < 2) return false
  
  return cleaned === cleaned.split('').reverse().join('')
}

/**
 * Update the updated_at timestamp for data modifications
 * (replaces the database trigger functionality)
 */
export function withUpdatedTimestamp<T extends { updated_at?: string }>(data: T): T {
  return {
    ...data,
    updated_at: new Date().toISOString()
  }
}

/**
 * Validate palindrome form data
 */
export function validatePalindromeData(data: {
  licensePlate: string
  collectorId: string
  imageFile?: File
}) {
  const errors: Record<string, string> = {}
  
  // License plate validation
  if (!data.licensePlate?.trim()) {
    errors.licensePlate = 'License plate is required'
  } else if (!isPalindrome(data.licensePlate)) {
    errors.licensePlate = 'License plate must be a palindrome'
  }
  
  // Collector validation
  if (!data.collectorId?.trim()) {
    errors.collectorId = 'Collector must be selected'
  }
  
  // Image validation
  if (!data.imageFile) {
    errors.image = 'Image is required'
  } else {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(data.imageFile.type)) {
      errors.image = 'Image must be JPEG, PNG, or WebP'
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (data.imageFile.size > maxSize) {
      errors.image = 'Image must be less than 5MB'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Calculate collector statistics from palindromes data
 */
export function calculateCollectorStats(palindromes: Array<{
  date_found?: string | null
  location_found?: string | null
  car_type?: string | null
}>) {
  if (palindromes.length === 0) {
    return {
      totalFinds: 0,
      latestFind: null,
      earliestFind: null,
      favoriteLocation: null,
      favoriteCarType: null,
      locationsCount: 0,
      carTypesCount: 0
    }
  }
  
  // Get dates
  const dates = palindromes
    .map(p => p.date_found)
    .filter(Boolean)
    .map(d => new Date(d!))
    .sort((a, b) => a.getTime() - b.getTime())
  
  // Get most common location and car type
  const locations = palindromes.map(p => p.location_found).filter(Boolean)
  const carTypes = palindromes.map(p => p.car_type).filter(Boolean)
  
  return {
    totalFinds: palindromes.length,
    latestFind: dates.length > 0 ? dates[dates.length - 1] : null,
    earliestFind: dates.length > 0 ? dates[0] : null,
    favoriteLocation: getMostCommon(locations),
    favoriteCarType: getMostCommon(carTypes),
    locationsCount: new Set(locations).size,
    carTypesCount: new Set(carTypes).size
  }
}

/**
 * Generate leaderboard data from collectors and palindromes
 */
export function generateLeaderboard(
  collectors: Array<{ id: string; name: string; location?: string | null }>,
  palindromes: Array<{ collector_id: string; created_at: string }>
) {
  // Group palindromes by collector
  const palindromesByCollector = palindromes.reduce((acc, p) => {
    if (!acc[p.collector_id]) acc[p.collector_id] = []
    acc[p.collector_id].push(p)
    return acc
  }, {} as Record<string, typeof palindromes>)
  
  // Calculate stats for each collector
  const leaderboardData = collectors
    .map(collector => {
      const collectorPalindromes = palindromesByCollector[collector.id] || []
      const totalFinds = collectorPalindromes.length
      
      if (totalFinds === 0) return null
      
      const dates = collectorPalindromes
        .map(p => new Date(p.created_at))
        .sort((a, b) => a.getTime() - b.getTime())
      
      return {
        collector,
        totalFinds,
        latestFind: dates[dates.length - 1],
        earliestFind: dates[0]
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by total finds (desc), then by earliest find (asc) for ties
      if (a!.totalFinds !== b!.totalFinds) {
        return b!.totalFinds - a!.totalFinds
      }
      return a!.earliestFind.getTime() - b!.earliestFind.getTime()
    })
    .map((item, index) => ({
      rank: index + 1,
      ...item!
    }))
  
  return leaderboardData
}

/**
 * Helper: Get most common item from array
 */
function getMostCommon<T>(items: T[]): T | null {
  if (items.length === 0) return null
  
  const counts = items.reduce((acc, item) => {
    acc[item as string] = (acc[item as string] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostCommon = Object.entries(counts).reduce((a, b) => 
    counts[a[0]] > counts[b[0]] ? a : b
  )
  
  return mostCommon[0] as T
}

/**
 * Format license plate for display (add spacing)
 */
export function formatLicensePlate(plate: string): string {
  // Remove existing spaces and add standard formatting
  const cleaned = plate.replace(/\s/g, '').toUpperCase()
  
  // Common formats: ABC-123, ABC123, 123-ABC, etc.
  // For now, just return as-is since formats vary by region
  return cleaned
}

/**
 * Search/filter palindromes
 */
export function filterPalindromes<T extends {
  license_plate: string
  location_found?: string | null
  car_type?: string | null
  collector_name?: string
}>(
  palindromes: T[],
  filters: {
    search?: string
    collectorId?: string
    location?: string
    carType?: string
  }
): T[] {
  return palindromes.filter(palindrome => {
    // Search filter (license plate, location, car type, collector name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableText = [
        palindrome.license_plate,
        palindrome.location_found,
        palindrome.car_type,
        palindrome.collector_name
      ].join(' ').toLowerCase()
      
      if (!searchableText.includes(searchTerm)) return false
    }
    
    // Specific filters
    if (filters.collectorId && palindrome.collector_name !== filters.collectorId) return false
    if (filters.location && palindrome.location_found !== filters.location) return false
    if (filters.carType && palindrome.car_type !== filters.carType) return false
    
    return true
  })
}
