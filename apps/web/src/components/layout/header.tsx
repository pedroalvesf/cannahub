import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.roles?.includes('admin')

  function handleLogout() {
    logout()
    window.location.href = '/'
  }

  const navLinkClass = 'text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline'
  const mobileNavLinkClass = 'block text-[15px] font-medium text-brand-green-deep dark:text-gray-200 py-2.5 no-underline'

  return (
    <nav className="fixed top-0 left-0 w-full bg-brand-white/[0.92] dark:bg-surface-dark/90 backdrop-blur-[12px] border-b border-brand-green-light/10 dark:border-gray-700/40 px-6 py-3.5 z-[100] shadow-nav animate-fade-down">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-[9px] no-underline">
        <div className="w-[26px] h-[26px] bg-brand-green-deep rounded-[80%_0_80%_0] rotate-[15deg]" />
        <span className="font-serif text-xl text-brand-green-deep dark:text-white">
          CannHub
        </span>
      </Link>

      {/* Nav links — desktop */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <Link to="/#como-funciona" className={navLinkClass}>
            Como funciona
          </Link>
        </li>
        <li>
          <Link to="/#para-quem" className={navLinkClass}>
            Para quem
          </Link>
        </li>
        <li>
          <Link to="/#seguranca" className={navLinkClass}>
            Segurança
          </Link>
        </li>
        <li>
          <Link to="/tratamentos" className={navLinkClass}>
            Tratamentos
          </Link>
        </li>
        <li>
          <Link to="/associacoes" className={navLinkClass}>
            Associações
          </Link>
        </li>
        <li>
          <Link to="/legislacao" className={navLinkClass}>
            Legislação
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>

      {/* Actions — desktop */}
      <div className="hidden md:flex items-center gap-2.5">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Link
                to="/admin/usuarios"
                className="text-sm font-medium text-amber-700 dark:text-amber-400 px-4 py-2 rounded-btn hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors no-underline"
              >
                Admin
              </Link>
            )}
            <Link
              to="/painel"
              className="text-sm font-medium text-brand-green-deep dark:text-brand-green-light px-4 py-2 rounded-btn hover:bg-brand-green-pale dark:hover:bg-gray-800 transition-colors no-underline"
            >
              Meu painel
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-brand-green-deep px-4 py-2 rounded-btn hover:bg-brand-green-pale transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-brand-green-deep dark:text-gray-300 bg-transparent px-4 py-2 rounded-btn hover:bg-brand-green-pale dark:hover:bg-gray-800 transition-colors no-underline"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro?redirect=/acolhimento"
              className="text-sm font-semibold text-brand-white bg-brand-green-deep px-[22px] py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors hover:-translate-y-px no-underline"
            >
              Começar
            </Link>
          </>
        )}
      </div>

      {/* Hamburger — mobile */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-brand-green-deep dark:text-white"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-cream-dark/50 dark:border-gray-700/40 mt-3 pt-4 pb-2 max-w-[1100px] mx-auto">
          <div className="space-y-1 mb-4">
            <Link to="/#como-funciona" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Como funciona
            </Link>
            <Link to="/#para-quem" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Para quem
            </Link>
            <Link to="/#seguranca" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Segurança
            </Link>
            <Link to="/tratamentos" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Tratamentos
            </Link>
            <Link to="/associacoes" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Associações
            </Link>
            <Link to="/legislacao" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Legislação
            </Link>
          </div>

          <div className="border-t border-brand-cream-dark/30 dark:border-gray-700/30 pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/usuarios"
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-medium text-amber-700 dark:text-amber-400 py-2 no-underline"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/painel"
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] font-medium text-brand-green-deep dark:text-brand-green-light py-2 no-underline"
                >
                  Meu painel
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="text-[15px] font-medium text-brand-muted dark:text-gray-400 py-2 text-left"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] font-medium text-brand-green-deep dark:text-gray-300 py-2 no-underline"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro?redirect=/acolhimento"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-[15px] font-semibold text-brand-white bg-brand-green-deep px-6 py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                >
                  Começar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
