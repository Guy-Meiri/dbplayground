// Type mappings between mock data and database types
// This will help us transition from mock data to real Supabase data

import { MockPalindrome } from './mock-data'
import { Palindrome, Collector } from './types/database'

// Helper type to transform mock data to database format
export type MockToDatabasePalindrome = Omit<MockPalindrome, 'collector_name'> & {
  collector_id: string
  uploaded_by_admin_id: string
  image_storage_path: string
  additional_notes?: string | null
  created_at: string
  updated_at: string
}

// Helper function to transform mock palindrome to database format
export function mockPalindromeToDatabase(
  mockPalindrome: MockPalindrome,
  collectorId: string,
  adminId: string
): MockToDatabasePalindrome {
  return {
    id: mockPalindrome.id,
    license_plate: mockPalindrome.license_plate,
    image_url: mockPalindrome.image_url,
    image_storage_path: `palindromes/${mockPalindrome.id}.jpg`,
    car_type: mockPalindrome.car_type,
    location_found: mockPalindrome.location_found,
    date_found: mockPalindrome.date_found,
    additional_notes: null,
    collector_id: collectorId,
    uploaded_by_admin_id: adminId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Helper function to transform database palindrome to display format
export function databasePalindromeToDisplay(
  palindrome: Palindrome,
  collector: Collector
) {
  return {
    id: palindrome.id,
    license_plate: palindrome.license_plate,
    image_url: palindrome.image_url,
    collector_name: collector.name,
    location_found: palindrome.location_found,
    car_type: palindrome.car_type,
    date_found: palindrome.date_found || palindrome.created_at.split('T')[0]
  }
}
