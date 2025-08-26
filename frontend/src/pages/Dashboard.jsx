import React, { useEffect, useState, lazy, Suspense } from 'react';
import KpiCard from '@/components/dashboard/KPI/KpiCard';
import ChartCard from '@/components/dashboard/Charts/ChartCard';
import Toolbar from '@/components/dashboard/Filters/Toolbar';
import Section from '@/components/dashboard/Layout/Section';
import CompactTable from '@/components/dashboard/Tables/CompactTable';
import EmptyState from '@/components/common/EmptyState';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLanguage } from '@/context/LanguageContext';
import { getKpis, getTrends, getDistribution, getMapData, getRecent } from '@/services/api/dashboard';

const LineChart = lazy(() => import('@/components/dashboard/Charts/LineChart'));
const BarChart = lazy(() => import('@/components/dashboard/Charts/BarChart'));
const AreaChart = lazy(() => import('@/components/dashboard/Charts/AreaChart'));
const PieChart = lazy(() => import('@/components/dashboard/Charts/PieChart'));
const LibyaMap = lazy(() => import('@/components/dashboard/Map/LibyaMap'));

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [recent, setRecent] = useState([]);
  const { dir } = useLanguage();

  useEffect(() => {
    getKpis(filters).then(setKpis);
    getTrends(filters).then(setTrends);
    getDistribution(filters).then(setDistribution);
    getMapData(filters).then(setMapData);
    getRecent({ limit: 10, filters }).then(setRecent);
  }, [filters]);

  const resetFilters = () => setFilters({});

  if (!kpis) return <GlobalSpinner />;

  return (
    <ErrorBoundary>
      <div className="space-y-6" dir={dir}>
        <Toolbar dir={dir} filters={filters} onChange={setFilters} onReset={resetFilters} />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total Cases" value={kpis.totalCases} />
          <KpiCard label="Won" value={kpis.won} />
          <KpiCard label="Lost" value={kpis.lost} />
          <KpiCard label="Contracts" value={kpis.contractsVolume} />
        </div>
      </Section>

      <Section title="Trends">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Cases by Month">
            <Suspense fallback={<GlobalSpinner />}>
              <LineChart data={trends} xKey="month" yKey="cases" dir={dir} />
            </Suspense>
          </ChartCard>
          <ChartCard title="Sessions by Month">
            <Suspense fallback={<GlobalSpinner />}>
              <BarChart data={trends} xKey="month" yKey="sessions" dir={dir} />
            </Suspense>
          </ChartCard>
        </div>
      </Section>

      <Section title="Distribution">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Actions">
            <Suspense fallback={<GlobalSpinner />}>
              <AreaChart data={trends} xKey="month" yKey="actions" dir={dir} />
            </Suspense>
          </ChartCard>
          <ChartCard title="Status">
            <Suspense fallback={<GlobalSpinner />}>
              <PieChart data={distribution} />
            </Suspense>
          </ChartCard>
        </div>
      </Section>

      <Section title="Map">
        <Suspense fallback={<GlobalSpinner />}>
          <div className="h-96">
            <LibyaMap data={mapData} />
          </div>
        </Suspense>
      </Section>

      <Section title="Recent">
        {recent.length ? (
          <CompactTable rows={recent} />
        ) : (
          <EmptyState message="No records" />
        )}
      </Section>
      </div>
    </ErrorBoundary>
  );
}
