import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, Brush, XAxis } from 'recharts';
import { getSeriesColor } from './utils/colors';

/**
 * Shared brush for selecting time range across charts.
 * @param {{data: import('./types').TimePoint[], onChange?: Function}} props
 */
export default function CrosshairBrush({ data, onChange }) {
  const chartData = data.map((d) => ({ date: d.date, value: Object.values(d.series)[0] }));

  const handleChange = (range) => {
    if (!range) return;
    const [start, end] = range;
    const from = chartData[start]?.date;
    const to = chartData[end]?.date;
    onChange && onChange({ dateFrom: from, dateTo: to });
  };

  return (
    <Card className="p-4" aria-label="crosshair-brush">
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={chartData}>
          <XAxis dataKey="date" hide />
          <Area type="monotone" dataKey="value" stroke={getSeriesColor(0)} fill={getSeriesColor(0, 0.3)} />
          <Brush dataKey="date" onChange={handleChange} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

CrosshairBrush.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};
