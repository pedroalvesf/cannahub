import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface MyLink {
  id: string
  associationId: string
  associationName: string
  status: string
  feeStatus?: string
  feeExpiresAt?: string
  startDate?: string
  createdAt: string
}

export function useMyLinks() {
  return useQuery<{ links: MyLink[] }>({
    queryKey: ['my-links'],
    queryFn: async () => {
      const { data } = await api.get('/my-links')
      return data
    },
  })
}

export interface AssociationProductAPI {
  id: string
  name: string
  description?: string
  type: string
  category: string
  concentration?: string
  cbd: number
  thc: number
  dosagePerDrop?: string
  inStock: boolean
  imageUrl?: string
  variants: Array<{ id: string; volume: string; price: number }>
}

export function useAssociationProducts(associationId?: string) {
  return useQuery<{ products: AssociationProductAPI[] }>({
    queryKey: ['association-products', associationId],
    queryFn: async () => {
      const { data } = await api.get(`/associations/${associationId}/products`)
      return data
    },
    enabled: !!associationId,
  })
}

export function useAssociationProductTypes(associationId?: string) {
  return useQuery<{ types: string[]; categories: string[]; totalProducts: number }>({
    queryKey: ['association-product-types', associationId],
    queryFn: async () => {
      const { data } = await api.get(`/associations/${associationId}/product-types`)
      return data
    },
    enabled: !!associationId,
  })
}

export function useRequestAssociationLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (associationId: string) => {
      const { data } = await api.post(`/associations/${associationId}/link`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-links'] })
      queryClient.invalidateQueries({ queryKey: ['association-members'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}
