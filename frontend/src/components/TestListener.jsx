import React, { useEffect } from 'react';
import { initEcho } from '@/lib/echo';

export default function TestListener({ userId }) {
  useEffect(() => {
    if (!userId) return;

    // 1. تأكد من تهيئة Echo
    const echo = initEcho();

    // 2. اشترك بالقناة الخاصة
    const channel = echo.private(`user.${userId}`);

    // 3. استمع للحدث المسمّى 'permissions.updated'
    const handler = (e) => {
      console.log('Permissions updated:', e);
      // هنا يمكنك تحديث الواجهة حسب e (قد تتضمّن بيانات إضافية)
    };
    channel.listen('permissions.updated', handler);

    // 4. التنظيف عند فك التركيب
    return () => {
      channel.stopListening('permissions.updated', handler);
    };
  }, [userId]);

  return (
    <div className="p-4">
      <h2>Listening for Permissions Updates</h2>
      <p>المستخدم رقم: {userId}</p>
    </div>
  );
}
