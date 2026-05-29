import { lazy, Suspense, useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { DiaryEntryCard } from '@/components/diary/diary-entry-card'
import { FollowUpTimeline } from '@/components/diary/follow-up-timeline'

const NewEntryModal = lazy(() =>
  import('@/components/diary/new-entry-modal').then((m) => ({ default: m.NewEntryModal })),
)
const FollowUpModal = lazy(() =>
  import('@/components/diary/follow-up-modal').then((m) => ({ default: m.FollowUpModal })),
)
import { QuickLogBar } from '@/components/diary/quick-log-bar'
import { useDiaryEntries, useDeleteDiaryEntry, type DiaryEntry, type DiaryFollowUp } from '@/hooks/use-diary'
import { useOnboardingSummary } from '@/hooks/use-onboarding'
import { DiaryInsights } from '@/components/diary/diary-insights'
import { ADMINISTRATION_METHOD_LABELS, SYMPTOM_LABELS, DOSE_UNIT_LABELS, CONDITION_LABELS } from '@/constants/labels'

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
  const [conditionFilter, setConditionFilter] = useState('')
  const [tab, setTab] = useState<'timeline' | 'insights'>('timeline')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [followUpEntry, setFollowUpEntry] = useState<DiaryEntry | null>(null)
  const [editingFollowUp, setEditingFollowUp] = useState<DiaryFollowUp | null>(null)

  const deleteEntry = useDeleteDiaryEntry()
  const { data: onboarding } = useOnboardingSummary()
  const trackedConditions = onboarding?.condition
    ? onboarding.condition
        .split(',')
        .map((c) => CONDITION_LABELS[c.trim()] ?? c.trim())
        .filter(Boolean)
    : []

  const dateFrom = period
    ? new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString()
    : undefined

  const { data, isLoading } = useDiaryEntries({
    page,
    perPage: 20,
    dateFrom,
    administrationMethod: methodFilter || undefined,
    symptomKey: symptomFilter || undefined,
    targetCondition: conditionFilter || undefined,
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
                Diário de Tratamento
              </h1>
              {trackedConditions.length > 0 ? (
                <p className="text-brand-muted dark:text-gray-400 text-sm">
                  Acompanhando{' '}
                  <span className="font-medium text-brand-green-deep dark:text-gray-200">
                    {trackedConditions.join(' · ')}
                  </span>
                </p>
              ) : (
                <p className="text-brand-muted dark:text-gray-400 text-sm">
                  Registre seu uso e acompanhe a evolução dos sintomas.
                </p>
              )}
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

          {/* Tab navigation */}
          <div className="flex gap-1 mb-6 bg-brand-cream/60 dark:bg-surface-dark-card/60 rounded-[10px] p-1 w-fit">
            <button
              onClick={() => setTab('timeline')}
              className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                tab === 'timeline'
                  ? 'bg-brand-white dark:bg-surface-dark text-brand-green-deep dark:text-white shadow-sm'
                  : 'text-brand-muted dark:text-gray-400'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setTab('insights')}
              className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                tab === 'insights'
                  ? 'bg-brand-white dark:bg-surface-dark text-brand-green-deep dark:text-white shadow-sm'
                  : 'text-brand-muted dark:text-gray-400'
              }`}
            >
              Insights
            </button>
          </div>

          {tab === 'insights' ? (
            <DiaryInsights targetCondition={conditionFilter || undefined} />
          ) : (
          <>
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
            {trackedConditions.length > 0 && (
              <select
                value={conditionFilter}
                onChange={(e) => { setConditionFilter(e.target.value); setPage(1) }}
                className="px-3 py-1.5 rounded-[8px] text-xs border border-brand-cream-dark/40 dark:border-gray-700/40 bg-brand-cream dark:bg-surface-dark-card text-brand-muted dark:text-gray-400"
              >
                <option value="">Condição</option>
                {(onboarding?.condition?.split(',').map((c) => c.trim()).filter(Boolean) ?? []).map((key) => (
                  <option key={key} value={key}>{CONDITION_LABELS[key] ?? key}</option>
                ))}
              </select>
            )}
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
                      const followUpCount = entry.followUps.length
                      const entryDateMs = new Date(entry.date).getTime()
                      const hoursSince = (Date.now() - entryDateMs) / (1000 * 60 * 60)
                      // Sugere follow-up depois de 2h sem avaliação E até 72h após o consumo
                      const shouldSuggestFollowUp =
                        followUpCount === 0 && hoursSince >= 2 && hoursSince <= 72
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
                            targetCondition={entry.targetCondition}
                            symptoms={entry.symptoms}
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                          />
                          {/* Sinalização: nenhum follow-up registrado ainda */}
                          {shouldSuggestFollowUp && !isExpanded && (
                            <div className="mt-1 ml-[64px]">
                              <button
                                onClick={() => { setFollowUpEntry(entry); setEditingFollowUp(null) }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/30 text-brand-green-deep dark:text-brand-green-xs hover:bg-brand-green-xs/30 dark:hover:bg-brand-green-deep/50 transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                                Registrar como você está
                              </button>
                            </div>
                          )}
                          {/* Já existe follow-up: mostra contador */}
                          {followUpCount > 0 && !isExpanded && (
                            <div className="mt-1 ml-[64px]">
                              <button
                                onClick={() => setExpandedId(entry.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-cream-dark/40 dark:bg-gray-700/40 text-brand-text-md dark:text-gray-300 hover:bg-brand-cream-dark/70 dark:hover:bg-gray-700/70 transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                {followUpCount} avalia{followUpCount === 1 ? 'ção' : 'ções'}
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
                                  <span className="text-xs text-brand-muted dark:text-gray-500">Sintomas no momento do uso</span>
                                  <div className="mt-1 space-y-1">
                                    {entry.symptoms.map((s) => (
                                      <div key={s.id} className="text-sm text-brand-green-deep dark:text-gray-200">
                                        {s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey}: <span className="font-semibold">{s.severityBefore}</span>
                                        <span className="text-xs text-brand-muted ml-1">/10</span>
                                      </div>
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

                              {/* Timeline de follow-ups */}
                              <FollowUpTimeline
                                entry={entry}
                                onAddFollowUp={() => {
                                  setFollowUpEntry(entry)
                                  setEditingFollowUp(null)
                                }}
                                onEditFollowUp={(f) => {
                                  setFollowUpEntry(entry)
                                  setEditingFollowUp(f)
                                }}
                              />

                              <div className="flex gap-3 pt-2 border-t border-brand-cream-dark/20 dark:border-gray-700/20">
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
          </>
          )}
        </div>
      </main>

      {showNewEntry && (
        <Suspense fallback={null}>
          <NewEntryModal open={showNewEntry} onClose={handleCloseModal} prefill={prefill} />
        </Suspense>
      )}
      {followUpEntry && (
        <Suspense fallback={null}>
          <FollowUpModal
            open={true}
            onClose={() => { setFollowUpEntry(null); setEditingFollowUp(null) }}
            entry={followUpEntry}
            existingFollowUp={editingFollowUp ?? undefined}
          />
        </Suspense>
      )}
    </>
  )
}
