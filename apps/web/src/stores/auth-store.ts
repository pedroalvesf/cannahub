import { create } from 'zustand'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/query-client'

interface User {
  id: string
  email: string
  name?: string
  accountType?: string
  accountStatus?: string
  verificationStatus?: string
  status?: 'pending' | 'approved' | 'rejected'
  phone?: string
  cpf?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
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
    if (token && userData) {
      set({ isAuthenticated: true, user: JSON.parse(userData) })

      api.get('/auth/me').then(({ data }) => {
        const user: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          accountType: data.accountType,
          accountStatus: data.accountStatus,
          verificationStatus: data.verificationStatus,
          status: data.accountStatus as 'pending' | 'approved' | 'rejected',
          phone: data.phone,
          cpf: data.cpf,
        }
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
      }).catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        set({ isAuthenticated: false, user: null })
      })
    }
  },
}))
