import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-hero"
      >
        <div className="glass-card p-8 rounded-2xl max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              الوصول محظور
            </h2>
            <p className="text-muted-foreground">
              يجب تسجيل الدخول للوصول إلى هذه الصفحة
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="btn-hero w-full"
          >
            العودة لصفحة تسجيل الدخول
          </Button>
        </div>
      </motion.div>
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.some(permission => 
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center bg-gradient-hero"
        >
          <div className="glass-card p-8 rounded-2xl max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                صلاحيات غير كافية
              </h2>
              <p className="text-muted-foreground">
                ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                العودة للخلف
              </Button>
              <Button 
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
