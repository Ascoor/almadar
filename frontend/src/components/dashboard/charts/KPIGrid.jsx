import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatNumber, formatPercent } from './utils/number';

/**
 * Grid of key performance indicators with optional sparkline.
 * @param {{data: import('./types').KPI[]}} props
 */
export default function KPIGrid({ data }) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <div dir={dir} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi) => (
        <Card key={kpi.titleKey} className="p-4" aria-label={kpi.titleKey}>
          <div className="text-sm text-muted mb-1">{t(kpi.titleKey)}</div>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(kpi.value, i18n.language)}
            {kpi.deltaPct !== undefined && (
              <span className={`ml-2 text-sm ${kpi.deltaPct >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercent(kpi.deltaPct, i18n.language)}
              </span>
            )}
          </div>
          {kpi.spark && (
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.spark.map((v, idx) => ({ idx, v }))}>
                  <Line type="monotone" dataKey="v" stroke="rgb(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

KPIGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      titleKey: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      deltaPct: PropTypes.number,
      spark: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
};
