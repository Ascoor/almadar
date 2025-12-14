import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * @param {string|string[]} permission
 * @param {ReactNode} children -
 * @param {boolean} superAdminOnly -
 */
const ProtectedRoute = ({ permission, children, superAdminOnly = false }) => {
  const { hasPermission, hasPerm, user, isReady } = useAuth();

  if (!isReady) return null;

  const isSuperAdmin = user?.email === 'superadmin@almadar.ly';

  // منع الوصول إذا كانت الصفحة مخصصة للسوبر أدمن فقط
  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  // دعم أكثر من صلاحية
  const permissions = Array.isArray(permission) ? permission : [permission];
  const allowed = permissions.every((perm) => (hasPermission ? hasPermission(perm) : hasPerm(perm)));

  return allowed ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
