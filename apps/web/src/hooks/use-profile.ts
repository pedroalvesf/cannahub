import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

interface UpdateProfileRequest {
  name?: string
  phone?: string
  cpf?: string
}

interface ProfileResponse {
  id: string
  email: string
  name?: string
  phone?: string
  cpf?: string
  accountType?: string
  accountStatus: string
  verificationStatus: string
}

export function useUpdateProfile() {
  const { login } = useAuthStore.getState()

  return useMutation<ProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: async (data) => {
      const { data: res } = await api.put<ProfileResponse>('/auth/profile', data)
      return res
    },
    onSuccess: (data) => {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const refreshToken = localStorage.getItem('refreshToken') ?? ''
      login(accessToken, refreshToken, {
        id: data.id,
        email: data.email,
        name: data.name,
        accountType: data.accountType,
        accountStatus: data.accountStatus,
        verificationStatus: data.verificationStatus,
        status: data.accountStatus as 'pending' | 'approved' | 'rejected',
        phone: data.phone,
        cpf: data.cpf,
      })
    },
  })
}
