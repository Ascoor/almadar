/** Color scales derived from CSS variables */
export const heatScale = [
  'rgb(var(--heat-1))',
  'rgb(var(--heat-2))',
  'rgb(var(--heat-3))',
  'rgb(var(--heat-4))',
  'rgb(var(--heat-5))',
];

const seriesVars = ['--primary', '--secondary', '--accent', '--warning', '--success', '--destructive'];

/**
 * Returns a color from the palette with optional alpha.
 */
export function getSeriesColor(index: number, alpha = 1): string {
  const variable = seriesVars[index % seriesVars.length];
  return `rgb(var(${variable}) / ${alpha})`;
}
