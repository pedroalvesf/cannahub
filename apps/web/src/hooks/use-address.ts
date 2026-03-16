import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface AddressData {
  street: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export function useAddress() {
  return useQuery<AddressData | null>({
    queryKey: ['address'],
    queryFn: async () => {
      const { data } = await api.get('/auth/address')
      return data.address ?? null
    },
    retry: false,
  })
}

export function useSaveAddress() {
  const queryClient = useQueryClient()
  return useMutation<{ address: AddressData }, Error, AddressData>({
    mutationFn: async (payload) => {
      const { data } = await api.put('/auth/address', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address'] })
    },
  })
}
