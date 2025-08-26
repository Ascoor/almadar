import React from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";


const GEO_URL = "/geo/libya.json"; // كفاية كده
export default function LibyaMapPro({ data = [], onRegionClick, isDark = false, height = 360 }) {
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

  // Create a lookup for region counts
  const counts = React.useMemo(() => {
    const m = new Map();
    for (const d of data) {
      if (d?.regionCode) m.set(d.regionCode, Number(d.count) || 0);
    }
    return m;
  }, [data]);

  const max = React.useMemo(() => Math.max(0, ...counts.values()), [counts]);
  const colorScale = React.useMemo(
    () =>
      scaleLinear()
        .domain([0, max || 1])
        .range(isDark ? ["#1f2937", "#1d4ed8"] : ["#e5e7eb", "#2563eb"]),
    [max, isDark]
  );

  const getId = (g) => g.properties?.id || g.id || g.rsmKey;

  // مرِّر URL فقط — اترك التحميل لـ Geographies
  return (
    <div className="w-full" style={{ height }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [17, 27] }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((g) => {
              const id = getId(g);
              const count = counts.get(id) || 0;
              return (
                <Geography
                  key={g.rsmKey}
                  geography={g}
                  onClick={() => onRegionClick?.(id)}
                  fill={colorScale(count)}
                  stroke={isDark ? "#334155" : "#9ca3af"}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.9 },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

