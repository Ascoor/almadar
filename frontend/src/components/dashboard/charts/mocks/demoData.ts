<<<<<<< HEAD

/**
 * Demo data for dashboard charts and visualizations
 */

import { getDateRange, formatDate } from '../utils/dates';

// Generate mock time series data
function generateTimeSeriesData(months = 12) {
  const { from } = getDateRange(months);
  const data = [];
  
  for (let i = 0; i < months; i++) {
    const date = new Date(from);
    date.setMonth(date.getMonth() + i);
    
    data.push({
      date: formatDate(date, 'YYYY-MM-DD'),
      series: {
        contracts: Math.floor(Math.random() * 50) + 20,
        litigation: Math.floor(Math.random() * 30) + 10,
        advisory: Math.floor(Math.random() * 40) + 15,
        compliance: Math.floor(Math.random() * 25) + 8,
      }
    });
  }
  
  return data;
}

// Mock KPI data
export const mockKPIs = [
  {
    titleKey: 'total_cases',
    value: 1247,
    deltaPct: 12.5,
    spark: [45, 52, 48, 61, 55, 67, 73, 69, 78, 82, 85, 89]
  },
  {
    titleKey: 'active_contracts',
    value: 342,
    deltaPct: -3.2,
    spark: [32, 35, 38, 34, 31, 29, 33, 36, 34, 32, 30, 28]
  },
  {
    titleKey: 'resolved_disputes',
    value: 156,
    deltaPct: 18.7,
    spark: [12, 14, 16, 18, 15, 17, 19, 22, 20, 24, 26, 28]
  },
  {
    titleKey: 'compliance_rate',
    value: 94.2,
    deltaPct: 2.1,
    spark: [89, 90, 91, 92, 91, 93, 94, 93, 95, 94, 95, 96]
  }
];

// Mock time series data
export const mockTimeSeriesData = generateTimeSeriesData(12);

// Mock category breakdown data
export const mockCategoryData = [
  { category: 'Corporate Law', value: 425, region: 'MENA' },
  { category: 'Litigation', value: 312, region: 'MENA' },
  { category: 'Advisory', value: 234, region: 'Global' },
  { category: 'Compliance', value: 189, region: 'Local' },
  { category: 'IP Rights', value: 156, region: 'Global' },
  { category: 'Employment', value: 123, region: 'Local' },
];

// Mock geographic data (Choropleth)
export const mockChoroplethData = [
  { iso3: 'EGY', metric: 245 },
  { iso3: 'USA', metric: 189 },
  { iso3: 'SAU', metric: 156 },
  { iso3: 'ARE', metric: 134 },
  { iso3: 'GBR', metric: 98 },
  { iso3: 'DEU', metric: 87 },
  { iso3: 'FRA', metric: 76 },
  { iso3: 'ITA', metric: 65 },
  { iso3: 'ESP', metric: 54 },
  { iso3: 'CHN', metric: 43 },
];

// Mock bubble data
export const mockBubbleData = [
  { iso3: 'EGY', lat: 26.8206, lon: 30.8025, value: 245, label: 'Cairo Hub' },
  { iso3: 'USA', lat: 40.7128, lon: -74.0060, value: 189, label: 'NYC Office' },
  { iso3: 'SAU', lat: 24.7136, lon: 46.6753, value: 156, label: 'Riyadh Branch' },
  { iso3: 'ARE', lat: 25.2048, lon: 55.2708, value: 134, label: 'Dubai Center' },
  { iso3: 'GBR', lat: 51.5074, lon: -0.1278, value: 98, label: 'London Office' },
];

// Mock treemap data
export const mockTreemapData = [
  {
    name: 'Corporate Law',
    size: 425,
    children: [
      { name: 'Mergers & Acquisitions', size: 156 },
      { name: 'Corporate Governance', size: 134 },
      { name: 'Securities', size: 89 },
      { name: 'Banking', size: 46 },
    ]
  },
  {
    name: 'Litigation',
    size: 312,
    children: [
      { name: 'Commercial Disputes', size: 145 },
      { name: 'Employment Law', size: 98 },
      { name: 'Real Estate', size: 69 },
    ]
  },
  {
    name: 'Advisory',
    size: 234,
    children: [
      { name: 'Legal Consultation', size: 123 },
      { name: 'Risk Assessment', size: 67 },
      { name: 'Regulatory Advice', size: 44 },
    ]
  }
];

// Mock recent signals
export const mockRecentSignals = [
  {
    id: '1',
    type: 'alert',
    titleKey: 'high_risk_contract',
    message: 'Contract XYZ requires immediate attention',
    timestamp: new Date().toISOString(),
    severity: 'high'
  },
  {
    id: '2',
    type: 'info',
    titleKey: 'compliance_update',
    message: 'New regulatory requirements published',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'medium'
  },
  {
    id: '3',
    type: 'success',
    titleKey: 'case_resolved',
    message: 'Commercial dispute ABC successfully resolved',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'low'
  }
];

// Mock distribution data (for histogram/box plot alternative)
export const mockDistributionData = [
  { range: '0-50K', count: 45, percentage: 23.4 },
  { range: '50K-100K', count: 67, percentage: 34.8 },
  { range: '100K-250K', count: 52, percentage: 27.1 },
  { range: '250K-500K', count: 21, percentage: 10.9 },
  { range: '500K+', count: 7, percentage: 3.6 }
];
=======
/** Demo data for local showcase */
export const demoData = {
  kpis: [
    { titleKey: 'kpi.newCases', value: 120, deltaPct: 0.12, spark: [3, 4, 5, 6, 5, 7] },
    { titleKey: 'kpi.closedCases', value: 80, deltaPct: -0.05, spark: [5, 3, 4, 2, 4, 3] },
    { titleKey: 'kpi.activeCases', value: 200, spark: [10, 12, 11, 13, 15, 14] },
    { titleKey: 'kpi.pending', value: 40, deltaPct: 0.02, spark: [1, 2, 3, 2, 3, 4] },
  ],
  timeSeries: [
    { date: '2024-01-01', series: { new: 5, closed: 2 } },
    { date: '2024-02-01', series: { new: 8, closed: 3 } },
    { date: '2024-03-01', series: { new: 6, closed: 4 } },
    { date: '2024-04-01', series: { new: 7, closed: 5 } },
  ],
  choropleth: [
    { iso3: 'EGY', metric: 20 },
    { iso3: 'USA', metric: 5 },
    { iso3: 'DEU', metric: 12 },
  ],
  categories: [
    { category: 'Civil', value: 30, region: 'MENA' },
    { category: 'Criminal', value: 12, region: 'MENA' },
    { category: 'Civil', value: 20, region: 'EMEA' },
    { category: 'Corporate', value: 15, region: 'EMEA' },
  ],
  geoPoints: [
    { iso3: 'EGY', lat: 26.8, lon: 30.8, value: 12 },
    { iso3: 'USA', lat: 38.9, lon: -77.0, value: 8 },
    { iso3: 'DEU', lat: 52.5, lon: 13.4, value: 5 },
  ],
  distribution: [1, 4, 2, 5, 3, 3, 4, 5, 6, 2, 1, 7],
  signals: [
    { id: 1, message: 'New high-risk case detected', date: '2024-01-02' },
    { id: 2, message: 'Compliance deadline approaching', date: '2024-02-10' },
  ],
};
>>>>>>> d9039229ee7b761f0a81db294b0be7d0ad02d048
