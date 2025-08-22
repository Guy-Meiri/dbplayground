'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Camera, Database } from 'lucide-react'
import Link from 'next/link'
import { usePalindromes, useCollectors } from '@/lib/api'

export default function AdminDashboard() {
  const { data: palindromes, isLoading: palindromesLoading } = usePalindromes()
  const { data: collectors, isLoading: collectorsLoading } = useCollectors()

  const isLoading = palindromesLoading || collectorsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage palindromes and collectors
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Palindromes</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : palindromes?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              License plates uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collectors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : collectors?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered collectors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : 'Online'}
            </div>
            <p className="text-xs text-muted-foreground">
              Supabase connected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Palindrome
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add a new palindromic license plate to the collection
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/admin/upload">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Palindrome
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Collectors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage collector profiles
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/collectors/new">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Collector
                </Button>
              </Link>
              <Link href="/admin/collectors">
                <Button className="w-full" variant="secondary">
                  View All Collectors
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Palindromes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest uploads to the collection
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : palindromes && palindromes.length > 0 ? (
            <div className="space-y-2">
              {palindromes.slice(0, 5).map((palindrome) => (
                <div
                  key={palindrome.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <div className="font-mono font-semibold">
                      {palindrome.license_plate}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {palindrome.location_found || 'Location not specified'}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {palindrome.created_at ? new Date(palindrome.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No palindromes uploaded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
