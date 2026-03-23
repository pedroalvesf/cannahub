import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { sampleAssociations } from '@/data/sample-associations'
import type { Association } from '@/data/sample-associations'

const allRegions = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte']
const allProductTypes = [...new Set(sampleAssociations.flatMap((a) => a.productTypes))].sort()
const allPatientTypes = [...new Set(sampleAssociations.flatMap((a) => a.patientTypes))].sort()

const totalMembers = sampleAssociations.reduce((sum, a) => sum + a.memberCount, 0)

export function AssociationsPage() {
  const [search, setSearch] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [assistedOnly, setAssistedOnly] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const hasActiveFilters = selectedRegions.length > 0 || selectedProducts.length > 0 || selectedPatients.length > 0 || assistedOnly

  const filtered = useMemo(() => {
    return sampleAssociations.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.city.toLowerCase().includes(search.toLowerCase()) && !a.state.toLowerCase().includes(search.toLowerCase())) return false
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

  function clearFilters() {
    setSelectedRegions([])
    setSelectedProducts([])
    setSelectedPatients([])
    setAssistedOnly(false)
  }

  return (
    <div className="min-h-screen bg-brand-off dark:bg-surface-dark">
      <Header />

      {/* Hero */}
      <section className="relative bg-brand-cream dark:bg-brand-green-deep border-b border-brand-cream-dark dark:border-brand-green-mid pt-[80px] overflow-hidden">
        {/* Decorative number */}
        <div className="absolute -right-2 -top-2 font-serif text-[clamp(120px,18vw,220px)] text-brand-green-deep dark:text-white opacity-[0.04] leading-none tracking-tighter pointer-events-none select-none">
          {sampleAssociations.length}+
        </div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-20 pt-16 pb-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[11.5px] text-brand-text-xs dark:text-brand-green-xs uppercase tracking-[0.1em] font-medium mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-brand-green-light" />
            Associações credenciadas
          </div>

          <h1 className="font-serif text-[clamp(38px,5.5vw,64px)] text-brand-text dark:text-white leading-[1.06] tracking-tight mb-3.5 max-w-[700px]">
            Encontre a associação{' '}
            <em className="text-brand-green-light dark:text-brand-green-xs">certa para o seu caso.</em>
          </h1>

          <p className="text-[17px] text-brand-muted dark:text-brand-text-xs max-w-[520px] leading-[1.68] mb-9 font-light">
            Associações de pacientes são a via mais acessível ao tratamento legal.{' '}
            <strong className="text-brand-text-md dark:text-brand-green-pale font-medium">
              A CannHub verifica e credencia cada uma
            </strong>{' '}
            — você escolhe com segurança.
          </p>

          {/* Search bar */}
          <div className="bg-white dark:bg-surface-dark-card border-[1.5px] border-brand-cream-dark dark:border-brand-green-mid rounded-[14px] grid grid-cols-1 md:grid-cols-[1fr_auto] overflow-hidden transition-colors focus-within:border-brand-green-light focus-within:shadow-[0_0_0_3px_rgba(61,106,39,0.1)]">
            <div className="flex items-center gap-2.5 px-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand-text-xs dark:text-brand-muted shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, cidade ou estado..."
                className="w-full py-[18px] bg-transparent text-[15px] text-brand-text dark:text-gray-200 placeholder-brand-text-xs dark:placeholder-brand-muted font-sans outline-none"
              />
            </div>
            <button className="m-2 px-6 py-2.5 bg-brand-green-deep dark:bg-brand-green-light text-white text-sm font-medium rounded-[10px] hover:bg-brand-green-mid dark:hover:bg-brand-green-mid transition-colors whitespace-nowrap hidden md:block">
              Buscar
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-5 border-t border-brand-cream-dark dark:border-brand-green-mid mt-6">
            <div className="flex items-center gap-[7px] text-[13px] text-brand-muted dark:text-brand-text-xs">
              <span className="font-serif text-xl text-brand-text dark:text-white">{sampleAssociations.length}</span>
              associações ativas
            </div>
            <div className="w-px h-4 bg-brand-cream-dark dark:bg-brand-green-mid hidden sm:block" />
            <div className="flex items-center gap-[7px] text-[13px] text-brand-muted dark:text-brand-text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-text-xs">
                <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              todas verificadas pela CannHub
            </div>
            <div className="w-px h-4 bg-brand-cream-dark dark:bg-brand-green-mid hidden sm:block" />
            <div className="flex items-center gap-[7px] text-[13px] text-brand-muted dark:text-brand-text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-text-xs">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              {totalMembers.toLocaleString('pt-BR')} pacientes atendidos
            </div>
          </div>
        </div>
      </section>

      {/* Tabs bar */}
      <div className="bg-white dark:bg-surface-dark-card border-b border-brand-cream-dark dark:border-brand-green-mid">
        <div className="max-w-[1100px] mx-auto px-6 md:px-20 flex items-center justify-between">
          <div className="flex">
            <button className="flex items-center gap-[7px] py-3.5 px-[18px] text-[13.5px] font-medium text-brand-green-deep dark:text-brand-green-light border-b-2 border-brand-green-deep dark:border-brand-green-light">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Lista
            </button>
            <button className="flex items-center gap-[7px] py-3.5 px-[18px] text-[13.5px] text-brand-muted dark:text-gray-500 border-b-2 border-transparent cursor-default">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              Mapa
              <span className="text-[10px] bg-brand-cream dark:bg-brand-green-deep text-brand-text-xs dark:text-brand-muted px-1.5 py-px rounded-[10px] ml-0.5">
                Em breve
              </span>
            </button>
          </div>
          <div className="text-[13px] text-brand-text-xs dark:text-brand-muted">
            <strong className="text-brand-text-md dark:text-gray-300">{filtered.length}</strong> encontrada{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-20 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-brand-green-mid rounded-[12px] text-sm text-brand-text-md dark:text-gray-300"
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-brand-green-deep text-white text-[10px] flex items-center justify-center font-medium">
                {selectedRegions.length + selectedProducts.length + selectedPatients.length + (assistedOnly ? 1 : 0)}
              </span>
            )}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-brand-muted transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Sidebar filters */}
        <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block md:sticky md:top-[80px]`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-sm font-medium text-brand-text dark:text-gray-200">Filtros</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[12.5px] text-brand-green-deep dark:text-brand-green-light hover:underline bg-transparent border-none font-sans cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          <FilterSection
            title="Região"
            options={allRegions}
            selected={selectedRegions}
            onToggle={(v) => toggle(selectedRegions, v, setSelectedRegions)}
            counts={allRegions.map((r) => sampleAssociations.filter((a) => a.region === r).length)}
          />
          <div className="h-px bg-brand-cream-dark dark:bg-brand-green-mid my-[18px]" />

          <FilterSection
            title="Produtos"
            options={allProductTypes}
            selected={selectedProducts}
            onToggle={(v) => toggle(selectedProducts, v, setSelectedProducts)}
            counts={allProductTypes.map((p) => sampleAssociations.filter((a) => a.productTypes.includes(p)).length)}
          />
          <div className="h-px bg-brand-cream-dark dark:bg-brand-green-mid my-[18px]" />

          <FilterSection
            title="Perfil atendido"
            options={allPatientTypes}
            selected={selectedPatients}
            onToggle={(v) => toggle(selectedPatients, v, setSelectedPatients)}
            counts={allPatientTypes.map((p) => sampleAssociations.filter((a) => a.patientTypes.includes(p)).length)}
          />
          <div className="h-px bg-brand-cream-dark dark:bg-brand-green-mid my-[18px]" />

          {/* Assisted access filter */}
          <div
            className="flex items-center justify-between cursor-pointer py-1 group"
            onClick={() => setAssistedOnly(!assistedOnly)}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded border-[1.5px] transition-colors flex items-center justify-center ${
                  assistedOnly
                    ? 'bg-brand-green-deep dark:bg-brand-green-light border-brand-green-deep dark:border-brand-green-light'
                    : 'border-brand-cream-dark dark:border-brand-muted group-hover:border-brand-green-deep/50'
                }`}
              >
                {assistedOnly && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-brand-text-md dark:text-gray-400">Acesso assistido</span>
            </div>
            <span className="text-[11.5px] text-brand-text-xs dark:text-brand-muted">
              {sampleAssociations.filter((a) => a.assistedAccess).length}
            </span>
          </div>
        </aside>

        {/* Cards column */}
        <div>
          {/* Map hint */}
          <div className="bg-brand-cream dark:bg-brand-green-deep border border-brand-cream-dark dark:border-brand-green-mid rounded-[12px] px-[18px] py-3.5 flex items-center gap-3 mb-[18px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-light shrink-0">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <p className="text-[13px] text-brand-muted dark:text-brand-text-xs flex-1">
              <strong className="text-brand-text-md dark:text-gray-300 font-medium">Prefere visualizar no mapa?</strong>{' '}
              A visualização geográfica das associações está chegando em breve.
            </p>
          </div>

          {/* Association list */}
          <div className="flex flex-col gap-4">
            {filtered.map((association, index) => (
              <AssociationCard
                key={association.id}
                association={association}
                featured={index === 0 && !hasActiveFilters && !search}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-brand-cream-dark dark:text-brand-green-mid">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-brand-muted dark:text-gray-500 text-sm mb-2">
                Nenhuma associação encontrada com os filtros selecionados.
              </p>
              <button
                onClick={clearFilters}
                className="text-[13px] text-brand-green-deep dark:text-brand-green-light hover:underline font-medium bg-transparent border-none cursor-pointer font-sans"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Association Card ──────────────────────────────────── */

function AssociationCard({ association, featured }: { association: Association; featured?: boolean }) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isApproved = user?.accountStatus === 'approved'

  const initials = association.name
    .split(' ')
    .filter((w) => w.length > 2 || association.name.split(' ').length <= 2)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <div
      className={`bg-white dark:bg-surface-dark-card border rounded-card overflow-hidden transition-all hover:shadow-card group ${
        featured
          ? 'border-brand-green-light dark:border-brand-green-light border-[1.5px]'
          : 'border-brand-cream-dark dark:border-brand-green-mid hover:border-brand-green-light dark:hover:border-brand-green-light'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        {/* Photo placeholder */}
        <div
          className={`hidden md:flex flex-col items-center justify-center gap-2 px-5 py-5 min-h-[220px] border-r border-brand-cream-dark dark:border-brand-green-mid relative ${
            featured
              ? 'bg-brand-green-pale dark:bg-brand-green-deep'
              : 'bg-brand-cream-dark/50 dark:bg-brand-green-deep/50'
          }`}
        >
          {/* Crosshair lines */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-brand-cream-darker/35 dark:bg-brand-green-mid/40" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-brand-cream-darker/35 dark:bg-brand-green-mid/40" />
          <div className="w-[52px] h-[52px] rounded-[12px] bg-brand-off dark:bg-surface-dark flex items-center justify-center font-serif text-xl text-brand-green-light dark:text-brand-green-xs relative z-[1]">
            {initials}
          </div>
          <div className="text-[9.5px] text-brand-text-xs dark:text-brand-muted uppercase tracking-wide text-center leading-[1.4] relative z-[1]">
            Foto da sede
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:px-[26px] md:py-[22px] flex flex-col gap-3">
          {/* Header: name + verified */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                to={`/associacoes/${association.slug}`}
                className="font-serif text-[19px] text-brand-text dark:text-white leading-[1.2] mb-[3px] hover:text-brand-green-deep dark:hover:text-brand-green-pale transition-colors no-underline block"
              >
                {association.name}
              </Link>
              <div className="flex items-center gap-[5px] text-[13px] text-brand-muted dark:text-brand-text-xs">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-text-xs shrink-0">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {association.city}, {association.state} — {association.region}
              </div>
            </div>
            {association.verified && (
              <span className="inline-flex items-center gap-[5px] bg-brand-green-pale dark:bg-brand-green-deep border border-brand-green-xs dark:border-brand-green-mid rounded-btn px-2.5 py-1 text-[11.5px] text-brand-green-light dark:text-brand-green-xs font-medium whitespace-nowrap shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L4 6V12C4 16.42 7.56 20.57 12 22C16.44 20.57 20 16.42 20 12V6L12 2Z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Verificada
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[13.5px] text-brand-muted dark:text-brand-text-xs leading-[1.65] line-clamp-3">
            {association.description}
          </p>

          {/* Product tags */}
          <div className="flex gap-1.5 flex-wrap">
            {association.productTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-[5px] bg-brand-off dark:bg-surface-dark border border-brand-cream-dark dark:border-brand-green-mid rounded-[6px] px-[9px] py-[3px] text-[12px] text-brand-text-md dark:text-brand-text-xs"
              >
                {type}
              </span>
            ))}
            {association.assistedAccess && (
              <span className="inline-flex items-center gap-[5px] bg-[#FFF8E8] dark:bg-amber-900/20 border border-[#F0C060] dark:border-amber-700/40 rounded-[6px] px-[9px] py-[3px] text-[12px] text-[#7A5010] dark:text-amber-400">
                Acesso assistido
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap">
            <div className="flex items-center gap-[5px] text-[12.5px] text-brand-text-xs dark:text-brand-muted pr-3.5 mr-3.5 border-r border-brand-cream-dark dark:border-brand-green-mid">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
              </svg>
              {association.memberCount} membros
            </div>
            <div className="flex items-center gap-[5px] text-[12.5px] text-brand-text-xs dark:text-brand-muted pr-3.5 mr-3.5 border-r border-brand-cream-dark dark:border-brand-green-mid">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Fundada em {association.foundedYear}
            </div>
            <div className="flex items-center gap-[5px] text-[12.5px] text-brand-text-xs dark:text-brand-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {association.region}
            </div>
          </div>

          {/* Footer: profiles + CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {association.patientTypes.map((type) => (
                <span
                  key={type}
                  className="text-[11.5px] text-brand-muted dark:text-brand-text-xs bg-brand-cream dark:bg-brand-green-deep border border-brand-cream-dark dark:border-brand-green-mid rounded-btn px-2.5 py-[3px]"
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isAuthenticated && (
                <span className="flex items-center gap-[5px] text-[12px] text-brand-text-xs dark:text-brand-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Solicite após cadastro
                </span>
              )}
              {isAuthenticated && !isApproved && (
                <span className="flex items-center gap-[5px] text-[12px] text-brand-text-xs dark:text-brand-muted">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Cadastro pendente
                </span>
              )}
              {isApproved && (
                <Link
                  to={`/associacoes/${association.slug}/catalogo`}
                  className="text-[13px] font-medium text-brand-green-deep dark:text-brand-green-light no-underline px-3.5 py-[7px] border border-brand-green-pale dark:border-brand-green-mid rounded-[8px] bg-brand-green-pale dark:bg-brand-green-deep/50 hover:bg-brand-green-deep hover:text-white hover:border-brand-green-deep dark:hover:bg-brand-green-light dark:hover:text-white dark:hover:border-brand-green-light transition-all"
                >
                  Ver catálogo
                </Link>
              )}
              <Link
                to={`/associacoes/${association.slug}`}
                className="text-[13px] font-medium text-brand-green-deep dark:text-brand-green-light no-underline px-3.5 py-[7px] border border-brand-green-pale dark:border-brand-green-mid rounded-[8px] bg-brand-green-pale dark:bg-brand-green-deep/50 hover:bg-brand-green-deep hover:text-white hover:border-brand-green-deep dark:hover:bg-brand-green-light dark:hover:text-white dark:hover:border-brand-green-light transition-all"
              >
                Ver associação &rarr;
              </Link>
            </div>
          </div>
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
  return (
    <div>
      <div className="text-[11px] text-brand-text-xs dark:text-brand-muted uppercase tracking-[0.1em] font-medium mb-2.5">
        {title}
      </div>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => (
          <div
            key={opt}
            className="flex items-center justify-between cursor-pointer py-1 group"
            onClick={() => onToggle(opt)}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded border-[1.5px] transition-colors flex items-center justify-center ${
                  selected.includes(opt)
                    ? 'bg-brand-green-deep dark:bg-brand-green-light border-brand-green-deep dark:border-brand-green-light'
                    : 'border-brand-cream-dark dark:border-brand-muted group-hover:border-brand-green-deep/50 dark:group-hover:border-brand-green-light/50'
                }`}
              >
                {selected.includes(opt) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-brand-text-md dark:text-gray-400">{opt}</span>
            </div>
            <span className="text-[11.5px] text-brand-text-xs dark:text-brand-muted">{counts[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
