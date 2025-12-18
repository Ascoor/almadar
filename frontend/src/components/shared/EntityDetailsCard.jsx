import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EntityDetailsCard({
  title,
  subtitle,
  fields = [],
  attribution,
  assignment,
  extra,
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <dt className="text-xs uppercase text-muted-foreground tracking-wide">
                {field.label}
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {field.value ?? '—'}
              </dd>
            </div>
          ))}
        </dl>

        {attribution && (
          <div className="rounded-xl border border-dashed border-border p-3 space-y-2">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Attribution
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {attribution.created_by && (
                <Badge variant="secondary">
                  Created by: {attribution.created_by}
                </Badge>
              )}
              {attribution.updated_by && (
                <Badge variant="outline">
                  Updated by: {attribution.updated_by}
                </Badge>
              )}
            </div>
          </div>
        )}

        {assignment && (
          <div className="rounded-xl border border-dashed border-border p-3 space-y-2">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Assignment
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {assignment.assigned_to && (
                <Badge variant="secondary">
                  Assigned to: {assignment.assigned_to}
                </Badge>
              )}
              {assignment.assigned_by && (
                <Badge variant="outline">
                  Assigned by: {assignment.assigned_by}
                </Badge>
              )}
            </div>
          </div>
        )}

        {extra}
      </CardContent>
    </Card>
  );
}
