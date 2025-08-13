import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/services/api/client';
import { useToast } from '@/hooks/use-toast';

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
  login: (username: string, password: string) => Promise<void>; 
  logout: () => Promise<void>;
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
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await api.post('/auth/login', { username, password }); // sets HttpOnly cookie
      const { data } = await api.get('/auth/me');
      setUser(data);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `أهلاً بك ${data.name}`,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'فشل في تسجيل الدخول';
      toast({
        title: "خطأ في تسجيل الدخول",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      // Even if logout fails, clear user state
      setUser(null);
      window.location.href = '/login';
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.post('/auth/change-password', {
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
    } catch (error: any) {
      const message = error?.response?.data?.message || 'فشل في تغيير كلمة المرور';
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { data: updatedUser } = await api.put('/auth/profile', data);
      setUser(updatedUser);
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'فشل في تحديث الملف الشخصي';
      toast({
        title: "خطأ في التحديث",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
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