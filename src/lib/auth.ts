import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createAdminClient } from './supabase/admin'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      // When user signs in, create/update their profile in Supabase
      if (user.email) {
        try {
          const supabaseAdmin = createAdminClient()
          
          // Check if user already exists
          const { data: existingUser } = await supabaseAdmin
            .from('user_profiles')
            .select('id')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Create new user profile
            const { error } = await supabaseAdmin
              .from('user_profiles')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  avatar_url: user.image,
                  nextauth_user_id: user.id,
                }
              ])
            
            if (error) {
              console.error('Error creating user profile:', error)
              // Don't block sign-in if database fails
            }
          } else {
            // Update existing user profile with latest info
            const { error } = await supabaseAdmin
              .from('user_profiles')
              .update({
                name: user.name,
                avatar_url: user.image,
                updated_at: new Date().toISOString(),
              })
              .eq('email', user.email)
            
            if (error) {
              console.error('Error updating user profile:', error)
            }
          }
        } catch (error) {
          console.error('Database sync error:', error)
          // Don't block sign-in if database fails
        }
      }
      
      return true // Allow sign-in to continue
    },
    
    async session({ session }) {
      // Optionally add database user info to session
      if (session.user?.email) {
        try {
          const supabaseAdmin = createAdminClient()
          const { data: userProfile } = await supabaseAdmin
            .from('user_profiles')
            .select('id, created_at')
            .eq('email', session.user.email)
            .single()
          
          if (userProfile) {
            // Add database info to session with proper typing
            session.user.dbId = userProfile.id
            session.user.memberSince = userProfile.created_at
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }
      
      return session
    },
    
    async jwt({ token, user }) {
      // Store user info in JWT token
      if (user) {
        token.userId = user.id
      }
      return token
    },
  },
})
