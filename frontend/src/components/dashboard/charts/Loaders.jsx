import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Basic loader skeleton for dashboard widgets */
export function CardLoader() {
  return (
    <Card className="p-4" aria-label="loader">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full" />
    </Card>
  );
}

export default { CardLoader };
