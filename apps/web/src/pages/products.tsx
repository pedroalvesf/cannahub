import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

interface Product {
  id: string
  name: string
  type: 'Óleo' | 'Gummy' | 'Cápsula' | 'Flor' | 'Tópico'
  strain: string
  concentration: string
  cbd: number
  thc: number
  volume: string
  association: string
  price: string
  inStock: boolean
  description: string
}

const sampleProducts: Product[] = [
  {
    id: '1', name: 'Óleo Full Spectrum 1%', type: 'Óleo',
    strain: 'Charlotte\'s Web', concentration: '1% CBD (10mg/ml)',
    cbd: 1, thc: 0, volume: '30ml',
    association: 'Associação Esperança Verde',
    price: 'R$ 150,00', inStock: true,
    description: 'Óleo sublingual de amplo espectro, ideal para iniciantes. Baixa concentração para ajuste gradual de dose.',
  },
  {
    id: '2', name: 'Óleo Full Spectrum 2%', type: 'Óleo',
    strain: 'ACDC', concentration: '2% CBD (20mg/ml)',
    cbd: 2, thc: 0.1, volume: '30ml',
    association: 'Associação Flor da Terra',
    price: 'R$ 220,00', inStock: true,
    description: 'Concentração intermediária para pacientes em fase de titulação. Extração CO₂ supercrítico.',
  },
  {
    id: '3', name: 'Óleo Full Spectrum 3%', type: 'Óleo',
    strain: 'Cannatonic', concentration: '3% CBD (30mg/ml)',
    cbd: 3, thc: 0.2, volume: '30ml',
    association: 'Associação Cura Natural',
    price: 'R$ 280,00', inStock: true,
    description: 'Concentração para uso contínuo em quadros de ansiedade e dor moderada. Terpenos preservados.',
  },
  {
    id: '4', name: 'Óleo Full Spectrum 4%', type: 'Óleo',
    strain: 'Amnesia Haze', concentration: '4% CBD (40mg/ml)',
    cbd: 4, thc: 0.3, volume: '30ml',
    association: 'Associação Esperança Verde',
    price: 'R$ 340,00', inStock: true,
    description: 'Alta concentração para dor crônica e fibromialgia. Recomendado para pacientes com experiência prévia.',
  },
  {
    id: '5', name: 'Óleo Full Spectrum 6%', type: 'Óleo',
    strain: 'ACDC', concentration: '6% CBD (60mg/ml)',
    cbd: 6, thc: 0.3, volume: '30ml',
    association: 'Associação Flor da Terra',
    price: 'R$ 480,00', inStock: false,
    description: 'Concentração máxima disponível. Indicado para epilepsia refratária e espasticidade. Acompanhamento médico obrigatório.',
  },
  {
    id: '6', name: 'Gummies CBD 10mg', type: 'Gummy',
    strain: 'Charlotte\'s Web', concentration: '10mg CBD/unidade',
    cbd: 1, thc: 0, volume: '30 unidades',
    association: 'Associação Cura Natural',
    price: 'R$ 190,00', inStock: true,
    description: 'Gomas mastigáveis com 10mg de CBD cada. Sabor frutas vermelhas. Prática para uso diário.',
  },
  {
    id: '7', name: 'Gummies CBD 25mg', type: 'Gummy',
    strain: 'Cannatonic', concentration: '25mg CBD/unidade',
    cbd: 2.5, thc: 0, volume: '30 unidades',
    association: 'Associação Esperança Verde',
    price: 'R$ 260,00', inStock: true,
    description: 'Gomas de alta concentração. Indicadas para manejo de ansiedade e auxílio ao sono.',
  },
  {
    id: '8', name: 'Cápsula CBD 25mg', type: 'Cápsula',
    strain: 'ACDC', concentration: '25mg CBD/cápsula',
    cbd: 2.5, thc: 0.1, volume: '60 cápsulas',
    association: 'Associação Flor da Terra',
    price: 'R$ 310,00', inStock: true,
    description: 'Cápsulas softgel de absorção otimizada. Dosagem precisa sem sabor residual.',
  },
  {
    id: '9', name: 'Pomada Tópica CBD', type: 'Tópico',
    strain: 'Cannatonic', concentration: '500mg CBD total',
    cbd: 5, thc: 0, volume: '60g',
    association: 'Associação Cura Natural',
    price: 'R$ 170,00', inStock: true,
    description: 'Pomada para aplicação local em dores musculares e articulares. Com arnica e mentol.',
  },
]

const allTypes = [...new Set(sampleProducts.map((p) => p.type))].sort()
const allAssociations = [...new Set(sampleProducts.map((p) => p.association))].sort()
const concentrationRanges = ['Até 2%', '3% - 4%', '5% - 6%']

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([])
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filtered = useMemo(() => {
    return sampleProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.strain.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedTypes.length && !selectedTypes.includes(p.type)) return false
      if (selectedAssociations.length && !selectedAssociations.includes(p.association)) return false
      if (showInStockOnly && !p.inStock) return false
      if (selectedConcentrations.length) {
        const match = selectedConcentrations.some((range) => {
          if (range === 'Até 2%') return p.cbd <= 2
          if (range === '3% - 4%') return p.cbd >= 3 && p.cbd <= 4
          if (range === '5% - 6%') return p.cbd >= 5 && p.cbd <= 6
          return false
        })
        if (!match) return false
      }
      return true
    })
  }, [search, selectedTypes, selectedAssociations, selectedConcentrations, showInStockOnly])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-6xl mx-auto">
        {/* Page header + search */}
        <div className="mb-8">
          <h1 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-2">
            Produtos
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-6 max-w-[540px]">
            Óleos, gummies, cápsulas e tópicos disponíveis nas associações credenciadas. Concentrações de CBD de 1% a 6%.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 dark:text-gray-600">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por produto ou cepa..."
              className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-brand-cream-dark dark:border-gray-800 bg-brand-white dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-light transition-colors shadow-soft"
            />
          </div>
        </div>

        {/* Content: sidebar + grid */}
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-52 shrink-0">
            <FilterSection
              title="Tipo"
              options={allTypes}
              selected={selectedTypes}
              onToggle={(v) => toggle(selectedTypes, v, setSelectedTypes)}
              counts={allTypes.map((t) => sampleProducts.filter((p) => p.type === t).length)}
            />
            <FilterSection
              title="Concentração"
              options={concentrationRanges}
              selected={selectedConcentrations}
              onToggle={(v) => toggle(selectedConcentrations, v, setSelectedConcentrations)}
              counts={concentrationRanges.map((range) => {
                return sampleProducts.filter((p) => {
                  if (range === 'Até 2%') return p.cbd <= 2
                  if (range === '3% - 4%') return p.cbd >= 3 && p.cbd <= 4
                  if (range === '5% - 6%') return p.cbd >= 5 && p.cbd <= 6
                  return false
                }).length
              })}
            />
            <FilterSection
              title="Associação"
              options={allAssociations}
              selected={selectedAssociations}
              onToggle={(v) => toggle(selectedAssociations, v, setSelectedAssociations)}
              counts={allAssociations.map((a) => sampleProducts.filter((p) => p.association === a).length)}
            />

            {/* In stock toggle */}
            <div className="mt-5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center ${
                    showInStockOnly
                      ? 'bg-brand-green-deep border-brand-green-deep'
                      : 'border-brand-cream-dark dark:border-gray-700 group-hover:border-brand-green-deep/50'
                  }`}
                  onClick={() => setShowInStockOnly(!showInStockOnly)}
                >
                  {showInStockOnly && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium text-brand-muted dark:text-gray-400">
                  Apenas em estoque
                </span>
              </label>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-brand-muted dark:text-gray-500 text-sm">
                  Nenhum produto encontrado.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── Product Card ──────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const user = useAuthStore((s) => s.user)
  const isApproved = user?.status === 'approved'
  const typeConfig: Record<string, { bg: string; icon: string }> = {
    'Óleo': { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-surface-dark-card', icon: '💧' },
    'Gummy': { bg: 'from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-surface-dark-card', icon: '🍬' },
    'Cápsula': { bg: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-surface-dark-card', icon: '💊' },
    'Flor': { bg: 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-surface-dark-card', icon: '🌿' },
    'Tópico': { bg: 'from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-surface-dark-card', icon: '🧴' },
  }

  const config = typeConfig[product.type] ?? { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-surface-dark-card', icon: '💧' }

  return (
    <div className="rounded-card border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card overflow-hidden hover:border-brand-green-deep/30 dark:hover:border-brand-green-deep/30 transition-colors shadow-soft group">
      {/* Header area */}
      <div className={`relative h-32 bg-gradient-to-br ${config.bg} flex items-center justify-center`}>
        <span className="text-4xl">{config.icon}</span>

        {/* Type badge */}
        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-btn text-[10px] font-semibold bg-brand-white/80 dark:bg-surface-dark/80 text-brand-green-deep dark:text-gray-300 backdrop-blur-sm">
          {product.type}
        </span>

        {/* Stock badge */}
        {!product.inStock && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded-btn text-[10px] font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Indisponível
          </span>
        )}

        {/* Concentration pill */}
        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-btn bg-brand-white/90 dark:bg-surface-dark/90 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-brand-green-deep dark:text-brand-green-light">
            {product.concentration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-brand-green-deep dark:text-white leading-tight">
          {product.name}
        </h3>
        <p className="text-[11px] text-brand-muted dark:text-gray-500 mt-0.5">
          Cepa: {product.strain} · {product.volume}
        </p>

        <p className="text-[12px] font-light text-brand-muted dark:text-gray-400 leading-[1.6] mt-2.5 line-clamp-2">
          {product.description}
        </p>

        {/* Association */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-brand-green-pale dark:bg-brand-green-deep/30 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-mid">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-[11px] text-brand-green-mid dark:text-brand-green-light font-medium truncate">
            {product.association}
          </span>
        </div>

        {/* Price + CTA (only for approved users) */}
        <div className="mt-3 pt-3 border-t border-brand-cream-dark/60 dark:border-gray-800">
          {isApproved ? (
            <div className="flex items-center justify-between">
              <span className="font-serif text-[17px] text-brand-green-deep dark:text-white">
                {product.price}
              </span>
              <button
                disabled={!product.inStock}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-btn transition-colors ${
                  product.inStock
                    ? 'bg-brand-green-deep text-brand-white hover:bg-brand-green-mid'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Solicitar' : 'Esgotado'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-sand dark:text-gray-600 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <p className="text-[11px] text-brand-muted dark:text-gray-500 leading-[1.5]">
                Preço e compra disponíveis após{' '}
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
