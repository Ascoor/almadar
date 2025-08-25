import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoNaturalEarth1 } from 'd3-geo';
import { scaleQuantile } from 'd3-scale';
import { useEffect, useMemo, useState } from 'react';
import { loadWorldTopo } from './utils/geo';
import { heatScale } from './utils/colors';

/**
 * Choropleth map colored by metric value per country.
 * @param {{data: import('./types').ChoroplethDatum[], onSelectCountry?: Function}} props
 */
export default function WorldChoropleth({ data, onSelectCountry }) {
  const { i18n, t } = useTranslation();
  const dir = i18n.dir();
  const [geos, setGeos] = useState([]);

  useEffect(() => {
    loadWorldTopo().then(setGeos).catch(() => setGeos([]));
  }, []);

  const colorScale = useMemo(() => {
    const values = data.map((d) => d.metric);
    return scaleQuantile().domain(values).range(heatScale);
  }, [data]);

  const handleClick = (geo) => {
    onSelectCountry && onSelectCountry({ countries: [geo.id] });
  };

  return (
    <Card className="p-4" dir={dir} aria-label="world-choropleth">
      {geos.length ? (
        <ComposableMap projection={geoNaturalEarth1()}>
          <Geographies geography={{ type: 'FeatureCollection', features: geos }}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((c) => c.iso3 === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(geo)}
                    fill={d ? colorScale(d.metric) : 'rgb(var(--muted)/0.2)'}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      ) : (
        <div className="text-muted">{t('loading')}</div>
      )}
    </Card>
  );
}

WorldChoropleth.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      iso3: PropTypes.string.isRequired,
      metric: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectCountry: PropTypes.func,
};
