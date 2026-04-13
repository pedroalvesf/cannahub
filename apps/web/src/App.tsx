import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { Header } from '@/components/layout/header'

// Lazy loading — cada página é carregada sob demanda,
// reduzindo o bundle inicial e melhorando o tempo de carregamento.
const HomePage = lazy(() => import('@/pages/home').then(m => ({ default: m.HomePage })))
const QuizPage = lazy(() => import('@/pages/quiz').then(m => ({ default: m.QuizPage })))
const OnboardingPage = lazy(() => import('@/pages/onboarding').then(m => ({ default: m.OnboardingPage })))
const DocumentsPage = lazy(() => import('@/pages/documents').then(m => ({ default: m.DocumentsPage })))
const CatalogPage = lazy(() => import('@/pages/catalog').then(m => ({ default: m.CatalogPage })))
const AssociationsPage = lazy(() => import('@/pages/associations').then(m => ({ default: m.AssociationsPage })))
const AssociationDetailPage = lazy(() => import('@/pages/association-detail').then(m => ({ default: m.AssociationDetailPage })))
const AssociationCatalogPage = lazy(() => import('@/pages/association-catalog').then(m => ({ default: m.AssociationCatalogPage })))
const LoginPage = lazy(() => import('@/pages/login').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/register').then(m => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.DashboardPage })))
const TreatmentsPage = lazy(() => import('@/pages/treatments').then(m => ({ default: m.TreatmentsPage })))
const TreatmentDetailPage = lazy(() => import('@/pages/treatment-detail').then(m => ({ default: m.TreatmentDetailPage })))
const TreatmentCategoryPage = lazy(() => import('@/pages/treatment-category').then(m => ({ default: m.TreatmentCategoryPage })))
const LegislationPage = lazy(() => import('@/pages/legislation').then(m => ({ default: m.LegislationPage })))
const DoctorsPage = lazy(() => import('@/pages/doctors').then(m => ({ default: m.DoctorsPage })))
const DoctorDetailPage = lazy(() => import('@/pages/doctor-detail').then(m => ({ default: m.DoctorDetailPage })))
const JournalPage = lazy(() => import('@/pages/journal').then(m => ({ default: m.JournalPage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/users').then(m => ({ default: m.AdminUsersPage })))
const AdminUserDetailPage = lazy(() => import('@/pages/admin/user-detail').then(m => ({ default: m.AdminUserDetailPage })))
const AssociationDashboardPage = lazy(() => import('@/pages/association-panel/dashboard').then(m => ({ default: m.AssociationDashboardPage })))
const AssociationProductsPage = lazy(() => import('@/pages/association-panel/products').then(m => ({ default: m.AssociationProductsPage })))
const AssociationMembersPage = lazy(() => import('@/pages/association-panel/members').then(m => ({ default: m.AssociationMembersPage })))
const AssociationProfilePage = lazy(() => import('@/pages/association-panel/profile').then(m => ({ default: m.AssociationProfilePage })))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/cadastro?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

function AssociationRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  const isAssociation = user?.roles?.includes('association')
  if (!isAssociation) {
    return <Navigate to="/painel" replace />
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

function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-surface-dark flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand-green-light border-t-transparent rounded-full animate-spin" />
    </div>
  )
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
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<><Header /><HomePage /></>} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/acolhimento" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/documentos" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/catalogo" element={<CatalogPage />} />
      <Route path="/tratamentos" element={<TreatmentsPage />} />
      <Route path="/tratamentos/categoria/:slug" element={<TreatmentCategoryPage />} />
      <Route path="/tratamentos/:slug" element={<TreatmentDetailPage />} />
      <Route path="/legislacao" element={<LegislationPage />} />
      <Route path="/medicos" element={<DoctorsPage />} />
      <Route path="/medicos/:slug" element={<DoctorDetailPage />} />
      <Route path="/associacoes" element={<AssociationsPage />} />
      <Route path="/associacoes/:slug" element={<AssociationDetailPage />} />
      <Route path="/associacoes/:slug/catalogo" element={<AssociationCatalogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/painel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/diario" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      <Route path="/associacao/painel" element={<AssociationRoute><AssociationDashboardPage /></AssociationRoute>} />
      <Route path="/associacao/produtos" element={<AssociationRoute><AssociationProductsPage /></AssociationRoute>} />
      <Route path="/associacao/associados" element={<AssociationRoute><AssociationMembersPage /></AssociationRoute>} />
      <Route path="/associacao/perfil" element={<AssociationRoute><AssociationProfilePage /></AssociationRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/usuarios/:id" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
    </Routes>
    </Suspense>
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
