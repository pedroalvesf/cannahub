import { useMemo } from 'react'
import { SYMPTOM_LABELS, EFFECT_LABELS } from '@/constants/labels'
import { useDeleteDiaryFollowUp, type DiaryEntry, type DiaryFollowUp } from '@/hooks/use-diary'
import { getTagsForCondition } from './follow-up-tags'

interface FollowUpTimelineProps {
  entry: DiaryEntry
  onAddFollowUp: () => void
  onEditFollowUp: (followUp: DiaryFollowUp) => void
}

function relativeFromTake(takenAt: Date, evaluatedAt: Date): string {
  const diffMs = evaluatedAt.getTime() - takenAt.getTime()
  if (diffMs < 0) return 'antes do uso'
  const totalMinutes = Math.round(diffMs / 60000)
  if (totalMinutes < 60) return `${totalMinutes} min após`
  const hours = Math.floor(totalMinutes / 60)
  if (hours < 24) return `${hours}h após`
  const days = Math.floor(hours / 24)
  return `${days}d após`
}

export function FollowUpTimeline({ entry, onAddFollowUp, onEditFollowUp }: FollowUpTimelineProps) {
  const deleteFollowUp = useDeleteDiaryFollowUp()
  const takenAt = new Date(entry.date)

  const symptomLabelById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of entry.symptoms) {
      map[s.id] = s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey
    }
    return map
  }, [entry.symptoms])

  const tagLabelByKey = useMemo(() => {
    const tags = getTagsForCondition(entry.targetCondition)
    const map: Record<string, string> = {}
    for (const t of tags) map[t.key] = t.label
    return map
  }, [entry.targetCondition])

  const sorted = [...entry.followUps].sort(
    (a, b) => new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime(),
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-brand-muted dark:text-gray-500">
          Avaliações pós-uso ({sorted.length})
        </span>
        <button
          type="button"
          onClick={onAddFollowUp}
          className="text-xs font-medium text-brand-green-deep dark:text-brand-green-light hover:underline"
        >
          + Adicionar avaliação
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-brand-muted dark:text-gray-500 italic">
          Nenhuma avaliação registrada. Quando você sentir o efeito (ou no dia seguinte, no caso de sono),
          registre como está se sentindo.
        </p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((f) => {
            const evaluatedAt = new Date(f.evaluatedAt)
            return (
              <li
                key={f.id}
                className="bg-brand-cream/40 dark:bg-surface-dark-card/60 rounded-[10px] border border-brand-cream-dark/40 dark:border-gray-700/40 p-3"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="text-[13px] font-semibold text-brand-green-deep dark:text-gray-200">
                      {evaluatedAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="text-[11px] text-brand-muted dark:text-gray-500 ml-2">
                      {relativeFromTake(takenAt, evaluatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditFollowUp(f)}
                      className="text-[11px] text-brand-green-deep dark:text-brand-green-light hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Excluir esta avaliação?')) {
                          deleteFollowUp.mutate(f.id)
                        }
                      }}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {/* Severidades pós-uso por sintoma */}
                {f.symptomAssessments.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-brand-text-md dark:text-gray-300 mb-1.5">
                    {f.symptomAssessments.map((a) => {
                      const before = entry.symptoms.find((s) => s.id === a.symptomLogId)?.severityBefore
                      const label = symptomLabelById[a.symptomLogId] ?? a.symptomLogId
                      const delta = before !== undefined ? before - a.severityAfter : null
                      return (
                        <span key={a.id} className="inline-flex items-center gap-1">
                          {label}: <span className="font-semibold">{before ?? '—'}</span>
                          <span className="text-brand-muted">→</span>
                          <span className="font-semibold">{a.severityAfter}</span>
                          {delta !== null && delta > 0 && (
                            <span className="text-green-600 dark:text-green-400 text-[10px]">↓{delta}</span>
                          )}
                          {delta !== null && delta < 0 && (
                            <span className="text-red-500 text-[10px]">↑{Math.abs(delta)}</span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Tags */}
                {f.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-brand-green-pale/60 dark:bg-brand-green-deep/30 text-brand-green-deep dark:text-brand-green-xs"
                      >
                        {tagLabelByKey[t] ?? t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Efeitos */}
                {f.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {f.effects.map((ef) => (
                      <span
                        key={ef.id}
                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                          ef.isPositive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {ef.customEffectName ?? EFFECT_LABELS[ef.effectKey] ?? ef.effectKey}
                      </span>
                    ))}
                  </div>
                )}

                {f.notes && (
                  <p className="text-[12.5px] text-brand-text-md dark:text-gray-300 leading-relaxed mt-1">
                    {f.notes}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
