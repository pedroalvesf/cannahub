import { EFFECT_LABELS } from '@/constants/labels'

interface EffectChipProps {
  effectKey: string
  isPositive: boolean
  customName?: string
  selected: boolean
  onToggle: () => void
}

export function EffectChip({
  effectKey,
  isPositive,
  customName,
  selected,
  onToggle,
}: EffectChipProps) {
  const label = customName ?? EFFECT_LABELS[effectKey] ?? effectKey
  const positiveClasses = selected
    ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
    : 'bg-brand-cream dark:bg-surface-dark-card border-brand-cream-dark/40 dark:border-gray-700/40 text-brand-muted dark:text-gray-400'
  const negativeClasses = selected
    ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
    : 'bg-brand-cream dark:bg-surface-dark-card border-brand-cream-dark/40 dark:border-gray-700/40 text-brand-muted dark:text-gray-400'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border text-sm font-medium transition-all hover:scale-[1.02] ${
        isPositive ? positiveClasses : negativeClasses
      }`}
    >
      {isPositive ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {label}
    </button>
  )
}
