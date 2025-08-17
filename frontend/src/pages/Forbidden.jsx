// src/pages/Forbidden.jsx
import AppLayout from '@/components/layout/AppLayout';

export default function Forbidden() {
  return (
    <AppLayout>
    <div className="text-center text-red-600 text-xl font-bold mt-20">
      🚫 غير مصرح لك بالوصول إلى هذه الصفحة
    </div>
    </AppLayout>
  );
}
