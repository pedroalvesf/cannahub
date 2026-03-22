import { useState } from 'react'

interface RejectionModalProps {
  title: string
  onConfirm: (reason: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export function RejectionModal({ title, onConfirm, onCancel, isLoading }: RejectionModalProps) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-brand-white dark:bg-surface-dark-card rounded-card w-full max-w-md mx-4 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-brand-text dark:text-gray-100 mb-4">{title}</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Descreva o motivo da rejeição..."
          rows={4}
          className="w-full rounded-lg border border-brand-cream-dark dark:border-gray-600 bg-brand-cream dark:bg-surface-dark px-4 py-3 text-sm text-brand-text dark:text-gray-200 placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green-light resize-none"
        />
        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-btn text-sm font-medium text-brand-muted hover:text-brand-text dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || isLoading}
            className="px-4 py-2 rounded-btn text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Rejeitando...' : 'Confirmar Rejeição'}
          </button>
        </div>
      </div>
    </div>
  )
}
