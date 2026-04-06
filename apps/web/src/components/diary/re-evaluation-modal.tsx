import { useState } from 'react'
import { SYMPTOM_LABELS } from '@/constants/labels'
import { SeveritySelector } from './severity-selector'
import { useUpdateDiaryEntry } from '@/hooks/use-diary'

interface Symptom {
  id: string
  symptomKey: string
  customSymptomName: string | null
  severityBefore: string
  severityAfter: string | null
}

interface ReEvaluationModalProps {
  open: boolean
  onClose: () => void
  entryId: string
  symptoms: Symptom[]
}

export function ReEvaluationModal({ open, onClose, entryId, symptoms }: ReEvaluationModalProps) {
  const updateEntry = useUpdateDiaryEntry()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(symptoms.map((s) => [s.id, s.severityAfter ?? 'none'])),
  )

  if (!open) return null

  async function handleSave() {
    const updates = Object.entries(values).map(([symptomLogId, severityAfter]) => ({
      symptomLogId,
      severityAfter,
    }))
    await updateEntry.mutateAsync({ id: entryId, severityAfterUpdates: updates })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[400px] bg-brand-white dark:bg-surface-dark rounded-[16px] p-6 shadow-xl">
        <h2 className="font-serif text-lg text-brand-green-deep dark:text-white mb-4">
          Como estou agora?
        </h2>
        <div className="space-y-4 mb-6">
          {symptoms.map((s) => {
            const label = s.customSymptomName ?? SYMPTOM_LABELS[s.symptomKey] ?? s.symptomKey
            return (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-green-deep dark:text-gray-200">{label}</span>
                <SeveritySelector
                  value={values[s.id] ?? 'none'}
                  onChange={(v) => setValues((prev) => ({ ...prev, [s.id]: v }))}
                  size="sm"
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 text-sm font-medium text-brand-muted"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={updateEntry.isPending}
            className="flex-1 py-2.5 rounded-[8px] bg-brand-green-deep hover:bg-brand-green-mid text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {updateEntry.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
