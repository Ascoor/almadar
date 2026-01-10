import { ShieldCheck, Users, ChartNoAxesCombined, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Can, CanAny } from '@/components/auth/Can';
import { permKey } from '@/auth/permissionCatalog';

const kpis = [
  {
    key: 'users',
    label: 'إجمالي المستخدمين',
    value: '248',
    icon: Users,
    permission: permKey('view', 'users'),
  },
  {
    key: 'roles',
    label: 'الأدوار الفعالة',
    value: '12',
    icon: ShieldCheck,
    permission: permKey('view', 'roles'),
  },
  {
    key: 'alerts',
    label: 'تنبيهات النظام',
    value: '7',
    icon: Bell,
    permission: permKey('view', 'permissions'),
  },
  {
    key: 'health',
    label: 'حالة المنظومة',
    value: '97%',
    icon: ChartNoAxesCombined,
    permission: permKey('view', 'dashboard'),
  },
];

const recentActivities = [
  { id: 1, title: 'تمت إضافة مستخدم جديد', time: 'قبل 10 دقائق' },
  { id: 2, title: 'تحديث صلاحيات عقد جديد', time: 'قبل ساعتين' },
  { id: 3, title: 'مراجعة تحقيق جديدة', time: 'قبل يوم' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-fg">لوحة الإدارة</h1>
        <p className="text-sm text-muted-foreground">
          نظرة شاملة على الأدوار، الصلاحيات، وصحة المنظومة.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Can key={item.key} permission={item.permission}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-fg">{item.value}</p>
                  </div>
                  <span className="rounded-xl bg-primary/10 p-2 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Can>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <CanAny
          permissions={[
            permKey('view', 'contracts'),
            permKey('view', 'investigations'),
            permKey('view', 'litigations'),
            permKey('view', 'legal-advices'),
          ]}
        >
          <Card className="card-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-fg">
                    لوحة الأداء اليومي
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    مؤشرات سريعة لسير الأعمال القانونية.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  تصدير
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">جلسات اليوم</p>
                  <p className="text-xl font-semibold text-fg">14</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">مستندات جديدة</p>
                  <p className="text-xl font-semibold text-fg">32</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">طلبات مراجعة</p>
                  <p className="text-xl font-semibold text-fg">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CanAny>

        <Card className="card-soft">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-fg">النشاط الأخير</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    عرض
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
