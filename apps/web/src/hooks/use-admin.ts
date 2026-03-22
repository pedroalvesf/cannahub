import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface AdminUser {
  id: string
  email: string
  name?: string
  cpf?: string
  accountType?: string
  accountStatus: string
  onboardingStatus: string
  documentsStatus: string
  createdAt: string
}

interface AdminUsersResponse {
  users: AdminUser[]
  total: number
  page: number
  perPage: number
}

interface AdminUserDetail {
  user: AdminUser & { phone?: string }
  onboarding: {
    status: string
    condition?: string
    experience?: string
    currentAccessMethod?: string
    preferredForm?: string
    hasPrescription?: boolean
    assistedAccess?: boolean
    summary?: string
  } | null
  documents: {
    id: string
    type: string
    url: string
    status: string
    rejectionReason?: string
    reviewedBy?: string
    reviewedAt?: string
    createdAt: string
  }[]
}

interface AdminUsersFilters {
  accountStatus?: string
  accountType?: string
  search?: string
  page?: number
  perPage?: number
}

export function useAdminUsers(filters: AdminUsersFilters = {}) {
  return useQuery<AdminUsersResponse>({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.accountStatus) params.set('accountStatus', filters.accountStatus)
      if (filters.accountType) params.set('accountType', filters.accountType)
      if (filters.search) params.set('search', filters.search)
      if (filters.page) params.set('page', String(filters.page))
      if (filters.perPage) params.set('perPage', String(filters.perPage))
      const { data } = await api.get(`/admin/users?${params.toString()}`)
      return data
    },
  })
}

export function useAdminUserDetail(id: string) {
  return useQuery<AdminUserDetail>({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useApproveDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (documentId: string) => {
      await api.patch(`/admin/documents/${documentId}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useRejectDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ documentId, reason }: { documentId: string; reason: string }) => {
      await api.patch(`/admin/documents/${documentId}/reject`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, accountStatus }: { userId: string; accountStatus: 'approved' | 'rejected' }) => {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useDeleteUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userIds: string[]) => {
      await api.delete('/admin/users', { data: { userIds } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
