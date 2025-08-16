import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import AppLayout from '@/components/layout/AppLayout';
import SectionHeader from '@/components/common/SectionHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';

import { Settings, Palette, Bell, Shield, Database } from 'lucide-react';

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader
          title={t('navigation.settings')}
          subtitle="إدارة إعدادات النظام والتفضيلات"
          icon={Settings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Palette className="h-5 w-5" />
                  <span>المظهر والشكل</span>
                </CardTitle>
                <CardDescription>تخصيص مظهر التطبيق والسمة المرئية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="theme-toggle">السمة المرئية</Label>
                    <p className="text-sm text-muted-foreground">اختر السمة المفضلة لديك</p>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="language-toggle">اللغة</Label>
                    <p className="text-sm text-muted-foreground">تغيير لغة واجهة التطبيق</p>
                  </div>
                  <LanguageToggle />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Bell className="h-5 w-5" />
                  <span>الإشعارات</span>
                </CardTitle>
                <CardDescription>إدارة تفضيلات الإشعارات والتنبيهات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch id="email-notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">الإشعارات الفورية</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات فورية في المتصفح</p>
                  </div>
                  <Switch id="push-notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sound-notifications">أصوات التنبيه</Label>
                    <p className="text-sm text-muted-foreground">تشغيل أصوات عند وصول إشعارات جديدة</p>
                  </div>
                  <Switch id="sound-notifications" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Shield className="h-5 w-5" />
                  <span>الأمان والخصوصية</span>
                </CardTitle>
                <CardDescription>إعدادات الأمان وحماية البيانات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="two-factor">المصادقة الثنائية</Label>
                    <p className="text-sm text-muted-foreground">تأمين إضافي لحسابك</p>
                  </div>
                  <Switch id="two-factor" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="session-timeout">انتهاء الجلسة التلقائي</Label>
                    <p className="text-sm text-muted-foreground">
                      تسجيل الخروج التلقائي بعد فترة عدم نشاط
                    </p>
                  </div>
                  <Switch id="session-timeout" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Database className="h-5 w-5" />
                  <span>إعدادات النظام</span>
                </CardTitle>
                <CardDescription>إعدادات عامة للنظام والأداء</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save">الحفظ التلقائي</Label>
                    <p className="text-sm text-muted-foreground">حفظ التغييرات تلقائياً</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="analytics">إحصائيات الاستخدام</Label>
                    <p className="text-sm text-muted-foreground">مساعدتنا في تحسين التطبيق</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;
