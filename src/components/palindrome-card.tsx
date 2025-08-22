'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MockPalindrome } from '@/lib/mock-data'

interface PalindromeCardProps {
  palindrome: MockPalindrome
}

export function PalindromeCard({ palindrome }: PalindromeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        {/* Placeholder for car image */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {palindrome.license_plate}
            </div>
            <div className="text-sm text-blue-500">Car Photo Coming Soon</div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="font-mono text-lg">
            {palindrome.license_plate}
          </Badge>
          <span className="text-sm text-gray-500">
            {new Date(palindrome.date_found).toLocaleDateString()}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Found by:</span>
            <span className="font-medium">{palindrome.collector_name}</span>
          </div>
          {palindrome.location_found && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="text-gray-900">{palindrome.location_found}</span>
            </div>
          )}
          {palindrome.car_type && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Vehicle:</span>
              <span className="text-gray-900">{palindrome.car_type}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
