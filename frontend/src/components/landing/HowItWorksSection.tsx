import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Workflow, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HowItWorksSection = () => {
  const { t, isRTL } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Database,
      number: "01",
      titleKey: "howItWorks.step1.title" as const,
      descKey: "howItWorks.step1.description" as const,
    },
    {
      icon: Workflow,
      number: "02",
      titleKey: "howItWorks.step2.title" as const,
      descKey: "howItWorks.step2.description" as const,
    },
    {
      icon: BarChart3,
      number: "03",
      titleKey: "howItWorks.step3.title" as const,
      descKey: "howItWorks.step3.description" as const,
    },
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/80 mb-4">
            {t("howItWorks.badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 relative ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.2,
              }}
            >
              <div className="glass-card-hover p-8 text-center h-full">
                {/* Step Number */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">
                  {t(step.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
