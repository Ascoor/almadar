
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { cn } from './utils/cn';
import Loaders from './Loaders';
import ErrorBoundary from './ErrorBoundary';

// Lazy load components
const FiltersBar = lazy(() => import('./FiltersBar'));
const KPIGrid = lazy(() => import('./KPIGrid'));
const TimeSeriesMulti = lazy(() => import('./TimeSeriesMulti'));
const WorldChoropleth = lazy(() => import('./WorldChoropleth'));
const GeoBubbles = lazy(() => import('./GeoBubbles'));
const CategoryBreakdown = lazy(() => import('./CategoryBreakdown'));
const TreemapByCategory = lazy(() => import('./TreemapByCategory'));
const DistributionBox = lazy(() => import('./DistributionBox'));
const CrosshairBrush = lazy(() => import('./CrosshairBrush'));
const RecentSignals = lazy(() => import('./RecentSignals'));
const Legends = lazy(() => import('./Legends'));

/**
 * Main Global Dashboard Component
 * Orchestrates all chart widgets with responsive layout
 */
const GlobalDashboard = ({ className, dir = 'rtl' }) => {
  const { filters, setFilters } = useDashboardStore();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground p-4 space-y-6",
        className
      )}
      dir={dir}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-primary">
          {dir === 'rtl' ? 'لوحة التحليلات القانونية العالمية' : 'Global Legal Analytics Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {dir === 'rtl' 
            ? 'رؤى شاملة وتحليلات متقدمة للعمليات القانونية'
            : 'Comprehensive insights and advanced analytics for legal operations'
          }
        </p>
      </motion.div>

      {/* Filters Bar */}
      <ErrorBoundary>
        <Suspense fallback={<Loaders.FiltersBar />}>
          <FiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            dir={dir}
          />
        </Suspense>
      </ErrorBoundary>

      {/* KPI Grid */}
      <ErrorBoundary>
        <Suspense fallback={<Loaders.KPIGrid />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <KPIGrid dir={dir} />
          </motion.div>
        </Suspense>
      </ErrorBoundary>

      {/* Main Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Time Series Chart */}
        <ErrorBoundary>
          <Suspense fallback={<Loaders.Chart />}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {dir === 'rtl' ? 'الاتجاهات الزمنية' : 'Time Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeSeriesMulti dir={dir} />
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>

        {/* Treemap */}
        <ErrorBoundary>
          <Suspense fallback={<Loaders.Chart />}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {dir === 'rtl' ? 'التوزيع حسب الفئة' : 'Category Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TreemapByCategory dir={dir} />
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Geographic Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* World Map */}
        <ErrorBoundary>
          <Suspense fallback={<Loaders.Map />}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>
                    {dir === 'rtl' ? 'التوزيع الجغرافي' : 'Geographic Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <WorldChoropleth dir={dir} />
                  <GeoBubbles dir={dir} />
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>

        {/* Category Breakdown & Distribution */}
        <div className="space-y-6">
          <ErrorBoundary>
            <Suspense fallback={<Loaders.Chart />}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {dir === 'rtl' ? 'تحليل الفئات' : 'Category Analysis'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryBreakdown dir={dir} />
                  </CardContent>
                </Card>
              </motion.div>
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<Loaders.Chart />}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {dir === 'rtl' ? 'توزيع القيم' : 'Value Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DistributionBox dir={dir} />
                  </CardContent>
                </Card>
              </motion.div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brush Control */}
        <ErrorBoundary>
          <Suspense fallback={<Loaders.Chart />}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {dir === 'rtl' ? 'محدد النطاق الزمني' : 'Time Range Selector'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CrosshairBrush dir={dir} />
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>

        {/* Recent Signals */}
        <ErrorBoundary>
          <Suspense fallback={<Loaders.Signals />}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {dir === 'rtl' ? 'الإشعارات الحديثة' : 'Recent Signals'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSignals dir={dir} />
                </CardContent>
              </Card>
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Legends */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-16" />}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Legends dir={dir} />
          </motion.div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default GlobalDashboard;
