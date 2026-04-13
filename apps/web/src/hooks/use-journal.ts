import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type JournalVisibility = 'private' | 'shareable'

export interface JournalEntry {
  id: string
  entryDate: string
  mood: number | null
  symptoms: string[]
  symptomIntensity: number | null
  medicationTaken: boolean
  dosage: string | null
  sideEffects: string[]
  notes: string | null
  visibility: JournalVisibility
  createdAt: string
  updatedAt: string
}

export interface JournalEntryInput {
  entryDate: string
  mood?: number
  symptoms?: string[]
  symptomIntensity?: number
  medicationTaken?: boolean
  dosage?: string
  sideEffects?: string[]
  notes?: string
  visibility?: JournalVisibility
}

export function useJournalEntries() {
  return useQuery<{ entries: JournalEntry[] }>({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data } = await api.get('/journal')
      return data
    },
  })
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: JournalEntryInput) => {
      const { data } = await api.post('/journal', input)
      return data as { entry: JournalEntry }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: { id: string } & Partial<JournalEntryInput>) => {
      const { data } = await api.patch(`/journal/${id}`, input)
      return data as { entry: JournalEntry }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/journal/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}
