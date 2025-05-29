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

export default function WarpperCard() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const day = toHinduNumerals(date.getDate());
  const month = arabicMonths[date.getMonth()];
  const year = toHinduNumerals(date.getFullYear());
  const weekday = arabicWeekdays[date.getDay()];

  return (
    <div className="w-full flex justify-center px-6 md:px-2  sm:px-0">
      <div className="w-full max-w-md bg-gradient-to-br from-gold/50 via-royal/10 to-gold/30 dark:from-zinc-900 dark:via-greenic-darker dark:to-navy border border-gold-dark dark:border-greenic-light rounded-full shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="w-[160px] sm:w-[140px]">
            <DashboardClock />
          </div>
          <div className="text-right mr-9">
            <h2 className="text-lg sm:text-xl font-bold text-royal dark:text-gold-light mb-1">{weekday}</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{`${day} ${month} ${year}`}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
