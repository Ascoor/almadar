import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/geo/libya.json";

export default function LibyaMap({ data = [], onRegionClick }) {
  const counts = React.useMemo(() => {
    const m = {};
    for (const d of data) m[d.regionCode] = d.count;
    return m;
  }, [data]);

  const [tooltip, setTooltip] = React.useState(null);

  const pickCode = (geo) =>
    geo.properties?.id ??
    geo.id ??
    geo.properties?.ADM1_PCODE ??
    geo.properties?.ISO_3166_2 ??
    geo.properties?.NAME_EN ??
    geo.properties?.NAME_AR ??
    geo.properties?.name ??
    geo.rsmKey;

  const handleEnter = (geo, evt) => {
    const code = pickCode(geo);
    const count = counts[code] || 0;
    const name =
      geo.properties?.NAME_AR || geo.properties?.NAME_EN || code;
    setTooltip({
      x: evt.clientX,
      y: evt.clientY,
      name,
      count,
    });
  };

  return (
    <div className="relative w-full h-[420px]">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [17, 27] }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = pickCode(geo);
              const count = counts[code] || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onRegionClick?.(code)}
                  onMouseEnter={(e) => handleEnter(geo, e)}
                  onMouseLeave={() => setTooltip(null)}
                  fill={count ? "var(--primary, #12d2b0)" : "#eee"}
                  stroke="#999"
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
      {tooltip && (
        <div
          className="absolute bg-foreground text-background text-xs px-2 py-1 rounded shadow pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.name}: {tooltip.count}
        </div>
      )}
    </div>
  );
}
