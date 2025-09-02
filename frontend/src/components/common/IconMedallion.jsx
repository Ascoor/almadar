import React from "react";

function IconMedallion({ children, size = "md", spin = false }) {
  const sizes = {
    sm: "w-14 h-14 sm:w-16 sm:h-16",
    md: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    lg: "w-24 h-24 sm:w-28 sm:h-28",
  };

  return (
    <div className={`relative ${sizes[size]} select-none`}>
      {/* حلقة خارجية متدرجة (برواز) */}
      <div
        className={`absolute inset-0 rounded-full ${spin ? "animate-[spin_8s_linear_infinite]" : ""}`}
        style={{
          background:
            "conic-gradient(from 0deg, var(--primary), var(--accent), var(--secondary), var(--primary))",
          boxShadow:
            "0 2px 8px rgba(0,0,0,.10), 0 6px 18px rgba(0,0,0,.08)",
        }}
        aria-hidden
      />

      {/* جسم البرواز (خلفية داخلية + بَفْل/مجسّم) */}
      <div
        className="relative grid place-items-center w-full h-full rounded-full bg-[var(--card)]"
        style={{
          // طبقات ظل داخلية تعطي إحساس حافة معدنية
          boxShadow:
            "inset 0 10px 18px rgba(255,255,255,0.28), inset 0 -10px 18px rgba(0,0,0,0.08), 0 0 0 1px var(--border)",
        }}
      >
        {/* لمعان علوي نصف شفاف */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 38%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        {/* محتوى الأيقونة */}
        <div
          className="relative rounded-full grid place-items-center"
          style={{
            width: "70%",
            height: "70%",
            background:
              "radial-gradient(50% 50% at 50% 35%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default IconMedallion;

