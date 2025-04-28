import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircle, IoMdClose, IoMdAlert, IoMdInformationCircle } from "react-icons/io";

const GlobalAlert = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  // ⏳ إخفاء التنبيه بعد 5 ثوانٍ تلقائيًا
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // تأخير الحذف بعد انتهاء الأنيميشن
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // 🌈 تخصيص الألوان والأيقونات لكل نوع من التنبيهات
  const alertStyles = {
    success: { bg: "bg-green-500", icon: <IoMdCheckmarkCircle className="text-white text-2xl" /> },
    error: { bg: "bg-red-500", icon: <IoMdClose className="text-white text-2xl" /> },
    info: { bg: "bg-blue-500", icon: <IoMdInformationCircle className="text-white text-2xl" /> },
    warning: { bg: "bg-yellow-500", icon: <IoMdAlert className="text-black text-2xl" /> },
  };

  return (
    <div
      role="alert"
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 flex items-center space-x-3 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      } ${alertStyles[type]?.bg || "bg-gray-500"}`}
    >
      {/* أيقونة التنبيه */}
      {alertStyles[type]?.icon}

      {/* نص الرسالة */}
      <p className="text-white text-sm font-semibold truncate max-w-[250px]" title={message}>
        {message}
      </p>

      {/* زر الإغلاق */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-white hover:textalmadar-gray-light transition text-lg"
      >
        ×
      </button>
    </div>
  );
};

export default GlobalAlert;
