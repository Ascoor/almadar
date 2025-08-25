export function useThemeVars() {
  const root = typeof window !== 'undefined' ? document.documentElement : null;
  const cssVar = (n, f = '') =>
    root ? getComputedStyle(root).getPropertyValue(n).trim() || f : f;
  return {
    grid: cssVar('--chart-grid'),
    axis: cssVar('--chart-axis'),
    fills: [1, 2, 3, 4, 5, 6].map(i => cssVar(`--chart-fill-${i}`)),
    strokes: [1, 2, 3, 4, 5, 6].map(i => cssVar(`--chart-stroke-${i}`)),
    text: cssVar('--color-fg')
  };
}
