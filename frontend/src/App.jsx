import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider } from '@/context/AuthContext';
import { SpinnerProvider, useSpinner } from '@/context/SpinnerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';

// -------- Lazy pages (mirror old routes) --------
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ContractsPage = lazy(() => import('@/pages/ContractsPage'));
const InvestigationsPage = lazy(() => import('@/pages/InvestigationsPage'));
const LegalAdvicePage = lazy(() => import('@/pages/LegalAdvicePage'));
const LitigationsPage = lazy(() => import('@/pages/LitigationsPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const ArchivePage = lazy(() => import('@/pages/ArchivePage'));
const ManagementSettings = lazy(() => import('@/pages/ManagementSettings'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const Forbidden = lazy(() => import('@/pages/Forbidden'));

// Optional: simple 404 page
const NotFound = () => (
  <div className="min-h-screen grid place-items-center p-8 text-center">
    <div>
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground">الصفحة غير موجودة</p>
    </div>
  </div>
);

// Shows spinner briefly on route change (like your old code)
function RouteChangeSpinner() {
  const location = useLocation();
  const { showSpinner, hideSpinner, loading } = useSpinner();

  useEffect(() => {
    showSpinner();
    const t = setTimeout(hideSpinner, 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return loading ? <GlobalSpinner /> : null;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SpinnerProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <RouteChangeSpinner />
                  <Suspense fallback={<GlobalSpinner />}>
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<HomePage />} />

                      {/* Old-style profile route that used :userId */}
                      <Route
                        path="/profile/:userId"
                        element={
                          <ProtectedRoute requiredPermissions={['profile', 'view profile']}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Archive (public before? If protected, wrap it) */}
                      <Route path="/archive" element={<ArchivePage />} />

                      {/* Dashboard */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Contracts */}
                      <Route
                        path="/contracts"
                        element={
                          <ProtectedRoute requiredPermissions={['contracts', 'view contracts']}>
                            <ContractsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Profile (no :userId) */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute requiredPermissions={['profile', 'view profile']}>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Users */}
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute requiredPermissions={['users', 'view users']}>
                            <UserManagementPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Legal group (kept your old paths) */}
                      <Route
                        path="/legal/investigations"
                        element={
                          <ProtectedRoute requiredPermissions={['investigations', 'view investigations']}>
                            <InvestigationsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/legal/legal-advices"
                        element={
                          <ProtectedRoute requiredPermissions={['legal-advice', 'view legaladvices']}>
                            <LegalAdvicePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/legal/litigations"
                        element={
                          <ProtectedRoute requiredPermissions={['litigations', 'view litigations']}>
                            <LitigationsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Management lists (kept your old slug) */}
                      <Route
                        path="/managment-lists"
                        element={
                          <ProtectedRoute requiredPermissions={['settings', 'view managment-lists']}>
                            <ManagementSettings />
                          </ProtectedRoute>
                        }
                      />

                      {/* Reports */}
                      <Route path="/reports-page" element={<ReportsPage />} />

                      {/* Forbidden */}
                      <Route path="/forbidden" element={<Forbidden />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </SpinnerProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
