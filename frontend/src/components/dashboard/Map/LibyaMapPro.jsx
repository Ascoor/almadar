import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Download, Filter, TrendingUp, Scale, Users, Calendar, CheckCircle } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useLanguage } from '@/context/LanguageContext';
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
  const { lang, t, formatNumber } = useLanguage();

  // Top 6 demo cities with contracts and legal cases
  const top6 = [
    { ar: 'طرابلس', en: 'Tripoli',    coord: [13.1913, 32.8872], contracts: 1500, cases: 1200 },
    { ar: 'بنغازي', en: 'Benghazi',   coord: [20.0647, 32.1167], contracts: 1100, cases: 980  },
    { ar: 'مصراتة', en: 'Misrata',    coord: [15.0906, 32.3754], contracts: 920,  cases: 860  },
    { ar: 'الزاوية', en: 'Zawiya',    coord: [12.7278, 32.7571], contracts: 780,  cases: 740  },
    { ar: 'سبها',   en: 'Sebha',      coord: [14.4333, 27.0377], contracts: 700,  cases: 620  },
    { ar: 'البيضاء', en: 'Al Bayda',  coord: [21.7551, 32.7627], contracts: 610,  cases: 540  },
  ];
  const cities = top6.map(c => ({ name: lang === 'ar' ? c.ar : c.en, ...c }));
  const maxContracts = Math.max(...cities.map(c => c.contracts));
  const maxCases = Math.max(...cities.map(c => c.cases));

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
    <div className="relative w-full h-full flex items-center justify-center">
      {/* بطاقة مستديرة للخريطة مع توهج خفيف */}
      <div className="relative w-[82%] md:w-[76%] xl:w-[70%] aspect-square rounded-full bg-card ring-1 ring-border shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* لمعان خفيف أعلى الدائرة */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />

        {/* الخريطة */}
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full grid place-items-center text-muted-foreground">…</div>}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 2120, center: [17.5, 26.5]}}
              width={800}
              height={600}
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%' }}
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
                        fill={`var(--chart-${(index % 8) + 1})`}
                        stroke="var(--bg)"
                        strokeWidth={0.5}
                      >
                        <Marker coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            dy="0.3em"
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-body)", fill: "var(--fg)" }}
                          >
                            {regionName}
                          </text>
                        </Marker>
                      </Geography>
                    );
                  })
                }
              </Geographies>
              {/* Top-6 cities with Contracts (chart-3) and Cases (chart-1) */}
              {cities.map((city, idx) => {
                const minR = 4, maxR = 12, offset = 10;
                const rCases = Math.max(minR, Math.min(maxR, (city.cases / maxCases) * maxR));
                const rContracts = Math.max(minR, Math.min(maxR, (city.contracts / maxContracts) * maxR));
                const label = `${city.name} · ${t('contracts', lang)} ${formatNumber(city.contracts, lang)} · ${t('cases', lang)} ${formatNumber(city.cases, lang)}`;
                return (
                  <Marker key={`city-${idx}`} coordinates={city.coord}>
                    <g className="pointer-events-none">
                      <circle cx={-offset} r={rCases} fill="var(--chart-1)" fillOpacity={0.9} stroke="var(--bg)" strokeWidth={1}>
                        <title>{label}</title>
                      </circle>
                      <circle cx={offset} r={rContracts} fill="var(--chart-3)" fillOpacity={0.9} stroke="var(--bg)" strokeWidth={1}>
                        <title>{label}</title>
                      </circle>
                      <text
                        y={-(Math.max(rCases, rContracts) + 6)}
                        textAnchor="middle"
                        className="text-[10px] md:text-xs"
                        style={{ fill: 'var(--fg)', fontFamily: 'var(--font-body)' }}
                      >
                        {label}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>
          </Suspense>
        </div>
        {/* Mini legend for markers */}
        <div className="absolute top-3 end-3 glass rounded-xl px-3 py-2 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'var(--chart-1)' }} />
            <span>{t('cases', lang)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'var(--chart-3)' }} />
            <span>{t('contracts', lang)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibyaMapPro;
