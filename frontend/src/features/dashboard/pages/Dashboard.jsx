import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Filter, TrendingUp, Scale, Users, MapPin, Calendar, CheckCircle } from "lucide-react";

// Import dashboard components
import {
  Toolbar,
  KpiCard,
  ChartCard,
  BarChartBasic,
  AreaChartBasic,
  PieChartBasic,
  LibyaMapPro, 
  CompactTable
} from "@/components/dashboard";  

// Import API functions
import {
  getKpis,
  getTrends,
  getDistribution,
  getMapData,
  getRecent,
  getMiniSeries
} from "../api/dashboard";

// Import contexts 
import { useLanguage } from "@/context/LanguageContext";

export default function Dashboard() { 
  const { lang, dir ,t, formatNumber } = useLanguage();
  
  const [filters, setFilters] = useState({
    period: "last-12m",
    region: "ALL", 
    status: "ALL"
  });

  const [data, setData] = useState({
    kpis: {},
    trends: [],
    distribution: [],
    mapData: [],
    recentCases: []
  });

  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [kpis, trends, distribution, mapData, recentCases] = await Promise.all([
          getKpis(filters),
          getTrends(filters),
          getDistribution(filters),
          getMapData(filters),
          getRecent({ limit: 5, filters })
        ]);

        setData({
          kpis,
          trends,
          distribution,
          mapData,
          recentCases
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleRegionClick = (regionCode) => {
    setFilters(prev => ({
      ...prev,
      region: regionCode
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">{t('loading', lang)}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={dir }>
 
      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {t('title', lang)}
          </h1>
          <p className="text-muted-foreground">
            {t('subtitle', lang)}
          </p>
        </motion.div>

        {/* Toolbar */}
        <Toolbar
          value={filters}
          onChange={setFilters}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title={t('totalCases', lang)}
            value={formatNumber(data.kpis.totalCases, lang)}
            delta={12}
            miniSeries={getMiniSeries(8)}
            icon={Scale}
            delay={0.1}
          />
          <KpiCard
            title={t('wonCases', lang)}
            value={formatNumber(data.kpis.wonCases, lang)}
            delta={8}
            miniSeries={getMiniSeries(8)}
            icon={CheckCircle}
            delay={0.2}
          />
          <KpiCard
            title={t('successRate', lang)}
            value={`${data.kpis.successRate}%`}
            delta={5}
            miniSeries={getMiniSeries(8)}
            icon={TrendingUp}
            delay={0.3}
          />
          <KpiCard
            title={t('activeSessions', lang)}
            value={formatNumber(data.kpis.activeSessions, lang)}
            delta={-3}
            miniSeries={getMiniSeries(8)}
            icon={Users}
            delay={0.4}
          />
        </div>

        {/* Map and charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard
            title={t('geographicDistribution', lang)}
            description={t('geoDescription', lang)}
            delay={0.5}
            className="h-full"
            actions={
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            }
          >
            <LibyaMapPro
              data={data.mapData}
              onRegionClick={handleRegionClick}
              height={400}
            />
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            {/* Monthly Cases Chart */}
            <ChartCard
              title={t('monthlyCases', lang)}
              description={t('monthlyDescription', lang)}
              delay={0.6}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              }
            >
              <BarChartBasic
                data={data.trends}
                xKey="month"
                yKey="cases"
                height={200}
              />
            </ChartCard>

            {/* Case Outcomes */}
            <ChartCard
              title={t('caseOutcomes', lang)}
              description={t('outcomesDescription', lang)}
              delay={0.7}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              }
            >
              <PieChartBasic
                data={data.distribution}
                height={200}
                innerRadius={50}
              />
            </ChartCard>

            {/* Sessions Trend */}
            <ChartCard
              title={t('courtSessions', lang)}
              description={t('sessionsDescription', lang)}
              delay={0.8}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Calendar className="w-4 h-4" />
                </button>
              }
            >
              <AreaChartBasic
                data={data.trends}
                xKey="month"
                yKey="sessions"
                height={200}
              />
            </ChartCard>
          </div>
        </div>

        {/* Recent Cases Table */}
        <ChartCard
          title={t('recentCases', lang)}
          description={t('recentDescription', lang)}
          delay={0.9}
          actions={
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          }
        >
          <CompactTable rows={data.recentCases} language={lang} />
        </ChartCard>
      </div>
    </div>
  );
}
