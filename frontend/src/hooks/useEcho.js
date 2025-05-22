import { useEffect, useState } from 'react';
import { initEcho, subscribeToUserChannel } from '@/lib/echo';

export function useEcho({ userId = null, autoInit = true, config = {} } = {}) {
  const [initialized, setInitialized] = useState(false);
  const [userChannel,  setUserChannel]  = useState(null);
  const [lastEvent,    setLastEvent]    = useState(null);

  // 1. تهيئة Echo عند تحميل الهوك
  useEffect(() => {
    if (autoInit) {
      initEcho(config);
      setInitialized(true);
    }
  }, [autoInit, config]);

  // 2. الاشتراك في قناة المستخدم والاستماع للأحداث
  useEffect(() => {
    if (!initialized || !userId) return;

    const channel = subscribeToUserChannel(userId);
    setUserChannel(channel);

    const handler = (evt) => setLastEvent(evt);
    channel.listen('UserActivityEvent', handler);

    return () => {
      channel.stopListening('UserActivityEvent', handler);
    };
  }, [initialized, userId]);

  return { initialized, userChannel, lastEvent };
}
