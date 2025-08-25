import { useState, useEffect, useCallback } from 'react';
import sample from './sample-dashboard.json';

/**
 * Simple data manager for the dashboard widgets.
 * Loads mock data and exposes memoized selectors.
 */
export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
    regionIds: [],
    risk: [],
    types: [],
    contractKind: ['international', 'domestic']
  });

  useEffect(() => {
    try {
      setData(sample);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // restore filters from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setFilters(f => ({
      ...f,
      dateRange: params.get('date') || null,
      regionIds: params.get('regions')?.split(',') || [],
      risk: params.get('risk')?.split(',') || [],
      types: params.get('types')?.split(',') || [],
      contractKind: params.get('contracts')?.split(',') || ['international', 'domestic']
    }));
  }, []);

  // persist filters in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (filters.dateRange) params.set('date', filters.dateRange);
    if (filters.regionIds.length) params.set('regions', filters.regionIds.join(','));
    if (filters.risk.length) params.set('risk', filters.risk.join(','));
    if (filters.types.length) params.set('types', filters.types.join(','));
    if (filters.contractKind.length) params.set('contracts', filters.contractKind.join(','));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  const getKpis = useCallback(() => data?.kpis || [], [data]);
  const getMonthlyForAgainst = useCallback(() => data?.monthlyCases || [], [data]);
  const getProcedures = useCallback(() => data?.procedureProgress || [], [data]);
  const getSessionsHeat = useCallback(() => data?.sessionsHeat || [], [data]);
  const getContractsVolume = useCallback(() => data?.contractsVolume || [], [data]);
  const getPublicationsPlan = useCallback(() => data?.publicationsPlan || [], [data]);
  const getRegionMetrics = useCallback(() => data?.regionMetrics || [], [data]);
  const getStageBuckets = useCallback(() => data?.stageBuckets || [], [data]);
  const getRiskBuckets = useCallback(() => data?.riskBuckets || [], [data]);
  const getRecent = useCallback((n = 10) => (data?.recentItems || []).slice(0, n), [data]);

  return {
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
  };
}
