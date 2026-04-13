import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useDoctors, type DirectoryDoctor } from '@/hooks/use-doctors'

const STATES = ['SP', 'RJ', 'MG', 'RS', 'PR', 'PE'] as const

export function DoctorsPage() {
  const [state, setState] = useState<string>('')
  const [specialty, setSpecialty] = useState<string>('')
  const [modality, setModality] = useState<'telemedicine' | 'in_person' | ''>('')

  const { data, isLoading } = useDoctors({
    state: state || undefined,
    specialty: specialty || undefined,
    modality: modality || undefined,
  })

  const doctors = data?.doctors ?? []

  const allSpecialties = useMemo(() => {
    const set = new Set<string>()
    doctors.forEach((d) => d.specialties.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [doctors])

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[1100px] mx-auto">
        {/* Hero */}
        <section className="pt-10 pb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-green-light mb-3">
            Diretório
          </p>
          <h1 className="font-serif text-[clamp(28px,4.5vw,44px)] text-brand-green-deep dark:text-white leading-[1.05] mb-4">
            Médicos prescritores de cannabis medicinal
          </h1>
          <p className="text-[15px] text-brand-muted dark:text-gray-400 max-w-[640px] leading-relaxed">
            Profissionais habilitados e com experiência no uso terapêutico de canabinoides.
            Encontre por estado, especialidade ou modalidade de atendimento.
          </p>
        </section>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <FilterSelect
            label="Estado"
            value={state}
            onChange={setState}
            options={[
              { value: '', label: 'Todos os estados' },
              ...STATES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            label="Especialidade"
            value={specialty}
            onChange={setSpecialty}
            options={[
              { value: '', label: 'Todas as especialidades' },
              ...allSpecialties.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            label="Modalidade"
            value={modality}
            onChange={(v) => setModality(v as 'telemedicine' | 'in_person' | '')}
            options={[
              { value: '', label: 'Todas' },
              { value: 'telemedicine', label: 'Telemedicina' },
              { value: 'in_person', label: 'Presencial' },
            ]}
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20 text-[14px] text-brand-muted dark:text-gray-500">
            Carregando médicos…
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px] text-brand-muted dark:text-gray-500 mb-2">
              Nenhum médico encontrado com os filtros atuais.
            </p>
            <button
              onClick={() => {
                setState('')
                setSpecialty('')
                setModality('')
              }}
              className="text-[13px] font-semibold text-brand-green-mid hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-16 p-5 rounded-card bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40">
          <p className="text-[12.5px] text-brand-muted dark:text-gray-400 leading-relaxed">
            <span className="font-semibold text-brand-green-deep dark:text-white">
              Sobre o diretório.
            </span>{' '}
            A CannHub não intermedeia a relação médico-paciente. Os profissionais
            listados são responsáveis por suas próprias agendas, protocolos e
            condutas clínicas. Verifique sempre a validade do CRM em{' '}
            <a
              href="https://portal.cfm.org.br/busca-medicos"
              target="_blank"
              rel="noopener"
              className="text-brand-green-mid underline"
            >
              portal.cfm.org.br
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-card bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 text-[13.5px] text-brand-green-deep dark:text-white focus:outline-none focus:border-brand-green-light"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function DoctorCard({ doctor }: { doctor: DirectoryDoctor }) {
  const initials = doctor.name
    .replace(/^Dra?\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <Link
      to={`/medicos/${doctor.slug}`}
      className="block bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-5 hover:shadow-cta transition-shadow no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
          <span className="font-serif text-[18px] text-brand-green-deep dark:text-white">
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-brand-green-deep dark:text-white leading-snug mb-0.5">
            {doctor.name}
          </h3>
          <p className="text-[12px] text-brand-muted dark:text-gray-500 mb-2">
            {doctor.crm} · {doctor.city ? `${doctor.city}, ` : ''}
            {doctor.state}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {doctor.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[11px] font-medium text-brand-green-deep dark:text-brand-green-light bg-brand-green-pale/50 dark:bg-gray-700/50 px-2 py-0.5 rounded-btn"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-brand-muted dark:text-gray-500">
            {doctor.telemedicine && (
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="14" rx="2" />
                  <path d="M8 22h8" />
                  <path d="M12 18v4" />
                </svg>
                Telemedicina
              </span>
            )}
            {doctor.inPerson && (
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Presencial
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
