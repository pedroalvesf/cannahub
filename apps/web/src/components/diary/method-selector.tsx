import { ADMINISTRATION_METHOD_LABELS } from '@/constants/labels'

const METHODS = [
  {
    value: 'oil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    value: 'flower',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5a4.5 4.5 0 1 0-4.5 4.5M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 0 4.5-4.5M12 16.5V15m4.5-3H15" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 22v-6" />
      </svg>
    ),
  },
  {
    value: 'vape',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
  },
  {
    value: 'edible',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    value: 'topical',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 16" />
      </svg>
    ),
  },
  {
    value: 'capsule',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 1.5 8 8a4.95 4.95 0 1 1-7 7l-8-8a4.95 4.95 0 1 1 7-7Z" />
        <path d="m8.5 8.5 7 7" />
      </svg>
    ),
  },
  {
    value: 'other',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
] as const

interface MethodSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {METHODS.map((method) => (
        <button
          key={method.value}
          type="button"
          onClick={() => onChange(method.value)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-[10px] border text-sm font-medium transition-all ${
            value === method.value
              ? 'bg-brand-green-deep text-white border-brand-green-deep'
              : 'bg-brand-cream dark:bg-surface-dark-card border-brand-cream-dark/40 dark:border-gray-700/40 text-brand-green-deep dark:text-gray-300 hover:border-brand-green-light/50'
          }`}
        >
          {method.icon}
          {ADMINISTRATION_METHOD_LABELS[method.value] ?? method.value}
        </button>
      ))}
    </div>
  )
}
