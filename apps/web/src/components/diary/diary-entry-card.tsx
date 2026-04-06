import { ADMINISTRATION_METHOD_LABELS, DOSE_UNIT_LABELS, SYMPTOM_LABELS, SYMPTOM_SEVERITY_LABELS } from '@/constants/labels'

interface Symptom {
  id: string
  symptomKey: string
  customSymptomName: string | null
  severityBefore: string
  severityAfter: string | null
}

interface DiaryEntryCardProps {
  time: string
  administrationMethod: string
  customProductName: string | null
  productId: string | null
  doseAmount: number
  doseUnit: string
  notes: string | null
  symptoms: Symptom[]
  onClick?: () => void
}

function SeverityDelta({ before, after }: { before: string; after: string | null }) {
  if (!after) return null

  const levels: Record<string, number> = { none: 0, mild: 1, moderate: 2, severe: 3 }
  const bVal = levels[before] ?? 0
  const aVal = levels[after] ?? 0
  const diff = bVal - aVal

  if (diff > 0) {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    )
  }
  if (diff < 0) {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )
  }
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function DiaryEntryCard({
  time,
  administrationMethod,
  customProductName,
  doseAmount,
  doseUnit,
  notes,
  symptoms,
  onClick,
}: DiaryEntryCardProps) {
  const methodLabel = ADMINISTRATION_METHOD_LABELS[administrationMethod] ?? administrationMethod
  const unitLabel = DOSE_UNIT_LABELS[doseUnit] ?? doseUnit
  const productName = customProductName ?? 'Produto'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-brand-cream/60 dark:bg-surface-dark-card rounded-[14px] border border-brand-cream-dark/30 dark:border-gray-700/30 p-4 hover:shadow-md hover:-translate-y-px transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-[52px] text-center">
          <span className="text-sm font-semibold text-brand-green-deep dark:text-white">{time}</span>
          <div className="text-[10px] text-brand-muted dark:text-gray-500 mt-0.5">{methodLabel}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-sm font-medium text-brand-green-deep dark:text-gray-200 truncate">
              {productName}
            </span>
            <span className="text-xs text-brand-muted dark:text-gray-500 flex-shrink-0">
              {doseAmount} {unitLabel}
            </span>
          </div>

          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {symptoms.map((s) => {
                const label = s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey
                const beforeLabel = SYMPTOM_SEVERITY_LABELS[s.severityBefore] ?? s.severityBefore
                const afterLabel = s.severityAfter ? (SYMPTOM_SEVERITY_LABELS[s.severityAfter] ?? s.severityAfter) : null
                return (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-brand-green-pale/60 dark:bg-gray-700/40 text-brand-text-md dark:text-gray-300"
                  >
                    {label}: {beforeLabel}
                    {afterLabel && (
                      <>
                        <span className="text-brand-muted">→</span>
                        {afterLabel}
                        <SeverityDelta before={s.severityBefore} after={s.severityAfter} />
                      </>
                    )}
                  </span>
                )
              })}
            </div>
          )}

          {notes && (
            <p className="text-xs text-brand-muted dark:text-gray-500 truncate">{notes}</p>
          )}
        </div>
      </div>
    </button>
  )
}
