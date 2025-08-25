import React, { Suspense, lazy } from 'react';
import './dashboard.css';
import { useDashboardData } from './useDashboardData';
import { useLang } from './useLang';
import FiltersBar from './FiltersBar';
import KpiCard from './KpiCard';
import EmptyState from './EmptyState';

const TrendArea = lazy(() => import('./TrendArea'));
const StackedByStage = lazy(() => import('./StackedByStage'));
const RiskDonut = lazy(() => import('./RiskDonut'));
const SlaGauge = lazy(() => import('./SlaGauge'));
const CourtHeatmap = lazy(() => import('./CourtHeatmap'));
const MapLibya = lazy(() => import('./MapLibya'));
const RecentTable = lazy(() => import('./RecentTable'));

export default function DashboardHome() {
  const { t } = useLang();
  const {
    loading,
    error,
    filters,
    setFilters,
    getKpis,
    getDailyOpenedClosed,
    getStageBuckets,
    getRiskBuckets,
    getSessionsHeat,
    getRegionMetrics,
    getRecent
  } = useDashboardData();

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <EmptyState message={error.message} />;

  const kpis = getKpis();

  return (
    <div className="space-y-4">
      <FiltersBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {kpis.map(k => (
          <KpiCard key={k.key} label={k.label_en} value={k.value} deltaPct={k.deltaPct} spark={k.spark} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-8 col-span-1 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <TrendArea data={getDailyOpenedClosed()} />
          </Suspense>
        </div>
        <div className="md:col-span-4 col-span-1 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <RiskDonut data={getRiskBuckets()} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <StackedByStage data={getStageBuckets()} />
          </Suspense>
        </div>
        <div className="bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <SlaGauge value={kpis.find(k => k.key === 'sla')?.value || 0} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-7 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <MapLibya metrics={getRegionMetrics()} />
          </Suspense>
        </div>
        <div className="md:col-span-5 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState /> }>
            <CourtHeatmap data={getSessionsHeat()} />
          </Suspense>
        </div>
      </div>

      <div className="bg-[var(--color-card)] p-2 rounded">
        <Suspense fallback={<EmptyState /> }>
          <RecentTable items={getRecent(20)} />
        </Suspense>
      </div>
    </div>
  );
}
