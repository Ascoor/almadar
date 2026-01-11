import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { normalizeRoles } from '@/auth/roles';

const RequirePermission = ({
  permission,
  mode = 'all',
  redirectTo = '/403',
  children,
}) => {
  const { can, roles } = useAuth();
  const isAdmin = normalizeRoles(roles).includes('admin');

  if (!isAdmin && !can(permission, { mode })) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RequirePermission;
