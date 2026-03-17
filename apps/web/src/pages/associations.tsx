import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { sampleAssociations } from '@/data/sample-associations'
import type { Association } from '@/data/sample-associations'

const allRegions = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte']
const allProductTypes = [...new Set(sampleAssociations.flatMap((a) => a.productTypes))].sort()
const allPatientTypes = [...new Set(sampleAssociations.flatMap((a) => a.patientTypes))].sort()

export function AssociationsPage() {
  const [search, setSearch] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [assistedOnly, setAssistedOnly] = useState(false)

  const filtered = useMemo(() => {
    return sampleAssociations.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.city.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedRegions.length && !selectedRegions.includes(a.region)) return false
      if (selectedProducts.length && !selectedProducts.some((p) => a.productTypes.includes(p))) return false
      if (selectedPatients.length && !selectedPatients.some((p) => a.patientTypes.includes(p))) return false
      if (assistedOnly && !a.assistedAccess) return false
      return true
    })
  }, [search, selectedRegions, selectedProducts, selectedPatients, assistedOnly])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-2">
            Associações Credenciadas
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-6 max-w-[560px]">
            Encontre associações verificadas que oferecem cannabis medicinal com segurança jurídica e acompanhamento.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 dark:text-gray-600">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou cidade..."
              className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-brand-cream-dark dark:border-gray-800 bg-brand-white dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-light transition-colors shadow-soft"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <FilterSection
              title="Região"
              options={allRegions}
              selected={selectedRegions}
              onToggle={(v) => toggle(selectedRegions, v, setSelectedRegions)}
              counts={allRegions.map((r) => sampleAssociations.filter((a) => a.region === r).length)}
            />
            <FilterSection
              title="Produtos"
              options={allProductTypes}
              selected={selectedProducts}
              onToggle={(v) => toggle(selectedProducts, v, setSelectedProducts)}
              counts={allProductTypes.map((p) => sampleAssociations.filter((a) => a.productTypes.includes(p)).length)}
            />
            <FilterSection
              title="Perfil de Paciente"
              options={allPatientTypes}
              selected={selectedPatients}
              onToggle={(v) => toggle(selectedPatients, v, setSelectedPatients)}
              counts={allPatientTypes.map((p) => sampleAssociations.filter((a) => a.patientTypes.includes(p)).length)}
            />

            {/* Assisted access toggle */}
            <div className="mt-5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${
                    assistedOnly
                      ? 'bg-brand-green-deep border-brand-green-deep'
                      : 'border-brand-cream-dark dark:border-gray-700 group-hover:border-brand-green-deep/50'
                  }`}
                  onClick={() => setAssistedOnly(!assistedOnly)}
                >
                  {assistedOnly && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium text-brand-muted dark:text-gray-400">
                  Acesso assistido
                </span>
              </label>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-xs text-brand-muted dark:text-gray-500 mb-4">
              {filtered.length} associação{filtered.length !== 1 ? 'ões' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((association) => (
                <AssociationCard key={association.id} association={association} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-brand-muted dark:text-gray-500 text-sm">
                  Nenhuma associação encontrada com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── Association Card ──────────────────────────────────── */

function AssociationCard({ association }: { association: Association }) {
  const user = useAuthStore((s) => s.user)
  const isApproved = user?.status === 'approved'

  return (
    <div className="rounded-card border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card overflow-hidden hover:border-brand-green-deep/30 transition-colors shadow-soft">
      {/* Top bar */}
      <Link to={`/associacoes/${association.slug}`} className="block bg-brand-green-deep px-5 py-3 no-underline">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-brand-green-mid flex items-center justify-center shrink-0">
              <span className="font-serif text-sm text-brand-white">
                {association.name.split(' ').slice(-1)[0]?.[0] ?? 'A'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-white leading-tight">
                {association.name}
              </h3>
              <p className="text-[11px] text-brand-white/50">
                {association.city}, {association.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {association.verified && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-btn bg-brand-white/10 text-[10px] font-medium text-brand-green-pale">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verificada
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5">
        <p className="text-[13px] font-light text-brand-muted dark:text-gray-400 leading-[1.7] line-clamp-3">
          {association.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {association.productTypes.map((type) => (
            <span key={type} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-cream dark:bg-gray-800 text-brand-green-deep dark:text-gray-400">
              {type}
            </span>
          ))}
          {association.assistedAccess && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Acesso assistido
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-5 text-[11px] text-brand-muted dark:text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            {association.memberCount} membros
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Desde {association.foundedYear}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {association.region}
          </span>
        </div>

        {/* Perfis atendidos */}
        <div className="mt-3 pt-3 border-t border-brand-cream-dark/60 dark:border-gray-800">
          <p className="text-[10px] font-bold text-brand-green-deep dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Perfis atendidos
          </p>
          <div className="flex flex-wrap gap-1">
            {association.patientTypes.map((type) => (
              <span key={type} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-green-pale/60 dark:bg-brand-green-deep/20 text-brand-green-deep dark:text-brand-green-light">
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          {isApproved ? (
            <button className="w-full text-[13px] font-semibold text-brand-white bg-brand-green-deep py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors">
              Solicitar Vínculo
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-brand-cream/60 dark:bg-gray-800/50 rounded-[12px] px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-sand dark:text-gray-600 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <p className="text-[11px] text-brand-muted dark:text-gray-500 leading-[1.5]">
                Solicite vínculo após{' '}
                <Link to="/quiz" className="text-brand-green-mid hover:underline font-medium no-underline">
                  aprovação cadastral
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Sidebar Filter Section ─────────────────────────────── */

function FilterSection({
  title,
  options,
  selected,
  onToggle,
  counts,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  counts: number[]
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="mb-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-xs font-bold text-brand-green-deep dark:text-gray-300 uppercase tracking-wider">
          {title}
        </h3>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-brand-muted/40 dark:text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1">
          {options.map((opt, i) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer py-1 group"
            >
              <div
                className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${
                  selected.includes(opt)
                    ? 'bg-brand-green-deep border-brand-green-deep'
                    : 'border-brand-cream-dark dark:border-gray-700 group-hover:border-brand-green-deep/50'
                }`}
              >
                {selected.includes(opt) && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-normal text-brand-muted dark:text-gray-400 flex-1">
                {opt}
              </span>
              <span className="text-[10px] text-brand-muted/40 dark:text-gray-600">
                ({counts[i]})
              </span>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
