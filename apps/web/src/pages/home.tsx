import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-[140px] pb-20 max-w-[1100px] mx-auto relative">
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
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-brand-green-light mb-2.5">
          Perfis de acesso
        </p>
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-1.5">
          Para quem é o CannHub?
        </h2>
        <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-11 max-w-[500px]">
          Atendemos diferentes perfis dentro do ecossistema de cannabis medicinal brasileiro.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ProfileCard emoji="🧑" name="Paciente Adulto" desc="Em acompanhamento médico e buscando acesso regulamentado ao tratamento." />
          <ProfileCard emoji="👨‍👩‍👧" name="Responsável Legal" desc="Pais ou responsáveis por menores e dependentes em tratamento." />
          <ProfileCard emoji="⚕️" name="Médicos e Veterinários" desc="Prescritores que indicam e acompanham pacientes nas associações credenciadas." />
          <ProfileCard emoji="🌱" name="Iniciantes" desc="Interessados em entender o processo e começar com segurança e informação." />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cream-dark to-transparent" />
      </div>

      {/* ─── BENEFÍCIOS ───────────────────────────────────── */}
      <section id="como-funciona" className="px-6 py-[72px] max-w-[1100px] mx-auto">
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-brand-green-light mb-2.5">
          Por que a CannHub
        </p>
        <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-1.5">
          O que nos diferencia
        </h2>
        <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-11 max-w-[500px]">
          Construída para proteger e orientar você em cada etapa do tratamento.
        </p>

        <div className="grid md:grid-cols-3 gap-3.5">
          {/* Card 1 — dark */}
          <div className="bg-brand-green-deep rounded-card p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-cta transition-all">
            <div className="absolute -bottom-10 -right-10 w-[140px] h-[140px] rounded-full bg-white/[0.04] pointer-events-none" />
            <span className="font-serif text-[13px] text-brand-white/40 tracking-[0.06em] block mb-8">01</span>
            <h3 className="font-serif text-[22px] leading-[1.25] text-brand-white mb-3.5">
              Segurança Jurídica
            </h3>
            <p className="text-sm font-light text-brand-white/[0.62] leading-[1.7]">
              Validamos sua prescrição para garantir que seu acesso ao tratamento seja completamente legal e protegido em todo o território nacional.
            </p>
          </div>

          {/* Card 2 — white */}
          <div className="bg-brand-white border border-brand-cream-dark rounded-card p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-cta transition-all">
            <div className="absolute -bottom-10 -right-10 w-[140px] h-[140px] rounded-full bg-brand-green-light/[0.06] pointer-events-none" />
            <span className="font-serif text-[13px] text-brand-green-deep/40 tracking-[0.06em] block mb-8">02</span>
            <h3 className="font-serif text-[22px] leading-[1.25] text-brand-green-deep mb-3.5">
              Curadoria de Cepas
            </h3>
            <p className="text-sm font-light text-brand-muted leading-[1.7]">
              Catálogo técnico com terpenos, efeitos, indicações e associações que oferecem cada produto — tudo num só lugar.
            </p>
          </div>

          {/* Card 3 — pale */}
          <div className="bg-brand-green-pale border border-brand-green-light/20 rounded-card p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-cta transition-all">
            <div className="absolute -bottom-10 -right-10 w-[140px] h-[140px] rounded-full bg-brand-green-deep/[0.06] pointer-events-none" />
            <span className="font-serif text-[13px] text-brand-green-deep/40 tracking-[0.06em] block mb-8">03</span>
            <h3 className="font-serif text-[22px] leading-[1.25] text-brand-green-deep mb-3.5">
              Acolhimento Real
            </h3>
            <p className="text-sm font-light text-brand-muted leading-[1.7]">
              Conectamos você às associações certas para seu perfil clínico. É um vínculo real, mediado e validado pela plataforma.
            </p>
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

/* ─── ProfileCard ─────────────────────────────────────── */
function ProfileCard({ emoji, name, desc }: { emoji: string; name: string; desc: string }) {
  return (
    <div className="group bg-brand-white dark:bg-surface-dark-card rounded-card p-8 pt-8 pb-7 cursor-pointer border border-brand-cream-dark dark:border-gray-700 shadow-soft hover:border-brand-green-light/45 hover:shadow-card hover:-translate-y-[5px] transition-all relative overflow-hidden">
      {/* Top accent bar on hover */}
      <div className="absolute top-0 left-5 right-5 h-[3px] rounded-b bg-brand-green-light opacity-0 group-hover:opacity-100 transition-opacity" />

      <span className="text-[34px] block mb-[18px] leading-none">{emoji}</span>
      <div className="text-[15px] font-semibold text-brand-green-deep dark:text-white mb-2 leading-[1.3]">{name}</div>
      <div className="text-[13px] text-brand-muted dark:text-gray-400 font-light leading-[1.6]">{desc}</div>
      <span className="inline-block mt-5 text-xs font-semibold text-brand-green-light opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        Saiba mais →
      </span>
    </div>
  )
}
