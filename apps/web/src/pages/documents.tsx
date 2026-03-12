import { useState } from 'react'
import { Header } from '@/components/layout/header'

type DocStatus = 'empty' | 'uploading' | 'uploaded' | 'approved' | 'rejected'

interface DocSlot {
  id: string
  label: string
  description: string
  accept: string
  status: DocStatus
  fileName?: string
  rejectReason?: string
  icon: React.ReactNode
}

const docIcons = {
  prescription: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  medical_report: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  identity: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M13 9h4" />
      <path d="M13 13h4" />
      <path d="M5 17c0-1.5 1.8-3 4-3s4 1.5 4 3" />
    </svg>
  ),
  proof_of_address: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
}

const initialDocs: DocSlot[] = [
  {
    id: 'prescription',
    label: 'Receita Médica ou Notificação B',
    description: 'Receita ou notificação de receita emitida e assinada pelo médico ou notificação.',
    accept: '.pdf,.jpg,.jpeg,.png',
    status: 'empty',
    icon: docIcons.prescription,
  },
  {
    id: 'medical_report',
    label: 'Laudo ou Relatório Médico',
    description: 'Relatório médico atualizado com nome completo, laudo assinado com CRM do médico.',
    accept: '.pdf,.jpg,.jpeg,.png',
    status: 'empty',
    icon: docIcons.medical_report,
  },
  {
    id: 'identity',
    label: 'Documento de Identidade (RG/CNH)',
    description: 'Documento oficial frente e verso, dados legíveis, documento de identidade ou CNH.',
    accept: '.pdf,.jpg,.jpeg,.png',
    status: 'empty',
    icon: docIcons.identity,
  },
  {
    id: 'proof_of_address',
    label: 'Comprovante de Residência',
    description: 'Documento recente (até 90 dias) — comprovante de residência com endereço completo.',
    accept: '.pdf,.jpg,.jpeg,.png',
    status: 'empty',
    icon: docIcons.proof_of_address,
  },
]

export function DocumentsPage() {
  const [docs, setDocs] = useState<DocSlot[]>(initialDocs)

  const uploadedCount = docs.filter((d) => d.status !== 'empty').length
  const stepProgress = uploadedCount === 0 ? 0 : uploadedCount < 4 ? 1 : 2

  function handleFileChange(docId: string, file: File | null) {
    if (!file) return
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'uploaded' as DocStatus, fileName: file.name }
          : d,
      ),
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 pt-[80px] pb-20 max-w-6xl mx-auto">
        {/* Progress stepper — dots connected by lines */}
        <div className="flex items-center justify-center gap-0 mb-12 max-w-md mx-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-4 h-4 rounded-full border-2 transition-colors shrink-0 ${
                  i <= stepProgress
                    ? 'bg-brand-green-deep border-brand-green-deep'
                    : 'bg-transparent border-brand-cream-dark dark:border-gray-700'
                }`}
              />
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 transition-colors ${
                    i < stepProgress
                      ? 'bg-brand-green-deep'
                      : 'bg-brand-cream-dark dark:bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-brand-green-deep dark:text-white">
          Central de Validação de Documentos
        </h1>

        {/* 4 upload cards — horizontal grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc) => (
            <label
              key={doc.id}
              className="group cursor-pointer flex flex-col rounded-card border border-brand-cream-dark dark:border-gray-800 bg-surface-card dark:bg-surface-dark-card overflow-hidden hover:border-brand-green-deep/40 dark:hover:border-brand-green-deep/30 transition-colors shadow-soft"
            >
              {/* Upload area — dashed */}
              <div className="relative flex flex-col items-center justify-center p-6 min-h-[140px]">
                <div className={`absolute inset-3 rounded-btn border-2 border-dashed transition-colors ${
                  doc.status !== 'empty'
                    ? 'border-brand-green-deep/30'
                    : 'border-brand-cream-dark dark:border-gray-700 group-hover:border-brand-green-deep/40'
                }`} />

                <div className="relative z-10 flex flex-col items-center gap-2">
                  {doc.status === 'empty' ? (
                    <>
                      <div className="w-14 h-14 rounded-card bg-brand-green-deep/10 dark:bg-brand-green-deep/20 flex items-center justify-center">
                        {doc.icon}
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted/30 dark:text-gray-600">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-card bg-brand-green-deep/10 dark:bg-brand-green-deep/20 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-brand-green-deep font-medium text-center truncate max-w-full px-2">
                        {doc.fileName}
                      </p>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  accept={doc.accept}
                  className="hidden"
                  onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] ?? null)}
                />
              </div>

              {/* Label and description */}
              <div className="px-4 pb-4 pt-1">
                <h3 className="text-xs font-bold text-brand-green-deep dark:text-white leading-snug">
                  {doc.label}
                </h3>
                <p className="mt-1 text-[11px] font-normal text-brand-muted dark:text-gray-500 leading-relaxed line-clamp-3">
                  {doc.description}
                </p>
                {doc.status === 'rejected' && doc.rejectReason && (
                  <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                    Motivo: {doc.rejectReason}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Trust notice — Aviso de Confiança */}
        <div className="mt-10 flex items-start gap-3.5 p-5 rounded-card bg-surface-card dark:bg-surface-dark-card border border-brand-cream-dark/50 dark:border-gray-800 shadow-soft">
          <div className="w-10 h-10 rounded-card bg-brand-green-deep/10 dark:bg-brand-green-deep/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-deep">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-green-deep dark:text-white">
              Aviso de Confiança
            </h3>
            <p className="mt-1 text-sm font-normal text-brand-muted dark:text-gray-400 leading-relaxed">
              Dos anos e semestre uso que ter ao que caso carreia zero, de data/histórico ou modo com avanando uteica de confiança a conforme acore apenastmelo pisados como da confiença.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
