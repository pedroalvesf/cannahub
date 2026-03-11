interface OptionCardProps {
  icon?: React.ReactNode
  label: string
  description?: string
  selected?: boolean
  onClick: () => void
}

export function OptionCard({ icon, label, description, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left p-4 rounded-card border transition-all duration-200 shadow-soft ${
        selected
          ? 'border-brand-green-deep bg-brand-green-deep/5 dark:bg-brand-green-deep/10 ring-1 ring-brand-green-deep'
          : 'border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card hover:border-brand-green-deep/40 dark:hover:border-brand-green-deep/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`shrink-0 mt-0.5 ${selected ? 'text-brand-green-deep' : 'text-brand-green-light dark:text-brand-green-light'}`}>
            {icon}
          </div>
        )}
        <div>
          <span className="text-sm font-semibold text-brand-green-deep dark:text-gray-200">{label}</span>
          {description && (
            <span className="block text-xs font-normal text-brand-muted dark:text-gray-500 mt-0.5 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
