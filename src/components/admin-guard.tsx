'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { isUserAdmin } from '@/lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (status === 'loading') return
      
      // Check for dbId which contains the Supabase user profile ID
      if (!session?.user?.dbId) {
        console.log('User is not authenticated or no dbId found')
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        // Use dbId which is the Supabase user_profiles.id, not the NextAuth user.id
        const adminStatus = await isUserAdmin(session.user.dbId)
        setIsAdmin(adminStatus)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [session, status])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access the admin area.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have admin permissions to access this area.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
