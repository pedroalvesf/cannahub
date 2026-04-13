import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useJournalEntries,
  useUpdateJournalEntry,
  type JournalEntry,
  type JournalEntryInput,
  type JournalVisibility,
} from '@/hooks/use-journal'

const SYMPTOM_OPTIONS = [
  'Ansiedade',
  'Dor crônica',
  'Insônia',
  'Náusea',
  'Depressão',
  'Espasmos musculares',
  'Perda de apetite',
  'Fadiga',
  'Irritabilidade',
  'Dor de cabeça',
]

const SIDE_EFFECT_OPTIONS = [
  'Boca seca',
  'Sonolência',
  'Tontura',
  'Aumento de apetite',
  'Olhos vermelhos',
  'Alteração de humor',
  'Taquicardia',
]

const MOOD_LABELS: Record<number, { emoji: string; label: string }> = {
  1: { emoji: '😞', label: 'Muito ruim' },
  2: { emoji: '🙁', label: 'Ruim' },
  3: { emoji: '😐', label: 'Neutro' },
  4: { emoji: '🙂', label: 'Bem' },
  5: { emoji: '😄', label: 'Muito bem' },
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function JournalPage() {
  const { data, isLoading } = useJournalEntries()
  const entries = data?.entries ?? []

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const editingEntry = useMemo(
    () => entries.find((e) => e.id === editingId) ?? null,
    [entries, editingId],
  )

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />
      <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto">
        {/* Breadcrumb + header */}
        <div className="flex items-center gap-2 text-[13px] text-brand-muted dark:text-gray-500 mb-4 mt-6">
          <Link
            to="/painel"
            className="hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline"
          >
            Painel
          </Link>
          <span>›</span>
          <span className="text-brand-green-deep dark:text-white font-medium">
            Diário de tratamento
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-green-light mb-2">
              Área privada
            </p>
            <h1 className="font-serif text-[clamp(26px,4vw,40px)] text-brand-green-deep dark:text-white leading-[1.1]">
              Diário de tratamento
            </h1>
          </div>
          {!isCreating && !editingEntry && (
            <button
              onClick={() => setIsCreating(true)}
              className="text-[13px] font-semibold text-brand-white bg-brand-green-deep px-5 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors"
            >
              Nova entrada
            </button>
          )}
        </div>
        <p className="text-[14px] text-brand-muted dark:text-gray-400 max-w-[640px] leading-relaxed mb-8">
          Registre como você está se sentindo, sintomas, medicação e observações.
          Entradas <strong>privadas</strong> ficam só com você. Entradas marcadas
          como <strong>compartilháveis</strong> poderão ser lidas pelo seu
          médico quando essa integração estiver disponível.
        </p>

        {/* Form (create or edit) */}
        {(isCreating || editingEntry) && (
          <EntryForm
            key={editingEntry?.id ?? 'new'}
            initial={editingEntry}
            onCancel={() => {
              setIsCreating(false)
              setEditingId(null)
            }}
            onSaved={() => {
              setIsCreating(false)
              setEditingId(null)
            }}
          />
        )}

        {/* Entries list */}
        {isLoading ? (
          <div className="text-center py-20 text-[14px] text-brand-muted dark:text-gray-500">
            Carregando…
          </div>
        ) : entries.length === 0 && !isCreating ? (
          <EmptyState onCreate={() => setIsCreating(true)} />
        ) : (
          <div className="space-y-3 mt-2">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => setEditingId(entry.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ─── Subcomponents ──────────────────────────────────────── */

function EntryForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: JournalEntry | null
  onCancel: () => void
  onSaved: () => void
}) {
  const create = useCreateJournalEntry()
  const update = useUpdateJournalEntry()

  const [entryDate, setEntryDate] = useState<string>(
    initial?.entryDate ?? todayIso(),
  )
  const [mood, setMood] = useState<number | null>(initial?.mood ?? null)
  const [symptoms, setSymptoms] = useState<string[]>(initial?.symptoms ?? [])
  const [symptomIntensity, setSymptomIntensity] = useState<number | null>(
    initial?.symptomIntensity ?? null,
  )
  const [medicationTaken, setMedicationTaken] = useState<boolean>(
    initial?.medicationTaken ?? false,
  )
  const [dosage, setDosage] = useState<string>(initial?.dosage ?? '')
  const [sideEffects, setSideEffects] = useState<string[]>(
    initial?.sideEffects ?? [],
  )
  const [notes, setNotes] = useState<string>(initial?.notes ?? '')
  const [visibility, setVisibility] = useState<JournalVisibility>(
    initial?.visibility ?? 'private',
  )

  const isSaving = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input: JournalEntryInput = {
      entryDate,
      mood: mood ?? undefined,
      symptoms,
      symptomIntensity: symptomIntensity ?? undefined,
      medicationTaken,
      dosage: dosage.trim() || undefined,
      sideEffects,
      notes: notes.trim() || undefined,
      visibility,
    }
    try {
      if (initial) {
        await update.mutateAsync({ id: initial.id, ...input })
      } else {
        await create.mutateAsync(input)
      }
      onSaved()
    } catch {
      // erro tratado pelo React Query; poderia mostrar toast no futuro
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 mb-8"
    >
      <h2 className="text-[16px] font-bold text-brand-green-deep dark:text-white mb-5">
        {initial ? 'Editar entrada' : 'Nova entrada'}
      </h2>

      {/* Date + mood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Data">
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            max={todayIso()}
            required
            className="w-full px-3 py-2.5 rounded-card border border-brand-cream-dark dark:border-gray-700/40 bg-brand-cream/50 dark:bg-gray-800/40 text-[13.5px] text-brand-green-deep dark:text-white focus:outline-none focus:border-brand-green-light"
          />
        </Field>
        <Field label="Como você se sentiu">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMood(mood === n ? null : n)}
                className={`px-3 py-2 rounded-btn text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                  mood === n
                    ? 'bg-brand-green-deep text-brand-white'
                    : 'bg-brand-cream/50 dark:bg-gray-800 text-brand-muted dark:text-gray-400 border border-brand-cream-dark dark:border-gray-700 hover:border-brand-green-light/50'
                }`}
                title={MOOD_LABELS[n]!.label}
              >
                <span>{MOOD_LABELS[n]!.emoji}</span>
                <span>{MOOD_LABELS[n]!.label}</span>
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Symptoms */}
      <Field label="Sintomas">
        <MultiSelect
          options={SYMPTOM_OPTIONS}
          value={symptoms}
          onChange={setSymptoms}
        />
      </Field>

      {/* Symptom intensity */}
      {symptoms.length > 0 && (
        <Field label="Intensidade média dos sintomas (0 a 10)">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              value={symptomIntensity ?? 0}
              onChange={(e) => setSymptomIntensity(Number(e.target.value))}
              className="flex-1 accent-brand-green-deep"
            />
            <span className="text-[14px] font-bold text-brand-green-deep dark:text-white w-8 text-right">
              {symptomIntensity ?? 0}
            </span>
          </div>
        </Field>
      )}

      {/* Medication */}
      <Field label="Medicação">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.checked)}
            className="w-4 h-4 accent-brand-green-deep"
          />
          <span className="text-[13.5px] text-brand-text-md dark:text-gray-300">
            Tomei cannabis medicinal hoje
          </span>
        </label>
      </Field>
      {medicationTaken && (
        <Field label="Dosagem e produto">
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Ex: 3 gotas, óleo CBD 30mg/ml, 2x ao dia"
            className="w-full px-3 py-2.5 rounded-card border border-brand-cream-dark dark:border-gray-700/40 bg-brand-cream/50 dark:bg-gray-800/40 text-[13.5px] text-brand-green-deep dark:text-white focus:outline-none focus:border-brand-green-light"
          />
        </Field>
      )}

      {/* Side effects */}
      {medicationTaken && (
        <Field label="Efeitos adversos">
          <MultiSelect
            options={SIDE_EFFECT_OPTIONS}
            value={sideEffects}
            onChange={setSideEffects}
          />
        </Field>
      )}

      {/* Notes */}
      <Field label="Observações">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Contexto, o que mudou, o que você quer lembrar…"
          className="w-full px-3 py-2.5 rounded-card border border-brand-cream-dark dark:border-gray-700/40 bg-brand-cream/50 dark:bg-gray-800/40 text-[13.5px] text-brand-green-deep dark:text-white focus:outline-none focus:border-brand-green-light resize-y"
        />
      </Field>

      {/* Visibility */}
      <Field label="Visibilidade">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <VisibilityOption
            value="private"
            current={visibility}
            onClick={() => setVisibility('private')}
            title="Privada"
            description="Só você pode ver esta entrada."
          />
          <VisibilityOption
            value="shareable"
            current={visibility}
            onClick={() => setVisibility('shareable')}
            title="Compartilhável"
            description="Seu médico poderá ver quando a integração estiver ativa."
          />
        </div>
      </Field>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="text-[13px] font-semibold text-brand-white bg-brand-green-deep px-6 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Salvando…' : initial ? 'Salvar alterações' : 'Salvar entrada'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[13px] font-semibold text-brand-muted dark:text-gray-400 hover:text-brand-green-deep dark:hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function VisibilityOption({
  value,
  current,
  onClick,
  title,
  description,
}: {
  value: JournalVisibility
  current: JournalVisibility
  onClick: () => void
  title: string
  description: string
}) {
  const selected = value === current
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3.5 rounded-card border transition-colors ${
        selected
          ? 'border-brand-green-deep bg-brand-green-pale/40 dark:bg-brand-green-deep/20'
          : 'border-brand-cream-dark dark:border-gray-700/40 bg-brand-cream/30 dark:bg-gray-800/20 hover:border-brand-green-light/50'
      }`}
    >
      <p className="text-[13px] font-bold text-brand-green-deep dark:text-white mb-0.5">
        {title}
      </p>
      <p className="text-[11.5px] text-brand-muted dark:text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  )
}

function EntryCard({
  entry,
  onEdit,
}: {
  entry: JournalEntry
  onEdit: () => void
}) {
  const remove = useDeleteJournalEntry()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[15px] font-bold text-brand-green-deep dark:text-white">
            {formatDate(entry.entryDate)}
          </p>
          {entry.mood && (
            <span className="text-[12px] text-brand-muted dark:text-gray-400 flex items-center gap-1">
              <span>{MOOD_LABELS[entry.mood]?.emoji}</span>
              <span>{MOOD_LABELS[entry.mood]?.label}</span>
            </span>
          )}
          <span
            className={`text-[10.5px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-btn ${
              entry.visibility === 'shareable'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-brand-cream dark:bg-gray-700 text-brand-muted dark:text-gray-400'
            }`}
          >
            {entry.visibility === 'shareable' ? 'Compartilhável' : 'Privada'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-[12px] font-semibold text-brand-green-mid hover:underline"
          >
            Editar
          </button>
          {confirming ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => remove.mutate(entry.id)}
                disabled={remove.isPending}
                className="text-[12px] font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                Confirmar exclusão
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[12px] text-brand-muted"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-[12px] font-semibold text-red-600/80 hover:text-red-600"
            >
              Excluir
            </button>
          )}
        </div>
      </div>

      {entry.symptoms.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-500 mb-1.5">
            Sintomas
            {entry.symptomIntensity !== null && (
              <span className="text-brand-green-mid ml-1.5 normal-case tracking-normal">
                · intensidade {entry.symptomIntensity}/10
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.symptoms.map((s) => (
              <span
                key={s}
                className="text-[11px] font-medium text-brand-green-deep dark:text-brand-green-light bg-brand-green-pale/50 dark:bg-gray-700/50 px-2 py-0.5 rounded-btn"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.medicationTaken && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-500 mb-1">
            Medicação
          </p>
          <p className="text-[13px] text-brand-text-md dark:text-gray-300">
            {entry.dosage ?? 'Tomou (sem detalhes informados)'}
          </p>
          {entry.sideEffects.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {entry.sideEffects.map((s) => (
                <span
                  key={s}
                  className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/20 px-2 py-0.5 rounded-btn"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {entry.notes && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-500 mb-1">
            Observações
          </p>
          <p className="text-[13.5px] text-brand-text-md dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {entry.notes}
          </p>
        </div>
      )}
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-16 px-6 bg-brand-white dark:bg-surface-dark-card border border-dashed border-brand-cream-dark dark:border-gray-700/40 rounded-card">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-brand-green-light mb-4"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
      <h3 className="font-serif text-[20px] text-brand-green-deep dark:text-white mb-2">
        Seu diário está vazio
      </h3>
      <p className="text-[13.5px] text-brand-muted dark:text-gray-400 max-w-[420px] mx-auto mb-5 leading-relaxed">
        Comece registrando como você está se sentindo hoje. Com o tempo, o
        histórico vai revelar padrões e ajudar seu médico a ajustar o tratamento.
      </p>
      <button
        onClick={onCreate}
        className="text-[13px] font-semibold text-brand-white bg-brand-green-deep px-6 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors"
      >
        Criar primeira entrada
      </button>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-btn text-[12px] font-medium transition-colors ${
              selected
                ? 'bg-brand-green-deep text-brand-white'
                : 'bg-brand-cream/50 dark:bg-gray-800 text-brand-muted dark:text-gray-400 border border-brand-cream-dark dark:border-gray-700 hover:border-brand-green-light/50'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
