import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { initEcho } from '@/lib/echo';
import API_CONFIG from '@/config/config';
import { useNetworkStatus } from './NetworkStatusContext';
import {
  normalizePermissionName,
  normalizePermissionsList,
} from '@/auth/permissionCatalog';

// إنشاء الـ Context
export const AuthContext = createContext({
  user: null,
  token: null,
  roles: [],
  permissions: [],
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
  hasPermission: () => false,
  updateUserContext: () => {},
  updatePermissions: () => {},
  canAny: () => false,
  canAll: () => false,
});

export function AuthProvider({ children }) {
  const { guardOnline } = useNetworkStatus();
  const [token, setToken] = useState(() =>
    sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : null,
  );
  const [user, setUser] = useState(() =>
    sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user'))
      : null,
  );
  const [roles, setRoles] = useState(() =>
    sessionStorage.getItem('roles')
      ? JSON.parse(sessionStorage.getItem('roles'))
      : [],
  );
  const [permissions, setPermissions] = useState(() =>
    sessionStorage.getItem('permissions')
      ? normalizePermissionsList(
          JSON.parse(sessionStorage.getItem('permissions')),
        )
      : [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const saveAuth = ({ user, token, roles, permissions }) => {
    const normalizedPermissions = normalizePermissionsList(permissions || []);
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('roles', JSON.stringify(roles));
    sessionStorage.setItem(
      'permissions',
      JSON.stringify(normalizedPermissions),
    );

    setToken(token);
    setUser(user);
    setRoles(roles);
    setPermissions(normalizedPermissions);
  };

  const login = async (email, password) => {
    if (!guardOnline('تسجيل الدخول يحتاج إلى اتصال بالشبكة.')) {
      return {
        success: false,
        message: 'لا يمكن تسجيل الدخول بدون اتصال بالإنترنت.',
      };
    }

    try {
      await axios.get(`${API_CONFIG.baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const { user, token, roles = [], permissions = [] } = response.data;
      if (user && token) {
        saveAuth({ user, token, roles, permissions });
        return { success: true, user, roles, permissions };
      }
      return {
        success: false,
        message: 'بيانات تسجيل الدخول غير مكتملة.',
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Connection error',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const echo = initEcho();
    echo?.disconnect?.();

    try {
      await axios.post(`${API_CONFIG.baseURL}/api/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.warn('Logout failed:', error);
    }
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRoles([]);
    setPermissions([]);
    return { success: true };
  };

  const hasRole = (roleName) => roles.includes(roleName);
  const hasPermission = (permName) =>
    permissions.includes(normalizePermissionName(permName));
  const hasAnyPermission = (permNames = []) =>
    permNames.some((perm) => hasPermission(perm));
  const hasAllPermissions = (permNames = []) =>
    permNames.every((perm) => hasPermission(perm));
  const can = (permNames, { mode = 'all' } = {}) => {
    const list = Array.isArray(permNames) ? permNames : [permNames];
    if (list.length === 0 || list.every((perm) => !perm)) return true;
    return mode === 'any'
      ? hasAnyPermission(list)
      : hasAllPermissions(list);
  };
  const canAny = (permNames = []) => can(permNames, { mode: 'any' });
  const canAll = (permNames = []) => can(permNames, { mode: 'all' });

  // Echo for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const echo = initEcho();
    const channel = echo.private(`user.${user.id}`);
    const handler = (eventData) => {
      if (eventData?.permissions) {
        const normalizedPermissions = normalizePermissionsList(
          eventData.permissions,
        );
        setPermissions(normalizedPermissions);
        sessionStorage.setItem(
          'permissions',
          JSON.stringify(normalizedPermissions),
        );
        toast.success('تم تحديث صلاحياتك');
      }
    };

    channel.listen('.permissions.updated', handler);

    return () => {
      channel.stopListening('.permissions.updated', handler);
    };
  }, [user]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        permissions,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        can,
        canAny,
        canAll,
        updateUserContext: (updatedUser) => {
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        },
        updatePermissions: (newPermissions) => {
          const normalizedPermissions =
            normalizePermissionsList(newPermissions);
          setPermissions(normalizedPermissions);
          sessionStorage.setItem(
            'permissions',
            JSON.stringify(normalizedPermissions),
          );
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
