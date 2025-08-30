import React, { useState, useEffect, Suspense } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useLanguage } from '@/context/LanguageContext';

const geoUrl = "/geo/libya-country.geojson";

const LibyaMapPro = ({
  highlightTop = true,
  topBy = 'combined',
  topN = 3,
  projection = 'geoMercator',
  projectionConfig = { scale: 2120, center: [17.5, 26.5] },
  markers = [], // optional: [{ name, coordinates:[lon,lat], markerOffset: number }]
  displayTopOnly = false, // show only top cities
  displayCount, // number of cities to show (e.g., 3 or 6). If undefined, shows all.
} = {}) => {
  const colorScale = scaleOrdinal(schemeCategory10);
  const [data, setData] = useState([]);
  const { lang, t, formatNumber } = useLanguage();

  const top6 = [
    { ar: 'طرابلس', en: 'Tripoli', coord: [13.1913, 32.8872], contracts: 1500, cases: 1200 },
    { ar: 'بنغازي', en: 'Benghazi', coord: [20.0647, 32.1167], contracts: 1100, cases: 980 },
    { ar: 'مصراتة', en: 'Misrata', coord: [15.0906, 32.3754], contracts: 920, cases: 860 },
    { ar: 'الزاوية', en: 'Zawiya', coord: [12.7278, 32.7571], contracts: 780, cases: 740 },
    { ar: 'سبها', en: 'Sebha', coord: [14.4333, 27.0377], contracts: 700, cases: 620 },
    { ar: 'البيضاء', en: 'Al Bayda', coord: [21.7551, 32.7627], contracts: 610, cases: 540 },
  ];

  const cities = top6.map(c => ({ name: lang === 'ar' ? c.ar : c.en, ...c }));
  const maxContracts = Math.max(...cities.map(c => c.contracts));
  const maxCases = Math.max(...cities.map(c => c.cases));
  const withCombined = cities.map(c => ({ ...c, combined: (c.contracts || 0) + (c.cases || 0) }));
  const metric = (c) => (topBy === 'cases' ? c.cases : topBy === 'contracts' ? c.contracts : c.combined);
  const topSorted = [...withCombined].sort((a,b) => metric(b) - metric(a));
  const topSet = new Set(highlightTop ? topSorted.slice(0, topN).map(c => c.name) : []);

  // Choose which list to render
  let renderList;
  if (markers.length) {
    renderList = typeof displayCount === 'number' ? markers.slice(0, displayCount) : markers;
  } else if (displayTopOnly) {
    const count = typeof displayCount === 'number' ? displayCount : topN;
    renderList = topSorted.slice(0, count);
  } else {
    renderList = typeof displayCount === 'number' ? withCombined.slice(0, displayCount) : withCombined;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(geoUrl);
        const json = await response.json();
        setData(json.features);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[82%] md:w-[76%] xl:w-[70%] aspect-square rounded-full bg-card ring-1 ring-border shadow-lg overflow-hidden">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full grid place-items-center text-gray-500">Loading...</div>}>
            <ComposableMap
              projection={projection}
              projectionConfig={projectionConfig}
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
                            className="map-label hidden xl:block"
                            style={{ vectorEffect: 'non-scaling-stroke' }}
                          >
                            {regionName}
                          </text>
                        </Marker>
                      </Geography>
                    );
                  })
                }
              </Geographies>
              {renderList.map((cityOrMarker, idx) => {
                // If custom markers provided, use them verbatim (no top logic/metrics)
                if (markers.length) {
                  const label = cityOrMarker.name;
                  const markerOffset = cityOrMarker.markerOffset ?? (idx % 2 === 0 ? -30 : 15);
                  return (
                    <Marker key={`mk-${idx}`} coordinates={cityOrMarker.coordinates}>
                      <g className="pointer-events-none" transform="translate(-12, -24)" fill="none" stroke={'var(--chart-1)'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="10" r="3" />
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                      </g>
                      <text textAnchor="middle" y={markerOffset} className="map-label map-label-city" style={{ vectorEffect: 'non-scaling-stroke' }}>
                        {label}
                      </text>
                    </Marker>
                  );
                }

                const city = cityOrMarker; // default cities path
                const minR = 6, maxR = 12;
                const combined = (city.cases || 0) + (city.contracts || 0);
                const maxCombined = (maxCases + maxContracts) || 1;
                let r = Math.max(minR, Math.min(maxR, (combined / maxCombined) * maxR));
                const markerOffset = idx % 2 === 0 ? -30 : 15;
                const label = `${city.name} · ${t('contracts', lang)} ${formatNumber(city.contracts, lang)} · ${t('cases', lang)} ${formatNumber(city.cases, lang)}`;
                const isTop = highlightTop && topSet.has(city.name);
                if (isTop) r = r + 3;

                return (
                  <Marker key={`city-${idx}`} coordinates={city.coord}>
                    <g className="pointer-events-none" transform="translate(-12, -24)" fill="none" stroke={isTop ? 'var(--neon-title)' : 'var(--chart-1)'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                    </g>
                    {isTop && (
                      <g className="pointer-events-none" transform="translate(-12, -24)" fill="none" stroke="var(--neon-title)" strokeOpacity="0.35" strokeWidth={2}>
                        <path d="M12 24 C18 18 22 13 22 10 a10 10 0 1 0 -20 0 c0 3 4 8 10 14" />
                      </g>
                    )}
                    <text textAnchor="middle" y={markerOffset} className="map-label map-label-city" style={{ vectorEffect: 'non-scaling-stroke' }}>
                      {isTop ? `★ ${label}` : label}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>
          </Suspense>
        </div>
        <div className="absolute top-3 right-3 glass rounded-xl px-3 py-2 text-xs flex items-center gap-3">
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
