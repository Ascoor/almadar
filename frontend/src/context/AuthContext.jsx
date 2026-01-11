import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initEcho } from '@/lib/echo';
import API_CONFIG from '@/config/config';
import { useNetworkStatus } from './NetworkStatusContext';
import {
  normalizePermissionName,
  normalizePermissionsList,
} from '@/auth/permissionCatalog';
import { getDashboardRoute } from '@/auth/getDashboardRoute';
import { normalizeRoles, hasRole as roleMatches } from '@/auth/roleUtils';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
  const navigate = useNavigate();
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
      ? normalizeRoles(null, JSON.parse(sessionStorage.getItem('roles')))
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
    const normalizedRoles = normalizeRoles(user, roles);
    const normalizedPermissions = normalizePermissionsList(permissions || []);
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('roles', JSON.stringify(normalizedRoles));
    sessionStorage.setItem(
      'permissions',
      JSON.stringify(normalizedPermissions),
    );

    setToken(token);
    setUser(user);
    setRoles(normalizedRoles);
    setPermissions(normalizedPermissions);
    navigate(getDashboardRoute(normalizedRoles));
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
        return { success: true, user };
      }
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
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.warn('Logout failed:', error);
    }
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRoles([]);
    setPermissions([]);
    navigate('/login');
  };

  const normalizedRoles = useMemo(
    () => normalizeRoles(user, roles),
    [user, roles],
  );
  const hasRole = (roleName) => roleMatches(normalizedRoles, roleName);
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

    let channel;
    let handler;

    const connect = async () => {
      try {
        await axios.get(`${API_CONFIG.baseURL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
      } catch (error) {
        console.warn('Failed to refresh CSRF cookie:', error);
      }

      const echo = initEcho();
      channel = echo.private(`user.${user.id}`);
      handler = (eventData) => {
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
    };

    connect();

    return () => {
      if (channel && handler) {
        channel.stopListening('.permissions.updated', handler);
      }
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
        roles: normalizedRoles,
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
