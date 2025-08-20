import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createEcho } from '@/lib/echo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type PermissionSet = { permissions: string[]; version: number };

const Ctx = createContext<{ list:string[]; version:number; can:(n:string|string[])=>boolean; }>({
  list: [], version: 0, can: () => false
});

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const qc = useQueryClient();
  const { token, user } = useAuth();

  const { data } = useQuery<PermissionSet>({
    queryKey: ['me','permissions'],
    queryFn: async () => (await fetch('/api/me/permissions', { headers: { Authorization: `Bearer ${token}` }})).json(),
    enabled: !!token
  });

  useEffect(() => {
    if (!token || !user) return;
    const echo = createEcho(token);
    echo.private(`user.${user.id}`).listen('.permissions.updated', () => {
      toast('Permissions updated');
      qc.invalidateQueries({ queryKey: ['me','permissions'] });
    });
    return () => { echo.disconnect(); };
  }, [token, user]);

  const list = data?.permissions ?? [];
  const version = data?.version ?? 0;
  const can = (name: string | string[]) => Array.isArray(name) ? name.every(n => list.includes(n)) : list.includes(name);
  const value = useMemo(() => ({ list, version, can }), [list, version]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const usePermission = () => useContext(Ctx);
