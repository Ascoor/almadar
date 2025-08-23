import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DashboardCard = ({
  title,
  count,
  icon,
  color = 'from-primary/80 to-primary',
  accent = 'text-primary',
}) => {
  return (
    <Card className="group relative overflow-hidden shadow-lg">
      {/* خلفية خلف الأيقونة على شكل دوامة */}
      <div
        className={`absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full blur-3xl opacity-20 bg-gradient-to-tr ${color}`}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-lg md:text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${color} text-primary-foreground shadow-inner`}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <div className={cn('text-3xl font-extrabold', accent)}>{count}</div>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          إجمالي البيانات
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
