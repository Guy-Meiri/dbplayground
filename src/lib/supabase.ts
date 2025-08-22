import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is admin
export async function isUserAdmin(userProfileId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userProfileId)
      .single()

    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }

    return (data as { is_admin: boolean })?.is_admin || false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
