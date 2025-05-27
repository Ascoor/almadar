import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
    <motion.div
      key={listName}
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{
        duration: 1.2,       // زمن أطول للحركة
        delay: 0.3,          // تأخير بسيط قبل البداية
        type: 'spring',
        stiffness: 60,       // مرونة أقل لنزول أبطأ
        damping: 12
      }}
      className="
        flex flex-col items-center text-center space-y-4 
        p-4 sm:p-6 md:p-8 shadow-2xl transition-all
        bg-white bg-gradient-to-tr from-royal/10 via-gold/10 to-royal/10
        border border-greenic/20 rounded-full mb-6
        dark:bg-navy-dark/80
        dark:bg-gradient-to-br dark:from-royal-dark/10 dark:via-navy-dark/60 dark:to-navy-dark/10
        dark:text-foreground dark:ring-2 dark:ring-greenic/30 
        dark:shadow-greenic/30
      "
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain transition-transform duration-300 hover:scale-110"
        />
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-blue-900 dark:text-white">
        {listName}
      </h2>

      {showBackButton && (
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-1.5 
            bg-blue-100 text-blue-800 
            hover:bg-blue-200 hover:text-blue-900 
            dark:bg-navy-dark dark:text-muted-foreground 
            dark:hover:bg-accent dark:hover:text-white
            rounded-full shadow transition-all"
        >
          <ArrowLeft />
          <span className="text-sm sm:text-base">رجوع</span>
        </button>
      )}
    </motion.div>
  );
};

export default SectionHeader;
