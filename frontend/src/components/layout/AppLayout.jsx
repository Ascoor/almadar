import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyMotion, domAnimation } from 'framer-motion';
import Header from '@/components/layout/Header';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardSkeleton = () => (
  <div className="space-y-6 lg:space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);

export default function AppLayout() {
  const { user } = useAuth();
  const { dir } = useLanguage();

  return (
    <LazyMotion features={domAnimation}>
      <SidebarProvider
        className={dir === 'rtl' ? 'flex-row-reverse' : ''}
        style={{ '--app-header-height': '4rem' }}
      >
        <ResponsiveLayout className="min-h-svh w-full min-w-0 overflow-x-hidden bg-bg">
          <AppSidebar />
          <SidebarInset className="min-w-0 flex-1">
            <Header user={user} />
            <main className="flex-1 min-w-0 bg-bg pb-8">
              <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-6">
                <Suspense fallback={<DashboardSkeleton />}>
                  <Outlet />
                </Suspense>
              </div>
            </main>
          </SidebarInset>
        </ResponsiveLayout>
      </SidebarProvider>
    </LazyMotion>
  );
}
