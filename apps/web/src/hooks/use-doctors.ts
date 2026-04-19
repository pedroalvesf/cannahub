import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface DirectoryDoctor {
  id: string
  slug: string
  name: string
  crm: string
  state: string
  city: string | null
  specialties: string[]
  telemedicine: boolean
  inPerson: boolean
  bio: string | null
  photoUrl: string | null
  consultationFee: string | null
  contactInfo: Record<string, unknown>
}

export interface DoctorFilters {
  state?: string
  specialty?: string
  modality?: 'telemedicine' | 'in_person'
}

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery<{ doctors: DirectoryDoctor[] }>({
    queryKey: ['doctors', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.state) params.set('state', filters.state)
      if (filters.specialty) params.set('specialty', filters.specialty)
      if (filters.modality) params.set('modality', filters.modality)
      const qs = params.toString()
      const { data } = await api.get(`/doctors${qs ? `?${qs}` : ''}`)
      return data
    },
  })
}

export function useDoctor(slug?: string) {
  return useQuery<{ doctor: DirectoryDoctor }>({
    queryKey: ['doctor', slug],
    queryFn: async () => {
      const { data } = await api.get(`/doctors/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
