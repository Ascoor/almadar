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
  if (!user) return <Navigate to="/login" replace />;

  return children || <Outlet />;
}

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthSpinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AuthRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthSpinner />;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export const routes = [
  {
    element: (
      <AuthProvider>
        <Suspense fallback={<AuthSpinner />}>
          <Outlet />
        </Suspense>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <AuthRedirect /> },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        element: <Protected />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'editor', element: <DocumentEditor /> },
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
