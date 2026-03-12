import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'

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

const sampleStrains: Strain[] = [
  {
    id: '1', name: 'Amnesia Haze', subtitle: 'Amherst Haze', type: 'Sativa',
    thc: 17, cbd: 1,
    terpenes: ['Mirceno', 'Limoneno'], effects: ['Calm', 'Focus'],
    indications: ['Ansiedade', 'PTSD'],
  },
  {
    id: '2', name: 'Amnesia Haze', subtitle: 'Sorrimental Haze', type: 'Híbrida',
    thc: 12, cbd: 8,
    terpenes: ['Cariofileno', 'Linalol'], effects: ['Calm', 'Focus'],
    indications: ['Dor crônica', 'Inflamação'],
  },
  {
    id: '3', name: 'Amnesia Haze', subtitle: 'Southerns Haze', type: 'Indica',
    thc: 5, cbd: 15,
    terpenes: ['Mirceno', 'Pineno'], effects: ['Calm', 'Focus'],
    indications: ['Epilepsia', 'Ansiedade'],
  },
  {
    id: '4', name: 'Charlotte\'s Web', subtitle: 'High-CBD Classic', type: 'Sativa',
    thc: 0.3, cbd: 17,
    terpenes: ['Mirceno', 'Cariofileno', 'Pineno'], effects: ['Calm'],
    indications: ['Epilepsia', 'Ansiedade', 'Dor crônica'],
  },
  {
    id: '5', name: 'ACDC', subtitle: 'Balanced Therapy', type: 'Híbrida',
    thc: 1, cbd: 20,
    terpenes: ['Mirceno', 'Pineno', 'Limoneno'], effects: ['Calm', 'Focus'],
    indications: ['Ansiedade', 'Dor crônica', 'Inflamação'],
  },
  {
    id: '6', name: 'Cannatonic', subtitle: 'Muscle Relief', type: 'Híbrida',
    thc: 3, cbd: 12,
    terpenes: ['Mirceno', 'Linalol', 'Cariofileno'], effects: ['Calm'],
    indications: ['Fibromialgia', 'Espasmos'],
  },
]

const allTypes = ['Indica', 'Sativa', 'Híbrida']
const allTerpenes = [...new Set(sampleStrains.flatMap((s) => s.terpenes))].sort()
const allEffects = [...new Set(sampleStrains.flatMap((s) => s.effects))].sort()
const allIndications = [...new Set(sampleStrains.flatMap((s) => s.indications))].sort()

export function StrainsPage() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTerpenes, setSelectedTerpenes] = useState<string[]>([])
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [selectedIndications, setSelectedIndications] = useState<string[]>([])

  const filtered = useMemo(() => {
    return sampleStrains.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedTypes.length && !selectedTypes.includes(s.type)) return false
      if (selectedTerpenes.length && !selectedTerpenes.some((t) => s.terpenes.includes(t))) return false
      if (selectedEffects.length && !selectedEffects.some((e) => s.effects.includes(e))) return false
      if (selectedIndications.length && !selectedIndications.some((ind) => s.indications.includes(ind))) return false
      return true
    })
  }, [search, selectedTypes, selectedTerpenes, selectedEffects, selectedIndications])

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
            Catálogo de Cepas
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 font-light leading-[1.65] mb-6 max-w-[500px]">
            Explore cepas com informações técnicas, terpenos e indicações médicas.
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
              placeholder="Buscar cepa por nome..."
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
              counts={allTypes.map((t) => sampleStrains.filter((s) => s.type === t).length)}
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
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((strain) => (
                <StrainCard key={strain.id} strain={strain} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-brand-muted dark:text-gray-500 text-sm">
                  Nenhuma cepa encontrada.
                </p>
              </div>
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
