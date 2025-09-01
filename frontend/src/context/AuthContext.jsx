import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initEcho } from '@/lib/echo';
import API_CONFIG from '@/config/config';

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
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : null);
  const [user, setUser] = useState(() => sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null);
  const [roles, setRoles] = useState(() => sessionStorage.getItem('roles') ? JSON.parse(sessionStorage.getItem('roles')) : []);
  const [permissions, setPermissions] = useState(() => sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : []);

  const saveAuth = ({ user, token, roles, permissions }) => {
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('roles', JSON.stringify(roles));
    sessionStorage.setItem('permissions', JSON.stringify(permissions));

    setToken(token);
    setUser(user);
    setRoles(roles);
    setPermissions(permissions);
    navigate('/');
  };

  const login = async (email, password) => {
    try {
      await axios.get(`${API_CONFIG.baseURL}/sanctum/csrf-cookie`, { withCredentials: true });
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/login`,
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      const { user, token, roles = [], permissions = [] } = response.data;
      if (user && token) {
        saveAuth({ user, token, roles, permissions });
        return { success: true, user };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Connection error' };
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

  const hasRole = (roleName) => roles.includes(roleName);
  const hasPermission = (permName) => permissions.includes(permName);

  // Echo for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const echo = initEcho();
    const channel = echo.private(`user.${user.id}`);
    const handler = (eventData) => {
      if (eventData?.permissions) {
        setPermissions(eventData.permissions);
        sessionStorage.setItem('permissions', JSON.stringify(eventData.permissions));
        toast.success('تم تحديث صلاحياتك');
      }
    };

    channel.listen('.permissions.updated', handler);

    return () => {
      channel.stopListening('.permissions.updated', handler);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        permissions,
        login,
        logout,
        hasRole,
        hasPermission,
        updateUserContext: (updatedUser) => {
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        },
        updatePermissions: (newPermissions) => {
          setPermissions(newPermissions);
          sessionStorage.setItem('permissions', JSON.stringify(newPermissions));
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

