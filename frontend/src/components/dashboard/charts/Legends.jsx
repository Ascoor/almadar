import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { getSeriesColor } from './utils/colors';

/**
 * Dynamic legend allowing show/hide of series.
 * @param {{items: Array<{key: string, label: string}>, onToggle?: Function}} props
 */
export default function Legends({ items = [], onToggle }) {
  const [hidden, setHidden] = useState({});

  const toggle = (key) => {
    const next = { ...hidden, [key]: !hidden[key] };
    setHidden(next);
    onToggle && onToggle(next);
  };

  return (
    <Card className="p-4" aria-label="legends">
      <div className="flex flex-wrap gap-4">
        {items.map((item, idx) => (
          <button
            type="button"
            key={item.key}
            onClick={() => toggle(item.key)}
            className="flex items-center gap-2"
          >
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: getSeriesColor(idx, hidden[item.key] ? 0.2 : 1) }}
            />
            <span className={hidden[item.key] ? 'text-muted' : 'text-fg'}>{item.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

Legends.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onToggle: PropTypes.func,
};
