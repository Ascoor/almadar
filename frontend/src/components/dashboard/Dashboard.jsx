import React, { Suspense, lazy } from 'react';
 import { motion } from 'framer-motion';
 import { Separator } from '@/components/ui/separator'; // استيراد مكون Separator
 
 const DashboardStats = lazy(() => import('./DashboardStats'));
 const RecentItems = lazy(() => import('./RecentItems'));

// Variants للتحكم في الرسوم المتحركة للعناوين
const titleVariants = {
  hidden: { opacity: 0, y: -40 },  // الحالة المخفية
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: 'easeOut' 
    }
  }
};

// Variants للتحكم في الرسوم المتحركة للأقسام
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },  // الحالة المخفية
  show: (delay = 0) => ({
    opacity: 1, 
    y: 0, 
    transition: { 
      delay,
      type: 'spring', 
      stiffness: 80, 
      damping: 14 
    }
  })
};

const Dashboard = () => {
  return (
    <>
      {/* عرض العنوان بشكل متحرك */}
      <motion.h2
        className="text-xl sm:text-2xl text-center font-bold mb-2 text-royal-dark dark:text-gold"
        variants={titleVariants}
        initial="hidden"
        animate="show"
      >
        لوحة التحكم
      </motion.h2>

      {/* عرض الإحصائيات */}
      <motion.div
        className="mb-4"
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <DashboardStats />
      </motion.div>

      {/* فاصل بين الإحصائيات والعناصر التالية */}
      <Separator className="my-4" orientation="horizontal" />

      {/* عرض العناصر التالية (مثل RecentItems) */}
      <motion.div
        custom={0.5}
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
     <Suspense fallback={<div className="text-center text-sm">تحميل العناصر الحديثة...</div>}>
          <RecentItems />
        </Suspense>
      </motion.div>
    </>
  );
};

export default Dashboard;
