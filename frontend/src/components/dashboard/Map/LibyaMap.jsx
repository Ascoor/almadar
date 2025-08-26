import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";


const GEO_URL = "/geo/libya.json"; // كفاية كده
export default function LibyaMap({ data = [], onRegionClick, isDark = false }) {
  // اختياري: تحقّق سريع يمنع الريندر قبل الجاهزية
  const [ready, setReady] = React.useState(false);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(GEO_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${GEO_URL}`);
        const j = await res.json();
        // لازم يكون FeatureCollection أو Topology
        const valid =
          j && typeof j === "object" &&
          ((j.type === "FeatureCollection" && Array.isArray(j.features)) ||
           (j.type === "Topology" && j.objects && Object.keys(j.objects).length));
        if (!valid) throw new Error(`Invalid GeoJSON/TopoJSON shape: ${j?.type || typeof j}`);
        if (mounted) setReady(true);
      } catch (e) {
        console.error("Geo check failed:", e);
        if (mounted) setErr(e.message || String(e));
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (err) {
    return (
      <div className="rounded-xl p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
        Map load error: {err}<br/>
        تأكد من وجود <code>/public/geo/libya.json</code> وأنه صالح.
      </div>
    );
  }
  if (!ready) return <div className="text-sm opacity-70">Loading map…</div>;

  // مرِّر URL فقط — اترك التحميل لـ Geographies
  return (
    <div className="w-full h-[360px]">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [17, 27] }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((g) => (
              <Geography
                key={g.rsmKey}
                geography={g}
                onClick={() => onRegionClick?.(g.properties?.id || g.id || g.rsmKey)}
                fill={isDark ? "#1f2937" : "#e5e7eb"}
                stroke={isDark ? "#334155" : "#9ca3af"}
                style={{ default:{ outline:"none" }, hover:{ outline:"none", opacity:0.9 }, pressed:{ outline:"none" } }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
