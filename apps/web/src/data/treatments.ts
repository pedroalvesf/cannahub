export interface Treatment {
  slug: string
  name: string
  shortDescription: string
  evidenceLevel: 'very_high' | 'high' | 'moderate' | 'emerging'
  compound: string
  route: string
  icon: string
  iconImage: string  // ícone SVG compacto para menu (80x80)
  image: string      // ilustração SVG grande para página de detalhe
  heroImage?: string       // imagem real (webp) para hero e cards
  mechanismImage?: string  // imagem horizontal (webp) para seção "Como a cannabis ajuda"
  sections: {
    about: string
    symptoms: string[]
    howCannabisHelps: string
    evidence: { text: string; source: string }[]
    protocols: { label: string; value: string }[]
  }
}

const EVIDENCE_LABELS: Record<string, string> = {
  very_high: 'Evidência muito alta',
  high: 'Evidência alta',
  moderate: 'Evidência moderada',
  emerging: 'Evidência emergente',
}

export function getEvidenceLabel(level: string): string {
  return EVIDENCE_LABELS[level] ?? level
}

export const treatments: Treatment[] = [
  {
    slug: 'epilepsia',
    name: 'Epilepsia refratária',
    shortDescription: 'CBD aprovado pela Anvisa para síndromes como Dravet e Lennox-Gastaut, com redução de até 50% na frequência de crises.',
    evidenceLevel: 'very_high',
    compound: 'CBD isolado ou predominante',
    route: 'Óleo sublingual',
    icon: 'zap',
    iconImage: '/treatments/icons/epilepsia.svg',
    image: '/treatments/epilepsia.svg',
    heroImage: '/treatments/epilepsia-hero.webp',
    mechanismImage: '/treatments/epilepsia-mecanismo.webp',
    sections: {
      about: 'A epilepsia refratária é a condição com maior respaldo científico para uso de cannabis medicinal. Pacientes que não respondem adequadamente a dois ou mais anticonvulsivantes convencionais podem se beneficiar do canabidiol (CBD). O Epidiolex (CBD 100mg/ml) foi o primeiro medicamento à base de cannabis registrado pela Anvisa no Brasil.',
      symptoms: [
        'Crises convulsivas frequentes e resistentes a medicamentos',
        'Crises tônico-clônicas, ausências ou mioclônicas recorrentes',
        'Comprometimento cognitivo associado às crises',
        'Efeitos colaterais severos dos anticonvulsivantes tradicionais',
      ],
      howCannabisHelps: 'O CBD atua como modulador de múltiplos alvos no sistema nervoso central, incluindo receptores de adenosina, canais de cálcio e receptores TRPV1. Diferente dos anticonvulsivantes tradicionais, age em mecanismos complementares, o que explica a eficácia em epilepsias que não respondem a outros tratamentos. Estudos multicêntricos demonstraram redução de até 50% na frequência de crises convulsivas.',
      evidence: [
        { text: 'Redução de 39% nas crises em pacientes com Dravet (ensaio fase III, duplo-cego)', source: 'Devinsky et al., NEJM, 2017' },
        { text: 'Redução de 44% nas crises de queda em Lennox-Gastaut', source: 'Thiele et al., Lancet, 2018' },
        { text: 'Epidiolex aprovado pela FDA (2018) e pela Anvisa para uso no Brasil', source: 'FDA / Anvisa' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD isolado (Epidiolex) ou CBD:THC em proporções altas (20:1)' },
        { label: 'Via de administração', value: 'Óleo sublingual' },
        { label: 'Dose inicial típica', value: '2,5 mg/kg/dia, aumentando gradualmente' },
        { label: 'Monitoramento', value: 'Função hepática, interação com outros anticonvulsivantes' },
      ],
    },
  },
  {
    slug: 'dor-cronica',
    name: 'Dor crônica e neuropática',
    shortDescription: 'Canabinoides modulam a dor atuando em receptores CB1 e CB2. Meta-análises da JAMA e BMJ comprovam eficácia.',
    evidenceLevel: 'high',
    compound: 'CBD + THC (proporção variável)',
    route: 'Óleo sublingual, tópico, cápsula',
    icon: 'activity',
    iconImage: '/treatments/icons/dor-cronica.svg',
    image: '/treatments/dor-cronica.svg',
    heroImage: '/treatments/dor-cronica-hero.webp',
    mechanismImage: '/treatments/dor-cronica-mecanismo.webp',
    sections: {
      about: 'A dor crônica afeta cerca de 37% da população brasileira. Canabinoides atuam nos receptores CB1 (sistema nervoso central) e CB2 (sistema imunológico) modulando a transmissão nociceptiva. A combinação THC:CBD mostra resultados superiores ao uso isolado de cada composto — o chamado efeito entourage.',
      symptoms: [
        'Dor persistente por mais de 3 meses',
        'Dor neuropática (queimação, formigamento, choques)',
        'Fibromialgia (dor muscular difusa e fadiga)',
        'Dor articular (artrite, artrose)',
        'Enxaqueca crônica refratária',
      ],
      howCannabisHelps: 'O THC ativa receptores CB1 no sistema nervoso central, modulando a percepção da dor. O CBD atua como anti-inflamatório via CB2 e inibe a recaptação de anandamida (endocanabinoide natural). Juntos, promovem analgesia com menos efeitos colaterais que opioides, sem risco de dependência física. Tópicos com CBD atuam diretamente em receptores periféricos para dor localizada.',
      evidence: [
        { text: 'Meta-análise com 79 ensaios: canabinoides superiores ao placebo para dor neuropática', source: 'Whiting et al., JAMA, 2015' },
        { text: 'Redução de 30% na dor em pacientes com fibromialgia usando CBD:THC', source: 'Sagy et al., J. Pain Research, 2019' },
        { text: 'Cannabis associada à redução de 64% no uso de opioides em dor crônica', source: 'Boehnke et al., J. Pain, 2016' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD + THC em proporções de 1:1 a 20:1 (conforme intensidade)' },
        { label: 'Via de administração', value: 'Óleo sublingual (sistêmico), tópico (dor localizada), cápsula' },
        { label: 'Dose inicial típica', value: 'CBD 25mg/dia + THC 2,5mg/dia, titulação gradual' },
        { label: 'Monitoramento', value: 'Escalas de dor (EVA), qualidade do sono, redução de outros analgésicos' },
      ],
    },
  },
  {
    slug: 'ansiedade',
    name: 'Ansiedade e TEPT',
    shortDescription: 'CBD interage com receptores serotoninérgicos (5-HT1A) com efeito ansiolítico sem risco de dependência.',
    evidenceLevel: 'high',
    compound: 'CBD predominante',
    route: 'Óleo sublingual, cápsula',
    icon: 'heart',
    iconImage: '/treatments/icons/ansiedade.svg',
    image: '/treatments/ansiedade.svg',
    heroImage: '/treatments/ansiedade-hero.webp',
    mechanismImage: '/treatments/ansiedade-mecanismo.webp',
    sections: {
      about: 'Transtornos de ansiedade afetam 18,6 milhões de brasileiros — o país com maior prevalência no mundo segundo a OMS. O CBD oferece uma alternativa aos benzodiazepínicos, com efeito ansiolítico comprovado e sem os riscos de dependência, tolerância e comprometimento cognitivo associados a esses medicamentos.',
      symptoms: [
        'Ansiedade generalizada persistente',
        'Crises de pânico',
        'Ansiedade social',
        'Transtorno de estresse pós-traumático (TEPT)',
        'Insônia associada à ansiedade',
      ],
      howCannabisHelps: 'O CBD interage com receptores serotoninérgicos (5-HT1A), o mesmo alvo dos antidepressivos ISRS, produzindo efeito ansiolítico. Também modula o sistema endocanabinoide, normalizando a resposta ao estresse. Diferente dos benzodiazepínicos, não causa dependência física, tolerância crescente ou comprometimento cognitivo significativo.',
      evidence: [
        { text: 'CBD 300mg reduziu significativamente ansiedade em teste simulado de fala pública', source: 'Zuardi et al., J. Psychopharmacology, 2017' },
        { text: 'Melhora em 79% dos pacientes com ansiedade em estudo com 72 adultos', source: 'Shannon et al., Permanente J., 2019' },
        { text: 'Redução de pesadelos e sintomas de TEPT com CBD em veteranos', source: 'Elms et al., J. Alt. Complement. Med., 2019' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD isolado ou predominante (CBD:THC > 20:1)' },
        { label: 'Via de administração', value: 'Óleo sublingual, cápsula' },
        { label: 'Dose inicial típica', value: 'CBD 25-50mg/dia, podendo chegar a 300mg/dia' },
        { label: 'Monitoramento', value: 'Escala de ansiedade (GAD-7, BAI), qualidade do sono' },
      ],
    },
  },
  {
    slug: 'autismo',
    name: 'Autismo / TEA',
    shortDescription: 'Estudos brasileiros demonstram melhora em irritabilidade, sono e interação social com CBD:THC 20:1.',
    evidenceLevel: 'moderate',
    compound: 'CBD predominante (CBD:THC 20:1)',
    route: 'Óleo sublingual',
    icon: 'users',
    iconImage: '/treatments/icons/autismo.svg',
    image: '/treatments/autismo.svg',
    heroImage: '/treatments/autismo-hero.webp',
    mechanismImage: '/treatments/autismo-mecanismo.webp',
    sections: {
      about: 'O Transtorno do Espectro Autista (TEA) é uma condição neurológica que afeta cerca de 2 milhões de brasileiros. Embora não haja cura, canabinoides têm demonstrado melhora significativa em sintomas como irritabilidade, agressividade, distúrbios do sono e dificuldade de interação social — sintomas que impactam diretamente a qualidade de vida do paciente e da família.',
      symptoms: [
        'Irritabilidade e crises de agressividade',
        'Distúrbios do sono',
        'Dificuldade de interação social',
        'Comportamentos restritivos e repetitivos',
        'Hiperatividade e déficit de atenção associados',
      ],
      howCannabisHelps: 'O CBD modula o sistema GABAérgico (principal neurotransmissor inibitório), reduzindo a hiperexcitabilidade neuronal associada ao TEA. Também atua no sistema endocanabinoide, que regula humor, sono e comportamento social. Proporções CBD:THC de 20:1 são as mais utilizadas em protocolos pediátricos, minimizando efeitos psicoativos.',
      evidence: [
        { text: 'Melhora em 61% dos pacientes em comportamentos e comunicação', source: 'Aran et al., Neurology, 2018' },
        { text: 'Redução de 68% em crises de autoagressão em estudo brasileiro', source: 'Fleury-Teixeira et al., Front. Neurology, 2019' },
        { text: 'Melhora significativa na qualidade do sono em 71% dos pacientes pediátricos', source: 'Barchel et al., J. Autism Dev. Disord., 2019' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD:THC 20:1 (protocolo pediátrico mais comum)' },
        { label: 'Via de administração', value: 'Óleo sublingual' },
        { label: 'Dose inicial típica', value: 'CBD 1mg/kg/dia, titulação lenta' },
        { label: 'Monitoramento', value: 'Escalas ABC (Aberrant Behavior Checklist), diário de sono' },
      ],
    },
  },
  {
    slug: 'oncologia',
    name: 'Oncologia e cuidados paliativos',
    shortDescription: 'THC reconhecido como antiemético potente para quimioterapia. Melhora apetite, dor e qualidade de vida.',
    evidenceLevel: 'high',
    compound: 'THC predominante ou THC+CBD',
    route: 'Óleo sublingual, cápsula',
    icon: 'pulse',
    iconImage: '/treatments/icons/oncologia.svg',
    image: '/treatments/oncologia.svg',
    heroImage: '/treatments/oncologia-hero.webp',
    mechanismImage: '/treatments/oncologia-mecanismo.webp',
    sections: {
      about: 'Em oncologia, canabinoides atuam em múltiplas frentes: controle de náusea e vômito induzidos por quimioterapia, estimulação de apetite em pacientes com caquexia, manejo de dor oncológica e melhora da qualidade de vida em cuidados paliativos. O THC foi um dos primeiros canabinoides a ter uso médico reconhecido, justamente nesse contexto.',
      symptoms: [
        'Náusea e vômito induzidos por quimioterapia',
        'Perda de apetite e perda de peso (caquexia)',
        'Dor oncológica (nociceptiva e neuropática)',
        'Insônia e ansiedade relacionadas ao tratamento',
        'Fadiga severa',
      ],
      howCannabisHelps: 'O THC atua como antiemético potente via receptores CB1 no centro do vômito (tronco encefálico). Também estimula apetite via ativação do sistema endocanabinoide hipotalâmico. Em cuidados paliativos, a combinação THC+CBD melhora o manejo multimodal da dor, reduzindo a necessidade de opioides e melhorando o padrão de sono e a qualidade de vida geral.',
      evidence: [
        { text: 'Dronabinol (THC sintético) aprovado pela FDA para náusea e caquexia em câncer e HIV/AIDS', source: 'FDA, Marinol/Syndros' },
        { text: 'Cannabis reduziu uso de opioides em 36% em pacientes oncológicos com dor', source: 'Bar-Lev Schleider et al., Frontiers Pharmacol., 2018' },
        { text: 'Melhora significativa na qualidade de vida em 70% dos pacientes em cuidados paliativos', source: 'Good et al., BMJ Support. Pall. Care, 2019' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'THC predominante (antiemético), THC+CBD 1:1 (dor e paliativo)' },
        { label: 'Via de administração', value: 'Óleo sublingual, cápsula, vaporização (ação rápida para náusea aguda)' },
        { label: 'Dose inicial típica', value: 'THC 2,5mg antes da quimio, CBD 25mg/dia para suporte' },
        { label: 'Monitoramento', value: 'Escala de náusea (MASCC), peso corporal, escala de dor' },
      ],
    },
  },
  {
    slug: 'parkinson',
    name: 'Parkinson e neurodegenerativas',
    shortDescription: 'CBD demonstra propriedades neuroprotetoras com melhora em tremores, rigidez e distúrbios do sono REM.',
    evidenceLevel: 'moderate',
    compound: 'CBD + THC balanceado',
    route: 'Óleo sublingual, cápsula',
    icon: 'brain',
    iconImage: '/treatments/icons/parkinson.svg',
    image: '/treatments/parkinson.svg',
    heroImage: '/treatments/parkinson-hero.webp',
    mechanismImage: '/treatments/parkinson-mecanismo.webp',
    sections: {
      about: 'Doenças neurodegenerativas como Parkinson e Alzheimer envolvem perda progressiva de neurônios e neuroinflamação crônica. O CBD demonstra propriedades neuroprotetoras e antioxidantes que podem não apenas aliviar sintomas, mas potencialmente retardar a progressão da doença. Pesquisas brasileiras lideradas por Zuardi (USP) foram pioneiras nessa área.',
      symptoms: [
        'Tremores e rigidez muscular',
        'Distúrbios do sono REM (agitação noturna)',
        'Perda de equilíbrio e coordenação',
        'Dor muscular e articular associada',
        'Ansiedade e depressão reativas',
      ],
      howCannabisHelps: 'O CBD atua como neuroprotetor via propriedades antioxidantes e anti-inflamatórias, reduzindo o estresse oxidativo que danifica neurônios dopaminérgicos. Também modula receptores PPAR-γ, envolvidos na regulação da neuroinflamação. Em pacientes com Parkinson, melhora tremores, rigidez, distúrbios do sono REM e qualidade de vida geral.',
      evidence: [
        { text: 'Melhora significativa na qualidade de vida de parkinsonianos com CBD 300mg/dia', source: 'Zuardi et al., J. Psychopharmacology, 2009' },
        { text: 'Redução de distúrbios de sono REM em 4/4 pacientes com Parkinson', source: 'Chagas et al., J. Clin. Pharm. Ther., 2014' },
        { text: 'CBD reduziu neuroinflamação em modelos pré-clínicos de Alzheimer', source: 'Esposito et al., Mol. Neurobiol., 2011' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD predominante ou CBD+THC balanceado' },
        { label: 'Via de administração', value: 'Óleo sublingual, cápsula' },
        { label: 'Dose inicial típica', value: 'CBD 75mg/dia, podendo chegar a 300mg/dia' },
        { label: 'Monitoramento', value: 'Escala UPDRS (Parkinson), diário de sono, avaliação motora' },
      ],
    },
  },
  {
    slug: 'esclerose-multipla',
    name: 'Esclerose múltipla e espasticidade',
    shortDescription: 'Nabiximols (Sativex) THC:CBD 1:1 aprovado em vários países para espasticidade resistente.',
    evidenceLevel: 'moderate',
    compound: 'THC:CBD 1:1',
    route: 'Óleo sublingual, spray oromucoso',
    icon: 'shield',
    iconImage: '/treatments/icons/esclerose-multipla.svg',
    image: '/treatments/esclerose-multipla.svg',
    heroImage: '/treatments/esclerose-multipla-hero.webp',
    mechanismImage: '/treatments/esclerose-multipla-mecanismo.webp',
    sections: {
      about: 'A esclerose múltipla (EM) é uma doença autoimune que ataca a mielina dos neurônios, causando espasticidade muscular, dor e fadiga. O nabiximols (Sativex), spray oromucoso com THC:CBD 1:1, é o primeiro medicamento à base de cannabis aprovado em vários países europeus especificamente para EM. No Brasil, o acesso é possível via importação autorizada pela Anvisa.',
      symptoms: [
        'Espasticidade muscular (rigidez, espasmos)',
        'Dor neuropática central',
        'Fadiga intensa',
        'Distúrbios urinários (bexiga neurogênica)',
        'Tremor e incoordenação motora',
      ],
      howCannabisHelps: 'A combinação THC:CBD 1:1 age sinergicamente: o THC relaxa a musculatura via receptores CB1 na medula espinhal, enquanto o CBD modula a resposta inflamatória autoimune via CB2 e receptores adenosínicos. O spray oromucoso permite titulação precisa, e estudos fase III demonstraram redução significativa em espasticidade medida pela escala NRS.',
      evidence: [
        { text: 'Nabiximols reduziu espasticidade em 74% dos respondedores (estudo fase III)', source: 'Novotna et al., Eur. J. Neurology, 2011' },
        { text: 'Melhora sustentada por 12 meses em espasticidade e dor associada', source: 'Flachenecker et al., Eur. J. Neurology, 2014' },
        { text: 'Redução significativa em espasmos noturnos e melhora na qualidade do sono', source: 'Wade et al., Mult. Scler. J., 2004' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'THC:CBD 1:1 (nabiximols/Sativex ou equivalente)' },
        { label: 'Via de administração', value: 'Spray oromucoso, óleo sublingual' },
        { label: 'Dose inicial típica', value: '1 spray/dia, titulação até 12 sprays/dia' },
        { label: 'Monitoramento', value: 'Escala NRS de espasticidade, escala de Ashworth, diário de espasmos' },
      ],
    },
  },
  {
    slug: 'insonia',
    name: 'Distúrbios do sono',
    shortDescription: 'THC em doses baixas reduz latência do sono. CBD+CBN como alternativa a hipnóticos convencionais.',
    evidenceLevel: 'moderate',
    compound: 'THC baixa dose + CBD, ou CBD+CBN',
    route: 'Óleo sublingual, cápsula',
    icon: 'moon',
    iconImage: '/treatments/icons/insonia.svg',
    image: '/treatments/insonia.svg',
    heroImage: '/treatments/insonia-hero.webp',
    mechanismImage: '/treatments/insonia-mecanismo.webp',
    sections: {
      about: 'Distúrbios do sono afetam 73 milhões de brasileiros. Hipnóticos tradicionais (zolpidem, benzodiazepínicos) apresentam riscos de dependência, tolerância e efeitos residuais diurnos. Canabinoides oferecem alternativa com perfil de segurança diferenciado, especialmente quando a insônia é secundária a dor, ansiedade ou TEPT.',
      symptoms: [
        'Dificuldade para adormecer (insônia inicial)',
        'Despertares frequentes durante a noite',
        'Sono não reparador',
        'Insônia associada a dor ou ansiedade',
        'Distúrbio de sono REM',
      ],
      howCannabisHelps: 'O THC em doses baixas (2,5-5mg) atua nos receptores CB1 hipotalâmicos, reduzindo a latência do sono. O CBD em doses altas (160mg+) tem efeito sedativo via modulação adenosínica. O CBN (canabinoide menor) é investigado como potente indutor de sono. A vantagem sobre hipnóticos: menor tolerância, sem depressão respiratória e sem efeito rebote na descontinuação.',
      evidence: [
        { text: 'CBD 160mg aumentou significativamente a duração do sono em comparação ao placebo', source: 'Carlini & Cunha, J. Clin. Pharmacol., 1981' },
        { text: 'THC reduziu tempo para adormecer e despertares noturnos em pacientes com dor crônica', source: 'Ware et al., J. Pain Symptom Manage., 2010' },
        { text: '66% dos pacientes com insônia relataram melhora com cannabis medicinal', source: 'Kuhathasan et al., BMC Psychiatry, 2021' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'THC 2,5-5mg + CBD 25mg (noturno), ou CBD+CBN' },
        { label: 'Via de administração', value: 'Óleo sublingual (30-60 min antes de dormir), cápsula' },
        { label: 'Dose inicial típica', value: 'THC 2,5mg + CBD 25mg ao deitar' },
        { label: 'Monitoramento', value: 'Diário de sono (ISI), actigrafia, efeitos diurnos residuais' },
      ],
    },
  },
  {
    slug: 'artrite',
    name: 'Artrite e artrose',
    shortDescription: 'CBD tópico e oral reduz inflamação articular e melhora mobilidade, com menos efeitos colaterais que anti-inflamatórios convencionais.',
    evidenceLevel: 'moderate',
    compound: 'CBD tópico + oral',
    route: 'Tópico (creme/gel), óleo sublingual',
    icon: 'activity',
    iconImage: '/treatments/icons/dor-cronica.svg',
    image: '/treatments/artrite-hero.webp',
    heroImage: '/treatments/artrite-hero.webp',
    mechanismImage: '/treatments/artrite-mecanismo.webp',
    sections: {
      about: 'Artrite e artrose afetam mais de 15 milhões de brasileiros, causando dor crônica, rigidez e perda de mobilidade. Anti-inflamatórios não esteroidais (AINEs) são o tratamento padrão, mas apresentam riscos gastrointestinais e cardiovasculares no uso prolongado. O CBD oferece uma alternativa anti-inflamatória com perfil de segurança diferenciado, atuando tanto por via tópica (diretamente na articulação) quanto sistêmica.',
      symptoms: [
        'Dor articular persistente (joelhos, mãos, quadril)',
        'Rigidez matinal prolongada',
        'Inchaço e inflamação visível nas articulações',
        'Perda progressiva de mobilidade',
        'Dor que piora com atividade física ou mudança de clima',
      ],
      howCannabisHelps: 'O CBD atua como anti-inflamatório via receptores CB2 presentes nas células do sistema imunológico articular. Em aplicação tópica, penetra diretamente nos tecidos afetados sem efeitos sistêmicos. Por via oral, modula a resposta inflamatória crônica que degrada a cartilagem. Estudos pré-clínicos demonstram redução significativa de citocinas inflamatórias (TNF-α, IL-6) e proteção da cartilagem articular.',
      evidence: [
        { text: 'CBD tópico reduziu dor e inflamação articular em modelo animal de artrite sem efeitos colaterais', source: 'Hammell et al., European J. Pain, 2016' },
        { text: 'Pacientes com artrite relataram melhora de 83% na dor com cannabis medicinal', source: 'Fitzcharles et al., Arthritis Care & Research, 2020' },
        { text: 'CBD oral reduziu marcadores inflamatórios (TNF-α) em 30% em estudo observacional', source: 'Lowin et al., Cell Death & Disease, 2020' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD tópico (creme 250-500mg) + CBD oral (25-50mg/dia)' },
        { label: 'Via de administração', value: 'Tópico na articulação afetada + óleo sublingual' },
        { label: 'Dose inicial típica', value: 'Tópico 2-3x/dia + CBD oral 25mg/dia' },
        { label: 'Monitoramento', value: 'Escala de dor (EVA), amplitude de movimento, redução de AINEs' },
      ],
    },
  },
  {
    slug: 'endometriose',
    name: 'Endometriose',
    shortDescription: 'CBD modula a dor pélvica crônica e reduz crises inflamatórias, oferecendo alternativa aos analgésicos hormonais.',
    evidenceLevel: 'emerging',
    compound: 'CBD predominante',
    route: 'Óleo sublingual, supositório',
    icon: 'heart',
    iconImage: '/treatments/icons/dor-cronica.svg',
    image: '/treatments/endometriose-hero.webp',
    heroImage: '/treatments/endometriose-hero.webp',
    mechanismImage: '/treatments/endometriose-mecanismo.webp',
    sections: {
      about: 'A endometriose afeta cerca de 7 milhões de brasileiras, causando dor pélvica crônica intensa que impacta diretamente a qualidade de vida. O tratamento convencional envolve hormônios e cirurgias, mas muitas pacientes não respondem adequadamente ou sofrem com efeitos colaterais. O sistema endocanabinoide está presente no tecido endometrial e desempenha papel na regulação da dor e inflamação local.',
      symptoms: [
        'Dor pélvica crônica intensa, especialmente durante a menstruação',
        'Dismenorreia severa (cólicas incapacitantes)',
        'Dor durante relações sexuais (dispareunia)',
        'Dor ao urinar ou evacuar durante o período menstrual',
        'Fadiga crônica associada à dor persistente',
      ],
      howCannabisHelps: 'O CBD interage com receptores CB1 e CB2 presentes no tecido endometrial, modulando a dor pélvica e reduzindo a inflamação local. Estudos demonstram que o sistema endocanabinoide está desregulado em pacientes com endometriose — a suplementação com fitocanabinoides pode restaurar esse equilíbrio. O CBD também atua em receptores TRPV1 (dor) e GPR55 (proliferação celular), podendo reduzir tanto a dor quanto o crescimento do tecido endometrial ectópico.',
      evidence: [
        { text: 'Sistema endocanabinoide desregulado em tecido endometrial de pacientes com endometriose', source: 'Sanchez et al., Reproductive Sciences, 2012' },
        { text: 'Cannabis autorreportada como eficaz por 75% das pacientes para manejo da dor', source: 'Sinclair et al., J. Obstetrics & Gynaecology Canada, 2020' },
        { text: 'THC inibiu proliferação de células endometriais in vitro via receptor CB1', source: 'Leconte et al., Human Reproduction, 2010' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'CBD predominante (CBD:THC > 20:1)' },
        { label: 'Via de administração', value: 'Óleo sublingual, supositório vaginal/retal com CBD' },
        { label: 'Dose inicial típica', value: 'CBD 25-50mg/dia sublingual, supositório 100mg CBD' },
        { label: 'Monitoramento', value: 'Escala de dor pélvica, diário menstrual, qualidade de vida (EHP-30)' },
      ],
    },
  },
  {
    slug: 'nauseas-quimio',
    name: 'Náuseas e vômito por quimioterapia',
    shortDescription: 'Dronabinol e nabilona aprovados internacionalmente como antieméticos oncológicos. THC atua diretamente no centro do vômito.',
    evidenceLevel: 'high',
    compound: 'THC sintético ou natural',
    route: 'Cápsula, óleo sublingual, vaporização',
    icon: 'pulse',
    iconImage: '/treatments/icons/oncologia.svg',
    image: '/treatments/nauseas-quimio-hero.webp',
    heroImage: '/treatments/nauseas-quimio-hero.webp',
    mechanismImage: '/treatments/nauseas-quimio-mecanismo.webp',
    sections: {
      about: 'Náuseas e vômitos induzidos por quimioterapia (NVIQ) afetam até 80% dos pacientes oncológicos e são a principal causa de abandono do tratamento. Antieméticos convencionais (ondansetrona, metoclopramida) não são eficazes em todos os casos. O THC foi um dos primeiros canabinoides a ter uso médico reconhecido, justamente nesse contexto — dronabinol (THC sintético) e nabilona são aprovados pela FDA desde os anos 1980.',
      symptoms: [
        'Náusea intensa durante e após sessões de quimioterapia',
        'Vômitos refratários a antieméticos convencionais',
        'Náusea antecipatória (antes mesmo da sessão)',
        'Perda de apetite severa',
        'Desidratação e perda de peso por incapacidade de alimentar-se',
      ],
      howCannabisHelps: 'O THC atua como antiemético potente via receptores CB1 no centro do vômito do tronco encefálico (área postrema e núcleo do trato solitário). Diferente dos antieméticos serotoninérgicos, atua em vias complementares — por isso é eficaz quando outros medicamentos falham. Também estimula o apetite via ativação de receptores CB1 hipotalâmicos, combatendo a anorexia associada ao tratamento oncológico.',
      evidence: [
        { text: 'Dronabinol (THC sintético) aprovado pela FDA para NVIQ refratária desde 1985', source: 'FDA — Marinol/Syndros' },
        { text: 'Nabilona superior ao placebo e comparável a ondansetrona para NVIQ moderada a severa', source: 'Tramèr et al., BMJ, 2001' },
        { text: 'Cannabis reduziu NVIQ em 96% dos pacientes em estudo observacional israelense', source: 'Bar-Sela et al., Oncology, 2013' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'THC (dronabinol 5-10mg) ou nabilona (1-2mg)' },
        { label: 'Via de administração', value: 'Cápsula oral (1-3h antes da quimio), vaporização (ação rápida para náusea aguda)' },
        { label: 'Dose inicial típica', value: 'THC 5mg 1-3h antes da quimio, repetir a cada 4-6h se necessário' },
        { label: 'Monitoramento', value: 'Escala MASCC de náusea, peso corporal, ingestão calórica' },
      ],
    },
  },
  {
    slug: 'dor-oncologica',
    name: 'Dor oncológica crônica',
    shortDescription: 'Adjuvante a opioides, reduzindo a dose necessária e minimizando efeitos adversos como constipação e sedação.',
    evidenceLevel: 'moderate',
    compound: 'CBD + THC (alto THC)',
    route: 'Óleo sublingual, cápsula',
    icon: 'pulse',
    iconImage: '/treatments/icons/oncologia.svg',
    image: '/treatments/dor-oncologica-hero.webp',
    heroImage: '/treatments/dor-oncologica-hero.webp',
    mechanismImage: '/treatments/dor-oncologica-mecanismo.webp',
    sections: {
      about: 'A dor oncológica afeta 55-70% dos pacientes com câncer e é frequentemente subtratada. Opioides são o padrão, mas causam tolerância, constipação, sedação e risco de dependência. Canabinoides atuam como adjuvantes — não substituem opioides, mas permitem reduzir a dose necessária, diminuindo efeitos adversos e melhorando a qualidade de vida.',
      symptoms: [
        'Dor nociceptiva (tumor comprimindo tecidos)',
        'Dor neuropática (quimioterapia danificando nervos periféricos)',
        'Dor óssea por metástases',
        'Dor incidental (ao movimento, toque ou deglutição)',
        'Dor refratária a doses crescentes de opioides',
      ],
      howCannabisHelps: 'A combinação THC+CBD atua em mecanismos complementares aos opioides: THC ativa receptores CB1 nas vias descendentes de dor, enquanto CBD modula a inflamação tumoral via CB2. Juntos, potencializam a analgesia opioide (efeito poupador de opioide), permitindo reduzir doses de morfina em 30-50%. CBD também reduz a neuroinflamação que causa dor neuropática por quimioterapia.',
      evidence: [
        { text: 'Nabiximols (THC:CBD 1:1) reduziu dor oncológica refratária a opioides em estudo fase III', source: 'Portenoy et al., J. Pain, 2012' },
        { text: 'Cannabis associada à redução de 36% no uso de opioides em pacientes oncológicos', source: 'Bar-Lev Schleider et al., Frontiers Pharmacol., 2018' },
        { text: 'Melhora significativa na qualidade de vida em 70% dos pacientes em cuidados paliativos com cannabis', source: 'Good et al., BMJ Support. Pall. Care, 2019' },
      ],
      protocols: [
        { label: 'Composto principal', value: 'THC:CBD 1:1 ou alto THC (para dor severa)' },
        { label: 'Via de administração', value: 'Óleo sublingual, cápsula, spray oromucoso' },
        { label: 'Dose inicial típica', value: 'THC 2,5mg + CBD 2,5mg a cada 8h, titulação a cada 3 dias' },
        { label: 'Monitoramento', value: 'Escala de dor (NRS), dose de opioide concomitante, efeitos adversos' },
      ],
    },
  },
]

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug)
}
