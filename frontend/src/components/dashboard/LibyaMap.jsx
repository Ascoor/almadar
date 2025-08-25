import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import regions from './regions-libya.json';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

function LibyaMap({ metrics = [], onRegionSelect }) {
  const theme = useThemeVars();
  const { dir } = useLang();
  const max = Math.max(...metrics.map(m => m.total_cases), 1);
  const color = scaleLinear().domain([0, max]).range([theme.fills[3], theme.fills[0]]);
  const metricById = metrics.reduce((acc, m) => ({ ...acc, [m.region_id]: m }), {});

  return (
    <div dir={dir} className="w-full h-full" aria-label="libya-map">
      <ComposableMap projection="geoMercator" width={400} height={300} style={{ width: '100%', height: '300px' }}>
        <Geographies geography={regions}>
          {({ geographies }) =>
            geographies.map(geo => {
              const id = geo.properties.id;
              const m = metricById[id] || {};
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onRegionSelect && onRegionSelect(id)}
                  style={{
                    default: { fill: color(m.total_cases || 0), outline: 'none' },
                    hover: { fill: theme.fills[1], outline: 'none' },
                    pressed: { fill: theme.fills[2], outline: 'none' }
                  }}
                >
                  <title>{(dir === 'rtl' ? m.name_ar : m.name_en) || id}: {m.total_cases || 0}</title>
                </Geography>
              );
            })
          }
        </Geographies>
        {metrics.flatMap(m => m.cities).map((c, i) => (
          <Marker key={i} coordinates={[c.lon, c.lat]}>
            <circle r={Math.sqrt(c.cases)} fill="var(--color-accent)">
              <title>{c.city}: {c.cases}</title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default memo(LibyaMap);
