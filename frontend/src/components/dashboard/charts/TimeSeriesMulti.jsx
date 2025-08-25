import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import dayjs from './utils/dates';
import { getSeriesColor } from './utils/colors';

/**
 * Multi-series time chart for the last months.
 * @param {{data: import('./types').TimePoint[]}} props
 */
export default function TimeSeriesMulti({ data }) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  const seriesKeys = data[0] ? Object.keys(data[0].series) : [];
  const chartData = data.map((d) => ({ date: d.date, ...d.series }));

  return (
    <Card className="p-4" dir={dir} aria-label="time-series">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <XAxis
            dataKey="date"
            stroke="rgb(var(--muted))"
            tickFormatter={(v) => dayjs(v).format('MMM YY')}
          />
          <YAxis stroke="rgb(var(--muted))" />
          <Tooltip labelFormatter={(v) => dayjs(v).format('YYYY-MM-DD')} />
          {seriesKeys.map((key, idx) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={getSeriesColor(idx)}
              fill={getSeriesColor(idx, 0.3)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

TimeSeriesMulti.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      series: PropTypes.object.isRequired,
    })
  ).isRequired,
};
