// Mock API functions for dashboard data

export const getKpis = async (filters = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    totalCases: 4136,
    wonCases: 2630,
    lostCases: 1530,
    successRate: 63,
    contractsVolume: 9000000,
    activeSessions: 245
  };
};

export const getTrends = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];
  
  return months.map(month => ({
    month,
    cases: Math.floor(Math.random() * 400) + 200,
    sessions: Math.floor(Math.random() * 150) + 50,
    actions: Math.floor(Math.random() * 80) + 20
  }));
};

export const getDistribution = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return [
    { label: "مكسوبة", value: 63 },
    { label: "مخسورة", value: 25 },
    { label: "قيد النظر", value: 12 }
  ];
};

export const getMapData = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  return [
    { regionCode: "TRP", name: "طرابلس", count: 1250 },
    { regionCode: "BEN", name: "بنغازي", count: 890 },
    { regionCode: "MIS", name: "مصراتة", count: 654 },
    { regionCode: "ZAW", name: "الزاوية", count: 432 },
    { regionCode: "SBH", name: "سبها", count: 298 }
  ];
};

export const getRecent = async ({ limit = 10, filters = {} } = {}) => {
  await new Promise(resolve => setTimeout(resolve, 180));
  
  const cases = [
    {
      id: "C001",
      title: "قضية عقد تجاري رقم 2024/001",
      description: "نزاع حول شروط العقد التجاري",
      type: "تجاري",
      region: "طرابلس",
      status: "Open",
      date: "2024-12-25"
    },
    {
      id: "C002", 
      title: "قضية عمالية رقم 2024/002",
      description: "مطالبة بالحقوق المالية للعامل",
      type: "عمالي",
      region: "بنغازي", 
      status: "InProgress",
      date: "2024-12-24"
    },
    {
      id: "C003",
      title: "قضية أحوال شخصية رقم 2024/003", 
      description: "دعوى طلاق وتوزيع الأصول",
      type: "أحوال شخصية",
      region: "مصراتة",
      status: "Won",
      date: "2024-12-23"
    },
    {
      id: "C004",
      title: "قضية جنائية رقم 2024/004",
      description: "جريمة اعتداء على الممتلكات", 
      type: "جنائي",
      region: "الزاوية",
      status: "Closed",
      date: "2024-12-22"
    },
    {
      id: "C005",
      title: "قضية إدارية رقم 2024/005",
      description: "طعن في قرار إداري حكومي",
      type: "إداري", 
      region: "سبها",
      status: "Lost",
      date: "2024-12-21"
    }
  ];
  
  return cases.slice(0, limit);
};

// Generate mini series data for KPI cards
export const getMiniSeries = (points = 12) => {
  return Array.from({ length: points }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100) + 20
  }));
};
 