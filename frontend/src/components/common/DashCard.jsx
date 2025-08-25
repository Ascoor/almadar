import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  WalletCards,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  MapPinned,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconFor = (label) => {
  switch (label) {
    case 'دولي':
      return <Globe className="w-5 h-5 ml-2 text-accent" />;
    case 'محلي':
      return <MapPinned className="w-5 h-5 ml-2 text-primary" />;
    case 'تحقيقات':
      return <FileText className="w-5 h-5 ml-2 text-accent" />;
    case 'مشورة':
      return <WalletCards className="w-5 h-5 ml-2 text-primary" />;
    case 'من الشركة':
      return <ArrowRightFromLine className="w-5 h-5 ml-2 text-accent" />;
    case 'ضد الشركة':
      return <ArrowLeftFromLine className="w-5 h-5 ml-2 text-primary" />;
    default:
      return (
        <ArrowLeftFromLine className="w-5 h-5 ml-2 text-muted-foreground" />
      );
  }
};

const DashCard = ({
  title,
  count,
  subcategories = [],
  imageSrc,
  delay = 0,
}) => {
  return (
    <motion.div
      className="flex items-center mb-6 w-full max-w-xs p-4 rounded-xl shadow-lg bg-gradient-secondary transition-transform transform hover:scale-105 mx-auto"
      initial={{ opacity: 0, scale: 0.8 }} // بداية من حجم صغير وشفافية منخفضة
      animate={{ opacity: 1, scale: 1 }} // التغيير إلى حجم طبيعي وشفافية 1
      transition={{ delay: delay, duration: 0.5 }}
    >
      <div className="w-24 h-24 mr-4 rounded-full overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col w-full">
        <h2 className="text-center text-lg font-bold text-fg">
          {title}
        </h2>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          إجمالي {count}
        </p>

        <div className="mt-4 space-y-2">
          {subcategories.map(
            ({ title: subTitle, count: subCount, to }, index) => (
              <motion.div
                key={subTitle}
                initial={{ opacity: 0, x: 100 }} // تبدأ الحركة من اليمين
                animate={{ opacity: 1, x: 0 }} // تنتقل إلى الموقع الطبيعي
                transition={{ delay: delay + index * 0.2, duration: 0.5 }} // التأخير المتسلسل بين الكروت
              >
                <Link
                  to={to}
                  className="flex items-center justify-between px-3 py-2 rounded transition-all hover:bg-secondary/10"
                >
                  {iconFor(subTitle)}
                  <span className="ml-2 text-sm font-medium text-fg">
                    {subTitle}
                  </span>
                  <span className="ml-auto text-sm font-bold text-fg">
                    {subCount}
                  </span>
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashCard;
