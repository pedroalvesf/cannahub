import { useState } from 'react'
import { PREDEFINED_SYMPTOMS, PREDEFINED_EFFECTS_POSITIVE, PREDEFINED_EFFECTS_NEGATIVE } from '@cannahub/shared'
import { SYMPTOM_LABELS, DOSE_UNIT_LABELS } from '@/constants/labels'
import { MethodSelector } from './method-selector'
import { SymptomChip } from './symptom-chip'
import { EffectChip } from './effect-chip'
import { useCreateDiaryEntry } from '@/hooks/use-diary'

interface SymptomState {
  symptomKey: string
  customSymptomName?: string
  severityBefore: string
}

interface EffectState {
  effectKey: string
  isPositive: boolean
  customEffectName?: string
}

interface NewEntryModalProps {
  open: boolean
  onClose: () => void
  prefill?: {
    customProductName?: string
    productId?: string
    administrationMethod?: string
    doseAmount?: number
    doseUnit?: string
    symptomKeys?: string[]
  }
}

const DOSE_UNITS = ['drops', 'ml', 'mg', 'g', 'puffs', 'units'] as const

export function NewEntryModal({ open, onClose, prefill }: NewEntryModalProps) {
  const createEntry = useCreateDiaryEntry()

  const now = new Date()
  const [date, setDate] = useState(now.toISOString().split('T')[0] ?? '')
  const [time, setTime] = useState(
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
  )
  const [productId] = useState(prefill?.productId ?? '')
  const [customProductName, setCustomProductName] = useState(prefill?.customProductName ?? '')
  const [administrationMethod, setAdministrationMethod] = useState(prefill?.administrationMethod ?? 'oil')
  const [doseAmount, setDoseAmount] = useState(prefill?.doseAmount ?? 0)
  const [doseUnit, setDoseUnit] = useState(prefill?.doseUnit ?? 'drops')
  const [notes, setNotes] = useState('')
  const [symptoms, setSymptoms] = useState<SymptomState[]>(
    prefill?.symptomKeys?.map((k) => ({ symptomKey: k, severityBefore: 'none' })) ?? [],
  )
  const [effects, setEffects] = useState<EffectState[]>([])
  const [customSymptomInput, setCustomSymptomInput] = useState('')
  const [showCustomSymptom, setShowCustomSymptom] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!open) return null

  function toggleSymptom(key: string) {
    setSymptoms((prev) => {
      const exists = prev.find((s) => s.symptomKey === key)
      if (exists) return prev.filter((s) => s.symptomKey !== key)
      return [...prev, { symptomKey: key, severityBefore: 'none' }]
    })
  }

  function updateSymptomSeverity(key: string, value: string) {
    setSymptoms((prev) =>
      prev.map((s) => (s.symptomKey === key ? { ...s, severityBefore: value } : s)),
    )
  }

  function addCustomSymptom() {
    if (!customSymptomInput.trim()) return
    setSymptoms((prev) => [
      ...prev,
      { symptomKey: `custom_${Date.now()}`, customSymptomName: customSymptomInput.trim(), severityBefore: 'none' },
    ])
    setCustomSymptomInput('')
    setShowCustomSymptom(false)
  }

  function toggleEffect(key: string, isPositive: boolean) {
    setEffects((prev) => {
      const exists = prev.find((e) => e.effectKey === key)
      if (exists) return prev.filter((e) => e.effectKey !== key)
      return [...prev, { effectKey: key, isPositive }]
    })
  }

  async function handleSubmit() {
    const newErrors: Record<string, string> = {}
    if (!date) newErrors['date'] = 'Data obrigatoria'
    if (!productId && !customProductName) newErrors['product'] = 'Informe um produto'
    if (!doseAmount || doseAmount <= 0) newErrors['dose'] = 'Informe a dose'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await createEntry.mutateAsync({
      date: new Date(date).toISOString(),
      time,
      productId: productId || undefined,
      customProductName: customProductName || undefined,
      administrationMethod,
      doseAmount,
      doseUnit,
      notes: notes || undefined,
      symptoms: symptoms.map((s) => ({
        symptomKey: s.symptomKey,
        customSymptomName: s.customSymptomName,
        severityBefore: s.severityBefore,
      })),
      effects: effects.map((e) => ({
        effectKey: e.effectKey,
        isPositive: e.isPositive,
      })),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-[560px] max-h-[90vh] overflow-y-auto bg-brand-white dark:bg-surface-dark rounded-t-[20px] md:rounded-[16px] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-brand-green-deep dark:text-white">
            Novo registro
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-green-deep dark:text-gray-400 dark:hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quando */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Quando</h3>
          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-[120px] px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
            />
          </div>
          {errors['date'] && <p className="text-xs text-red-500 mt-1">{errors['date']}</p>}
        </section>

        {/* O que */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">O que</h3>
          <input
            type="text"
            value={customProductName}
            onChange={(e) => setCustomProductName(e.target.value)}
            placeholder="Nome do produto (ex: Oleo CBD 15mg/ml)"
            className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder:text-brand-muted/50"
          />
          {errors['product'] && <p className="text-xs text-red-500 mt-1">{errors['product']}</p>}
        </section>

        {/* Metodo */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Metodo</h3>
          <MethodSelector value={administrationMethod} onChange={setAdministrationMethod} />
        </section>

        {/* Quanto */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Quanto</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={doseAmount || ''}
              onChange={(e) => setDoseAmount(Number(e.target.value))}
              placeholder="0"
              min={0}
              step="0.1"
              className="w-[100px] px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
            />
            <select
              value={doseUnit}
              onChange={(e) => setDoseUnit(e.target.value)}
              className="flex-1 px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
            >
              {DOSE_UNITS.map((u) => (
                <option key={u} value={u}>{DOSE_UNIT_LABELS[u] ?? u}</option>
              ))}
            </select>
          </div>
          {errors['dose'] && <p className="text-xs text-red-500 mt-1">{errors['dose']}</p>}
        </section>

        {/* Como estou antes */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Como estou antes</h3>
          <div className="grid grid-cols-1 gap-2 mb-2">
            {PREDEFINED_SYMPTOMS.map((key) => {
              const active = symptoms.find((s) => s.symptomKey === key)
              if (!active) return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSymptom(key)}
                  className="text-left px-3 py-2 rounded-[10px] border border-brand-cream-dark/30 dark:border-gray-700/40 bg-brand-cream/50 dark:bg-surface-dark-card/50 text-sm text-brand-muted dark:text-gray-500 hover:border-brand-green-light/40 transition-colors"
                >
                  {SYMPTOM_LABELS[key] ?? key}
                </button>
              )
              return (
                <SymptomChip
                  key={key}
                  symptomKey={key}
                  severityBefore={active.severityBefore}
                  onSeverityChange={(v) => updateSymptomSeverity(key, v)}
                  onRemove={() => toggleSymptom(key)}
                />
              )
            })}
            {symptoms.filter((s) => s.customSymptomName).map((s) => (
              <SymptomChip
                key={s.symptomKey}
                symptomKey={s.symptomKey}
                customName={s.customSymptomName}
                severityBefore={s.severityBefore}
                onSeverityChange={(v) => updateSymptomSeverity(s.symptomKey, v)}
                onRemove={() => setSymptoms((prev) => prev.filter((p) => p.symptomKey !== s.symptomKey))}
              />
            ))}
          </div>
          {showCustomSymptom ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
                placeholder="Nome do sintoma"
                className="flex-1 px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm"
                autoFocus
              />
              <button type="button" onClick={addCustomSymptom} className="text-sm font-medium text-brand-green-light">
                Adicionar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomSymptom(true)}
              className="text-sm font-medium text-brand-green-light hover:underline"
            >
              + Adicionar sintoma
            </button>
          )}
        </section>

        {/* Efeitos sentidos */}
        <section className="mb-5">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Efeitos sentidos</h3>
          <p className="text-xs text-brand-muted dark:text-gray-500 mb-2">Positivos</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PREDEFINED_EFFECTS_POSITIVE.map((key) => (
              <EffectChip
                key={key}
                effectKey={key}
                isPositive={true}
                selected={effects.some((e) => e.effectKey === key)}
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
                selected={effects.some((e) => e.effectKey === key)}
                onToggle={() => toggleEffect(key, false)}
              />
            ))}
          </div>
        </section>

        {/* Notas */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">Notas</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como foi a experiencia?"
            rows={3}
            className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder:text-brand-muted/50 resize-none"
          />
        </section>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createEntry.isPending}
          className="w-full py-3 rounded-[8px] bg-brand-green-deep hover:bg-brand-green-mid text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {createEntry.isPending ? 'Salvando...' : 'Salvar registro'}
        </button>
      </div>
    </div>
  )
}
