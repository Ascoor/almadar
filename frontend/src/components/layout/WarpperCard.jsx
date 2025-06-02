import React, { useEffect, useState } from "react";
import DashboardClock from "@/components/common/DashboardClock";

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const arabicWeekdays = [
  "الأحد", "الاثنين", "الثلاثاء", "الأربعاء",
  "الخميس", "الجمعة", "السبت"
];

function toHinduNumerals(str) {
  const numerals = {
    0: "٠", 1: "١", 2: "٢", 3: "٣", 4: "٤",
    5: "٥", 6: "٦", 7: "٧", 8: "٨", 9: "٩"
  };
  return str.toString().replace(/[0-9]/g, d => numerals[d]);
}
export default function WrapperCard() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const day     = toHinduNumerals(date.getDate());
  const month   = arabicMonths[date.getMonth()];
  const year    = toHinduNumerals(date.getFullYear());
  const weekday = arabicWeekdays[date.getDay()];

  return (
    <div className="flex justify-center">
      {/* بطاقة رشيقة وطوليّة (عرض ثابت ~10rem) */}
      <div
        className="
          flex flex-col items-center justify-center gap-2
          w-40 sm:w-44 lg:w-48       /* 👈 عرض متناسق ضيّق */
          h-64                       /* 👈 ارتفاع ثابت لطابع الطول */ 
        "
      >
        {/* ساعة اللوحة – تأكّد أن مكوّن DashboardClock لا يفرض حجماً زائداً */}
        <DashboardClock className="text-3xl sm:text-4xl" />

        {/* اليوم + التاريخ */}
        <div className="text-center mt-2">
          <h2 className="text-base sm:text-lg font-bold text-royal dark:text-gold-light mb-1">
            {weekday}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {`${day} ${month} ${year}`}
          </p>
        </div>
      </div>
    </div>
  );
}
