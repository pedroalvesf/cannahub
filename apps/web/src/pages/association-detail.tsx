import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { sampleAssociations } from '@/data/sample-associations'
import { sampleProducts } from '@/data/sample-products'
import { useRequestAssociationLink, useMyLinks, useAssociationProductTypes } from '@/hooks/use-association-link'

export function AssociationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isAuthenticated } = useAuthStore()
  const accountStatus = user?.accountStatus ?? 'pending'
  const requestLink = useRequestAssociationLink()
  const { data: myLinksData } = useMyLinks()
  const [linkError, setLinkError] = useState('')

  const association = sampleAssociations.find((a) => a.slug === slug)
  const hasCatalog = sampleProducts.some((p) => p.associationSlug === slug)

  // Fetch real product types from API (falls back to sample data)
  const { data: productTypesData } = useAssociationProductTypes(association?.id)
  const productTypes = productTypesData?.types ?? association?.productTypes ?? []
  const hasRealProducts = (productTypesData?.totalProducts ?? 0) > 0

  // Check if user already has a link with this association
  const existingLink = myLinksData?.links.find(
    (l) => l.associationId === association?.id,
  )
  const linkStatus = existingLink?.status // requested | active | rejected | cancelled

  if (!association) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
        <Header />
        <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto text-center py-20">
          <h1 className="font-serif text-2xl text-brand-green-deep dark:text-white mb-4">
            Associação não encontrada
          </h1>
          <Link
            to="/associacoes"
            className="text-sm font-semibold text-brand-green-mid hover:underline no-underline"
          >
            Voltar para associações
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-brand-muted dark:text-gray-500 mb-6">
          <Link to="/associacoes" className="hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Associações
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-brand-green-deep dark:text-white font-medium">{association.name}</span>
        </div>

        {/* Hero card */}
        <div className="bg-brand-green-deep rounded-card overflow-hidden mb-6">
          <div className="px-8 py-8 sm:py-10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-brand-green-mid flex items-center justify-center shrink-0">
                  <span className="font-serif text-2xl text-brand-white">
                    {association.name.split(' ').slice(-1)[0]?.[0] ?? 'A'}
                  </span>
                </div>
                <div>
                  <h1 className="font-serif text-[clamp(22px,3vw,32px)] text-brand-white leading-tight mb-1">
                    {association.name}
                  </h1>
                  <p className="text-[14px] text-brand-white/60">
                    {association.city}, {association.state} — {association.region}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {association.verified && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-brand-white/10 text-[12px] font-medium text-brand-green-pale">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verificada
                  </span>
                )}
                {association.assistedAccess && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-amber-400/15 text-[12px] font-medium text-amber-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    Acesso assistido
                  </span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-6 flex-wrap">
              <Stat icon="users" label="Membros" value={String(association.memberCount)} />
              <Stat icon="calendar" label="Fundação" value={String(association.foundedYear)} />
              <Stat icon="map" label="Região" value={association.region} />
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* About */}
            <Card title="Sobre a associação">
              {association.about ? (
                <div className="space-y-3">
                  {association.about.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-[13.5px] font-light text-brand-muted dark:text-gray-400 leading-[1.75]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[13.5px] font-light text-brand-muted dark:text-gray-400 leading-[1.75]">
                  {association.description}
                </p>
              )}
            </Card>

            {/* Contextual CTA — CannHub services */}
            <div className="rounded-card border border-brand-green-light/20 dark:border-gray-700/40 bg-brand-green-pale/30 dark:bg-gray-800/50 p-5 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand-green-mid dark:text-brand-green-light">
                Serviços CannHub
              </p>

              {accountStatus === 'approved' ? (
                <>
                  {/* Advanced services for approved patients */}
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                    title="Acompanhamento jurídico"
                    description="Orientação legal para habeas corpus, cultivo próprio e importação via Anvisa."
                  />
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.52 9-12z" /><path d="M2 2c0 6 4 8.5 6 10" /></svg>}
                    title="Cultivo próprio"
                    description="Suporte para obtenção de autorização judicial de cultivo para uso medicinal."
                  />
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>}
                    title="Importação via Anvisa"
                    description="Orientação completa para importar produtos de cannabis com autorização sanitária."
                  />
                  <Link
                    to="/legislacao"
                    className="inline-flex text-[13px] font-semibold text-brand-green-deep dark:text-brand-green-light hover:underline no-underline mt-1"
                  >
                    Saiba mais sobre seus direitos →
                  </Link>
                </>
              ) : isAuthenticated && user?.onboardingStatus === 'completed' ? (
                <>
                  {/* Onboarding done, needs docs */}
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                    title="Envie seus documentos"
                    description="Falta pouco! Envie receita, laudo e identidade para concluir seu cadastro."
                  />
                  <Link
                    to="/documentos"
                    className="inline-flex text-[13px] font-semibold text-brand-green-deep dark:text-brand-green-light hover:underline no-underline mt-1"
                  >
                    Enviar documentos →
                  </Link>
                </>
              ) : (
                <>
                  {/* New user or onboarding not done */}
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                    title="Não tem receita médica?"
                    description="A CannHub conecta você a médicos prescritores parceiros. Teleconsulta disponível para todo o Brasil."
                  />
                  <ServiceItem
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-white"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>}
                    title="Primeiro contato com cannabis medicinal?"
                    description="Nosso acolhimento guiado avalia seu perfil clínico e orienta o melhor caminho para o seu tratamento."
                  />
                  <Link
                    to={isAuthenticated ? '/acolhimento' : '/cadastro'}
                    className="inline-flex text-[13px] font-semibold text-brand-green-deep dark:text-brand-green-light hover:underline no-underline mt-1"
                  >
                    {isAuthenticated ? 'Iniciar acolhimento →' : 'Criar conta →'}
                  </Link>
                </>
              )}
            </div>

            {/* Products */}
            <Card title={`Produtos disponíveis${hasRealProducts ? ` (${productTypesData?.totalProducts})` : ''}`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productTypes.map((product) => (
                  <div key={product} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-cream/50 dark:bg-gray-800/50 border border-brand-cream-dark/30 dark:border-gray-700/30">
                    <div className="w-8 h-8 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <ProductIcon type={product} />
                    </div>
                    <span className="text-[13px] font-medium text-brand-green-deep dark:text-gray-200">
                      {product}
                    </span>
                  </div>
                ))}
              </div>
              {(hasCatalog || hasRealProducts) && (
                <div className="mt-4 pt-4 border-t border-brand-cream-dark/30 dark:border-gray-800/50">
                  <Link
                    to={`/associacoes/${slug}/catalogo`}
                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-white bg-brand-green-deep px-6 py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                  >
                    Ver catálogo completo
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              )}
            </Card>

            {/* Patient types */}
            <Card title="Perfis atendidos">
              <div className="flex flex-wrap gap-2">
                {association.patientTypes.map((type) => (
                  <span key={type} className="px-4 py-2 rounded-btn text-[13px] font-medium bg-brand-green-pale/60 dark:bg-brand-green-deep/20 text-brand-green-deep dark:text-brand-green-light border border-brand-green-light/20 dark:border-brand-green-deep/30">
                    {type}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar — 1 col */}
          <div className="space-y-5">
            {/* CTA */}
            <Card>
              {!isAuthenticated ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-cream dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-sand dark:text-gray-600">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-500 mb-4">
                    Crie sua conta para poder solicitar vínculo com esta associação.
                  </p>
                  <Link
                    to="/cadastro"
                    className="block w-full text-center text-[14px] font-semibold text-brand-white bg-brand-green-deep py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline mb-2"
                  >
                    Criar conta
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full text-center text-[13px] font-medium text-brand-green-deep dark:text-brand-green-light py-2 no-underline hover:underline"
                  >
                    Já tenho conta
                  </Link>
                </div>
              ) : accountStatus === 'approved' ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>

                  {linkStatus === 'active' ? (
                    <>
                      <p className="text-[13px] text-brand-green-deep dark:text-brand-green-light font-medium mb-3">
                        Você está vinculado a esta associação
                      </p>
                      {hasCatalog && (
                        <Link
                          to={`/associacoes/${slug}/catalogo`}
                          className="block w-full text-center text-[14px] font-semibold text-brand-white bg-brand-green-deep py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                        >
                          Ver catálogo com preços
                        </Link>
                      )}
                    </>
                  ) : linkStatus === 'requested' ? (
                    <div className="w-full text-[13px] text-amber-700 dark:text-amber-400 font-medium text-center py-3 bg-amber-50 dark:bg-amber-900/20 rounded-btn">
                      Vínculo solicitado — aguardando aprovação
                    </div>
                  ) : (
                    <>
                      <p className="text-[13px] text-brand-muted dark:text-gray-500 mb-4">
                        {linkStatus === 'rejected'
                          ? 'Seu vínculo foi recusado. Você pode tentar novamente.'
                          : 'Seu cadastro está aprovado. Solicite vínculo para ter acesso aos produtos.'}
                      </p>
                      <button
                        onClick={() => {
                          if (!association) return
                          setLinkError('')
                          requestLink.mutate(association.id, {
                            onError: (err: any) => {
                              const msg = err?.response?.data?.message ?? ''
                              const status = err?.response?.status

                              if (msg.includes('solicitação') || status === 409) {
                                setLinkError('Você já possui uma solicitação de vínculo com esta associação.')
                              } else if (status === 404) {
                                setLinkError('Associação não encontrada. Tente novamente mais tarde.')
                              } else if (status === 500) {
                                setLinkError('Erro interno do servidor. Tente novamente mais tarde.')
                              } else {
                                setLinkError('Não foi possível solicitar o vínculo. Tente novamente.')
                              }
                            },
                          })
                        }}
                        disabled={requestLink.isPending}
                        className="w-full text-[14px] font-semibold text-brand-white bg-brand-green-deep py-3 rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-50"
                      >
                        {requestLink.isPending ? 'Solicitando...' : 'Solicitar Vínculo'}
                      </button>
                    </>
                  )}
                  {linkError && (
                    <p className="text-[12px] text-red-500 mt-2 text-center">{linkError}</p>
                  )}
                </div>
              ) : accountStatus === 'rejected' ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 dark:text-red-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-brand-muted dark:text-gray-500 mb-2">
                    Seu cadastro foi recusado. Verifique seus documentos no painel.
                  </p>
                  <Link
                    to="/painel"
                    className="block w-full text-center text-[13px] font-medium text-brand-green-deep dark:text-brand-green-light py-2 no-underline hover:underline"
                  >
                    Ir para o painel
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 dark:text-amber-400">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Cadastro em análise
                  </p>
                  <p className="text-[12.5px] text-brand-muted dark:text-gray-500 mb-4">
                    Complete seu acolhimento e envie seus documentos para liberar o vínculo com associações.
                  </p>
                  <Link
                    to="/painel"
                    className="block w-full text-center text-[14px] font-semibold text-brand-white bg-brand-green-deep py-3 rounded-btn hover:bg-brand-green-mid transition-colors no-underline"
                  >
                    Ver meu painel
                  </Link>
                </div>
              )}
            </Card>

            {/* Contact */}
            <Card title="Contato">
              <div className="space-y-3">
                {association.contactEmail && (
                  <ContactRow
                    icon="mail"
                    label="Email"
                    value={association.contactEmail}
                  />
                )}
                {association.contactPhone && (
                  <ContactRow
                    icon="phone"
                    label="Telefone"
                    value={association.contactPhone}
                  />
                )}
                {association.website && (
                  <ContactRow
                    icon="globe"
                    label="Website"
                    value={association.website.replace('https://', '')}
                  />
                )}
                <ContactRow
                  icon="map-pin"
                  label="Localização"
                  value={`${association.city}, ${association.state}`}
                />
              </div>
            </Card>

            {/* Info */}
            {association.assistedAccess && (
              <div className="flex items-start gap-3 p-4 rounded-card bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <div>
                  <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    Programa de acesso assistido
                  </p>
                  <p className="text-[12px] text-amber-600/80 dark:text-amber-400/70 leading-relaxed">
                    Esta associação oferece descontos ou acesso gratuito para pacientes de baixa renda. Entre em contato para mais informações.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── Subcomponents ──────────────────────────────────────── */

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-brand-cream-dark/50 dark:border-gray-700/30">
          <h2 className="text-[14px] font-bold text-brand-green-deep dark:text-white uppercase tracking-[0.04em]">
            {title}
          </h2>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-brand-white/10 flex items-center justify-center">
        {icon === 'users' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-pale/70">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        )}
        {icon === 'calendar' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-pale/70">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
        {icon === 'map' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-pale/70">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-[18px] font-semibold text-brand-white leading-tight">{value}</p>
        <p className="text-[11px] text-brand-white/40">{label}</p>
      </div>
    </div>
  )
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-brand-cream-dark/30 dark:border-gray-800/50 last:border-0">
      <div className="w-8 h-8 rounded-full bg-brand-cream dark:bg-gray-800 flex items-center justify-center shrink-0">
        {icon === 'mail' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        )}
        {icon === 'phone' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
        )}
        {icon === 'globe' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
        )}
        {icon === 'map-pin' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep dark:text-brand-green-light">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-brand-muted dark:text-gray-500">{label}</p>
        <p className="text-[13px] font-medium text-brand-green-deep dark:text-gray-200 truncate">
          {value}
        </p>
      </div>
    </div>
  )
}

function ServiceItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-green-deep flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-medium text-brand-green-deep dark:text-white leading-tight">
          {title}
        </p>
        <p className="text-[12px] text-brand-muted dark:text-gray-400 leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  )
}

function ProductIcon({ type }: { type: string }) {
  const cls = 'text-brand-green-deep dark:text-brand-green-light'
  switch (type) {
    case 'Óleo':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      )
    case 'Cápsula':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="6" y="2" width="12" height="20" rx="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      )
    case 'Flor':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
  }
}
