import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: { id: string; email: string; name?: string } | null
  login: (accessToken: string, refreshToken: string, user: { id: string; email: string; name?: string }) => void
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
    set({ isAuthenticated: true, user })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: null })
  },

  hydrate: () => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      set({ isAuthenticated: true, user: JSON.parse(userData) })
    }
  },
}))
