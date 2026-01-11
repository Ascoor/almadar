import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import ModeratorDashboard from '@/pages/dashboards/ModeratorDashboard';
import UserDashboard from '@/pages/dashboards/UserDashboard';
import { normalizeRoles } from '@/auth/roles';

export default function DashboardRouter() {
  const { roles } = useAuth();
  const normalizedRoles = normalizeRoles(roles);
  const hasRole = (role) => normalizedRoles.includes(role);
  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator') || hasRole('manager');

  if (isAdmin) return <AdminDashboard />;
  if (isModerator) return <ModeratorDashboard />;
  return <UserDashboard />;
}
