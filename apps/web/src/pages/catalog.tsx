import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'

/* ─── Types ──────────────────────────────────────────────── */

type Tab = 'strains' | 'products'

interface Strain {
  id: string
  name: string
  subtitle: string
  type: 'Indica' | 'Sativa' | 'Híbrida'
  thc: number
  cbd: number
  terpenes: string[]
  effects: string[]
  indications: string[]
}

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

/* ─── Sample Data ────────────────────────────────────────── */

const sampleStrains: Strain[] = [
  {
    id: 's1', name: 'Amnesia Haze', subtitle: 'Amherst Haze', type: 'Sativa',
    thc: 17, cbd: 1,
    terpenes: ['Mirceno', 'Limoneno'], effects: ['Calm', 'Focus'],
    indications: ['Ansiedade', 'PTSD'],
  },
  {
    id: 's2', name: 'Amnesia Haze', subtitle: 'Sorrimental Haze', type: 'Híbrida',
    thc: 12, cbd: 8,
    terpenes: ['Cariofileno', 'Linalol'], effects: ['Calm', 'Focus'],
    indications: ['Dor crônica', 'Inflamação'],
  },
  {
    id: 's3', name: 'Amnesia Haze', subtitle: 'Southerns Haze', type: 'Indica',
    thc: 5, cbd: 15,
    terpenes: ['Mirceno', 'Pineno'], effects: ['Calm', 'Focus'],
    indications: ['Epilepsia', 'Ansiedade'],
  },
  {
    id: 's4', name: 'Charlotte\'s Web', subtitle: 'High-CBD Classic', type: 'Sativa',
    thc: 0.3, cbd: 17,
    terpenes: ['Mirceno', 'Cariofileno', 'Pineno'], effects: ['Calm'],
    indications: ['Epilepsia', 'Ansiedade', 'Dor crônica'],
  },
  {
    id: 's5', name: 'ACDC', subtitle: 'Balanced Therapy', type: 'Híbrida',
    thc: 1, cbd: 20,
    terpenes: ['Mirceno', 'Pineno', 'Limoneno'], effects: ['Calm', 'Focus'],
    indications: ['Ansiedade', 'Dor crônica', 'Inflamação'],
  },
  {
    id: 's6', name: 'Cannatonic', subtitle: 'Muscle Relief', type: 'Híbrida',
    thc: 3, cbd: 12,
    terpenes: ['Mirceno', 'Linalol', 'Cariofileno'], effects: ['Calm'],
    indications: ['Fibromialgia', 'Espasmos'],
  },
]

const sampleProducts: Product[] = [
  {
    id: 'p1', name: 'Óleo Full Spectrum 1%', type: 'Óleo',
    strain: 'Charlotte\'s Web', concentration: '1% CBD (10mg/ml)',
    cbd: 1, thc: 0, volume: '30ml',
    association: 'Associação Esperança Verde',
    price: 'R$ 150,00', inStock: true,
    description: 'Óleo sublingual de amplo espectro, ideal para iniciantes.',
  },
  {
    id: 'p2', name: 'Óleo Full Spectrum 2%', type: 'Óleo',
    strain: 'ACDC', concentration: '2% CBD (20mg/ml)',
    cbd: 2, thc: 0.1, volume: '30ml',
    association: 'Associação Flor da Terra',
    price: 'R$ 220,00', inStock: true,
    description: 'Concentração intermediária para pacientes em fase de titulação.',
  },
  {
    id: 'p3', name: 'Óleo Full Spectrum 3%', type: 'Óleo',
    strain: 'Cannatonic', concentration: '3% CBD (30mg/ml)',
    cbd: 3, thc: 0.2, volume: '30ml',
    association: 'Associação Cura Natural',
    price: 'R$ 280,00', inStock: true,
    description: 'Concentração para uso contínuo em quadros de ansiedade e dor moderada.',
  },
  {
    id: 'p4', name: 'Óleo Full Spectrum 4%', type: 'Óleo',
    strain: 'Amnesia Haze', concentration: '4% CBD (40mg/ml)',
    cbd: 4, thc: 0.3, volume: '30ml',
    association: 'Associação Esperança Verde',
    price: 'R$ 340,00', inStock: true,
    description: 'Alta concentração para dor crônica e fibromialgia.',
  },
  {
    id: 'p5', name: 'Óleo Full Spectrum 6%', type: 'Óleo',
    strain: 'ACDC', concentration: '6% CBD (60mg/ml)',
    cbd: 6, thc: 0.3, volume: '30ml',
    association: 'Associação Flor da Terra',
    price: 'R$ 480,00', inStock: false,
    description: 'Concentração máxima. Indicado para epilepsia refratária e espasticidade.',
  },
  {
    id: 'p6', name: 'Gummies CBD 10mg', type: 'Gummy',
    strain: 'Charlotte\'s Web', concentration: '10mg CBD/unidade',
    cbd: 1, thc: 0, volume: '30 unidades',
    association: 'Associação Cura Natural',
    price: 'R$ 190,00', inStock: true,
    description: 'Gomas mastigáveis com 10mg de CBD cada. Sabor frutas vermelhas.',
  },
  {
    id: 'p7', name: 'Gummies CBD 25mg', type: 'Gummy',
    strain: 'Cannatonic', concentration: '25mg CBD/unidade',
    cbd: 2.5, thc: 0, volume: '30 unidades',
    association: 'Associação Esperança Verde',
    price: 'R$ 260,00', inStock: true,
    description: 'Gomas de alta concentração. Indicadas para manejo de ansiedade.',
  },
  {
    id: 'p8', name: 'Cápsula CBD 25mg', type: 'Cápsula',
    strain: 'ACDC', concentration: '25mg CBD/cápsula',
    cbd: 2.5, thc: 0.1, volume: '60 cápsulas',
    association: 'Associação Flor da Terra',
    price: 'R$ 310,00', inStock: true,
    description: 'Cápsulas softgel de absorção otimizada. Dosagem precisa.',
  },
  {
    id: 'p9', name: 'Pomada Tópica CBD', type: 'Tópico',
    strain: 'Cannatonic', concentration: '500mg CBD total',
    cbd: 5, thc: 0, volume: '60g',
    association: 'Associação Cura Natural',
    price: 'R$ 170,00', inStock: true,
    description: 'Pomada para aplicação local em dores musculares e articulares.',
  },
]

/* ─── Derived filter options ─────────────────────────────── */

const strainTypes = ['Indica', 'Sativa', 'Híbrida']
const allTerpenes = [...new Set(sampleStrains.flatMap((s) => s.terpenes))].sort()
const allEffects = [...new Set(sampleStrains.flatMap((s) => s.effects))].sort()
const allIndications = [...new Set(sampleStrains.flatMap((s) => s.indications))].sort()

const productTypes = [...new Set(sampleProducts.map((p) => p.type))].sort()
const allAssociations = [...new Set(sampleProducts.map((p) => p.association))].sort()
const concentrationRanges = ['Até 2%', '3% - 4%', '5% - 6%']

/* ─── Page ───────────────────────────────────────────────── */

export function CatalogPage() {
  const [tab, setTab] = useState<Tab>('strains')
  const [search, setSearch] = useState('')

  // Strain filters
  const [selectedStrainTypes, setSelectedStrainTypes] = useState<string[]>([])
  const [selectedTerpenes, setSelectedTerpenes] = useState<string[]>([])
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [selectedIndications, setSelectedIndications] = useState<string[]>([])

  // Product filters
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([])
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filteredStrains = useMemo(() => {
    return sampleStrains.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.subtitle.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedStrainTypes.length && !selectedStrainTypes.includes(s.type)) return false
      if (selectedTerpenes.length && !selectedTerpenes.some((t) => s.terpenes.includes(t))) return false
      if (selectedEffects.length && !selectedEffects.some((e) => s.effects.includes(e))) return false
      if (selectedIndications.length && !selectedIndications.some((ind) => s.indications.includes(ind))) return false
      return true
    })
  }, [search, selectedStrainTypes, selectedTerpenes, selectedEffects, selectedIndications])

  const filteredProducts = useMemo(() => {
    return sampleProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.strain.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedProductTypes.length && !selectedProductTypes.includes(p.type)) return false
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
  }, [search, selectedProductTypes, selectedAssociations, selectedConcentrations, showInStockOnly])

  function toggle(arr: string[], value: string, setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  function switchTab(next: Tab) {
    setTab(next)
    setSearch('')
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-[clamp(26px,3.5vw,40px)] text-brand-green-deep dark:text-white leading-[1.2] mb-2">
            Catálogo
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-6 max-w-[540px]">
            Explore cepas com informações técnicas e produtos disponíveis nas associações credenciadas.
          </p>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-brand-cream dark:bg-surface-dark-card rounded-[12px] p-1 w-fit mb-6">
            <button
              onClick={() => switchTab('strains')}
              className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-all ${
                tab === 'strains'
                  ? 'bg-brand-white dark:bg-gray-800 text-brand-green-deep dark:text-white shadow-sm'
                  : 'text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300'
              }`}
            >
              Cepas
              <span className="ml-1.5 text-[11px] text-brand-muted/60 dark:text-gray-600">
                {sampleStrains.length}
              </span>
            </button>
            <button
              onClick={() => switchTab('products')}
              className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-all ${
                tab === 'products'
                  ? 'bg-brand-white dark:bg-gray-800 text-brand-green-deep dark:text-white shadow-sm'
                  : 'text-brand-muted dark:text-gray-500 hover:text-brand-green-deep dark:hover:text-gray-300'
              }`}
            >
              Produtos
              <span className="ml-1.5 text-[11px] text-brand-muted/60 dark:text-gray-600">
                {sampleProducts.length}
              </span>
            </button>
          </div>

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
              placeholder={tab === 'strains' ? 'Buscar cepa por nome...' : 'Buscar por produto ou cepa...'}
              className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-brand-cream-dark dark:border-gray-800 bg-brand-white dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200 placeholder-brand-muted/40 dark:placeholder-gray-600 focus:outline-none focus:border-brand-green-light transition-colors shadow-soft"
            />
          </div>
        </div>

        {/* Content: sidebar + grid */}
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-52 shrink-0">
            {tab === 'strains' ? (
              <>
                <FilterSection
                  title="Tipo"
                  options={strainTypes}
                  selected={selectedStrainTypes}
                  onToggle={(v) => toggle(selectedStrainTypes, v, setSelectedStrainTypes)}
                  counts={strainTypes.map((t) => sampleStrains.filter((s) => s.type === t).length)}
                />
                <FilterSection
                  title="Terpenos"
                  options={allTerpenes}
                  selected={selectedTerpenes}
                  onToggle={(v) => toggle(selectedTerpenes, v, setSelectedTerpenes)}
                  counts={allTerpenes.map((t) => sampleStrains.filter((s) => s.terpenes.includes(t)).length)}
                />
                <FilterSection
                  title="Efeitos"
                  options={allEffects}
                  selected={selectedEffects}
                  onToggle={(v) => toggle(selectedEffects, v, setSelectedEffects)}
                  counts={allEffects.map((e) => sampleStrains.filter((s) => s.effects.includes(e)).length)}
                />
                <FilterSection
                  title="Indicações"
                  options={allIndications}
                  selected={selectedIndications}
                  onToggle={(v) => toggle(selectedIndications, v, setSelectedIndications)}
                  counts={allIndications.map((ind) => sampleStrains.filter((s) => s.indications.includes(ind)).length)}
                />
              </>
            ) : (
              <>
                <FilterSection
                  title="Tipo"
                  options={productTypes}
                  selected={selectedProductTypes}
                  onToggle={(v) => toggle(selectedProductTypes, v, setSelectedProductTypes)}
                  counts={productTypes.map((t) => sampleProducts.filter((p) => p.type === t).length)}
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
              </>
            )}
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {tab === 'strains' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStrains.map((strain) => (
                    <StrainCard key={strain.id} strain={strain} />
                  ))}
                </div>
                {filteredStrains.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-brand-muted dark:text-gray-500 text-sm">Nenhuma cepa encontrada.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-brand-muted dark:text-gray-500 text-sm">Nenhum produto encontrado.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── Strain Card ────────────────────────────────────────── */

function StrainCard({ strain }: { strain: Strain }) {
  return (
    <div className="rounded-card border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card overflow-hidden hover:border-brand-green-deep/30 dark:hover:border-brand-green-deep/30 transition-colors shadow-soft">
      {/* Image placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-brand-green-deep/20 via-brand-green-deep/10 to-brand-cream dark:from-brand-green-deep/30 dark:via-surface-dark-card dark:to-surface-dark-card flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep/40">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M12 6c-1.5 2-2 4-2 6s.5 4 2 6c1.5-2 2-4 2-6s-.5-4-2-6z" />
          <path d="M6 12c2-1.5 4-2 6-2s4 .5 6 2c-2 1.5-4 2-6 2s-4-.5-6-2z" />
        </svg>

        {/* Type badge */}
        <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-btn text-[10px] font-semibold ${
          strain.type === 'Sativa'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : strain.type === 'Indica'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-brand-green-pale text-brand-green-deep dark:bg-brand-green-deep/30 dark:text-brand-green-light'
        }`}>
          {strain.type}
        </span>

        {/* THC / CBD circular indicators */}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <CircularIndicator label="THC" value={strain.thc} max={30} color="#6B7280" />
          <CircularIndicator label="CBD" value={strain.cbd} max={25} color="#108981" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-brand-green-deep dark:text-white">
          {strain.name}
        </h3>
        <p className="text-[11px] font-normal text-brand-muted dark:text-gray-500">
          {strain.subtitle}
        </p>

        {/* Dominant terpenes */}
        <p className="mt-3 text-[10px] text-brand-muted dark:text-gray-500 uppercase tracking-wider font-medium">
          Terpenos dominantes
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {strain.terpenes.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-cream dark:bg-gray-800 text-brand-green-deep dark:text-gray-400">
              {t}
            </span>
          ))}
        </div>

        {/* Effects + Indications row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {strain.effects.map((e) => (
            <span key={e} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-green-deep/10 dark:bg-brand-green-deep/20 text-brand-green-deep">
              {e}
            </span>
          ))}
          <span className="text-[10px] font-medium text-brand-green-mid dark:text-brand-green-light cursor-pointer hover:underline">
            Ver indicações
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Product Card ───────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const user = useAuthStore((s) => s.user)
  const isApproved = user?.accountStatus === 'approved'
  const typeConfig: Record<string, { bg: string; icon: React.ReactNode }> = {
    'Óleo': { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400"><path d="M12 2v6" /><path d="M6.8 14a5.2 5.2 0 0 0 10.4 0c0-3-2.4-5.2-4-8h-2.4c-1.6 2.8-4 5-4 8z" /></svg> },
    'Gummy': { bg: 'from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400"><circle cx="12" cy="12" r="8" /><path d="M9.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /><path d="M14.5 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /></svg> },
    'Cápsula': { bg: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M10.5 2.1a2.4 2.4 0 0 1 3 0l6.4 5.2a2.4 2.4 0 0 1 .6 3l-5.2 8a2.4 2.4 0 0 1-3 .9L5.5 16a2.4 2.4 0 0 1-.9-3z" /><path d="M8.5 14l7-10" /></svg> },
    'Flor': { bg: 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.52 9-12z" /><path d="M2 2c0 6 4 8.5 6 10" /></svg> },
    'Tópico': { bg: 'from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"><path d="M2 12h10" /><path d="M9 4v16" /><path d="M14 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2" /><path d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2" /></svg> },
  }

  const config = typeConfig[product.type] ?? { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-surface-dark-card', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400"><path d="M12 2v6" /><path d="M6.8 14a5.2 5.2 0 0 0 10.4 0c0-3-2.4-5.2-4-8h-2.4c-1.6 2.8-4 5-4 8z" /></svg> }

  return (
    <div className="rounded-card border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card overflow-hidden hover:border-brand-green-deep/30 dark:hover:border-brand-green-deep/30 transition-colors shadow-soft group">
      {/* Header area */}
      <div className={`relative h-32 bg-gradient-to-br ${config.bg} flex items-center justify-center`}>
        {config.icon}

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

/* ─── Circular THC/CBD Indicator ─────────────────────────── */

function CircularIndicator({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)

  return (
    <div className="relative w-11 h-11 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-full backdrop-blur-sm">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-cream-dark dark:text-gray-700" />
        <circle
          cx="22" cy="22" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[8px] font-bold text-brand-green-deep dark:text-gray-300 leading-none">{value}%</span>
        <span className="text-[7px] text-brand-muted dark:text-gray-500 leading-none mt-0.5">{label}</span>
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
