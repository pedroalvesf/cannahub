import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

export function TreatmentsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[1100px] mx-auto">
        {/* Hero */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-green-pale text-brand-green-mid text-xs font-semibold px-3.5 py-1.5 rounded-btn mb-5 uppercase tracking-[0.06em]">
            <span className="w-1.5 h-1.5 bg-brand-green-light rounded-full" />
            Base científica
          </div>
          <h1 className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.1] text-brand-green-deep dark:text-white max-w-[700px] mb-4">
            Cannabis medicinal: <em className="text-brand-green-mid">evidências clínicas</em> e aplicações terapêuticas
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.7] max-w-[620px]">
            A utilização terapêutica de derivados da <em>Cannabis sativa</em> é reconhecida pela Anvisa e vem ganhando espaço no SUS. Atualmente, 25 produtos à base de cannabis possuem autorização sanitária no Brasil, e a estimativa é de 6,9 milhões de brasileiros que poderiam se beneficiar do tratamento.
          </p>
        </div>

        {/* Endocannabinoid system */}
        <section className="mb-14">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-4">
            O sistema endocanabinoide
          </h2>
          <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 md:p-8">
            <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.75] mb-4">
              O corpo humano possui um sistema endocanabinoide (SEC) composto por receptores CB1 (predominantes no sistema nervoso central) e CB2 (predominantes no sistema imunológico). Esse sistema regula funções como dor, humor, apetite, sono e resposta inflamatória.
            </p>
            <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.75] mb-6">
              Os fitocanabinoides da cannabis — especialmente o canabidiol (CBD) e o tetrahidrocanabinol (THC) — interagem com esses receptores de forma complementar. O CBD atua como modulador alostérico negativo do CB1 e agonista parcial do CB2, além de interagir com receptores serotoninérgicos (5-HT1A). O THC é agonista parcial de ambos os receptores, produzindo efeitos analgésicos, antieméticos e estimulantes de apetite.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/20 flex items-center justify-center">
                    <span className="text-[13px] font-bold text-brand-green-deep dark:text-brand-green-light">CBD</span>
                  </div>
                  <span className="text-[14px] font-semibold text-brand-green-deep dark:text-white">Canabidiol</span>
                </div>
                <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-relaxed">
                  Não psicoativo. Propriedades anticonvulsivantes, ansiolíticas, anti-inflamatórias e antioxidantes. Não produz dependência física. Principal composto do Epidiolex, aprovado pela Anvisa para epilepsias refratárias.
                </p>
              </div>
              <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <span className="text-[13px] font-bold text-amber-700 dark:text-amber-400">THC</span>
                  </div>
                  <span className="text-[14px] font-semibold text-brand-green-deep dark:text-white">Tetrahidrocanabinol</span>
                </div>
                <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-relaxed">
                  Psicoativo em doses elevadas. Potente analgésico e antiemético. Indicado para dor neuropática, espasticidade muscular, náusea induzida por quimioterapia e estimulação de apetite em pacientes oncológicos e com HIV/AIDS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical applications */}
        <section className="mb-14">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-2">
            Aplicações clínicas com evidência
          </h2>
          <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-6 max-w-[600px]">
            Condições para as quais existem estudos clínicos publicados sobre a eficácia de canabinoides. O nível de evidência varia conforme a condição.
          </p>

          <div className="space-y-3">
            {/* Epilepsia */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Epilepsia refratária</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Evidência muito alta</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    A aplicação clínica com maior respaldo científico. O CBD é aprovado pela Anvisa para síndromes epilépticas refratárias como Dravet e Lennox-Gastaut. Estudos multicêntricos demonstraram redução de até 50% na frequência de crises convulsivas. O Epidiolex (CBD 100mg/ml) foi o primeiro medicamento à base de cannabis registrado no Brasil.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> CBD isolado ou predominante</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dor crônica */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Dor crônica e neuropática</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-brand-green-pale text-brand-green-deep dark:bg-brand-green-deep/20 dark:text-brand-green-light">Evidência alta</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    Canabinoides atuam nos receptores CB1 e CB2 modulando a transmissão nociceptiva. Meta-análises publicadas na <em>JAMA</em> e no <em>British Medical Journal</em> demonstram eficácia significativa em dor neuropática, fibromialgia e artrite. A combinação THC:CBD mostra resultados superiores ao uso isolado de cada composto (efeito entourage).
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> CBD + THC (proporção variável)</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, tópico, cápsula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ansiedade */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Ansiedade e transtorno de estresse pós-traumático</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-brand-green-pale text-brand-green-deep dark:bg-brand-green-deep/20 dark:text-brand-green-light">Evidência alta</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    O CBD interage com receptores serotoninérgicos (5-HT1A), produzindo efeito ansiolítico sem os riscos de dependência associados a benzodiazepínicos. Ensaios clínicos duplo-cegos demonstram eficácia em transtorno de ansiedade generalizada, ansiedade social e TEPT. Doses de 300mg a 600mg de CBD mostraram redução significativa em escores de ansiedade.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> CBD predominante</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, cápsula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TEA */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Transtorno do espectro autista (TEA)</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Evidência moderada</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    Estudos observacionais e ensaios abertos, incluindo pesquisas conduzidas por universidades brasileiras, demonstram melhora em irritabilidade, qualidade do sono e interação social. O CBD modula o sistema GABAérgico e reduz comportamentos restritivos. Proporções CBD:THC de 20:1 são as mais utilizadas em protocolos pediátricos.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> CBD predominante (CBD:THC 20:1)</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oncologia */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Cuidados paliativos e oncologia</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-brand-green-pale text-brand-green-deep dark:bg-brand-green-deep/20 dark:text-brand-green-light">Evidência alta</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    O THC é reconhecido como antiemético potente para náusea e vômito induzidos por quimioterapia e radioterapia. Também atua na estimulação de apetite em pacientes com caquexia, HIV/AIDS e câncer. Em cuidados paliativos, a combinação THC+CBD melhora qualidade de vida, manejo de dor e padrão de sono.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> THC predominante ou THC+CBD</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, cápsula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parkinson */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <path d="M18 4a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z" />
                    <path d="M6 4a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z" />
                    <path d="M12 18v-6" />
                    <path d="M8 18h8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Parkinson e doenças neurodegenerativas</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Evidência moderada</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    O CBD demonstra propriedades neuroprotetoras e antioxidantes que podem retardar a progressão de doenças neurodegenerativas. Em pacientes com Parkinson, estudos indicam melhora em tremores, rigidez muscular, distúrbios do sono REM e qualidade de vida. Pesquisas com Alzheimer investigam o potencial de reduzir neuroinflamação.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> CBD + THC balanceado</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, cápsula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Esclerose múltipla */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Esclerose múltipla e espasticidade</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Evidência moderada</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    O nabiximols (Sativex), spray oromucoso com THC:CBD 1:1, é aprovado em diversos países para espasticidade resistente a tratamentos convencionais em esclerose múltipla. Estudos fase III demonstraram redução significativa em espasmos musculares e dor associada. No Brasil, o acesso é possível via importação autorizada.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> THC:CBD 1:1</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, spray oromucoso</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insônia */}
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white">Distúrbios do sono</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Evidência moderada</span>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-3">
                    THC em doses baixas (2,5-5mg) reduz a latência do sono, enquanto CBD em doses altas (160mg+) pode ter efeito sedativo direto. A combinação com CBN (canabinoide menor) vem sendo estudada como alternativa a hipnóticos convencionais, com menor risco de dependência e tolerância.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Composto:</span> THC baixa dose + CBD, ou CBD+CBN</span>
                    <span className="text-brand-muted dark:text-gray-500"><span className="font-semibold text-brand-green-deep dark:text-gray-300">Via:</span> Óleo sublingual, cápsula</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory context */}
        <section className="mb-14">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-4">
            Marco regulatório no Brasil
          </h2>
          <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 md:p-8">
            <div className="space-y-4 text-[14px] text-brand-muted dark:text-gray-400 leading-[1.75]">
              <p>
                A Anvisa regulamenta o uso de cannabis medicinal no Brasil através da RDC 660/2022, que define critérios para prescrição, importação e comercialização. Atualmente, o acesso pode ocorrer por quatro vias:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-4">
                  <h4 className="text-[13px] font-bold text-brand-green-deep dark:text-white mb-1">Compra em farmácia</h4>
                  <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed">
                    25 produtos autorizados pela Anvisa. Receita tipo B (CBD com THC &le; 0,2%) ou tipo A (THC &gt; 0,2%, restrita a pacientes terminais).
                  </p>
                </div>
                <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-4">
                  <h4 className="text-[13px] font-bold text-brand-green-deep dark:text-white mb-1">Importação autorizada</h4>
                  <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed">
                    Autorização individual da Anvisa para importação de produtos não disponíveis no mercado nacional. Processo com receita médica e laudos.
                  </p>
                </div>
                <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-4">
                  <h4 className="text-[13px] font-bold text-brand-green-deep dark:text-white mb-1">Associações de pacientes</h4>
                  <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed">
                    Associações com autorização judicial para cultivo e produção de derivados. Controle de qualidade conforme padrão Anvisa, com laudos laboratoriais.
                  </p>
                </div>
                <div className="border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-4">
                  <h4 className="text-[13px] font-bold text-brand-green-deep dark:text-white mb-1">Habeas corpus preventivo</h4>
                  <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed">
                    Autorização judicial individual para cultivo doméstico com fins terapêuticos. Requer laudo médico e acompanhamento profissional.
                  </p>
                </div>
              </div>
              <p>
                A legislação avança: o PL 399/2015 visa regulamentar a comercialização de cannabis medicinal, e o PL 89/2023 propõe distribuição gratuita pelo SUS. São Paulo já aprovou a Lei 17.618/2023 para fornecimento gratuito via rede estadual.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5 text-center">
              <span className="block text-[24px] font-bold text-brand-green-deep dark:text-brand-green-light">25</span>
              <span className="text-[11px] text-brand-muted dark:text-gray-500 leading-tight">produtos autorizados pela Anvisa</span>
            </div>
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5 text-center">
              <span className="block text-[24px] font-bold text-brand-green-deep dark:text-brand-green-light">6,9M</span>
              <span className="text-[11px] text-brand-muted dark:text-gray-500 leading-tight">brasileiros que poderiam se beneficiar</span>
            </div>
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5 text-center">
              <span className="block text-[24px] font-bold text-brand-green-deep dark:text-brand-green-light">~50mil</span>
              <span className="text-[11px] text-brand-muted dark:text-gray-500 leading-tight">pacientes ativos no Brasil (2021)</span>
            </div>
            <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5 text-center">
              <span className="block text-[24px] font-bold text-brand-green-deep dark:text-brand-green-light">R$9,5bi</span>
              <span className="text-[11px] text-brand-muted dark:text-gray-500 leading-tight">potencial econômico com regulamentação</span>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="mb-14">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-4">
            Referências
          </h2>
          <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
            <ol className="space-y-3 text-[13px] text-brand-muted dark:text-gray-400 leading-relaxed list-decimal list-inside">
              <li>
                FIOCRUZ/EPSJV. "Novos tempos: cannabis medicinal ganha espaço no SUS." Reportagem, Escola Politécnica de Saúde Joaquim Venâncio. Disponível em: epsjv.fiocruz.br
              </li>
              <li>
                Casali, P. "Função da cannabis medicinal e seus benefícios." paulocasali.com.br, 2024.
              </li>
              <li>
                Devinsky, O. et al. "Trial of Cannabidiol for Drug-Resistant Seizures in the Dravet Syndrome." <em>The New England Journal of Medicine</em>, 376(21), 2011-2020, 2017.
              </li>
              <li>
                Whiting, P.F. et al. "Cannabinoids for Medical Use: A Systematic Review and Meta-analysis." <em>JAMA</em>, 313(24), 2456-2473, 2015.
              </li>
              <li>
                Zuardi, A.W. et al. "Cannabidiol for the treatment of psychosis in Parkinson's disease." <em>Journal of Psychopharmacology</em>, 23(8), 979-983, 2009.
              </li>
              <li>
                Anvisa. Resolução da Diretoria Colegiada — RDC 660/2022. Regulamentação de produtos à base de cannabis.
              </li>
              <li>
                Aran, A. et al. "Cannabidiol Based Medical Cannabis in Children with Autism — a Retrospective Feasibility Study." <em>Neurology</em>, 90(15), 2018.
              </li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-brand-green-deep rounded-card p-8 text-center">
          <h2 className="font-serif text-[22px] text-brand-white mb-2">
            Quer iniciar seu tratamento?
          </h2>
          <p className="text-[14px] text-brand-white/60 mb-6 max-w-[500px] mx-auto">
            A CannHub te orienta desde o primeiro passo. Nosso acolhimento personalizado avalia seu perfil e conecta você às associações credenciadas.
          </p>
          <Link
            to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
            className="inline-flex text-[15px] font-semibold text-brand-green-deep bg-brand-white px-8 py-3.5 rounded-btn hover:bg-brand-cream hover:-translate-y-px transition-all no-underline"
          >
            Iniciar Acolhimento
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-card bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted dark:text-gray-500 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-relaxed">
            <span className="font-semibold text-brand-green-deep dark:text-gray-400">Aviso importante:</span> As informações desta página têm caráter exclusivamente educativo e informativo, baseadas em literatura científica publicada. Não substituem consulta médica. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado (médico ou dentista). Consulte seu médico antes de iniciar qualquer tratamento.
          </p>
        </div>
      </main>
    </div>
  )
}
