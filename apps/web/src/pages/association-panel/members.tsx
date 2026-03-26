import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAssociationMembers, useApproveLink, useRejectLink, useRemoveMember } from '@/hooks/use-association-panel'

const STATUS_LABELS: Record<string, string> = {
  requested: 'Pendente',
  active: 'Ativo',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
}

const FEE_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Em atraso',
  exempt: 'Isento',
}

export function AssociationMembersPage() {
  const [searchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') ?? ''
  const [statusFilter, setStatusFilter] = useState(initialStatus)

  const { data, isLoading } = useAssociationMembers(statusFilter || undefined)
  const approveLink = useApproveLink()
  const rejectLink = useRejectLink()
  const removeMember = useRemoveMember()

  const links = data?.links ?? []

  return (
    <>
      <Header />
      <div className="min-h-screen bg-brand-off dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="mb-8">
            <Link to="/associacao/painel" className="text-[12px] text-brand-muted hover:text-brand-green-light mb-1 inline-block">&larr; Painel</Link>
            <h1 className="font-serif text-[28px] text-brand-text dark:text-white leading-[1.1]">Associados</h1>
          </div>

          {/* Status filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { value: '', label: 'Todos' },
              { value: 'requested', label: 'Pendentes' },
              { value: 'active', label: 'Ativos' },
              { value: 'rejected', label: 'Recusados' },
              { value: 'cancelled', label: 'Cancelados' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-[12px] rounded-btn border transition-colors ${statusFilter === opt.value ? 'bg-brand-green-deep text-white border-brand-green-deep' : 'bg-white dark:bg-surface-dark-card border-brand-cream-dark dark:border-gray-700 text-brand-muted'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* List */}
          {isLoading ? (
            <div className="text-center py-16 text-brand-muted">Carregando...</div>
          ) : links.length === 0 ? (
            <div className="text-center py-16 text-brand-muted">
              Nenhum vínculo {statusFilter ? `com status "${STATUS_LABELS[statusFilter] ?? statusFilter}"` : 'encontrado'}.
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[14px] px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium text-brand-text dark:text-white font-mono truncate">{link.patientId}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-btn ${STATUS_COLORS[link.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {STATUS_LABELS[link.status] ?? link.status}
                        </span>
                        {link.feeStatus && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-btn bg-brand-cream dark:bg-gray-700 text-brand-muted dark:text-gray-400">
                            Anuidade: {FEE_LABELS[link.feeStatus] ?? link.feeStatus}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-brand-text-xs dark:text-gray-500">
                        Solicitado em {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                        {link.startDate && ` · Ativo desde ${new Date(link.startDate).toLocaleDateString('pt-BR')}`}
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {link.status === 'requested' && (
                        <>
                          <button
                            onClick={() => approveLink.mutate(link.id)}
                            disabled={approveLink.isPending}
                            className="px-3 py-1.5 text-[12px] font-semibold text-white bg-brand-green-deep rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-50"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => rejectLink.mutate(link.id)}
                            disabled={rejectLink.isPending}
                            className="px-3 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-btn hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {link.status === 'active' && (
                        <button
                          onClick={() => removeMember.mutate(link.id)}
                          disabled={removeMember.isPending}
                          className="px-3 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 dark:border-red-800 rounded-btn hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
