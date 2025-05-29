  import React from 'react';
  import DashboardStats from './DashboardStats';
  import RecentItems from './RecentItems';
  import { motion } from 'framer-motion'; 

  const titleVariants = {
    hidden: { opacity: 0, y: -40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
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
    return (<
      div className="relative">  
      <motion.h2
      className="text-xl sm:text-2xl text-center font-bold mb-2 text-royal-dark dark:text-gold"
      variants={titleVariants}
      initial="hidden"
      animate="show"
      >
      لوحة التحكم
      </motion.h2>

 
        <motion.div
          className="mb-4"
          custom={0.2}
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          <DashboardStats />
        </motion.div>

        <motion.div
          custom={0.5}
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          <RecentItems />
        </motion.div>
      </div> 
    );
  };

  export default Dashboard;
