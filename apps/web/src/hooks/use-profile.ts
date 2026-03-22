import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

interface UpdateProfileRequest {
  name?: string
  phone?: string
  cpf?: string
}

export function useUpdateProfile() {
  const login = useAuthStore((s) => s.login)
  const currentUser = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const { data: res } = await api.put('/auth/profile', data)
      return res
    },
    onSuccess: (data) => {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const refreshToken = localStorage.getItem('refreshToken') ?? ''

      // Atualiza os campos editáveis, preserva o restante do user atual
      login(accessToken, refreshToken, {
        ...currentUser,
        id: data.id,
        email: data.email,
        name: data.name,
        accountType: data.accountType,
        accountStatus: data.accountStatus,
        verificationStatus: data.verificationStatus,
        phone: data.phone,
        cpf: data.cpf,
      })
    },
  })
}
