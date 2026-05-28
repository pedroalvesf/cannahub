export interface StepOption {
  value: string
  label: string
  description?: string
}

export interface StepConfig {
  question: string
  subtitle?: string
  options: StepOption[]
  allowFreeText?: boolean
  freeTextPlaceholder?: string
  columns?: 1 | 2
  key: string
  backendStepNumber: number
  infoBox?: { title: string; text: string }
  multiSelect?: boolean
}

export const BASE_STEPS: StepConfig[] = [
  {
    key: 'condition',
    backendStepNumber: 1,
    question: 'Para começarmos, qual é o seu ponto de partida?',
    subtitle: 'Selecione uma ou mais condições que afetam sua qualidade de vida.',
    multiSelect: true,
    options: [
      { value: 'chronic_pain', label: 'Dor Crônica', description: 'Dores persistentes que afetam o dia a dia' },
      { value: 'anxiety', label: 'Ansiedade', description: 'Ansiedade, pânico ou estresse' },
      { value: 'depression', label: 'Depressão', description: 'Tristeza persistente e perda de interesse' },
      { value: 'insomnia', label: 'Insônia', description: 'Dificuldade para dormir ou manter o sono' },
      { value: 'epilepsy', label: 'Epilepsia', description: 'Convulsões ou crises epilépticas' },
      { value: 'autism', label: 'Autismo / TEA', description: 'Transtorno do espectro autista' },
      { value: 'parkinsons', label: 'Parkinson', description: 'Tremores e rigidez muscular' },
      { value: 'fibromyalgia', label: 'Fibromialgia', description: 'Dor generalizada e fadiga' },
      { value: 'ptsd', label: 'PTSD', description: 'Estresse pós-traumático' },
      { value: 'nausea', label: 'Náusea / Apetite', description: 'Náusea crônica ou perda de apetite' },
      { value: 'multiple_sclerosis', label: 'Esclerose Múltipla', description: 'Espasticidade e dor associada' },
      { value: 'other', label: 'Outra condição' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Ou descreva com suas próprias palavras...',
    columns: 2,
  },
  {
    key: 'experience',
    backendStepNumber: 2,
    question: 'Qual sua experiência com cannabis medicinal?',
    options: [
      { value: 'never', label: 'Nunca usei', description: 'Primeira vez buscando esse tratamento' },
      { value: 'less_than_6m', label: 'Menos de 6 meses' },
      { value: '6m_to_1y', label: '6 meses a 1 ano' },
      { value: '1y_to_3y', label: '1 a 3 anos' },
      { value: 'more_than_3y', label: 'Mais de 3 anos' },
    ],
  },
  {
    key: 'currentAccessMethod',
    backendStepNumber: 6,
    question: 'Como você acessa cannabis atualmente?',
    subtitle: 'Não se preocupe — essa informação é confidencial e nos ajuda a orientar você da melhor forma.',
    options: [
      { value: 'regulated_association', label: 'Associação regulamentada', description: 'Já sou membro de uma associação' },
      { value: 'anvisa_import', label: 'Importação via Anvisa', description: 'Importo com autorização da Anvisa' },
      { value: 'informal', label: 'Acesso informal', description: 'Consigo por conta própria, sem documentação' },
      { value: 'self_cultivation', label: 'Autocultivo', description: 'Cultivo para uso pessoal' },
      { value: 'not_accessing', label: 'Ainda não acesso', description: 'Quero começar o tratamento' },
    ],
    infoBox: {
      title: 'Estamos aqui para ajudar',
      text: 'Independente da sua situação atual, a CannHub pode te orientar para regularizar seu acesso à cannabis medicinal de forma segura e legal.',
    },
  },
  {
    key: 'prescription',
    backendStepNumber: 3,
    question: 'Você possui receita médica?',
    subtitle: 'A receita é necessária para acessar o medicamento. Sem ela, podemos indicar um médico.',
    options: [
      { value: 'yes', label: 'Sim, tenho receita válida', description: 'Vou enviar na próxima etapa' },
      { value: 'no', label: 'Ainda não tenho', description: 'Preciso de indicação de médico' },
      { value: 'expired', label: 'Tenho, mas está vencida', description: 'Preciso renovar' },
    ],
  },
  {
    key: 'preferredForm',
    backendStepNumber: 4,
    question: 'Como prefere usar o medicamento?',
    subtitle: 'Selecione uma ou mais formas de uso. Se não souber, sem problema — podemos orientar depois.',
    multiSelect: true,
    options: [
      { value: 'sublingual_oil', label: 'Óleo sublingual', description: 'Gotas sob a língua — mais comum' },
      { value: 'capsule', label: 'Cápsula', description: 'Dosagem precisa e prática' },
      { value: 'vaporization', label: 'Vaporização', description: 'Inalação sem combustão' },
      { value: 'topical', label: 'Uso tópico', description: 'Cremes para dor localizada' },
      { value: 'edible', label: 'Comestível', description: 'Gummies e alimentos com cannabis' },
    ],
    columns: 2,
  },
  {
    key: 'assistedAccess',
    backendStepNumber: 5,
    question: 'Precisa de acesso assistido?',
    subtitle: 'Algumas associações oferecem custo reduzido ou doação para quem tem dificuldade financeira.',
    options: [
      { value: 'yes', label: 'Sim, preciso de ajuda', description: 'Busco opções com custo reduzido' },
      { value: 'no', label: 'Consigo arcar com o valor' },
    ],
  },
]

export function getVisibleSteps(answers: Record<string, string>): StepConfig[] {
  return BASE_STEPS.filter((step) => {
    if (step.key === 'currentAccessMethod') {
      return answers.experience !== undefined && answers.experience !== 'never'
    }
    return true
  })
}

export function getLabelFor(stepConfig: StepConfig, value: string): string {
  if (stepConfig.multiSelect && value.includes(',')) {
    return value
      .split(',')
      .map((v) => stepConfig.options.find((o) => o.value === v)?.label ?? v)
      .join(', ')
  }
  const option = stepConfig.options.find((o) => o.value === value)
  return option?.label ?? value
}
