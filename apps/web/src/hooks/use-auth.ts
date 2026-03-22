import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore, type User } from '@/stores/auth-store'

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

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Após autenticar, busca o perfil completo via GET /auth/me.
 * Isso garante que roles, status granulares e todos os campos
 * estejam disponíveis no store desde o primeiro render.
 */
async function loginAndFetchProfile(tokens: AuthTokens): Promise<{ tokens: AuthTokens; user: User }> {
  // Salva tokens primeiro para que o interceptor do axios funcione
  localStorage.setItem('accessToken', tokens.accessToken)
  localStorage.setItem('refreshToken', tokens.refreshToken)

  const { data } = await api.get('/auth/me')

  return {
    tokens,
    user: {
      id: data.id,
      email: data.email,
      name: data.name,
      accountType: data.accountType,
      accountStatus: data.accountStatus,
      onboardingStatus: data.onboardingStatus,
      documentsStatus: data.documentsStatus,
      verificationStatus: data.verificationStatus,
      phone: data.phone,
      cpf: data.cpf,
      roles: data.roles ?? [],
    },
  }
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const { data: res } = await api.post<AuthTokens & { user: unknown }>('/login', data)
      return loginAndFetchProfile({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    },
    onSuccess: ({ tokens, user }) => {
      login(tokens.accessToken, tokens.refreshToken, user)
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const { data: res } = await api.post<AuthTokens & { user: unknown }>('/auth/user', data)
      return loginAndFetchProfile({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    },
    onSuccess: ({ tokens, user }) => {
      login(tokens.accessToken, tokens.refreshToken, user)
    },
  })
}
