import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { treatments } from '@/data/treatments'

// Agrupamento por categoria — dá identidade visual a cada bloco
const categories = [
  {
    title: 'Condições neurológicas',
    description: 'O sistema endocanabinoide tem papel central na regulação neuronal. CBD e THC atuam como neuroprotetores, anticonvulsivantes e moduladores da neurotransmissão, com aplicações em epilepsia, Parkinson e esclerose múltipla.',
    slugs: ['epilepsia', 'parkinson', 'esclerose-multipla'],
  },
  {
    title: 'Dor e inflamação',
    description: 'Canabinoides modulam a dor atuando em receptores CB1 e CB2, oferecendo uma alternativa aos opioides com menor risco de dependência. Meta-análises publicadas na JAMA e no British Medical Journal comprovam a eficácia em diversas condições álgicas.',
    slugs: ['dor-cronica'],
  },
  {
    title: 'Saúde mental e sono',
    description: 'O CBD interage com receptores serotoninérgicos (5-HT1A), produzindo efeito ansiolítico sem os riscos de dependência dos benzodiazepínicos. Para distúrbios do sono, a combinação THC em dose baixa + CBD é investigada como alternativa aos hipnóticos convencionais.',
    slugs: ['ansiedade', 'insonia'],
  },
  {
    title: 'Cuidados especiais',
    description: 'Em contextos como autismo (TEA) e oncologia, canabinoides atuam em múltiplas frentes — desde o controle de sintomas comportamentais até o manejo de náusea e dor em cuidados paliativos. Estudos brasileiros, liderados por universidades como USP e Unicamp, têm contribuído com evidências importantes.',
    slugs: ['autismo', 'oncologia'],
  },
]

export function TreatmentsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="pt-[80px] pb-20">
        {/* ─── Hero editorial ──────────────────────────────── */}
        <section className="px-6 max-w-[1100px] mx-auto mt-10 mb-16">
          <h1 className="font-serif text-[clamp(32px,5vw,52px)] leading-[1.1] text-brand-green-deep dark:text-white mb-6">
            Tratamentos <span className="text-brand-muted dark:text-gray-400">médicos</span>
          </h1>

          <div className="max-w-[820px] space-y-5">
            <p className="text-[16px] text-brand-muted dark:text-gray-400 leading-[1.8]">
              A cannabis medicinal vem se consolidando como alternativa terapêutica para condições que não respondem adequadamente aos tratamentos convencionais. Com mais de <strong className="font-medium text-brand-text dark:text-gray-300">25 produtos autorizados pela Anvisa</strong> e uma estimativa de <strong className="font-medium text-brand-text dark:text-gray-300">6,9 milhões de brasileiros</strong> que poderiam se beneficiar, o cenário regulatório avança a cada ano.
            </p>
            <p className="text-[16px] text-brand-muted dark:text-gray-400 leading-[1.8]">
              Abaixo, organizamos as principais condições tratáveis por categoria. Cada uma conta com informações sobre sintomas, mecanismos de ação dos canabinoides, evidências científicas e protocolos utilizados por médicos prescritores no Brasil.
            </p>
          </div>

          {/* Inline stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: '25+', label: 'produtos Anvisa' },
              { value: '6,9M', label: 'potenciais pacientes' },
              { value: '~50 mil', label: 'pacientes ativos' },
            ].map((stat, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold text-brand-green-deep dark:text-brand-green-light leading-none">{stat.value}</span>
                <span className="text-[13px] text-brand-muted dark:text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="h-px bg-brand-cream-dark dark:bg-gray-700/40" />
        </div>

        {/* ─── Categorias ──────────────────────────────────── */}
        {categories.map((category, catIndex) => {
          const categoryTreatments = category.slugs
            .map((s) => treatments.find((t) => t.slug === s))
            .filter(Boolean) as typeof treatments

          return (
            <section key={catIndex} className="px-6 max-w-[1100px] mx-auto py-16">
              {/* Category header */}
              <div className="mb-12">
                <span className="text-[11px] font-semibold text-brand-green-light uppercase tracking-[0.08em] mb-3 block">
                  {String(catIndex + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] text-brand-green-deep dark:text-white mb-4">
                  {category.title}
                </h2>
                <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.75] max-w-[720px]">
                  {category.description}
                </p>
              </div>

              {/* Treatments in category — alternating layout */}
              <div className="space-y-16">
                {categoryTreatments.map((t, tIndex) => {
                  const imageLeft = tIndex % 2 === 0

                  return (
                    <div
                      key={t.slug}
                      className={`flex flex-col gap-8 ${
                        imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      } items-center`}
                    >
                      {/* Image */}
                      <Link
                        to={`/tratamentos/${t.slug}`}
                        className="w-full md:w-5/12 shrink-0 no-underline"
                      >
                        <div className="bg-brand-white dark:bg-surface-dark-card rounded-card overflow-hidden border border-brand-cream-dark dark:border-gray-700/40 hover:shadow-lg transition-shadow aspect-[4/3] flex items-center justify-center">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                      </Link>

                      {/* Text */}
                      <div className="w-full md:w-7/12">
                        <h3 className="font-serif text-[24px] text-brand-green-deep dark:text-white mb-3">
                          {t.name}
                        </h3>
                        <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-4">
                          {t.sections.about}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5 text-[13px]">
                          <span className="text-brand-muted dark:text-gray-500">
                            <span className="font-semibold text-brand-text dark:text-gray-300">Composto: </span>
                            {t.compound}
                          </span>
                          <span className="text-brand-muted dark:text-gray-500">
                            <span className="font-semibold text-brand-text dark:text-gray-300">Via: </span>
                            {t.route}
                          </span>
                        </div>
                        <Link
                          to={`/tratamentos/${t.slug}`}
                          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-green-deep dark:text-brand-green-light hover:text-brand-green-mid transition-colors no-underline"
                        >
                          Ver sintomas, evidências e protocolo
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Category divider (except last) */}
              {catIndex < categories.length - 1 && (
                <div className="mt-16 h-px bg-gradient-to-r from-transparent via-brand-cream-dark dark:via-gray-700 to-transparent" />
              )}
            </section>
          )
        })}

        {/* ─── Entenda o sistema endocanabinoide ───────────── */}
        <section className="px-6 max-w-[1100px] mx-auto py-16">
          <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-8 md:p-10">
            <h2 className="font-serif text-[24px] text-brand-green-deep dark:text-white mb-5">
              Por que a cannabis funciona?
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.8] mb-6 max-w-[780px]">
              O corpo humano possui um sistema endocanabinoide (SEC) — uma rede de receptores que regula dor, humor, apetite, sono e inflamação. Os dois principais receptores, CB1 (sistema nervoso central) e CB2 (sistema imunológico), são ativados tanto por canabinoides produzidos pelo próprio corpo quanto pelos fitocanabinoides da cannabis.
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 border-l-[3px] border-brand-green-light pl-5">
                <span className="text-[15px] font-bold text-brand-green-deep dark:text-brand-green-light block mb-1">CBD — Canabidiol</span>
                <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7]">
                  Não psicoativo. Anticonvulsivante, ansiolítico, anti-inflamatório. Não causa dependência. Atua em receptores 5-HT1A, TRPV1 e CB2.
                </p>
              </div>
              <div className="flex-1 border-l-[3px] border-amber-400 pl-5">
                <span className="text-[15px] font-bold text-brand-green-deep dark:text-amber-400 block mb-1">THC — Tetrahidrocanabinol</span>
                <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7]">
                  Psicoativo em doses elevadas. Potente analgésico e antiemético. Ativa receptores CB1. Indicado para dor, náusea e apetite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA final ───────────────────────────────────── */}
        <section className="px-6 max-w-[1100px] mx-auto">
          <div className="bg-brand-green-deep rounded-card px-8 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-[100px] -top-[100px] w-[320px] h-[320px] rounded-full bg-white/[0.03] pointer-events-none" />
            <div className="relative z-10 max-w-[500px]">
              <h3 className="font-serif text-[28px] text-brand-white leading-[1.3] mb-3">
                Quer iniciar seu tratamento?
              </h3>
              <p className="text-[14px] text-brand-white/55 leading-[1.7]">
                A CannHub orienta você desde o primeiro passo — do acolhimento até a conexão com associações credenciadas e médicos prescritores.
              </p>
            </div>
            <Link
              to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
              className="relative z-10 text-[15px] font-semibold text-brand-green-deep bg-brand-white px-8 py-4 rounded-btn whitespace-nowrap shrink-0 hover:bg-brand-cream hover:-translate-y-px transition-all no-underline"
            >
              Iniciar Acolhimento →
            </Link>
          </div>
        </section>

        {/* ─── Referências ─────────────────────────────────── */}
        <section className="px-6 max-w-[1100px] mx-auto mt-16">
          <h2 className="font-serif text-[20px] text-brand-green-deep dark:text-white mb-4">
            Referências
          </h2>
          <div className="text-[12px] text-brand-muted dark:text-gray-500 leading-[1.8] space-y-1">
            <p>1. Devinsky, O. et al. "Cannabidiol for Drug-Resistant Seizures in Dravet Syndrome." <em>NEJM</em>, 2017.</p>
            <p>2. Whiting, P.F. et al. "Cannabinoids for Medical Use: A Systematic Review." <em>JAMA</em>, 2015.</p>
            <p>3. Zuardi, A.W. et al. "Cannabidiol in Parkinson's disease." <em>J. Psychopharmacology</em>, 2009.</p>
            <p>4. Aran, A. et al. "Cannabidiol in Children with Autism." <em>Neurology</em>, 2018.</p>
            <p>5. FIOCRUZ/EPSJV. "Cannabis medicinal ganha espaço no SUS." 2024.</p>
            <p>6. Anvisa. RDC 660/2022 — Regulamentação de produtos à base de cannabis.</p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="px-6 max-w-[1100px] mx-auto mt-10">
          <p className="text-[11px] text-brand-muted dark:text-gray-500 leading-relaxed border-t border-brand-cream-dark dark:border-gray-700/40 pt-6">
            As informações desta página têm caráter exclusivamente educativo, baseadas em literatura científica publicada. Não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado.
          </p>
        </div>
      </main>
    </div>
  )
}
