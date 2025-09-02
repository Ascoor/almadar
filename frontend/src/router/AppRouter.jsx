// src/router/AppRouter.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
 

const Login = lazy(() => import('@/components/organisms/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DocumentEditor = lazy(() => import('@/components/editor/DocumentEditor'));

function Protected({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <AuthSpinner />;
  return user ? children : <Navigate to="/login" replace />;
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
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
