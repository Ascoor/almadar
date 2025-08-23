import { useEffect, useState } from "react";
import { initEcho, subscribeToUserChannel } from "@/lib/echo";

export function useEcho({ userId = null, autoInit = true, config = {} } = {}) {
  const [initialized, setInitialized] = useState(false);
  const [userChannel, setUserChannel] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  // init Echo
  useEffect(() => {
    if (autoInit) {
      initEcho(config);
      setInitialized(true);
    }
  }, [autoInit, config]);

  // listen to user events
  useEffect(() => {
    if (!initialized || !userId) return;

    const channel = subscribeToUserChannel(userId);
    setUserChannel(channel);

    const handler = (evt) => setLastEvent(evt);
    channel.listen("UserActivityEvent", handler);

    return () => {
      channel.stopListening("UserActivityEvent", handler);
    };
  }, [initialized, userId]);

  return { initialized, userChannel, lastEvent };
}
