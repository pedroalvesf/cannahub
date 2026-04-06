import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// --- Types ---

interface DiarySymptom {
  id: string
  symptomKey: string
  customSymptomName: string | null
  severityBefore: string
  severityAfter: string | null
}

interface DiaryEffect {
  id: string
  effectKey: string
  isPositive: boolean
  customEffectName: string | null
}

interface DiaryEntry {
  id: string
  date: string
  time: string
  productId: string | null
  customProductName: string | null
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  notes: string | null
  isFavorite: boolean
  symptoms: DiarySymptom[]
  effects: DiaryEffect[]
  createdAt: string
  updatedAt?: string
}

interface DiaryEntriesResponse {
  entries: DiaryEntry[]
  total: number
}

interface DiaryFavorite {
  id: string
  name: string
  productId: string | null
  customProductName: string | null
  administrationMethod: string
  doseAmount: number
  doseUnit: string
  symptomKeys: string[]
  createdAt: string
}

interface DiaryFavoritesResponse {
  favorites: DiaryFavorite[]
}

interface SymptomDelta {
  symptomKey: string
  avgSeverityBefore: number
  avgSeverityAfter: number | null
}

interface DiarySummary {
  totalEntries: number
  mostFrequentSymptoms: Array<{ symptomKey: string; count: number }>
  mostUsedProduct: { name: string; count: number } | null
  symptomDeltas: SymptomDelta[]
  methodDistribution: Record<string, number>
}

interface TrendDataPoint {
  date: string
  avgSeverityBefore: number
  avgSeverityAfter: number | null
  entryCount: number
}

interface SymptomTrendResponse {
  dataPoints: TrendDataPoint[]
}

interface DiaryEntriesFilters {
  page?: number
  perPage?: number
  dateFrom?: string
  dateTo?: string
  productId?: string
  administrationMethod?: string
  symptomKey?: string
}

// --- Entries ---

export function useDiaryEntries(filters: DiaryEntriesFilters = {}) {
  return useQuery<DiaryEntriesResponse>({
    queryKey: ['diary-entries', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.page) params.set('page', String(filters.page))
      if (filters.perPage) params.set('perPage', String(filters.perPage))
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.set('dateTo', filters.dateTo)
      if (filters.productId) params.set('productId', filters.productId)
      if (filters.administrationMethod) params.set('administrationMethod', filters.administrationMethod)
      if (filters.symptomKey) params.set('symptomKey', filters.symptomKey)
      const { data } = await api.get(`/diary?${params.toString()}`)
      return data
    },
  })
}

export function useDiaryEntry(id: string | undefined) {
  return useQuery<DiaryEntry>({
    queryKey: ['diary-entry', id],
    queryFn: async () => {
      const { data } = await api.get(`/diary/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      date: string
      time: string
      productId?: string
      customProductName?: string
      administrationMethod: string
      doseAmount: number
      doseUnit: string
      notes?: string
      symptoms?: Array<{ symptomKey: string; customSymptomName?: string; severityBefore: string }>
      effects?: Array<{ effectKey: string; isPositive: boolean; customEffectName?: string }>
    }) => {
      const { data } = await api.post('/diary', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] })
      queryClient.invalidateQueries({ queryKey: ['diary-summary'] })
    },
  })
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string
      date?: string
      time?: string
      productId?: string | null
      customProductName?: string | null
      administrationMethod?: string
      doseAmount?: number
      doseUnit?: string
      notes?: string | null
      isFavorite?: boolean
      severityAfterUpdates?: Array<{ symptomLogId: string; severityAfter: string }>
    }) => {
      const { data } = await api.patch(`/diary/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] })
      queryClient.invalidateQueries({ queryKey: ['diary-entry'] })
      queryClient.invalidateQueries({ queryKey: ['diary-summary'] })
    },
  })
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/diary/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] })
      queryClient.invalidateQueries({ queryKey: ['diary-summary'] })
    },
  })
}

// --- Favorites ---

export function useDiaryFavorites() {
  return useQuery<DiaryFavoritesResponse>({
    queryKey: ['diary-favorites'],
    queryFn: async () => {
      const { data } = await api.get('/diary/favorites')
      return data
    },
  })
}

export function useCreateDiaryFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      name: string
      productId?: string
      customProductName?: string
      administrationMethod: string
      doseAmount: number
      doseUnit: string
      symptomKeys: string[]
    }) => {
      const { data } = await api.post('/diary/favorites', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-favorites'] })
    },
  })
}

export function useDeleteDiaryFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/diary/favorites/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-favorites'] })
    },
  })
}

export function useLogFromFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      favoriteId,
      date,
      time,
    }: {
      favoriteId: string
      date: string
      time: string
    }) => {
      const { data } = await api.post(`/diary/favorites/${favoriteId}/log`, {
        date,
        time,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] })
      queryClient.invalidateQueries({ queryKey: ['diary-summary'] })
    },
  })
}

// --- Insights ---

export function useDiarySummary(dateFrom?: string, dateTo?: string) {
  return useQuery<DiarySummary>({
    queryKey: ['diary-summary', dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      const { data } = await api.get(`/diary/summary?${params.toString()}`)
      return data
    },
  })
}

export function useSymptomTrend(key: string, dateFrom: string, dateTo: string) {
  return useQuery<SymptomTrendResponse>({
    queryKey: ['symptom-trend', key, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ dateFrom, dateTo })
      const { data } = await api.get(
        `/diary/symptoms/${key}/trend?${params.toString()}`,
      )
      return data
    },
    enabled: !!key && !!dateFrom && !!dateTo,
  })
}
