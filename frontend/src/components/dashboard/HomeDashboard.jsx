/**
 * HomeDashboard.jsx
 *
 * Composition shell for the legal case management dashboard.
 * Pass data via props and wire callbacks for filters and quick actions.
 *
 * i18n keys used here and in child components:
 * 'dashboard.title', 'dashboard.cases', 'dashboard.openTasks', 'dashboard.hearings',
 * 'dashboard.slaBreaches', 'dashboard.recoveryEgp', 'dashboard.trend',
 * 'dashboard.onTime', 'dashboard.breached', 'dashboard.workload',
 * 'dashboard.upcomingHearings', 'dashboard.tasks', 'dashboard.recentActivity',
 * 'dashboard.quickActions'
 */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';
import FiltersBar from './FiltersBar';
import MetricCards from './MetricCards';
import CasesTrendChart from './CasesTrendChart';
import SLADonut from './SLADonut';
import WorkloadHeatmap from './WorkloadHeatmap';
import UpcomingHearings from './UpcomingHearings';
import TasksKanban from './TasksKanban';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import ErrorBoundary from './ErrorBoundary';
import { DashboardLoader } from './Loaders';
import { NoData } from './EmptyStates';

/**
 * Number formatter for EGP currency.
 * @param {number} value
 * @returns {string}
 */
const formatEGP = (value) =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value);

/**
 * @typedef {Object} HomeDashboardProps
 * @property {import('./MetricCards').KPIData} kpis
 * @property {import('./CasesTrendChart').TrendPoint[]} trend
 * @property {{ onTime: number, breached: number }} sla
 * @property {import('./WorkloadHeatmap').WorkloadPoint[]} workload
 * @property {import('./UpcomingHearings').Hearing[]} hearings
 * @property {import('./TasksKanban').KanbanData} kanban
 * @property {import('./RecentActivity').ActivityItem[]} activity
 * @property {{ id: string, name: string, role: string, permissions: string[] }} user
 * @property {(filters: Record<string, any>) => void} onFilterChange
 * @property {(action: string) => void} onQuickAction
 */

/**
 * @param {HomeDashboardProps} props
 */
export default function HomeDashboard(props) {
  const { t } = useTranslation();
  const {
    kpis,
    trend,
    sla,
    workload,
    hearings,
    kanban,
    activity,
    user,
    onFilterChange,
    onQuickAction,
  } = props;

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 't') {
        document.documentElement.classList.toggle('dark');
      }
      if (e.key === 'l') {
        const dir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', dir);
      }
      if (e.key === '?') {
        // placeholder for shortcuts dialog
        alert(t('dashboard.shortcuts'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [t]);

  const handleFilterChange = useCallback(
    (filters) => {
      onFilterChange?.(filters);
    },
    [onFilterChange]
  );

  return (
    <main className="space-y-6">
      <HeaderBar user={user} />
      <FiltersBar onChange={handleFilterChange} />
      <QuickActions user={user} onAction={onQuickAction} />
      <ErrorBoundary fallback={<NoData />}> {
        kpis ? <MetricCards kpis={kpis} formatter={formatEGP} /> : <DashboardLoader />
      } </ErrorBoundary>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <ErrorBoundary fallback={<NoData />}>
            {trend ? <CasesTrendChart data={trend} /> : <DashboardLoader />}
          </ErrorBoundary>
        </div>
        <div className="xl:col-span-4">
          <ErrorBoundary fallback={<NoData />}>
            {sla ? <SLADonut data={sla} /> : <DashboardLoader />}
          </ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary fallback={<NoData />}>
        {workload ? <WorkloadHeatmap data={workload} /> : <DashboardLoader />}
      </ErrorBoundary>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundary fallback={<NoData />}>
          {hearings ? <UpcomingHearings items={hearings} /> : <DashboardLoader />}
        </ErrorBoundary>
        <ErrorBoundary fallback={<NoData />}>
          {kanban ? <TasksKanban data={kanban} /> : <DashboardLoader />}
        </ErrorBoundary>
        <ErrorBoundary fallback={<NoData />}>
          {activity ? <RecentActivity items={activity} /> : <DashboardLoader />}
        </ErrorBoundary>
      </div>
    </main>
  );
}

export const mocks = import.meta.env?.DEV
  ? {
      kpis: {
        cases: { total: 128, deltaPct: 6.4, spark: [4, 6, 5, 8, 9, 11, 10] },
        tasks: { total: 59, deltaPct: -3.2, spark: [8, 7, 6, 5, 6, 7, 6] },
        hearings: { total: 12, deltaPct: 2.1, spark: [1, 1, 2, 3, 2, 2, 1] },
        breaches: { total: 5, deltaPct: -1.1, spark: [1, 0, 1, 1, 1, 1, 0] },
        recoveryEgp: { total: 2350000, deltaPct: 4.9, spark: [200, 220, 210, 240, 250, 260, 270] },
      },
      trend: [
        { month: '2024-09', new: 10, inProgress: 24, closed: 6 },
        { month: '2024-10', new: 12, inProgress: 20, closed: 8 },
        { month: '2024-11', new: 14, inProgress: 22, closed: 10 },
        { month: '2024-12', new: 13, inProgress: 18, closed: 12 },
        { month: '2025-01', new: 16, inProgress: 17, closed: 11 },
        { month: '2025-02', new: 19, inProgress: 15, closed: 12 },
        { month: '2025-03', new: 17, inProgress: 20, closed: 14 },
        { month: '2025-04', new: 15, inProgress: 21, closed: 16 },
        { month: '2025-05', new: 20, inProgress: 23, closed: 18 },
        { month: '2025-06', new: 22, inProgress: 25, closed: 19 },
        { month: '2025-07', new: 21, inProgress: 24, closed: 20 },
        { month: '2025-08', new: 23, inProgress: 26, closed: 21 },
      ],
      sla: { onTime: 91, breached: 9 },
      workload: [
        { weekday: 0, slot: 'AM', value: 3 },
        { weekday: 1, slot: 'PM', value: 5 },
      ],
      hearings: [
        {
          id: 'h1',
          date: '2025-09-02T08:00:00Z',
          court: 'Giza Court',
          room: '12B',
          caseNo: '2025/413',
          client: 'Al-Nour Co.',
        },
      ],
      kanban: { todo: [{ id: 't1', title: 'Draft filing', assignee: 'Mona' }], doing: [], waiting: [], done: [] },
      activity: [
        {
          id: 'a1',
          ts: '2025-08-18T09:22:00Z',
          type: 'filing',
          title: 'Filed appeal for Case 2025/413',
        },
      ],
    }
  : undefined;
