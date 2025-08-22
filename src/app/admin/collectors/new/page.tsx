'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCreateCollector } from '@/lib/api'

// Form validation schema
const collectorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  bio: z.string().max(1000, 'Bio must be 1000 characters or less').optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
})

type CollectorFormData = z.infer<typeof collectorSchema>

export default function NewCollector() {
  const { data: session } = useSession()
  const router = useRouter()
  const createCollector = useCreateCollector()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectorFormData>({
    resolver: zodResolver(collectorSchema),
  })

  const onSubmit = async (data: CollectorFormData) => {
    if (!session?.user?.dbId) {
      alert('User session not found')
      return
    }

    setIsSubmitting(true)
    try {
      await createCollector.mutateAsync({
        name: data.name,
        email: data.email || null,
        location: data.location || null,
        bio: data.bio || null,
        notes: data.notes || null,
        created_by_admin_id: session.user.dbId,
      })

      alert('Collector created successfully!')
      router.push('/admin/collectors')
    } catch (error) {
      console.error('Error creating collector:', error)
      alert('Error creating collector. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Collector</h1>
          <p className="text-muted-foreground">
            Create a new collector profile for palindrome discoveries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Collector Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., John Smith"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="john.smith@example.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Optional - used for contact and notifications
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., New York, NY"
                />
                {errors.location && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.location.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Where this collector is primarily based
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about this collector's background and interests..."
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.bio.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Public bio that will be displayed with their findings
                </p>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Internal notes about this collector (not public)..."
                  rows={3}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.notes.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Private notes visible only to admins
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Collector
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info/Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Collector Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What is a collector?</h4>
              <p className="text-sm text-muted-foreground">
                Collectors are virtual identities that represent people who find palindromic license plates. 
                They can be real people or fictional characters used to organize discoveries.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Required Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Name:</strong> Full name or alias of the collector</li>
                <li>• All other fields are optional</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use real names when possible</li>
                <li>• Include location for better context</li>
                <li>• Write engaging bios for public display</li>
                <li>• Use admin notes for tracking information</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Privacy</h4>
              <p className="text-sm text-muted-foreground">
                Only the name, location, and bio are publicly visible. 
                Email addresses and admin notes remain private.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
