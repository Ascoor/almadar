import React, { Suspense, lazy } from 'react';
import './dashboard.css';
import FiltersBar from './FiltersBar';
import KpiCard from './KpiCard';
import CasesForAgainstArea from './CasesForAgainstArea';
import ProceduresProgress from './ProceduresProgress';
import ContractsVolume from './ContractsVolume';
import PublicationsPlan from './PublicationsPlan';
import RiskDonut from './RiskDonut';
import SlaGauge from './SlaGauge';
import StageFunnel from './StageFunnel';
import RecentTable from './RecentTable';
import EmptyState from './EmptyState';
import { useDashboardData } from './useDashboardData';
import { useLang } from './useLang';
import QuickActions from './QuickActions';

const LibyaMap = lazy(() => import('./LibyaMap'));
const SessionsHeatmap = lazy(() => import('./SessionsHeatmap'));

export default function DashboardHome() {
  const { t } = useLang();
  const {
    loading,
    error,
    filters,
    setFilters,
    getKpis,
    getMonthlyForAgainst,
    getProcedures,
    getSessionsHeat,
    getContractsVolume,
    getPublicationsPlan,
    getRegionMetrics,
    getStageBuckets,
    getRiskBuckets,
    getRecent
  } = useDashboardData();

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <EmptyState message={error.message} />;

  const kpis = getKpis();

  return (
    <div className="space-y-4">
      <QuickActions />
      <FiltersBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        {kpis.map(k => (
          <KpiCard key={k.key} label={k.label_en} value={k.value} deltaPct={k.deltaPct} spark={k.spark} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-8 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <CasesForAgainstArea data={getMonthlyForAgainst()} />
        </div>
        <div className="md:col-span-4 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <RiskDonut data={getRiskBuckets()} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-6 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <ProceduresProgress data={getProcedures()} />
        </div>
        <div className="md:col-span-6 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <SlaGauge value={kpis.find(k => k.key === 'sla')?.value || 0} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-7 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState />}>
            <LibyaMap metrics={getRegionMetrics()} />
          </Suspense>
        </div>
        <div className="md:col-span-5 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <Suspense fallback={<EmptyState />}>
            <SessionsHeatmap data={getSessionsHeat()} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-6 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <ContractsVolume data={getContractsVolume()} />
        </div>
        <div className="md:col-span-6 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <PublicationsPlan data={getPublicationsPlan()} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="md:col-span-5 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <StageFunnel data={getStageBuckets()} />
        </div>
        <div className="md:col-span-7 col-span-4 bg-[var(--color-card)] p-2 rounded">
          <RecentTable items={getRecent(20)} />
        </div>
      </div>
    </div>
  );
}
