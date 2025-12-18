import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Clock, Headphones } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TrustSection = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const trustItems = [
    {
      icon: ShieldCheck,
      titleKey: "trust.security.title" as const,
      descKey: "trust.security.description" as const,
    },
    {
      icon: Clock,
      titleKey: "trust.uptime.title" as const,
      descKey: "trust.uptime.description" as const,
    },
    {
      icon: Headphones,
      titleKey: "trust.support.title" as const,
      descKey: "trust.support.description" as const,
    },
  ];

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
            {t("trust.badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t("trust.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("trust.subtitle")}
          </p>
        </motion.div>

        {/* Trust Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              className="glass-card-hover p-8 text-center"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.15,
              }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { scale: 1.02, transition: { duration: 0.2 } }
              }
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">
                {t(item.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;