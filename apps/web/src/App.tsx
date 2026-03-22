import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { Header } from '@/components/layout/header'
import { HomePage } from '@/pages/home'
import { OnboardingPage } from '@/pages/onboarding'
import { QuizPage } from '@/pages/quiz'
import { DocumentsPage } from '@/pages/documents'
import { CatalogPage } from '@/pages/catalog'
import { AssociationsPage } from '@/pages/associations'
import { AssociationDetailPage } from '@/pages/association-detail'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { DashboardPage } from '@/pages/dashboard'
import { AssociationCatalogPage } from '@/pages/association-catalog'
import { TreatmentsPage } from '@/pages/treatments'
import { LegislationPage } from '@/pages/legislation'
import { AdminUsersPage } from '@/pages/admin/users'
import { AdminUserDetailPage } from '@/pages/admin/user-detail'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/cadastro?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  const isAdmin = user?.roles?.includes('admin')
  if (!isAdmin) {
    return <Navigate to="/painel" replace />
  }

  return <>{children}</>
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

function AppContent() {
  const hydrateAuth = useAuthStore((s) => s.hydrate)
  const hydrateTheme = useThemeStore((s) => s.hydrate)

  useEffect(() => {
    hydrateAuth()
    hydrateTheme()
  }, [hydrateAuth, hydrateTheme])

  return (
    <>
    <ScrollToTop />
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
      <Route path="/acolhimento" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route
        path="/documentos"
        element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>}
      />
      <Route
        path="/catalogo"
        element={
          <CatalogPage />
        }
      />
      <Route path="/tratamentos" element={<TreatmentsPage />} />
      <Route path="/legislacao" element={<LegislationPage />} />
      <Route
        path="/associacoes"
        element={
          <AssociationsPage />
        }
      />
      <Route
        path="/associacoes/:slug"
        element={
          <AssociationDetailPage />
        }
      />
      <Route
        path="/associacoes/:slug/catalogo"
        element={
          <AssociationCatalogPage />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/painel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/usuarios/:id" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
    </Routes>
    </>
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
