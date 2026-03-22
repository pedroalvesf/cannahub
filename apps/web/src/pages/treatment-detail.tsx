import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { getTreatmentBySlug, treatments } from '@/data/treatments'

export function TreatmentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const treatment = getTreatmentBySlug(slug ?? '')

  if (!treatment) {
    return <Navigate to="/tratamentos" replace />
  }

  const { sections } = treatment
  const ctaLink = isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="pt-[80px] pb-20">
        {/* Menu de condições */}
        <div className="max-w-[1100px] mx-auto px-6 mt-6 mb-2">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {treatments.map((t) => (
              <Link
                key={t.slug}
                to={`/tratamentos/${t.slug}`}
                className={`group flex flex-col items-center gap-2 min-w-[80px] shrink-0 no-underline transition-opacity ${
                  t.slug === slug ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img src={t.iconImage} alt="" className="w-[56px] h-[56px]" />
                <span className={`text-[12px] text-center leading-tight ${
                  t.slug === slug
                    ? 'font-semibold text-brand-green-deep dark:text-white'
                    : 'text-brand-muted dark:text-gray-400'
                }`}>
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="h-[3px] bg-brand-cream-dark dark:bg-gray-700/40 rounded-full" />
        </div>

        <div className="max-w-[1100px] mx-auto px-6">
          {/* ─── Hero: imagem + texto lado a lado ───────────── */}
          <section className="flex flex-col md:flex-row gap-0 mt-8 mb-16">
            {/* Imagem — ocupa metade, altura livre */}
            <div className="w-full md:w-1/2 shrink-0">
              <div className="bg-brand-white dark:bg-surface-dark-card rounded-l-card md:rounded-l-card md:rounded-r-none rounded-card overflow-hidden aspect-[4/5] flex items-center justify-center">
                <img
                  src={treatment.image}
                  alt={treatment.name}
                  className="w-full h-full object-contain p-6"
                />
              </div>
            </div>

            {/* Texto */}
            <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-10 pt-8 md:pt-0">
              <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-6" style={{ textAlign: 'justify' }}>
                {sections.about}
              </p>
              <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-8" style={{ textAlign: 'justify' }}>
                {sections.howCannabisHelps}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={ctaLink}
                  className="text-[14px] font-semibold text-brand-white bg-brand-green-deep px-6 py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                >
                  Inicie seu tratamento
                </Link>
                <Link
                  to="/associacoes"
                  className="text-[14px] font-medium text-brand-green-deep border border-brand-green-deep/30 px-6 py-3 rounded-btn hover:bg-brand-green-pale transition-colors no-underline"
                >
                  Encontre uma associação
                </Link>
              </div>
            </div>
          </section>

          {/* ─── Sintomas ─────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="font-serif text-[28px] text-brand-green-deep dark:text-white mb-4">
              Sintomas
            </h2>

            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-6 max-w-[900px]">
              Os sintomas associados a essa condição podem variar em intensidade. A cannabis medicinal atua no alívio de diversos deles:
            </p>

            <ul className="space-y-2 max-w-[600px] mb-6">
              {sections.symptoms.map((symptom, i) => (
                <li key={i} className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7]">
                  • {symptom}
                </li>
              ))}
            </ul>
          </section>

          {/* ─── Tratamento ───────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="font-serif text-[28px] text-brand-green-deep dark:text-white mb-4">
              Tratamento
            </h2>

            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-4 max-w-[900px]" style={{ textAlign: 'justify' }}>
              O tratamento com cannabis medicinal para {treatment.name.toLowerCase()} utiliza principalmente <strong className="font-medium text-brand-text dark:text-gray-300">{treatment.compound}</strong>, administrado via <strong className="font-medium text-brand-text dark:text-gray-300">{treatment.route.toLowerCase()}</strong>.
            </p>

            {sections.evidence.map((ev, i) => (
              <p key={i} className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-3 max-w-[900px]" style={{ textAlign: 'justify' }}>
                {ev.text} <span className="text-[13px] italic text-brand-sand dark:text-gray-500">({ev.source})</span>
              </p>
            ))}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to={ctaLink}
                className="text-[14px] font-semibold text-brand-white bg-brand-green-deep px-6 py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
              >
                Inicie seu tratamento
              </Link>
              <Link
                to="/associacoes"
                className="text-[14px] font-medium text-brand-green-deep border border-brand-green-deep/30 px-6 py-3 rounded-btn hover:bg-brand-green-pale transition-colors no-underline"
              >
                Encontre uma associação
              </Link>
            </div>
          </section>

          {/* ─── Disclaimer ───────────────────────────────────── */}
          <div className="border-t border-brand-cream-dark dark:border-gray-700/40 pt-8">
            <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-relaxed max-w-[700px]">
              As informações desta página têm caráter exclusivamente educativo, baseadas em literatura científica publicada. Não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
