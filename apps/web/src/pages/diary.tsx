import { Header } from '@/components/layout/header'

export function DiaryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-white dark:bg-surface-dark pt-[80px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <h1 className="font-serif text-3xl text-brand-green-deep dark:text-white mb-2">
            Diario de Tratamento
          </h1>
          <p className="text-brand-muted dark:text-gray-400 text-base mb-8">
            Registre seu uso de cannabis medicinal e acompanhe a evolucao dos seus sintomas.
          </p>
        </div>
      </main>
    </>
  )
}
