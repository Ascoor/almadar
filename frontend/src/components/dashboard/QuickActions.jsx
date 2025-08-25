/**
 * QuickActions.jsx
 * Action buttons for common operations.
 * i18n keys: 'dashboard.quickActions', 'dashboard.newCase', 'dashboard.newContract',
 * 'dashboard.export', 'dashboard.bulkUpdate', 'dashboard.summarize'
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PlusCircle, FilePlus2, Download, RefreshCw, Sparkles } from 'lucide-react';

/**
 * @param {{ user: { permissions: string[] }, onAction?: (a:string)=>void }} props
 */
export default function QuickActions({ user, onAction }) {
  const { t } = useTranslation();
  const actions = [
    { key: 'new-case', label: t('dashboard.newCase'), icon: PlusCircle, perm: 'case:create' },
    { key: 'new-contract', label: t('dashboard.newContract'), icon: FilePlus2, perm: 'contract:create' },
    { key: 'export', label: t('dashboard.export'), icon: Download, perm: 'export' },
    { key: 'bulk', label: t('dashboard.bulkUpdate'), icon: RefreshCw, perm: 'bulk:update' },
    { key: 'ai', label: t('dashboard.summarize'), icon: Sparkles, perm: 'ai', disabled: true },
  ];
  return (
    <div className="flex flex-wrap gap-2" aria-label={t('dashboard.quickActions')}>
      {actions.map((a) => (
        <Button
          key={a.key}
          onClick={() => onAction?.(a.key)}
          disabled={a.disabled || !user.permissions.includes(a.perm)}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <a.icon className="h-4 w-4" /> {a.label}
        </Button>
      ))}
    </div>
  );
}
