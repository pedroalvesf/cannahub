import { treatments, type Treatment } from './treatments'

export interface TreatmentCategory {
  slug: string
  name: string
  eyebrow: string
  headline: string
  headlineEmphasis: string
  intro: string[]
  howCannabisHelps: {
    title: string
    text: string
    keyPoints: { label: string; description: string }[]
  }
  endocannabinoidContext: string
  /** slugs dos tratamentos específicos desta categoria */
  treatmentSlugs: string[]
  /** cor de fundo tint */
  tintBg: string
  tintBgDark: string
  /** número decorativo no hero */
  decorativeText: string
  /** imagem do hero da página de categoria */
  heroImage?: string
}

export const treatmentCategories: TreatmentCategory[] = [
  {
    slug: 'neurologicas',
    name: 'Condições neurológicas',
    eyebrow: 'Neurologia',
    headline: 'Cannabis e o',
    headlineEmphasis: 'sistema nervoso.',
    intro: [
      'O sistema nervoso é um dos principais alvos terapêuticos dos canabinoides. Receptores CB1, presentes em alta densidade no cérebro e medula espinhal, regulam a neurotransmissão, excitabilidade neuronal e neuroproteção.',
      'Condições como epilepsia refratária, Parkinson e esclerose múltipla compartilham mecanismos de neuroinflamação e disfunção sináptica — áreas onde CBD e THC demonstram eficácia documentada em estudos clínicos.',
    ],
    howCannabisHelps: {
      title: 'Como os canabinoides atuam no sistema nervoso',
      text: 'O CBD atua como modulador de múltiplos alvos: receptores de adenosina (neuroproteção), canais de cálcio (estabilização neuronal), receptores TRPV1 (modulação da dor) e receptores 5-HT1A (ansiolítico). O THC ativa diretamente receptores CB1, modulando a liberação de neurotransmissores como glutamato e GABA — o equilíbrio entre excitação e inibição neural.',
      keyPoints: [
        { label: 'Neuroproteção', description: 'CBD reduz estresse oxidativo e neuroinflamação, protegendo neurônios dopaminérgicos e colinérgicos da degeneração progressiva.' },
        { label: 'Anticonvulsivante', description: 'CBD estabiliza canais de cálcio e sódio, reduzindo a hiperexcitabilidade neuronal que causa crises epilépticas.' },
        { label: 'Antiespasmódico', description: 'THC:CBD 1:1 relaxa a musculatura via receptores CB1 na medula espinhal, reduzindo espasticidade em esclerose múltipla.' },
      ],
    },
    endocannabinoidContext: 'O sistema endocanabinoide cerebral é um dos mais complexos do corpo humano. Receptores CB1 são os mais abundantes do SNC — mais numerosos que receptores de dopamina, serotonina e opioides combinados. Quando esse sistema falha, condições neurológicas surgem. Canabinoides restauram o equilíbrio.',
    treatmentSlugs: ['epilepsia', 'parkinson', 'esclerose-multipla'],
    tintBg: 'bg-[#EBF2E1]',
    tintBgDark: 'dark:bg-[#1a2e1a]',
    decorativeText: 'Neuro',
    heroImage: '/treatments/categoria-neurologicas.webp',
  },
  {
    slug: 'saude-mental',
    name: 'Saúde mental',
    eyebrow: 'Saúde mental',
    headline: 'Cannabis e o',
    headlineEmphasis: 'equilíbrio emocional.',
    intro: [
      'O Brasil é o país com maior prevalência de ansiedade no mundo segundo a OMS — 18,6 milhões de brasileiros. Transtornos de humor, insônia e condições do neurodesenvolvimento como o autismo impactam diretamente a qualidade de vida de milhões de famílias.',
      'O CBD interage com receptores serotoninérgicos (5-HT1A), o mesmo alvo dos antidepressivos ISRS, oferecendo efeito ansiolítico sem os riscos de dependência dos benzodiazepínicos. Para distúrbios do sono, a combinação THC + CBD modula o ciclo sono-vigília de forma mais fisiológica que hipnóticos convencionais.',
    ],
    howCannabisHelps: {
      title: 'Como os canabinoides atuam na saúde mental',
      text: 'O CBD modula o sistema serotoninérgico e endocanabinoide simultaneamente, normalizando a resposta ao estresse sem causar dependência física. Para o sono, THC em doses baixas reduz a latência (tempo para adormecer) enquanto CBD em doses altas tem efeito sedativo direto. No autismo, a modulação do sistema GABAérgico reduz a hiperexcitabilidade neuronal.',
      keyPoints: [
        { label: 'Ansiolítico', description: 'CBD 300-600mg demonstrou efeito ansiolítico comparável a benzodiazepínicos em estudos duplo-cegos, sem risco de tolerância ou dependência.' },
        { label: 'Regulador do sono', description: 'THC 2,5mg + CBD 25mg noturno regulariza o ciclo circadiano sem efeito rebote na descontinuação.' },
        { label: 'Modulador comportamental', description: 'CBD:THC 20:1 melhora irritabilidade, interação social e qualidade do sono em crianças e adultos com TEA.' },
      ],
    },
    endocannabinoidContext: 'O sistema endocanabinoide é o principal regulador da resposta ao estresse. A anandamida (endocanabinoide natural) é chamada de "molécula da felicidade" — seu déficit está associado a ansiedade, depressão e insônia. O CBD inibe a enzima FAAH que degrada a anandamida, elevando seus níveis naturalmente.',
    treatmentSlugs: ['ansiedade', 'insonia', 'autismo'],
    tintBg: 'bg-[#E8EEF7]',
    tintBgDark: 'dark:bg-[#1a1e2e]',
    decorativeText: 'Mental',
    heroImage: '/treatments/categoria-saude-mental.webp',
  },
  {
    slug: 'dor-inflamacao',
    name: 'Dor e inflamação',
    eyebrow: 'Dor e inflamação',
    headline: 'Cannabis e o',
    headlineEmphasis: 'controle da dor.',
    intro: [
      'A dor crônica afeta 37% da população brasileira e é a principal causa de afastamento do trabalho. Opioides são eficazes mas causam dependência, tolerância e efeitos colaterais graves. Anti-inflamatórios não esteroidais (AINEs) apresentam riscos gastrointestinais e cardiovasculares no uso prolongado.',
      'Canabinoides oferecem uma alternativa que atua em mecanismos complementares — modulando a dor via receptores CB1 no sistema nervoso central e reduzindo a inflamação via CB2 no sistema imunológico. O chamado "efeito entourage" (CBD + THC juntos) mostra resultados superiores a cada composto isolado.',
    ],
    howCannabisHelps: {
      title: 'Como os canabinoides controlam a dor',
      text: 'O THC ativa receptores CB1 nas vias descendentes de dor, alterando a percepção do estímulo doloroso. O CBD atua como anti-inflamatório potente via CB2, além de inibir a recaptação de anandamida. Em uso tópico, CBD penetra diretamente nos tecidos afetados. A combinação promove analgesia com menos efeitos colaterais que opioides e sem risco de dependência física.',
      keyPoints: [
        { label: 'Analgésico multimodal', description: 'CBD+THC atuam em vias complementares aos opioides, permitindo reduzir doses de morfina em 30-50% (efeito poupador de opioide).' },
        { label: 'Anti-inflamatório', description: 'CBD reduz citocinas inflamatórias (TNF-α, IL-6) sem os riscos gastrointestinais dos AINEs.' },
        { label: 'Tópico localizado', description: 'CBD em creme/gel penetra a articulação ou tecido afetado, com efeito anti-inflamatório local sem absorção sistêmica relevante.' },
      ],
    },
    endocannabinoidContext: 'O sistema endocanabinoide é um dos principais reguladores da dor. Receptores CB1 na medula espinhal e cérebro modulam a transmissão nociceptiva, enquanto CB2 no sistema imunológico controla a resposta inflamatória. Quando a dor se torna crônica, o sistema endocanabinoide fica desregulado — canabinoides restauram esse equilíbrio.',
    treatmentSlugs: ['dor-cronica', 'artrite', 'endometriose'],
    tintBg: 'bg-[#F5EDEA]',
    tintBgDark: 'dark:bg-[#2e1a1a]',
    decorativeText: 'Dor',
    heroImage: '/treatments/categoria-dor-inflamacao.webp',
  },
  {
    slug: 'oncologia-paliativos',
    name: 'Oncologia e cuidados paliativos',
    eyebrow: 'Oncologia',
    headline: 'Cannabis e os',
    headlineEmphasis: 'cuidados paliativos.',
    intro: [
      'Em oncologia, canabinoides atuam em múltiplas frentes: controle de náusea e vômito induzidos por quimioterapia, estimulação de apetite em pacientes com caquexia, manejo de dor oncológica e melhora da qualidade de vida. O THC foi um dos primeiros canabinoides a ter uso médico reconhecido internacionalmente.',
      'Dronabinol (THC sintético) e nabilona são aprovados pela FDA desde os anos 1980 para náusea refratária. No contexto paliativo, a combinação THC+CBD melhora o manejo multimodal da dor, reduzindo a necessidade de opioides e seus efeitos colaterais.',
    ],
    howCannabisHelps: {
      title: 'Como os canabinoides ajudam em oncologia',
      text: 'O THC atua como antiemético potente via receptores CB1 no centro do vômito do tronco encefálico, em vias complementares aos antieméticos serotoninérgicos. Também estimula apetite via ativação de receptores CB1 hipotalâmicos. O CBD complementa com efeito anti-inflamatório e ansiolítico, melhorando a qualidade de vida global do paciente oncológico.',
      keyPoints: [
        { label: 'Antiemético', description: 'THC atua no centro do vômito (área postrema) por mecanismo diferente dos antieméticos convencionais — eficaz quando outros falham.' },
        { label: 'Estimulante de apetite', description: 'THC ativa receptores CB1 hipotalâmicos, combatendo a anorexia e caquexia associadas ao câncer e HIV/AIDS.' },
        { label: 'Poupador de opioide', description: 'THC+CBD como adjuvante permite reduzir doses de opioides em 30-50%, diminuindo constipação, sedação e risco de dependência.' },
      ],
    },
    endocannabinoidContext: 'Pesquisas recentes investigam o papel direto do sistema endocanabinoide na progressão tumoral. Receptores CB1 e CB2 estão presentes em células tumorais, e canabinoides demonstraram efeito antiproliferativo in vitro. Embora a aplicação antitumoral ainda seja experimental, o uso em suporte e paliativo é bem estabelecido.',
    treatmentSlugs: ['oncologia', 'nauseas-quimio', 'dor-oncologica'],
    tintBg: 'bg-[#EEE9F5]',
    tintBgDark: 'dark:bg-[#1e1a2e]',
    decorativeText: 'Onco',
    heroImage: '/treatments/categoria-oncologia.webp',
  },
]

export function getCategoryBySlug(slug: string): TreatmentCategory | undefined {
  return treatmentCategories.find((c) => c.slug === slug)
}

export function getCategoryTreatments(category: TreatmentCategory): Treatment[] {
  return category.treatmentSlugs
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter((t): t is Treatment => t !== undefined)
}
