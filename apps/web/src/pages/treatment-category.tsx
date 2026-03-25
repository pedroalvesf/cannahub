import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { getCategoryBySlug, getCategoryTreatments, treatmentCategories } from '@/data/treatment-categories'
import { getEvidenceLabel } from '@/data/treatments'

/* ── Evidence badge colors ── */
const EVIDENCE_COLORS: Record<string, string> = {
  very_high: 'bg-brand-green-pale text-brand-green-light dark:bg-brand-green-deep/20 dark:text-brand-green-light',
  high: 'bg-brand-green-pale text-brand-green-light dark:bg-brand-green-deep/20 dark:text-brand-green-light',
  moderate: 'bg-[#FFF8E8] text-[#7A5010] dark:bg-amber-900/30 dark:text-amber-400',
  emerging: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

/* ── Compound pill colors ── */
function compoundPills(compound: string) {
  const lower = compound.toLowerCase()
  if (lower.includes('cbd') && lower.includes('thc'))
    return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-brand-green-deep text-white">CBD+THC</span>
  if (lower.includes('thc'))
    return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#5C7260] text-white">THC</span>
  return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-brand-green-deep text-white">CBD</span>
}

/* ── Category gradients for illustration placeholders ── */
const CATEGORY_GRADIENTS: Record<string, string> = {
  'neurologicas': 'linear-gradient(140deg, #C8DDC8 0%, #78A878 55%, #487848 100%)',
  'saude-mental': 'linear-gradient(140deg, #D4C8E0 0%, #9A88B8 55%, #6A5888 100%)',
  'dor-inflamacao': 'linear-gradient(140deg, #E0D4C8 0%, #B89878 55%, #886848 100%)',
  'oncologia-paliativos': 'linear-gradient(140deg, #D8C8E0 0%, #A888B8 55%, #785888 100%)',
}

/* ── Category tab SVG icons ── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  neurologicas: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z" />
    </svg>
  ),
  'saude-mental': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12C3 9 6 5 12 5C18 5 21 9 21 12C21 15 18 19 12 19C6 19 3 15 3 12Z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  'dor-inflamacao': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  'oncologia-paliativos': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
}

export function TreatmentCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const category = getCategoryBySlug(slug ?? '')

  if (!category) {
    return <Navigate to="/tratamentos" replace />
  }

  const categoryTreatments = getCategoryTreatments(category)
  const ctaLink = isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'
  const firstHeroImage = category.heroImage ?? categoryTreatments.find((t) => t.heroImage)?.heroImage
  const categoryGradient = CATEGORY_GRADIENTS[category.slug] ?? CATEGORY_GRADIENTS['neurologicas']

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      {/* ─── Breadcrumb bar ─── */}
      <div className="bg-brand-green-deep border-b border-white/[0.07] pt-[60px]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-20 py-2.5 flex items-center gap-2 text-[12.5px]">
          <Link to="/tratamentos" className="text-white/40 hover:text-white/70 transition-colors no-underline">
            Tratamentos
          </Link>
          <span className="text-white/20 text-[11px]">&rsaquo;</span>
          <span className="text-white/70">{category.name}</span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="bg-brand-green-deep relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute -right-10 -bottom-[30px] font-serif text-[clamp(100px,16vw,180px)] italic text-white opacity-[0.055] leading-none tracking-[-0.04em] pointer-events-none select-none whitespace-nowrap">
          {category.decorativeText}
        </div>

        <div className="max-w-[1100px] mx-auto relative z-[1] grid grid-cols-1 md:grid-cols-[1fr_400px] items-stretch min-h-[320px]">
          {/* Left column — text */}
          <div className="px-6 md:px-14 lg:px-20 py-[52px] flex flex-col justify-center">
            {/* Eyebrow tag */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/45 uppercase tracking-[0.1em] font-medium mb-4">
              <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
              {category.eyebrow}
            </div>

            <h1 className="font-serif text-[clamp(34px,4.5vw,52px)] text-white leading-[1.1] tracking-[-0.025em] mb-[18px]">
              {category.headline} <em className="text-brand-green-xs italic">{category.headlineEmphasis}</em>
            </h1>

            <p className="text-[15.5px] text-white/[0.52] leading-[1.7] font-light max-w-[420px] mb-8">
              {category.intro[0] ?? ''}
            </p>

            <div className="flex flex-wrap gap-2.5">
              <Link
                to={ctaLink}
                className="px-6 py-[11px] bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium hover:opacity-90 transition-opacity no-underline"
              >
                Iniciar acolhimento
              </Link>
              <Link
                to="/tratamentos"
                className="px-[18px] py-2.5 bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[14.5px] flex items-center gap-1.5 hover:text-white/85 hover:border-white/[0.38] transition-all no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Todos os tratamentos
              </Link>
            </div>
          </div>

          {/* Right column — hero image or gradient placeholder */}
          <div className="hidden md:flex border-l border-white/[0.07] relative overflow-hidden items-center justify-center">
            {firstHeroImage ? (
              <img
                src={firstHeroImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: categoryGradient }} />
            )}
            {/* Subtle overlay for text contrast */}
            {firstHeroImage && <div className="absolute inset-0 bg-brand-green-deep/30" />}
          </div>
        </div>
      </section>

      {/* ─── Category tabs bar ─── */}
      <div className="bg-brand-cream dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-white/10 overflow-x-auto scrollbar-hide">
        <div className="max-w-[1100px] mx-auto px-6 md:px-20 flex items-center whitespace-nowrap">
          {treatmentCategories.map((cat) => {
            const isActive = cat.slug === slug
            return (
              <Link
                key={cat.slug}
                to={`/tratamentos/categoria/${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-[18px] py-3.5 text-[13.5px] no-underline border-b-2 transition-colors ${
                  isActive
                    ? 'text-brand-green-deep dark:text-brand-green-light border-brand-green-deep dark:border-brand-green-light font-medium'
                    : 'text-brand-text-xs dark:text-gray-500 border-transparent hover:text-brand-text-md dark:hover:text-gray-300'
                }`}
              >
                {CATEGORY_ICONS[cat.slug]}
                {cat.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─── Mechanism section ─── */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-20 pt-16 pb-12">
        <div className="text-[11px] text-brand-text-xs dark:text-gray-500 uppercase tracking-[0.1em] font-medium mb-2.5">
          Mecanismo de ação
        </div>
        <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] text-brand-text dark:text-white leading-[1.15] tracking-tight mb-3.5 max-w-[540px]">
          {category.howCannabisHelps.title}
        </h2>
        <p className="text-[15px] text-brand-text-md dark:text-gray-400 leading-[1.75] max-w-[580px]">
          {category.howCannabisHelps.text}
        </p>

        {/* Key points cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
          {category.howCannabisHelps.keyPoints.map((point, i) => (
            <div key={i} className="bg-brand-cream dark:bg-surface-dark-card rounded-[14px] p-5">
              <div className="text-[14px] font-medium text-brand-text dark:text-white mb-1.5">{point.label}</div>
              <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.6]">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Endocannabinoid block */}
        <div className="bg-brand-green-deep rounded-[14px] p-6 md:p-7 mt-4 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-5 items-center">
          <div className="text-[10px] text-brand-green-xs uppercase tracking-[0.1em] font-medium">
            Sistema endocanabinoide
          </div>
          <p className="text-[14px] text-white/70 leading-[1.65]">
            {category.endocannabinoidContext}
          </p>
        </div>
      </section>

      {/* ─── Conditions section ─── */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-20 pt-4 pb-16">
        <div className="text-[11px] text-brand-text-xs dark:text-gray-500 uppercase tracking-[0.1em] font-medium mb-2.5">
          Condições tratáveis
        </div>
        <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] text-brand-text dark:text-white leading-[1.15] tracking-tight mb-3">
          Tratamentos específicos
        </h2>
        <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.65] max-w-[560px]">
          Cada condição tem suas particularidades. Clique para ver sintomas, evidências científicas e protocolo detalhado.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          {categoryTreatments.map((t) => (
            <Link
              key={t.slug}
              to={`/tratamentos/${t.slug}`}
              className="group bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-[18px] overflow-hidden hover:border-brand-green-light dark:hover:border-brand-green-light hover:shadow-[0_6px_24px_rgba(20,31,20,.07)] transition-all no-underline text-inherit grid grid-cols-1 md:grid-cols-[220px_1fr]"
            >
              {/* Left: image area */}
              <div
                className="relative overflow-hidden min-h-[140px] md:min-h-0 border-b md:border-b-0 md:border-r border-brand-cream-dark dark:border-white/10 flex items-center justify-center"
                style={!t.heroImage ? { background: categoryGradient } : undefined}
              >
                {t.heroImage ? (
                  <img
                    src={t.heroImage}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                    width={220}
                    height={180}
                  />
                ) : (
                  /* Grid pattern overlay for gradient placeholder */
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                )}
              </div>

              {/* Right: content */}
              <div className="p-[22px] md:p-[22px_26px] flex flex-col justify-between">
                <div>
                  {/* Header: badge + compound */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className={`text-[10.5px] font-medium px-2.5 py-[3px] rounded-full ${EVIDENCE_COLORS[t.evidenceLevel] ?? ''}`}>
                      {getEvidenceLabel(t.evidenceLevel)}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-brand-text-xs dark:text-gray-500">
                      {compoundPills(t.compound)}
                      <span className="ml-1">{t.route}</span>
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-serif text-[22px] text-brand-text dark:text-white mb-2 leading-[1.2] group-hover:text-brand-green-deep dark:group-hover:text-brand-green-light transition-colors">
                    {t.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65] mb-3.5">
                    {t.sections.about.length > 200 ? t.sections.about.slice(0, 200) + '...' : t.sections.about}
                  </p>

                  {/* Symptom tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.sections.symptoms.slice(0, 3).map((s, j) => (
                      <span
                        key={j}
                        className="text-[11.5px] text-brand-muted dark:text-gray-500 bg-brand-off dark:bg-white/5 border border-brand-cream-dark dark:border-white/10 rounded-full px-2.5 py-[3px]"
                      >
                        {s.length > 30 ? s.slice(0, 30) + '\u2026' : s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-brand-text-xs dark:text-gray-500">
                    Ver sintomas, evidências e protocolo
                  </span>
                  <div className="w-8 h-8 rounded-full border border-brand-cream-dark dark:border-white/10 flex items-center justify-center shrink-0 ml-3 group-hover:bg-brand-green-deep group-hover:border-brand-green-deep transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted dark:text-gray-500 group-hover:text-white">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── "Como começar" section ─── */}
      <div className="px-6 md:px-20 max-w-[1260px] mx-auto mb-14">
        <div className="bg-brand-cream dark:bg-surface-dark-card rounded-[20px] p-7 md:p-10 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-14 items-center">
          <div>
            <h3 className="font-serif text-[24px] text-brand-text dark:text-white leading-[1.2] mb-2.5">
              Como começar o tratamento
            </h3>
            <p className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65]">
              Todo tratamento começa com avaliação médica. O CannHub conecta você ao profissional certo e acompanha cada etapa.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-0">
            {[
              { num: '1', title: 'Consulta médica', desc: 'Médico especializado avalia seu histórico e indica o composto e via de administração certos.' },
              { num: '2', title: 'Produto e associação', desc: 'Prescrição em mãos, você acessa o produto via farmácia ou associação parceira.' },
              { num: '3', title: 'Acompanhamento', desc: 'Ajuste de dose e monitoramento contínuo ao longo de todo o tratamento.' },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center px-4 relative">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-[18px] w-px h-5 bg-brand-cream-dark dark:bg-white/10" />
                )}
                <div className="w-9 h-9 rounded-full bg-brand-green-deep text-white text-[13px] font-medium flex items-center justify-center mb-2.5 shrink-0 font-serif">
                  {step.num}
                </div>
                <div className="text-[13.5px] font-medium text-brand-text dark:text-white mb-1">{step.title}</div>
                <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-[1.55]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA section ─── */}
      <div className="px-6 md:px-20 max-w-[1260px] mx-auto mb-20">
        <div className="bg-brand-green-deep rounded-[20px] px-8 md:px-16 py-[52px] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-20 right-[60px] w-[280px] h-[280px] rounded-full bg-white/[0.025] pointer-events-none" />

          <div className="relative z-[1]">
            <div className="text-[11px] text-white/[0.38] uppercase tracking-[0.1em] font-medium mb-3">
              Pronto para começar?
            </div>
            <h2 className="font-serif text-[clamp(24px,3vw,34px)] text-white leading-[1.1] tracking-[-0.02em] mb-2.5">
              O tratamento certo começa com a <em className="text-brand-green-xs italic">avaliação certa.</em>
            </h2>
            <p className="text-[15px] text-white/50 leading-[1.65] font-light max-w-[400px]">
              A CannHub orienta você do acolhimento à conexão com médicos prescritores e associações credenciadas.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {['Sigiloso', 'Sem julgamento', 'Gratuito para começar'].map((item) => (
                <div key={item} className="flex items-center gap-[5px] text-[12px] text-white/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/[0.07] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 5 4 8 8 2" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 min-w-[200px] relative z-[1]">
            <Link
              to={ctaLink}
              className="px-7 py-[13px] bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium text-center hover:opacity-[0.92] transition-opacity no-underline"
            >
              Iniciar acolhimento
            </Link>
            <Link
              to="/associacoes"
              className="px-7 py-[11px] bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[13.5px] text-center hover:border-white/40 hover:text-white/85 transition-all no-underline"
            >
              Já tenho prescrição — ver associações
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Footer disclaimer ─── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-20 pb-16">
        <div className="pt-8 border-t border-brand-cream-dark dark:border-white/10">
          <p className="text-[12px] text-brand-text-xs dark:text-gray-600 leading-relaxed">
            Este site tem caráter informativo e educacional. Não substitui avaliação médica. Todos os tratamentos devem ser prescritos por profissional habilitado. As informações são baseadas em literatura científica publicada.
          </p>
        </div>
      </div>
    </div>
  )
}
