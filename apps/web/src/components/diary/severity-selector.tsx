import { SYMPTOM_SEVERITY_LABELS } from '@/constants/labels'

const LEVELS = [
  { value: 'none', color: 'bg-gray-300 dark:bg-gray-600', ring: 'ring-gray-400' },
  { value: 'mild', color: 'bg-yellow-400', ring: 'ring-yellow-500' },
  { value: 'moderate', color: 'bg-orange-400', ring: 'ring-orange-500' },
  { value: 'severe', color: 'bg-red-500', ring: 'ring-red-600' },
] as const

interface SeveritySelectorProps {
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

export function SeveritySelector({ value, onChange, size = 'md' }: SeveritySelectorProps) {
  const circleSize = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'

  return (
    <div className="flex items-center gap-2">
      {LEVELS.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`${circleSize} rounded-full ${level.color} transition-all ${
            value === level.value ? `ring-2 ${level.ring} ring-offset-2 dark:ring-offset-surface-dark scale-110` : 'opacity-50 hover:opacity-75'
          }`}
          title={SYMPTOM_SEVERITY_LABELS[level.value] ?? level.value}
          aria-label={SYMPTOM_SEVERITY_LABELS[level.value] ?? level.value}
        />
      ))}
      {size === 'md' && (
        <span className="text-xs text-brand-muted dark:text-gray-400 ml-1">
          {SYMPTOM_SEVERITY_LABELS[value] ?? ''}
        </span>
      )}
    </div>
  )
}
