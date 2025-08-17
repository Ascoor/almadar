import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/components/auth/AuthContext';

/**
 * @param {string|string[]} permission - required permission(s)
 * @param {ReactNode} children - component to render if allowed
 */
const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = useContext(AuthContext);

  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = required.every((perm) => hasPermission(perm));

  return allowed ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
