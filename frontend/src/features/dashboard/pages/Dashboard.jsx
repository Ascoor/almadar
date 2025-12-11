  import React, { useState, useEffect } from "react";
  import { motion } from "framer-motion";
  import { Download, Filter, TrendingUp, Scale, Users, Calendar, CheckCircle } from "lucide-react";

  // Building blocks
  import {
    Toolbar,

    KpiCard,
    ChartCard,
    BarChartBasic,
    AreaChartBasic,
    PieChartBasic,
    CompactTable,
    LegalCaseCategorysChart,
    MapDetailsCard
  } from "@/features/dashboard/components";
  import {
    getKpis,
    getTrends,
    getDistribution,
    getMapData,
    getRecent,
    getMiniSeries
  } from "@/services/dashboard.service";
  import { useLanguage } from "@/context/LanguageContext"; 
  import CityMiniMapResponsive from "@/features/dashboard/components/Map/CityMiniMapResponsive";

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay } }
  });

  export default function Dashboard() {
    const { lang, dir, t, formatNumber } = useLanguage();

    const [filters, setFilters] = useState({ period: "last-12m", region: "ALL", status: "ALL" });
    const [data, setData] = useState({ kpis: {}, trends: [], distribution: [], mapData: [], recentCases: [] });
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
        <header className="container mx-auto px-6 pt-6 pb-2">
          <motion.div {...fadeIn(0.05)} className="text-center">
            <h1 className="page-title page-title-animate text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
              {t("title", lang)}
            </h1>
            <p className="page-subtitle text-sm md:text-base">{t("subtitle", lang)}</p>
          </motion.div>
        </header>

      <main className="container mx-auto px-6 py-6 space-y-6">
        <motion.div {...fadeIn(0.08)}>
          <Toolbar value={filters} onChange={setFilters} />
        </motion.div>
        <motion.div {...fadeIn(0.1)} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title={t("totalCases", lang)} value={formatNumber(data.kpis.totalCases, lang)} delta={12} miniSeries={getMiniSeries(12)} icon={Scale} />
            <KpiCard title={t("wonCases", lang)} value={formatNumber(data.kpis.wonCases, lang)} delta={8} miniSeries={getMiniSeries(12)} icon={CheckCircle} />
            <KpiCard title={t("successRate", lang)} value={`${data.kpis.successRate}%`} delta={5} miniSeries={getMiniSeries(12)} icon={TrendingUp} />
            <KpiCard title={t("activeSessions", lang)} value={formatNumber(data.kpis.activeSessions, lang)} delta={-3} miniSeries={getMiniSeries(12)} icon={Users} />
          </motion.div>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <motion.div {...fadeIn(0.12)} className="xl:col-span-3 space-y-6 order-2 xl:order-1">
              <ChartCard title={t("monthlyCases", lang)} description={t("monthlyDescription", lang)} actions={<button className="p-2 rounded-lg hover:bg-muted/60 transition"><Download className="w-4 h-4 icon-3d" /></button>}>
                <div className="chart-h w-full min-w-0">
                  <BarChartBasic data={data.trends} xKey="month" yKey="cases" />
                </div>
              </ChartCard>
              <ChartCard title={t("courtSessions", lang)} description={t("sessionsDescription", lang)} actions={<button className="p-2 rounded-lg hover:bg-muted/60 transition"><Calendar className="w-4 h-4 icon-3d" /></button>}>
                <div className="chart-h w-full min-w-0">
                  <AreaChartBasic data={data.trends} xKey="month" yKey="sessions" />
                </div>
              </ChartCard>
            </motion.div>

            <motion.div {...fadeIn(0.18)} className="xl:col-span-6 order-1 xl:order-2 space-y-6">
              <div className="relative">
                <ChartCard title={t("geographicDistribution", lang)} description={t("geoDescription", lang)} actions={<button className="p-2 rounded-lg hover:bg-muted/60 transition"><Download className="w-4 h-4 icon-3d" /></button>} className="p-4">
                  <div className="chart-2h w-full min-w-0">
                    <CityMiniMapResponsive
                      data={data.mapData}
                      onRegionClick={handleRegionClick}
                      width="100%"
                      height="100%"
                      zoom={6}
                      showMarker={false}
                    />
                  </div>
                </ChartCard>
              </div>
              <motion.div {...fadeIn(0.2)}>
                <MapDetailsCard />
              </motion.div>
            </motion.div>

            <motion.div {...fadeIn(0.22)} className="xl:col-span-3 space-y-6 order-3">
              <ChartCard title={t("caseOutcomes", lang)} description={t("outcomesDescription", lang)} actions={<button className="p-2 rounded-lg hover:bg-muted/60 transition"><Filter className="w-4 h-4 icon-3d" /></button>}>
                <div className="chart-h w-full min-w-0">
                  <PieChartBasic data={data.distribution} innerRadius={56} />
                </div>
              </ChartCard>
             <ChartCard
  title={t("geographicDistribution", lang)}
  description={t("geoDescription", lang)}
  className="p-0 overflow-hidden"
>
  {/* اجعل ارتفاع الكارت نفسه مرنًا حسب الـ breakpoint */}
  <div className="relative w-full min-w-0 h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[540px]">
    {/* الخريطة تملأ الكارت بالكامل */}
    <LegalCaseCategorysChart className="absolute inset-0" />
  </div>
</ChartCard>

            </motion.div>
          </section>

          <motion.div {...fadeIn(0.28)}>
            <ChartCard title={t("recentCases", lang)} description={t("recentDescription", lang)} actions={<button className="p-2 rounded-lg hover:bg-muted/60 transition"><Download className="w-4 h-4" /></button>}>
              <CompactTable rows={data.recentCases} language={lang} />
            </ChartCard>
          </motion.div>
        </main>
      </div>
    );
  }
