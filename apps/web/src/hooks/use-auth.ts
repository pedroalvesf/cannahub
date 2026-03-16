import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
  accountType?: string
  phone?: string
  cpf?: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
    accountType?: string
    accountStatus: string
    verificationStatus: string
  }
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      const { data: res } = await api.post<AuthResponse>('/login', data)
      return res
    },
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        verificationStatus: data.user.verificationStatus,
        status: data.user.accountStatus as 'pending' | 'approved' | 'rejected',
      })
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data) => {
      const { data: res } = await api.post<AuthResponse>('/auth/user', data)
      return res
    },
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        accountType: data.user.accountType,
        accountStatus: data.user.accountStatus,
        verificationStatus: data.user.verificationStatus,
        status: data.user.accountStatus as 'pending' | 'approved' | 'rejected',
      })
    },
  })
}
