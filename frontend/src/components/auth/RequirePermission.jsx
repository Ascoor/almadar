import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RequirePermission = ({
  permission,
  mode = 'all',
  redirectTo = '/forbidden',
  children,
}) => {
  const { can } = useAuth();

  if (!can(permission, { mode })) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RequirePermission;
