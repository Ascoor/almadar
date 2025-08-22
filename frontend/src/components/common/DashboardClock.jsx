import React, { useEffect, useState } from "react";

export default function DashboardClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secDeg = seconds * 6;
  const minDeg = minutes * 6;
  const hourDeg = (hours % 12) * 30 + minutes / 2;

  const arabicNumbers = {
    1: "١", 2: "٢", 3: "٣", 4: "٤",
    5: "٥", 6: "٦", 7: "٧", 8: "٨",
    9: "٩", 10: "١٠", 11: "١١", 12: "١٢",
  };

  return (
    <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto mt-4 rounded-full shadow-lg border-2 border-greenic-dark bg-royal-light dark:bg-navy-darker bg-gradient-to-t from-gold/40 via-royal/10 to-gold/40 dark:from-navy-darker/30 dark:via-royal-dark/50 dark:to-navy-darker/40 transition-all duration-300">
      {/* Clock center */}
      <div className="absolute w-3 h-3 bg-black dark:bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />

      {/* Clock hands */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-9 bg-red-600 rounded-full origin-bottom z-10"
        style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-1 h-12 bg-black dark:bg-white rounded-full origin-bottom z-10"
        style={{ transform: `translate(-50%, -100%) rotate(${minDeg}deg)` }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-14 bg-green-700 dark:bg-green-300 rounded-full origin-bottom z-10"
        style={{ transform: `translate(-50%, -100%) rotate(${secDeg}deg)` }}
      />

      {/* Arabic numerals */}
      {[...Array(12)].map((_, i) => {
        const angle = (i + 1) * 30;
        const radius = 40;
        const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
        const y = 50 - radius * Math.cos((angle * Math.PI) / 180);
        return (
          <div
            key={i}
            className="absolute text-xs md:text-sm font-bold text-navy dark:text-white"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {arabicNumbers[i + 1]}
          </div>
        );
      })}
    </div>
  );
}
 