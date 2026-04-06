import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { NewEntryModal } from '@/components/diary/new-entry-modal'
import { DiaryEntryCard } from '@/components/diary/diary-entry-card'
import { useDiaryEntries } from '@/hooks/use-diary'

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const day = date.getUTCDate()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const month = months[date.getUTCMonth()] ?? ''
  const year = date.getUTCFullYear()

  const isoDate = dateStr.split('T')[0] ?? dateStr
  const todayIso = today.toISOString().split('T')[0]
  const yesterdayIso = yesterday.toISOString().split('T')[0]

  if (isoDate === todayIso) return `Hoje, ${day.toString().padStart(2, '0')} ${month}`
  if (isoDate === yesterdayIso) return `Ontem, ${day.toString().padStart(2, '0')} ${month}`
  return `${day.toString().padStart(2, '0')} ${month} ${year}`
}

export function DiaryPage() {
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useDiaryEntries({ page, perPage: 20 })

  const groupedEntries = useMemo(() => {
    if (!data?.entries) return []
    const groups = new Map<string, typeof data.entries>()
    for (const entry of data.entries) {
      const dateKey = (typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString()).split('T')[0] ?? ''
      const existing = groups.get(dateKey) ?? []
      existing.push(entry)
      groups.set(dateKey, existing)
    }
    return [...groups.entries()].map(([date, entries]) => ({ date, entries }))
  }, [data?.entries])

  const hasMore = data ? page * 20 < data.total : false

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-white dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl text-brand-green-deep dark:text-white mb-1">
                Diario de Tratamento
              </h1>
              <p className="text-brand-muted dark:text-gray-400 text-sm">
                Registre seu uso e acompanhe a evolucao dos sintomas.
              </p>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-brand-green-deep hover:bg-brand-green-mid text-white font-semibold text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo registro
            </button>
          </div>

          {/* Timeline */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-brand-green-light border-t-transparent rounded-full animate-spin" />
            </div>
          ) : groupedEntries.length === 0 ? (
            <div className="text-center py-16">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-cream-dark dark:text-gray-600 mb-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-brand-muted dark:text-gray-400 text-base mb-4">
                Comece registrando seu primeiro uso
              </p>
              <button
                onClick={() => setShowNewEntry(true)}
                className="text-sm font-medium text-brand-green-light hover:underline"
              >
                Criar primeiro registro
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedEntries.map((group) => (
                <div key={group.date}>
                  <h3 className="text-sm font-semibold text-brand-muted dark:text-gray-400 mb-3 uppercase tracking-wide">
                    {formatDateHeader(group.date)}
                  </h3>
                  <div className="space-y-3">
                    {group.entries.map((entry) => (
                      <DiaryEntryCard
                        key={entry.id}
                        time={entry.time}
                        administrationMethod={entry.administrationMethod}
                        customProductName={entry.customProductName}
                        productId={entry.productId}
                        doseAmount={entry.doseAmount}
                        doseUnit={entry.doseUnit}
                        notes={entry.notes}
                        symptoms={entry.symptoms}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sm font-medium text-brand-green-light hover:underline"
                  >
                    Carregar mais
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <NewEntryModal open={showNewEntry} onClose={() => setShowNewEntry(false)} />
    </>
  )
}
