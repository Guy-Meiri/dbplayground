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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCollectors, useCreatePalindrome } from '@/lib/api'
import { isPalindrome } from '@/lib/palindrome-utils'

// Form validation schema
const palindromeSchema = z.object({
  license_plate: z
    .string()
    .min(1, 'License plate is required')
    .max(20, 'License plate must be 20 characters or less')
    .refine((val) => isPalindrome(val), 'License plate must be a palindrome'),
  image_url: z.string().url('Please enter a valid image URL'),
  image_storage_path: z.string().min(1, 'Storage path is required'),
  car_type: z.string().optional(),
  location_found: z.string().optional(),
  date_found: z.string().optional(),
  additional_notes: z.string().optional(),
  collector_id: z.string().min(1, 'Please select a collector'),
})

type PalindromeFormData = z.infer<typeof palindromeSchema>

export default function UploadPalindrome() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: collectors, isLoading: collectorsLoading } = useCollectors()
  const createPalindrome = useCreatePalindrome()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PalindromeFormData>({
    resolver: zodResolver(palindromeSchema),
  })

  const licenseplate = watch('license_plate')
  const collectorId = watch('collector_id')

  const onSubmit = async (data: PalindromeFormData) => {
    if (!session?.user?.dbId) {
      alert('User session not found')
      return
    }

    setIsSubmitting(true)
    try {
      await createPalindrome.mutateAsync({
        ...data,
        uploaded_by_admin_id: session.user.dbId,
        date_found: data.date_found || null,
        car_type: data.car_type || null,
        location_found: data.location_found || null,
        additional_notes: data.additional_notes || null,
      })

      alert('Palindrome uploaded successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error uploading palindrome:', error)
      alert('Error uploading palindrome. Please try again.')
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
          <h1 className="text-3xl font-bold text-foreground">Upload Palindrome</h1>
          <p className="text-muted-foreground">
            Add a new palindromic license plate to the collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Palindrome Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* License Plate */}
              <div className="space-y-2">
                <Label htmlFor="license_plate">License Plate *</Label>
                <Input
                  id="license_plate"
                  {...register('license_plate')}
                  placeholder="e.g., MOM, 12321, RACECAR"
                  className="font-mono"
                />
                {errors.license_plate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.license_plate.message}
                  </p>
                )}
                {licenseplate && (
                  <p className="text-sm text-muted-foreground">
                    {isPalindrome(licenseplate) ? (
                      <span className="text-green-600">✓ Valid palindrome</span>
                    ) : (
                      <span className="text-red-600">✗ Not a palindrome</span>
                    )}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  {...register('image_url')}
                  placeholder="https://example.com/car-image.jpg"
                  type="url"
                />
                {errors.image_url && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image_url.message}
                  </p>
                )}
              </div>

              {/* Storage Path */}
              <div className="space-y-2">
                <Label htmlFor="image_storage_path">Storage Path *</Label>
                <Input
                  id="image_storage_path"
                  {...register('image_storage_path')}
                  placeholder="palindromes/2024/image-123.jpg"
                />
                {errors.image_storage_path && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image_storage_path.message}
                  </p>
                )}
              </div>

              {/* Collector */}
              <div className="space-y-2">
                <Label htmlFor="collector_id">Collector *</Label>
                <Select onValueChange={(value) => setValue('collector_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collector" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectorsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading collectors...
                      </SelectItem>
                    ) : collectors?.length ? (
                      collectors.map((collector) => (
                        <SelectItem key={collector.id} value={collector.id}>
                          {collector.name}
                          {collector.location && ` (${collector.location})`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No collectors found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.collector_id && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.collector_id.message}
                  </p>
                )}
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="car_type">Car Type</Label>
                  <Input
                    id="car_type"
                    {...register('car_type')}
                    placeholder="e.g., Toyota Prius"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_found">Date Found</Label>
                  <Input
                    id="date_found"
                    {...register('date_found')}
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_found">Location Found</Label>
                <Input
                  id="location_found"
                  {...register('location_found')}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  {...register('additional_notes')}
                  placeholder="Any additional details about this palindrome..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !collectorId}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Palindrome
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help/Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Uploading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What makes a palindrome?</h4>
              <p className="text-sm text-muted-foreground">
                A palindrome reads the same forwards and backwards. Examples: MOM, DAD, 12321, RACECAR.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Image Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use clear, high-quality photos</li>
                <li>• Ensure license plate is clearly visible</li>
                <li>• Include the full vehicle if possible</li>
                <li>• Avoid blurry or dark images</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Need to add a collector?</h4>
              <p className="text-sm text-muted-foreground mb-2">
                If the collector isn&apos;t in the list, create them first.
              </p>
              <Link href="/admin/collectors/new">
                <Button variant="outline" size="sm">
                  Add New Collector
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
