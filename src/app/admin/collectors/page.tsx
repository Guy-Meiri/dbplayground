'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Users, MapPin, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useCollectorsWithStats } from '@/lib/api'

export default function CollectorsList() {
  const { data: collectors, isLoading, error } = useCollectorsWithStats()

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collectors</h1>
            <p className="text-muted-foreground">Manage collector profiles</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading collectors. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collectors</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${collectors?.length || 0} collectors`}
            </p>
          </div>
        </div>
        
        <Link href="/admin/collectors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Collector
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted/60 rounded animate-pulse w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 bg-muted/60 rounded animate-pulse w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Collectors Grid */}
      {!isLoading && collectors && (
        <>
          {collectors.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Collectors Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first collector to the system.
                  </p>
                  <Link href="/admin/collectors/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Collector
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectors.map((collector) => (
                <Card key={collector.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{collector.name}</CardTitle>
                        {collector.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {collector.location}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {collector.total_palindromes} found
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Bio */}
                    {collector.bio && (
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {collector.bio}
                        </p>
                      </div>
                    )}

                    {/* Email */}
                    {collector.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{collector.email}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {collector.total_palindromes}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Palindromes
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {collector.latest_find ? (
                            new Date(collector.latest_find).toLocaleDateString()
                          ) : (
                            'No finds'
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Latest Find
                        </div>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                      <Calendar className="h-3 w-3" />
                      Created {collector.created_at ? new Date(collector.created_at).toLocaleDateString() : 'Unknown'}
                    </div>

                    {/* Admin Notes (if any) */}
                    {collector.notes && (
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <div className="font-medium text-muted-foreground mb-1">Admin Notes:</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {collector.notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
