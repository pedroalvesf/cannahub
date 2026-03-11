import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'

export function QuizPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 pt-16 pb-20 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="text-brand-green-deep font-semibold text-xs uppercase tracking-[0.2em]">
          Cannabis Medicinal no Brasil
        </p>

        {/* Title */}
        <h1 className="mt-3 text-[2.2rem] md:text-[2.8rem] font-extrabold leading-[1.1] text-brand-green-deep dark:text-white">
          Conheça a CannHub
        </h1>

        {/* Illustrations row */}
        <div className="mt-10 flex justify-center gap-6 md:gap-10">
          <TriagemIcon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </TriagemIcon>
          <TriagemIcon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </TriagemIcon>
          <TriagemIcon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </TriagemIcon>
          <TriagemIcon>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </TriagemIcon>
        </div>

        {/* Section title */}
        <h2 className="mt-12 text-lg font-bold text-brand-green-deep dark:text-white">
          Para quem é o CannHub?
        </h2>

        {/* Description blocks */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-card bg-brand-green-deep/10 dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-green-deep dark:text-white">
                Pacientes Adulto
              </h3>
              <p className="mt-1 text-sm font-normal text-brand-muted dark:text-gray-400 leading-relaxed">
                Pacientes maiores de idade com cannabis, acolhidos para uso pelo acompanhamento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-card bg-brand-green-deep/10 dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-green-deep dark:text-white">
                Médicos e Veterinários
              </h3>
              <p className="mt-1 text-sm font-normal text-brand-muted dark:text-gray-400 leading-relaxed">
                Médicos e veterinários que prescrevem cannabis medicinal, referenciados às clínicas e atendendo.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex items-center gap-4">
          <Link
            to="/acolhimento"
            className="px-7 py-3.5 text-sm font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors"
          >
            Iniciar Acolhimento
          </Link>
          <Link
            to="/#como-funciona"
            className="text-sm font-medium text-brand-muted dark:text-gray-400 hover:text-brand-green-deep transition-colors underline underline-offset-4 decoration-brand-cream-dark dark:decoration-gray-700"
          >
            Entenda o processo
          </Link>
        </div>
      </main>
    </div>
  )
}

function TriagemIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-card bg-surface-card dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-800 flex items-center justify-center shadow-soft">
      {children}
    </div>
  )
}
