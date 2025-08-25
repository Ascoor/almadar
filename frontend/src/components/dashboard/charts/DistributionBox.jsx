import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { getSeriesColor } from './utils/colors';

/**
 * Histogram distribution; used when box/whisker is unavailable.
 * @param {{data: number[]}} props
 */
export default function DistributionBox({ data }) {
  const histogram = buildHistogram(data, 10);

  return (
    <Card className="p-4" aria-label="distribution-box">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={histogram}>
          <XAxis dataKey="range" stroke="rgb(var(--muted))" />
          <YAxis stroke="rgb(var(--muted))" />
          <Tooltip />
          <Bar dataKey="count" fill={getSeriesColor(0, 0.8)} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function buildHistogram(values, bins = 10) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / bins || 1;
  const buckets = Array.from({ length: bins }, (_, i) => ({
    range: `${(min + i * step).toFixed(0)}-${(min + (i + 1) * step).toFixed(0)}`,
    count: 0,
  }));
  values.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / step), bins - 1);
    buckets[idx].count += 1;
  });
  return buckets;
}

DistributionBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
};
