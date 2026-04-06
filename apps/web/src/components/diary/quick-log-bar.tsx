import { ADMINISTRATION_METHOD_LABELS, DOSE_UNIT_LABELS } from '@/constants/labels'
import { useDiaryFavorites, useDeleteDiaryFavorite } from '@/hooks/use-diary'
import { useState } from 'react'

interface QuickLogBarProps {
  onLogFromFavorite: (favorite: {
    customProductName?: string
    productId?: string
    administrationMethod: string
    doseAmount: number
    doseUnit: string
    symptomKeys: string[]
  }) => void
}

export function QuickLogBar({ onLogFromFavorite }: QuickLogBarProps) {
  const { data } = useDiaryFavorites()
  const deleteFavorite = useDeleteDiaryFavorite()
  const [showManage, setShowManage] = useState(false)

  const favorites = data?.favorites ?? []

  if (favorites.length === 0) {
    return (
      <div className="mb-6 px-4 py-3 bg-brand-cream/40 dark:bg-surface-dark-card/40 rounded-[12px] border border-brand-cream-dark/20 dark:border-gray-700/20">
        <p className="text-xs text-brand-muted dark:text-gray-500 text-center">
          Salve um registro como favorito para acesso rapido
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-brand-muted dark:text-gray-400 uppercase tracking-wide">
          Acesso rapido
        </h3>
        <button
          onClick={() => setShowManage(!showManage)}
          className="text-brand-muted hover:text-brand-green-deep dark:text-gray-500 dark:hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {favorites.map((fav) => {
          const methodLabel = ADMINISTRATION_METHOD_LABELS[fav.administrationMethod] ?? fav.administrationMethod
          const unitLabel = DOSE_UNIT_LABELS[fav.doseUnit] ?? fav.doseUnit
          return (
            <div key={fav.id} className="flex-shrink-0 relative">
              <button
                type="button"
                onClick={() =>
                  onLogFromFavorite({
                    customProductName: fav.customProductName ?? undefined,
                    productId: fav.productId ?? undefined,
                    administrationMethod: fav.administrationMethod,
                    doseAmount: fav.doseAmount,
                    doseUnit: fav.doseUnit,
                    symptomKeys: fav.symptomKeys,
                  })
                }
                className="px-4 py-2.5 rounded-[12px] bg-brand-cream dark:bg-surface-dark-card border border-brand-cream-dark/30 dark:border-gray-700/30 hover:shadow-md hover:-translate-y-px transition-all text-left"
              >
                <div className="text-xs font-semibold text-brand-green-deep dark:text-gray-200 truncate max-w-[120px]">
                  {fav.name}
                </div>
                <div className="text-[10px] text-brand-muted dark:text-gray-500 mt-0.5">
                  {methodLabel} · {fav.doseAmount} {unitLabel}
                </div>
              </button>
              {showManage && (
                <button
                  onClick={() => deleteFavorite.mutate(fav.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
