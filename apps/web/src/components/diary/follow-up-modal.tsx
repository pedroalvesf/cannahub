import { useEffect, useMemo, useState } from 'react'
import { PREDEFINED_EFFECTS_POSITIVE, PREDEFINED_EFFECTS_NEGATIVE } from '@cannahub/shared'
import { SYMPTOM_LABELS } from '@/constants/labels'
import { SeveritySelector } from './severity-selector'
import { EffectChip } from './effect-chip'
import { getTagsForCondition } from './follow-up-tags'
import { useCreateDiaryFollowUp, useUpdateDiaryFollowUp, type DiarySymptom, type DiaryFollowUp } from '@/hooks/use-diary'

interface EntrySnapshot {
  id: string
  date: string
  time: string
  targetCondition: string | null
  symptoms: DiarySymptom[]
}

interface FollowUpModalProps {
  open: boolean
  onClose: () => void
  entry: EntrySnapshot
  /** Quando definido, abre em modo edição de um follow-up existente. */
  existingFollowUp?: DiaryFollowUp
}

interface EffectState {
  effectKey: string
  isPositive: boolean
}

function toLocalDateTimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export function FollowUpModal({ open, onClose, entry, existingFollowUp }: FollowUpModalProps) {
  const createFollowUp = useCreateDiaryFollowUp()
  const updateFollowUp = useUpdateDiaryFollowUp()
  const isEdit = !!existingFollowUp

  const availableTags = useMemo(
    () => getTagsForCondition(entry.targetCondition),
    [entry.targetCondition],
  )

  const [evaluatedAt, setEvaluatedAt] = useState<string>(() => {
    if (existingFollowUp) {
      return toLocalDateTimeInput(new Date(existingFollowUp.evaluatedAt))
    }
    return toLocalDateTimeInput(new Date())
  })

  const [severityAfter, setSeverityAfter] = useState<Record<string, number>>(() => {
    const base: Record<string, number> = {}
    for (const s of entry.symptoms) {
      const found = existingFollowUp?.symptomAssessments.find(
        (a) => a.symptomLogId === s.id,
      )
      base[s.id] = found?.severityAfter ?? s.severityBefore
    }
    return base
  })

  const [selectedTags, setSelectedTags] = useState<string[]>(
    () => existingFollowUp?.tags ?? [],
  )
  const [effects, setEffects] = useState<EffectState[]>(
    () =>
      existingFollowUp?.effects.map((e) => ({
        effectKey: e.effectKey,
        isPositive: e.isPositive,
      })) ?? [],
  )
  const [notes, setNotes] = useState<string>(existingFollowUp?.notes ?? '')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  function toggleTag(key: string) {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key],
    )
  }

  function toggleEffect(key: string, isPositive: boolean) {
    setEffects((prev) => {
      const exists = prev.find((e) => e.effectKey === key)
      if (exists) return prev.filter((e) => e.effectKey !== key)
      return [...prev, { effectKey: key, isPositive }]
    })
  }

  const entryTakenAt = new Date(entry.date)
  const minDateTime = toLocalDateTimeInput(entryTakenAt)

  async function handleSave() {
    setErrorMessage('')
    const evaluatedDate = new Date(evaluatedAt)
    if (Number.isNaN(evaluatedDate.getTime())) {
      setErrorMessage('Informe uma data e hora válidas.')
      return
    }
    if (evaluatedDate < entryTakenAt) {
      setErrorMessage('A avaliação não pode ser anterior ao registro.')
      return
    }

    const symptomAssessments = entry.symptoms.map((s) => ({
      symptomLogId: s.id,
      severityAfter: severityAfter[s.id] ?? 0,
    }))

    try {
      if (isEdit && existingFollowUp) {
        await updateFollowUp.mutateAsync({
          id: existingFollowUp.id,
          evaluatedAt: evaluatedDate.toISOString(),
          notes: notes.trim() || null,
          tags: selectedTags,
          symptomAssessments,
          effects,
        })
      } else {
        await createFollowUp.mutateAsync({
          entryId: entry.id,
          evaluatedAt: evaluatedDate.toISOString(),
          notes: notes.trim() || undefined,
          tags: selectedTags,
          symptomAssessments,
          effects,
        })
      }
      onClose()
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrorMessage(msg ?? 'Não foi possível salvar a avaliação.')
    }
  }

  const isSaving = createFollowUp.isPending || updateFollowUp.isPending

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-up-title"
        className="relative w-full md:max-w-[560px] max-h-[90vh] overflow-y-auto bg-brand-white dark:bg-surface-dark rounded-t-[20px] md:rounded-[16px] p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="follow-up-title" className="font-serif text-xl text-brand-green-deep dark:text-white">
              {isEdit ? 'Editar avaliação' : 'Como você está agora?'}
            </h2>
            <p className="text-[12.5px] text-brand-muted dark:text-gray-400 mt-0.5">
              Registro tomado em {entryTakenAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-brand-muted hover:text-brand-green-deep dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quando você avaliou */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Quando</h3>
          <input
            type="datetime-local"
            value={evaluatedAt}
            min={minDateTime}
            onChange={(e) => setEvaluatedAt(e.target.value)}
            className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
          />
        </section>

        {/* Severidade depois */}
        {entry.symptoms.length > 0 && (
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">
              Como estão os sintomas agora
            </h3>
            <div className="space-y-4">
              {entry.symptoms.map((s) => {
                const label = s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey
                return (
                  <div key={s.id} className="bg-brand-cream/40 dark:bg-surface-dark-card/60 rounded-[10px] px-3 py-3 border border-brand-cream-dark/40 dark:border-gray-700/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-green-deep dark:text-gray-200">
                        {label}
                      </span>
                      <span className="text-[11px] text-brand-muted dark:text-gray-500">
                        antes: <span className="font-semibold">{s.severityBefore}/10</span>
                      </span>
                    </div>
                    <SeveritySelector
                      value={severityAfter[s.id] ?? 0}
                      onChange={(v) => setSeverityAfter((prev) => ({ ...prev, [s.id]: v }))}
                      size="sm"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Tags rápidas por condição */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">
            Marcadores rápidos
            <span className="ml-1 text-xs font-normal text-brand-muted">(opcional)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const selected = selectedTags.includes(tag.key)
              const intent =
                tag.type === 'positive'
                  ? selected
                    ? 'bg-brand-green-pale border-brand-green-light text-brand-green-deep dark:bg-brand-green-deep/40 dark:border-brand-green-light dark:text-brand-green-xs'
                    : 'border-brand-cream-dark/60 dark:border-gray-700/60 text-brand-muted hover:border-brand-green-light hover:text-brand-green-deep dark:hover:text-brand-green-xs'
                  : tag.type === 'negative'
                    ? selected
                      ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
                      : 'border-brand-cream-dark/60 dark:border-gray-700/60 text-brand-muted hover:border-red-300 hover:text-red-600'
                    : selected
                      ? 'bg-brand-cream-dark border-brand-cream-darker text-brand-text-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                      : 'border-brand-cream-dark/60 dark:border-gray-700/60 text-brand-muted hover:border-brand-cream-darker dark:hover:border-gray-600'
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => toggleTag(tag.key)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[12.5px] font-medium transition-all ${intent}`}
                  aria-pressed={selected}
                >
                  {tag.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Efeitos sentidos */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">
            Efeitos sentidos <span className="text-xs font-normal text-brand-muted">(opcional)</span>
          </h3>
          <p className="text-xs text-brand-muted dark:text-gray-500 mb-2">Positivos</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PREDEFINED_EFFECTS_POSITIVE.map((key) => (
              <EffectChip
                key={key}
                effectKey={key}
                isPositive
                selected={!!effects.find((e) => e.effectKey === key && e.isPositive)}
                onToggle={() => toggleEffect(key, true)}
              />
            ))}
          </div>
          <p className="text-xs text-brand-muted dark:text-gray-500 mb-2">Negativos</p>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_EFFECTS_NEGATIVE.map((key) => (
              <EffectChip
                key={key}
                effectKey={key}
                isPositive={false}
                selected={!!effects.find((e) => e.effectKey === key && !e.isPositive)}
                onToggle={() => toggleEffect(key, false)}
              />
            ))}
          </div>
        </section>

        {/* Relato livre */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">
            Como você está? <span className="text-xs font-normal text-brand-muted">(opcional)</span>
          </h3>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: dormi 7h, acordei sem dor; senti um leve enjoo passando a hora..."
            className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 resize-none"
          />
        </section>

        {errorMessage && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 sticky bottom-0 bg-brand-white dark:bg-surface-dark pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 text-sm font-medium text-brand-muted"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-[8px] bg-brand-green-deep hover:bg-brand-green-mid text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : isEdit ? 'Atualizar avaliação' : 'Salvar avaliação'}
          </button>
        </div>
      </div>
    </div>
  )
}
