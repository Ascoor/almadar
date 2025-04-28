import React, { createContext, useContext, useState } from 'react';
import GlobalAlert from '../components/common/GlobalAlert';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // 🟢 وظيفة إضافة إشعار جديد
  const triggerAlert = (type, message) => {
    const id = new Date().getTime(); // إنشاء ID فريد لكل تنبيه
    const newAlert = { id, type, message };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // حذف التنبيه بعد 5 ثوانٍ
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  // 🔴 وظيفة حذف تنبيه معين
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ triggerAlert }}>
      {children}
      {/* عرض جميع التنبيهات */}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {alerts.map((alert) => (
          <GlobalAlert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)} // السماح بالإغلاق اليدوي
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
