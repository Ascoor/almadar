import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/geo/libya.json";

export default function LibyaMap({ data = [], onRegionClick }) {
  const counts = React.useMemo(() => {
    const map = {};
    for (const d of data) map[d.regionCode] = d.count;
    return map;
  }, [data]);

  return (
    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [17, 27] }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // غيّر المفتاح هنا حسب حقول الـ GeoJSON عندك:
            const code =
              geo.properties?.id ||
              geo.id || // أحيانًا يكون الـ id أعلى الـ properties
              geo.properties?.ISO_3166_2 ||
              geo.properties?.NAME_EN ||
              geo.properties?.NAME_AR ||
              geo.properties?.name ||
              geo.rsmKey;

            const count = counts[code] || 0;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={count ? "var(--primary, #12d2b0)" : "#eee"}
                stroke="#999"
                onClick={() => onRegionClick?.(code)}
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
  );
}
