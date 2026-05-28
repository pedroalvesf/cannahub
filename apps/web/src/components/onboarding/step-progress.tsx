interface StepProgressProps {
  current: number
  total: number
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div>
      <div
        className="flex items-center justify-between mb-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-brand-green-light dark:text-brand-green-xs">
          Passo {Math.min(current + 1, total)} de {total}
        </span>
        <span className="text-[11px] font-medium text-brand-muted dark:text-gray-500">
          {Math.round(((current + 1) / total) * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < current
                ? 'bg-brand-green-deep flex-[2]'
                : i === current
                  ? 'bg-brand-green-light/30 dark:bg-brand-green-light/20 flex-[2]'
                  : 'bg-brand-cream-dark dark:bg-gray-800 flex-1'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
