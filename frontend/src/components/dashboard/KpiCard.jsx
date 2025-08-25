import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useThemeVars } from './useThemeVars';

export default function KpiCard({ label, value, deltaPct, spark = [] }) {
  const theme = useThemeVars();
  const deltaColor = deltaPct >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: 'var(--shadow-glow)' }}
      className="bg-[var(--color-card)] rounded-lg p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[var(--color-muted)]">{label}</span>
        <span className={`text-xs ${deltaColor}`}>{deltaPct > 0 ? '+' : ''}{deltaPct}%</span>
      </div>
      <div className="text-2xl font-bold mb-2 text-[var(--color-fg)]">{value}</div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark}>
            <Area
              type="monotone"
              dataKey="y"
              stroke={theme.strokes[0]}
              fill={theme.fills[0]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
