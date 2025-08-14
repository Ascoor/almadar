import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSpinner from '@/components/layout/GlobalSpinner';
import { useEffect } from 'react';

interface RequireAuthProps {
  children?: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log access attempts for security monitoring
    if (!loading && !user) {
      console.log('Unauthorized access attempt to:', location.pathname);
    }
  }, [loading, user, location.pathname]);

  if (loading) {
    return <GlobalSpinner />;
  }

  if (!user) {
    // Redirect to login with return path
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname + location.search }} 
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}