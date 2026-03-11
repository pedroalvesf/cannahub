interface StepProgressProps {
  current: number
  total: number
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
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
  )
}
