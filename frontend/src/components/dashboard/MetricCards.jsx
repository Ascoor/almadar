/**
 * MetricCards.jsx
 * Grid of KPI cards with spark lines and delta badges.
 *
 * i18n keys:
 * 'dashboard.cases', 'dashboard.openTasks', 'dashboard.hearings',
 * 'dashboard.slaBreaches', 'dashboard.recoveryEgp'
 */

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

/**
 * @typedef {Object} CaseKPI
 * @property {number} total
 * @property {number} deltaPct
 * @property {number[]} spark
 */

/**
 * @typedef {Object} KPIData
 * @property {CaseKPI} cases
 * @property {CaseKPI} tasks
 * @property {CaseKPI} hearings
 * @property {CaseKPI} breaches
 * @property {CaseKPI} recoveryEgp
 */

/**
 * @param {{ kpis: KPIData, formatter?: (n:number)=>string }} props
 */
export default function MetricCards({ kpis, formatter }) {
  const { t } = useTranslation();
  const cards = [
    { key: 'cases', label: t('dashboard.cases') },
    { key: 'tasks', label: t('dashboard.openTasks') },
    { key: 'hearings', label: t('dashboard.hearings') },
    { key: 'breaches', label: t('dashboard.slaBreaches') },
    { key: 'recoveryEgp', label: t('dashboard.recoveryEgp'), format: formatter },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map(({ key, label, format }) => {
        const kpi = kpis[key];
        const deltaColor = kpi.deltaPct >= 0 ? 'success' : 'destructive';
        return (
          <motion.div key={key} whileHover={{ y: -4 }}>
            <Card className="bg-card shadow-lg border border-border rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-heading">
                    {format ? format(kpi.total) : kpi.total}
                  </div>
                  <Badge variant={deltaColor}>
                    {kpi.deltaPct}%
                  </Badge>
                </div>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.spark.map((v, i) => ({ v, i }))}>
                      <Area type="monotone" dataKey="v" stroke="rgb(var(--primary))" fill="rgba(var(--primary)/0.2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export { type CaseKPI, type KPIData };
