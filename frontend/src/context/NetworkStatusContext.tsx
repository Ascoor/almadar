import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

interface NetworkStatusContextValue {
  isOnline: boolean;
  isOffline: boolean;
  lastChanged: Date | null;
  guardOnline: (message?: string) => boolean;
  offlineMessage: string;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue | null>(
  null,
);

function getInitialOnlineState() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function NetworkStatusProvider({ children }: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnlineState);
  const [lastChanged, setLastChanged] = useState<Date | null>(new Date());

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setLastChanged(new Date());
      toast.warning('🚫 لا يوجد اتصال بالإنترنت', {
        description:
          'أنت في وضع عدم الاتصال، سيتم تعطيل الإجراءات المتصلة حتى عودة الشبكة.',
        duration: 5000,
      });
    };

    const handleOnline = () => {
      setIsOnline(true);
      setLastChanged(new Date());
      toast.success('✅ تمت استعادة الاتصال', {
        description: 'يمكنك الآن متابعة العمليات التي تتطلب اتصالاً بالشبكة.',
        duration: 3500,
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    document.body.dataset.network = isOnline ? 'online' : 'offline';
    return () => {
      delete document.body.dataset.network;
    };
  }, [isOnline]);

  const guardOnline = useMemo(() => {
    const defaultMessage =
      'لا يمكن تنفيذ هذا الإجراء بدون اتصال بالإنترنت. الرجاء المحاولة لاحقاً.';

    return (message?: string) => {
      if (isOnline) return true;

      toast.error('الوضع غير متصل', {
        description: message || defaultMessage,
        duration: 4500,
      });
      return false;
    };
  }, [isOnline]);

  const value = useMemo(
    () => ({
      isOnline,
      isOffline: !isOnline,
      lastChanged,
      guardOnline,
      offlineMessage:
        'بعض الإجراءات تم إيقافها مؤقتًا حتى عودة الاتصال بالإنترنت.',
    }),
    [guardOnline, isOnline, lastChanged],
  );

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const ctx = useContext(NetworkStatusContext);
  if (!ctx) {
    return {
      isOnline: true,
      isOffline: false,
      lastChanged: null,
      guardOnline: () => true,
      offlineMessage:
        'بعض الإجراءات تم إيقافها مؤقتًا حتى عودة الاتصال بالإنترنت.',
    };
  }
  return ctx;
}
