import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";

const GEO_URL = "/geo/libya.json";

const pickCode = (geo) =>
  geo.properties?.id ??
  geo.id ??
  geo.properties?.ADM1_PCODE ??
  geo.properties?.ISO_3166_2 ??
  geo.properties?.NAME_EN ??
  geo.properties?.NAME_AR ??
  geo.properties?.name ??
  geo.rsmKey;

export default function LibyaMap({ data = [], onRegionClick, height = 400 }) {
  // Create counts map for regions
  const counts = React.useMemo(() => {
    const countMap = {};
    data.forEach(d => {
      countMap[d.regionCode] = d.count;
    });
    return countMap;
  }, [data]);

  // Get max count for color scaling
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getRegionColor = (count) => {
    if (!count) return "hsl(var(--muted) / 0.3)";
    
    const intensity = count / maxCount;
    if (intensity > 0.7) return "hsl(84, 81%, 56%)"; // Lime for high
    if (intensity > 0.4) return "hsl(172, 84%, 55%)"; // Turquoise for medium
    return "hsl(172, 84%, 75%)"; // Light turquoise for low
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full"
      style={{ height }}
    >
      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ 
          scale: 2000, 
          center: [17, 27] 
        }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionCode = pickCode(geo);
              const count = counts[regionCode] || 0;
              const regionName = geo.properties?.name || geo.properties?.name_en || regionCode;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onRegionClick?.(regionCode)}
                  fill={getRegionColor(count)}
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  className="cursor-pointer transition-all duration-300 hover:brightness-110"
                  style={{
                    default: { outline: "none" },
                    hover: { 
                      outline: "none", 
                      filter: "brightness(1.1) saturate(1.2)",
                      stroke: "hsl(var(--primary))",
                      strokeWidth: 2
                    },
                    pressed: { outline: "none" }
                  }}
                >
                  <title>{`${regionName}: ${count.toLocaleString()} قضية`}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </motion.div>
  );
}