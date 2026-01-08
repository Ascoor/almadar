import React from 'react';
import { useAuth } from '@/context/AuthContext';

type CanProps = {
  permission: string | string[];
  children: React.ReactNode;
  allowAdmin?: boolean;
  mode?: 'any' | 'all';
};

export function Can({
  permission,
  children,
  allowAdmin = true,
  mode = 'all',
}: CanProps) {
  const { can, roles } = useAuth();
  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;

  if (allowAdmin && isAdmin) return <>{children}</>;
  if (!permission) return null;
  if (!can(permission, { mode })) return null;

  return <>{children}</>;
}

type CanAnyProps = {
  permissions: string[];
  children: React.ReactNode;
  allowAdmin?: boolean;
};

export function CanAny({
  permissions,
  children,
  allowAdmin = true,
}: CanAnyProps) {
  return (
    <Can permission={permissions} allowAdmin={allowAdmin} mode="any">
      {children}
    </Can>
  );
}

type CanAllProps = {
  permissions: string[];
  children: React.ReactNode;
  allowAdmin?: boolean;
};

export function CanAll({
  permissions,
  children,
  allowAdmin = true,
}: CanAllProps) {
  return (
    <Can permission={permissions} allowAdmin={allowAdmin} mode="all">
      {children}
    </Can>
  );
}
