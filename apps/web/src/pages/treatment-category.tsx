import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { getCategoryBySlug, getCategoryTreatments, treatmentCategories } from '@/data/treatment-categories'
import { getEvidenceLabel } from '@/data/treatments'

const EVIDENCE_COLORS: Record<string, string> = {
  very_high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  high: 'bg-brand-green-pale text-brand-green-deep dark:bg-brand-green-deep/20 dark:text-brand-green-light',
  moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  emerging: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
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

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      {/* ─── Hero ─── */}
      <section className="bg-brand-green-deep relative overflow-hidden">
        {/* Decorative text */}
        <div className="absolute -right-5 -bottom-8 font-serif text-[clamp(140px,20vw,260px)] italic text-white opacity-[0.03] leading-none tracking-tighter pointer-events-none select-none">
          {category.decorativeText}
        </div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-20 pt-[140px] pb-20 relative z-[1]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-white/[0.35] mb-7">
            <Link to="/tratamentos" className="hover:text-white/60 transition-colors no-underline text-white/[0.35]">Tratamentos</Link>
            <span>/</span>
            <span className="text-white/50">{category.name}</span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[11.5px] text-white/40 uppercase tracking-[0.1em] font-medium mb-8">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
            {category.eyebrow}
          </div>

          <h1 className="font-serif text-[clamp(40px,5.5vw,64px)] text-white leading-[1.05] tracking-tight mb-6 max-w-[700px]">
            {category.headline} <em className="text-brand-green-xs italic">{category.headlineEmphasis}</em>
          </h1>

          <div className="max-w-[560px] space-y-4 mb-10">
            {category.intro.map((p, i) => (
              <p key={i} className="text-[16px] text-white/55 leading-[1.75] font-light">{p}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={ctaLink}
              className="px-6 py-3 bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium hover:opacity-90 transition-opacity no-underline"
            >
              Iniciar acolhimento
            </Link>
            <Link
              to="/tratamentos"
              className="px-5 py-3 bg-transparent text-white/65 border border-white/20 rounded-lg text-[14.5px] hover:border-white/40 hover:text-white transition-all no-underline"
            >
              ← Todos os tratamentos
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Category navigation pills ─── */}
      <div className="bg-brand-cream dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-brand-green-mid">
        <div className="max-w-[1100px] mx-auto px-6 md:px-20 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {treatmentCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/tratamentos/categoria/${cat.slug}`}
              className={`shrink-0 px-4 py-2 rounded-btn text-[13px] no-underline transition-all ${
                cat.slug === slug
                  ? 'bg-brand-green-deep text-white font-medium'
                  : 'text-brand-muted dark:text-gray-400 hover:bg-brand-cream-dark dark:hover:bg-brand-green-mid/30'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-6 md:px-20 py-16">

        {/* ─── Como os canabinoides atuam ─── */}
        <section className="mb-20">
          <div className="text-[11px] text-brand-text-xs uppercase tracking-[0.1em] font-medium mb-2.5">
            Mecanismo de ação
          </div>
          <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-tight mb-4 max-w-[540px]">
            {category.howCannabisHelps.title}
          </h2>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.75] mb-10 max-w-[680px]">
            {category.howCannabisHelps.text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.howCannabisHelps.keyPoints.map((point, i) => (
              <div key={i} className={`rounded-2xl p-7 ${category.tintBg} ${category.tintBgDark}`}>
                <div className="text-[15px] font-medium text-brand-text dark:text-white mb-2">{point.label}</div>
                <p className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65]">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Contexto endocanabinoide ─── */}
        <section className="mb-20">
          <div className="bg-brand-green-deep rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <span className="absolute -right-4 -bottom-6 font-serif text-[120px] text-white/[0.03] leading-none pointer-events-none select-none italic">SEC</span>
            <div className="relative z-[1]">
              <div className="text-[11px] text-white/40 uppercase tracking-[0.1em] font-medium mb-3">Sistema endocanabinoide</div>
              <p className="text-[15px] text-white/70 leading-[1.75] max-w-[640px] font-light">
                {category.endocannabinoidContext}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Tratamentos específicos ─── */}
        <section className="mb-20">
          <div className="text-[11px] text-brand-text-xs uppercase tracking-[0.1em] font-medium mb-2.5">
            Condições tratáveis
          </div>
          <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-tight mb-3">
            Tratamentos específicos
          </h2>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.75] mb-10 max-w-[560px]">
            Cada condição tem suas particularidades. Clique para ver sintomas, evidências científicas e protocolo detalhado.
          </p>

          <div className="flex flex-col gap-5">
            {categoryTreatments.map((t) => (
              <Link
                key={t.slug}
                to={`/tratamentos/${t.slug}`}
                className="group bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-2xl overflow-hidden hover:border-brand-green-light dark:hover:border-brand-green-light hover:shadow-card transition-all no-underline text-inherit"
              >
                <div className={`grid grid-cols-1 ${t.heroImage ? 'md:grid-cols-[280px_1fr]' : 'md:grid-cols-1'}`}>
                  {/* Image */}
                  {t.heroImage && (
                    <div className="h-[200px] md:h-auto overflow-hidden">
                      <img
                        src={t.heroImage}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                        width={280}
                        height={220}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-7 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-btn ${EVIDENCE_COLORS[t.evidenceLevel] ?? ''}`}>
                          {getEvidenceLabel(t.evidenceLevel)}
                        </span>
                        <span className="text-[12px] text-brand-text-xs dark:text-gray-500">
                          {t.compound} · {t.route}
                        </span>
                      </div>
                      <h3 className="font-serif text-[22px] text-brand-text dark:text-white mb-2.5 leading-[1.2] group-hover:text-brand-green-deep dark:group-hover:text-brand-green-light transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-4">
                        {t.sections.about.slice(0, 200)}...
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {t.sections.symptoms.slice(0, 3).map((s, j) => (
                          <span key={j} className="text-[11px] text-brand-text-xs dark:text-gray-500 bg-brand-cream dark:bg-white/5 border border-brand-cream-dark dark:border-white/10 rounded-full px-2.5 py-0.5">
                            {s.length > 30 ? s.slice(0, 30) + '...' : s}
                          </span>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full border border-brand-cream-dark dark:border-white/10 flex items-center justify-center shrink-0 ml-3 group-hover:bg-brand-green-deep group-hover:border-brand-green-deep group-hover:text-white dark:group-hover:bg-brand-green-light dark:group-hover:border-brand-green-light transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted dark:text-gray-500 group-hover:text-white">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section>
          <div className="bg-brand-green-deep rounded-2xl px-8 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-white/[0.025] pointer-events-none" />
            <div className="relative z-[1] max-w-[480px]">
              <div className="text-[11px] text-white/40 uppercase tracking-[0.1em] font-medium mb-3">Pronto para começar?</div>
              <h3 className="font-serif text-[clamp(24px,3vw,34px)] text-white leading-[1.15] mb-3">
                O tratamento certo começa com a <em className="text-brand-green-xs italic">avaliação certa.</em>
              </h3>
              <p className="text-[14px] text-white/50 leading-[1.65] font-light">
                A CannHub orienta você do acolhimento à conexão com médicos prescritores e associações credenciadas.
              </p>
              <div className="flex flex-wrap gap-5 mt-4">
                {['Sigiloso', 'Sem julgamento', 'Gratuito para começar'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[12px] text-white/[0.35]">
                    <div className="w-3.5 h-3.5 rounded-full bg-white/[0.08] flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <polyline points="2 5 4 8 8 2" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[220px] relative z-[1]">
              <Link
                to={ctaLink}
                className="px-7 py-3.5 bg-white text-brand-green-deep rounded-lg text-[15px] font-medium text-center hover:opacity-90 transition-opacity no-underline"
              >
                Iniciar acolhimento
              </Link>
              <Link
                to="/associacoes"
                className="px-7 py-3 bg-transparent text-white/60 border border-white/[0.18] rounded-lg text-[14px] text-center hover:border-white/40 hover:text-white/85 transition-all no-underline"
              >
                Já tenho prescrição — ver associações
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-brand-cream-dark dark:border-white/10">
          <p className="text-[12px] text-brand-text-xs dark:text-gray-600 leading-relaxed">
            Este site tem caráter informativo e educacional. Não substitui avaliação médica. Todos os tratamentos devem ser prescritos por profissional habilitado. As informações são baseadas em literatura científica publicada.
          </p>
        </div>
      </main>
    </div>
  )
}
