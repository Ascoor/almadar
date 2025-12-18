import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileSignature,
  Search,
  Scale,
  Archive,
  Bell,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FeaturesSection = () => {
  const { t, isRTL } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: FileSignature,
      titleKey: "features.contracts.title" as const,
      descKey: "features.contracts.description" as const,
      color: "text-primary",
    },
    {
      icon: Search,
      titleKey: "features.investigations.title" as const,
      descKey: "features.investigations.description" as const,
      color: "text-accent",
    },
    {
      icon: Scale,
      titleKey: "features.litigation.title" as const,
      descKey: "features.litigation.description" as const,
      color: "text-primary",
    },
    {
      icon: Archive,
      titleKey: "features.archives.title" as const,
      descKey: "features.archives.description" as const,
      color: "text-accent",
    },
    {
      icon: Bell,
      titleKey: "features.notifications.title" as const,
      descKey: "features.notifications.description" as const,
      color: "text-primary",
    },
    {
      icon: Users,
      titleKey: "features.assignments.title" as const,
      descKey: "features.assignments.description" as const,
      color: "text-accent",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section ref={ref} className="py-24 section-gradient relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/80 mb-4">
            {t("features.badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -5, transition: { duration: 0.2 } }
              }
              className="glass-card-hover p-6 group"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-card flex items-center justify-center mb-5 transition-all duration-300 group-hover:glow-primary ${feature.color}`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
