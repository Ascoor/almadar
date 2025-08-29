// Shared chart theming powered by CSS tokens
// Use only CSS variables so dark/light and brand updates apply automatically

export const chartMargin = { top: 4, right: 4, bottom: 4, left: 4 };

export const axisTick = { fontSize: 12, fill: 'var(--muted-foreground)' };

export const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  boxShadow: 'var(--glass-shadow)',
  color: 'var(--fg)'
};

export const legendStyle = { color: 'var(--muted-foreground)', fontSize: 12 };

export const getPalette = (n = 8) =>
  Array.from({ length: n }, (_, i) => `var(--chart-${(i % 8) + 1})`);

// Generic number formatter hookless helper (pass in formatNumber from context)
export const makeTickFormatter = (formatNumber, lang) => (v) => {
  return typeof v === 'number' ? formatNumber(v, lang) : v;
};

