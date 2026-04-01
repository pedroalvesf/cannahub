import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLogin } from '@/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawRedirect = searchParams.get('redirect') || '/'
  const redirectTo = rawRedirect.startsWith('/') ? rawRedirect : '/'
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loginMutation = useLogin()

  // Already logged in — skip login
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo === '/' ? '/painel' : redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate(redirectTo),
        onError: (err) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          setError(msg || 'Email ou senha incorretos.')
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-[9px] no-underline mb-10">
          <div className="w-[30px] h-[30px] bg-brand-green-deep rounded-[80%_0_80%_0] rotate-[15deg]" />
          <span className="font-serif text-2xl text-brand-green-deep dark:text-white">
            CannHub
          </span>
        </Link>

        {/* Card */}
        <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-8 shadow-cta">
          <h1 className="font-serif text-[24px] text-brand-green-deep dark:text-white mb-1.5">
            Entrar na sua conta
          </h1>
          <p className="text-[13.5px] text-brand-muted dark:text-gray-400 mb-7">
            Acesse o ecossistema CannHub
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-brand-green-deep text-brand-white font-semibold text-[15px] py-3.5 rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <span className="text-[13px] text-brand-muted dark:text-gray-500">
              Esqueci minha senha
            </span>
          </div>
        </div>

        <p className="text-center mt-6 text-[14px] text-brand-muted dark:text-gray-400">
          Não tem conta?{' '}
          <Link to={redirectTo !== '/' ? `/cadastro?redirect=${encodeURIComponent(redirectTo)}` : '/cadastro'} className="text-brand-green-deep dark:text-brand-green-light font-semibold hover:underline no-underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
