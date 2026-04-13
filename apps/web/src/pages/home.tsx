import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const acolhimentoLink = isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">

      {/* ================================================================
          1. HERO — bg-brand-green-deep, full-width
          ================================================================ */}
      <section className="relative bg-brand-green-deep overflow-hidden">
        {/* Decorative: "Legal." large text */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-20px] bottom-[-32px] font-serif italic text-white opacity-[0.03] leading-none whitespace-nowrap tracking-[-0.04em] text-[clamp(140px,20vw,260px)]"
        >
          Legal.
        </span>
        {/* Radial gradient overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,.03) 0%, transparent 55%)' }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-20 pt-[100px] pb-24">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[11.5px] text-white/[0.45] uppercase tracking-[0.1em] font-medium mb-9">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
            Cannabis medicinal no Brasil
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(48px,6.5vw,80px)] text-white leading-[1.05] tracking-[-0.03em] mb-7 max-w-[820px]">
            Existe um caminho{' '}
            <em className="italic text-brand-green-xs">seguro e legal</em>{' '}
            para o que você usa.
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/60 max-w-[580px] leading-[1.7] font-light mb-11">
            Milhões de brasileiros já usam cannabis para tratar sua condição — mas sem prescrição, sem garantia de qualidade, sem amparo legal.
            <br /><br />
            <strong className="text-white/[0.85] font-medium">Isso pode mudar. Mais rápido do que você imagina.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center mb-[52px]">
            <Link
              to={acolhimentoLink}
              className="px-7 py-3.5 bg-white text-brand-green-deep rounded-lg text-[15px] font-medium tracking-[0.01em] hover:opacity-90 transition-opacity no-underline"
            >
              Quero regularizar meu tratamento
            </Link>
            <Link
              to="/legislacao"
              className="px-6 py-[13px] bg-transparent text-white/75 border border-white/20 rounded-lg text-[15px] hover:border-white/50 hover:text-white transition-all no-underline"
            >
              Como funciona na lei →
            </Link>
          </div>

          {/* Legal note */}
          <p className="text-[13px] text-white/[0.38] leading-[1.6] max-w-[440px]">
            <strong className="text-white/60 font-medium">Cannabis medicinal é legal no Brasil desde 2015</strong>, regulamentada pela Anvisa.
            <br />
            Com prescrição médica, você tem{' '}
            <Link to="/legislacao" className="text-white/[0.55] underline underline-offset-[3px] hover:text-white/80 transition-colors">
              amparo legal completo
            </Link>{' '}
            para comprar, importar e usar.
          </p>
        </div>
      </section>

      {/* ================================================================
          2. PHOTO SECTION — still bg-brand-green-deep
          ================================================================ */}
      <section className="bg-brand-green-deep px-6 md:px-20 pb-20">
        <div className="relative max-w-[1100px] mx-auto rounded-[20px] overflow-hidden bg-brand-green-mid border border-white/[0.06] h-[280px] md:h-[480px]">
          {/* Hero image */}
          <img
            src="/treatments/hero-geral.webp"
            alt="Cannabis medicinal — ciência e acolhimento"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          {/* Floating stats bar */}
          <div className="absolute bottom-4 md:bottom-7 left-4 md:left-7 right-4 md:right-7 z-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.07] rounded-xl overflow-hidden border border-white/[0.08]">
            {[
              { num: '6,9M', label: 'brasileiros elegíveis' },
              { num: '25+', label: 'produtos Anvisa' },
              { num: '2015', label: 'legal no Brasil' },
            ].map((stat) => (
              <div key={stat.num} className="bg-[rgba(20,31,20,0.6)] backdrop-blur-sm px-5 py-4 text-center">
                <div className="font-serif text-2xl text-white leading-none">{stat.num}</div>
                <div className="text-[11px] text-white/[0.38] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          3. CONTEXT BAR — bg-brand-cream
          ================================================================ */}
      <div className="bg-brand-cream dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-gray-700 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-6 md:gap-12 min-h-[72px] py-4 md:py-0">
          <div className="text-xs text-brand-text-xs dark:text-gray-500 uppercase tracking-[0.08em] font-medium whitespace-nowrap">
            Em números
          </div>
          <div className="flex flex-col md:flex-row items-stretch">
            {[
              { big: '~4M', desc: 'brasileiros usam cannabis sem prescrição' },
              { big: '89%', desc: 'não sabem que podem regularizar legalmente' },
              { big: '10–30 dias', desc: 'tempo médio para obter acesso legal' },
              { big: 'R$ 0', desc: 'custo para iniciar o acolhimento na CannHub' },
            ].map((item, i) => (
              <div
                key={item.big}
                className={`flex items-center gap-2.5 py-4 md:py-[18px] px-0 md:px-6 flex-1 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-brand-cream-dark dark:border-gray-700' : ''}`}
              >
                <span className="font-serif text-[26px] text-brand-text dark:text-white leading-none whitespace-nowrap">{item.big}</span>
                <span className="text-[12.5px] text-brand-muted dark:text-gray-400 leading-[1.4]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          4. RECOGNITION — "Você se reconhece aqui?"
          ================================================================ */}
      <section className="max-w-[1260px] mx-auto px-6 md:px-20 py-24">
        <div className="text-[11.5px] text-brand-green-light dark:text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-3.5">
          Você se reconhece aqui?
        </div>
        <h2 className="font-serif text-[clamp(30px,4vw,44px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3 max-w-[540px]">
          Situações que a gente conhece bem.
        </h2>
        <p className="text-base text-brand-muted dark:text-gray-400 max-w-[520px] leading-[1.7] font-light mb-[52px]">
          Não tem julgamento. Tem solução.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-3.5">
          {/* Main card */}
          <div className="bg-brand-green-deep rounded-card p-8 md:p-10 flex flex-col gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="font-serif text-[22px] text-white leading-[1.2]">
              "Eu uso, mas compro<br className="hidden md:block" /> sem saber de onde vem."
            </div>
            <div className="text-[14.5px] text-white/65 leading-[1.7] font-light">
              Produto sem laudo, sem concentração garantida, sem rastreabilidade. Você não sabe o que está usando de verdade — e isso tem consequências para o tratamento e para a sua segurança jurídica.
            </div>
            <Link
              to="/legislacao"
              className="mt-auto self-start inline-flex items-center gap-1.5 text-[13px] font-medium text-white px-[18px] py-2.5 bg-white/10 border border-white/[0.15] rounded-lg hover:bg-white/[0.18] transition-colors no-underline"
            >
              Entender meu caminho legal →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-brand-cream dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-card p-8 flex flex-col gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-off dark:bg-gray-700 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.95a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="text-base font-medium text-brand-text dark:text-white leading-[1.3]">
              "Meu médico disse que não pode prescrever."
            </div>
            <div className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65]">
              Qualquer médico pode prescrever cannabis medicinal no Brasil. Se o seu recusou, você tem o direito de buscar outro profissional — e a CannHub conecta você a prescritores especializados.
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-brand-cream dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-card p-8 flex flex-col gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-off dark:bg-gray-700 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="text-base font-medium text-brand-text dark:text-white leading-[1.3]">
              "Tenho medo de problemas legais."
            </div>
            <div className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65]">
              Com prescrição médica, você tem amparo legal completo para comprar, importar e usar. Não é crime. É tratamento de saúde regulamentado pela Anvisa desde 2015.
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. HOW IT WORKS — bg-brand-cream
          ================================================================ */}
      <section id="como-funciona" className="bg-brand-cream dark:bg-surface-dark-card py-24 px-6 md:px-20">
        <div className="max-w-[1100px] mx-auto">
          {/* Two-column header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-end mb-16">
            <div>
              <div className="text-[11.5px] text-brand-green-light dark:text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-3.5">
                O processo
              </div>
              <h2 className="font-serif text-[clamp(30px,4vw,44px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] max-w-[540px]">
                Do primeiro contato ao acesso regulamentado.
              </h2>
            </div>
            <p className="text-base text-brand-muted dark:text-gray-400 leading-[1.7] font-light">
              A CannHub guia você em cada etapa — sem burocracia, sem jargão, sem deixar ninguém para trás.
            </p>
          </div>

          {/* 4 step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                step: '01',
                title: 'Acolhimento',
                desc: 'Nos conte sua condição e sua experiência. Nosso questionário clínico é rápido, sigiloso e sem julgamentos.',
                icon: (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Prescrição médica',
                desc: 'Não tem receita? A CannHub conecta você a médicos prescritores parceiros via teleconsulta para todo o Brasil.',
                icon: (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Documentação',
                desc: 'Envie receita, laudo e identidade. Validamos tudo com segurança, criptografia e conformidade com a LGPD.',
                icon: (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Acesso ao tratamento',
                desc: 'Conectamos você à associação credenciada certa — que opera dentro da lei, com produtos certificados e acompanhamento contínuo.',
                icon: (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ),
              },
              {
                step: '05',
                title: 'Autonomia do paciente',
                desc: 'Quer ir além? A CannHub orienta sobre cultivo próprio, habeas corpus, acompanhamento jurídico e importação — para quem busca independência no tratamento.',
                icon: (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.52 9-12z" />
                    <path d="M2 2c0 6 4 8.5 6 10" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {i < 4 && (
                  <div className="hidden lg:block absolute top-[48px] right-[-13px] w-[26px] h-px bg-brand-cream-dark dark:bg-gray-700 z-10" />
                )}
                <div className="bg-brand-off dark:bg-surface-dark border border-brand-cream-dark dark:border-gray-700 rounded-[16px] p-6 h-full">
                  <div className="w-[38px] h-[38px] bg-brand-green-pale dark:bg-gray-700 rounded-[10px] flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <div className="text-[10.5px] text-brand-text-xs dark:text-gray-500 uppercase tracking-[0.1em] font-medium mb-2">
                    Etapa {item.step}
                  </div>
                  <div className="text-[15px] font-medium text-brand-text dark:text-white mb-2 leading-[1.3]">
                    {item.title}
                  </div>
                  <div className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.65]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          6. FOR WHO — editorial layout
          ================================================================ */}
      <section id="para-quem" className="max-w-[1260px] mx-auto px-6 md:px-20 py-24">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16 items-start">
          {/* Left — sticky header */}
          <div className="md:sticky md:top-20">
            <div className="text-[11.5px] text-brand-green-light dark:text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-3.5">
              Perfis
            </div>
            <h2 className="font-serif text-[clamp(26px,3vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              Para quem é o CannHub?
            </h2>
            <p className="text-sm text-brand-muted dark:text-gray-400 leading-[1.7] font-light mt-3">
              Não importa se você já usa, se está começando agora ou se está buscando para um familiar. Existe um caminho para cada situação.
            </p>
          </div>

          {/* Right — 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                color: 'bg-[#E8F0E0]',
                image: '/treatments/mulher-careca-calma-plena-respirando.webp',
                imgPosition: 'object-[center_20%]',
                name: 'Paciente adulto',
                desc: 'Já usa ou quer começar. Quer ter segurança jurídica, orientação médica e acesso legal ao tratamento certo para sua condição.',
              },
              {
                color: 'bg-[#E8EEF5]',
                image: '/treatments/filho-com-mae-exercicios-autismo.webp',
                imgPosition: 'object-center',
                name: 'Responsável legal',
                desc: 'Cuida de criança ou dependente. Precisa de segurança, laudo e orientação médica especializada.',
              },
              {
                color: 'bg-[#F5EDE8]',
                image: '/treatments/casal-idoso-feliz-natureza.webp',
                imgPosition: 'object-center',
                name: 'Médico e veterinário',
                desc: 'Quer prescrever com segurança. Acesso à literatura científica, protocolos e rede de associações.',
              },
              {
                color: 'bg-[#F0ECF8]',
                image: '/treatments/medico-sorrindo-com-paciente-atendimento.webp',
                imgPosition: 'object-center',
                name: 'Iniciante',
                desc: 'Nunca usou, mas quer entender. A CannHub orienta do zero, sem jargão e sem pressa.',
              },
            ].map((profile) => (
              <div
                key={profile.name}
                className="bg-brand-off dark:bg-surface-dark border border-brand-cream-dark dark:border-gray-700 rounded-[16px] overflow-hidden cursor-pointer transition-all hover:border-brand-green-light hover:-translate-y-0.5"
              >
                <div className={`${profile.color} dark:bg-surface-dark-card h-[160px] border-b border-brand-cream-dark dark:border-gray-700 overflow-hidden`}>
                  <img src={profile.image} alt={profile.name} className={`w-full h-full object-cover ${profile.imgPosition}`} />
                </div>
                <div className="px-5 py-[18px]">
                  <div className="text-[15px] font-medium text-brand-text dark:text-white mb-1">{profile.name}</div>
                  <div className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.55]">{profile.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          7. BEFORE / AFTER — bg-brand-green-deep
          ================================================================ */}
      <section className="relative bg-brand-green-deep py-24 px-6 md:px-20 overflow-hidden">
        {/* Decorative circle */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-white/[0.02]" />

        <div className="max-w-[1100px] mx-auto">
          <div className="mb-[52px]">
            <div className="text-[11.5px] text-brand-green-xs/60 uppercase tracking-[0.1em] font-medium mb-3.5">
              A diferença real
            </div>
            <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] text-white leading-[1.1] tracking-[-0.02em] max-w-[500px]">
              O que muda quando você regulariza.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] gap-6 md:gap-0 items-start">
            {/* BEFORE column */}
            <div className="md:pr-10">
              <div className="flex items-center gap-2 text-[11px] text-white/30 uppercase tracking-[0.1em] font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Sem regularização
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  'Produto sem laudo de qualidade e sem concentração garantida',
                  'Sem amparo legal — risco jurídico a cada compra',
                  'Dosagem no achismo, sem orientação médica',
                  'Preços imprevisíveis, sem rastreabilidade da origem',
                  'Nenhum acompanhamento do resultado do tratamento',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 px-4 py-3.5 rounded-[10px] bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 mt-px">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/[0.45] leading-[1.5]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow divider */}
            <div className="hidden md:flex items-center justify-center pt-[52px]">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* AFTER column */}
            <div className="md:pl-10">
              <div className="flex items-center gap-2 text-[11px] text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green-xs" />
                Com a CannHub
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  'Produto com laudo analítico, concentração certificada e padrão Anvisa',
                  'Prescrição médica válida — amparo legal completo para comprar e usar',
                  'Dose individualizada por médico especializado no seu caso',
                  'Vinculação a associações credenciadas, auditadas e que operam dentro da lei',
                  'Acompanhamento contínuo com ajuste de protocolo ao longo do tempo',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 px-4 py-3.5 rounded-[10px] bg-[rgba(200,221,184,0.08)] border border-[rgba(200,221,184,0.12)]">
                    <div className="w-5 h-5 rounded-full bg-[rgba(200,221,184,0.2)] flex items-center justify-center shrink-0 mt-px">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-xs">
                        <polyline points="2 5 4 8 8 2" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80 leading-[1.5]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. TESTIMONIAL
          ================================================================ */}
      <section className="max-w-[1260px] mx-auto px-6 md:px-20 py-24">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-16 items-center">
          {/* Photo placeholder */}
          <div className="relative bg-brand-cream dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[20px] overflow-hidden aspect-[3/4] flex flex-col items-center justify-center gap-3">
            {/* Cross lines */}
            <div aria-hidden="true" className="absolute left-1/2 top-0 w-px h-full bg-brand-cream-dark dark:bg-gray-700 opacity-50" />
            <div aria-hidden="true" className="absolute top-1/2 left-0 h-px w-full bg-brand-cream-dark dark:bg-gray-700 opacity-50" />
            <div className="relative z-10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-xs">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="relative z-10 text-[11px] text-brand-text-xs uppercase tracking-[0.06em]">Foto do paciente</div>
            <div className="relative z-10 text-[9.5px] text-brand-text-xs/70 uppercase tracking-[0.06em]">380 × 510px · retrato</div>
          </div>

          {/* Testimonial content */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] text-brand-green-light dark:text-brand-green-xs uppercase tracking-[0.08em] font-medium mb-5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-green-light dark:text-brand-green-xs">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Relato real — Dor crônica
            </div>

            <blockquote className="font-serif text-[clamp(22px,3vw,32px)] text-brand-text dark:text-white leading-[1.35] tracking-[-0.01em] mb-8">
              "Comprei por anos sem saber o que estava usando de verdade. Quando regularizei com a ajuda da CannHub, foi a primeira vez que entendi{' '}
              <em className="text-brand-green-light dark:text-brand-green-xs italic">exatamente o que estava tomando</em>{' '}
              — e o que esperar do tratamento."
            </blockquote>

            <div className="flex flex-wrap gap-6 mb-8">
              <div>
                <div className="font-serif text-4xl text-brand-green-deep dark:text-brand-green-light leading-none">3 anos</div>
                <div className="text-[12.5px] text-brand-muted dark:text-gray-400 mt-1">comprando sem prescrição</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-brand-green-deep dark:text-brand-green-light leading-none">18 dias</div>
                <div className="text-[12.5px] text-brand-muted dark:text-gray-400 mt-1">para regularizar com a CannHub</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-6 border-t border-brand-cream-dark dark:border-gray-700">
              <div className="w-11 h-11 rounded-full bg-brand-cream dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-brand-text-xs">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-brand-text dark:text-white">C.F., 41 anos — São Paulo, SP</div>
                <div className="text-[12.5px] text-brand-muted dark:text-gray-400 mt-0.5">Dor crônica neuropática · Paciente desde 2023</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. WHY CANNHUB — bg-brand-cream
          ================================================================ */}
      <section id="seguranca" className="bg-brand-cream dark:bg-surface-dark-card py-24 px-6 md:px-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left — text + photo */}
            <div>
              <div className="text-[11.5px] text-brand-green-light dark:text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-3.5">
                Por que a CannHub
              </div>
              <h2 className="font-serif text-[clamp(30px,4vw,44px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3 max-w-[540px]">
                Mais do que um diretório. Um guia para o caminho certo.
              </h2>
              <p className="text-sm text-brand-muted dark:text-gray-400 leading-[1.7] font-light mt-3">
                A CannHub não vende. A CannHub orienta — conectando você à prescrição, à documentação e às associações credenciadas certas para o seu caso.
              </p>

              {/* Photo placeholder */}
              <div className="relative mt-6 rounded-card overflow-hidden bg-brand-cream-dark dark:bg-surface-dark aspect-[4/3] flex flex-col items-center justify-center gap-2.5">
                <div aria-hidden="true" className="absolute left-1/2 top-0 w-px h-full bg-brand-cream-darker dark:bg-gray-700 opacity-40" />
                <div aria-hidden="true" className="absolute top-1/2 left-0 h-px w-full bg-brand-cream-darker dark:bg-gray-700 opacity-40" />
                <div className="relative z-10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-xs">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="relative z-10 text-[11px] text-brand-text-xs text-center leading-[1.5]">
                  Foto editorial — médico, paciente<br />ou ambiente de acolhimento
                </div>
                <div className="relative z-10 text-[9.5px] text-brand-cream-darker uppercase tracking-[0.06em]">520 × 390px</div>
              </div>
            </div>

            {/* Right — 3 stacked cards */}
            <div className="flex flex-col gap-3.5">
              {[
                {
                  title: 'Segurança jurídica em cada etapa',
                  body: 'Habeas corpus preventivo, conformidade com a RDC 660/2022 e suporte em caso de questionamentos. Você nunca anda sozinho.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                      <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" /><path d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Curadoria de associações credenciadas',
                  body: 'Só indicamos associações verificadas que seguem padrão Anvisa — com laudo analítico, rastreabilidade e conformidade legal. Quem vende é a associação, não a CannHub.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: 'Acolhimento humano, do começo ao fim',
                  body: 'Uma equipe real que avalia seu perfil clínico, orienta a prescrição e acompanha o resultado do tratamento ao longo do tempo.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-brand-off dark:bg-surface-dark border border-brand-cream-dark dark:border-gray-700 rounded-[16px] px-7 py-6 grid grid-cols-[44px_1fr] gap-[18px] items-start hover:border-brand-green-light transition-colors"
                >
                  <div className="w-11 h-11 bg-brand-green-pale dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-brand-text dark:text-white mb-1.5">{card.title}</div>
                    <div className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.6]">{card.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. FINAL CTA
          ================================================================ */}
      <div className="px-6 md:px-20 pb-24 md:pb-[120px]">
        <div className="relative max-w-[1100px] mx-auto bg-brand-green-deep rounded-banner py-[72px] px-8 md:px-20 overflow-hidden">
          {/* Decorative circle */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[120px] w-[300px] h-[300px] rounded-full bg-white/[0.025]" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20 items-center">
            <div>
              <div className="text-[11.5px] text-white/40 uppercase tracking-[0.1em] font-medium mb-3.5">
                Pronto para o primeiro passo?
              </div>
              <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] text-white leading-[1.1] tracking-[-0.02em] mb-3">
                O caminho seguro começa <em className="italic text-brand-green-xs">agora.</em>
              </h2>
              <p className="text-[15px] text-white/50 leading-[1.65] font-light">
                Leva menos de 5 minutos para iniciar o acolhimento. Sua equipe analisa o seu caso em até 48 horas.
              </p>
              {/* Trust items */}
              <div className="flex flex-wrap gap-5 mt-1.5">
                {['Sigiloso', 'Sem julgamento', '100% gratuito para começar'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-white/[0.35]">
                    <div className="w-3.5 h-3.5 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 5 4 8 8 2" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA buttons */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              <Link
                to={acolhimentoLink}
                className="px-7 py-3.5 bg-white text-brand-green-deep rounded-lg text-[15px] font-medium text-center whitespace-nowrap hover:opacity-[0.92] transition-opacity no-underline w-full"
              >
                Iniciar acolhimento
              </Link>
              <a
                href="#como-funciona"
                className="px-7 py-[13px] bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-sm text-center whitespace-nowrap hover:border-white/40 hover:text-white/[0.85] transition-all no-underline w-full"
              >
                Entender o processo primeiro
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          11. FOOTER
          ================================================================ */}
      <footer className="bg-brand-cream dark:bg-surface-dark-card border-t border-brand-cream-dark dark:border-gray-700 px-6 md:px-20 py-10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-10">
          {/* Logo */}
          <div className="font-serif text-[19px] text-brand-green-deep dark:text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 3C16 3 5 9 5 19C5 24.52 10.48 29 16 29C21.52 29 27 24.52 27 19C27 9 16 3 16 3Z" fill="#192F1A" opacity=".8" />
            </svg>
            CannHub
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 md:justify-center">
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-400 hover:text-brand-text dark:hover:text-white hover:underline transition-colors no-underline">Termos de uso</a>
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-400 hover:text-brand-text dark:hover:text-white hover:underline transition-colors no-underline">Privacidade</a>
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-400 hover:text-brand-text dark:hover:text-white hover:underline transition-colors no-underline">Contato</a>
            <Link to="/legislacao" className="text-[13px] text-brand-muted dark:text-gray-400 hover:text-brand-text dark:hover:text-white hover:underline transition-colors no-underline">Legislação</Link>
          </div>

          {/* Copyright */}
          <div className="text-[12.5px] text-brand-text-xs dark:text-gray-500">© 2025 CannHub</div>
        </div>

        {/* Legal disclaimer */}
        <div className="max-w-[1100px] mx-auto mt-5 pt-5 border-t border-brand-cream-dark dark:border-gray-700 text-xs text-brand-text-xs dark:text-gray-500 leading-[1.6]">
          Este site tem caráter exclusivamente informativo e educacional. As informações aqui contidas não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado. Todos os documentos são armazenados com criptografia e acessados apenas pela equipe de validação da CannHub. Seus dados clínicos nunca são compartilhados com terceiros sem seu consentimento expresso.
        </div>
      </footer>
    </div>
  )
}
