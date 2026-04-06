import { SYMPTOM_LABELS } from '@/constants/labels'
import { SeveritySelector } from './severity-selector'

interface SymptomChipProps {
  symptomKey: string
  customName?: string
  severityBefore: string
  onSeverityChange: (value: string) => void
  onRemove?: () => void
}

export function SymptomChip({
  symptomKey,
  customName,
  severityBefore,
  onSeverityChange,
  onRemove,
}: SymptomChipProps) {
  const label = customName ?? SYMPTOM_LABELS[symptomKey] ?? symptomKey

  return (
    <div className="flex items-center gap-3 bg-brand-cream dark:bg-surface-dark-card rounded-[12px] px-3 py-2.5 border border-brand-cream-dark/40 dark:border-gray-700/40">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-brand-green-deep dark:text-gray-200 truncate block">
          {label}
        </span>
      </div>
      <SeveritySelector value={severityBefore} onChange={onSeverityChange} size="sm" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-brand-muted hover:text-red-500 transition-colors"
          aria-label="Remover"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
