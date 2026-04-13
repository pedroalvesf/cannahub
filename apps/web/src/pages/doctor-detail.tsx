import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useDoctor, type DirectoryDoctor } from '@/hooks/use-doctors'

export function DoctorDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError } = useDoctor(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
        <Header />
        <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto text-center py-20">
          <p className="text-[14px] text-brand-muted dark:text-gray-500">Carregando…</p>
        </main>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
        <Header />
        <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto text-center py-20">
          <h1 className="font-serif text-2xl text-brand-green-deep dark:text-white mb-4">
            Médico não encontrado
          </h1>
          <Link
            to="/medicos"
            className="text-sm font-semibold text-brand-green-mid hover:underline no-underline"
          >
            Voltar para o diretório
          </Link>
        </main>
      </div>
    )
  }

  const doctor = data.doctor
  const initials = doctor.name
    .replace(/^Dra?\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />
      <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-brand-muted dark:text-gray-500 mb-6 flex-wrap">
          <Link
            to="/medicos"
            className="hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline"
          >
            Diretório
          </Link>
          <ChevronIcon />
          <span className="text-brand-green-deep dark:text-white font-medium">
            {doctor.name}
          </span>
        </div>

        {/* Header card */}
        <section className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 md:p-8 mb-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
              <span className="font-serif text-[26px] text-brand-green-deep dark:text-white">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-[clamp(24px,3.5vw,34px)] text-brand-green-deep dark:text-white leading-tight mb-1">
                {doctor.name}
              </h1>
              <p className="text-[13px] text-brand-muted dark:text-gray-500 mb-3">
                {doctor.crm} · {doctor.city ? `${doctor.city}, ` : ''}
                {doctor.state}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {doctor.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-medium text-brand-green-deep dark:text-brand-green-light bg-brand-green-pale/50 dark:bg-gray-700/50 px-2.5 py-1 rounded-btn"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[12.5px] text-brand-muted dark:text-gray-400 flex-wrap">
                {doctor.telemedicine && (
                  <span className="flex items-center gap-1.5">
                    <DotIcon className="text-emerald-500" /> Telemedicina
                  </span>
                )}
                {doctor.inPerson && (
                  <span className="flex items-center gap-1.5">
                    <DotIcon className="text-emerald-500" /> Atendimento presencial
                  </span>
                )}
                {doctor.consultationFee && (
                  <span>{doctor.consultationFee}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        {doctor.bio && (
          <section className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6 mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-[0.08em] text-brand-green-light mb-3">
              Sobre o profissional
            </h2>
            <p className="text-[14px] text-brand-text-md dark:text-gray-300 leading-relaxed">
              {doctor.bio}
            </p>
          </section>
        )}

        {/* Contact */}
        <ContactSection doctor={doctor} />

        {/* Disclaimer */}
        <div className="mt-10 p-5 rounded-card bg-brand-cream dark:bg-surface-dark-card/60 border border-brand-cream-dark dark:border-gray-700/40">
          <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-relaxed">
            A CannHub não é responsável pela relação médico-paciente. Verifique
            o CRM no portal do CFM antes de agendar a consulta.
          </p>
        </div>
      </main>
    </div>
  )
}

function ContactSection({ doctor }: { doctor: DirectoryDoctor }) {
  const info = doctor.contactInfo as {
    email?: string
    whatsapp?: string
    website?: string
  }

  return (
    <section className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card p-6">
      <h2 className="text-[14px] font-bold uppercase tracking-[0.08em] text-brand-green-light mb-4">
        Como entrar em contato
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {info.whatsapp && (
          <ContactLink
            href={`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            }
            label="WhatsApp"
            value={info.whatsapp}
          />
        )}
        {info.email && (
          <ContactLink
            href={`mailto:${info.email}`}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            label="Email"
            value={info.email}
          />
        )}
        {info.website && (
          <ContactLink
            href={info.website}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
            label="Site"
            value={info.website.replace(/^https?:\/\//, '')}
          />
        )}
      </div>
    </section>
  )
}

function ContactLink({
  href,
  icon,
  label,
  value,
}: {
  href: string
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-3 p-3.5 rounded-card bg-brand-cream/60 dark:bg-gray-800/40 border border-brand-cream-dark dark:border-gray-700/40 hover:border-brand-green-light/60 transition-colors no-underline"
    >
      <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center text-brand-green-deep dark:text-brand-green-light shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted dark:text-gray-500">
          {label}
        </p>
        <p className="text-[13px] text-brand-green-deep dark:text-white truncate">
          {value}
        </p>
      </div>
    </a>
  )
}

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="currentColor"
      className={className}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
