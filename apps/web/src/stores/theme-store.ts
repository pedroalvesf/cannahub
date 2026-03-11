import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  hydrate: () => void
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyToDOM(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  resolved: 'light',

  setTheme: (theme) => {
    localStorage.setItem('cannahub-theme', theme)
    const resolved = resolveTheme(theme)
    applyToDOM(resolved)
    set({ theme, resolved })
  },

  hydrate: () => {
    const stored = localStorage.getItem('cannahub-theme') as Theme | null
    const theme = stored ?? 'light'
    const resolved = resolveTheme(theme)
    applyToDOM(resolved)
    set({ theme, resolved })

    if (theme === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newResolved = e.matches ? 'dark' : 'light'
        applyToDOM(newResolved)
        set({ resolved: newResolved })
      })
    }
  },
}))
