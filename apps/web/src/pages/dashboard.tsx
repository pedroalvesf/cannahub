import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { useOnboardingSummary } from '@/hooks/use-onboarding'
import { useAddress, useSaveAddress } from '@/hooks/use-address'
import type { AddressData } from '@/hooks/use-address'

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  patient: 'Paciente Adulto',
  guardian: 'Responsável Legal',
  prescriber: 'Médico Prescritor',
  veterinarian: 'Veterinário',
  caregiver: 'Cuidador',
}

const CONDITION_LABELS: Record<string, string> = {
  chronic_pain: 'Dor Crônica',
  anxiety: 'Ansiedade',
  epilepsy: 'Epilepsia',
  autism: 'Autismo / TEA',
  parkinsons: 'Parkinson',
  multiple_sclerosis: 'Esclerose Múltipla',
  fibromyalgia: 'Fibromialgia',
  nausea: 'Náusea',
  adhd: 'TDAH',
  ptsd: 'PTSD',
  veterinary: 'Uso Veterinário',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  never: 'Nunca usei',
  less_than_6m: 'Menos de 6 meses',
  '6m_to_1y': '6 meses a 1 ano',
  '1y_to_3y': '1 a 3 anos',
  more_than_3y: 'Mais de 3 anos',
}

const FORM_LABELS: Record<string, string> = {
  sublingual_oil: 'Óleo sublingual',
  vaporization: 'Vaporização',
  smoking: 'Fumo',
  topical: 'Uso tópico',
  capsule: 'Cápsula',
  edible: 'Comestível',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendente', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  approved: { label: 'Aprovado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  rejected: { label: 'Recusado', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
}

const UF_OPTIONS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function StatusBadge({ status }: { status: string }) {
  const fallback = { label: 'Pendente', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' }
  const config = STATUS_CONFIG[status] ?? fallback
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full border ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'approved' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
      {config.label}
    </span>
  )
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-green-mid dark:text-brand-green-light hover:underline transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Editar
    </button>
  )
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark/50 dark:border-gray-700/30">
        <h2 className="text-[14px] font-bold text-brand-green-deep dark:text-white uppercase tracking-[0.04em]">
          {title}
        </h2>
        {action}
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-brand-cream-dark/30 dark:border-gray-800/50 last:border-0">
      <span className="text-[12.5px] text-brand-muted dark:text-gray-500">{label}</span>
      <span className="text-[13px] font-medium text-brand-green-deep dark:text-gray-200 text-right max-w-[60%]">
        {value || <span className="text-brand-muted/40 dark:text-gray-600 font-normal">—</span>}
      </span>
    </div>
  )
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function AddressForm({ initial, onSave, onCancel }: { initial: AddressData | null; onSave: (data: AddressData) => void; onCancel: () => void }) {
  const [form, setForm] = useState<AddressData>({
    street: initial?.street ?? '',
    complement: initial?.complement ?? '',
    neighborhood: initial?.neighborhood ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    zipCode: initial?.zipCode ?? '',
  })

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream/50 dark:bg-gray-800 text-brand-text dark:text-white text-[13px] outline-none focus:border-brand-green-light focus:ring-1 focus:ring-brand-green-light/30 transition-colors'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ ...form, zipCode: form.zipCode.replace(/\D/g, '') })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">Rua / Avenida, número</label>
          <input type="text" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={inputClass} placeholder="Rua das Flores, 123" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">Complemento</label>
          <input type="text" value={form.complement ?? ''} onChange={(e) => setForm({ ...form, complement: e.target.value })} className={inputClass} placeholder="Apto, bloco..." />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">Bairro</label>
          <input type="text" required value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className={inputClass} placeholder="Centro" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">Cidade</label>
          <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} placeholder="São Paulo" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">UF</label>
            <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass}>
              <option value="">—</option>
              {UF_OPTIONS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-400 mb-1">CEP</label>
            <input type="text" required value={formatCep(form.zipCode)} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className={inputClass} placeholder="00000-000" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="text-[13px] font-semibold text-brand-white bg-brand-green-deep px-5 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors">
          Salvar endereço
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] font-medium text-brand-muted dark:text-gray-500 hover:text-brand-green-deep transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data: onboarding, isLoading: onboardingLoading } = useOnboardingSummary()
  const { data: address, isLoading: addressLoading } = useAddress()
  const saveAddressMutation = useSaveAddress()
  const [editingAddress, setEditingAddress] = useState(false)

  if (!user) return null

  const accountStatus = user.accountStatus ?? user.status ?? 'pending'
  const accountTypeLabel = ACCOUNT_TYPE_LABELS[user.accountType ?? ''] ?? user.accountType
  const onboardingComplete = onboarding?.status === 'completed' || onboarding?.status === 'awaiting_prescription'

  function handleSaveAddress(data: AddressData) {
    saveAddressMutation.mutate(data, {
      onSuccess: () => setEditingAddress(false),
    })
  }

  const addressDisplay = address
    ? `${address.street}${address.complement ? `, ${address.complement}` : ''} — ${address.neighborhood}, ${address.city}/${address.state}, CEP ${formatCep(address.zipCode)}`
    : null

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-[13px] text-brand-muted dark:text-gray-500 mb-1">Painel do paciente</p>
          <h1 className="font-serif text-[clamp(24px,3.5vw,36px)] text-brand-green-deep dark:text-white leading-tight">
            Olá, {user.name?.split(' ')[0] ?? 'Paciente'}
          </h1>
        </div>

        {/* Status overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-3 bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-brand-muted dark:text-gray-500 uppercase tracking-wide">Cadastro</p>
              <StatusBadge status={accountStatus} />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-brand-muted dark:text-gray-500 uppercase tracking-wide">Acolhimento</p>
              {onboardingLoading ? (
                <span className="text-[12px] text-brand-muted dark:text-gray-500">Carregando...</span>
              ) : onboardingComplete ? (
                <StatusBadge status="approved" />
              ) : onboarding ? (
                <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400">Em andamento</span>
              ) : (
                <span className="text-[12px] font-semibold text-brand-muted dark:text-gray-500">Não iniciado</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-brand-muted dark:text-gray-500 uppercase tracking-wide">Documentos</p>
              <StatusBadge status="pending" />
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5">
          {/* Personal info */}
          <SectionCard
            title="Dados pessoais"
            action={<EditButton onClick={() => {}} />}
          >
            <InfoRow label="Nome" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Tipo de conta" value={accountTypeLabel} />
            <InfoRow label="CPF" value={user.cpf} />
            <InfoRow label="Telefone" value={user.phone} />
          </SectionCard>

          {/* Address */}
          <SectionCard
            title="Endereço"
            action={
              !editingAddress ? (
                <EditButton onClick={() => setEditingAddress(true)} />
              ) : null
            }
          >
            {editingAddress ? (
              <AddressForm
                initial={address ?? null}
                onSave={handleSaveAddress}
                onCancel={() => setEditingAddress(false)}
              />
            ) : addressLoading ? (
              <p className="text-[13px] text-brand-muted dark:text-gray-500 py-2">Carregando...</p>
            ) : address ? (
              <InfoRow label="Endereço completo" value={addressDisplay} />
            ) : (
              <div className="py-4 text-center">
                <p className="text-[13.5px] text-brand-muted dark:text-gray-500 mb-4">
                  Cadastre seu endereço para validação com o comprovante de residência
                </p>
                <button
                  onClick={() => setEditingAddress(true)}
                  className="inline-flex text-[13px] font-semibold text-brand-white bg-brand-green-deep px-6 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors"
                >
                  Adicionar endereço
                </button>
              </div>
            )}
          </SectionCard>

          {/* Clinical profile */}
          <SectionCard
            title="Perfil clínico"
            action={
              !onboarding ? (
                <Link
                  to="/acolhimento"
                  className="text-[12px] font-semibold text-brand-green-mid dark:text-brand-green-light hover:underline no-underline"
                >
                  Iniciar acolhimento
                </Link>
              ) : !onboardingComplete ? (
                <Link
                  to="/acolhimento"
                  className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 hover:underline no-underline"
                >
                  Continuar
                </Link>
              ) : (
                <EditButton onClick={() => {}} />
              )
            }
          >
            {onboardingLoading ? (
              <p className="text-[13px] text-brand-muted dark:text-gray-500 py-2">Carregando...</p>
            ) : !onboarding ? (
              <div className="py-4 text-center">
                <p className="text-[13.5px] text-brand-muted dark:text-gray-500 mb-4">
                  Complete o acolhimento para preencher seu perfil clínico
                </p>
                <Link
                  to="/acolhimento"
                  className="inline-flex text-[13px] font-semibold text-brand-white bg-brand-green-deep px-6 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                >
                  Iniciar acolhimento
                </Link>
              </div>
            ) : (
              <>
                <InfoRow label="Condição principal" value={CONDITION_LABELS[onboarding.condition ?? ''] ?? onboarding.condition} />
                <InfoRow label="Experiência" value={EXPERIENCE_LABELS[onboarding.experience ?? ''] ?? onboarding.experience} />
                <InfoRow label="Forma de uso preferida" value={FORM_LABELS[onboarding.preferredForm ?? ''] ?? onboarding.preferredForm} />
                <InfoRow
                  label="Receita médica"
                  value={onboarding.hasPrescription === true ? 'Sim' : onboarding.hasPrescription === false ? 'Não' : undefined}
                />
                <InfoRow
                  label="Acesso assistido"
                  value={onboarding.assistedAccess === true ? 'Sim, preciso de ajuda' : onboarding.assistedAccess === false ? 'Consigo arcar' : undefined}
                />
                {onboarding.needsDoctor && (
                  <div className="mt-3 flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-[12px] text-amber-700 dark:text-amber-400">
                      Você indicou que ainda não tem receita. Após a validação, poderemos indicar médicos prescritores.
                    </p>
                  </div>
                )}
                {onboarding.summary && (
                  <div className="mt-4 p-4 rounded-lg bg-brand-cream/50 dark:bg-gray-800/50 border border-brand-cream-dark/30 dark:border-gray-700/30">
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-500 mb-1.5">Resumo</p>
                    <p className="text-[13px] text-brand-green-deep dark:text-gray-300 leading-relaxed">{onboarding.summary}</p>
                  </div>
                )}
              </>
            )}
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Documentos"
            action={
              <Link
                to="/documentos"
                className="text-[12px] font-semibold text-brand-green-mid dark:text-brand-green-light hover:underline no-underline"
              >
                Gerenciar
              </Link>
            }
          >
            <div className="space-y-3">
              {[
                { label: 'Receita Médica', status: 'pending' },
                { label: 'Laudo Médico', status: 'pending' },
                { label: 'Documento de Identidade', status: 'pending' },
                { label: 'Comprovante de Residência', status: 'pending' },
              ].map((doc) => (
                <div key={doc.label} className="flex items-center justify-between py-2.5 border-b border-brand-cream-dark/30 dark:border-gray-800/50 last:border-0">
                  <span className="text-[13px] text-brand-green-deep dark:text-gray-300">{doc.label}</span>
                  <span className="text-[11px] font-medium text-brand-muted dark:text-gray-500 bg-brand-cream dark:bg-gray-800 px-2.5 py-1 rounded-full">
                    Pendente
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/documentos"
                className="inline-flex text-[13px] font-semibold text-brand-white bg-brand-green-deep px-6 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
              >
                Enviar documentos
              </Link>
            </div>
          </SectionCard>

          {/* Associations */}
          <SectionCard title="Associações vinculadas">
            <div className="py-4 text-center">
              <p className="text-[13.5px] text-brand-muted dark:text-gray-500 mb-4">
                Após a aprovação dos documentos, você poderá solicitar vínculo com associações
              </p>
              <Link
                to="/associacoes"
                className="inline-flex text-[13px] font-semibold text-brand-green-deep border border-brand-green-deep dark:border-brand-green-light dark:text-brand-green-light px-6 py-2.5 rounded-btn hover:bg-brand-green-pale dark:hover:bg-gray-800 transition-colors no-underline"
              >
                Ver associações
              </Link>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  )
}
