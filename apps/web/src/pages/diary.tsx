import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { NewEntryModal } from '@/components/diary/new-entry-modal'
import { DiaryEntryCard } from '@/components/diary/diary-entry-card'
import { ReEvaluationModal } from '@/components/diary/re-evaluation-modal'
import { QuickLogBar } from '@/components/diary/quick-log-bar'
import { useDiaryEntries, useDeleteDiaryEntry } from '@/hooks/use-diary'
import { ADMINISTRATION_METHOD_LABELS, SYMPTOM_LABELS, SYMPTOM_SEVERITY_LABELS, DOSE_UNIT_LABELS, EFFECT_LABELS } from '@/constants/labels'

const PERIOD_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
] as const

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
  const [prefill, setPrefill] = useState<any>(undefined)
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState<number | null>(null)
  const [methodFilter, setMethodFilter] = useState('')
  const [symptomFilter, setSymptomFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reEvalEntry, setReEvalEntry] = useState<{ id: string; symptoms: any[] } | null>(null)

  const deleteEntry = useDeleteDiaryEntry()

  const dateFrom = period
    ? new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString()
    : undefined

  const { data, isLoading } = useDiaryEntries({
    page,
    perPage: 20,
    dateFrom,
    administrationMethod: methodFilter || undefined,
    symptomKey: symptomFilter || undefined,
  })

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

  function handleLogFromFavorite(fav: any) {
    setPrefill(fav)
    setShowNewEntry(true)
  }

  function handleCloseModal() {
    setShowNewEntry(false)
    setPrefill(undefined)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-white dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
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

          {/* Quick-log bar */}
          <QuickLogBar onLogFromFavorite={handleLogFromFavorite} />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => { setPeriod(period === opt.days ? null : opt.days); setPage(1) }}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-colors ${
                  period === opt.days
                    ? 'bg-brand-green-deep text-white border-brand-green-deep'
                    : 'bg-brand-cream dark:bg-surface-dark-card border-brand-cream-dark/40 dark:border-gray-700/40 text-brand-muted dark:text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1) }}
              className="px-3 py-1.5 rounded-[8px] text-xs border border-brand-cream-dark/40 dark:border-gray-700/40 bg-brand-cream dark:bg-surface-dark-card text-brand-muted dark:text-gray-400"
            >
              <option value="">Metodo</option>
              {Object.entries(ADMINISTRATION_METHOD_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={symptomFilter}
              onChange={(e) => { setSymptomFilter(e.target.value); setPage(1) }}
              className="px-3 py-1.5 rounded-[8px] text-xs border border-brand-cream-dark/40 dark:border-gray-700/40 bg-brand-cream dark:bg-surface-dark-card text-brand-muted dark:text-gray-400"
            >
              <option value="">Sintoma</option>
              {Object.entries(SYMPTOM_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
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
                    {group.entries.map((entry) => {
                      const isExpanded = expandedId === entry.id
                      const hasPendingReEval = entry.symptoms.some((s) => !s.severityAfter)
                      return (
                        <div key={entry.id}>
                          <DiaryEntryCard
                            time={entry.time}
                            administrationMethod={entry.administrationMethod}
                            customProductName={entry.customProductName}
                            productId={entry.productId}
                            doseAmount={entry.doseAmount}
                            doseUnit={entry.doseUnit}
                            notes={entry.notes}
                            symptoms={entry.symptoms}
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                          />
                          {/* Pending re-evaluation badge */}
                          {hasPendingReEval && !isExpanded && (
                            <div className="mt-1 ml-[64px]">
                              <button
                                onClick={() => setReEvalEntry({ id: entry.id, symptoms: entry.symptoms })}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="8" x2="12" y2="12" />
                                  <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                Como estou agora?
                              </button>
                            </div>
                          )}
                          {/* Expanded detail */}
                          {isExpanded && (
                            <div className="mt-2 ml-[64px] p-4 bg-brand-white dark:bg-surface-dark rounded-[12px] border border-brand-cream-dark/30 dark:border-gray-700/30 space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Metodo</span>
                                  <p className="text-brand-green-deep dark:text-gray-200">{ADMINISTRATION_METHOD_LABELS[entry.administrationMethod] ?? entry.administrationMethod}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Dose</span>
                                  <p className="text-brand-green-deep dark:text-gray-200">{entry.doseAmount} {DOSE_UNIT_LABELS[entry.doseUnit] ?? entry.doseUnit}</p>
                                </div>
                              </div>
                              {entry.symptoms.length > 0 && (
                                <div>
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Sintomas</span>
                                  <div className="mt-1 space-y-1">
                                    {entry.symptoms.map((s) => (
                                      <div key={s.id} className="text-sm text-brand-green-deep dark:text-gray-200">
                                        {s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey}: {SYMPTOM_SEVERITY_LABELS[s.severityBefore] ?? s.severityBefore}
                                        {s.severityAfter && ` → ${SYMPTOM_SEVERITY_LABELS[s.severityAfter] ?? s.severityAfter}`}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {entry.effects.length > 0 && (
                                <div>
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Efeitos</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {entry.effects.map((ef) => (
                                      <span key={ef.id} className={`text-xs px-2 py-0.5 rounded-full ${ef.isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {ef.customEffectName ?? EFFECT_LABELS[ef.effectKey] ?? ef.effectKey}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {entry.notes && (
                                <div>
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Notas</span>
                                  <p className="text-sm text-brand-green-deep dark:text-gray-200 mt-1">{entry.notes}</p>
                                </div>
                              )}
                              <div className="flex gap-3 pt-2 border-t border-brand-cream-dark/20 dark:border-gray-700/20">
                                {hasPendingReEval && (
                                  <button
                                    onClick={() => setReEvalEntry({ id: entry.id, symptoms: entry.symptoms })}
                                    className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                                  >
                                    Re-avaliar sintomas
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (confirm('Excluir este registro?')) {
                                      deleteEntry.mutate(entry.id)
                                      setExpandedId(null)
                                    }
                                  }}
                                  className="text-xs font-medium text-red-500 hover:underline ml-auto"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
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

      <NewEntryModal open={showNewEntry} onClose={handleCloseModal} prefill={prefill} />
      {reEvalEntry && (
        <ReEvaluationModal
          open={true}
          onClose={() => setReEvalEntry(null)}
          entryId={reEvalEntry.id}
          symptoms={reEvalEntry.symptoms}
        />
      )}
    </>
  )
}
