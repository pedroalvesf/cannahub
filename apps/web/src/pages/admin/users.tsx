import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAdminUsers, useDeleteUsers } from '@/hooks/use-admin'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_STATUS_LABELS,
  ONBOARDING_STATUS_LABELS,
  DOCUMENTS_STATUS_LABELS,
  STATUS_BADGE_COLORS,
} from '@/constants/labels'

function StatusBadge({ status, labels }: { status: string; labels: Record<string, string> }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}

export function AdminUsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [accountStatus, setAccountStatus] = useState('')
  const [accountType, setAccountType] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const perPage = 20

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    accountStatus: accountStatus || undefined,
    accountType: accountType || undefined,
    page,
    perPage,
  })

  const deleteUsers = useDeleteUsers()
  const totalPages = data ? Math.ceil(data.total / perPage) : 0
  const allOnPageSelected = data?.users.length
    ? data.users.every((u) => selectedIds.has(u.id))
    : false

  function toggleSelectAll() {
    if (!data?.users) return
    const next = new Set(selectedIds)
    if (allOnPageSelected) {
      data.users.forEach((u) => next.delete(u.id))
    } else {
      data.users.forEach((u) => next.add(u.id))
    }
    setSelectedIds(next)
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function handleBulkDelete() {
    deleteUsers.mutate([...selectedIds], {
      onSuccess: () => {
        setSelectedIds(new Set())
        setShowDeleteConfirm(false)
      },
    })
  }

  return (
    <>
      <Header />
      <main className="pt-[80px] min-h-screen bg-brand-cream dark:bg-surface-dark">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-brand-text dark:text-gray-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Painel de Aprovação
            </h1>

            {/* Bulk delete */}
            {selectedIds.size > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-btn text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Excluir {selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="flex-1 min-w-[200px] rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-white dark:bg-surface-dark-card px-4 py-2 text-sm text-brand-text dark:text-gray-200 placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green-light"
            />
            <select
              value={accountStatus}
              onChange={(e) => { setAccountStatus(e.target.value); setPage(1) }}
              className="rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-white dark:bg-surface-dark-card px-3 py-2 text-sm text-brand-text dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <select
              value={accountType}
              onChange={(e) => { setAccountType(e.target.value); setPage(1) }}
              className="rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-white dark:bg-surface-dark-card px-3 py-2 text-sm text-brand-text dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light"
            >
              <option value="">Todos os tipos</option>
              <option value="patient">Paciente</option>
              <option value="guardian">Responsável Legal</option>
              <option value="prescriber">Prescritor</option>
              <option value="veterinarian">Veterinário</option>
              <option value="caregiver">Cuidador</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-brand-white dark:bg-surface-dark-card rounded-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-cream-dark dark:border-gray-700">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected && (data?.users.length ?? 0) > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-brand-cream-dark accent-brand-green-deep"
                      />
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400 hidden md:table-cell">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400">Conta</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400 hidden lg:table-cell">Onboarding</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400 hidden lg:table-cell">Documentos</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-muted dark:text-gray-400 hidden md:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-brand-muted dark:text-gray-400">
                        Carregando...
                      </td>
                    </tr>
                  ) : data?.users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-brand-muted dark:text-gray-400">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    data?.users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-brand-cream-dark/50 dark:border-gray-700/50 hover:bg-brand-green-pale/30 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            className="rounded border-brand-cream-dark accent-brand-green-deep"
                          />
                        </td>
                        <td
                          className="px-4 py-3 text-brand-text dark:text-gray-200 font-medium cursor-pointer"
                          onClick={() => navigate(`/admin/usuarios/${user.id}`)}
                        >
                          {user.name ?? '—'}
                        </td>
                        <td
                          className="px-4 py-3 text-brand-muted dark:text-gray-400 cursor-pointer"
                          onClick={() => navigate(`/admin/usuarios/${user.id}`)}
                        >
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-brand-muted dark:text-gray-400 hidden md:table-cell">
                          {ACCOUNT_TYPE_LABELS[user.accountType ?? ''] ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.accountStatus} labels={ACCOUNT_STATUS_LABELS} />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <StatusBadge status={user.onboardingStatus} labels={ONBOARDING_STATUS_LABELS} />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <StatusBadge status={user.documentsStatus} labels={DOCUMENTS_STATUS_LABELS} />
                        </td>
                        <td className="px-4 py-3 text-brand-muted dark:text-gray-400 hidden md:table-cell">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-brand-cream-dark dark:border-gray-700">
                <span className="text-sm text-brand-muted dark:text-gray-400">
                  {data?.total} usuário{data?.total !== 1 ? 's' : ''} no total
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded text-sm text-brand-muted hover:text-brand-text dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-brand-text dark:text-gray-200">
                    {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded text-sm text-brand-muted hover:text-brand-text dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-brand-white dark:bg-surface-dark-card rounded-card w-full max-w-md mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-brand-text dark:text-gray-100 mb-2">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-brand-muted dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir <strong>{selectedIds.size}</strong> registro{selectedIds.size > 1 ? 's' : ''}?
              Essa ação é irreversível — todos os dados (onboarding, documentos, sessões) serão apagados.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteUsers.isPending}
                className="px-4 py-2 rounded-btn text-sm font-medium text-brand-muted hover:text-brand-text dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkDelete}
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
