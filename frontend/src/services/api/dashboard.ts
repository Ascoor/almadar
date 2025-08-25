export async function getKpis() {
  return {
    totalCases: 120,
    won: 80,
    lost: 40,
    successRate: 66.6,
    contractsVolume: 25,
  };
}

export async function getTrends() {
  return [
    { month: '2025-01', cases: 10, sessions: 5, actions: 3 },
    { month: '2025-02', cases: 20, sessions: 8, actions: 6 },
  ];
}

export async function getDistribution() {
  return [
    { label: 'Open', value: 30 },
    { label: 'Closed', value: 70 },
  ];
}

export async function getMapData() {
  return [
    { regionCode: 'TRP', name: 'طرابلس', count: 42, lat: 32.8872, lng: 13.1913 },
    { regionCode: 'BEN', name: 'بنغازي', count: 25, lat: 32.1167, lng: 20.0667 },
  ];
}

export async function getRecent() {
  return [
    { id: 1, title: 'Case A', type: 'Case', region: 'TRP', status: 'open', date: '2025-01-01' },
    { id: 2, title: 'Case B', type: 'Case', region: 'BEN', status: 'closed', date: '2025-02-05' },
  ];
}
