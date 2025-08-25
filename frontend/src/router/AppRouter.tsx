import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';

const Login = lazy(() => import('@/components/auth/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

function Protected({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth() as any;
  if (isLoading) return <AuthSpinner />;
  return user ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
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
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
