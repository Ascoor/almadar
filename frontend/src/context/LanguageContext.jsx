import React, { createContext, useContext, useEffect, useState } from 'react';

const translations = {
  ar: {
    home: 'الرئيسية',
    contracts: 'التعاقدات',
    investigations: 'التحقيقات',
    legalAdvices: 'المشورة القانونية',
    litigations: 'التقاضي',
    management: 'إدارة التطبيق',
    lists: 'القوائم',
    users: 'إدارة المستخدمين',
    usersList: 'المستخدمين',
    archive: 'الأرشيف',
    fatwa: 'الرأي والفتوى',
  // Header
    title: "مركز البيانات القانونية الليبية",
    subtitle: "نظام متقدم لإدارة ومتابعة القضايا القانونية",
    
    // Navigation
    dashboard: "لوحة التحكم",
    cases: "القضايا",
    contracts: "العقود",
    reports: "التقارير",
    settings: "الإعدادات",
    
    // KPIs
    totalCases: "إجمالي القضايا",
    wonCases: "القضايا المكسوبة",
    lostCases: "القضايا المخسورة",
    successRate: "معدل النجاح",
    contractsVolume: "حجم العقود",
    activeSessions: "الجلسات النشطة",
    
    // Charts
    monthlyCases: "القضايا الشهرية",
    monthlyDescription: "عدد القضايا المسجلة كل شهر",
    geographicDistribution: "التوزيع الجغرافي",
    geoDescription: "عدد القضايا حسب المنطقة",
    caseOutcomes: "نتائج القضايا",
    outcomesDescription: "توزيع نتائج القضايا المغلقة",
    courtSessions: "جلسات المحاكم",
    sessionsDescription: "عدد الجلسات المنعقدة شهرياً",
    recentCases: "آخر القضايا",
    recentDescription: "أحدث القضايا المسجلة في النظام",
    
    // Regions
    topRegions: "أهم المناطق",
    tripoli: "طرابلس",
    benghazi: "بنغازي",
    misrata: "مصراتة",
    zawiya: "الزاوية",
    sebha: "سبها",
    
    // Status
    open: "مفتوحة",
    inProgress: "قيد المعالجة",
    won: "مكسوبة",
    lost: "مخسورة",
    closed: "مغلقة",
    
    // Filters
    allRegions: "جميع المناطق",
    allStatuses: "جميع الحالات",
    last12Months: "آخر 12 شهر",
    yearToDate: "من بداية السنة",
    last90Days: "آخر 90 يوم",
    reset: "إعادة تعيين",
    
    // Actions
    download: "تحميل",
    filter: "تصفية",
    view: "عرض",
    edit: "تعديل",
    
    // Loading
    loading: "جاري التحميل...",
    
    // Table Headers
    title_header: "العنوان",
    type: "النوع",
    region: "المنطقة",
    status: "الحالة",
    date: "التاريخ"
  },
  en: {
    home: 'Home',
    contracts: 'Contracts',
    investigations: 'Investigations',
    legalAdvices: 'Legal Advices',
    litigations: 'Litigations',
    management: 'App Management',
    lists: 'Lists',
    users: 'Users Management',
    usersList: 'Users',
    archive: 'Archive',
    fatwa: 'Fatwa',

    // KPIs
    totalCases: "Total Cases",
    wonCases: "Won Cases",
    lostCases: "Lost Cases",
    successRate: "Success Rate",
    contractsVolume: "Contracts Volume",
    activeSessions: "Active Sessions",
    
    // Charts
    monthlyCases: "Monthly Cases",
    monthlyDescription: "Number of cases registered each month",
    geographicDistribution: "Geographic Distribution",
    geoDescription: "Number of cases by region",
    caseOutcomes: "Case Outcomes",
    outcomesDescription: "Distribution of closed case results",
    courtSessions: "Court Sessions",
    sessionsDescription: "Number of sessions held monthly",
    recentCases: "Recent Cases",
    recentDescription: "Latest cases registered in the system",
    
    // Regions
    topRegions: "Top Regions",
    tripoli: "Tripoli",
    benghazi: "Benghazi",
    misrata: "Misrata",
    zawiya: "Zawiya",
    sebha: "Sebha",
    
    // Status
    open: "Open",
    inProgress: "In Progress",
    won: "Won",
    lost: "Lost",
    closed: "Closed",
    
    // Filters
    allRegions: "All Regions",
    allStatuses: "All Statuses",
    last12Months: "Last 12 Months",
    yearToDate: "Year to Date",
    last90Days: "Last 90 Days",
    reset: "Reset",
    
    // Actions
    download: "Download",
    filter: "Filter",
    view: "View",
    edit: "Edit",
    
    // Loading
    loading: "Loading...",
    
    // Table Headers
    title_header: "Title",
    type: "Type",
    region: "Region",
    status: "Status",
    date: "Date"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));

  const t = key => translations[lang][key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

