import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

/**
 * @param {string|string[]} permission
 * @param {ReactNode} children - 
 * @param {boolean} superAdminOnly - 
 */
const ProtectedRoute = ({ permission, children, superAdminOnly = false }) => {
  const { hasPermission, user } = useContext(AuthContext);

  const isSuperAdmin = user?.email === 'superadmin@almadar.ly';

  // منع الوصول إذا كانت الصفحة مخصصة للسوبر أدمن فقط
  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  // دعم أكثر من صلاحية
  const permissions = Array.isArray(permission) ? permission : [permission];
  const allowed = permissions.every((perm) => hasPermission(perm));

  return allowed ? children : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoute;
