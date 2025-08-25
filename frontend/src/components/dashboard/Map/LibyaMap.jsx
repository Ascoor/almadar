import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import libyaGeo from '@/assets/geo/libya.json';

export default function LibyaMap({ data = [], onRegionClick }) {
  const counts = React.useMemo(() => {
    const map = {};
    data.forEach(d => {
      map[d.regionCode] = d.count;
    });
    return map;
  }, [data]);

  return (
    <ComposableMap projectionConfig={{ scale: 2000 }}>
      <Geographies geography={libyaGeo}>
        {({ geographies }) =>
          geographies.map(geo => {
            const code = geo.properties.id;
            const count = counts[code] || 0;
            return (
              <Geography
                key={code}
                geography={geo}
                fill={count ? 'var(--color-primary-light)' : '#eee'}
                stroke="#999"
                onClick={() => onRegionClick && onRegionClick(code)}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
