import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { RejectionModal } from '@/components/admin/rejection-modal'
import {
  useAdminUserDetail,
  useApproveDocument,
  useRejectDocument,
  useUpdateUserStatus,
  useDeleteUsers,
} from '@/hooks/use-admin'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_STATUS_LABELS,
  ONBOARDING_STATUS_LABELS,
  DOCUMENTS_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
  CONDITION_LABELS,
  EXPERIENCE_LABELS,
  FORM_LABELS,
  ACCESS_METHOD_LABELS,
  STATUS_BADGE_COLORS,
  formatMultiSelect,
} from '@/constants/labels'

function StatusBadge({ status, labels }: { status: string; labels: Record<string, string> }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-brand-cream-dark/50 dark:border-gray-700/50 last:border-0">
      <span className="text-sm text-brand-muted dark:text-gray-400">{label}</span>
      <span className="text-sm text-brand-text dark:text-gray-200 font-medium">{value || '—'}</span>
    </div>
  )
}

function SectionCard({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="bg-brand-white dark:bg-surface-dark-card rounded-card shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-text dark:text-gray-100">{title}</h2>
        {badge}
      </div>
      {children}
    </div>
  )
}

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useAdminUserDetail(id ?? '')
  const approveDocument = useApproveDocument()
  const rejectDocument = useRejectDocument()
  const updateUserStatus = useUpdateUserStatus()
  const deleteUsers = useDeleteUsers()

  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null)
  const [rejectingUser, setRejectingUser] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-[80px] min-h-screen bg-brand-cream dark:bg-surface-dark flex items-center justify-center">
          <p className="text-brand-muted dark:text-gray-400">Carregando...</p>
        </main>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-[80px] min-h-screen bg-brand-cream dark:bg-surface-dark flex items-center justify-center">
          <p className="text-brand-muted dark:text-gray-400">Usuário não encontrado.</p>
        </main>
      </>
    )
  }

  const { user, onboarding, documents } = data

  return (
    <>
      <Header />
      <main className="pt-[80px] min-h-screen bg-brand-cream dark:bg-surface-dark">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/admin/usuarios')}
            className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-text dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar para lista
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-text dark:text-gray-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {user.name ?? 'Sem nome'}
              </h1>
              <p className="text-sm text-brand-muted dark:text-gray-400 mt-1">{user.email}</p>
            </div>
            <StatusBadge status={user.accountStatus} labels={ACCOUNT_STATUS_LABELS} />
          </div>

          {/* Section 1: Personal Data */}
          <SectionCard title="Dados Pessoais">
            <InfoRow label="Nome" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="CPF" value={user.cpf} />
            <InfoRow label="Telefone" value={user.phone} />
            <InfoRow label="Tipo de Conta" value={ACCOUNT_TYPE_LABELS[user.accountType ?? '']} />
            <InfoRow label="Status da Conta" value={ACCOUNT_STATUS_LABELS[user.accountStatus]} />
            <InfoRow label="Status do Onboarding" value={ONBOARDING_STATUS_LABELS[user.onboardingStatus]} />
            <InfoRow label="Status dos Documentos" value={DOCUMENTS_STATUS_LABELS[user.documentsStatus]} />
            <InfoRow label="Cadastro em" value={new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
          </SectionCard>

          {/* Section 2: Clinical Profile */}
          <SectionCard
            title="Perfil Clínico"
            badge={onboarding ? <StatusBadge status={onboarding.status} labels={ONBOARDING_STATUS_LABELS} /> : undefined}
          >
            {onboarding ? (
              <>
                <InfoRow label="Condição" value={formatMultiSelect(onboarding.condition, CONDITION_LABELS)} />
                <InfoRow label="Experiência" value={EXPERIENCE_LABELS[onboarding.experience ?? '']} />
                {onboarding.currentAccessMethod && (
                  <InfoRow label="Forma de Acesso Atual" value={ACCESS_METHOD_LABELS[onboarding.currentAccessMethod]} />
                )}
                <InfoRow label="Forma de Uso Preferida" value={formatMultiSelect(onboarding.preferredForm, FORM_LABELS)} />
                <InfoRow label="Possui Receita Médica" value={onboarding.hasPrescription === true ? 'Sim' : onboarding.hasPrescription === false ? 'Não' : '—'} />
                <InfoRow label="Acesso Assistido" value={onboarding.assistedAccess === true ? 'Sim' : onboarding.assistedAccess === false ? 'Não' : '—'} />
                {onboarding.summary && (
                  <div className="mt-4 p-3 rounded-lg bg-brand-cream dark:bg-surface-dark text-sm text-brand-text dark:text-gray-300">
                    <span className="font-medium text-brand-muted dark:text-gray-400 block mb-1">Resumo</span>
                    {onboarding.summary}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-brand-muted dark:text-gray-400 py-4 text-center">
                Acolhimento não iniciado.
              </p>
            )}
          </SectionCard>

          {/* Section 3: Documents */}
          <SectionCard title="Documentos">
            {documents.length === 0 ? (
              <p className="text-sm text-brand-muted dark:text-gray-400 py-4 text-center">
                Nenhum documento enviado.
              </p>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-brand-cream-dark dark:border-gray-700 rounded-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-brand-text dark:text-gray-200">
                          {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                        </span>
                        <StatusBadge status={doc.status} labels={DOCUMENT_STATUS_LABELS} />
                      </div>
                      <span className="text-xs text-brand-muted dark:text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {doc.url && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-brand-cream-dark dark:border-gray-700 bg-brand-cream dark:bg-surface-dark">
                        {doc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img src={doc.url} alt={doc.type} className="max-h-[300px] w-full object-contain" />
                        ) : doc.url.match(/\.pdf$/i) ? (
                          <iframe src={doc.url} className="w-full h-[400px]" title={doc.type} />
                        ) : (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm text-brand-green-mid hover:underline">
                            Abrir documento
                          </a>
                        )}
                      </div>
                    )}

                    {doc.rejectionReason && (
                      <div className="mb-3 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
                        <span className="font-medium">Motivo da rejeição: </span>{doc.rejectionReason}
                      </div>
                    )}

                    {doc.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveDocument.mutate(doc.id)}
                          disabled={approveDocument.isPending}
                          className="px-3 py-1.5 rounded-btn text-xs font-medium bg-brand-green-deep text-white hover:bg-brand-green-mid disabled:opacity-50 transition-colors"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => setRejectingDocId(doc.id)}
                          className="px-3 py-1.5 rounded-btn text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Section 4: Actions */}
          <SectionCard title="Ações">
            <div className="flex flex-wrap gap-3">
              {user.accountStatus === 'pending' && (
                <>
                  <button
                    onClick={() => updateUserStatus.mutate({ userId: user.id, accountStatus: 'approved' })}
                    disabled={updateUserStatus.isPending}
                    className="px-6 py-2.5 rounded-btn text-sm font-medium bg-brand-green-deep text-white hover:bg-brand-green-mid disabled:opacity-50 transition-colors"
                  >
                    {updateUserStatus.isPending ? 'Processando...' : 'Aprovar Paciente'}
                  </button>
                  <button
                    onClick={() => setRejectingUser(true)}
                    disabled={updateUserStatus.isPending}
                    className="px-6 py-2.5 rounded-btn text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Rejeitar Paciente
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2.5 rounded-btn text-sm font-medium border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Excluir cadastro
              </button>
            </div>
          </SectionCard>
        </div>
      </main>

      {/* Document rejection modal */}
      {rejectingDocId && (
        <RejectionModal
          title="Rejeitar Documento"
          isLoading={rejectDocument.isPending}
          onCancel={() => setRejectingDocId(null)}
          onConfirm={(reason) => {
            rejectDocument.mutate(
              { documentId: rejectingDocId, reason },
              { onSuccess: () => setRejectingDocId(null) },
            )
          }}
        />
      )}

      {/* User rejection modal */}
      {rejectingUser && (
        <RejectionModal
          title="Rejeitar Paciente"
          isLoading={updateUserStatus.isPending}
          onCancel={() => setRejectingUser(false)}
          onConfirm={() => {
            updateUserStatus.mutate(
              { userId: user.id, accountStatus: 'rejected' },
              { onSuccess: () => setRejectingUser(false) },
            )
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-brand-white dark:bg-surface-dark-card rounded-card w-full max-w-md mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-brand-text dark:text-gray-100 mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-brand-muted dark:text-gray-400 mb-6">
              Todos os dados de <strong>{user.name ?? user.email}</strong> serão excluídos permanentemente
              (onboarding, documentos, sessões). Essa ação é irreversível.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteUsers.isPending}
                className="px-4 py-2 rounded-btn text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteUsers.mutate([user.id], {
                    onSuccess: () => navigate('/admin/usuarios'),
                  })
                }}
                disabled={deleteUsers.isPending}
                className="px-4 py-2 rounded-btn text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteUsers.isPending ? 'Excluindo...' : 'Excluir definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
