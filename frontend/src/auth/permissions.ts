import { normalizePermissionName } from './permissionCatalog';

type CanOptions = {
  mode?: 'any' | 'all';
};

export const isAdminRole = (roles: string[] = []) =>
  roles.some((role) => String(role).toLowerCase() === 'admin');

const normalizeList = (permissions: string[] = []) =>
  permissions.map((perm) => normalizePermissionName(perm));

export const can = (
  userPermissions: string[] = [],
  required: string | string[] = [],
  { mode = 'all' }: CanOptions = {},
) => {
  const requiredList = Array.isArray(required) ? required : [required];
  if (!requiredList.length || requiredList.every((perm) => !perm)) return true;
  const normalizedPermissions = normalizeList(userPermissions);
  return mode === 'any'
    ? requiredList.some((perm) =>
        normalizedPermissions.includes(normalizePermissionName(perm)),
      )
    : requiredList.every((perm) =>
        normalizedPermissions.includes(normalizePermissionName(perm)),
      );
};

export const canAny = (userPermissions: string[] = [], required: string[] = []) =>
  can(userPermissions, required, { mode: 'any' });

export const canAll = (userPermissions: string[] = [], required: string[] = []) =>
  can(userPermissions, required, { mode: 'all' });
