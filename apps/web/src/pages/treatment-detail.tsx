import type { ReactNode } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { getTreatmentBySlug, getEvidenceLabel, treatments } from '@/data/treatments'

/* ── Inline SVG icons for the condition nav bar ── */
const conditionIcons: Record<string, ReactNode> = {
  epilepsia: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  'dor-cronica': (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  ansiedade: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12C3 9 6 5 12 5C18 5 21 9 21 12C21 15 18 19 12 19C6 19 3 15 3 12Z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    </svg>
  ),
  autismo: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4H11V7.5C12 7.5 13.5 8 13.5 9.5C13.5 11 12 11.5 11 11.5V15H4V11.5C3 11.5 1.5 11 1.5 9.5C1.5 8 3 7.5 4 7.5V4Z" />
      <path d="M11 15H4V22H11V19C11 18 11.5 16.5 13 16.5C14.5 16.5 15 18 15 19V22H22V15H19C18 15 16.5 14.5 16.5 13C16.5 11.5 18 11 19 11V4H15" />
    </svg>
  ),
  oncologia: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
    </svg>
  ),
  parkinson: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z" />
    </svg>
  ),
  'esclerose-multipla': (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13C5.5 9.5 7 16 9 13C11 10 13 16 15 13C17 10 19 16 21 13" />
      <circle cx="3" cy="13" r="1.5" fill="currentColor" />
      <circle cx="21" cy="13" r="1.5" fill="currentColor" />
    </svg>
  ),
  insonia: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
}

/** Extract a highlight number from evidence text, e.g. "39%" or "44%" */
function extractHighlightStat(text: string): { num: string; unit: string } | null {
  const m = text.match(/(\d+(?:[,.]\d+)?)\s*%/)
  if (m) return { num: `${m[1]}%`, unit: 'de redução' }
  return null
}

/** Get a decorative big number for the hero background */
function getHeroDecorativeText(slug: string): string {
  const map: Record<string, string> = {
    epilepsia: '50%',
    'dor-cronica': '64%',
    ansiedade: '79%',
    autismo: '61%',
    oncologia: '70%',
    parkinson: '300',
    'esclerose-multipla': '74%',
    insonia: '66%',
  }
  return map[slug] ?? ''
}

/* ── Sidebar section anchors ── */
const sidebarSections = [
  { id: 'sobre', label: 'Sobre a condição' },
  { id: 'sintomas', label: 'Sintomas' },
  { id: 'como-ajuda', label: 'Como a cannabis ajuda' },
  { id: 'evidencias', label: 'Evidências científicas' },
  { id: 'protocolo', label: 'Protocolo de tratamento' },
]

export function TreatmentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const treatment = getTreatmentBySlug(slug ?? '')

  if (!treatment) {
    return <Navigate to="/tratamentos" replace />
  }

  const { sections } = treatment
  const ctaLink = isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'
  const otherConditions = treatments.filter((t) => t.slug !== slug)
  const decorativeText = getHeroDecorativeText(treatment.slug)

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      <main className="pt-[80px]">

        {/* ═══════ 1. CONDITION NAV BAR ═══════ */}
        <div className="bg-white dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-white/10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-[1100px] mx-auto flex items-stretch whitespace-nowrap">
            {treatments.map((t) => {
              const isActive = t.slug === slug
              return (
                <Link
                  key={t.slug}
                  to={`/tratamentos/${t.slug}`}
                  className={`flex flex-col items-center gap-1.5 px-4 lg:px-[18px] py-3.5 shrink-0 no-underline border-b-2 transition-colors ${
                    isActive
                      ? 'border-brand-green-deep text-brand-green-deep dark:text-brand-green-xs dark:border-brand-green-xs'
                      : 'border-transparent text-brand-text-xs dark:text-gray-500 hover:text-brand-text-md dark:hover:text-gray-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-brand-green-pale dark:bg-brand-green-deep/40'
                        : 'bg-brand-cream dark:bg-white/5'
                    }`}
                  >
                    {conditionIcons[t.slug] ?? null}
                  </div>
                  <span className="text-[11px] leading-tight text-center max-w-[80px] whitespace-normal">
                    {t.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ═══════ 2. CONDITION HERO ═══════ */}
        <section className="bg-brand-green-deep relative overflow-hidden">
          {/* Decorative big number */}
          <span
            className="absolute right-[-20px] bottom-[-32px] font-serif text-white opacity-[0.04] leading-none tracking-tighter pointer-events-none select-none"
            style={{ fontSize: 'clamp(160px, 22vw, 280px)' }}
          >
            {decorativeText}
          </span>

          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] items-stretch min-h-[380px]">
            {/* Left: text */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-20 lg:py-14 relative z-[1]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[12px] text-white/35 mb-7">
                <Link to="/tratamentos" className="text-white/35 no-underline hover:text-white/65 transition-colors">
                  Tratamentos
                </Link>
                <span className="text-white/20">&rsaquo;</span>
                <span className="text-white/55">{treatment.name}</span>
              </div>

              {/* Category pill */}
              <div className="flex items-center gap-1.5 text-[11px] text-white/45 uppercase tracking-widest font-medium mb-3.5">
                <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
                {getEvidenceLabel(treatment.evidenceLevel)}
              </div>

              {/* H1 */}
              <h1
                className="font-serif text-white leading-[1.08] tracking-tight mb-4"
                style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
              >
                {treatment.name}
              </h1>

              {/* Tagline */}
              <p className="text-[16px] text-white/55 leading-relaxed font-light max-w-[440px] mb-8">
                {treatment.shortDescription}
              </p>

              {/* Protocol pills */}
              <div className="flex flex-wrap gap-2.5">
                <div className="inline-flex flex-col bg-white/[0.08] border border-white/[0.12] rounded-lg px-3 py-[7px]">
                  <span className="text-[10px] text-white/35 uppercase tracking-wide">Composto</span>
                  <span className="text-[12.5px] text-white/85 font-medium">{treatment.compound}</span>
                </div>
                <div className="inline-flex flex-col bg-white/[0.08] border border-white/[0.12] rounded-lg px-3 py-[7px]">
                  <span className="text-[10px] text-white/35 uppercase tracking-wide">Via</span>
                  <span className="text-[12.5px] text-white/85 font-medium">{treatment.route}</span>
                </div>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="hidden lg:flex items-center justify-center bg-white/[0.04] border-l border-white/[0.06] relative overflow-hidden">
              {treatment.heroImage ? (
                <img src={treatment.heroImage} alt={treatment.name} className="w-full h-full object-cover" loading="eager" width={360} height={380} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3.5 p-10 relative">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <div className="w-[120px] h-[120px] rounded-full bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center gap-2 relative z-[1]">
                    <svg className="w-9 h-9 stroke-white/25 fill-none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-[10px] text-white/20 uppercase tracking-wide text-center leading-snug">
                      Ilustração<br />da condição
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════ 3. KEY STRIP ═══════ */}
        <div className="bg-brand-green-pale dark:bg-brand-green-deep/30 border-b border-[#C8DDB8] dark:border-brand-green-deep/50 px-6 lg:px-20 py-2.5">
          <div className="max-w-[1100px] mx-auto flex flex-wrap items-center gap-6 text-[12px] text-brand-green-light dark:text-brand-green-xs">
            <div className="flex items-center gap-[5px]">
              <svg className="w-[13px] h-[13px] stroke-brand-green-light dark:stroke-brand-green-xs fill-none" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Conteúdo revisado por especialistas
            </div>
            <div className="w-px h-3.5 bg-black/10 dark:bg-white/10" />
            <div className="flex items-center gap-[5px]">
              <svg className="w-[13px] h-[13px] stroke-brand-green-light dark:stroke-brand-green-xs fill-none" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              Baseado em literatura científica publicada
            </div>
          </div>
        </div>

        {/* ═══════ 4. MAIN CONTENT (2-column) ═══════ */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14 px-6 lg:px-20 py-14 items-start">

          {/* ── Left column: content sections ── */}
          <div className="flex flex-col">

            {/* SECTION: Sobre a condição */}
            <div id="sobre" className="py-10 border-b border-brand-cream-dark dark:border-white/10 scroll-mt-24">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-2.5">Sobre a condição</div>
              <h2
                className="font-serif text-brand-text dark:text-white leading-[1.15] tracking-tight mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                O que é {treatment.name.toLowerCase()}.
              </h2>
              <p className="text-[15px] text-brand-text-md dark:text-gray-300 leading-[1.75]">
                {sections.about}
              </p>

              {/* Identification block */}
              <div className="bg-brand-cream dark:bg-white/5 rounded-2xl p-7 mt-6">
                <div className="flex items-center gap-2 text-[14px] font-medium text-brand-text dark:text-white mb-4">
                  <svg className="w-4 h-4 stroke-brand-green-light fill-none shrink-0" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Sintomas que o tratamento pode aliviar:
                </div>
                <div className="flex flex-col gap-2">
                  {sections.symptoms.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[14px] text-brand-text-md dark:text-gray-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green-light shrink-0 mt-[7px]" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION: Como a cannabis ajuda */}
            <div id="como-ajuda" className="py-10 border-b border-brand-cream-dark dark:border-white/10 scroll-mt-24">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-2.5">Como funciona</div>
              <h2
                className="font-serif text-brand-text dark:text-white leading-[1.15] tracking-tight mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                Como a cannabis ajuda.
              </h2>
              <p className="text-[15px] text-brand-text-md dark:text-gray-300 leading-[1.75]">
                {sections.howCannabisHelps}
              </p>

              {/* Mechanism illustration placeholder */}
              <div className="bg-brand-cream-dark dark:bg-white/5 rounded-[14px] h-[220px] flex flex-col items-center justify-center gap-2.5 mt-6 relative overflow-hidden">
                <div className="absolute w-px h-full left-1/2 bg-brand-sand/40 dark:bg-white/5" />
                <div className="absolute h-px w-full top-1/2 bg-brand-sand/40 dark:bg-white/5" />
                <svg className="w-7 h-7 stroke-brand-text-xs fill-none relative z-[1]" strokeWidth="1.3" strokeLinecap="round" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-[11px] text-brand-text-xs text-center leading-snug relative z-[1]">
                  Diagrama do mecanismo de ação<br />ou infográfico explicativo
                </span>
                <span className="text-[10px] text-brand-sand uppercase tracking-wide relative z-[1]">680 x 220px</span>
              </div>
            </div>

            {/* SECTION: Sintomas */}
            <div id="sintomas" className="py-10 border-b border-brand-cream-dark dark:border-white/10 scroll-mt-24">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-2.5">Sintomas</div>
              <h2
                className="font-serif text-brand-text dark:text-white leading-[1.15] tracking-tight mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                Sintomas que a cannabis medicinal pode aliviar.
              </h2>
              <p className="text-[15px] text-brand-text-md dark:text-gray-300 leading-[1.75] mb-5">
                Os sintomas associados a essa condição variam em intensidade. A cannabis medicinal atua no alívio de vários deles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-stretch">
                {sections.symptoms.map((symptom, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 px-4 bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-xl text-[13.5px] text-brand-text-md dark:text-gray-300 leading-snug min-h-[56px]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-green-pale dark:bg-brand-green-deep/30 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 stroke-brand-green-deep dark:stroke-brand-green-xs fill-none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    {symptom}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: Evidencias cientificas */}
            <div id="evidencias" className="py-10 border-b border-brand-cream-dark dark:border-white/10 scroll-mt-24">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-2.5">Evidências científicas</div>
              <h2
                className="font-serif text-brand-text dark:text-white leading-[1.15] tracking-tight mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                O que os estudos mostram.
              </h2>
              <p className="text-[15px] text-brand-text-md dark:text-gray-300 leading-[1.75] mb-6">
                Nível de evidência: <strong className="font-medium text-brand-text dark:text-white">{getEvidenceLabel(treatment.evidenceLevel)}</strong>. Resultados documentados em estudos revisados por pares.
              </p>

              {/* Proof cards (dark green box) */}
              <div className="bg-brand-green-deep rounded-card p-8 relative overflow-hidden">
                {/* Decorative quote */}
                <span className="absolute top-[-24px] left-5 font-serif text-[160px] text-white/[0.04] leading-none pointer-events-none select-none">&ldquo;</span>

                <div className="mb-5">
                  <div className="text-[14px] font-medium text-white mb-0.5">Resultados documentados em estudos revisados por pares</div>
                  <div className="text-[12px] text-white/[0.38]">Aplicados ao contexto clínico brasileiro</div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {sections.evidence.map((ev, i) => {
                    const stat = extractHighlightStat(ev.text)
                    return (
                      <div
                        key={i}
                        className="bg-white/[0.07] border border-white/10 rounded-xl p-[18px] px-5 grid gap-4 items-start"
                        style={{ gridTemplateColumns: stat ? '64px 1fr' : '1fr' }}
                      >
                        {stat && (
                          <div>
                            <div className="font-serif text-[36px] text-brand-green-xs leading-none">{stat.num}</div>
                            <div className="text-[12px] text-white/35 mt-0.5">{stat.unit}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-[13.5px] text-white/[0.78] leading-relaxed mb-1.5">{ev.text}</div>
                          <div className="text-[11px] text-white/[0.28] italic">{ev.source}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* SECTION: Protocolo */}
            <div id="protocolo" className="py-10 scroll-mt-24">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-2.5">Protocolo</div>
              <h2
                className="font-serif text-brand-text dark:text-white leading-[1.15] tracking-tight mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                Como é o tratamento.
              </h2>
              <p className="text-[15px] text-brand-text-md dark:text-gray-300 leading-[1.75] mb-6">
                O tratamento com cannabis medicinal para {treatment.name.toLowerCase()} utiliza principalmente{' '}
                <strong className="font-medium text-brand-text dark:text-white">{treatment.compound}</strong>, administrado via{' '}
                <strong className="font-medium text-brand-text dark:text-white">{treatment.route.toLowerCase()}</strong>.
              </p>

              {/* Protocol table */}
              <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-card p-7">
                {sections.protocols.map((p, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-5 py-4 items-start ${
                      i < sections.protocols.length - 1 ? 'border-b border-brand-cream-dark dark:border-white/10' : ''
                    } ${i === 0 ? 'pt-0' : ''} ${i === sections.protocols.length - 1 ? 'pb-0' : ''}`}
                  >
                    <div className="text-[11px] text-brand-text-xs uppercase tracking-wide font-medium pt-0.5">
                      {p.label}
                    </div>
                    <div className="text-[14px] text-brand-text-md dark:text-gray-300 leading-relaxed">
                      {p.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="bg-brand-cream dark:bg-white/5 rounded-xl px-5 py-4 mt-6 flex gap-3 items-start">
                <svg className="w-4 h-4 stroke-brand-text-xs fill-none shrink-0 mt-0.5" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[12.5px] text-brand-muted dark:text-gray-400 leading-relaxed">
                  As informações desta página têm caráter exclusivamente educativo, baseadas em literatura científica publicada. Não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado.
                </p>
              </div>
            </div>

          </div>

          {/* ── Right column: sidebar ── */}
          <div className="hidden lg:flex flex-col gap-3.5 sticky top-[80px]">

            {/* Page index */}
            <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-[14px] p-[18px]">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium mb-3">Nesta página</div>
              <div className="flex flex-col gap-0.5">
                {sidebarSections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] text-brand-muted dark:text-gray-400 no-underline hover:bg-brand-cream dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-white transition-colors"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-brand-sand shrink-0" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-brand-green-deep rounded-[14px] p-[22px]">
              <div className="text-[10.5px] text-white/40 uppercase tracking-widest mb-2">Quer regularizar?</div>
              <div className="font-serif text-[19px] text-white leading-snug mb-1.5">
                Encontre a associação certa para esta condição
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mb-5">
                A CannHub orienta do acolhimento clínico até a associação credenciada com experiência nesta condição.
              </p>
              <Link
                to={ctaLink}
                className="block w-full py-[11px] bg-white text-brand-green-deep rounded-lg text-[14px] font-medium text-center no-underline mb-2 hover:opacity-90 transition-opacity"
              >
                Iniciar acolhimento
              </Link>
              <Link
                to="/associacoes"
                className="block w-full py-[9px] bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[13px] text-center no-underline hover:border-white/40 hover:text-white/85 transition-colors"
              >
                Já tenho prescrição — ver associações
              </Link>
            </div>

            {/* Other conditions */}
            <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-[14px] overflow-hidden">
              <div className="text-[11px] text-brand-text-xs uppercase tracking-widest font-medium px-4 pt-3.5 pb-2.5 border-b border-brand-cream-dark dark:border-white/10">
                Outras condições
              </div>
              {otherConditions.slice(0, 4).map((t) => (
                <Link
                  key={t.slug}
                  to={`/tratamentos/${t.slug}`}
                  className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-brand-text-md dark:text-gray-300 no-underline border-b border-brand-cream-dark dark:border-white/10 last:border-b-0 hover:bg-brand-cream dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-cream dark:bg-white/5 flex items-center justify-center shrink-0">
                    {conditionIcons[t.slug] ?? null}
                  </div>
                  <span className="flex-1">{t.name}</span>
                  <span className="text-brand-text-xs text-[12px]">&rarr;</span>
                </Link>
              ))}
            </div>

            {/* Legal sidebar */}
            <div className="bg-brand-cream dark:bg-white/5 rounded-xl px-4 py-3.5 flex gap-2.5 items-start">
              <svg className="w-[13px] h-[13px] stroke-brand-text-xs fill-none shrink-0 mt-0.5" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed">
                Conteúdo baseado em literatura científica revisada por pares. Não constitui prescrição médica.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ 5. CTA FINAL SECTION ═══════ */}
        <div className="px-6 lg:px-20 pb-20">
          <div className="max-w-[1100px] mx-auto bg-brand-green-deep rounded-[20px] p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-[-80px] right-[60px] w-[300px] h-[300px] rounded-full bg-white/[0.025] pointer-events-none" />

            <div className="relative z-[1]">
              <div className="text-[11px] text-white/[0.38] uppercase tracking-widest font-medium mb-3">
                Pronto para regularizar?
              </div>
              <h2
                className="font-serif text-white leading-[1.1] tracking-tight mb-2.5"
                style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
              >
                Seu tratamento merece<br />
                <em className="italic text-brand-green-xs">segurança e respaldo.</em>
              </h2>
              <p className="text-[15px] text-white/50 leading-relaxed font-light max-w-[420px] mb-4">
                A CannHub orienta você do acolhimento clínico até a associação credenciada certa — com experiência comprovada em {treatment.name.toLowerCase()}.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-[5px] text-[12px] text-white/30">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/[0.07] flex items-center justify-center">
                    <svg className="w-2 h-2 stroke-white/45 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 10 10">
                      <polyline points="2 5 4 8 8 2" />
                    </svg>
                  </span>
                  Sigiloso
                </div>
                <div className="flex items-center gap-[5px] text-[12px] text-white/30">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/[0.07] flex items-center justify-center">
                    <svg className="w-2 h-2 stroke-white/45 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 10 10">
                      <polyline points="2 5 4 8 8 2" />
                    </svg>
                  </span>
                  Sem julgamento
                </div>
                <div className="flex items-center gap-[5px] text-[12px] text-white/30">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/[0.07] flex items-center justify-center">
                    <svg className="w-2 h-2 stroke-white/45 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 10 10">
                      <polyline points="2 5 4 8 8 2" />
                    </svg>
                  </span>
                  Gratuito para começar
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 min-w-[200px] relative z-[1]">
              <Link
                to={ctaLink}
                className="block w-full py-[13px] px-7 bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium text-center no-underline hover:opacity-90 transition-opacity"
              >
                Iniciar acolhimento
              </Link>
              <Link
                to="/associacoes"
                className="block w-full py-[11px] px-7 bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[13.5px] text-center no-underline hover:border-white/40 hover:text-white/85 transition-colors"
              >
                Ver associações
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════ 7. DISCLAIMER (footer-level) ═══════ */}
        <div className="border-t border-brand-cream-dark dark:border-white/10 bg-brand-cream dark:bg-surface-dark">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-20 py-6">
            <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-relaxed max-w-[800px]">
              As informações desta página têm caráter exclusivamente educativo, baseadas em literatura científica publicada. Não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado. As informações sobre protocolos de dosagem são referências de estudos clínicos e não constituem recomendação terapêutica individualizada.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
