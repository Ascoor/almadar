import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { login as loginService, logout as logoutService, getMe } from '@/services/auth';

export type User = { 
  id: string; 
  name: string; 
  email: string;
  roles: string[]; 
  permissions: string[];
  mustChangePassword?: boolean;
};

type AuthContextType = { 
  user: User | null;
  loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        localStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const login = async (email: string, password: string) => {
      try {
        const userData = await loginService(email, password);
        setUser(userData);
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: `أهلاً بك ${userData.name}`,
        });
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || 'فشل في تسجيل الدخول';
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: message,
          variant: 'destructive',
        });
        throw err;
      }
    };

    const register = async (name: string, email: string, password: string) => {
      try {
        const { data } = await api.post('/api/register', { name, email, password });
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: `أهلاً بك ${data.user.name}`,
        });
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || 'فشل في إنشاء الحساب';
        toast({
          title: 'خطأ في التسجيل',
          description: message,
          variant: 'destructive',
        });
        throw err;
      }
    };

    const logout = async () => {
      await logoutService();
      setUser(null);
      toast({
        title: 'تم تسجيل الخروج',
        description: 'تم تسجيل خروجك بنجاح',
      });
      window.location.href = '/login';
    };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.post('/api/change-password', {
        currentPassword,
        newPassword
      });
      
      // Update user to clear mustChangePassword flag
      if (user?.mustChangePassword) {
        setUser({ ...user, mustChangePassword: false });
      }
      
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'فشل في تغيير كلمة المرور';
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { data: updatedUser } = await api.put('/api/profile', data);
      setUser(updatedUser);
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'فشل في تحديث الملف الشخصي';
      toast({
        title: "خطأ في التحديث",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      logout,
      register,
      changePassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};