import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useRegister } from '@/hooks/use-auth'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
}

const ACCOUNT_TYPES = [
  {
    value: 'patient',
    label: 'Paciente Adulto',
    description: 'Uso próprio com acompanhamento médico',
  },
  {
    value: 'guardian',
    label: 'Responsável Legal',
    description: 'Para menor ou dependente em tratamento',
  },
  {
    value: 'prescriber',
    label: 'Médico Prescritor',
    description: 'Prescritores com CRM que acompanham pacientes',
  },
  {
    value: 'veterinarian',
    label: 'Veterinário',
    description: 'Profissionais com CRMV para tratamento animal',
  },
  {
    value: 'caregiver',
    label: 'Cuidador',
    description: 'Com procuração ou documento legal do paciente',
  },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/acolhimento'
  const registerMutation = useRegister()

  const initialType = searchParams.get('type') ?? ''
  const validType = ACCOUNT_TYPES.some((t) => t.value === initialType)
  const [step, setStep] = useState(validType ? 2 : 1)
  const [accountType, setAccountType] = useState(validType ? initialType : '')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSelectType(type: string) {
    setAccountType(type)
    setStep(2)
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const rawPhone = phone.replace(/\D/g, '')

    registerMutation.mutate(
      {
        name,
        email,
        password,
        accountType,
        phone: rawPhone || undefined,
        cpf: cpf || undefined,
      },
      {
        onSuccess: () => navigate(redirectTo),
        onError: (err) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          setError(msg || 'Erro ao criar conta. Tente novamente.')
        },
      },
    )
  }

  const selectedType = ACCOUNT_TYPES.find((t) => t.value === accountType)

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-[9px] no-underline mb-10">
          <div className="w-[30px] h-[30px] bg-brand-green-deep rounded-[80%_0_80%_0] rotate-[15deg]" />
          <span className="font-serif text-2xl text-brand-green-deep dark:text-white">
            CannHub
          </span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className={`h-1 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-brand-green-deep' : 'bg-brand-cream-dark'}`} />
          <div className={`h-1 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-brand-green-deep' : 'bg-brand-cream-dark dark:bg-gray-700'}`} />
        </div>

        {/* Card */}
        <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-8 shadow-cta">
          {step === 1 ? (
            <>
              <h1 className="font-serif text-[24px] text-brand-green-deep dark:text-white mb-1.5">
                Como você vai usar o CannHub?
              </h1>
              <p className="text-[13.5px] text-brand-muted dark:text-gray-400 mb-7">
                Selecione o perfil que melhor descreve sua situação
              </p>

              <div className="space-y-2">
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleSelectType(type.value)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-brand-cream-dark dark:border-gray-700 bg-brand-cream/30 dark:bg-gray-800/50 text-left hover:border-brand-green-light hover:bg-brand-green-pale/30 dark:hover:bg-gray-800 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0 group-hover:bg-brand-green-light/20 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-brand-green-deep dark:text-white leading-tight">
                        {type.label}
                      </p>
                      <p className="text-[12.5px] text-brand-muted dark:text-gray-500 leading-snug mt-0.5">
                        {type.description}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cream-dark dark:text-gray-600 group-hover:text-brand-green-light transition-colors shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-[13px] text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors mb-5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Voltar
              </button>

              <h1 className="font-serif text-[24px] text-brand-green-deep dark:text-white mb-1.5">
                Criar sua conta
              </h1>
              <p className="text-[13.5px] text-brand-muted dark:text-gray-400 mb-7">
                Perfil: <span className="font-semibold text-brand-green-mid dark:text-brand-green-light">
                  {selectedType?.label}
                </span>
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
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

                <div>
                  <label htmlFor="confirm-password" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                    Confirmar senha
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                    placeholder="Repita a senha"
                  />
                </div>

                {/* Optional fields */}
                <div className="pt-2 border-t border-brand-cream-dark dark:border-gray-700 mt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-3">
                    Opcionais
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cpf" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                        CPF
                      </label>
                      <input
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1.5">
                        Telefone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full px-4 py-3 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[14px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors"
                        placeholder="(11) 9 9999-9999"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-brand-green-deep text-brand-white font-semibold text-[15px] py-3.5 rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-[14px] text-brand-muted dark:text-gray-400">
          Já tem conta?{' '}
          <Link to={redirectTo !== '/acolhimento' ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'} className="text-brand-green-deep dark:text-brand-green-light font-semibold hover:underline no-underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
