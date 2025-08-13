import { useMatches, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface RequirePermissionProps {
  children?: ReactNode;
  permission?: string;
}

export default function RequirePermission({ children, permission }: RequirePermissionProps) {
  const { user } = useAuth();
  const matches = useMatches();
  
  // Get permission from route handle or props
  const lastMatch = matches.at(-1);
  const requiredPermission = permission || (lastMatch?.handle as any)?.permission as string | undefined;

  // If no permission is required, allow access
  if (!requiredPermission) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check if user has the required permission
  const hasPermission = user?.permissions?.includes(requiredPermission);

  if (!hasPermission) {
    // Log permission denial for security monitoring
    console.warn(`Access denied to ${requiredPermission} for user ${user?.id}`);
    
    return <Navigate to="/forbidden" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}