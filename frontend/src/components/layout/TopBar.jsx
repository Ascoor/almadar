import React from 'react';
import SmartButton from '@/components/ui/SmartButton';

export default function TopBar({ onToggleTheme, user }) {
  return (
    <div className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-paper-dark/60 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-600 text-white grid place-items-center shadow-soft">⚖️</div>
          <span className="font-bold">Al-Madar</span>
        </div>
        <div className="flex items-center gap-3">
          <SmartButton variant="ghost" onClick={onToggleTheme}>الوضع</SmartButton>
          <SmartButton variant="outline" size="sm">{user?.name ?? 'حسابي'}</SmartButton>
        </div>
      </div>
    </div>
  );
}
