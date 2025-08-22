// Mock data for development - will be replaced with real Supabase data

// Type definitions for mock data
export interface MockPalindrome {
  id: string
  license_plate: string
  image_url: string
  collector_name: string
  location_found?: string
  car_type?: string
  date_found: string
}

export interface MockStats {
  totalPalindromes: number
  activeCollectors: number
  thisMonth: number
}

export interface MockCollector {
  id: string
  name: string
  email: string
  location: string
  bio: string
  totalFinds: number
}

// Mock data with proper typing
export const mockPalindromes: MockPalindrome[] = [
  {
    id: '1',
    license_plate: 'MOM',
    image_url: '/placeholder-car.jpg',
    collector_name: 'Sarah Johnson',
    location_found: 'Downtown Boston',
    car_type: 'Honda Civic',
    date_found: '2024-08-15'
  },
  {
    id: '2',
    license_plate: '12321',
    image_url: '/placeholder-car.jpg',
    collector_name: 'Mike Chen',
    location_found: 'Highway 101',
    car_type: 'Toyota Camry',
    date_found: '2024-08-10'
  },
  {
    id: '3',
    license_plate: 'RACECAR',
    image_url: '/placeholder-car.jpg',
    collector_name: 'Lisa Williams',
    location_found: 'Mall Parking',
    car_type: 'Ford F-150',
    date_found: '2024-08-05'
  },
  {
    id: '4',
    license_plate: 'A1A',
    image_url: '/placeholder-car.jpg',
    collector_name: 'David Rodriguez',
    location_found: 'Airport Parking',
    car_type: 'Tesla Model 3',
    date_found: '2024-08-01'
  },
  {
    id: '5',
    license_plate: '7337',
    image_url: '/placeholder-car.jpg',
    collector_name: 'Emma Wilson',
    location_found: 'Shopping Center',
    car_type: 'Subaru Outback',
    date_found: '2024-07-28'
  },
  {
    id: '6',
    license_plate: 'TACOCAT',
    image_url: '/placeholder-car.jpg',
    collector_name: 'Alex Thompson',
    location_found: 'Food Truck Rally',
    car_type: 'Volkswagen Van',
    date_found: '2024-07-22'
  }
]

export const mockStats: MockStats = {
  totalPalindromes: 247,
  activeCollectors: 42,
  thisMonth: 18
}

export const mockCollectors: MockCollector[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'Boston, MA',
    bio: 'Car enthusiast and palindrome hunter since 2020',
    totalFinds: 23
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'San Francisco, CA',
    bio: 'Software engineer who loves patterns in everyday life',
    totalFinds: 19
  },
  {
    id: '3',
    name: 'Lisa Williams',
    email: 'lisa@example.com',
    location: 'Austin, TX',
    bio: 'Mathematics teacher fascinated by symmetry',
    totalFinds: 16
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david@example.com',
    location: 'Miami, FL',
    bio: 'Travel photographer always on the lookout',
    totalFinds: 14
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    location: 'Seattle, WA',
    bio: 'Urban explorer and palindrome spotter',
    totalFinds: 12
  }
]
