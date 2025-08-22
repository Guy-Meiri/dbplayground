import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Tables, TablesInsert } from '@/types/supabase'

// Type aliases for convenience
export type Palindrome = Tables<'palindromes'>
export type Collector = Tables<'collectors'>
export type UserProfile = Tables<'user_profiles'>
export type InsertPalindrome = TablesInsert<'palindromes'>
export type InsertCollector = TablesInsert<'collectors'>

// Extended types for joined queries
export interface PalindromeWithCollector extends Palindrome {
  collector: Collector
  uploaded_by_admin: Pick<UserProfile, 'id' | 'name' | 'email'> | null
}

export interface CollectorWithStats extends Collector {
  total_palindromes: number
  latest_find: string | null
  earliest_find: string | null
}

// Query keys
export const queryKeys = {
  palindromes: ['palindromes'] as const,
  palindromesWithCollector: ['palindromes', 'with-collector'] as const,
  collectors: ['collectors'] as const,
  collectorsWithStats: ['collectors', 'with-stats'] as const,
  collector: (id: string) => ['collectors', id] as const,
}

// Palindromes queries
export function usePalindromes() {
  return useQuery({
    queryKey: queryKeys.palindromes,
    queryFn: async (): Promise<Palindrome[]> => {
      const { data, error } = await supabase
        .from('palindromes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function usePalindromesWithCollector() {
  return useQuery({
    queryKey: queryKeys.palindromesWithCollector,
    queryFn: async (): Promise<PalindromeWithCollector[]> => {
      const { data, error } = await supabase
        .from('palindromes')
        .select(`
          *,
          collector:collectors(*),
          uploaded_by_admin:user_profiles!palindromes_uploaded_by_admin_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Type assertion is safe here because we know the shape from our select
      return data as PalindromeWithCollector[]
    },
  })
}

// Collectors queries
export function useCollectors() {
  return useQuery({
    queryKey: queryKeys.collectors,
    queryFn: async (): Promise<Collector[]> => {
      const { data, error } = await supabase
        .from('collectors')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    },
  })
}

export function useCollectorsWithStats() {
  return useQuery({
    queryKey: queryKeys.collectorsWithStats,
    queryFn: async (): Promise<CollectorWithStats[]> => {
      // For now, let's use a simpler approach that works with our types
      // Get all collectors
      const { data: collectors, error: collectorsError } = await supabase
        .from('collectors')
        .select('*')
        .order('name')

      if (collectorsError) throw collectorsError

      // Get palindrome counts for each collector
      const collectorsWithStats: CollectorWithStats[] = await Promise.all(
        collectors.map(async (collector): Promise<CollectorWithStats> => {
          const { count } = await supabase
            .from('palindromes')
            .select('*', { count: 'exact', head: true })
            .eq('collector_id', collector.id)

          // Get date range for this collector
          const { data: palindromes } = await supabase
            .from('palindromes')
            .select('date_found')
            .eq('collector_id', collector.id)
            .order('date_found', { ascending: true })

          const dates = palindromes
            ?.map(p => p.date_found)
            .filter((date: string | null): date is string => Boolean(date)) || []

          return {
            ...collector,
            total_palindromes: count || 0,
            earliest_find: dates[0] || null,
            latest_find: dates[dates.length - 1] || null,
          }
        })
      )

      return collectorsWithStats
    },
  })
}

export function useCollector(id: string) {
  return useQuery({
    queryKey: queryKeys.collector(id),
    queryFn: async (): Promise<Collector> => {
      const { data, error } = await supabase
        .from('collectors')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreatePalindrome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (palindrome: InsertPalindrome): Promise<Palindrome> => {
      const { data, error } = await supabase
        .from('palindromes')
        .insert(palindrome)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.palindromes })
      queryClient.invalidateQueries({ queryKey: queryKeys.palindromesWithCollector })
      queryClient.invalidateQueries({ queryKey: queryKeys.collectorsWithStats })
    },
  })
}

export function useCreateCollector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (collector: InsertCollector): Promise<Collector> => {
      const { data, error } = await supabase
        .from('collectors')
        .insert(collector)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collectors })
      queryClient.invalidateQueries({ queryKey: queryKeys.collectorsWithStats })
    },
  })
}

export function useDeletePalindrome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('palindromes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.palindromes })
      queryClient.invalidateQueries({ queryKey: queryKeys.palindromesWithCollector })
      queryClient.invalidateQueries({ queryKey: queryKeys.collectorsWithStats })
    },
  })
}

export function useDeleteCollector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('collectors')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collectors })
      queryClient.invalidateQueries({ queryKey: queryKeys.collectorsWithStats })
    },
  })
}
