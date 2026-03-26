import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAssociationDashboard } from '@/hooks/use-association-panel'

export function AssociationDashboardPage() {
  const { data, isLoading } = useAssociationDashboard()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-brand-off dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="text-[11px] text-brand-text-xs uppercase tracking-[0.1em] font-medium mb-2">Painel da Associação</div>
            <h1 className="font-serif text-[28px] text-brand-text dark:text-white leading-[1.1]">
              {isLoading ? 'Carregando...' : data?.associationName}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                label: 'Associados ativos',
                value: data?.membersCount ?? 0,
                href: '/associacao/associados',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-light">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                label: 'Vínculos pendentes',
                value: data?.pendingLinksCount ?? 0,
                href: '/associacao/associados?status=requested',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                ),
              },
              {
                label: 'Produtos no catálogo',
                value: data?.productsCount ?? 0,
                href: '/associacao/produtos',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                ),
              },
            ].map((stat) => (
              <Link
                key={stat.label}
                to={stat.href}
                className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[16px] p-6 hover:border-brand-green-light transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-[36px] h-[36px] bg-brand-green-pale dark:bg-gray-700 rounded-[10px] flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-[12px] text-brand-muted dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
                <div className="text-[32px] font-bold text-brand-text dark:text-white leading-none">
                  {isLoading ? '—' : stat.value}
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-6">
            <h2 className="text-[15px] font-medium text-brand-text dark:text-white mb-4">Ações rápidas</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/associacao/produtos"
                className="px-5 py-2.5 bg-brand-green-deep text-white text-[13px] font-semibold rounded-btn hover:bg-brand-green-mid transition-colors"
              >
                Gerenciar catálogo
              </Link>
              <Link
                to="/associacao/associados"
                className="px-5 py-2.5 bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 text-brand-text dark:text-white text-[13px] font-medium rounded-btn hover:border-brand-green-light transition-colors"
              >
                Ver associados
              </Link>
              <Link
                to="/associacao/perfil"
                className="px-5 py-2.5 bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 text-brand-text dark:text-white text-[13px] font-medium rounded-btn hover:border-brand-green-light transition-colors"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
