import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import ModeratorDashboard from '@/pages/dashboards/ModeratorDashboard';
import UserDashboard from '@/pages/dashboards/UserDashboard';

export default function DashboardRouter() {
  const { roles, can, hasAnyPermission } = useAuth();
  const roleNames = Array.isArray(roles) ? roles : [];
  const normalized = roleNames.map((role) => String(role).toLowerCase());

  if (normalized.includes('admin')) return <AdminDashboard />;
  if (normalized.includes('moderator') || normalized.includes('manager')) {
    return <ModeratorDashboard />;
  }
  if (normalized.includes('user')) return <UserDashboard />;

  if (
    hasAnyPermission(['view users', 'view roles', 'view permissions']) ||
    can(['create users', 'edit users'], { mode: 'any' })
  ) {
    return <AdminDashboard />;
  }

  if (
    can(
      [
        'view contracts',
        'create contracts',
        'edit contracts',
        'view investigations',
        'create investigations',
        'edit investigations',
        'view litigations',
        'create litigations',
        'edit litigations',
        'view legal-advices',
        'create legal-advices',
        'edit legal-advices',
        'view archives',
      ],
      { mode: 'any' },
    )
  ) {
    return <ModeratorDashboard />;
  }

  return <UserDashboard />;
}
