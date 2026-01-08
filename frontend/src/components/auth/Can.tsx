import React from 'react';
import { useAuth } from '@/context/AuthContext';

type CanProps = {
  permission: string;
  children: React.ReactNode;
  allowAdmin?: boolean;
};

export function Can({ permission, children, allowAdmin = true }: CanProps) {
  const { hasPermission, roles } = useAuth();
  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;

  if (allowAdmin && isAdmin) return <>{children}</>;
  if (!permission) return null;
  if (!hasPermission(permission)) return null;

  return <>{children}</>;
}
