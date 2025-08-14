import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Shield, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات النظام والتفضيلات</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>تخصيص تفضيلات الإشعارات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">إشعارات البريد الإلكتروني</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">الإشعارات الفورية</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications">الإشعارات الصوتية</Label>
              <Switch id="sound-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              إعدادات العرض
            </CardTitle>
            <CardDescription>تخصيص واجهة المستخدم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">المظهر</Label>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">فاتح</Button>
                <Button variant="outline" size="sm">داكن</Button>
                <Button variant="default" size="sm">تلقائي</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <div className="flex gap-3">
                <Button variant="default" size="sm">العربية</Button>
                <Button variant="outline" size="sm">English</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}