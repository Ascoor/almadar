import { useSpinnerContext } from '@/contexts/SpinnerContext';
import { Loader2 } from 'lucide-react';

export default function GlobalSpinner() {
  const { isLoading } = useSpinnerContext();

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="جارٍ التحميل"
    >
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
      </div>
    </div>
  );
}