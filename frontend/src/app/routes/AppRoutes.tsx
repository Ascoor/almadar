import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RequireAuth from '../guards/RequireAuth';
import RequirePermission from '../guards/RequirePermission';
import GlobalSpinner from '@/components/layout/GlobalSpinner';
import { AppLayout } from '@/layout/AppLayout';

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const Profile = lazy(() => import('@/pages/Profile/ProfilePage'));
const Contracts = lazy(() => import('@/pages/Contracts/ContractsPage'));
const ContractDetails = lazy(() => import('@/pages/Contracts/ContractDetails'));
const ContractForm = lazy(() => import('@/pages/Contracts/ContractForm'));
const Investigations = lazy(() => import('@/pages/Legal/Investigations/InvestigationsPage'));
const InvestigationDetails = lazy(() => import('@/pages/Legal/Investigations/InvestigationDetails'));
const LegalAdvices = lazy(() => import('@/pages/Legal/LegalAdvices/LegalAdvicesPage'));
const AdviceDetails = lazy(() => import('@/pages/Legal/LegalAdvices/AdviceDetails'));
const Litigations = lazy(() => import('@/pages/Legal/Litigations/LitigationsPage'));
const LitigationDetails = lazy(() => import('@/pages/Legal/Litigations/LitigationDetails'));
const Users = lazy(() => import('@/pages/Users/UserManagementPage'));
const Archive = lazy(() => import('@/pages/Archive/ArchivePage'));
const Reports = lazy(() => import('@/pages/Reports/ReportsPage'));
const Forbidden = lazy(() => import('@/pages/Forbidden/ForbiddenPage'));
const Login = lazy(() => import('@/pages/Auth/LoginPage'));
const Settings = lazy(() => import('@/pages/SettingsPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const router = createBrowserRouter([
  { 
    path: '/login', 
    element: (
      <Suspense fallback={<GlobalSpinner />}>
        <Login />
      </Suspense>
    )
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { 
        path: '/', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Dashboard />
          </Suspense>
        )
      },
      { 
        path: '/profile', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Profile />
          </Suspense>
        ), 
        handle: { permission: 'view profile' } 
      },
      { 
        path: '/contracts', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Contracts />
          </Suspense>
        ), 
        handle: { permission: 'view contracts' } 
      },
      { 
        path: '/contracts/new', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <ContractForm />
          </Suspense>
        ), 
        handle: { permission: 'edit contracts' } 
      },
      { 
        path: '/contracts/:id', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <ContractDetails />
          </Suspense>
        ), 
        handle: { permission: 'view contracts' } 
      },
      { 
        path: '/contracts/:id/edit', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <ContractForm />
          </Suspense>
        ), 
        handle: { permission: 'edit contracts' } 
      },
      { 
        path: '/legal/investigations', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Investigations />
          </Suspense>
        ), 
        handle: { permission: 'view investigations' } 
      },
      { 
        path: '/legal/investigations/:id', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <InvestigationDetails />
          </Suspense>
        ), 
        handle: { permission: 'view investigations' } 
      },
      { 
        path: '/legal/legal-advices', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <LegalAdvices />
          </Suspense>
        ), 
        handle: { permission: 'view legaladvices' } 
      },
      { 
        path: '/legal/legal-advices/:id', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <AdviceDetails />
          </Suspense>
        ), 
        handle: { permission: 'view legaladvices' } 
      },
      { 
        path: '/legal/litigations', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Litigations />
          </Suspense>
        ), 
        handle: { permission: 'view litigations' } 
      },
      { 
        path: '/legal/litigations/:id', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <LitigationDetails />
          </Suspense>
        ), 
        handle: { permission: 'view litigations' } 
      },
      { 
        path: '/users', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Users />
          </Suspense>
        ), 
        handle: { permission: 'view users' } 
      },
      { 
        path: '/archive', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Archive />
          </Suspense>
        )
      },
      { 
        path: '/reports', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Reports />
          </Suspense>
        )
      },
      { 
        path: '/settings', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Settings />
          </Suspense>
        )
      },
      { 
        path: '/forbidden', 
        element: (
          <Suspense fallback={<GlobalSpinner />}>
            <Forbidden />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<GlobalSpinner />}>
        <NotFound />
      </Suspense>
    )
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}