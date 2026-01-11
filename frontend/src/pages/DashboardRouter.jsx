import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { normalizeRoles, hasRole } from '@/auth/roleUtils';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import LegalDashboard from '@/pages/dashboards/LegalDashboard';
import ContractsDashboard from '@/pages/dashboards/ContractsDashboard';
import UserDashboard from '@/pages/dashboards/UserDashboard';

export default function DashboardRouter() {
  const auth = useAuth();
  const roles = normalizeRoles(auth?.user, auth?.roles);

  if (hasRole(roles, 'admin')) return <AdminDashboard />;
  if (hasRole(roles, 'legal')) return <LegalDashboard />;
  if (hasRole(roles, 'contracts')) return <ContractsDashboard />;
  return <UserDashboard />;
}
