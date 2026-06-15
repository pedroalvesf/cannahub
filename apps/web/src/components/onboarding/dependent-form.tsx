import { useState, type FormEvent } from 'react'
import { RELATIONSHIP_TYPE_LABELS } from '@/constants/labels'
import { useCreateDependent, useGuardianDependents } from '@/hooks/use-onboarding'

interface DependentFormProps {
  isFirstStep: boolean
  onBack: () => void
  onCompleted: (label: string) => void
}

const RELATIONSHIP_OPTIONS = Object.entries(RELATIONSHIP_TYPE_LABELS)

function extractApiMessage(err: unknown): string | undefined {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message
}

export function DependentForm({ isFirstStep, onBack, onCompleted }: DependentFormProps) {
  const { data: existing, isLoading: loadingExisting } = useGuardianDependents()
  const createDependent = useCreateDependent()

  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [relationshipType, setRelationshipType] = useState('parent')
  const [error, setError] = useState('')

  const alreadyRegistered = existing?.dependents?.[0]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Informe o nome do dependente.')
      return
    }

    createDependent.mutate(
      {
        name: name.trim(),
        birthDate: birthDate || undefined,
        documentNumber: documentNumber.trim() || undefined,
        relationshipType,
      },
      {
        onSuccess: (dependent) => onCompleted(dependent.name),
        onError: (err) =>
          setError(extractApiMessage(err) || 'Não foi possível salvar o dependente.'),
      },
    )
  }

  return (
    <div className="max-w-xl w-full">
      <h2 className="text-xl md:text-2xl font-bold text-brand-green-deep dark:text-white leading-snug">
        Sobre quem você cuida?
      </h2>
      <p className="mt-2 text-sm font-normal text-brand-muted dark:text-gray-500 leading-relaxed">
        Cadastre a pessoa que receberá o tratamento. Você poderá ajustar esses dados depois.
      </p>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loadingExisting ? (
        <div className="mt-6 py-8 text-center text-brand-muted text-[13px]">Carregando...</div>
      ) : alreadyRegistered ? (
        <div className="mt-6">
          <div className="flex items-center gap-3 p-4 rounded-card bg-brand-green-pale/30 dark:bg-brand-green-deep/10 border border-brand-green-pale dark:border-brand-green-deep/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-brand-green-deep dark:text-brand-green-light">
                {alreadyRegistered.name}
              </p>
              <p className="text-xs text-brand-muted dark:text-gray-500">
                {RELATIONSHIP_TYPE_LABELS[alreadyRegistered.relationshipType] ?? 'Dependente cadastrado'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onCompleted(alreadyRegistered.name)}
            className="mt-4 w-full py-3.5 font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors"
          >
            Continuar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="dep-name" className="block text-[13px] font-medium text-brand-text dark:text-gray-300 mb-1.5">
              Nome completo
            </label>
            <input
              id="dep-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do dependente"
              className="w-full px-4 py-3 rounded-btn border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-deep focus:ring-1 focus:ring-brand-green-deep transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dep-birth" className="block text-[13px] font-medium text-brand-text dark:text-gray-300 mb-1.5">
                Data de nascimento
              </label>
              <input
                id="dep-birth"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-btn border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 focus:outline-none focus:border-brand-green-deep focus:ring-1 focus:ring-brand-green-deep transition-colors"
              />
            </div>
            <div>
              <label htmlFor="dep-doc" className="block text-[13px] font-medium text-brand-text dark:text-gray-300 mb-1.5">
                CPF (opcional)
              </label>
              <input
                id="dep-doc"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 rounded-btn border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-deep focus:ring-1 focus:ring-brand-green-deep transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dep-rel" className="block text-[13px] font-medium text-brand-text dark:text-gray-300 mb-1.5">
              Qual o vínculo com você?
            </label>
            <select
              id="dep-rel"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="w-full px-4 py-3 rounded-btn border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 focus:outline-none focus:border-brand-green-deep focus:ring-1 focus:ring-brand-green-deep transition-colors"
            >
              {RELATIONSHIP_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || createDependent.isPending}
            className="w-full py-3.5 font-bold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {createDependent.isPending ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      )}

      <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-card bg-surface-card dark:bg-surface-dark-card border border-brand-cream-dark/50 dark:border-gray-800 shadow-soft">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep shrink-0 mt-0.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-xs font-normal text-brand-muted dark:text-gray-500 leading-relaxed">
          <span className="font-semibold text-brand-green-deep dark:text-gray-400">LGPD Protection</span> — Os dados do dependente são protegidos e armazenados com segurança.
        </p>
      </div>

      {!isFirstStep && (
        <div className="mt-6">
          <button
            onClick={onBack}
            className="text-sm text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300 transition-colors font-medium"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  )
}
