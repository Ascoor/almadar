export function useThemeVars() {
  const root = typeof window !== 'undefined' ? document.documentElement : null;
  const cssVar = (n, fallback = '') =>
    root ? getComputedStyle(root).getPropertyValue(n).trim() || fallback : fallback;
  return {
    grid: cssVar('--chart-grid'),
    axis: cssVar('--chart-axis'),
    fills: [
      cssVar('--chart-fill-1'),
      cssVar('--chart-fill-2'),
      cssVar('--chart-fill-3'),
      cssVar('--chart-fill-4')
    ],
    strokes: [
      cssVar('--chart-stroke-1'),
      cssVar('--chart-stroke-2'),
      cssVar('--chart-stroke-3'),
      cssVar('--chart-stroke-4')
    ],
    text: cssVar('--color-fg')
  };
}
