import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { OptionCard } from './option-card'
import { StepProgress } from './step-progress'
import { useOnboardingSummary, useStartOnboarding, useSubmitStep, useCompleteOnboarding } from '@/hooks/use-onboarding'

interface StepConfig {
  question: string
  subtitle?: string
  options: { value: string; label: string; description?: string }[]
  allowFreeText?: boolean
  freeTextPlaceholder?: string
  columns?: 1 | 2
}

const steps: StepConfig[] = [
  {
    question: 'Para começarmos, qual é o seu ponto de partida?',
    subtitle: 'Selecione a condição que mais afeta sua qualidade de vida.',
    options: [
      { value: 'chronic_pain', label: 'Dor Crônica', description: 'Dores persistentes que afetam o dia a dia' },
      { value: 'anxiety', label: 'Ansiedade', description: 'Ansiedade pânico ou estresse' },
      { value: 'epilepsy', label: 'Epilepsia', description: 'Convulsões ou crises epilépticas' },
      { value: 'autism', label: 'Autismo / TEA', description: 'Transtorno do espectro autista' },
      { value: 'parkinsons', label: 'Parkinson', description: 'Tremores e rigidez muscular' },
      { value: 'fibromyalgia', label: 'Fibromialgia', description: 'Dor generalizada e fadiga' },
      { value: 'ptsd', label: 'PTSD', description: 'Estresse pós traumático' },
      { value: 'other', label: 'Outra condição' },
    ],
    allowFreeText: true,
    freeTextPlaceholder: 'Ou descreva com suas próprias palavras...',
    columns: 2,
  },
  {
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
    question: 'Você possui receita médica?',
    subtitle: 'A receita é necessária para acessar o medicamento. Sem ela, podemos indicar um médico.',
    options: [
      { value: 'yes', label: 'Sim, tenho receita válida', description: 'Vou enviar na próxima etapa' },
      { value: 'no', label: 'Ainda não tenho', description: 'Preciso de indicação de médico' },
      { value: 'expired', label: 'Tenho, mas está vencida', description: 'Preciso renovar' },
    ],
  },
  {
    question: 'Como prefere usar o medicamento?',
    subtitle: 'Se não souber, sem problema — podemos orientar depois.',
    options: [
      { value: 'sublingual_oil', label: 'Óleo sublingual', description: 'Gotas sob a língua — mais comum' },
      { value: 'capsule', label: 'Cápsula', description: 'Dosagem precisa e prática' },
      { value: 'vaporization', label: 'Vaporização', description: 'Inalação sem combustão' },
      { value: 'topical', label: 'Uso tópico', description: 'Cremes para dor localizada' },
      { value: 'edible', label: 'Comestível', description: 'Alimentos com cannabis' },
    ],
    columns: 2,
  },
  {
    question: 'Precisa de acesso assistido?',
    subtitle: 'Algumas associações oferecem custo reduzido ou doação para quem tem dificuldade financeira.',
    options: [
      { value: 'yes', label: 'Sim, preciso de ajuda', description: 'Busco opções com custo reduzido' },
      { value: 'no', label: 'Consigo arcar com o valor' },
    ],
  },
]

const stepKeys = [
  'condition',
  'experience',
  'prescription',
  'preferredForm',
  'assistedAccess',
]

interface OnboardingFlowProps {
  onComplete: (data: Record<string, string>) => void
  onEscalate: (reason: string) => void
}

export function OnboardingFlow({ onComplete, onEscalate }: OnboardingFlowProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [freeText, setFreeText] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)

  const { data: existingSession, isError: summaryError, isLoading: summaryLoading } = useOnboardingSummary()
  const startOnboarding = useStartOnboarding()
  const submitStep = useSubmitStep()
  const completeOnboarding = useCompleteOnboarding()

  // Check existing session and either resume or start new
  useEffect(() => {
    if (initialized.current) return
    if (summaryLoading) return // still loading
    // If error (e.g. 404 no session) or no data, treat as no session

    initialized.current = true

    // Already completed — redirect to dashboard
    if (existingSession && (existingSession.status === 'completed' || existingSession.status === 'awaiting_prescription')) {
      navigate('/painel', { replace: true })
      return
    }

    // Session in progress — resume from where user left off
    if (existingSession && existingSession.status === 'in_progress') {
      const restored: Record<string, string> = {}
      if (existingSession.condition) restored.condition = existingSession.condition
      if (existingSession.experience) restored.experience = existingSession.experience
      if (existingSession.hasPrescription !== undefined) {
        restored.prescription = existingSession.hasPrescription ? 'yes' : 'no'
      }
      if (existingSession.preferredForm) restored.preferredForm = existingSession.preferredForm
      if (existingSession.assistedAccess !== undefined) {
        restored.assistedAccess = existingSession.assistedAccess ? 'yes' : 'no'
      }
      setAnswers(restored)

      // Jump to the next unanswered step
      const resumeStep = Math.min((existingSession.currentStep ?? 1) - 1, steps.length)
      setCurrentStep(resumeStep)
      setIsLoading(false)
      return
    }

    // No session — start new
    startOnboarding.mutate(undefined, {
      onSuccess: () => setIsLoading(false),
      onError: (err) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        if (msg?.includes('already') || msg?.includes('exists')) {
          setIsLoading(false)
          return
        }
        setApiError(msg || 'Erro ao iniciar acolhimento.')
        setIsLoading(false)
      },
    })
  }, [existingSession, summaryLoading, summaryError]) // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isSummary = currentStep >= steps.length

  function submitStepToApi(stepNumber: number, value: string, isFreeText: boolean) {
    setIsSubmitting(true)
    setApiError('')

    const payload: { stepNumber: number; input?: string; selectedOption?: string } = {
      stepNumber,
    }
    if (isFreeText) {
      payload.input = value
    } else {
      payload.selectedOption = value
    }

    submitStep.mutate(payload, {
      onSuccess: () => {
        setIsSubmitting(false)
      },
      onError: (err) => {
        setIsSubmitting(false)
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        setApiError(msg || 'Erro ao salvar resposta.')
      },
    })
  }

  function selectOption(value: string) {
    const key = stepKeys[currentStep] ?? `step${currentStep}`
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    // Submit to API (stepNumber is 1-indexed)
    submitStepToApi(currentStep + 1, value, false)

    if (isLastStep) {
      goToSummary(newAnswers)
    } else {
      goNext()
    }
  }

  function handleFreeTextSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!freeText.trim()) return

    const key = stepKeys[currentStep] ?? `step${currentStep}`
    const trimmed = freeText.trim()
    const newAnswers = { ...answers, [key]: trimmed }
    setAnswers(newAnswers)
    setFreeText('')

    // Submit free text to API
    submitStepToApi(currentStep + 1, trimmed, true)

    if (isLastStep) {
      goToSummary(newAnswers)
    } else {
      goNext()
    }
  }

  function goNext() {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep((s) => s + 1)
      setIsTransitioning(false)
    }, 200)
  }

  function goBack() {
    if (currentStep === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep((s) => s - 1)
      setIsTransitioning(false)
    }, 200)
  }

  function goToSummary(finalAnswers: Record<string, string>) {
    setAnswers(finalAnswers)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(steps.length)
      setIsTransitioning(false)
    }, 200)
  }

  function handleComplete() {
    setIsCompleting(true)
    setApiError('')

    completeOnboarding.mutate(undefined, {
      onSuccess: () => {
        setIsCompleting(false)
        onComplete(answers)
      },
      onError: (err) => {
        setIsCompleting(false)
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        setApiError(msg || 'Erro ao finalizar acolhimento.')
      },
    })
  }

  function getLabelFor(stepIndex: number, value: string): string {
    const s = steps[stepIndex]
    if (!s) return value
    const option = s.options.find((o) => o.value === value)
    return option?.label ?? value
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[14px] text-brand-muted dark:text-gray-500">Carregando...</p>
      </div>
    )
  }

  // Summary screen
  if (isSummary) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <p className="text-brand-green-deep font-semibold text-sm uppercase tracking-wide">
            Resumo
          </p>
          <h2 className="mt-2 text-2xl font-bold text-brand-green-deep dark:text-white">
            Confira seus dados
          </h2>
          <p className="mt-2 text-sm font-normal text-brand-muted dark:text-gray-400">
            Revise antes de finalizar. Você pode alterar qualquer resposta.
          </p>

          <div className="mt-8 space-y-1">
            {stepKeys.map((key, i) => {
              const value = answers[key]
              if (!value) return null
              return (
                <div key={key} className="flex items-center justify-between py-3.5 border-b border-brand-cream-dark/50 dark:border-gray-800">
                  <div>
                    <p className="text-[11px] text-brand-muted dark:text-gray-500 uppercase tracking-wider">
                      {steps[i]?.question.replace('?', '').substring(0, 35)}...
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-brand-green-deep dark:text-gray-200">
                      {getLabelFor(i, value)}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(i)}
                    className="text-xs text-brand-green-mid hover:text-brand-green-mid font-semibold shrink-0 ml-4"
                  >
                    Alterar
                  </button>
                </div>
              )
            })}
          </div>

          {apiError && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          <div className="mt-10 space-y-3">
            <button
              onClick={handleComplete}
              disabled={isCompleting || isSubmitting}
              className="w-full py-3.5 font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCompleting ? 'Finalizando...' : 'Confirmar e continuar'}
            </button>
            <button
              onClick={() => onEscalate('Paciente solicitou atendimento humano após resumo')}
              className="w-full py-3 text-sm font-medium text-brand-muted dark:text-gray-500 hover:text-brand-green-deep transition-colors"
            >
              Fale com um consultor via WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!step) return null

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6 pb-4 max-w-xl mx-auto w-full">
        <StepProgress current={currentStep} total={steps.length} />
      </div>

      {/* Step content */}
      <div
        className={`flex-1 flex items-start justify-center px-6 pt-6 pb-12 transition-opacity duration-200 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="max-w-xl w-full">
          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-brand-green-deep dark:text-white leading-snug">
            {step.question}
          </h2>
          {step.subtitle && (
            <p className="mt-2 text-sm font-normal text-brand-muted dark:text-gray-500 leading-relaxed">
              {step.subtitle}
            </p>
          )}

          {apiError && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          {/* Options */}
          <div className={`mt-6 grid gap-2.5 ${step.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {step.options.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={answers[stepKeys[currentStep] ?? ''] === option.value}
                onClick={() => selectOption(option.value)}
              />
            ))}
          </div>

          {/* Free text */}
          {step.allowFreeText && (
            <form onSubmit={handleFreeTextSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={step.freeTextPlaceholder}
                className="flex-1 px-4 py-3 rounded-btn border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-deep focus:ring-1 focus:ring-brand-green-deep transition-colors"
              />
              <button
                type="submit"
                disabled={!freeText.trim() || isSubmitting}
                className="px-5 py-3 rounded-btn bg-brand-green-deep text-white text-sm font-semibold hover:bg-brand-green-mid transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
          )}

          {/* LGPD notice */}
          <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-card bg-surface-card dark:bg-surface-dark-card border border-brand-cream-dark/50 dark:border-gray-800 shadow-soft">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep shrink-0 mt-0.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-xs font-normal text-brand-muted dark:text-gray-500 leading-relaxed">
              <span className="font-semibold text-brand-green-deep dark:text-gray-400">LGPD Protection</span> — Suas informações são protegidas e armazenadas com segurança. Não compartilhamos dados com terceiros.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {currentStep > 0 ? (
              <button
                onClick={goBack}
                className="text-sm text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300 transition-colors font-medium"
              >
                Voltar
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => onEscalate('Paciente solicitou atendimento humano')}
              className="text-xs text-brand-muted/60 dark:text-gray-600 hover:text-brand-green-deep transition-colors"
            >
              Fale com um consultor via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
