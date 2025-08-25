import { useState, useEffect, useCallback } from 'react';
import sample from './sample-dashboard.json';

/**
 * Minimal data manager for dashboard widgets.
 * In real app this would fetch from API and handle filters.
 */
export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
    regionIds: [],
    risk: [],
    types: []
  });

  useEffect(() => {
    // simulate async load
    try {
      setData(sample);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getKpis = useCallback(() => data?.kpis || [], [data]);
  const getDailyOpenedClosed = useCallback(() => data?.dailyCounts || [], [data]);
  const getStageBuckets = useCallback(() => data?.stageBuckets || [], [data]);
  const getRiskBuckets = useCallback(() => data?.riskBuckets || [], [data]);
  const getSessionsHeat = useCallback(() => data?.sessionsHeat || [], [data]);
  const getRegionMetrics = useCallback(() => data?.regionMetrics || [], [data]);
  const getRecent = useCallback(
    (limit = 10) => (data?.recentItems || []).slice(0, limit),
    [data]
  );

  return {
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
  };
}
