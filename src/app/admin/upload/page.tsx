'use client'

import { useState, useRef } from 'react'
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
import { ArrowLeft, Upload, AlertCircle, ImagePlus, X } from 'lucide-react'
import Link from 'next/link'
import { useCollectors, useCreatePalindrome, useUploadImage } from '@/lib/api'
import { isPalindrome } from '@/lib/palindrome-utils'
import Image from 'next/image'

// Form validation schema
const palindromeSchema = z.object({
  license_plate: z
    .string()
    .min(1, 'License plate is required')
    .max(20, 'License plate must be 20 characters or less')
    .refine((val) => isPalindrome(val), 'License plate must be a palindrome'),
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
  const uploadImage = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: PalindromeFormData) => {
    if (!session?.user?.dbId) {
      alert('User session not found')
      return
    }

    if (!selectedFile) {
      alert('Please select an image file')
      return
    }

    setIsSubmitting(true)
    try {
      // First upload the image
      const uploadResult = await uploadImage.mutateAsync({
        file: selectedFile,
        bucket: 'images'
      })

      // Then create the palindrome record with the uploaded image info
      await createPalindrome.mutateAsync({
        ...data,
        image_url: uploadResult.publicUrl,
        image_storage_path: uploadResult.path,
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image_file">Image File *</Label>
                <div className="space-y-4">
                  {/* File Input */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image_file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {selectedFile ? 'Change Image' : 'Select Image'}
                    </Button>
                  </div>

                  {/* File Info & Preview */}
                  {selectedFile && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Image Preview */}
                      {previewUrl && (
                        <div className="relative aspect-video w-full max-w-sm mx-auto bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Select an image file (JPG, PNG, GIF). Max size: 5MB
                    </p>
                  )}
                </div>
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
                disabled={isSubmitting || !collectorId || !selectedFile}
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
                <li>• Supported formats: JPG, PNG, GIF</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Images are automatically stored securely</li>
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
