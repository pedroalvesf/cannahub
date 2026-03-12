import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
  const { isAuthenticated, logout } = useAuthStore()

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

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <a href="#como-funciona" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Como funciona
          </a>
        </li>
        <li>
          <a href="#para-quem" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Para quem
          </a>
        </li>
        <li>
          <a href="#seguranca" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Segurança
          </a>
        </li>
        <li>
          <Link to="/cepas" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Cepas
          </Link>
        </li>
        <li>
          <Link to="/produtos" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Produtos
          </Link>
        </li>
        <li>
          <Link to="/associacoes" className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Associações
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {isAuthenticated ? (
          <>
            <Link
              to="/acolhimento"
              className="text-sm font-medium text-brand-green-deep dark:text-brand-green-light px-4 py-2 rounded-btn hover:bg-brand-green-pale dark:hover:bg-gray-800 transition-colors no-underline"
            >
              Meu acolhimento
            </Link>
            <button
              onClick={logout}
              className="text-sm font-medium text-brand-green-deep px-4 py-2 rounded-btn hover:bg-brand-green-pale transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button className="text-sm font-medium text-brand-green-deep dark:text-gray-300 bg-transparent border-none px-4 py-2 rounded-btn hover:bg-brand-green-pale dark:hover:bg-gray-800 transition-colors cursor-pointer">
              Entrar
            </button>
            <Link
              to="/quiz"
              className="text-sm font-semibold text-brand-white bg-brand-green-deep px-[22px] py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors hover:-translate-y-px no-underline"
            >
              Começar
            </Link>
          </>
        )}
      </div>
      </div>
    </nav>
  )
}
