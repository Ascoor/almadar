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
