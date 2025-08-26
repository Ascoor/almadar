// جميع الدوال ترجع Promise لح模拟 async
export const getKpis = async (filters) => ({
  totalCases: 324,
  won: 188,
  lost: 92,
  successRate: 67.9,
  contractsVolume: 12_500_000,
});

export const getTrends = async (filters) => [
  // months: 'YYYY-MM'
  { month: "2025-01", cases: 120, sessions: 45, actions: 60 },
  // … 11 شهرًا
];

export const getDistribution = async (filters) => [
  { label: "Open", value: 30 },
  { label: "InProgress", value: 55 },
  { label: "Closed", value: 35 },
];

export const getMapData = async (filters) => [
  // regionCode يطابق حقول GeoJSON التي تعتمدها
  { regionCode: "TRP", name: "طرابلس", count: 42 },
  // …
];

export const getRecent = async ({ limit = 10, filters }) => [
  { id: "1", title: "قضية 123", type: "Litigation", region: "TRP", status: "Open", date: "2025-08-01" },
  // …
];
