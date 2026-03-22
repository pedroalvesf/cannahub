import { create } from 'zustand'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/query-client'

export interface User {
  id: string
  email: string
  name?: string
  accountType?: string
  accountStatus?: string
  onboardingStatus?: string
  documentsStatus?: string
  verificationStatus?: string
  phone?: string
  cpf?: string
  roles?: string[]
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  /** Restaura sessão do localStorage e sincroniza com a API. */
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    queryClient.clear()
    set({ isAuthenticated: true, user })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    queryClient.clear()
    set({ isAuthenticated: false, user: null })
  },

  hydrate: () => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (!token || !userData) return

    // Restaura do localStorage para render imediato
    const storedUser = JSON.parse(userData) as User
    set({ isAuthenticated: true, user: storedUser })

    // Sincroniza com a API em background para dados atualizados
    api.get('/auth/me').then(({ data }) => {
      const freshUser: User = {
        id: data.id,
        email: data.email,
        name: data.name ?? storedUser.name,
        accountType: data.accountType ?? storedUser.accountType,
        accountStatus: data.accountStatus ?? storedUser.accountStatus,
        onboardingStatus: data.onboardingStatus ?? storedUser.onboardingStatus,
        documentsStatus: data.documentsStatus ?? storedUser.documentsStatus,
        verificationStatus: data.verificationStatus ?? storedUser.verificationStatus,
        phone: data.phone ?? storedUser.phone,
        cpf: data.cpf ?? storedUser.cpf,
        roles: data.roles ?? storedUser.roles ?? [],
      }
      localStorage.setItem('user', JSON.stringify(freshUser))
      set({ user: freshUser })
    }).catch(() => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      set({ isAuthenticated: false, user: null })
    })
  },
}))
