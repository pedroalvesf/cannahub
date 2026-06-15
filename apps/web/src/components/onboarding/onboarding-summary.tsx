import { getLabelFor, type StepConfig } from './onboarding-steps'

interface OnboardingSummaryProps {
  steps: StepConfig[]
  answers: Record<string, string>
  apiError?: string
  isCompleting: boolean
  isSubmitting: boolean
  onEditStep: (index: number) => void
  onConfirm: () => void
  onEscalate: () => void
}

export function OnboardingSummary({
  steps,
  answers,
  apiError,
  isCompleting,
  isSubmitting,
  onEditStep,
  onConfirm,
  onEscalate,
}: OnboardingSummaryProps) {
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
          {steps.map((stepConfig, i) => {
            const value = answers[stepConfig.key]
            if (!value) return null
            return (
              <div
                key={stepConfig.key}
                className="flex items-center justify-between py-3.5 border-b border-brand-cream-dark/50 dark:border-gray-800"
              >
                <div>
                  <p className="text-[11px] text-brand-muted dark:text-gray-500 uppercase tracking-wider">
                    {stepConfig.question.replace('?', '').substring(0, 35)}...
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-brand-green-deep dark:text-gray-200">
                    {getLabelFor(stepConfig, value)}
                  </p>
                </div>
                <button
                  onClick={() => onEditStep(i)}
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
            onClick={onConfirm}
            disabled={isCompleting || isSubmitting}
            className="w-full py-3.5 font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCompleting ? 'Finalizando...' : 'Confirmar e continuar'}
          </button>
          <button
            onClick={onEscalate}
            className="w-full py-3 text-sm font-medium text-brand-muted dark:text-gray-500 hover:text-brand-green-deep transition-colors"
          >
            Fale com um consultor via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
