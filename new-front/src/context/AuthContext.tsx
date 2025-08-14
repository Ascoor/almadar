import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock authentication - replace with real API calls
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with real API response
      const mockUser: User = {
        id: '1',
        name: 'Ahmed Al-Mansouri',
        email: email,
        role: 'Admin',
        permissions: ['contracts', 'investigations', 'legal-advice', 'litigations', 'users', 'settings'],
        avatar: undefined
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token_123');
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${mockUser.name}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تحقق من بيانات الدخول وحاول مرة أخرى",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدام منصة المدار",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Mock token validation - replace with real API call
      const mockUser: User = {
        id: '1',
        name: 'Ahmed Al-Mansouri',
        email: 'ahmed@almadar.com',
        role: 'Admin',
        permissions: ['contracts', 'investigations', 'legal-advice', 'litigations', 'users', 'settings'],
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};