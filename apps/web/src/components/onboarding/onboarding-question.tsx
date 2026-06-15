import { memo, useMemo, type FormEvent } from 'react'
import { OptionCard } from './option-card'
import type { StepConfig } from './onboarding-steps'

interface OnboardingQuestionProps {
  step: StepConfig
  answer: string | undefined
  freeText: string
  apiError?: string
  isSubmitting: boolean
  isFirstStep: boolean
  onSelectOption: (value: string) => void
  onToggleMultiOption: (value: string) => void
  onConfirmMultiSelect: () => void
  onFreeTextChange: (value: string) => void
  onFreeTextSubmit: (e: FormEvent) => void
  onBack: () => void
  onEscalate: () => void
}

function OnboardingQuestionImpl({
  step,
  answer,
  freeText,
  apiError,
  isSubmitting,
  isFirstStep,
  onSelectOption,
  onToggleMultiOption,
  onConfirmMultiSelect,
  onFreeTextChange,
  onFreeTextSubmit,
  onBack,
  onEscalate,
}: OnboardingQuestionProps) {
  const selectedValues = useMemo(
    () => (step.multiSelect ? (answer ?? '').split(',').filter(Boolean) : []),
    [step.multiSelect, answer],
  )

  return (
    <div className="max-w-xl w-full">
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

      <div className={`mt-6 grid gap-2.5 ${step.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {step.options.map((option) => {
          const isSelected = step.multiSelect
            ? selectedValues.includes(option.value)
            : answer === option.value
          return (
            <OptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={isSelected}
              onClick={() =>
                step.multiSelect ? onToggleMultiOption(option.value) : onSelectOption(option.value)
              }
            />
          )
        })}
      </div>

      {step.multiSelect && (
        <button
          onClick={onConfirmMultiSelect}
          disabled={!answer || isSubmitting}
          className="mt-4 w-full py-3.5 font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      )}

      {step.infoBox && (
        <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-card bg-brand-green-pale/30 dark:bg-brand-green-deep/10 border border-brand-green-pale dark:border-brand-green-deep/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-brand-green-deep dark:text-brand-green-light">{step.infoBox.title}</p>
            <p className="mt-0.5 text-xs text-brand-muted dark:text-gray-500 leading-relaxed">{step.infoBox.text}</p>
          </div>
        </div>
      )}

      {step.allowFreeText && (
        <form onSubmit={onFreeTextSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={freeText}
            onChange={(e) => onFreeTextChange(e.target.value)}
            placeholder={step.freeTextPlaceholder}
            aria-label={step.freeTextPlaceholder ?? 'Resposta livre'}
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

      <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-card bg-surface-card dark:bg-surface-dark-card border border-brand-cream-dark/50 dark:border-gray-800 shadow-soft">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep shrink-0 mt-0.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-xs font-normal text-brand-muted dark:text-gray-500 leading-relaxed">
          <span className="font-semibold text-brand-green-deep dark:text-gray-400">LGPD Protection</span> — Suas informações são protegidas e armazenadas com segurança. Não compartilhamos dados com terceiros.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {!isFirstStep ? (
          <button
            onClick={onBack}
            className="text-sm text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300 transition-colors font-medium"
          >
            Voltar
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onEscalate}
          className="text-xs text-brand-muted/60 dark:text-gray-600 hover:text-brand-green-deep transition-colors"
        >
          Fale com um consultor via WhatsApp
        </button>
      </div>
    </div>
  )
}

export const OnboardingQuestion = memo(OnboardingQuestionImpl)
