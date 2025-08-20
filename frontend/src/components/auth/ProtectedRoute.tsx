import { Navigate } from 'react-router-dom';
import { usePermission } from '@/contexts/PermissionContext';

export default function ProtectedRoute({ requiredPermissions = [], children }: { requiredPermissions?: string[]; children: JSX.Element }) {
  const { can } = usePermission();
  const ok = requiredPermissions.length ? requiredPermissions.every(can) : true;
  return ok ? children : <Navigate to="/forbidden" replace />;
}
