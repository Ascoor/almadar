import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/components/auth/AuthContext';

/**
 * @param {string} permission - e.g. "view contracts"
 * @param {ReactNode} children - component to render if allowed
 */
const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = useContext(AuthContext);

  return hasPermission(permission) ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
