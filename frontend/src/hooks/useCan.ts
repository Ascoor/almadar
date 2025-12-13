import { useAuth } from '@/context/AuthContext';

export const useCan = () => {
  const { hasPermission } = useAuth();

  const can = (permission?: string) => {
    if (!permission) return true;
    return hasPermission(permission);
  };

  return { can };
};

export default useCan;
