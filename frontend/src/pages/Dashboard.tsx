import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  Search,
  Gavel,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SectionHeader from '@/components/common/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface Task {
  id: number;
  title: string;
  deadline: string;
  priority: 'urgent' | 'high' | 'medium' | string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  const stats: Stat[] = [
    {
      title: t('dashboard.totalContracts'),
      value: '1,247',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('dashboard.legalAdviceRequests'),
      value: '856',
      change: '+8%',
      icon: Scale,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('dashboard.pendingInvestigations'),
      value: '24',
      change: '-3%',
      icon: Search,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: t('dashboard.activeCases'),
      value: '18',
      change: '+5%',
      icon: Gavel,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const recentActivities: Activity[] = [
    {
      id: 1,
      type: 'contract',
      title: 'تم إنشاء عقد جديد - شركة النور للتطوير',
      time: 'منذ ساعتين',
      status: 'success',
    },
    {
      id: 2,
      type: 'litigation',
      title: 'تحديث في القضية رقم 2024/123',
      time: 'منذ 4 ساعات',
      status: 'warning',
    },
    {
      id: 3,
      type: 'advice',
      title: 'طلب استشارة جديد من العميل أحمد محمد',
      time: 'منذ 6 ساعات',
      status: 'info',
    },
    {
      id: 4,
      type: 'investigation',
      title: 'انتهاء التحقيق في قضية التزوير',
      time: 'أمس',
      status: 'success',
    },
  ];

  const upcomingTasks: Task[] = [
    {
      id: 1,
      title: 'مراجعة عقد شركة المستقبل',
      deadline: '2024-12-20',
      priority: 'high',
    },
    {
      id: 2,
      title: 'جلسة محكمة - القضية 2024/089',
      deadline: '2024-12-22',
      priority: 'urgent',
    },
    {
      id: 3,
      title: 'تسليم التقرير القانوني النهائي',
      deadline: '2024-12-25',
      priority: 'medium',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return t('dashboard.priority.urgent');
      case 'high': return t('dashboard.priority.high');
      case 'medium': return t('dashboard.priority.medium');
      default: return t('dashboard.priority.normal');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
          <SectionHeader
            title={t('dashboard.welcomeUser', { name: user?.name })}
            subtitle={t('dashboard.subtitle')}
            icon={BarChart3}
          />

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <h3 className="text-2xl font-bold text-card-foreground">
                          {stat.value}
                        </h3>
                        <Badge
                          variant={stat.change.startsWith('+') ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{t('dashboard.recentActivities')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''} p-3 rounded-lg hover:bg-accent/50 transition-colors`}
                  >
                    <div className="flex-shrink-0">
                      {activity.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      {activity.status === 'warning' && (
                        <AlertCircle className="w-5 h-5 text-warning" />
                      )}
                      {activity.status === 'info' && (
                        <TrendingUp className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    {t('dashboard.viewAllActivities')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{t('dashboard.upcomingTasks')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-card-foreground">
                        {task.title}
                      </h4>
                      <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.deadline')}: {task.deadline}
                    </p>
                  </motion.div>
                ))}
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('dashboard.viewAllTasks')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="professional-card">
            <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <FileText className="w-6 h-6" />
                      <span className="text-sm">{t('dashboard.newContract')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <Scale className="w-6 h-6" />
                      <span className="text-sm">{t('dashboard.newAdvice')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <Search className="w-6 h-6" />
                      <span className="text-sm">{t('dashboard.newInvestigation')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                      <Gavel className="w-6 h-6" />
                      <span className="text-sm">{t('dashboard.newCase')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
