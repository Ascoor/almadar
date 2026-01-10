import { CalendarClock, FileText, BookOpenCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Can } from '@/components/auth/Can';
import { permKey } from '@/auth/permissionCatalog';

const quickLinks = [
  {
    key: 'contracts',
    label: 'العقود',
    description: 'استعراض العقود المخصصة لك',
    permission: permKey('view', 'contracts'),
    icon: FileText,
    href: '/contracts',
  },
  {
    key: 'legal-advices',
    label: 'المشورة القانونية',
    description: 'متابعة طلبات المشورة الخاصة بك',
    permission: permKey('view', 'legal-advices'),
    icon: BookOpenCheck,
    href: '/legal/legal-advices',
  },
  {
    key: 'archive',
    label: 'الأرشيف',
    description: 'الوصول إلى المستندات المؤرشفة',
    permission: permKey('view', 'archives'),
    icon: CalendarClock,
    href: '/archive',
  },
];

const reminders = [
  { id: 1, title: 'توقيع عقد توريد', date: 'بعد يومين' },
  { id: 2, title: 'رفع مستند للقضية 221', date: 'بعد 3 أيام' },
  { id: 3, title: 'اجتماع متابعة', date: 'الأسبوع القادم' },
];

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-fg">لوحة المستخدم</h1>
        <p className="text-sm text-muted-foreground">
          ملخص مهامك القانونية وروابط الوصول السريع.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Can key={link.key} permission={link.permission}>
            <Card className="glass-card">
              <CardContent className="p-5 space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <link.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{link.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={link.href}>الانتقال</Link>
                </Button>
              </CardContent>
            </Card>
          </Can>
        ))}
      </section>

      <Card className="card-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-fg">التذكيرات</h2>
              <p className="text-sm text-muted-foreground">
                لا تفوت المواعيد المهمة القادمة.
              </p>
            </div>
            <Button variant="outline" size="sm">
              عرض الكل
            </Button>
          </div>
          <div className="space-y-3">
            {reminders.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <p className="text-sm font-medium text-fg">{item.title}</p>
                <span className="text-xs text-muted-foreground">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
