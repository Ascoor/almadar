// src/router/AppRouter.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import RequirePermission from '@/components/auth/RequirePermission';
import { permKey } from '@/auth/permissionCatalog';
import DashboardLayout from '@/pages/DashboardPage';
import { getDashboardRoute } from '@/auth/getDashboardRoute';

const Login = lazy(() => import('@/components/organisms/Login'));
const DashboardRouter = lazy(() => import('@/pages/DashboardRouter'));
const DocumentEditor = lazy(() => import('@/components/editor/DocumentEditor'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ManagementSettings = lazy(() => import('@/pages/ManagementSettings'));
const Contracts = lazy(() => import('@/pages/ContractsPage'));
const ContractDetailsPage = lazy(() => import('@/pages/ContractDetailsPage'));
const Investigations = lazy(() => import('@/pages/InvestigationsPage'));
const InvestigationDetailsPage = lazy(
  () => import('@/pages/InvestigationDetailsPage'),
);
const InvestigationActionDetailsPage = lazy(
  () => import('@/features/investigations/InvestigationActionDetailsPage'),
);
const DataFetchingSpike = lazy(() => import('@/pages/DataFetchingSpike'));
const LegalAdvices = lazy(() => import('@/pages/LegalAdvicePage'));
const LegalAdviceDetailsPage = lazy(() => import('@/pages/LegalAdviceDetailsPage'));
const Litigations = lazy(() => import('@/pages/LitigationsPage'));
const LitigationDetailsPage = lazy(() => import('@/pages/LitigationDetailsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const ArchivePage = lazy(() => import('@/pages/ArchivePage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const Forbidden403 = lazy(() => import('@/pages/Forbidden403'));
const NotFound404 = lazy(() => import('@/pages/NotFound404'));

function Protected({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children || <Outlet />;
}

function PublicRoute({ children }) {
  const { user, isLoading, roles } = useAuth();

  if (isLoading) return <AuthSpinner />;
  return user ? <Navigate to={getDashboardRoute(roles)} replace /> : children;
}

function AuthRedirect() {
  const { user, isLoading, roles } = useAuth();

  if (isLoading) return <AuthSpinner />;
  return (
    <Navigate to={user ? getDashboardRoute(roles) : '/login'} replace />
  );
}

function HomeEntry() {
  const { user, isLoading, roles } = useAuth();

  if (isLoading) return <AuthSpinner />;
  if (user) return <Navigate to={getDashboardRoute(roles)} replace />;

  return <HomePage />;
}

function DashboardEntry() {
  const { roles } = useAuth();
  const destination = getDashboardRoute(roles);

  if (destination === '/dashboard') {
    return <DashboardRouter />;
  }

  return <Navigate to={destination} replace />;
}

const withSuspense = (element, fallback = <AuthSpinner />) => (
  <Suspense fallback={fallback}>{element}</Suspense>
);

export const routes = [
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { index: true, element: withSuspense(<HomeEntry />) },
      {
        path: 'login',
        element: (
          <PublicRoute>
            {withSuspense(<Login />)}
          </PublicRoute>
        ),
      },
      {
        element: <Protected />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: 'dashboard',
                element: (
                  <RequirePermission permission={permKey('view', 'dashboard')}>
                    <DashboardEntry />
                  </RequirePermission>
                ),
              },
              {
                path: 'dashboard/home',
                element: (
                  <RequirePermission permission={permKey('view', 'dashboard')}>
                    <DashboardRouter />
                  </RequirePermission>
                ),
              },
              {
                path: 'dashboard/legal',
                element: (
                  <RequirePermission permission={permKey('view', 'dashboard')}>
                    <DashboardRouter />
                  </RequirePermission>
                ),
              },
              {
                path: 'dashboard/contracts',
                element: (
                  <RequirePermission permission={permKey('view', 'dashboard')}>
                    <DashboardRouter />
                  </RequirePermission>
                ),
              },
              { path: 'spike/data-fetching', element: <DataFetchingSpike /> },
              { path: 'profile/:userId', element: <ProfilePage /> },
              {
                path: 'archive',
                element: (
                  <RequirePermission permission={permKey('view', 'archives')}>
                    <ArchivePage />
                  </RequirePermission>
                ),
              },
              {
                path: 'editor',
                element: (
                  <RequirePermission permission={permKey('view', 'archives')}>
                    <DocumentEditor />
                  </RequirePermission>
                ),
              },
              {
                path: 'contracts',
                element: (
                  <RequirePermission permission={permKey('view', 'contracts')}>
                    <Contracts />
                  </RequirePermission>
                ),
              },
              {
                path: 'contracts/:id',
                element: (
                  <RequirePermission permission={permKey('view', 'contracts')}>
                    <ContractDetailsPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'profile',
                element: (
                  <RequirePermission permission={permKey('view', 'profile')}>
                    <ProfilePage />
                  </RequirePermission>
                ),
              },
              {
                path: 'users',
                element: (
                  <RequirePermission permission={permKey('view', 'users')}>
                    <UserManagementPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/investigations',
                element: (
                  <RequirePermission permission={permKey('view', 'investigations')}>
                    <Investigations />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/investigations/:id',
                element: (
                  <RequirePermission permission={permKey('view', 'investigations')}>
                    <InvestigationDetailsPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/investigation-action/:id',
                element: (
                  <RequirePermission permission={permKey('view', 'investigations')}>
                    <InvestigationActionDetailsPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/legal-advices',
                element: (
                  <RequirePermission permission={permKey('view', 'legal-advices')}>
                    <LegalAdvices />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/legal-advices/:id',
                element: (
                  <RequirePermission permission={permKey('view', 'legal-advices')}>
                    <LegalAdviceDetailsPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/litigations',
                element: (
                  <RequirePermission permission={permKey('view', 'litigations')}>
                    <Litigations />
                  </RequirePermission>
                ),
              },
              {
                path: 'legal/litigations/:id',
                element: (
                  <RequirePermission permission={permKey('view', 'litigations')}>
                    <LitigationDetailsPage />
                  </RequirePermission>
                ),
              },
              {
                path: 'managment-lists',
                element: (
                  <RequirePermission permission={permKey('view', 'management-lists')}>
                    <ManagementSettings />
                  </RequirePermission>
                ),
              },
              {
                path: 'management-lists',
                element: (
                  <RequirePermission permission={permKey('view', 'management-lists')}>
                    <ManagementSettings />
                  </RequirePermission>
                ),
              },
              { path: 'reports-page', element: <ReportsPage /> },
              { path: 'notifications', element: <NotificationsPage /> },
              { path: 'forbidden', element: <Navigate to="/403" replace /> },
              { path: '403', element: <Forbidden403 /> },
              { path: '*', element: <NotFound404 /> },
            ],
          },
        ],
      },
      { path: '*', element: <AuthRedirect /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
