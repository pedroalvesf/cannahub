import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { useAssociationProfile, useUpdateAssociationProfile } from '@/hooks/use-association-panel'

export function AssociationProfilePage() {
  const { data: profile, isLoading } = useAssociationProfile()
  const updateProfile = useUpdateAssociationProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    membershipFee: '',
    membershipPeriod: '',
    membershipDescription: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        description: profile.description ?? '',
        contactEmail: profile.contactEmail ?? '',
        contactPhone: profile.contactPhone ?? '',
        website: profile.website ?? '',
        membershipFee: profile.membershipFee?.toString() ?? '',
        membershipPeriod: profile.membershipPeriod ?? 'none',
        membershipDescription: profile.membershipDescription ?? '',
      })
    }
  }, [profile])

  function handleSave() {
    updateProfile.mutate({
      description: form.description || undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      website: form.website || undefined,
      membershipFee: form.membershipFee ? Number(form.membershipFee) : undefined,
      membershipPeriod: form.membershipPeriod || undefined,
      membershipDescription: form.membershipDescription || undefined,
    }, {
      onSuccess: () => setEditing(false),
    })
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-brand-off dark:bg-surface-dark pt-[80px] flex items-center justify-center">
          <div className="text-brand-muted">Carregando...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-brand-off dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[800px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/associacao/painel" className="text-[12px] text-brand-muted hover:text-brand-green-light mb-1 inline-block">&larr; Painel</Link>
              <h1 className="font-serif text-[28px] text-brand-text dark:text-white leading-[1.1]">Perfil da Associação</h1>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={updateProfile.isPending}
              className="px-5 py-2.5 bg-brand-green-deep text-white text-[13px] font-semibold rounded-btn hover:bg-brand-green-mid transition-colors disabled:opacity-50"
            >
              {updateProfile.isPending ? 'Salvando...' : editing ? 'Salvar' : 'Editar'}
            </button>
          </div>

          {/* Info card */}
          <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[16px] p-6 mb-6">
            <h2 className="text-[15px] font-medium text-brand-text dark:text-white mb-4">Informações gerais</h2>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-brand-text-xs dark:text-gray-500 mb-1">Nome</div>
                <div className="text-brand-text dark:text-white font-medium">{profile?.name}</div>
              </div>
              <div>
                <div className="text-brand-text-xs dark:text-gray-500 mb-1">CNPJ</div>
                <div className="text-brand-text dark:text-white font-medium">{profile?.cnpj}</div>
              </div>
              <div>
                <div className="text-brand-text-xs dark:text-gray-500 mb-1">Região</div>
                <div className="text-brand-text dark:text-white">{profile?.city}, {profile?.state} — {profile?.region}</div>
              </div>
              <div>
                <div className="text-brand-text-xs dark:text-gray-500 mb-1">Status</div>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-btn bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {profile?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[16px] p-6 mb-6">
            <h2 className="text-[15px] font-medium text-brand-text dark:text-white mb-4">Contato e descrição</h2>
            <div className="space-y-4">
              <Field label="Descrição" editing={editing}>
                {editing ? (
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white resize-none" />
                ) : (
                  <p className="text-[13px] text-brand-text dark:text-gray-300 leading-[1.6]">{form.description || '—'}</p>
                )}
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" editing={editing}>
                  {editing ? (
                    <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white" />
                  ) : (
                    <span className="text-[13px] text-brand-text dark:text-gray-300">{form.contactEmail || '—'}</span>
                  )}
                </Field>
                <Field label="Telefone" editing={editing}>
                  {editing ? (
                    <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white" />
                  ) : (
                    <span className="text-[13px] text-brand-text dark:text-gray-300">{form.contactPhone || '—'}</span>
                  )}
                </Field>
                <Field label="Website" editing={editing}>
                  {editing ? (
                    <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white" />
                  ) : (
                    <span className="text-[13px] text-brand-text dark:text-gray-300">{form.website || '—'}</span>
                  )}
                </Field>
              </div>
            </div>
          </div>

          {/* Membership fee */}
          <div className="bg-white dark:bg-surface-dark-card border border-brand-cream-dark dark:border-gray-700 rounded-[16px] p-6">
            <h2 className="text-[15px] font-medium text-brand-text dark:text-white mb-4">Configuração de anuidade</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Valor (R$)" editing={editing}>
                {editing ? (
                  <input type="number" step="0.01" value={form.membershipFee} onChange={(e) => setForm({ ...form, membershipFee: e.target.value })} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white" />
                ) : (
                  <span className="text-[13px] text-brand-text dark:text-gray-300 font-medium">
                    {form.membershipFee ? `R$ ${Number(form.membershipFee).toFixed(2).replace('.', ',')}` : 'Não configurado'}
                  </span>
                )}
              </Field>
              <Field label="Periodicidade" editing={editing}>
                {editing ? (
                  <select value={form.membershipPeriod} onChange={(e) => setForm({ ...form, membershipPeriod: e.target.value })} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white">
                    <option value="none">Sem taxa</option>
                    <option value="monthly">Mensal</option>
                    <option value="semiannual">Semestral</option>
                    <option value="annual">Anual</option>
                  </select>
                ) : (
                  <span className="text-[13px] text-brand-text dark:text-gray-300">
                    {({ none: 'Sem taxa', monthly: 'Mensal', semiannual: 'Semestral', annual: 'Anual' } as Record<string, string>)[form.membershipPeriod] ?? (form.membershipPeriod || '—')}
                  </span>
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descrição da anuidade" editing={editing}>
                  {editing ? (
                    <textarea value={form.membershipDescription} onChange={(e) => setForm({ ...form, membershipDescription: e.target.value })} rows={2} className="w-full px-3 py-2 border border-brand-cream-dark dark:border-gray-600 rounded-[8px] text-[13px] bg-transparent dark:text-white resize-none" />
                  ) : (
                    <p className="text-[13px] text-brand-text dark:text-gray-300 leading-[1.6]">{form.membershipDescription || '—'}</p>
                  )}
                </Field>
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-4 flex justify-end">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-[13px] text-brand-muted">Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ label, editing, children }: { label: string; editing: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-[0.06em] font-medium mb-1.5 ${editing ? 'text-brand-green-light' : 'text-brand-text-xs dark:text-gray-500'}`}>
        {label}
      </div>
      {children}
    </div>
  )
}
