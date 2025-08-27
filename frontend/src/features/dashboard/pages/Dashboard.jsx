import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Download, Filter, TrendingUp, Scale, Users, Calendar, CheckCircle } from "lucide-react";

// Building blocks (كما هي عندك)
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

import {
  getKpis,
  getTrends,
  getDistribution,
  getMapData,
  getRecent,
  getMiniSeries
} from "../api/dashboard";

import { useLanguage } from "@/context/LanguageContext";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay } }
});

export default function Dashboard() {
  const { lang, dir, t, formatNumber } = useLanguage();

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [kpis, trends, distribution, mapData, recentCases] = await Promise.all([
          getKpis(filters),
          getTrends(filters),
          getDistribution(filters),
          getMapData(filters),
          getRecent({ limit: 6, filters })
        ]);
        if (mounted) setData({ kpis, trends, distribution, mapData, recentCases });
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [filters]);

  const handleRegionClick = (regionCode) => {
    setFilters((prev) => ({ ...prev, region: regionCode }));
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" dir={dir}>
        <motion.div {...fadeIn(0.05)} className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("loading", lang)}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="container mx-auto px-6 pt-6 pb-2">
        <motion.div {...fadeIn(0.05)} className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            {t("title", lang)}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("subtitle", lang)}</p>
        </motion.div>
      </header>

      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/90 border-b">
        <div className="container mx-auto px-6 py-3">
          <Toolbar value={filters} onChange={setFilters} />
        </div>
      </div>

      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* KPI Row */}
        <motion.div {...fadeIn(0.1)} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title={t("totalCases", lang)}
            value={formatNumber(data.kpis.totalCases, lang)}
            delta={12}
            miniSeries={getMiniSeries(12)}
            icon={Scale}
          />
          <KpiCard
            title={t("wonCases", lang)}
            value={formatNumber(data.kpis.wonCases, lang)}
            delta={8}
            miniSeries={getMiniSeries(12)}
            icon={CheckCircle}
          />
          <KpiCard
            title={t("successRate", lang)}
            value={`${data.kpis.successRate}%`}
            delta={5}
            miniSeries={getMiniSeries(12)}
            icon={TrendingUp}
          />
          <KpiCard
            title={t("activeSessions", lang)}
            value={formatNumber(data.kpis.activeSessions, lang)}
            delta={-3}
            miniSeries={getMiniSeries(12)}
            icon={Users}
          />
        </motion.div>

        {/* ===== Radial / Orbit Layout ===== */}
        {/* على الشاشات الصغيرة: كل شيء عمودي. على xl+: خريطة دائرية في المنتصف والمخططات حولها */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left rail (أعلى/يسار الدائرة) */}
          <motion.div {...fadeIn(0.12)} className="xl:col-span-3 space-y-6 order-2 xl:order-1">
            <ChartCard
              title={t("monthlyCases", lang)}
              description={t("monthlyDescription", lang)}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/60 transition">
                  <Download className="w-4 h-4" />
                </button>
              }
            >
              <div className="h-[220px]">
                <BarChartBasic data={data.trends} xKey="month" yKey="cases" />
              </div>
            </ChartCard>

            <ChartCard
              title={t("courtSessions", lang)}
              description={t("sessionsDescription", lang)}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/60 transition">
                  <Calendar className="w-4 h-4" />
                </button>
              }
            >
              <div className="h-[190px]">
                <AreaChartBasic data={data.trends} xKey="month" yKey="sessions" />
              </div>
            </ChartCard>
          </motion.div>

          {/* Center – CIRCULAR MAP CARD */}
          <motion.div
            {...fadeIn(0.18)}
            className="xl:col-span-6 order-1 xl:order-2"
          >
            <div className="relative">
              {/* حلقة زخرفية خارجية */}
              <div className="pointer-events-none absolute inset-0 hidden xl:block">
                <div className="mx-auto aspect-square w-[86%] rounded-full border border-primary/20" />
              </div>

              <ChartCard
                title={t("geographicDistribution", lang)}
                description={t("geoDescription", lang)}
                actions={
                  <button className="p-2 rounded-lg hover:bg-muted/60 transition">
                    <Download className="w-4 h-4" />
                  </button>
                }
                className="p-4"
              >
                {/* الحاوية الدائرية */}
                <div className="relative mx-auto max-w-[760px]">
                  <div className="mx-auto aspect-square w-full md:w-[86%] xl:w-[88%] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.12)] ring-1 ring-border overflow-hidden bg-card">
                    {/* لمعان خفيف */}
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/6 to-transparent" />
                    {/* الخريطة */}
                    <div className="absolute inset-0">
                      <Suspense fallback={<div className="w-full h-full grid place-items-center text-muted-foreground">…</div>}>
                        <LibyaMapPro
                          data={data.mapData}
                          onRegionClick={handleRegionClick}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </motion.div>

          {/* Right rail (أسفل/يمين الدائرة) */}
          <motion.div {...fadeIn(0.22)} className="xl:col-span-3 space-y-6 order-3">
            <ChartCard
              title={t("caseOutcomes", lang)}
              description={t("outcomesDescription", lang)}
              actions={
                <button className="p-2 rounded-lg hover:bg-muted/60 transition">
                  <Filter className="w-4 h-4" />
                </button>
              }
            >
              <div className="h-[220px]">
                <PieChartBasic data={data.distribution} innerRadius={56} />
              </div>
            </ChartCard>

            <ChartCard
              title={t("topRegions", lang)}
              description={t("topRegionsDesc", lang)}
            >
              {/* يمكنك لاحقًا استبداله بجدول صغير لأعلى الأقاليم */}
              <div className="text-sm text-muted-foreground h-[190px] grid place-items-center">
                {t("comingSoon", lang)}
              </div>
            </ChartCard>
          </motion.div>
        </section>

        {/* Recent cases – full width */}
        <motion.div {...fadeIn(0.28)}>
          <ChartCard
            title={t("recentCases", lang)}
            description={t("recentDescription", lang)}
            actions={
              <button className="p-2 rounded-lg hover:bg-muted/60 transition">
                <Download className="w-4 h-4" />
              </button>
            }
          >
            <CompactTable rows={data.recentCases} language={lang} />
          </ChartCard>
        </motion.div>
      </main>
    </div>
  );
}
