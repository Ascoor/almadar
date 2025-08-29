import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Download, Filter, TrendingUp, Scale, Users, Calendar, CheckCircle } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

// رابط أو مسار ملف GeoJSON للحدود والمحافظات
const geoUrl = "/geo/libya-country.geojson"; // تأكد من تحديث المسار الصحيح لملف GeoJSON

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay } }
});

const LibyaMapPro = () => {
  // تخصيص الألوان باستخدام scaleOrdinal
  const colorScale = scaleOrdinal(schemeCategory10);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(geoUrl);
        const json = await response.json();
        console.log(json.features); // تحقق من بيانات GeoJSON هنا
        setData(json.features);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative mx-auto max-w-[660px]">
 
      {/* الحاوية الدائرية */}
      <div className="relative mx-auto aspect-square w-full md:w-[79%] xl:w-[70%] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.12)] ring-1 ring-border overflow-hidden bg-yellow-100  dark:bg-gray-900/95 ">
        {/* لمعان خفيف */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/6 to-transparent" />
        {/* الخريطة */}
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full grid place-items-center text-muted-foreground">…</div>}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1800, center: [27.5, 27.5]}}
              width={window.innerWidth}
              height={window.innerHeight}
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo, index) => {
                    const centroid = geo.properties.centroid || [0, 0];
                    const regionName = geo.properties.name;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={colorScale(index)}
                        stroke="#FFF"
                        strokeWidth={0.5}
                      >
                        <Marker coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            dy="0.3em"
                            className="text-sm font-medium"
                            style={{ fontFamily: "Arial", fill: "#333" }}
                          >
                            {regionName} {/* عرض اسم المحافظة */}
                          </text>
                        </Marker>
                      </Geography>
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LibyaMapPro;

