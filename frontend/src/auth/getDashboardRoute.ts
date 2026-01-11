import { normalizeRoles, type RoleInput } from './roles';

export function getDashboardRoute(roles: RoleInput[] | undefined): string {
  const normalizedRoles = normalizeRoles(roles);
  const hasRole = (role: string) => normalizedRoles.includes(role);
  const isModerator = hasRole('moderator') || hasRole('manager');

  if (hasRole('admin') || isModerator) return '/dashboard';
  if (hasRole('legal') || hasRole('legal_investigator') || hasRole('lawyer')) {
    return '/dashboard/legal';
  }
  if (hasRole('contracts') || hasRole('contract')) {
    return '/dashboard/contracts';
  }
  if (hasRole('user')) return '/dashboard/home';
  return '/dashboard/home';
}
