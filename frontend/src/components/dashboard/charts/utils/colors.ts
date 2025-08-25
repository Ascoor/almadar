
/**
 * Color utilities for charts and visualizations
 */

// Chart color palette
export const CHART_COLORS = [
  'rgb(var(--chart-1))', // Primary blue
  'rgb(var(--chart-2))', // Teal
  'rgb(var(--chart-3))', // Purple
  'rgb(var(--chart-4))', // Orange
  'rgb(var(--chart-5))', // Red
  'rgb(var(--chart-6))', // Green
] as const;

// Heat map colors
export const HEAT_COLORS = [
  'rgb(var(--heat-1))',
  'rgb(var(--heat-2))',
  'rgb(var(--heat-3))',
  'rgb(var(--heat-4))',
  'rgb(var(--heat-5))',
] as const;

// Status colors
export const STATUS_COLORS = {
  success: 'rgb(var(--success))',
  warning: 'rgb(var(--warning))',
  destructive: 'rgb(var(--destructive))',
  muted: 'rgb(var(--muted))',
} as const;

/**
 * Get color by index with cycling
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Generate color scale for heat maps
 */
export function getHeatColor(value: number, min: number, max: number): string {
  if (value <= min) return HEAT_COLORS[0];
  if (value >= max) return HEAT_COLORS[4];
  
  const ratio = (value - min) / (max - min);
  const colorIndex = Math.floor(ratio * (HEAT_COLORS.length - 1));
  return HEAT_COLORS[colorIndex];
}

/**
 * Get status color based on value change
 */
export function getStatusColor(delta: number): string {
  if (delta > 0) return STATUS_COLORS.success;
  if (delta < 0) return STATUS_COLORS.destructive;
  return STATUS_COLORS.muted;
}

/**
 * Generate gradient for charts
 */
export function generateGradient(
  id: string,
  color: string,
  opacity = 0.3
): string {
  return `url(#${id})`;
}
