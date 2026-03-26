import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// --- Types ---

export interface AssociationDashboard {
  associationName: string
  membersCount: number
  pendingLinksCount: number
  productsCount: number
}

export interface ProductVariant {
  id: string
  volume: string
  price: number
}

export interface AssociationProduct {
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
  createdAt: string
  variants: ProductVariant[]
}

export interface AssociationLink {
  id: string
  patientId: string
  requestedByUserId: string
  status: string
  approvedByUserId?: string
  startDate?: string
  endDate?: string
  feeStatus?: string
  feeExpiresAt?: string
  feePaidAt?: string
  createdAt: string
}

export interface AssociationProfile {
  id: string
  name: string
  cnpj: string
  status: string
  description?: string
  region: string
  state: string
  city: string
  profileTypes: string[]
  hasAssistedAccess: boolean
  contactEmail: string
  contactPhone?: string
  website?: string
  logoUrl?: string
  membershipFee?: number
  membershipPeriod?: string
  membershipDescription?: string
}

// --- Dashboard ---

export function useAssociationDashboard() {
  return useQuery<AssociationDashboard>({
    queryKey: ['association-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/association/dashboard')
      return data
    },
  })
}

// --- Products ---

export function useAssociationProducts() {
  return useQuery<{ products: AssociationProduct[] }>({
    queryKey: ['association-products'],
    queryFn: async () => {
      const { data } = await api.get('/association/products')
      return data
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: {
      name: string
      description?: string
      type: string
      category: string
      concentration?: string
      cbd?: number
      thc?: number
      dosagePerDrop?: string
      inStock?: boolean
      imageUrl?: string
      variants: Array<{ volume: string; price: number }>
    }) => {
      const { data } = await api.post('/association/products', product)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-products'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<{
      name: string
      description: string
      type: string
      category: string
      concentration: string
      cbd: number
      thc: number
      dosagePerDrop: string
      inStock: boolean
      imageUrl: string
      variants: Array<{ volume: string; price: number }>
    }>) => {
      const { data } = await api.patch(`/association/products/${id}`, fields)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/association/products/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-products'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}

// --- Members ---

export function useAssociationMembers(status?: string) {
  return useQuery<{ links: AssociationLink[] }>({
    queryKey: ['association-members', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const { data } = await api.get(`/association/members${params}`)
      return data
    },
  })
}

export function useApproveLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      await api.patch(`/association/members/${linkId}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-members'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}

export function useRejectLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      await api.patch(`/association/members/${linkId}/reject`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-members'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      await api.delete(`/association/members/${linkId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-members'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}

// --- Profile ---

export function useAssociationProfile() {
  return useQuery<AssociationProfile>({
    queryKey: ['association-profile'],
    queryFn: async () => {
      const { data } = await api.get('/association/profile')
      return data
    },
  })
}

export function useUpdateAssociationProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (fields: Partial<{
      description: string
      contactEmail: string
      contactPhone: string
      website: string
      logoUrl: string
      membershipFee: number
      membershipPeriod: string
      membershipDescription: string
    }>) => {
      const { data } = await api.patch('/association/profile', fields)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-profile'] })
      queryClient.invalidateQueries({ queryKey: ['association-dashboard'] })
    },
  })
}
