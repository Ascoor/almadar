// chartTheme.js
export const chartMargin = { top: 8, right: 10, bottom: 8, left: 10 };

// نخلي اللون ياخده من tokens مخصص للـ axis بدل muted
export const axisTick = {
  fontSize: 12,
  fill: 'var(--chart-axis)',
  fontWeight: 600,
};

// Tooltip واضح + تباين أعلى
export const tooltipStyle = {
  backgroundColor: 'var(--chart-tooltip-bg)',
  border: '1px solid var(--chart-tooltip-border)',
  borderRadius: 12,
  boxShadow: 'var(--shadow-md)',
  color: 'var(--fg)',
};

export const legendStyle = {
  color: 'var(--muted-foreground)',
  fontSize: 12,
  fontWeight: 600,
};

export const getPalette = (n = 8) =>
  Array.from({ length: n }, (_, i) => `var(--chart-${(i % 8) + 1})`);

export const makeTickFormatter = (formatNumber, lang) => (v) =>
  typeof v === 'number' ? formatNumber(v, lang) : v;
