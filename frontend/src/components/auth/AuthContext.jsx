import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api, { setOnUnauthorized } from '@/services/api/axiosConfig';

// إنشاء السياق الافتراضي
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
  http: api,
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // الحالة الأولية من sessionStorage
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

  const [loading, setLoading] = useState(true);

  /**
   * دالة حفظ بيانات الجلسة والتحديث في السياق
   */
  const saveAuth = ({ user: u, token: t, roles: rl, permissions: pr }) => {
    sessionStorage.setItem('token', JSON.stringify(t));
    sessionStorage.setItem('user', JSON.stringify(u));
    sessionStorage.setItem('roles', JSON.stringify(rl));
    sessionStorage.setItem('permissions', JSON.stringify(pr));

    setToken(t);
    setUser(u);
    setRoles(rl);
    setPermissions(pr);

    navigate('/');
  };

  /**
   * دالة تسجيل الدخول
   */
  const login = async (email, password) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const resp = await api.post(
        '/api/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const {
        user: u,
        token: t,
        roles: rl = [],
        permissions: pr = [],
      } = resp.data;

      if (u && t) {
        saveAuth({ user: u, token: t, roles: rl, permissions: pr });
        return {
          success: true,
          requirePasswordChange: u.password_changed === false,
          user: u,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'فشل الاتصال بالخادم',
      };
    }
  };

  /**
   * دالة تسجيل الخروج
   */
  const logout = async (showToast = false) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        await api.post('/api/logout');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    sessionStorage.clear();
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);

    if (showToast) {
      toast.warning('تم تسجيل الخروج بسبب انتهاء الجلسة');
    }

    navigate('/');
  };

  /**
   * مراقبة الاستجابة لـ 401 Unauthorized وتسجيل الخروج تلقائيًا
   */
  useEffect(() => {
    setOnUnauthorized(() => () => logout(true));
  }, []);

  /**
   * تحميل المستخدم عند بداية تشغيل التطبيق إذا كان هناك توكن
   */
  useEffect(() => {
    const fetchUser = async () => {
      const tokenString = sessionStorage.getItem('token');
      let token;

      try {
        token = JSON.parse(tokenString);
      } catch {
        token = null;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/user');
        const { user: u, roles: rl = [], permissions: pr = [] } = res.data;

        setUser(u);
        setRoles(rl);
        setPermissions(pr);
      } catch (err) {
        console.error('Error fetching user:', err);
        await logout(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /**
   * تحديث بيانات المستخدم
   */
  const updateUserContext = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /**
   * تحديث الصلاحيات
   */
  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions);
    sessionStorage.setItem('permissions', JSON.stringify(newPermissions));
  };

  /**
   * التحقق من امتلاك دور
   */
  const hasRole = (roleName) => roles.includes(roleName);

  /**
   * التحقق من امتلاك صلاحية
   */
  const hasPermission = (permName) => permissions.includes(permName);

  const authContextValue = useMemo(
    () => ({
      user,
      token,
      roles,
      permissions,
      login,
      logout,
      hasRole,
      hasPermission,
      updateUserContext,
      updatePermissions,
      http: api,
    }),
    [user, token, roles, permissions]
  );

  if (loading) return <div><AuthSpinner/></div>;

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// مهوية استخدام السياق بسهولة
export const useAuth = () => useContext(AuthContext);
