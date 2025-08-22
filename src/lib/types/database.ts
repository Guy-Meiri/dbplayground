// Database types that match our Supabase schema
// These should be kept in sync with the database migrations

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          nextauth_user_id: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          nextauth_user_id?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          nextauth_user_id?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collectors: {
        Row: {
          id: string
          name: string
          email: string | null
          location: string | null
          bio: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by_admin_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          location?: string | null
          bio?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by_admin_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          location?: string | null
          bio?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by_admin_id?: string | null
        }
      }
      palindromes: {
        Row: {
          id: string
          license_plate: string
          image_url: string
          image_storage_path: string
          car_type: string | null
          location_found: string | null
          date_found: string | null
          additional_notes: string | null
          collector_id: string
          uploaded_by_admin_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          license_plate: string
          image_url: string
          image_storage_path: string
          car_type?: string | null
          location_found?: string | null
          date_found?: string | null
          additional_notes?: string | null
          collector_id: string
          uploaded_by_admin_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          license_plate?: string
          image_url?: string
          image_storage_path?: string
          car_type?: string | null
          location_found?: string | null
          date_found?: string | null
          additional_notes?: string | null
          collector_id?: string
          uploaded_by_admin_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Collector = Database['public']['Tables']['collectors']['Row']
export type Palindrome = Database['public']['Tables']['palindromes']['Row']

// Insert types
export type InsertUserProfile = Database['public']['Tables']['user_profiles']['Insert']
export type InsertCollector = Database['public']['Tables']['collectors']['Insert']
export type InsertPalindrome = Database['public']['Tables']['palindromes']['Insert']

// Update types
export type UpdateUserProfile = Database['public']['Tables']['user_profiles']['Update']
export type UpdateCollector = Database['public']['Tables']['collectors']['Update']
export type UpdatePalindrome = Database['public']['Tables']['palindromes']['Update']

// Joined types for frontend use
export interface PalindromeWithCollector extends Palindrome {
  collector: Collector
  uploaded_by_admin: Pick<UserProfile, 'id' | 'name' | 'email'> | null
}

export interface CollectorWithStats extends Collector {
  total_palindromes: number
  latest_find: string | null
  earliest_find: string | null
}
