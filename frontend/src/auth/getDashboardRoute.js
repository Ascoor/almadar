import { hasRole, normalizeRoles } from './roleUtils';

export function getDashboardRoute(roles) {
  const normalizedRoles = normalizeRoles(null, roles);

  if (hasRole(normalizedRoles, 'admin')) return '/dashboard/admin';
  if (hasRole(normalizedRoles, 'legal')) return '/dashboard/legal';
  if (hasRole(normalizedRoles, 'contracts')) return '/dashboard/contracts';
  return '/dashboard/home';
}
