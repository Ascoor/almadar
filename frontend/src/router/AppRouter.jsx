// src/router/AppRouter.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';

const Login = lazy(() => import('@/components/organisms/Login'));
const Dashboard = lazy(() => import('@/pages/DashboardPage'));
const DocumentEditor = lazy(() => import('@/components/editor/DocumentEditor'));
const HomePage = lazy(() => import('@/pages/HomePage'));

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

function HomeEntry() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <HomePage />;
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
      { index: true, element: <HomeEntry /> },
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
          { path: '*', element: <Dashboard /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
