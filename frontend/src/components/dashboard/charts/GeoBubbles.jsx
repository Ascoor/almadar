import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoNaturalEarth1 } from 'd3-geo';
import { scaleSqrt } from 'd3-scale';
import { useEffect, useState } from 'react';
import { loadWorldTopo } from './utils/geo';
import { getSeriesColor } from './utils/colors';

/**
 * Bubble map highlighting outliers.
 * @param {{data: import('./types').GeoPoint[]}} props
 */
export default function GeoBubbles({ data }) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  const [geos, setGeos] = useState([]);

  useEffect(() => {
    loadWorldTopo().then(setGeos);
  }, []);

  const radius = scaleSqrt()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .range([0, 30]);

  return (
    <Card className="p-4" dir={dir} aria-label="geo-bubbles">
      {geos.length ? (
        <ComposableMap projection={geoNaturalEarth1()}>
          <Geographies geography={{ type: 'FeatureCollection', features: geos }}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="rgb(var(--card))" stroke="rgb(var(--border))" />
              ))
            }
          </Geographies>
          {data.map((d, idx) => (
            <Marker key={d.iso3} coordinates={[d.lon, d.lat]}>
              <circle r={radius(d.value)} fill={getSeriesColor(idx, 0.6)} stroke="rgb(var(--border))" />
            </Marker>
          ))}
        </ComposableMap>
      ) : null}
    </Card>
  );
}

GeoBubbles.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      iso3: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
};
