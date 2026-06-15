import { useMemo, useEffect } from 'react'
import { useMyLinks, useAssociationsList, useAssociationProducts } from '@/hooks/use-association-link'

const FREE_VALUE = '__free__'

export interface ProductSourceState {
  associationId?: string  // id real quando seleciona uma cadastrada
  associationName?: string  // nome livre quando '__free__'
  productId?: string  // id real quando seleciona do catálogo
  productName: string  // sempre preenchido (livre ou copiado do produto)
  concentration?: string  // ex: "15mg/ml"
}

interface ProductSourcePickerProps {
  value: ProductSourceState
  onChange: (next: ProductSourceState) => void
  error?: string
}

export function ProductSourcePicker({ value, onChange, error }: ProductSourcePickerProps) {
  const { data: myLinks } = useMyLinks()
  const { data: allAssociations } = useAssociationsList()
  const { data: catalog } = useAssociationProducts(value.associationId)

  const approvedLinks = useMemo(
    () => (myLinks?.links ?? []).filter((l) => l.status === 'active'),
    [myLinks],
  )
  const approvedIds = new Set(approvedLinks.map((l) => l.associationId))

  const otherAssociations = useMemo(
    () => (allAssociations?.associations ?? []).filter((a) => !approvedIds.has(a.id)),
    [allAssociations, approvedIds],
  )

  const products = catalog?.products ?? []
  const isFreeAssociation = !value.associationId && value.associationName !== undefined
  const isCatalogProduct = !!value.productId

  // Quando muda a associação, limpa produto/concentração selecionados do catálogo anterior
  function setAssociation(raw: string) {
    if (raw === FREE_VALUE) {
      onChange({
        ...value,
        associationId: undefined,
        associationName: value.associationName ?? '',
        productId: undefined,
      })
      return
    }
    if (raw === '') {
      onChange({
        ...value,
        associationId: undefined,
        associationName: undefined,
        productId: undefined,
      })
      return
    }
    onChange({
      ...value,
      associationId: raw,
      associationName: undefined,
      productId: undefined,
    })
  }

  function setProduct(raw: string) {
    if (raw === FREE_VALUE || raw === '') {
      onChange({ ...value, productId: undefined })
      return
    }
    const found = products.find((p) => p.id === raw)
    if (!found) return
    onChange({
      ...value,
      productId: found.id,
      productName: found.name,
      concentration: found.concentration ?? value.concentration,
    })
  }

  // Auto-preenche concentração quando produto do catálogo é escolhido e há concentração disponível
  useEffect(() => {
    if (!isCatalogProduct) return
    const found = products.find((p) => p.id === value.productId)
    if (found?.concentration && !value.concentration) {
      onChange({ ...value, concentration: found.concentration })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.productId])

  return (
    <section className="mb-5">
      <h3 className="text-sm font-semibold text-brand-green-deep dark:text-gray-200 mb-2">O que</h3>

      {/* 1. Associação */}
      <label className="block text-[11px] uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-1">
        Associação / fonte
      </label>
      <select
        value={isFreeAssociation ? FREE_VALUE : (value.associationId ?? '')}
        onChange={(e) => setAssociation(e.target.value)}
        className="w-full px-3 py-2 mb-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
      >
        <option value="">Selecione…</option>
        {approvedLinks.length > 0 && (
          <optgroup label="Minhas associações">
            {approvedLinks.map((l) => (
              <option key={l.associationId} value={l.associationId}>
                {l.associationName}
              </option>
            ))}
          </optgroup>
        )}
        {otherAssociations.length > 0 && (
          <optgroup label="Outras associações cadastradas">
            {otherAssociations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}{a.city ? ` — ${a.city}` : ''}
              </option>
            ))}
          </optgroup>
        )}
        <option value={FREE_VALUE}>Outra fonte (digitar)</option>
      </select>

      {isFreeAssociation && (
        <input
          type="text"
          value={value.associationName ?? ''}
          onChange={(e) => onChange({ ...value, associationName: e.target.value })}
          placeholder="Nome da associação ou origem (ex: Importação Anvisa)"
          className="w-full px-3 py-2 mb-3 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
        />
      )}

      {/* 2. Produto */}
      <label className="block text-[11px] uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-1 mt-3">
        Produto
      </label>
      {value.associationId && products.length > 0 ? (
        <>
          <select
            value={isCatalogProduct ? (value.productId ?? '') : FREE_VALUE}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full px-3 py-2 mb-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
          >
            <option value="">Selecione um produto…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.concentration ? ` — ${p.concentration}` : ''}
              </option>
            ))}
            <option value={FREE_VALUE}>Outro produto (digitar)</option>
          </select>
          {!isCatalogProduct && (
            <input
              type="text"
              value={value.productName}
              onChange={(e) => onChange({ ...value, productName: e.target.value })}
              placeholder="Nome do produto"
              className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
            />
          )}
        </>
      ) : (
        <input
          type="text"
          value={value.productName}
          onChange={(e) => onChange({ ...value, productName: e.target.value, productId: undefined })}
          placeholder="Nome do produto (ex: Óleo Full Spectrum)"
          className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
        />
      )}

      {/* 3. Concentração */}
      <label className="block text-[11px] uppercase tracking-[0.08em] text-brand-muted dark:text-gray-500 mb-1 mt-3">
        Concentração <span className="text-brand-muted/60 normal-case">(ex: 15 mg/ml, 200 mg)</span>
      </label>
      <input
        type="text"
        value={value.concentration ?? ''}
        onChange={(e) => onChange({ ...value, concentration: e.target.value })}
        placeholder={isCatalogProduct ? '(auto)' : 'Opcional'}
        className="w-full px-3 py-2 rounded-[8px] border border-brand-cream-dark/60 dark:border-gray-700 bg-brand-cream dark:bg-surface-dark-card text-sm text-brand-green-deep dark:text-gray-200"
      />

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </section>
  )
}
