import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function ClassicHindiClock({ size = 240, sweepSeconds = true }) {
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
    return { secAngle: s * 6, minAngle: m * 6, hourAngle: h * 30 };
  }, [now, sweepSeconds]);

  const d = size;
  const cx = d / 2;
  const cy = d / 2;

  // geometry
  const bezelR = d * 0.49;
  const faceR = d * 0.43;
  const innerR = d * 0.4;
  const numerR = faceR * 0.82;

  const arabicNums = {
    1: '١',
    2: '٢',
    3: '٣',
    4: '٤',
    5: '٥',
    6: '٦',
    7: '٧',
    8: '٨',
    9: '٩',
    10: '١٠',
    11: '١١',
    12: '١٢',
  };

  const rad = (deg) => (deg * Math.PI) / 180;
  const polar = (r, deg) => ({
    x: cx + r * Math.cos(rad(deg - 90)),
    y: cy + r * Math.sin(rad(deg - 90)),
  });

  // strokes
  const tickMajor = Math.max(2, Math.round(d * 0.01));
  const tickMinor = Math.max(1, Math.round(d * 0.006));

  const hourW = Math.max(4, Math.round(d * 0.018));
  const minW = Math.max(3, Math.round(d * 0.013));
  const secW = Math.max(1.5, d * 0.006);

  return (
    <figure
      className="select-none"
      style={{
        width: d,
        height: d,
        filter:
          'drop-shadow(0 18px 46px color-mix(in oklab, var(--shadow-dark, rgba(0,0,0,.6)) 70%, transparent))',
      }}
    >
      <svg
        width={d}
        height={d}
        viewBox={`0 0 ${d} ${d}`}
        role="img"
        aria-label="Clock"
      >
        <defs>
          {/* Metallic bezel */}
          <radialGradient id="bezelGrad" cx="35%" cy="30%" r="70%">
            <stop
              offset="0%"
              stopColor="color-mix(in oklab, var(--card) 92%, white)"
            />
            <stop
              offset="35%"
              stopColor="color-mix(in oklab, var(--muted) 70%, var(--card))"
            />
            <stop
              offset="70%"
              stopColor="color-mix(in oklab, var(--border) 85%, var(--card))"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--fg) 10%, var(--card))"
            />
          </radialGradient>

          {/* Inner face */}
          <radialGradient id="faceGrad" cx="40%" cy="30%" r="75%">
            <stop
              offset="0%"
              stopColor="color-mix(in oklab, var(--card) 92%, var(--bg))"
            />
            <stop
              offset="55%"
              stopColor="color-mix(in oklab, var(--card) 86%, var(--muted))"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--bg) 70%, var(--card))"
            />
          </radialGradient>

          {/* Vignette */}
          <radialGradient id="vignette" cx="50%" cy="45%" r="60%">
            <stop offset="55%" stopColor="transparent" />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--fg) 12%, transparent)"
            />
          </radialGradient>

          {/* Glass highlight */}
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
          </linearGradient>

          {/* Hands gradients */}
          <linearGradient id="hourHand" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="color-mix(in oklab, var(--accent) 92%, white)"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--accent) 70%, var(--fg))"
            />
          </linearGradient>

          <linearGradient id="minHand" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="color-mix(in oklab, var(--fg) 92%, white)"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--fg) 65%, var(--bg))"
            />
          </linearGradient>

          {/* Soft shadow for hands */}
          <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy={Math.max(1, d * 0.006)}
              stdDeviation={Math.max(1.2, d * 0.01)}
              floodColor="color-mix(in oklab, var(--fg) 20%, transparent)"
              floodOpacity="0.55"
            />
          </filter>

          {/* Center jewel */}
          <radialGradient id="centerJewel" cx="35%" cy="30%" r="70%">
            <stop
              offset="0%"
              stopColor="color-mix(in oklab, var(--ring) 80%, white)"
            />
            <stop
              offset="55%"
              stopColor="color-mix(in oklab, var(--primary) 55%, var(--fg))"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in oklab, var(--fg) 20%, black)"
            />
          </radialGradient>
        </defs>

        {/* ===== Bezel ring (metal) ===== */}
        <circle cx={cx} cy={cy} r={bezelR} fill="url(#bezelGrad)" />
        <circle
          cx={cx}
          cy={cy}
          r={bezelR}
          fill="none"
          stroke="color-mix(in oklab, var(--ring) 40%, transparent)"
          strokeWidth={Math.max(2, d * 0.01)}
          opacity="0.6"
        />

        {/* ===== Inner face ===== */}
        <circle cx={cx} cy={cy} r={faceR} fill="url(#faceGrad)" />
        <circle
          cx={cx}
          cy={cy}
          r={faceR}
          fill="url(#vignette)"
          opacity="0.85"
        />

        {/* ===== Minute ticks ===== */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isMajor = i % 5 === 0;
          const r1 = faceR * (isMajor ? 0.9 : 0.93);
          const r2 = faceR * 0.985;

          const p1 = polar(r1, i * 6);
          const p2 = polar(r2, i * 6);

          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={
                isMajor
                  ? 'color-mix(in oklab, var(--primary) 55%, var(--fg))'
                  : 'color-mix(in oklab, var(--border) 60%, var(--fg))'
              }
              strokeOpacity={isMajor ? 0.55 : 0.35}
              strokeWidth={isMajor ? tickMajor : tickMinor}
              strokeLinecap="round"
            />
          );
        })}

        {/* ===== Numerals ===== */}
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i + 1;
          const pos = polar(numerR, n * 30);
          return (
            <text
              key={n}
              x={pos.x}
              y={pos.y + d * 0.025}
              textAnchor="middle"
              fontFamily="var(--font-heading)"
              style={{
                fill: 'color-mix(in oklab, var(--fg) 82%, var(--primary))',
                fontSize: `clamp(12px, ${d * 0.12}px, 22px)`,
                fontWeight: 800,
                letterSpacing: '0.02em',
                opacity: 0.95,
                textShadow: '0 1px 0 rgba(0,0,0,0.12)',
              }}
            >
              {arabicNums[n]}
            </text>
          );
        })}

        {/* ===== Hands group ===== */}
        <g filter="url(#handShadow)">
          {/* Hour hand */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + faceR * 0.52 * Math.cos(rad(hourAngle - 90))}
            y2={cy + faceR * 0.52 * Math.sin(rad(hourAngle - 90))}
            stroke="url(#hourHand)"
            strokeWidth={hourW}
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + faceR * 0.74 * Math.cos(rad(minAngle - 90))}
            y2={cy + faceR * 0.74 * Math.sin(rad(minAngle - 90))}
            stroke="url(#minHand)"
            strokeWidth={minW}
            strokeLinecap="round"
          />
        </g>

        {/* Seconds hand (neon premium) */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + faceR * 0.84 * Math.cos(rad(secAngle - 90))}
          y2={cy + faceR * 0.84 * Math.sin(rad(secAngle - 90))}
          stroke="color-mix(in oklab, var(--neon-title) 70%, var(--ring))"
          strokeWidth={secW}
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Center cap (jewel) */}
        <circle cx={cx} cy={cy} r={d * 0.03} fill="url(#centerJewel)" />
        <circle
          cx={cx}
          cy={cy}
          r={d * 0.038}
          fill="none"
          stroke="color-mix(in oklab, var(--ring) 45%, transparent)"
          strokeWidth={Math.max(1.5, d * 0.006)}
          opacity="0.7"
        />

        {/* Glass overlay */}
        <path
          d={`
            M ${cx - innerR} ${cy - innerR * 0.4}
            C ${cx - innerR * 0.2} ${cy - innerR * 1.25},
              ${cx + innerR * 1.2} ${cy - innerR * 0.9},
              ${cx + innerR} ${cy + innerR * 0.25}
            C ${cx + innerR * 0.6} ${cy - innerR * 0.05},
              ${cx - innerR * 0.2} ${cy + innerR * 0.25},
              ${cx - innerR} ${cy - innerR * 0.4}
            Z
          `}
          fill="url(#glass)"
          opacity="0.55"
        />
      </svg>
    </figure>
  );
}
