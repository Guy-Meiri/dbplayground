'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PalindromeCard } from '@/components/palindrome-card'
import { usePalindromesWithCollector } from '@/lib/api'

export function PalindromeGallery() {
  const { data: palindromes, isLoading, error } = usePalindromesWithCollector()

  // Calculate stats from real data
  const stats = palindromes ? {
    totalPalindromes: palindromes.length,
    activeCollectors: new Set(palindromes.map(p => p.collector_id)).size,
    thisMonth: palindromes.filter(p => {
      if (!p.created_at) return false
      const created = new Date(p.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  } : { totalPalindromes: 0, activeCollectors: 0, thisMonth: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Palindrome License Plates</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover palindromic license plates found by collectors around the world. 
          From simple patterns like &quot;MOM&quot; to complex sequences like &quot;12321&quot;.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? '...' : stats.totalPalindromes}
            </div>
            <div className="text-sm text-muted-foreground">Total Palindromes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : stats.activeCollectors}
            </div>
            <div className="text-sm text-muted-foreground">Active Collectors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? '...' : stats.thisMonth}
            </div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted/60 rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <div className="text-red-600 mb-2">Error loading palindromes</div>
            <div className="text-sm text-muted-foreground">Please try again later</div>
          </div>
        ) : palindromes && palindromes.length > 0 ? (
          palindromes.map((palindrome) => (
            <PalindromeCard key={palindrome.id} palindrome={palindrome} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-muted-foreground mb-2">No palindromes found</div>
            <div className="text-sm text-muted-foreground">
              Check back later for new discoveries!
            </div>
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Spotted a palindromic license plate? Help us grow the collection!
        </p>
        <p className="text-sm text-muted-foreground">
          Contact an admin to submit your finds.
        </p>
      </div>
    </div>
  )
}
