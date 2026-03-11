import { Link } from 'react-router-dom'

export function HomePage() {
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
        <div className="flex gap-3.5 items-center animate-fade-up-4">
          <Link
            to="/quiz"
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

      {/* ─── BENEFÍCIOS ───────────────────────────────────── */}
      <section id="como-funciona" className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-10">
          Benefícios
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
            to="/quiz"
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

