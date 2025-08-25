/**
 * Skeleton loaders for dashboard sections.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardLoader() {
  return (
    <Card className="rounded-2xl border border-border shadow-lg">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

