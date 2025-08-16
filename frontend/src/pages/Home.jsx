import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FileText, Scale, Shield, Users } from 'lucide-react';

const features = [
  { icon: FileText, title: 'إدارة العقود', desc: 'إدارة شاملة للعقود مع تتبع المراحل والمواعيد.' },
  { icon: Scale, title: 'الاستشارات القانونية', desc: 'تنظيم وإدارة الاستشارات بقاعدة بيانات ذكية.' },
  { icon: Shield, title: 'التحقيقات والقضايا', desc: 'متابعة القضايا والتحقيقات بأدوات دقيقة.' },
  { icon: Users, title: 'إدارة المستخدمين', desc: 'أدوار وصلاحيات مرنة بواجهة بسيطة.' },
];

export default function Home() {
  return (
    <main>
      <section className="relative pt-20 pb-24">
        <div className="container grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              منصة <span className="bg-clip-text text-transparent bg-gradient-brand">المــدار</span>
              <br />
              <span className="text-2xl text-muted">إدارة قانونية ذكية باحترافية عالية</span>
            </h1>
            <p className="mt-6 text-lg text-muted">
              واجهة حديثة، أمان عالي، سير عمل واضح. كل ما تحتاجه لإدارة العقود، القضايا، والمستخدمين.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>ابدأ الآن</Button>
              <Button variant="outline">جرّب العرض</Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
                    <f.icon className="w-6 h-6 text-primaryFg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted mt-1">{f.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
