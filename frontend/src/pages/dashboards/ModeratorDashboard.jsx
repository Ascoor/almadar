import { FileText, Gavel, Briefcase, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Can, CanAny } from '@/components/auth/Can';
import { permKey } from '@/auth/permissionCatalog';

const widgets = [
  {
    key: 'contracts',
    title: 'العقود الجارية',
    value: '18',
    icon: FileText,
    permission: permKey('view', 'contracts'),
  },
  {
    key: 'litigations',
    title: 'القضايا المفتوحة',
    value: '11',
    icon: Gavel,
    permission: permKey('view', 'litigations'),
  },
  {
    key: 'investigations',
    title: 'التحقيقات النشطة',
    value: '6',
    icon: Briefcase,
    permission: permKey('view', 'investigations'),
  },
  {
    key: 'advices',
    title: 'طلبات المشورة',
    value: '9',
    icon: BookOpen,
    permission: permKey('view', 'legal-advices'),
  },
];

const upcomingTasks = [
  { id: 1, title: 'تسليم تقرير تحقيق', due: 'الثلاثاء 10:00' },
  { id: 2, title: 'مراجعة عقد شراكة', due: 'الأربعاء 13:00' },
  { id: 3, title: 'جلسة استماع', due: 'الخميس 09:30' },
];

export default function ModeratorDashboard() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-fg">لوحة المشرف</h1>
        <p className="text-sm text-muted-foreground">
          متابعة القضايا، العقود، والتحقيقات تحت إشرافك.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {widgets.map((item) => (
          <Can key={item.key} permission={item.permission}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
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
                  <h2 className="text-lg font-semibold text-fg">قائمة المهام</h2>
                  <p className="text-sm text-muted-foreground">
                    مهامك القادمة خلال الأيام الثلاثة المقبلة.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  إدارة
                </Button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-fg">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.due}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      تفاصيل
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CanAny>

        <Card className="card-soft">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-fg">آخر التحديثات</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>✔ تمت الموافقة على مسودة عقد جديد.</p>
              <p>✔ تحديث حالة تحقيق رقم 2104.</p>
              <p>✔ إضافة جلسة جديدة للقضية 118.</p>
            </div>
            <Button className="w-full">عرض التنبيهات</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
