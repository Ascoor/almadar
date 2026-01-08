import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import ModeratorDashboard from '@/pages/dashboards/ModeratorDashboard';
import UserDashboard from '@/pages/dashboards/UserDashboard';

export default function DashboardRouter() {
  const { roles } = useAuth();
  const roleNames = Array.isArray(roles) ? roles : [];
  const normalized = roleNames.map((role) => String(role).toLowerCase());

  if (normalized.includes('admin')) return <AdminDashboard />;
  if (normalized.includes('moderator') || normalized.includes('manager')) {
    return <ModeratorDashboard />;
  }

  return <UserDashboard />;
}
