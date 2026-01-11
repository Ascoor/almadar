export function normalizeRoles(user, rolesFromContext) {
  const raw =
    rolesFromContext ??
    user?.roles ??
    user?.role ??
    user?.data?.roles ??
    [];

  if (typeof raw === 'string') return [raw.toLowerCase()];

  if (Array.isArray(raw) && raw.every((x) => typeof x === 'string')) {
    return raw.map((x) => String(x).toLowerCase());
  }

  if (Array.isArray(raw)) {
    return raw
      .map((x) => x?.name ?? x?.role ?? x?.key ?? x?.slug)
      .filter(Boolean)
      .map((x) => String(x).toLowerCase());
  }

  return [];
}

export function hasRole(roles, name) {
  const n = String(name).toLowerCase();
  return Array.isArray(roles) && roles.includes(n);
}
