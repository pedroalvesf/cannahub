import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { sampleAssociations } from '@/data/sample-associations'
import { useAssociationProducts } from '@/hooks/use-association-link'
import type { AssociationProductAPI } from '@/hooks/use-association-link'

const CATEGORY_ORDER = ['Óleo CBD', 'Óleo THC', 'Óleo Misto', 'Óleo Especial', 'Pomada', 'Creme', 'Cápsula', 'Gummy', 'Flor'] as const

const TYPE_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  'Óleo CBD': { bg: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-900/5', text: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'Óleo THC': { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-900/5', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'Óleo Misto': { bg: 'from-violet-50 to-violet-100/50 dark:from-violet-900/10 dark:to-violet-900/5', text: 'text-violet-700 dark:text-violet-400', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'Óleo Especial': { bg: 'from-cyan-50 to-cyan-100/50 dark:from-cyan-900/10 dark:to-cyan-900/5', text: 'text-cyan-700 dark:text-cyan-400', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  'Pomada': { bg: 'from-rose-50 to-rose-100/50 dark:from-rose-900/10 dark:to-rose-900/5', text: 'text-rose-700 dark:text-rose-400', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  'Creme': { bg: 'from-pink-50 to-pink-100/50 dark:from-pink-900/10 dark:to-pink-900/5', text: 'text-pink-700 dark:text-pink-400', badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  'Cápsula': { bg: 'from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'Gummy': { bg: 'from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/5', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  'Flor': { bg: 'from-lime-50 to-lime-100/50 dark:from-lime-900/10 dark:to-lime-900/5', text: 'text-lime-700 dark:text-lime-400', badge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Óleo': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400"><path d="M12 2v6" /><path d="M6.8 14a5.2 5.2 0 0 0 10.4 0c0-3-2.4-5.2-4-8h-2.4c-1.6 2.8-4 5-4 8z" /></svg>,
  'Tópico': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"><path d="M2 12h10" /><path d="M9 4v16" /><path d="M14 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2" /><path d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2" /></svg>,
  'Cápsula': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M10.5 2.1a2.4 2.4 0 0 1 3 0l6.4 5.2a2.4 2.4 0 0 1 .6 3l-5.2 8a2.4 2.4 0 0 1-3 .9L5.5 16a2.4 2.4 0 0 1-.9-3z" /><path d="M8.5 14l7-10" /></svg>,
  'Gummy': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 dark:text-orange-400"><circle cx="12" cy="12" r="8" /><path d="M9.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /><path d="M14.5 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /></svg>,
  'Flor': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.52 9-12z" /><path d="M2 2c0 6 4 8.5 6 10" /></svg>,
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`
}

export function AssociationCatalogPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated, user } = useAuthStore()
  const accountStatus = user?.accountStatus ?? 'pending'
  // Preços visíveis para usuários com cadastro aprovado
  // Associações podem optar por exigir vínculo ou não — por padrão, conta aprovada é suficiente
  const canSeePrices = isAuthenticated && accountStatus === 'approved'
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const association = sampleAssociations.find((a) => a.slug === slug)
  const { data: productsData, isLoading } = useAssociationProducts(association?.id)
  const products = productsData?.products ?? []

  if (!association) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
        <Header />
        <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto text-center py-20">
          <h1 className="font-serif text-2xl text-brand-green-deep dark:text-white mb-4">
            Associação não encontrada
          </h1>
          <Link to="/associacoes" className="text-sm font-semibold text-brand-green-mid hover:underline no-underline">
            Voltar para associações
          </Link>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
        <Header />
        <main className="px-6 pt-[80px] pb-20 max-w-[900px] mx-auto text-center py-20">
          <p className="text-[15px] text-brand-muted dark:text-gray-500">Carregando produtos...</p>
        </main>
      </div>
    )
  }

  // Group products by category
  const categories = [...new Set(products.map((p) => p.category))]
    .sort((a, b) => CATEGORY_ORDER.indexOf(a as typeof CATEGORY_ORDER[number]) - CATEGORY_ORDER.indexOf(b as typeof CATEGORY_ORDER[number]))

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter((p) => p.category === categoryFilter)

  const groupedProducts = categories
    .filter((cat) => categoryFilter === 'all' || cat === categoryFilter)
    .map((cat) => ({
      category: cat,
      items: filteredProducts.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-[1100px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-brand-muted dark:text-gray-500 mb-6 flex-wrap">
          <Link to="/associacoes" className="hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            Associações
          </Link>
          <ChevronIcon />
          <Link to={`/associacoes/${slug}`} className="hover:text-brand-green-deep dark:hover:text-white transition-colors no-underline">
            {association.name}
          </Link>
          <ChevronIcon />
          <span className="text-brand-green-deep dark:text-white font-medium">Catálogo</span>
        </div>

        {/* Association mini-header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-green-deep flex items-center justify-center shrink-0">
              <span className="font-serif text-lg text-brand-white">
                {association.name.split(' ').slice(-1)[0]?.[0] ?? 'A'}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-[clamp(20px,3vw,28px)] text-brand-green-deep dark:text-white leading-tight">
                Catálogo {association.name}
              </h1>
              <p className="text-[13px] text-brand-muted dark:text-gray-500">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'} disponíveis
              </p>
            </div>
          </div>
          <Link
            to={`/associacoes/${slug}`}
            className="text-[13px] font-semibold text-brand-green-mid dark:text-brand-green-light hover:underline no-underline"
          >
            Sobre a associação →
          </Link>
        </div>

        {/* Access notice */}
        {!canSeePrices && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-card bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                Preços restritos
              </p>
              <p className="text-[12px] text-amber-600/80 dark:text-amber-400/70 leading-relaxed">
                {!isAuthenticated ? (
                  <>
                    Para visualizar preços e realizar pedidos, é necessário criar uma conta e ter o cadastro aprovado.
                    {' '}
                    <Link to="/cadastro" className="font-semibold underline">
                      Criar conta
                    </Link>
                  </>
                ) : accountStatus === 'pending' ? (
                  <>
                    Cadastro incompleto. Após a aprovação, você poderá visualizar preços e fazer pedidos.
                    {' '}
                    <Link to="/painel" className="font-semibold underline">
                      Ver meu painel
                    </Link>
                  </>
                ) : accountStatus === 'rejected' ? (
                  <>
                    Seu cadastro foi recusado. Verifique seus documentos no painel para reenviar.
                    {' '}
                    <Link to="/painel" className="font-semibold underline">
                      Ver meu painel
                    </Link>
                  </>
                ) : (
                  'Para visualizar preços, é necessário ter o cadastro aprovado.'
                )}
              </p>
            </div>
          </div>
        )}

        {/* Category filter pills */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-btn text-[13px] font-medium transition-colors whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-brand-green-deep text-brand-white'
                  : 'bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 text-brand-muted dark:text-gray-400 hover:border-brand-green-light/50'
              }`}
            >
              Todos ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-btn text-[13px] font-medium transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-brand-green-deep text-brand-white'
                      : 'bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 text-brand-muted dark:text-gray-400 hover:border-brand-green-light/50'
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Products grouped by category */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px] text-brand-muted dark:text-gray-500 mb-4">
              Esta associação ainda não possui produtos cadastrados.
            </p>
            <Link
              to={`/associacoes/${slug}`}
              className="text-[13px] font-semibold text-brand-green-mid hover:underline no-underline"
            >
              Voltar para o perfil
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedProducts.map((group) => (
              <section key={group.category}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center">{TYPE_ICONS[products.find((p) => p.category === group.category)?.type ?? ''] ?? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>}</span>
                  <h2 className="text-[16px] font-bold text-brand-green-deep dark:text-white">
                    {group.category}
                  </h2>
                  <span className="text-[12px] text-brand-muted dark:text-gray-500 ml-1">
                    ({group.items.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      canSeePrices={canSeePrices}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoBlock
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            }
            title="Envio para todo o Brasil"
            text="Frete calculado na finalização. Envio com rastreamento."
          />
          <InfoBlock
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            title="Padrão Anvisa"
            text="Produtos com autorização judicial, laudos e controle de qualidade."
          />
          <InfoBlock
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
            title="Compra segura"
            text="Receita médica obrigatória. Dados protegidos pela LGPD."
          />
        </div>
      </main>
    </div>
  )
}

/* ─── Subcomponents ──────────────────────────────────────── */

function ProductCard({ product, canSeePrices }: { product: AssociationProductAPI; canSeePrices: boolean }) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const colors = TYPE_COLORS[product.category] ?? TYPE_COLORS['Óleo CBD']!
  const variant = product.variants[selectedVariant]

  return (
    <div className="bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40 rounded-card overflow-hidden hover:shadow-cta transition-shadow flex flex-col">
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${colors.bg} px-5 py-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-btn ${colors.badge}`}>
            {product.category}
          </span>
          {product.inStock ? (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Em estoque</span>
          ) : (
            <span className="text-[11px] font-medium text-brand-muted dark:text-gray-500">Indisponivel</span>
          )}
        </div>
        <h3 className="text-[15px] font-bold text-brand-green-deep dark:text-white leading-snug">
          {product.name}
        </h3>
      </div>

      {/* Content — flex-1 to push price to bottom */}
      <div className="px-5 py-4 flex flex-col flex-1">
        {/* Concentration pill */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[12px] font-semibold text-brand-green-deep dark:text-gray-300 bg-brand-green-pale/50 dark:bg-gray-700 px-2.5 py-1 rounded-btn">
            {product.concentration}
          </span>
          {product.dosagePerDrop && (
            <span className="text-[11px] text-brand-muted dark:text-gray-500">
              {product.dosagePerDrop}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-brand-muted dark:text-gray-400 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Cannabinoid indicators */}
        <div className="flex items-center gap-3 mb-4">
          {product.cbd > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-brand-green-deep dark:text-gray-300">
                CBD {product.cbd}mg
              </span>
            </div>
          )}
          {product.thc > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-semibold text-brand-green-deep dark:text-gray-300">
                THC {product.thc}mg
              </span>
            </div>
          )}
        </div>

        {/* Spacer to push variant selector + price to bottom */}
        <div className="flex-1" />

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            {product.variants.map((v, i) => (
              <button
                key={v.volume}
                onClick={() => setSelectedVariant(i)}
                className={`px-3 py-1.5 rounded-btn text-[12px] font-medium transition-colors ${
                  selectedVariant === i
                    ? 'bg-brand-green-deep text-brand-white'
                    : 'bg-brand-cream/50 dark:bg-gray-800 text-brand-muted dark:text-gray-400 border border-brand-cream-dark dark:border-gray-700 hover:border-brand-green-light/50'
                }`}
              >
                {v.volume}
              </button>
            ))}
          </div>
        )}

        {/* Single variant label */}
        {product.variants.length === 1 && variant && (
          <div className="mb-4">
            <span className="text-[12px] text-brand-muted dark:text-gray-500">
              {variant.volume}
            </span>
          </div>
        )}

        {/* Price / CTA — always at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-cream-dark/30 dark:border-gray-800/50">
          {canSeePrices && variant ? (
            <>
              <span className="text-[20px] font-bold text-brand-green-deep dark:text-white">
                {formatPrice(variant.price)}
              </span>
              <button
                disabled={!product.inStock}
                className="text-[13px] font-semibold text-brand-white bg-brand-green-deep px-5 py-2.5 rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Solicitar' : 'Indisponivel'}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-sand dark:text-gray-600 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[12px] text-brand-muted dark:text-gray-500">
                Cadastro aprovado necessário
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function InfoBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-card bg-brand-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700/40">
      <div className="w-9 h-9 rounded-full bg-brand-green-pale dark:bg-gray-700 flex items-center justify-center shrink-0 text-brand-green-deep dark:text-brand-green-light">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-brand-green-deep dark:text-white mb-0.5">{title}</p>
        <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
