import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RequirePermission = ({
  permission,
  mode = 'all',
  redirectTo = '/403',
  children,
}) => {
  const { can, roles } = useAuth();
  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;

  if (!isAdmin && !can(permission, { mode })) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RequirePermission;
