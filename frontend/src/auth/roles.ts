export type RoleInput =
  | string
  | {
      name?: string | null;
      role?: string | null;
    }
  | null
  | undefined;

const extractRoleName = (role: RoleInput): string | null => {
  if (!role) return null;
  if (typeof role === 'string') return role;
  if (typeof role === 'object') {
    if (role.name) return role.name;
    if (role.role) return role.role;
  }
  return null;
};

export const normalizeRoles = (roles: RoleInput[] | undefined): string[] => {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((role) => extractRoleName(role))
    .filter(Boolean)
    .map((role) => String(role).toLowerCase());
};
