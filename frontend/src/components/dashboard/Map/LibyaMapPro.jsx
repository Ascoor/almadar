import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

/**
 * props:
 *  - dataByRegion: { [regionId: string]: number }
 *  - onRegionClick?: (info) => void
 */
const GEO_URL = "/geo/libya-adm1.json";

const LibyaMapPro = ({ dataByRegion = {}, onRegionClick }) => {
  const [hoverInfo, setHoverInfo] = useState(null);

  // build domain and color scale
  const { colorScale, maxVal } = useMemo(() => {
    const vals = Object.values(dataByRegion);
    const max = vals.length ? Math.max(...vals) : 0;
    const scale = scaleQuantize()
      .domain([0, Math.max(1, max)])
      .range([
        "#e6f4ea",
        "#ccead6",
        "#b3e0c2",
        "#99d6ad",
        "#80cc99",
        "#66c285",
        "#4db870",
        "#33ad5c",
        "#1aa347",
        "#009933",
      ]);
    return { colorScale: scale, maxVal: max };
  }, [dataByRegion]);

  const getId = (p) => p.id ?? p.shapeID ?? p.HASC_1 ?? p.GID_1 ?? p.ADM1_PCODE ?? p.name_en;
  const getName = (p) => p.name_ar ?? p.name_en ?? p.shapeName ?? p.NAME_1 ?? "غير معروف";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-right">
          <div className="text-lg font-semibold">التوزيع الجغرافي</div>
          <div className="text-sm text-gray-500">عدد القضايا حسب المنطقة</div>
        </div>
      </div>

      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[17, 27]} zoom={3.5}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const p = geo.properties || {};
                const id = String(getId(p));
                const name = getName(p);
                const value = dataByRegion[id] ?? 0;
                const fill = colorScale(value);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoverInfo({ id, name, value })}
                    onMouseLeave={() => setHoverInfo(null)}
                    onClick={() => onRegionClick?.({ id, name, value })}
                    style={{
                      default: { fill, outline: "none", stroke: "#9CA3AF", strokeWidth: 0.6 },
                      hover: { fill, outline: "none", stroke: "#111827", strokeWidth: 1.1 },
                      pressed: { fill, outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hoverInfo && (
        <div
          dir="rtl"
          style={{
            position: "fixed",
            pointerEvents: "none",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.95)",
            padding: "8px 10px",
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(0,0,0,.12)",
            fontSize: 13,
          }}
        >
          <div>
            <b>{hoverInfo.name}</b>
          </div>
          <div>القضايا: {hoverInfo.value}</div>
        </div>
      )}

      <Legend maxVal={maxVal} />
    </div>
  );
};

const Legend = ({ maxVal }) => {
  const steps = 10;
  const boxes = new Array(steps).fill(0).map((_, i) => i);
  return (
    <div className="mt-3" dir="rtl" style={{ fontSize: 12 }}>
      <div className="mb-1 text-gray-600">مقياس الألوان (منخفض ← مرتفع)</div>
      <div style={{ display: "flex", gap: 2 }}>
        {boxes.map((i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 12,
              background: `hsl(${140}, 80%, ${90 - i * 7}%)`,
              border: "1px solid #e5e7eb",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-gray-500 mt-1">
        <span>0</span>
        <span>{maxVal}</span>
      </div>
    </div>
  );
};

export default LibyaMapPro;
