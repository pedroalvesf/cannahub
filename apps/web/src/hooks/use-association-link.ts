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

export interface PublicProductVariant {
  id: string
  volume: string
  price: number
}

export interface PublicAssociationProduct {
  id: string
  name: string
  description: string
  type: string
  category: string
  concentration: string
  cbd: number
  thc: number
  dosagePerDrop?: string | null
  inStock: boolean
  imageUrl?: string | null
  createdAt: string
  variants: PublicProductVariant[]
}

export function usePublicAssociationProducts(associationId?: string) {
  return useQuery<{ products: PublicAssociationProduct[] }>({
    queryKey: ['association-products-public', associationId],
    queryFn: async () => {
      const { data } = await api.get(`/associations/${associationId}/products`)
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
