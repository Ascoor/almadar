// src/router/AppRouter.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
 

const Login = lazy(() => import('@/components/organisms/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DocumentEditor = lazy(() => import('@/components/editor/DocumentEditor'));
const StaffList = lazy(() => import('@/pages/Staff/List'));
const StaffForm = lazy(() => import('@/pages/Staff/Form'));
const DepartmentsPage = lazy(() => import('@/pages/Departments'));
const Forbidden = lazy(() => import('@/pages/Forbidden'));

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PermissionGuard({ permission, children }) {
  const { hasPermission } = useAuth();
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
}

function ProvidersRoot() {
  return (
    // <ThemeProvider>
    <AuthProvider>
      <Outlet />
    </AuthProvider>
    // </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <ProvidersRoot />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      {
        path: '/login',
        element: (
          <Suspense fallback={<AuthSpinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Protected>
            <Suspense fallback={<AuthSpinner />}>
              <Dashboard />
            </Suspense>
          </Protected>
        ),
      },
      {
        path: '/editor',
        element: (
          <Protected>
            <Suspense fallback={<AuthSpinner />}>
              <DocumentEditor />
            </Suspense>
          </Protected>
        ),
      },
      {
        path: '/staff',
        element: (
          <Protected>
            <PermissionGuard permission="staff.manage">
              <Suspense fallback={<AuthSpinner />}>
                <StaffList />
              </Suspense>
            </PermissionGuard>
          </Protected>
        ),
      },
      {
        path: '/staff/new',
        element: (
          <Protected>
            <PermissionGuard permission="staff.manage">
              <Suspense fallback={<AuthSpinner />}>
                <StaffForm />
              </Suspense>
            </PermissionGuard>
          </Protected>
        ),
      },
      {
        path: '/staff/:id/edit',
        element: (
          <Protected>
            <PermissionGuard permission="staff.manage">
              <Suspense fallback={<AuthSpinner />}>
                <StaffForm />
              </Suspense>
            </PermissionGuard>
          </Protected>
        ),
      },
      {
        path: '/departments',
        element: (
          <Protected>
            <PermissionGuard permission="departments.manage">
              <Suspense fallback={<AuthSpinner />}>
                <DepartmentsPage />
              </Suspense>
            </PermissionGuard>
          </Protected>
        ),
      },
      {
        path: '/forbidden',
        element: (
          <Suspense fallback={<AuthSpinner />}>
            <Forbidden />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
