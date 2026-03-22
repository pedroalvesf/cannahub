import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-[100px] pb-20 max-w-[1100px] mx-auto relative">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-brand-green-pale text-brand-green-mid text-xs font-semibold px-3.5 py-1.5 rounded-btn mb-7 w-fit uppercase tracking-[0.06em] animate-fade-up-1">
          <span className="w-1.5 h-1.5 bg-brand-green-light rounded-full" />
          Cannabis Medicinal no Brasil
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(40px,5.5vw,68px)] leading-[1.1] text-brand-green-deep dark:text-white max-w-[720px] mb-[22px] animate-fade-up-2">
          Sua jornada para o{' '}
          tratamento com cannabis,{' '}
          <em className="text-brand-green-mid">guiada pela segurança.</em>
        </h1>

        {/* Subtitle */}
        <p className="text-lg font-light text-brand-muted dark:text-gray-400 leading-[1.65] max-w-[520px] mb-11 animate-fade-up-3">
          A CannHub valida sua documentação, orienta sobre o produto certo e
          regulamentado — com segurança, base jurídica e acolhimento de verdade.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3.5 items-center animate-fade-up-4">
          <Link
            to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
            className="text-base font-semibold text-brand-white bg-brand-green-deep px-9 py-4 rounded-btn shadow-hero hover:bg-brand-green-mid hover:-translate-y-0.5 hover:shadow-hero-hover transition-all no-underline"
          >
            Iniciar Acolhimento
          </Link>
          <a
            href="#como-funciona"
            className="text-[15px] font-medium text-brand-green-deep bg-transparent border-[1.5px] border-brand-green-deep/30 px-7 py-[15px] rounded-btn hover:border-brand-green-deep hover:bg-brand-green-pale hover:-translate-y-0.5 transition-all no-underline"
          >
            Entenda o processo
          </a>
        </div>

        {/* Legal awareness note */}
        <p className="mt-9 text-[13px] text-brand-muted dark:text-gray-500 font-light animate-fade-up-4">
          Sim, cannabis medicinal <strong className="font-medium text-brand-green-deep dark:text-gray-300">é legal no Brasil</strong> — regulamentada pela Anvisa desde 2015.{' '}
          <Link to="/legislacao" className="text-brand-green-mid hover:text-brand-green-deep dark:hover:text-brand-green-light underline underline-offset-2 decoration-brand-green-mid/30 hover:decoration-brand-green-mid transition-colors">
            Entenda a legislação
          </Link>
        </p>

        {/* Decorative circle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(90,148,104,0.1)_0%,transparent_70%)] pointer-events-none animate-pulse-slow hidden lg:block" />
      </section>

      {/* ─── PARA QUEM ────────────────────────────────────── */}
      <section id="para-quem" className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-10">
          Para quem é o CannHub?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/paciente_adulto.svg" alt="Paciente Adulto" className="w-full h-auto" />
          </div>
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/responsavel_legal.svg" alt="Responsável Legal" className="w-full h-auto" />
          </div>
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/medicos_veterinarios.svg" alt="Médicos e Veterinários" className="w-full h-auto" />
          </div>
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/iniciantes.svg" alt="Iniciantes" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cream-dark to-transparent" />
      </div>

      {/* ─── COMO FUNCIONA — Jornada ────────────────────────── */}
      <section id="como-funciona" className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-3">
            Como funciona
          </h2>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] max-w-[520px]">
            A CannHub guia você em cada etapa — do primeiro contato até o acesso ao produto regulamentado.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Acolhimento',
              description: 'Conte sobre sua condição e experiência. Nosso questionário clínico é rápido e sigiloso.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              ),
            },
            {
              step: '02',
              title: 'Prescrição médica',
              description: 'Não tem receita? A CannHub conecta você a médicos prescritores parceiros via teleconsulta.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              ),
            },
            {
              step: '03',
              title: 'Documentação',
              description: 'Envie receita, laudo e identidade. Nós validamos tudo com segurança e criptografia.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              ),
            },
            {
              step: '04',
              title: 'Acesso ao tratamento',
              description: 'Conectamos você à associação certa, com produtos regulamentados e acompanhamento contínuo.',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < 3 && (
                <div className="hidden md:block absolute top-[28px] left-[calc(100%+4px)] w-[calc(100%-48px)] h-px bg-brand-cream-dark dark:bg-gray-700 translate-x-[-8px]" />
              )}
              <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 h-full hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0 text-brand-green-deep dark:text-brand-green-light">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-brand-green-light dark:text-brand-green-light/60 uppercase tracking-wider">
                    Etapa {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-[17px] text-brand-green-deep dark:text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[13px] font-light text-brand-muted dark:text-gray-400 leading-[1.7]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cream-dark to-transparent" />
      </div>

      {/* ─── SERVIÇOS CANNAHUB ──────────────────────────────── */}
      <section className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-3">
            O que a CannHub oferece
          </h2>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] max-w-[520px]">
            Mais do que um diretório — somos seu parceiro em cada etapa do tratamento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: 'Rede de prescritores',
              description: 'Médicos e veterinários especializados em cannabis medicinal. Teleconsulta disponível para todo o Brasil.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
              badge: 'Em breve',
            },
            {
              title: 'Orientação jurídica',
              description: 'Suporte com habeas corpus preventivo, importação pela ANVISA e segurança legal do seu tratamento.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              ),
              badge: 'Em breve',
            },
            {
              title: 'Acolhimento humanizado',
              description: 'Avaliação clínica personalizada, grupos de apoio e acompanhamento contínuo durante todo o tratamento.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              ),
              badge: null,
            },
          ].map((service, i) => (
            <div key={i} className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-7 relative overflow-hidden hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-green-deep flex items-center justify-center text-brand-white">
                  {service.icon}
                </div>
                {service.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green-light bg-brand-green-pale dark:bg-gray-700 px-2.5 py-1 rounded-btn">
                    {service.badge}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-[18px] text-brand-green-deep dark:text-white mb-2 leading-tight">
                {service.title}
              </h3>
              <p className="text-[13px] font-light text-brand-muted dark:text-gray-400 leading-[1.7]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cream-dark to-transparent" />
      </div>

      {/* ─── BENEFÍCIOS (cards SVG) ─────────────────────────── */}
      <section className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-10">
          Por que a CannHub?
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/seguranca_juridica.svg" alt="Segurança Jurídica" className="w-full h-auto" />
          </div>
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/curadoria_de_cepas.svg" alt="Curadoria de Cepas" className="w-full h-auto" />
          </div>
          <div className="group hover:-translate-y-2 transition-all cursor-pointer">
            <img src="/cards/acolhimento_real.svg" alt="Acolhimento Real" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ────────────────────────────────────── */}
      <div className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <div className="bg-brand-green-deep rounded-banner px-[60px] py-[52px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-[100px] -top-[100px] w-[320px] h-[320px] rounded-full bg-white/[0.03] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-serif text-[28px] text-brand-white leading-[1.3] mb-2.5">
              Pronto para dar o primeiro passo?
            </h3>
            <p className="text-sm text-brand-white/60 font-light leading-[1.7] max-w-[440px]">
              Leva menos de 5 minutos para criar seu perfil. Nossa equipe analisa seus documentos em até 48 horas e te orienta durante todo o processo.
            </p>
          </div>
          <Link
            to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
            className="relative z-10 text-sm font-semibold text-brand-green-deep bg-brand-white px-[30px] py-[15px] rounded-btn whitespace-nowrap shrink-0 hover:bg-brand-cream hover:-translate-y-px transition-all no-underline"
          >
            Iniciar Acolhimento →
          </Link>
        </div>
      </div>

      {/* ─── LGPD ─────────────────────────────────────────── */}
      <div id="seguranca" className="px-6 max-w-[1100px] mx-auto">
        <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[14px] px-6 py-[18px] flex items-start gap-3.5">
          <span className="text-[17px] mt-px shrink-0 opacity-65">🔒</span>
          <p className="text-[12.5px] text-brand-muted dark:text-gray-400 font-light leading-[1.65]">
            <strong className="text-brand-green-deep dark:text-white font-semibold">LGPD Protection:</strong> Todos os documentos são armazenados com criptografia e acessados apenas pela equipe de validação da CannHub. Seus dados clínicos nunca são compartilhados com terceiros sem seu consentimento expresso.
          </p>
        </div>
      </div>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="px-6 py-11 max-w-[1100px] mx-auto mt-[72px] flex flex-col md:flex-row items-center justify-between gap-4 border-t border-brand-cream-dark dark:border-gray-800">
        <span className="font-serif text-xl text-brand-green-deep dark:text-white">CannHub</span>
        <ul className="flex gap-6 list-none">
          <li><a href="#" className="text-[13px] text-brand-sand dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">Termos de uso</a></li>
          <li><a href="#" className="text-[13px] text-brand-sand dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">Privacidade</a></li>
          <li><a href="#" className="text-[13px] text-brand-sand dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">Contato</a></li>
        </ul>
        <span className="text-xs text-brand-sand dark:text-gray-600">© 2025 CannHub</span>
      </footer>
    </div>
  )
}

