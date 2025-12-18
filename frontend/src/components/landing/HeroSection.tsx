import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Scale, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {heroBackground} from "@/assets/images";

interface HeroSectionProps {
  onSignInClick: () => void;
}

const HeroSection = ({ onSignInClick }: HeroSectionProps) => {
  const { t, isRTL } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const floatingIcons = [
    { Icon: Scale, delay: 0, x: -200, y: -100 },
    { Icon: FileText, delay: 2, x: 180, y: -80 },
    { Icon: Shield, delay: 4, x: -150, y: 120 },
  ];

  const stats = [
    { value: "50K+", label: t("hero.stats.contracts") },
    { value: "10K+", label: t("hero.stats.users") },
    { value: "40%", label: t("hero.stats.efficiency") },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Legal technology background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern z-[1] opacity-30" />

      {/* Floating Icons - Only show if reduced motion is not preferred */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 z-[2] pointer-events-none hidden lg:block">
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1, 0.8],
                x: [x, x + 20, x],
                y: [y, y - 15, y],
              }}
              transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="glass-card p-4 rounded-xl">
                <Icon className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/80">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-shadow"
          >
            {t("hero.title")}
            <br />
            <span className="gradient-text">{t("hero.titleHighlight")}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <Button
              size="lg"
              onClick={onSignInClick}
              className="group relative overflow-hidden px-8 py-6 text-lg font-semibold glow-primary"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta.primary")}
                <ArrowRight
                  className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                    isRTL ? "rotate-180 group-hover:-translate-x-1" : ""
                  }`}
                />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg font-medium border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50"
            >
              <Play className="w-5 h-5 mr-2" />
              {t("hero.cta.secondary")}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              >
                <div className="stat-value gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default HeroSection;
