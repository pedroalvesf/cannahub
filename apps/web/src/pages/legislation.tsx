import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

const timelineData = [
  {
    year: '2015',
    tag: 'Marco inicial',
    title: 'Primeiro acesso legal à cannabis medicinal',
    body: 'A Anvisa autoriza a importação de canabidiol por pacientes com prescrição médica (RDC 17). É o primeiro reconhecimento legal do uso terapêutico no Brasil.',
    highlight: false,
  },
  {
    year: '2019',
    tag: 'Expansão',
    title: 'Produtos passam a ser fabricados e vendidos no Brasil',
    body: 'Com a RDC 327, produtos de cannabis passam a poder ser fabricados e comercializados em farmácias brasileiras com registro sanitário. Fim da dependência exclusiva de importação.',
    highlight: false,
  },
  {
    year: '2022',
    tag: 'Simplificação',
    title: 'Importação ficou mais fácil e rápida',
    body: 'A RDC 660 simplifica as regras de importação. O prazo de autorização passa de até 1 ano para renovável, e o processo fica menos burocrático — abrindo o acesso a mais pacientes.',
    highlight: false,
  },
  {
    year: '2023',
    tag: 'Consolidação',
    title: 'STJ firma jurisprudência favorável ao cultivo medicinal',
    body: 'O STJ firma jurisprudência com habeas corpus preventivos para cultivo medicinal. Associações de pacientes se consolidam como via de acesso legal e acessível para todo o Brasil.',
    highlight: true,
  },
]

const quemData = [
  {
    title: 'Pacientes adultos',
    body: 'Com receita médica e identidade. Sem restrição de condição ou especialidade médica.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-brand-green-deep dark:stroke-brand-green-light" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Responsáveis legais',
    body: 'Em nome de menores ou dependentes. Com documentação do paciente e prescrição nominada.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-brand-green-deep dark:stroke-brand-green-light" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Uso veterinário',
    body: 'Para animais domésticos, prescrito por médico veterinário habilitado.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-brand-green-deep dark:stroke-brand-green-light" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
]

const caminhosData = [
  {
    num: '1',
    tag: 'Mais acessível',
    tagStyle: 'text-brand-green-light bg-brand-green-pale dark:bg-brand-green-deep/30',
    title: 'Associações de pacientes',
    body: 'Organizações sem fins lucrativos que produzem e distribuem produtos para seus associados. Custo menor, acompanhamento contínuo e comunidade de suporte. A CannHub conecta você às credenciadas.',
    destaque: true,
  },
  {
    num: '2',
    tag: 'Mais variedade',
    tagStyle: 'text-brand-green-light bg-brand-green-pale dark:bg-brand-green-deep/30',
    title: 'Importação via Anvisa',
    body: 'Importação individual de produtos registrados. Processo de 10 a 30 dias com autorização da Anvisa. Ampla variedade de produtos certificados internacionalmente.',
    destaque: false,
  },
  {
    num: '3',
    tag: 'Mais imediato',
    tagStyle: 'text-brand-green-light bg-brand-green-pale dark:bg-brand-green-deep/30',
    title: 'Farmácias autorizadas',
    body: 'Produtos nacionais regulamentados pela RDC 327, disponíveis em farmácias com autorização sanitária. Acesso direto, sem processo de importação.',
    destaque: false,
  },
  {
    num: '4',
    tag: 'Via judicial',
    tagStyle: 'text-[#7A3020] bg-[#F5EDE8] dark:text-orange-300 dark:bg-orange-900/20',
    title: 'Habeas corpus para cultivo',
    body: 'Para quem precisa de cepas específicas ou não consegue arcar com importação. Autorização judicial para autocultivo terapêutico — jurisprudência do STJ crescente e favorável.',
    destaque: false,
  },
]

const mitosData = [
  {
    myth: 'Usar cannabis medicinal é crime.',
    fact: 'Não. Com prescrição médica, o paciente tem amparo legal completo. Importação e compra em farmácia ou associação são processos regulamentados pela Anvisa — sem enquadramento penal.',
  },
  {
    myth: 'É a mesma coisa que maconha recreativa.',
    fact: 'Não. Produtos medicinais têm dosagens padronizadas de CBD e THC, controle de qualidade e são formulações farmacêuticas — óleos, cápsulas, sprays — com laudo analítico em cada lote.',
  },
  {
    myth: 'Cannabis causa dependência.',
    fact: 'O CBD — principal componente terapêutico — não causa dependência. A OMS reconhece seu perfil de segurança. Produtos com THC são prescritos em doses controladas e acompanhados por médico.',
  },
  {
    myth: 'Preciso de advogado para conseguir.',
    fact: 'Na maioria dos casos, não. Importação e compra em associações são processos administrativos. Só o habeas corpus para cultivo exige assessoria jurídica — e a CannHub orienta nesse caminho.',
  },
  {
    myth: 'Meu médico não pode prescrever.',
    fact: 'Qualquer médico pode prescrever cannabis medicinal no Brasil. Se o seu se recusou, você tem o direito de buscar outro profissional. É um ato médico legítimo e amplamente praticado.',
  },
]

const refsData = [
  { strong: 'RDC 660/2022', text: 'Anvisa, importação de produtos derivados de Cannabis por pessoa física' },
  { strong: 'RDC 327/2019', text: 'Anvisa, produtos de Cannabis para fins medicinais' },
  { strong: 'RDC 17/2015', text: 'Anvisa, critérios e procedimentos para importação de canabidiol' },
  { strong: 'Lei 11.343/2006', text: 'Distinção entre uso pessoal e tráfico (art. 28)' },
  { strong: 'RE 1.348.458 — STJ', text: 'Direito ao cultivo para fins medicinais' },
]

export function LegislationPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const ctaLink = isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'

  const [openMito, setOpenMito] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      {/* ══════ HERO ══════ */}
      <section className="bg-brand-off dark:bg-surface-dark border-b border-brand-cream-dark dark:border-white/10 pt-[60px] relative overflow-hidden">
        {/* Decorative "É legal." */}
        <span
          className="absolute right-[-20px] bottom-[-20px] font-serif italic text-[clamp(120px,18vw,220px)] text-brand-green-deep dark:text-white leading-none pointer-events-none select-none whitespace-nowrap tracking-[-0.04em] opacity-[0.04]"
          aria-hidden="true"
        >
          É legal.
        </span>

        <div className="max-w-[1100px] mx-auto relative z-10 px-6 md:px-20 py-16 md:py-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-9">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
            <span className="text-[11.5px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs">
              Legislação
            </span>
          </div>

          <h1 className="font-serif text-[clamp(44px,6vw,80px)] text-brand-text dark:text-white leading-[1.02] tracking-[-0.03em] mb-7 max-w-[820px]">
            Sim, é legal.
            <br />
            <em className="italic text-brand-green-light">E mais acessível</em>
            <br />
            do que você imagina.
          </h1>

          <p className="text-lg text-brand-muted dark:text-gray-400 max-w-[560px] leading-[1.7] font-light mb-12">
            A maioria dos brasileiros que poderia se beneficiar da cannabis medicinal não sabe que existem caminhos regulamentados.
            <br /><br />
            <strong className="text-brand-text-md dark:text-gray-300 font-medium">
              Esta página explica — sem juridiquês — o que a lei permite, como funciona e por onde começar.
            </strong>
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              to={ctaLink}
              className="px-[26px] py-[13px] bg-brand-green-deep dark:bg-brand-green-light text-white dark:text-brand-green-deep rounded-lg text-[15px] font-medium hover:bg-brand-green-mid dark:hover:bg-brand-green-xs transition-colors no-underline"
            >
              Quero começar agora
            </Link>
            <a
              href="#caminhos"
              className="px-[22px] py-[12px] bg-transparent border border-brand-cream-dark dark:border-white/20 text-brand-text-md dark:text-gray-300 rounded-lg text-[15px] hover:border-brand-green-light hover:text-brand-green-deep dark:hover:border-brand-green-light dark:hover:text-brand-green-light transition-colors no-underline"
            >
              Entender os caminhos legais →
            </a>
          </div>
        </div>
      </section>

      {/* ══════ KEY STRIP ══════ */}
      <div className="bg-brand-cream dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-white/10 px-6 md:px-20 py-7">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-12 items-center">
          <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs leading-[1.5]">
            Em uma frase
          </div>
          <div className="text-[16px] text-brand-text-md dark:text-gray-300 leading-[1.65]">
            Com prescrição médica, qualquer brasileiro tem{' '}
            <strong className="text-brand-text dark:text-white font-medium">amparo legal completo</strong>{' '}
            para acessar, comprar, importar e usar cannabis medicinal — desde 2015, pela Anvisa.
          </div>
        </div>
      </div>

      {/* ══════ MAIN BODY ══════ */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-20 py-12 md:py-[72px] grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">

        {/* ─── LEFT COLUMN ─── */}
        <div className="flex flex-col gap-16">

          {/* TIMELINE */}
          <section id="timeline">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs mb-2.5 block">
              O histórico
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              O que a lei brasileira diz — em ordem.
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7] font-light max-w-[560px]">
              Uma linha do tempo clara, sem termos técnicos desnecessários.
            </p>

            <div className="relative mt-9">
              {/* Vertical line */}
              <div className="absolute left-[80px] top-4 bottom-4 w-px bg-brand-cream-dark dark:bg-white/10 hidden md:block" />

              <div className="flex flex-col">
                {timelineData.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-0 pb-10 last:pb-0 relative"
                  >
                    {/* Year */}
                    <div className="flex md:justify-end md:pr-7 relative mb-2 md:mb-0">
                      <span
                        className={`font-serif text-[42px] leading-none tracking-[-0.02em] ${
                          item.highlight
                            ? 'text-brand-green-deep dark:text-brand-green-light'
                            : 'text-brand-cream-darker dark:text-gray-600'
                        }`}
                      >
                        {item.year}
                      </span>
                      {/* Dot on line */}
                      <span
                        className={`hidden md:block absolute right-[-5px] top-[14px] w-[9px] h-[9px] rounded-full z-10 ${
                          item.highlight
                            ? 'bg-brand-green-deep dark:bg-brand-green-light border-2 border-brand-green-deep dark:border-brand-green-light'
                            : 'bg-brand-off dark:bg-surface-dark border-2 border-brand-cream-darker dark:border-gray-600'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="md:pl-7 pt-0 md:pt-1.5">
                      <span className="inline-block text-[10px] font-medium uppercase tracking-[0.03em] text-brand-green-light bg-brand-green-pale dark:bg-brand-green-deep/30 dark:text-brand-green-xs rounded-full px-[9px] py-[2px] mb-2">
                        {item.tag}
                      </span>
                      <div className="text-[15px] font-medium text-brand-text dark:text-white mb-1.5 leading-[1.3]">
                        {item.title}
                      </div>
                      <div className="text-[13.5px] text-brand-muted dark:text-gray-400 leading-[1.65]">
                        {item.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Callout box — fora do container da timeline para não ser cortado pela linha */}
            <div className="bg-brand-green-deep dark:bg-brand-green-mid rounded-[14px] p-[22px_24px] mt-7 flex gap-3.5 items-start">
                <div className="w-8 h-8 bg-white/[0.08] rounded-lg flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brand-green-xs" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              <p className="text-sm text-white/[0.78] leading-[1.65]">
                <strong className="text-white font-medium">Hoje:</strong> mais de 25 produtos com autorização sanitária, centenas de associações ativas e uma estimativa de{' '}
                <strong className="text-white font-medium">6,9 milhões de brasileiros</strong> que poderiam se beneficiar do tratamento.
              </p>
            </div>
          </section>

          {/* QUEM PODE ACESSAR */}
          <section id="quem">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs mb-2.5 block">
              Elegibilidade
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              Quem pode acessar?
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7] font-light max-w-[560px]">
              Qualquer pessoa com prescrição médica. Não importa a condição, a idade ou a especialidade do médico.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
              {quemData.map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-[14px] p-5"
                >
                  <div className="w-9 h-9 bg-brand-green-pale dark:bg-brand-green-deep/30 rounded-[10px] flex items-center justify-center mb-3.5">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-brand-text dark:text-white mb-1.5">
                    {item.title}
                  </div>
                  <div className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.55]">
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4 CAMINHOS LEGAIS */}
          <section id="caminhos">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs mb-2.5 block">
              Opções
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              Quatro caminhos legais.
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7] font-light max-w-[560px]">
              Dependendo da sua situação, um funciona melhor que outro. A CannHub te ajuda a encontrar o mais adequado.
            </p>

            <div className="flex flex-col gap-2.5 mt-7">
              {caminhosData.map((item, i) => (
                <div
                  key={i}
                  className={`bg-white dark:bg-surface-dark-card border rounded-[14px] p-5 grid grid-cols-[32px_1fr_auto] gap-4 items-start transition-colors hover:border-brand-green-light ${
                    item.destaque
                      ? 'border-brand-green-light border-[1.5px]'
                      : 'border-brand-cream-dark dark:border-white/10'
                  }`}
                >
                  <span
                    className={`font-serif text-[22px] leading-none pt-0.5 ${
                      item.destaque
                        ? 'text-brand-green-light'
                        : 'text-brand-cream-darker dark:text-gray-600'
                    }`}
                  >
                    {item.num}
                  </span>
                  <div>
                    <span className={`inline-block text-[10px] font-medium uppercase tracking-[0.03em] rounded-full px-[9px] py-[2px] mb-1.5 ${item.tagStyle}`}>
                      {item.tag}
                    </span>
                    <div className="text-[15px] font-medium text-brand-text dark:text-white mb-1.5">
                      {item.title}
                    </div>
                    <div className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.6]">
                      {item.body}
                    </div>
                  </div>
                  <span className="text-brand-text-xs dark:text-gray-600 text-base pt-1">→</span>
                </div>
              ))}
            </div>
          </section>

          {/* MITOS */}
          <section id="mitos">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs mb-2.5 block">
              Mitos comuns
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              O que muita gente pensa — e não é verdade.
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7] font-light max-w-[560px]">
              Dúvidas reais que chegam todo dia. Respondidas sem rodeios.
            </p>

            <div className="flex flex-col mt-7">
              {mitosData.map((item, i) => (
                <div
                  key={i}
                  className="py-[22px] first:pt-0 last:border-b-0 border-b border-brand-cream-dark dark:border-white/10 cursor-pointer"
                  onClick={() => setOpenMito(openMito === i ? null : i)}
                >
                  <div className="flex gap-2.5 items-start">
                    <span className="font-serif text-[28px] text-brand-cream-darker dark:text-gray-600 leading-[0.85] shrink-0 select-none">
                      &ldquo;
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-medium text-brand-text dark:text-white">
                          {item.myth}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          className={`w-4 h-4 stroke-brand-text-xs dark:stroke-gray-500 shrink-0 ml-3 transition-transform duration-200 ${
                            openMito === i ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          openMito === i ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-sm text-brand-muted dark:text-gray-400 leading-[1.7]">
                          {item.fact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REFERÊNCIAS */}
          <section id="referencias">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-text-xs dark:text-brand-text-xs mb-2.5 block">
              Base legal
            </span>
            <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] text-brand-text dark:text-white leading-[1.1] tracking-[-0.02em] mb-3">
              Referências.
            </h2>
            <p className="text-[15px] text-brand-muted dark:text-gray-400 leading-[1.7] font-light max-w-[560px]">
              Tudo que está nesta página é baseado em legislação vigente e documentos públicos da Anvisa e do STJ.
            </p>

            <div className="flex flex-col gap-2 mt-7">
              {refsData.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 items-start px-3.5 py-2.5 rounded-[10px] bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-brand-text-xs dark:stroke-gray-500 shrink-0 mt-0.5" fill="none" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.5]">
                    <strong className="text-brand-text-md dark:text-gray-300 font-medium">{item.strong}</strong> — {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ─── SIDEBAR ─── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[80px]">
          {/* Year card */}
          <div className="bg-brand-green-deep dark:bg-brand-green-mid rounded-2xl p-[22px] text-center">
            <div className="font-serif text-[52px] text-brand-green-xs leading-none opacity-80 mb-1.5">
              2015
            </div>
            <div className="text-xs text-white/50 leading-[1.5]">
              <strong className="text-white/80 font-medium block text-[13px] mb-0.5">Legal no Brasil desde</strong>
              Regulamentado pela Anvisa. Com prescrição, você tem amparo completo.
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-2xl p-[22px]">
            <div className="text-sm font-medium text-brand-text dark:text-white mb-1">
              Quer regularizar?
            </div>
            <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.55] mb-[18px]">
              A CannHub orienta você em cada etapa — do acolhimento à associação credenciada certa.
            </p>
            <Link
              to={ctaLink}
              className="block w-full py-[11px] bg-brand-green-deep dark:bg-brand-green-light text-white dark:text-brand-green-deep rounded-lg text-sm font-medium text-center mb-2 hover:bg-brand-green-mid dark:hover:bg-brand-green-xs transition-colors no-underline"
            >
              Iniciar acolhimento
            </Link>
            <Link
              to="/tratamentos"
              className="block w-full py-2.5 bg-transparent border border-brand-cream-dark dark:border-white/20 text-brand-text-md dark:text-gray-300 rounded-lg text-[13.5px] text-center hover:border-brand-green-light hover:text-brand-green-deep dark:hover:border-brand-green-light dark:hover:text-brand-green-light transition-colors no-underline"
            >
              Entender o processo
            </Link>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-white/10 rounded-2xl p-3">
            <div className="flex flex-col gap-0.5">
              <Link
                to="/associacoes"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] text-brand-text-md dark:text-gray-300 hover:bg-brand-cream dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-white transition-colors no-underline"
              >
                Associações credenciadas
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-brand-text-xs dark:stroke-gray-500" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <Link
                to="/tratamentos"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] text-brand-text-md dark:text-gray-300 hover:bg-brand-cream dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-white transition-colors no-underline"
              >
                Tratamentos por condição
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-brand-text-xs dark:stroke-gray-500" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <Link
                to={ctaLink}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] text-brand-text-md dark:text-gray-300 hover:bg-brand-cream dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-white transition-colors no-underline"
              >
                Como funciona o acolhimento
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-brand-text-xs dark:stroke-gray-500" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="bg-brand-cream dark:bg-surface-dark-card rounded-[14px] p-4 flex gap-2.5 items-start">
            <div className="w-7 h-7 bg-brand-cream-dark dark:bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] stroke-brand-muted dark:stroke-gray-400" fill="none" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-xs text-brand-muted dark:text-gray-400 leading-[1.55]">
              Conteúdo revisado com base em legislação vigente. Não constitui aconselhamento jurídico. Consulte um profissional para casos específicos.
            </p>
          </div>
        </aside>
      </div>

      {/* ══════ CTA FINAL ══════ */}
      <div className="mx-6 md:mx-20 mb-12 md:mb-20 bg-brand-green-deep dark:bg-brand-green-mid rounded-[20px] p-10 md:p-16 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-7 md:gap-20 items-center relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-20 right-20 w-80 h-80 rounded-full bg-white/[0.025] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-[11px] text-white/[0.38] uppercase tracking-[0.1em] font-medium mb-3">
            Pronto para começar?
          </div>
          <h2 className="font-serif text-[clamp(26px,3.5vw,38px)] text-white leading-[1.1] tracking-[-0.02em] mb-2.5">
            O caminho legal existe.
            <br />
            <em className="italic text-brand-green-xs">Vamos percorrê-lo juntos.</em>
          </h2>
          <p className="text-[15px] text-white/50 leading-[1.65] font-light">
            Leva menos de 5 minutos para iniciar o acolhimento. Sigiloso, sem julgamento e 100% gratuito para começar.
          </p>

          <div className="flex gap-4 mt-4 flex-wrap">
            {['Sigiloso', 'Sem julgamento', 'Gratuito para começar'].map((label) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-white/[0.32]">
                <div className="w-3.5 h-3.5 bg-white/[0.07] rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 10 10" className="w-2 h-2 stroke-white/[0.45]" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 5 4 8 8 2" />
                  </svg>
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2.5 md:items-end min-w-[200px]">
          <Link
            to={ctaLink}
            className="w-full py-[13px] px-7 bg-white text-brand-green-deep rounded-lg text-[14.5px] font-medium text-center hover:opacity-90 transition-opacity no-underline whitespace-nowrap"
          >
            Iniciar acolhimento
          </Link>
          <Link
            to="/tratamentos"
            className="w-full py-[11px] px-7 bg-transparent border border-white/[0.18] text-white/60 rounded-lg text-[13.5px] text-center hover:border-white/40 hover:text-white/[0.85] transition-colors no-underline whitespace-nowrap"
          >
            Entender o processo primeiro
          </Link>
        </div>
      </div>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-brand-cream dark:bg-surface-dark border-t border-brand-cream-dark dark:border-white/10 px-6 md:px-20 py-9">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 md:gap-10 items-center">
          <span className="font-serif text-[19px] text-brand-green-deep dark:text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 3C16 3 5 9 5 19C5 24.52 10.48 29 16 29C21.52 29 27 24.52 27 19C27 9 16 3 16 3Z" className="fill-brand-green-deep dark:fill-white" opacity=".8" />
            </svg>
            CannHub
          </span>
          <div className="flex gap-6 flex-wrap md:justify-center">
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-500 hover:text-brand-text dark:hover:text-white transition-colors no-underline">Termos de uso</a>
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-500 hover:text-brand-text dark:hover:text-white transition-colors no-underline">Privacidade</a>
            <a href="#" className="text-[13px] text-brand-muted dark:text-gray-500 hover:text-brand-text dark:hover:text-white transition-colors no-underline">Contato</a>
            <Link to="/legislacao" className="text-[13px] text-brand-muted dark:text-gray-500 hover:text-brand-text dark:hover:text-white transition-colors no-underline">Legislação</Link>
          </div>
          <span className="text-[12.5px] text-brand-text-xs dark:text-gray-600">© 2025 CannHub</span>
        </div>
        <div className="max-w-[1100px] mx-auto mt-4 pt-4 border-t border-brand-cream-dark dark:border-white/10 text-xs text-brand-text-xs dark:text-gray-500 leading-[1.6]">
          Este site tem caráter exclusivamente informativo e educacional. As informações aqui contidas não constituem aconselhamento jurídico ou médico. O uso de cannabis medicinal no Brasil requer prescrição de profissional habilitado.
        </div>
      </footer>
    </div>
  )
}
