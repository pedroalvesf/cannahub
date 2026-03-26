import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { useAssociationProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, type AssociationProduct } from '@/hooks/use-association-panel'
import { Link } from 'react-router-dom'

const INPUT = 'w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-white dark:bg-surface-dark dark:text-white focus:outline-none focus:border-brand-green-light'

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export function AssociationProductsPage() {
  const { data, isLoading } = useAssociationProducts()
  const createProduct = useCreateProduct()
  const deleteProduct = useDeleteProduct()
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const products = data?.products ?? []

  const grouped = products.reduce<Record<string, AssociationProduct[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category]?.push(p)
    return acc
  }, {})
  const categories = Object.keys(grouped)

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    createProduct.mutate({
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      category: fd.get('category') as string,
      concentration: (fd.get('concentration') as string) || undefined,
      description: (fd.get('description') as string) || undefined,
      cbd: Number(fd.get('cbd')) || 0,
      thc: Number(fd.get('thc')) || 0,
      variants: [
        { volume: '30ml', price: Number(fd.get('price30')) || 0 },
        ...(Number(fd.get('price10')) ? [{ volume: '10ml', price: Number(fd.get('price10')) }] : []),
      ],
    }, { onSuccess: () => setShowForm(false) })
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-brand-off dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-10">
            <div>
              <Link to="/associacao/painel" className="text-[12px] text-brand-muted hover:text-brand-green-light mb-1.5 inline-block">&larr; Voltar ao painel</Link>
              <h1 className="font-serif text-[clamp(24px,3vw,32px)] text-brand-text dark:text-white leading-[1.1]">Catálogo</h1>
              <p className="text-[13px] text-brand-text-xs dark:text-gray-500 mt-1">{products.length} produto{products.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-brand-green-deep text-white text-[13px] font-semibold rounded-[8px] hover:bg-brand-green-mid transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Novo produto'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[14px] p-6 mb-10">
              <h2 className="text-[14px] font-semibold text-brand-text dark:text-white mb-5">Cadastrar produto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="sm:col-span-2"><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Nome</label><input name="name" required className={INPUT} /></div>
                <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Tipo</label><select name="type" required className={INPUT}><option value="">Selecione</option><option value="Óleo">Óleo</option><option value="Tópico">Tópico</option><option value="Cápsula">Cápsula</option><option value="Gummy">Gummy</option><option value="Flor">Flor</option></select></div>
                <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Categoria</label><select name="category" required className={INPUT}><option value="">Selecione</option><option value="Óleo CBD">Óleo CBD</option><option value="Óleo THC">Óleo THC</option><option value="Óleo Misto">Óleo Misto</option><option value="Óleo Especial">Óleo Especial</option><option value="Pomada">Pomada</option><option value="Creme">Creme</option><option value="Cápsula">Cápsula</option><option value="Gummy">Gummy</option><option value="Flor">Flor</option></select></div>
                <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Concentração</label><input name="concentration" placeholder="ex: 15mg/ml" className={INPUT} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">CBD</label><input name="cbd" type="number" step="0.1" placeholder="0" className={INPUT} /></div>
                  <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">THC</label><input name="thc" type="number" step="0.1" placeholder="0" className={INPUT} /></div>
                </div>
                <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Preço 30ml (R$)</label><input name="price30" type="number" step="0.01" required className={INPUT} /></div>
                <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Preço 10ml (R$)</label><input name="price10" type="number" step="0.01" className={INPUT} /></div>
                <div className="sm:col-span-2"><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Descrição</label><textarea name="description" rows={2} className={`${INPUT} resize-none`} /></div>
              </div>
              <div className="flex justify-end mt-5 pt-4 border-t border-brand-cream-dark/40 dark:border-gray-700/40">
                <button type="submit" disabled={createProduct.isPending} className="px-6 py-2.5 bg-brand-green-deep text-white text-[13px] font-semibold rounded-[8px] hover:bg-brand-green-mid transition-colors disabled:opacity-50">
                  {createProduct.isPending ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-brand-muted text-[13px]">Carregando catálogo...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-brand-muted text-[14px] mb-1">Nenhum produto cadastrado</p>
              <p className="text-brand-text-xs text-[12px]">Clique em "+ Novo produto" para começar.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((category) => {
                const items = grouped[category] ?? []
                return (
                  <section key={category}>
                    <div className="flex items-baseline gap-3 mb-4">
                      <h2 className="text-[15px] font-semibold text-brand-text dark:text-white">{category}</h2>
                      <span className="text-[11px] text-brand-text-xs dark:text-gray-500">{items.length} produto{items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((product) => (
                        <ProductCard key={product.id} product={product} onDelete={() => setDeleteConfirm(product.id)} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
              <div className="bg-white dark:bg-surface-dark-card rounded-[14px] p-6 max-w-[380px] w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[15px] font-semibold text-brand-text dark:text-white mb-2">Excluir produto</h3>
                <p className="text-[13px] text-brand-muted mb-6 leading-relaxed">O produto e todas as variantes serão removidos permanentemente.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-[13px] text-brand-muted">Cancelar</button>
                  <button onClick={() => { deleteProduct.mutate(deleteConfirm); setDeleteConfirm(null) }} className="px-5 py-2 text-[13px] font-semibold text-white bg-red-600 rounded-[8px] hover:bg-red-700 transition-colors">Excluir</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ── Product Card (square) ───────────────────────────────── */

function ProductCard({ product, onDelete }: { product: AssociationProduct; onDelete: () => void }) {
  const updateProduct = useUpdateProduct()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? '',
    concentration: product.concentration ?? '',
    cbd: product.cbd,
    thc: product.thc,
    inStock: product.inStock,
    variants: product.variants.map((v) => ({ volume: v.volume, price: v.price })),
  })

  function save() {
    updateProduct.mutate({
      id: product.id,
      name: form.name,
      description: form.description || undefined,
      concentration: form.concentration || undefined,
      cbd: form.cbd,
      thc: form.thc,
      inStock: form.inStock,
      variants: form.variants,
    }, { onSuccess: () => setEditing(false) })
  }

  function setVariant(i: number, field: 'volume' | 'price', val: string | number) {
    setForm((f) => ({ ...f, variants: f.variants.map((v, j) => j === i ? { ...v, [field]: val } : v) }))
  }

  const sorted = [...product.variants].sort((a, b) => a.price - b.price)
  const cheapest = sorted[0]

  /* ── Edit mode ── */
  if (editing) {
    return (
      <div className="bg-white dark:bg-surface-dark-card border border-brand-green-light/40 dark:border-gray-600 rounded-[14px] p-5 flex flex-col">
        <div className="space-y-3 mb-4">
          <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Nome</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} /></div>
          <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Concentração</label><input value={form.concentration} onChange={(e) => setForm({ ...form, concentration: e.target.value })} className={INPUT} /></div>
          <div><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">Descrição</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${INPUT} resize-none`} /></div>
          <div className="flex gap-3">
            <div className="flex-1"><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">CBD</label><input type="number" step="0.1" value={form.cbd} onChange={(e) => setForm({ ...form, cbd: Number(e.target.value) })} className={INPUT} /></div>
            <div className="flex-1"><label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-1 block">THC</label><input type="number" step="0.1" value={form.thc} onChange={(e) => setForm({ ...form, thc: Number(e.target.value) })} className={INPUT} /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded border-brand-cream-dark" />
            <span className="text-[12px] text-brand-muted">Disponível em estoque</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-brand-text-xs uppercase tracking-wide mb-2 block">Variantes</label>
          <div className="space-y-2">
            {form.variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={v.volume} onChange={(e) => setVariant(i, 'volume', e.target.value)} placeholder="Vol." className="flex-1 px-2 py-1.5 border border-brand-cream-dark dark:border-gray-600 rounded-[6px] text-[12px] bg-white dark:bg-surface-dark dark:text-white" />
                <span className="text-[11px] text-brand-text-xs">R$</span>
                <input type="number" step="0.01" value={v.price} onChange={(e) => setVariant(i, 'price', Number(e.target.value))} className="w-24 px-2 py-1.5 border border-brand-cream-dark dark:border-gray-600 rounded-[6px] text-[12px] bg-white dark:bg-surface-dark dark:text-white" />
                {form.variants.length > 1 && <button onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }))} className="text-[10px] text-red-400 hover:text-red-600">x</button>}
              </div>
            ))}
          </div>
          <button onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, { volume: '', price: 0 }] }))} className="text-[11px] text-brand-green-light font-medium mt-2">+ variante</button>
        </div>

        <div className="flex gap-2 justify-end mt-auto pt-3 border-t border-brand-cream-dark/30 dark:border-gray-700/30">
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-[12px] text-brand-muted">Cancelar</button>
          <button onClick={save} disabled={updateProduct.isPending} className="px-4 py-1.5 text-[12px] font-semibold text-white bg-brand-green-deep rounded-[8px] hover:bg-brand-green-mid disabled:opacity-50 transition-colors">
            {updateProduct.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    )
  }

  /* ── Read mode (square card) ── */
  return (
    <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[14px] overflow-hidden flex flex-col hover:border-brand-green-light/50 transition-colors group">
      {/* Top section */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[14px] font-medium text-brand-text dark:text-white leading-snug">{product.name}</h3>
          {!product.inStock && <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded">Esgotado</span>}
        </div>

        {product.description && (
          <p className="text-[12px] text-brand-muted dark:text-gray-500 leading-[1.55] line-clamp-2 mb-3">{product.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {product.concentration && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-brand-text-md dark:text-gray-300 bg-brand-cream/60 dark:bg-gray-800 rounded-[4px]">{product.concentration}</span>
          )}
          {product.cbd > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-brand-muted dark:text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-light" />CBD {product.cbd}
            </span>
          )}
          {product.thc > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-brand-muted dark:text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />THC {product.thc}
            </span>
          )}
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-1.5">
          {sorted.map((v) => (
            <span key={v.id} className="px-2 py-1 text-[11px] text-brand-text-md dark:text-gray-300 bg-brand-off dark:bg-surface-dark rounded-[6px]">
              {v.volume} — <span className="font-medium">{fmt(v.price)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-brand-cream-dark/40 dark:border-gray-700/40 flex items-center justify-between bg-brand-off/40 dark:bg-surface-dark/40">
        {cheapest ? (
          <span className="text-[14px] font-semibold text-brand-green-deep dark:text-brand-green-light">{fmt(cheapest.price)}</span>
        ) : (
          <span className="text-[12px] text-brand-text-xs">Sem preço</span>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-[6px] hover:bg-brand-cream dark:hover:bg-gray-700 text-brand-text-xs hover:text-brand-text dark:hover:text-white transition-colors" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-[6px] hover:bg-red-50 dark:hover:bg-red-900/20 text-brand-text-xs hover:text-red-500 transition-colors" title="Excluir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
