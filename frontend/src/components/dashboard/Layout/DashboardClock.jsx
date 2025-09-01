import React, { useEffect, useState, useRef, useMemo } from "react";

export default function ClassicHindiClock({
  size = 240,
  sweepSeconds = true,
}) {
  const [now, setNow] = useState(new Date());
  const rafRef = useRef();

  useEffect(() => {
    if (!sweepSeconds) {
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }
    const loop = () => {
      setNow(new Date());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sweepSeconds]);

  const { secAngle, minAngle, hourAngle } = useMemo(() => {
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + (sweepSeconds ? ms / 1000 : 0);
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    return {
      secAngle: s * 6,
      minAngle: m * 6,
      hourAngle: h * 30,
    };
  }, [now, sweepSeconds]);

  const d = size;
  const cx = d / 2;
  const cy = d / 2;
  const faceR = d * 0.45;
  const numerR = faceR * 0.82;

  const arabicNums = {
    1: "١", 2: "٢", 3: "٣", 4: "٤", 5: "٥", 6: "٦",
    7: "٧", 8: "٨", 9: "٩", 10: "١٠", 11: "١١", 12: "١٢",
  };

  return (
    <figure
      className="select-none"
      style={{
        width: d,
        height: d,
        filter: "drop-shadow(0 10px 24px var(--shadow-dark))",
      }}
    >
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
        {/* خلفية وجه الساعة */}
        <circle
          cx={cx}
          cy={cy}
          r={faceR}
          fill="var(--bg)"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />

        {/* الأرقام الهندية */}
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i + 1;
          const a = ((n * 30) - 90) * Math.PI / 180;
          const x = cx + numerR * Math.cos(a);
          const y = cy + numerR * Math.sin(a);
          return (
            <text
              key={n}
              x={x}
              y={y + 6}
              textAnchor="middle"
              fontFamily="var(--font-heading)"
              style={{
                fill:"var(--neon-title)",
                fontSize: `clamp(12px, ${d * 0.12}px, 20px)`,
                fontWeight: 700,
             
                opacity: 0.95,
              }}
            >
              {arabicNums[n]}
            </text>
          );
        })}

        {/* عقرب الساعات */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + faceR * 0.5 * Math.cos((hourAngle - 90) * Math.PI / 180)}
          y2={cy + faceR * 0.5 * Math.sin((hourAngle - 90) * Math.PI / 180)}
          stroke="var(--accent)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* عقرب الدقائق */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + faceR * 0.7 * Math.cos((minAngle - 90) * Math.PI / 180)}
          y2={cy + faceR * 0.7 * Math.sin((minAngle - 90) * Math.PI / 180)}
          stroke="var(--fg)"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* عقرب الثواني */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + faceR * 0.8 * Math.cos((secAngle - 90) * Math.PI / 180)}
          y2={cy + faceR * 0.8 * Math.sin((secAngle - 90) * Math.PI / 180)}
          stroke="var(--neon-title)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* مركز الساعة */}
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--fg)"
          stroke="var(--card)"
          strokeWidth={2}
        />
      </svg>
    </figure>
  );
}
