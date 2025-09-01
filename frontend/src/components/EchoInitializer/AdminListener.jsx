import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { initEcho } from "@/lib/echo";

export default function AdminEchoListener() {
  const { user, token } = useAuth(); 
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id || !user.roles?.some(role => role.name === "Admin")) return;

    // مرر التوكن في التهيئة
    const echo = initEcho({
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channelName = `admins.${user.id}`;
    const adminChannel = echo.private(channelName);

    console.log(`🛰 Subscribed to ${channelName}`);

    const adminHandler = (e) => {
      const notification = e.notification || e; 
      console.log("📥 Received NotificationAdmin:", notification);

      addNotification({
        ...notification,
        icon: "📣",
      });
    };

    // لو عامل broadcastAs() => 'NotificationAdmin'
    adminChannel.listen(".NotificationAdmin", adminHandler);

    // لو مش عامل broadcastAs() لازم تسمع بالاسم الكامل
    // adminChannel.listen("App\\Events\\NotificationAdmin", adminHandler);

    return () => {
      adminChannel.stopListening(".NotificationAdmin", adminHandler);
      echo.leave(channelName);
    };
  }, [user, token, addNotification]);

  return null;
}
