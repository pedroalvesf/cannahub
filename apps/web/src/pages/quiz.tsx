import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

const PROFILES = [
  {
    type: 'patient',
    emoji: '✦',
    emojiSize: '20px',
    tag: 'Uso próprio',
    tagColor: 'text-brand-green-light',
    title: 'Paciente Adulto',
    description: 'Pacientes maiores de idade em acompanhamento médico, buscando acesso regulamentado ao tratamento com cannabis medicinal.',
    bg: 'bg-brand-white border border-brand-cream-dark',
    titleColor: 'text-brand-green-deep',
    textColor: 'text-brand-muted',
  },
  {
    type: 'guardian',
    emoji: '👨‍👩‍👧',
    emojiSize: '26px',
    tag: 'Dependentes',
    tagColor: 'text-brand-green-mid',
    title: 'Responsável Legal',
    description: 'Pais ou responsáveis por menores e dependentes em tratamento. Documentação específica com procuração ou autorização.',
    bg: 'bg-brand-green-pale border border-brand-green-light/20',
    titleColor: 'text-brand-green-deep',
    textColor: 'text-brand-muted',
  },
  {
    type: 'prescriber',
    emoji: '⚕️',
    emojiSize: '26px',
    tag: 'Prescritores',
    tagColor: 'text-brand-green-pale/60',
    title: 'Médicos e Veterinários',
    description: 'Prescritores que indicam e acompanham pacientes nas associações credenciadas. Acesso ao catálogo e perfis de pacientes.',
    bg: 'bg-brand-green-deep',
    titleColor: 'text-brand-white',
    textColor: 'text-brand-white/[0.62]',
  },
  {
    type: 'caregiver',
    emoji: '🌱',
    emojiSize: '26px',
    tag: 'Primeiro acesso',
    tagColor: 'text-brand-green-light',
    title: 'Iniciantes',
    description: 'Interessados em entender o processo e começar com segurança. Orientação completa desde o primeiro passo.',
    bg: 'bg-brand-white border border-brand-cream-dark',
    titleColor: 'text-brand-green-deep',
    textColor: 'text-brand-muted',
  },
]

export function QuizPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  // Already logged in — account type already set, go straight to onboarding
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/acolhimento', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[1100px] mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-brand-green-pale text-brand-green-mid text-xs font-semibold px-3.5 py-1.5 rounded-btn mb-6 w-fit uppercase tracking-[0.06em]">
          <span className="w-1.5 h-1.5 bg-brand-green-light rounded-full" />
          Cannabis Medicinal no Brasil
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(32px,4.5vw,52px)] leading-[1.1] text-brand-green-deep dark:text-white max-w-[600px] mb-3">
          Conheça a <em className="text-brand-green-mid">CannHub</em>
        </h1>

        <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-12 max-w-[500px]">
          Atendemos diferentes perfis dentro do ecossistema de cannabis medicinal brasileiro. Identifique o seu para começar.
        </p>

        {/* 4 profile blocks — grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-4">
          {PROFILES.map((profile) => (
            <Link
              key={profile.type}
              to={`/cadastro?type=${profile.type}`}
              className={`${profile.bg} rounded-card p-7 relative overflow-hidden group hover:-translate-y-1 hover:shadow-cta transition-all no-underline block`}
            >
              <div className="absolute -bottom-8 -right-8 w-[100px] h-[100px] rounded-full bg-brand-green-light/[0.06] pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <span className={`leading-none`} style={{ fontSize: profile.emojiSize }}>{profile.emoji}</span>
                <span className={`text-[11px] font-bold tracking-[0.08em] uppercase ${profile.tagColor}`}>{profile.tag}</span>
              </div>
              <h3 className={`font-serif text-[19px] leading-[1.25] ${profile.titleColor} mb-2`}>
                {profile.title}
              </h3>
              <p className={`text-[13.5px] font-light ${profile.textColor} leading-[1.7]`}>
                {profile.description}
              </p>
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-12 flex items-center gap-4">
          <Link
            to="/cadastro"
            className="text-[15px] font-semibold text-brand-white bg-brand-green-deep px-8 py-4 rounded-btn shadow-hero hover:bg-brand-green-mid hover:-translate-y-0.5 hover:shadow-hero-hover transition-all no-underline"
          >
            Criar conta
          </Link>
          <Link
            to="/#como-funciona"
            className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep transition-colors underline underline-offset-4 decoration-brand-cream-dark dark:decoration-gray-700 no-underline"
          >
            Entenda o processo
          </Link>
        </div>
      </main>
    </div>
  )
}
