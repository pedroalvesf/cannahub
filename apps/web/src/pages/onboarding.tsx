import { Link, useNavigate } from 'react-router-dom'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function OnboardingPage() {
  const navigate = useNavigate()

  function handleComplete(_data: Record<string, string>) {
    navigate('/painel')
  }

  function handleEscalate(_reason: string) {
    alert('Sua solicitação foi encaminhada para um atendente. Entraremos em contato em breve.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header minimal */}
      <header className="px-6 h-14 flex items-center justify-between border-b border-brand-cream-dark dark:border-gray-800/40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-btn bg-brand-green-deep flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">C</span>
          </div>
          <span className="text-sm font-bold text-brand-green-deep dark:text-white">
            Cann<span className="text-brand-green-deep">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-xs font-medium text-brand-muted/50 dark:text-gray-600 tracking-wide uppercase">
            Acolhimento
          </span>
        </div>
      </header>

      {/* Flow */}
      <main className="flex-1 flex flex-col">
        <OnboardingFlow onComplete={handleComplete} onEscalate={handleEscalate} />
      </main>
    </div>
  )
}
