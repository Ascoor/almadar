export function getDashboardRoute(roles: string[] | undefined): string {
  const normalizedRoles = Array.isArray(roles)
    ? roles.map((role) => String(role).toLowerCase())
    : [];

  if (normalizedRoles.includes('admin')) return '/dashboard';
  if (
    normalizedRoles.includes('legal_investigator') ||
    normalizedRoles.includes('lawyer')
  ) {
    return '/dashboard/legal';
  }
  if (
    normalizedRoles.includes('contracting_officer') ||
    normalizedRoles.includes('user')
  ) {
    return '/dashboard/contracts';
  }
  if (normalizedRoles.includes('manager') || normalizedRoles.includes('moderator')) {
    return '/dashboard/home';
  }
  return '/dashboard/home';
}
