export function getDashboardRoute(roles: string[] | undefined): string {
  const normalizedRoles = Array.isArray(roles)
    ? roles.map((role) => String(role).toLowerCase())
    : [];

  if (normalizedRoles.includes('admin')) return '/dashboard';
  if (normalizedRoles.includes('legal')) return '/dashboard/legal';
  if (normalizedRoles.includes('contracts') || normalizedRoles.includes('contract')) {
    return '/dashboard/contracts';
  }
  return '/dashboard/home';
}
