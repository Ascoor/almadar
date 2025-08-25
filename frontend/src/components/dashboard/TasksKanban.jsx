/**
 * TasksKanban.jsx
 * Compact Kanban board.
 * i18n keys: 'dashboard.tasks', 'dashboard.todo', 'dashboard.inProgress', 'dashboard.waiting', 'dashboard.done'
 */

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @typedef {{ id: string, title: string, assignee?: string }} Task
 * @typedef {{ todo: Task[], doing: Task[], waiting: Task[], done: Task[] }} KanbanData
 */

/**
 * @param {{ data: KanbanData }} props
 */
export default function TasksKanban({ data }) {
  const { t } = useTranslation();
  const columns = [
    { key: 'todo', label: t('dashboard.todo') },
    { key: 'doing', label: t('dashboard.inProgress') },
    { key: 'waiting', label: t('dashboard.waiting') },
    { key: 'done', label: t('dashboard.done') },
  ];
  return (
    <Card className="bg-card shadow-lg border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading tracking-tight text-lg">{t('dashboard.tasks')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        {columns.map((col) => (
          <div key={col.key} className="space-y-2">
            <div className="font-medium">{col.label}</div>
            {data[col.key].map((task) => (
              <div key={task.id} className={cn('p-2 rounded bg-muted/20')}>{task.title}</div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { type Task, type KanbanData };
