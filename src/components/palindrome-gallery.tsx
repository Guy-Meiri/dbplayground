'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PalindromeCard } from '@/components/palindrome-card'
import { mockPalindromes, mockStats } from '@/lib/mock-data'

export function PalindromeGallery() {
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
            <div className="text-2xl font-bold text-blue-600">{mockStats.totalPalindromes}</div>
            <div className="text-sm text-muted-foreground">Total Palindromes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{mockStats.activeCollectors}</div>
            <div className="text-sm text-muted-foreground">Active Collectors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{mockStats.thisMonth}</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPalindromes.map((palindrome) => (
          <PalindromeCard key={palindrome.id} palindrome={palindrome} />
        ))}
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
