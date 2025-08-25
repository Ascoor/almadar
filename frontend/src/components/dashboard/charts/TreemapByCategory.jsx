import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, Treemap } from 'recharts';
import { getSeriesColor } from './utils/colors';

/**
 * Treemap distribution by category.
 * @param {{data: import('./types').CategoryDatum[], onSelectCategory?: Function}} props
 */
export default function TreemapByCategory({ data, onSelectCategory }) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  const formatted = data.map((d, idx) => ({ name: d.category, size: d.value, fill: getSeriesColor(idx, 0.8) }));

  return (
    <Card className="p-4" dir={dir} aria-label="treemap">
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={formatted}
          dataKey="size"
          stroke="rgb(var(--bg))"
          onClick={(node) => onSelectCategory && onSelectCategory({ categories: [node.name] })}
        />
      </ResponsiveContainer>
    </Card>
  );
}

TreemapByCategory.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectCategory: PropTypes.func,
};
