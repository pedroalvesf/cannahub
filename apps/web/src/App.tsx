import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { Header } from '@/components/layout/header'
import { HomePage } from '@/pages/home'
import { OnboardingPage } from '@/pages/onboarding'
import { QuizPage } from '@/pages/quiz'
import { DocumentsPage } from '@/pages/documents'
import { CatalogPage } from '@/pages/catalog'
import { AssociationsPage } from '@/pages/associations'

const queryClient = new QueryClient()

function AppContent() {
  const hydrateAuth = useAuthStore((s) => s.hydrate)
  const hydrateTheme = useThemeStore((s) => s.hydrate)

  useEffect(() => {
    hydrateAuth()
    hydrateTheme()
  }, [hydrateAuth, hydrateTheme])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <HomePage />
          </>
        }
      />
      <Route
        path="/quiz"
        element={<QuizPage />}
      />
      <Route path="/acolhimento" element={<OnboardingPage />} />
      <Route
        path="/documentos"
        element={<DocumentsPage />}
      />
      <Route
        path="/catalogo"
        element={
          <CatalogPage />
        }
      />
      <Route
        path="/associacoes"
        element={
          <AssociationsPage />
        }
      />
    </Routes>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
