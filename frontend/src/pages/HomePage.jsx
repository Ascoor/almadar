import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SmartButton from '@/components/ui/SmartButton';
import ProCard from '@/components/ui/ProCard';

export default function HomePage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -start-40 w-80 h-80 rounded-full bg-primary-200 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -end-40 w-96 h-96 rounded-full bg-accent blur-3xl opacity-30" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center space-y-6">
          <motion.h1 className="text-4xl md:text-6xl font-extrabold" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            المنصّة القانونية الذكية
          </motion.h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            إدارة عقود، استشارات، قضايا، وأرشفة—بتجربة احترافية وأداءٍ موثوق.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <SmartButton size="lg">ابدأ الآن</SmartButton>
            <SmartButton variant="outline" size="lg" onClick={() => setShowMore(!showMore)}>تعرّف أكثر</SmartButton>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          <ProCard title="العقود" subtitle="إدارة شاملة بمراحل واضحة">تفاصيل مختصرة…</ProCard>
          <ProCard title="الاستشارات" subtitle="إدارة الطلبات وسجل القرارات">تفاصيل مختصرة…</ProCard>
          <ProCard title="القضايا" subtitle="متابعة الدعاوى والمهام والمواعيد">تفاصيل مختصرة…</ProCard>
        </section>
      </main>
    </div>
  );
}
