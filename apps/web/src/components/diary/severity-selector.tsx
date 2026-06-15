import { SEVERITY_MAX, SEVERITY_MIN } from '@cannahub/shared'

interface SeveritySelectorProps {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'md'
}

const LEVELS = Array.from({ length: SEVERITY_MAX - SEVERITY_MIN + 1 }, (_, i) => SEVERITY_MIN + i)

function describe(score: number): string {
  if (score === 0) return 'Nenhuma'
  if (score <= 3) return 'Leve'
  if (score <= 6) return 'Moderada'
  if (score <= 8) return 'Forte'
  return 'Pior possível'
}

// Verde gradiente — 0 = pale, 10 = deep — mantém marca, sem alarme vermelho.
function intensity(score: number): string {
  const ratio = score / SEVERITY_MAX
  if (ratio === 0) return 'bg-brand-cream-dark/60 dark:bg-gray-700/60 text-brand-muted dark:text-gray-400'
  if (ratio <= 0.3) return 'bg-brand-green-pale dark:bg-brand-green-mid/30 text-brand-green-deep dark:text-brand-green-xs'
  if (ratio <= 0.6) return 'bg-brand-green-xs dark:bg-brand-green-light/40 text-brand-green-deep dark:text-white'
  if (ratio <= 0.8) return 'bg-brand-green-light dark:bg-brand-green-light text-white'
  return 'bg-brand-green-deep dark:bg-brand-green-deep text-white'
}

export function SeveritySelector({ value, onChange, size = 'md' }: SeveritySelectorProps) {
  const safeValue = Math.min(Math.max(value ?? 0, SEVERITY_MIN), SEVERITY_MAX)
  const buttonSize = size === 'sm' ? 'min-w-[22px] h-[22px] text-[11px]' : 'min-w-[28px] h-[28px] text-[12px]'
  const containerGap = size === 'sm' ? 'gap-[3px]' : 'gap-1'

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="radiogroup"
        aria-label="Intensidade (0 a 10)"
        className={`flex items-center ${containerGap}`}
      >
        {LEVELS.map((n) => {
          const selected = n === safeValue
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${n} — ${describe(n)}`}
              onClick={() => onChange(n)}
              className={`${buttonSize} px-1 rounded-[6px] font-semibold transition-all ${
                selected
                  ? `${intensity(n)} ring-2 ring-brand-green-deep dark:ring-brand-green-light ring-offset-1 ring-offset-brand-off dark:ring-offset-surface-dark scale-[1.08]`
                  : 'bg-transparent border border-brand-cream-dark/60 dark:border-gray-700/50 text-brand-muted dark:text-gray-500 hover:border-brand-green-light hover:text-brand-green-deep dark:hover:text-brand-green-xs'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      {size === 'md' && (
        <div className="flex items-center justify-between text-[10.5px] text-brand-muted dark:text-gray-500 uppercase tracking-[0.06em]">
          <span>Nenhuma</span>
          <span className="text-brand-green-deep dark:text-brand-green-xs font-medium normal-case tracking-normal">
            {safeValue} — {describe(safeValue)}
          </span>
          <span>Pior possível</span>
        </div>
      )}
    </div>
  )
}
