import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FiltersBar from './FiltersBar';
import KPIGrid from './KPIGrid';
import TimeSeriesMulti from './TimeSeriesMulti';
import CategoryBreakdown from './CategoryBreakdown';
import WorldChoropleth from './WorldChoropleth';
import GeoBubbles from './GeoBubbles';
import TreemapByCategory from './TreemapByCategory';
import DistributionBox from './DistributionBox';
import CrosshairBrush from './CrosshairBrush';
import RecentSignals from './RecentSignals';
import Legends from './Legends';
import ErrorBoundary from './ErrorBoundary';
import { demoData } from './mocks/demoData';

/** Context used to share dashboard filters */
const FiltersContext = createContext({ filters: {}, setFilters: () => {} });

/** Hook to access dashboard filters */
export const useDashboardFilters = () => useContext(FiltersContext);

/**
 * Global dashboard shell that wires widgets and filter state together.
 * @returns {JSX.Element}
 */
export default function GlobalDashboard() {
  const [filters, setFilters] = useState({});

  const handleFiltersChange = useCallback(
    (next) => {
      setFilters((prev) => ({ ...prev, ...next }));
    },
    [setFilters]
  );

  const contextValue = useMemo(
    () => ({ filters, setFilters: handleFiltersChange }),
    [filters, handleFiltersChange]
  );

  return (
    <FiltersContext.Provider value={contextValue}>
      <div className="space-y-4">
        <FiltersBar filters={filters} onChange={handleFiltersChange} />

        <ErrorBoundary>
          <KPIGrid data={demoData.kpis} />
        </ErrorBoundary>

        <div className="grid gap-4 md:grid-cols-2" aria-label="timeseries-and-map">
          <ErrorBoundary>
            <TimeSeriesMulti data={demoData.timeSeries} />
          </ErrorBoundary>
          <ErrorBoundary>
            <WorldChoropleth data={demoData.choropleth} onSelectCountry={handleFiltersChange} />
          </ErrorBoundary>
        </div>

        <div className="grid gap-4 md:grid-cols-3" aria-label="category-geo">
          <ErrorBoundary>
            <TreemapByCategory data={demoData.categories} onSelectCategory={handleFiltersChange} />
          </ErrorBoundary>
          <ErrorBoundary>
            <GeoBubbles data={demoData.geoPoints} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CategoryBreakdown data={demoData.categories} />
          </ErrorBoundary>
        </div>

        <ErrorBoundary>
          <DistributionBox data={demoData.distribution} />
        </ErrorBoundary>

        <ErrorBoundary>
          <RecentSignals items={demoData.signals} />
        </ErrorBoundary>

        <ErrorBoundary>
          <CrosshairBrush data={demoData.timeSeries} onChange={handleFiltersChange} />
        </ErrorBoundary>

        <Legends />
      </div>
    </FiltersContext.Provider>
  );
}
