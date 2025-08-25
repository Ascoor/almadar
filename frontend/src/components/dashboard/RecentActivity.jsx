/**
 * RecentActivity.jsx
 * Timeline feed with icons & relative time.
 * i18n keys: 'dashboard.recentActivity'
 */

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Gavel, MessageSquare, CheckSquare } from 'lucide-react';

/**
 * @typedef {{ id: string, ts: string, type: 'hearing'|'filing'|'note'|'task', title: string, meta?: string }} ActivityItem
 */

const typeIcon = {
  hearing: Gavel,
  filing: FileText,
  note: MessageSquare,
  task: CheckSquare,
};

/**
 * @param {{ items: ActivityItem[] }} props
 */
export default function RecentActivity({ items }) {
  const { t } = useTranslation();
  return (
    <Card className="bg-card shadow-lg border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading tracking-tight text-lg">{t('dashboard.recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((a) => {
            const Icon = typeIcon[a.type];
            return (
              <li key={a.id} className="flex items-start gap-3">
                <Icon className="h-4 w-4 mt-1 text-muted" />
                <div>
                  <div className="font-medium">{a.title}</div>
                  <time className="text-sm text-muted" dateTime={a.ts}>
                    {new Date(a.ts).toLocaleString()}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export { type ActivityItem };
