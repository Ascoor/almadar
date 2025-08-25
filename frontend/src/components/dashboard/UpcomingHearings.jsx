/**
 * UpcomingHearings.jsx
 * List of upcoming hearings.
 * i18n keys: 'dashboard.upcomingHearings'
 */

import { useTranslation } from 'react-i18next';
import { CalendarDays, Landmark } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * @typedef {{ id: string, date: string, court: string, room?: string, caseNo: string, client: string }} Hearing
 */

/**
 * @param {{ items: Hearing[] }} props
 */
export default function UpcomingHearings({ items }) {
  const { t } = useTranslation();
  return (
    <Card className="bg-card shadow-lg border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading tracking-tight text-lg">
          {t('dashboard.upcomingHearings')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((h) => (
            <li key={h.id} className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(h.date).toLocaleDateString()}
              </Badge>
              <div className="flex-1">
                <div className="font-medium">{h.caseNo}</div>
                <div className="text-sm text-muted">
                  {h.client} – {h.court} {h.room}
                </div>
              </div>
              <Landmark className="h-4 w-4 text-muted" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { type Hearing };
