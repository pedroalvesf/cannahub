import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { NewEntryModal } from '@/components/diary/new-entry-modal'

export function DiaryPage() {
  const [showNewEntry, setShowNewEntry] = useState(false)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-white dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl text-brand-green-deep dark:text-white mb-1">
                Diario de Tratamento
              </h1>
              <p className="text-brand-muted dark:text-gray-400 text-sm">
                Registre seu uso e acompanhe a evolucao dos sintomas.
              </p>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-brand-green-deep hover:bg-brand-green-mid text-white font-semibold text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo registro
            </button>
          </div>

          {/* Placeholder for timeline — will be implemented in US-020 */}
          <div className="text-center py-16">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-cream-dark dark:text-gray-600 mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p className="text-brand-muted dark:text-gray-400 text-base mb-4">
              Comece registrando seu primeiro uso
            </p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="text-sm font-medium text-brand-green-light hover:underline"
            >
              Criar primeiro registro
            </button>
          </div>
        </div>
      </main>

      <NewEntryModal open={showNewEntry} onClose={() => setShowNewEntry(false)} />
    </>
  )
}
