import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import ModeratorDashboard from '@/pages/dashboards/ModeratorDashboard';
import UserDashboard from '@/pages/dashboards/UserDashboard';

const normalizeRoles = (roles) =>
  Array.isArray(roles)
    ? roles.map((role) => String(role).toLowerCase())
    : [];

export default function DashboardRouter() {
  const { roles } = useAuth();
  const normalizedRoles = normalizeRoles(roles);
  const hasRole = (role) => normalizedRoles.includes(role);
  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator') || hasRole('manager');
  const isContractsUser = hasRole('user') || hasRole('contracting_officer');
  const isLegalUser = hasRole('legal_investigator') || hasRole('lawyer');

  if (isAdmin) return <AdminDashboard />;
  if (isModerator) return <ModeratorDashboard />;
  if (isContractsUser || isLegalUser) return <UserDashboard />;
  return <UserDashboard />;
}
