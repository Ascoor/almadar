import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/context/NetworkStatusContext';
import { cn } from '@/lib/utils';

function formatTimestamp(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function NetworkStatusBanner({ className }) {
  const { isOffline, lastChanged, offlineMessage } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-3 z-[80] px-3 sm:px-6 flex justify-center pointer-events-none',
        className,
      )}
    >
      <div className="max-w-5xl w-full">
        <div className="pointer-events-none rounded-2xl border border-amber-300 bg-amber-50/95 text-amber-900 shadow-lg shadow-amber-100/60 backdrop-blur">
          <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-200 p-2 text-amber-900">
                <WifiOff className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-tight">وضع عدم الاتصال</p>
                <p className="text-xs leading-relaxed text-amber-800">
                  {offlineMessage}{' '}
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Wifi className="h-3.5 w-3.5" aria-hidden />
                    سنحاول استئناف التزامن بمجرد عودة الشبكة.
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-amber-800">
              <span className="hidden sm:inline">آخر تحديث للحالة:</span>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-inner shadow-amber-200">
                {formatTimestamp(lastChanged)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
