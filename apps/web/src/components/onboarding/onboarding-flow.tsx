import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepProgress } from './step-progress'
import { OnboardingQuestion } from './onboarding-question'
import { OnboardingSummary } from './onboarding-summary'
import { getVisibleSteps } from './onboarding-steps'
import {
  useOnboardingSummary,
  useStartOnboarding,
  useSubmitStep,
  useCompleteOnboarding,
} from '@/hooks/use-onboarding'

interface OnboardingFlowProps {
  onComplete: (data: Record<string, string>) => void
  onEscalate: (reason: string) => void
}

function extractApiMessage(err: unknown): string | undefined {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message
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

  const { data: existingSession, isLoading: summaryLoading } = useOnboardingSummary()
  const startOnboarding = useStartOnboarding()
  const submitStep = useSubmitStep()
  const completeOnboarding = useCompleteOnboarding()

  useEffect(() => {
    if (initialized.current) return
    if (summaryLoading) return

    initialized.current = true

    if (
      existingSession &&
      (existingSession.status === 'completed' || existingSession.status === 'awaiting_prescription')
    ) {
      navigate('/painel', { replace: true })
      return
    }

    if (existingSession && existingSession.status === 'in_progress') {
      const restored: Record<string, string> = {}
      if (existingSession.condition) restored.condition = existingSession.condition
      if (existingSession.experience) restored.experience = existingSession.experience
      if (existingSession.currentAccessMethod) restored.currentAccessMethod = existingSession.currentAccessMethod
      if (existingSession.hasPrescription !== undefined) {
        restored.prescription = existingSession.hasPrescription ? 'yes' : 'no'
      }
      if (existingSession.preferredForm) restored.preferredForm = existingSession.preferredForm
      if (existingSession.assistedAccess !== undefined) {
        restored.assistedAccess = existingSession.assistedAccess ? 'yes' : 'no'
      }
      setAnswers(restored)

      const restoredVisibleSteps = getVisibleSteps(restored)
      const firstUnansweredIndex = restoredVisibleSteps.findIndex((s) => !restored[s.key])
      const resumeStep = firstUnansweredIndex === -1 ? restoredVisibleSteps.length : firstUnansweredIndex
      setCurrentStep(resumeStep)
      setIsLoading(false)
      return
    }

    startOnboarding.mutate(undefined, {
      onSuccess: () => setIsLoading(false),
      onError: (err) => {
        const msg = extractApiMessage(err)
        if (msg?.includes('already') || msg?.includes('exists')) {
          setIsLoading(false)
          return
        }
        setApiError(msg || 'Erro ao iniciar acolhimento.')
        setIsLoading(false)
      },
    })
  }, [existingSession, summaryLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSteps = getVisibleSteps(answers)
  const step = visibleSteps[currentStep]
  const isSummary = currentStep >= visibleSteps.length

  const submitStepToApi = useCallback(
    (stepNumber: number, value: string, isFreeText: boolean) => {
      setIsSubmitting(true)
      setApiError('')

      const payload: { stepNumber: number; input?: string; selectedOption?: string } = { stepNumber }
      if (isFreeText) payload.input = value
      else payload.selectedOption = value

      submitStep.mutate(payload, {
        onSuccess: () => setIsSubmitting(false),
        onError: (err) => {
          setIsSubmitting(false)
          setApiError(extractApiMessage(err) || 'Erro ao salvar resposta.')
        },
      })
    },
    [submitStep],
  )

  const transitionTo = useCallback((nextStepIndex: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(nextStepIndex)
      setIsTransitioning(false)
    }, 200)
  }, [])

  const advanceOrSummarize = useCallback(
    (nextAnswers: Record<string, string>) => {
      const nextVisibleSteps = getVisibleSteps(nextAnswers)
      const isNowLastStep = currentStep === nextVisibleSteps.length - 1
      if (isNowLastStep) {
        setAnswers(nextAnswers)
        transitionTo(nextVisibleSteps.length)
      } else {
        transitionTo(currentStep + 1)
      }
    },
    [currentStep, transitionTo],
  )

  const handleSelectOption = useCallback(
    (value: string) => {
      if (!step) return
      const newAnswers = { ...answers, [step.key]: value }
      setAnswers(newAnswers)
      submitStepToApi(step.backendStepNumber, value, false)
      advanceOrSummarize(newAnswers)
    },
    [step, answers, submitStepToApi, advanceOrSummarize],
  )

  const handleToggleMultiOption = useCallback(
    (value: string) => {
      if (!step) return
      const current = answers[step.key] ?? ''
      const selected = current ? current.split(',') : []
      const idx = selected.indexOf(value)
      if (idx >= 0) selected.splice(idx, 1)
      else selected.push(value)
      setAnswers({ ...answers, [step.key]: selected.join(',') })
    },
    [step, answers],
  )

  const handleConfirmMultiSelect = useCallback(() => {
    if (!step) return
    const value = answers[step.key]
    if (!value) return
    submitStepToApi(step.backendStepNumber, value, false)
    advanceOrSummarize(answers)
  }, [step, answers, submitStepToApi, advanceOrSummarize])

  const handleFreeTextSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!step) return
      const trimmed = freeText.trim()
      if (!trimmed) return
      const newAnswers = { ...answers, [step.key]: trimmed }
      setAnswers(newAnswers)
      setFreeText('')
      submitStepToApi(step.backendStepNumber, trimmed, true)
      advanceOrSummarize(newAnswers)
    },
    [step, freeText, answers, submitStepToApi, advanceOrSummarize],
  )

  const handleBack = useCallback(() => {
    if (currentStep === 0) return
    transitionTo(currentStep - 1)
  }, [currentStep, transitionTo])

  const handleEscalateFromQuestion = useCallback(
    () => onEscalate('Paciente solicitou atendimento humano'),
    [onEscalate],
  )

  const handleEscalateFromSummary = useCallback(
    () => onEscalate('Paciente solicitou atendimento humano após resumo'),
    [onEscalate],
  )

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
        setApiError(extractApiMessage(err) || 'Erro ao finalizar acolhimento.')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[14px] text-brand-muted dark:text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (isSummary) {
    return (
      <OnboardingSummary
        steps={visibleSteps}
        answers={answers}
        apiError={apiError}
        isCompleting={isCompleting}
        isSubmitting={isSubmitting}
        onEditStep={setCurrentStep}
        onConfirm={handleComplete}
        onEscalate={handleEscalateFromSummary}
      />
    )
  }

  if (!step) return null

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 pt-6 pb-4 max-w-xl mx-auto w-full">
        <StepProgress current={currentStep} total={visibleSteps.length} />
      </div>

      <div
        className={`flex-1 flex items-start justify-center px-6 pt-6 pb-12 transition-opacity duration-200 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <OnboardingQuestion
          step={step}
          answer={answers[step.key]}
          freeText={freeText}
          apiError={apiError}
          isSubmitting={isSubmitting}
          isFirstStep={currentStep === 0}
          onSelectOption={handleSelectOption}
          onToggleMultiOption={handleToggleMultiOption}
          onConfirmMultiSelect={handleConfirmMultiSelect}
          onFreeTextChange={setFreeText}
          onFreeTextSubmit={handleFreeTextSubmit}
          onBack={handleBack}
          onEscalate={handleEscalateFromQuestion}
        />
      </div>
    </div>
  )
}
