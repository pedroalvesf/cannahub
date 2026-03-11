import { useThemeStore } from '@/stores/theme-store'

const icons = {
  light: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  dark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
}

const labels = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
}

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  function cycle() {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(theme)
    const next = order[(currentIndex + 1) % order.length] ?? 'light'
    setTheme(next)
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Tema: ${labels[theme]}`}
      title={`Tema: ${labels[theme]}. Clique para alternar.`}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300 hover:bg-brand-green-pale dark:hover:bg-gray-800/50 transition-colors"
    >
      {icons[theme]}
      <span className="text-[11px] font-medium hidden sm:inline">{labels[theme]}</span>
    </button>
  )
}
