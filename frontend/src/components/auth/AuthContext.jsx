import React, { createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/config';

// إنشاء الـ Context مع القيم الافتراضية
export const AuthContext = createContext({
  user: null,
  token: null,
  roles: [],
  permissions: [],
  login: async () => false,
  logout: () => {},
  hasRole: () => false,
  hasPermission: () => false,
  http: axios,
});

// الـ Provider الذي يغلف التطبيق ويوفر بيانات المصادقة
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // استرجاع البيانات من sessionStorage أو تعيين قيم افتراضية
  const [token, setToken] = useState(() => {
    const t = sessionStorage.getItem('token');
    return t ? JSON.parse(t) : null;
  });
  const [user, setUser] = useState(() => {
    const u = sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [roles, setRoles] = useState(() => {
    const r = sessionStorage.getItem('roles');
    return r ? JSON.parse(r) : [];
  });
  const [permissions, setPermissions] = useState(() => {
    const p = sessionStorage.getItem('permissions');
    return p ? JSON.parse(p) : [];
  });

  // إعداد axios مع الـ token مدمج ورابط الـ API
  const http = useMemo(() => {
    const instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      withCredentials: true,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [token]);

  // حفظ بيانات المصادقة وتخزينها بالجلسة وتحديث الـ state
  const saveAuth = ({ user: u, token: t, roles: rl, permissions: pr }) => {
    sessionStorage.setItem('token', JSON.stringify(t));
    sessionStorage.setItem('user', JSON.stringify(u));
    sessionStorage.setItem('roles', JSON.stringify(rl));
    sessionStorage.setItem('permissions', JSON.stringify(pr));

    setToken(t);
    setUser(u);
    setRoles(rl);
    setPermissions(pr);

    navigate('/'); // توجه للرئيسية بعد تسجيل الدخول
  };

  // دالة تسجيل الدخول
  const login = async (email, password) => {
    try {
      // طلب CSRF Cookie إن كنت تستخدم Laravel Sanctum أو نظام مشابه
      await axios.get(`${API_CONFIG.baseURL}/sanctum/csrf-cookie`, { withCredentials: true });

      const resp = await axios.post(
        `${API_CONFIG.baseURL}/api/login`,
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      const { user: u, token: t, roles: rl = [], permissions: pr = [] } = resp.data;

      if (u && t) {
        saveAuth({ user: u, token: t, roles: rl, permissions: pr });
        return true;
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
    }
    return false;
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      await http.post('/api/logout');
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

  // فحص وجود دور
  const hasRole = (roleName) => roles.includes(roleName);

  // فحص وجود صلاحية
  const hasPermission = (permName) => permissions.includes(permName);

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
        http,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook لتسهيل استخدام AuthContext في المكونات
export const useAuth = () => {
  return useContext(AuthContext);
};
