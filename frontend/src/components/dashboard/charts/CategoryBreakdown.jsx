import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { getSeriesColor } from './utils/colors';

/**
 * Stacked columns by category and region.
 * @param {{data: import('./types').CategoryDatum[], onSelectCategory?: Function}} props
 */
export default function CategoryBreakdown({ data, onSelectCategory }) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  const regions = Array.from(new Set(data.map((d) => d.region).filter(Boolean)));
  const chartData = [];
  data.forEach((d) => {
    const item = chartData.find((c) => c.category === d.category);
    if (item) {
      item[d.region || 'value'] = (item[d.region || 'value'] || 0) + d.value;
    } else {
      chartData.push({ category: d.category, [d.region || 'value']: d.value });
    }
  });

  return (
    <Card className="p-4" dir={dir} aria-label="category-breakdown">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          onClick={(e) =>
            e?.activeLabel && onSelectCategory && onSelectCategory({ categories: [e.activeLabel] })
          }
        >
          <XAxis dataKey="category" stroke="rgb(var(--muted))" />
          <YAxis stroke="rgb(var(--muted))" />
          <Tooltip />
          {regions.length
            ? regions.map((r, idx) => (
                <Bar key={r} dataKey={r} stackId="a" fill={getSeriesColor(idx, 0.8)} />
              ))
            : <Bar dataKey="value" fill={getSeriesColor(0, 0.8)} />}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

CategoryBreakdown.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      region: PropTypes.string,
    })
  ).isRequired,
  onSelectCategory: PropTypes.func,
};
