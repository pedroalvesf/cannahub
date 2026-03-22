import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

export function LegislationPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[820px] mx-auto">
        {/* Hero — editorial style */}
        <div className="mb-16 mt-8">
          <span className="text-[11px] font-semibold text-brand-green-light uppercase tracking-[0.08em] mb-4 block">
            Legislação
          </span>
          <h1 className="font-serif text-[clamp(30px,4.5vw,48px)] leading-[1.12] text-brand-green-deep dark:text-white mb-5">
            Sim, é legal. <br />
            <em className="text-brand-green-mid">E mais acessível do que você imagina.</em>
          </h1>
          <p className="text-[16px] text-brand-muted dark:text-gray-400 font-light leading-[1.75] max-w-[600px]">
            A maioria dos brasileiros que poderia se beneficiar de cannabis medicinal não sabe
            que existem caminhos regulamentados. Esta página explica — sem juridiquês — o que
            a lei permite, como funciona e por onde começar.
          </p>
        </div>

        {/* O que a lei diz — timeline compacta */}
        <section className="mb-16">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-6">
            O que a lei brasileira diz
          </h2>

          <div className="space-y-0">
            {[
              {
                year: '2015',
                text: 'A Anvisa autoriza a importação de canabidiol por pacientes com prescrição médica (RDC 17). Primeiro marco legal para acesso individual.',
              },
              {
                year: '2019',
                text: 'Produtos de cannabis passam a poder ser fabricados e vendidos em farmácias brasileiras, com registro sanitário (RDC 327).',
              },
              {
                year: '2022',
                text: 'Regras de importação são simplificadas. O prazo de autorização passa de até 1 ano para renovável, e o processo fica menos burocrático (RDC 660).',
              },
              {
                year: '2023+',
                text: 'O STJ firma jurisprudência com habeas corpus preventivos para cultivo medicinal. Associações de pacientes se consolidam como via de acesso.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="flex flex-col items-center">
                  <div className="w-[3px] h-4 bg-brand-cream-dark dark:bg-gray-700 group-first:bg-transparent" />
                  <span className="text-[11px] font-bold text-brand-green-deep dark:text-brand-green-light bg-brand-green-pale dark:bg-brand-green-deep/20 px-2 py-1 rounded shrink-0">
                    {item.year}
                  </span>
                  <div className="w-[3px] flex-1 bg-brand-cream-dark dark:bg-gray-700 group-last:bg-transparent" />
                </div>
                <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7] pb-6 pt-0.5">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-2 bg-brand-green-deep/[0.04] dark:bg-brand-green-deep/10 border border-brand-green-deep/10 dark:border-brand-green-deep/20 rounded-lg px-5 py-4">
            <p className="text-[14px] text-brand-text dark:text-gray-300 leading-[1.7]">
              <strong className="font-semibold">Hoje:</strong> mais de 25 produtos com autorização sanitária,
              centenas de associações ativas, e uma estimativa de <strong className="font-semibold">6,9 milhões de brasileiros</strong> que
              poderiam se beneficiar do tratamento.
            </p>
          </div>
        </section>

        {/* Quem pode usar */}
        <section className="mb-16">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-2">
            Quem pode acessar?
          </h2>
          <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-6">
            Qualquer pessoa com prescrição médica. Não importa a condição, idade ou especialidade do médico.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Pacientes adultos', detail: 'Com receita médica e identidade' },
              { label: 'Responsáveis legais', detail: 'Em nome de menores ou dependentes' },
              { label: 'Uso veterinário', detail: 'Prescrito por veterinários' },
            ].map((item, i) => (
              <div key={i} className="border border-brand-cream-dark dark:border-gray-700/40 rounded-lg px-4 py-4">
                <p className="text-[14px] font-semibold text-brand-green-deep dark:text-white mb-0.5">{item.label}</p>
                <p className="text-[12px] text-brand-muted dark:text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 caminhos */}
        <section className="mb-16">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-2">
            Quatro caminhos legais
          </h2>
          <p className="text-[14px] text-brand-muted dark:text-gray-400 leading-[1.7] mb-6">
            Dependendo da sua situação, um funciona melhor que outro. A CannHub te ajuda a encontrar o mais adequado.
          </p>

          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'Associações de pacientes',
                tag: 'Mais acessível',
                body: 'Organizações sem fins lucrativos que produzem e distribuem produtos para associados. Custo menor, acompanhamento contínuo e comunidade de apoio. A CannHub conecta você às credenciadas.',
              },
              {
                num: '2',
                title: 'Importação via Anvisa',
                tag: null,
                body: 'Importação individual de produtos registrados. Processo de 10 a 30 dias com autorização da Anvisa. Ampla variedade de produtos certificados internacionalmente.',
              },
              {
                num: '3',
                title: 'Farmácias autorizadas',
                tag: null,
                body: 'Produtos nacionais regulamentados pela RDC 327, disponíveis em farmácias com autorização sanitária. Acesso imediato, sem processo de importação.',
              },
              {
                num: '4',
                title: 'Habeas corpus para cultivo',
                tag: 'Via judicial',
                body: 'Para quem precisa de cepas específicas ou não consegue arcar com importação. Autorização judicial para autocultivo terapêutico — jurisprudência crescente a favor.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-lg p-5">
                <span className="text-[22px] font-serif text-brand-green-pale dark:text-gray-700 leading-none mt-0.5 shrink-0">
                  {item.num}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[15px] font-semibold text-brand-green-deep dark:text-white">{item.title}</h3>
                    {item.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green-light bg-brand-green-pale dark:bg-gray-700 px-2 py-0.5 rounded-btn">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mitos */}
        <section className="mb-16">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-6">
            O que muita gente pensa (e não é verdade)
          </h2>

          <div className="space-y-5">
            {[
              {
                myth: '"Usar cannabis medicinal é crime."',
                fact: 'Não. Com prescrição médica, o paciente tem amparo legal completo — importação, compra em farmácia ou associação são processos regulamentados pela Anvisa.',
              },
              {
                myth: '"É a mesma coisa que maconha recreativa."',
                fact: 'Produtos medicinais têm dosagens padronizadas de CBD e THC, controle de qualidade e são formulações farmacêuticas (óleos, cápsulas, sprays).',
              },
              {
                myth: '"Cannabis causa dependência."',
                fact: 'O CBD — principal componente terapêutico — não causa dependência. A OMS reconhece seu perfil de segurança. Produtos com THC são prescritos em doses controladas.',
              },
              {
                myth: '"Preciso de advogado para conseguir."',
                fact: 'Na maioria dos casos, não. Importação e compra em associações são processos administrativos. Só o habeas corpus para cultivo exige assessoria jurídica.',
              },
              {
                myth: '"Meu médico não pode prescrever."',
                fact: 'Qualquer médico pode prescrever cannabis medicinal. Se o seu se recusar, você tem direito de buscar outro profissional. É um ato médico legítimo.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-brand-cream-dark dark:border-gray-700/50 pb-5 last:border-0 last:pb-0">
                <p className="text-[14px] font-medium text-brand-text dark:text-gray-200 mb-1.5">
                  {item.myth}
                </p>
                <p className="text-[13px] text-brand-muted dark:text-gray-400 leading-[1.7]">
                  {item.fact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Referências */}
        <section className="mb-16">
          <h2 className="font-serif text-[22px] text-brand-green-deep dark:text-white mb-4">
            Referências
          </h2>
          <div className="text-[12px] text-brand-muted dark:text-gray-500 leading-[1.8] space-y-1">
            <p>RDC 660/2022 — Anvisa, importação de produtos derivados de Cannabis por pessoa física</p>
            <p>RDC 327/2019 — Anvisa, produtos de Cannabis para fins medicinais</p>
            <p>RDC 17/2015 — Anvisa, critérios e procedimentos para importação de canabidiol</p>
            <p>Lei 11.343/2006 — Lei de Drogas, distinção entre uso pessoal e tráfico (art. 28)</p>
            <p>RE 1.348.458 — STJ, direito ao cultivo para fins medicinais</p>
            <p>Nota Técnica Fiocruz — Cannabis medicinal: evidências e perspectivas para o SUS</p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-brand-green-deep rounded-banner px-8 md:px-[52px] py-[44px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-[100px] -top-[100px] w-[320px] h-[320px] rounded-full bg-white/[0.03] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-serif text-[24px] text-brand-white leading-[1.3] mb-2">
              Quer começar seu tratamento?
            </h3>
            <p className="text-[13px] text-brand-white/55 font-light leading-[1.7] max-w-[420px]">
              A CannHub guia você do acolhimento à conexão com a associação certa. Tudo regulamentado.
            </p>
          </div>
          <Link
            to={isAuthenticated ? '/acolhimento' : '/cadastro?redirect=/acolhimento'}
            className="relative z-10 text-sm font-semibold text-brand-green-deep bg-brand-white px-[28px] py-[14px] rounded-btn whitespace-nowrap shrink-0 hover:bg-brand-cream hover:-translate-y-px transition-all no-underline"
          >
            Iniciar Acolhimento →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-11 max-w-[820px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-t border-brand-cream-dark dark:border-gray-800 mt-8">
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
