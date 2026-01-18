import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock3,
  Globe2,
  Gavel,
  Linkedin,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
  Twitter,
  Users,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import BrandLogo from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { blurIn, fadeIn, reveal } from "@/components/landing/landing-motion";
import { useCountUp } from "@/components/landing/useCountUp";
import { cn } from "@/lib/utils";

const LandingContent = () => {
  const { language, direction, toggleLanguage } = useLanguage();
  const isRTL = direction === "rtl";
  const prefersReducedMotion = useReducedMotion();
  const [openService, setOpenService] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const t = useMemo(
    () => ({
      navCTA: {
        en: "Book a Consultation",
        ar: "احجز استشارة",
      },
      heroHeadline: {
        en: "Legal Digital Transformation",
        ar: "التحول الرقمي القانوني",
      },
      heroSub: {
        en: "AVOCAT empowers elite law firms and in-house teams with a secure, intelligent platform that accelerates decisions and elevates client trust.",
        ar: "تمنح أفوكات مكاتب المحاماة والفرق القانونية منصة ذكية وآمنة تُسرّع القرارات وتعزّز ثقة العملاء.",
      },
      ctaPrimary: {
        en: "Book a Consultation",
        ar: "احجز استشارة",
      },
      ctaSecondary: {
        en: "View Services",
        ar: "استعرض الخدمات",
      },
    }),
    []
  );

  const trustBadges = [
    {
      en: "ISO-aligned compliance",
      ar: "امتثال متوافق مع معايير ISO",
    },
    {
      en: "Bank-grade encryption",
      ar: "تشفير بمستوى البنوك",
    },
    {
      en: "24/7 legal ops",
      ar: "عمليات قانونية على مدار الساعة",
    },
    {
      en: "Cross-border expertise",
      ar: "خبرة عابرة للحدود",
    },
  ];

  const stats = [
    { labelEn: "Cases digitized", labelAr: "قضية رقمية", value: 2800 },
    { labelEn: "Client NPS", labelAr: "مؤشر الرضا", value: 96 },
    { labelEn: "Avg. response time", labelAr: "سرعة الاستجابة", value: 18 },
  ];

  const aboutCards = [
    {
      titleEn: "Strategic Counsel",
      titleAr: "استشارة استراتيجية",
      descEn: "Hybrid expertise that blends legal tradition with emerging legal-tech workflows.",
      descAr: "خبرة هجينة تمزج بين عمق الممارسة القانونية وأحدث تقنيات إدارة القضايا.",
      icon: ShieldCheck,
    },
    {
      titleEn: "Client Trust",
      titleAr: "ثقة العملاء",
      descEn: "Transparent reporting and predictive insights that strengthen relationships.",
      descAr: "تقارير شفافة ورؤى استباقية تعزّز علاقة العميل بالمكتب.",
      icon: BadgeCheck,
    },
    {
      titleEn: "Smart Operations",
      titleAr: "تشغيل ذكي",
      descEn: "Automated playbooks reduce risk and shorten response cycles.",
      descAr: "إجراءات مؤتمتة تقلل المخاطر وتختصر دورة الاستجابة.",
      icon: Sparkles,
    },
  ];

  const services = [
    {
      titleEn: "Digital Case Rooms",
      titleAr: "غرف قضايا رقمية",
      descEn: "Centralize evidence, timelines, and strategy notes with role-based access.",
      descAr: "تجميع الأدلة والجداول الزمنية ومذكرات الاستراتيجية مع صلاحيات دقيقة.",
      icon: BookOpen,
      detailsEn:
        "Secure case rooms unify documents, tasks, and approvals while preserving audit trails for regulators.",
      detailsAr:
        "غرف القضايا الآمنة توحّد المستندات والمهام والموافقات مع سجل تدقيق متكامل.",
    },
    {
      titleEn: "Regulatory Intelligence",
      titleAr: "ذكاء الامتثال",
      descEn: "Monitor policy shifts across jurisdictions with automated alerts.",
      descAr: "متابعة تغيّرات السياسات عبر الولايات مع تنبيهات تلقائية.",
      icon: Globe2,
      detailsEn:
        "Our regulatory radar maps new obligations, assigns owners, and surfaces impact analysis instantly.",
      detailsAr:
        "منصة الرصد التنظيمي تربط الالتزامات الجديدة بالمسؤولين وتعرض أثرها فورًا.",
    },
    {
      titleEn: "Litigation Strategy",
      titleAr: "استراتيجية التقاضي",
      descEn: "AI-assisted brief analysis and outcome modeling for high-stakes matters.",
      descAr: "تحليل المذكرات ونمذجة النتائج باستخدام الذكاء الاصطناعي.",
      icon: Gavel,
      detailsEn:
        "Scenario modeling helps teams prioritize arguments, estimate exposure, and align with business goals.",
      detailsAr:
        "نمذجة السيناريوهات تساعد الفرق على ترتيب الحجج وتقدير المخاطر وربطها بالأهداف.",
    },
    {
      titleEn: "Corporate Governance",
      titleAr: "حوكمة الشركات",
      descEn: "Board-ready dashboards for compliance, reporting, and approvals.",
      descAr: "لوحات إدارة جاهزة للمجالس مع الامتثال والتقارير والموافقات.",
      icon: Briefcase,
      detailsEn:
        "Automated board packs summarize risk posture, policy gaps, and executive actions.",
      detailsAr:
        "تقارير مجلس الإدارة تلخص حالة المخاطر والفجوات والسياسات والإجراءات التنفيذية.",
    },
    {
      titleEn: "Contract Lifecycle",
      titleAr: "دورة حياة العقود",
      descEn: "Intelligent drafting, negotiation insights, and renewal orchestration.",
      descAr: "صياغة ذكية ورؤى تفاوضية وإدارة تجديدات العقود.",
      icon: Scale,
      detailsEn:
        "Clause intelligence accelerates negotiation while preserving the firm’s legal playbook.",
      detailsAr:
        "ذكاء البنود يسرّع التفاوض ويحافظ على دليل السياسات القانونية.",
    },
    {
      titleEn: "Executive Counsel",
      titleAr: "استشارات تنفيذية",
      descEn: "Dedicated advisors for crises, M&A, and reputational defense.",
      descAr: "مستشارون متخصصون للأزمات والاندماجات وحماية السمعة.",
      icon: Users,
      detailsEn:
        "On-call advisors align legal strategy with communications, finance, and stakeholder management.",
      detailsAr:
        "مستشارون متاحون باستمرار ينسّقون الاستراتيجية القانونية مع الاتصالات والمالية.",
    },
  ];

  const timeline = [
    {
      year: "2017",
      en: "Founded with a vision for legal transformation in MENA.",
      ar: "انطلقت برؤية لتحديث القطاع القانوني في الشرق الأوسط وشمال أفريقيا.",
    },
    {
      year: "2019",
      en: "Launched first AI-assisted litigation suite.",
      ar: "إطلاق أول حزمة تقاضي مدعومة بالذكاء الاصطناعي.",
    },
    {
      year: "2022",
      en: "Scaled to 120+ enterprise clients across 6 countries.",
      ar: "توسّعنا لخدمة أكثر من 120 جهة مؤسسية في ست دول.",
    },
    {
      year: "2024",
      en: "Recognized for innovation in legal operations by regional councils.",
      ar: "تكريم الابتكار في العمليات القانونية من مجالس إقليمية.",
    },
  ];

  const team = [
    {
      nameEn: "Leila Haddad",
      nameAr: "ليلى حداد",
      roleEn: "Managing Partner",
      roleAr: "شريكة إدارية",
      specialtyEn: "Regulatory & Governance",
      specialtyAr: "الامتثال والحوكمة",
    },
    {
      nameEn: "Omar Al-Khatib",
      nameAr: "عمر الخطيب",
      roleEn: "Head of Litigation",
      roleAr: "رئيس التقاضي",
      specialtyEn: "Commercial Disputes",
      specialtyAr: "النزاعات التجارية",
    },
    {
      nameEn: "Sara Mansour",
      nameAr: "سارة منصور",
      roleEn: "Legal Tech Director",
      roleAr: "مديرة التقنية القانونية",
      specialtyEn: "Automation & AI",
      specialtyAr: "الأتمتة والذكاء الاصطناعي",
    },
    {
      nameEn: "Yousef Nouri",
      nameAr: "يوسف نوري",
      roleEn: "Client Strategy Lead",
      roleAr: "قائد استراتيجية العملاء",
      specialtyEn: "Enterprise Advisory",
      specialtyAr: "الاستشارات المؤسسية",
    },
  ];

  const testimonials = [
    {
      quoteEn:
        "AVOCAT transformed our legal response time. We gained clarity across every regulatory obligation.",
      quoteAr:
        "غيّرت أفوكات زمن استجابتنا القانونية بالكامل، وأصبحت لدينا رؤية واضحة لكل التزامات الامتثال.",
      nameEn: "Rania Mansour",
      nameAr: "رانيا منصور",
      roleEn: "Chief Compliance Officer",
      roleAr: "رئيسة الامتثال",
    },
    {
      quoteEn:
        "The team delivered a secure digital war room that kept our cross-border dispute aligned.",
      quoteAr:
        "الفريق أنشأ غرفة حرب رقمية آمنة أبقت نزاعنا العابر للحدود منظمًا ومركزًا.",
      nameEn: "Hassan Idris",
      nameAr: "حسن إدريس",
      roleEn: "General Counsel",
      roleAr: "المستشار القانوني العام",
    },
    {
      quoteEn:
        "We now forecast legal exposure in days instead of weeks. Premium experience end-to-end.",
      quoteAr:
        "بات بإمكاننا توقع المخاطر القانونية خلال أيام بدلًا من أسابيع. تجربة فاخرة من البداية للنهاية.",
      nameEn: "Maha Saleh",
      nameAr: "مها صالح",
      roleEn: "Head of Risk",
      roleAr: "رئيسة المخاطر",
    },
  ];

  const StatCard = ({
    stat,
  }: {
    stat: { labelEn: string; labelAr: string; value: number };
  }) => {
    const { ref, value } = useCountUp({ end: stat.value });
    return (
      <div className="flex items-center justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
        <div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {language === "ar" ? stat.labelAr : stat.labelEn}
          </p>
          <p className="text-xl font-semibold text-[hsl(var(--foreground))]">
            <span ref={ref}>{value}</span>
            {stat.labelEn === "Avg. response time" ? "h" : "+"}
          </p>
        </div>
        <Clock3 className="h-5 w-5 text-[hsl(var(--primary))]" />
      </div>
    );
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formState.name.trim()) {
      errors.name = language === "ar" ? "الاسم مطلوب" : "Name is required";
    }
    if (!formState.email.trim()) {
      errors.email = language === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    }
    if (!formState.message.trim()) {
      errors.message = language === "ar" ? "الرسالة مطلوبة" : "Message is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setFormState({ name: "", email: "", message: "" });
      setFormErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <LandingNavbar />

      <main className="pt-24">
        <section
          id="home"
          className="relative overflow-hidden hero-aurora noise-texture"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <motion.div
              variants={reveal(0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={cn("space-y-6", isRTL && "text-right")}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.6)] px-4 py-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] shadow-[var(--shadow-sm)]">
                <Sparkles className="h-4 w-4 text-[hsl(var(--primary))]" />
                {language === "ar"
                  ? "جيل جديد من الخدمات القانونية"
                  : "Next-generation legal services"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-[hsl(var(--foreground))] md:text-5xl">
                {language === "ar" ? t.heroHeadline.ar : t.heroHeadline.en}
              </h1>
              <p className="text-lg text-[hsl(var(--muted-foreground))]">
                {language === "ar" ? t.heroSub.ar : t.heroSub.en}
              </p>
              <div
                className={cn(
                  "flex flex-wrap gap-4",
                  isRTL ? "justify-end" : "justify-start"
                )}
              >
                <button
                  type="button"
                  className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[var(--shadow-gold)] transition hover:-translate-y-0.5"
                >
                  {language === "ar" ? t.ctaPrimary.ar : t.ctaPrimary.en}
                  <ArrowRight className={cn("h-4 w-4 transition", isRTL && "rotate-180")} />
                </button>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  {language === "ar" ? t.ctaSecondary.ar : t.ctaSecondary.en}
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={blurIn(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              {!prefersReducedMotion && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-6 rounded-[32px] bg-[hsl(var(--accent)/0.2)] blur-3xl"
                />
              )}
              <div className="relative rounded-[32px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-xl)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                    {language === "ar" ? "لوحة العمليات القانونية" : "Legal Ops Dashboard"}
                  </span>
                  <span className="rounded-full bg-[hsl(var(--primary)/0.15)] px-3 py-1 text-[10px] font-semibold text-[hsl(var(--primary))]">
                    {language === "ar" ? "مباشر" : "Live"}
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                            {language === "ar"
                              ? "تقرير الامتثال"
                              : "Compliance Briefing"}
                          </p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {language === "ar"
                              ? "مراجعة أسبوعية"
                              : "Weekly review"}
                          </p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))]" />
                      </div>
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
                        <motion.div
                          initial={{ width: "20%" }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="h-full rounded-full bg-[hsl(var(--accent))]"
                        />
                      </div>
                      <motion.div
                        animate={{ x: ["-30%", "130%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(120deg,transparent,hsl(var(--primary)/0.25),transparent)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="grid gap-3 md:grid-cols-2">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.en}
                  variants={fadeIn(index * 0.05)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  <BadgeCheck className="h-4 w-4 text-[hsl(var(--primary))]" />
                  {language === "ar" ? badge.ar : badge.en}
                </motion.div>
              ))}
            </div>
            <div className="grid gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.labelEn} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        <motion.section
          id="about"
          className="mx-auto max-w-6xl px-4 py-20 lg:px-8"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className={cn("space-y-4", isRTL && "text-right")}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                {language === "ar" ? "قصتنا" : "Our Story"}
              </p>
              <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))]">
                {language === "ar"
                  ? "نربط الخبرة القانونية بذكاء البيانات"
                  : "We connect legal heritage with data intelligence."}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))]">
                {language === "ar"
                  ? "أفوكات منصة قانونية متقدمة، تصمم رحلات مخصصة للمؤسسات الحساسة للمخاطر. نحول الخبرة البشرية إلى إجراءات رقمية موثوقة ومقننة."
                  : "AVOCAT is a premium legal-tech studio crafting bespoke operating models for risk-sensitive enterprises. We translate human expertise into trusted, measurable digital workflows."}
              </p>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {language === "ar"
                    ? "رسالتنا: تمكين القيادات القانونية من اتخاذ قرارات دقيقة بثقة ووضوح في كل سوق."
                    : "Mission: empower legal leaders to act with precision, confidence, and clarity in every market."}
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {aboutCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.titleEn}
                    variants={fadeIn(0)}
                    className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.15)]">
                      <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[hsl(var(--foreground))]">
                      {language === "ar" ? card.titleAr : card.titleEn}
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      {language === "ar" ? card.descAr : card.descEn}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="services"
          className="bg-[hsl(var(--surface))]"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
            <div className={cn("mb-10 space-y-3", isRTL && "text-right")}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                {language === "ar" ? "الخدمات" : "Services"}
              </p>
              <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))]">
                {language === "ar"
                  ? "منصة متكاملة لكل ما تحتاجه فرقك القانونية"
                  : "A full-stack legal platform for your most demanding teams."}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isOpen = openService === index;
                return (
                  <motion.div
                    key={service.titleEn}
                    variants={fadeIn(index * 0.05)}
                    className="flex h-full flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent)/0.15)]">
                        <Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs font-semibold text-[hsl(var(--foreground))]"
                        onClick={() =>
                          setOpenService((prev) => (prev === index ? null : index))
                        }
                      >
                        {language === "ar" ? (isOpen ? "إغلاق" : "تفاصيل") : isOpen ? "Close" : "Details"}
                      </button>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[hsl(var(--foreground))]">
                      {language === "ar" ? service.titleAr : service.titleEn}
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      {language === "ar" ? service.descAr : service.descEn}
                    </p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                          className="mt-4 overflow-hidden text-sm text-[hsl(var(--muted-foreground))]"
                        >
                          {language === "ar" ? service.detailsAr : service.detailsEn}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="achievements"
          className="mx-auto max-w-6xl px-4 py-20 lg:px-8"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={cn("mb-10 space-y-3", isRTL && "text-right")}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
              {language === "ar" ? "الإنجازات" : "Achievements"}
            </p>
            <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))]">
              {language === "ar"
                ? "محطات مفصلية في رحلتنا"
                : "Milestones that shaped our journey."}
            </h2>
          </div>
          <div className="grid gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                variants={fadeIn(index * 0.1)}
                className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-sm)] md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.15)] text-lg font-semibold text-[hsl(var(--primary))]">
                  {item.year}
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">
                  {language === "ar" ? item.ar : item.en}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="team"
          className="bg-[hsl(var(--surface))]"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
            <div className={cn("mb-10 space-y-3", isRTL && "text-right")}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                {language === "ar" ? "الفريق" : "Team"}
              </p>
              <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))]">
                {language === "ar"
                  ? "قادة بخبرة متعددة التخصصات"
                  : "Leaders with multidisciplinary expertise."}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.nameEn}
                  variants={fadeIn(index * 0.05)}
                  className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center shadow-[var(--shadow-sm)]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--surface))] text-lg font-semibold text-[hsl(var(--primary))]">
                    {member.nameEn.charAt(0)}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[hsl(var(--foreground))]">
                    {language === "ar" ? member.nameAr : member.nameEn}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {language === "ar" ? member.roleAr : member.roleEn}
                  </p>
                  <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                    {language === "ar" ? member.specialtyAr : member.specialtyEn}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3 opacity-0 transition group-hover:opacity-100">
                    {[Linkedin, Twitter, Mail].map((Icon, iconIndex) => (
                      <Icon
                        key={iconIndex}
                        className="h-4 w-4 text-[hsl(var(--accent))]"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="testimonials"
          className="mx-auto max-w-6xl px-4 py-20 lg:px-8"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={cn("mb-10 flex items-center justify-between", isRTL && "flex-row-reverse")}
          >
            <div className={cn("space-y-3", isRTL && "text-right")}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                {language === "ar" ? "التوصيات" : "Testimonials"}
              </p>
              <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))]">
                {language === "ar"
                  ? "ثقة مستمرة من قيادات قانونية"
                  : "Trusted by legal leaders across the region."}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  )
                }
                className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
              >
                {language === "ar" ? "السابق" : "Prev"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === testimonials.length - 1 ? 0 : prev + 1
                  )
                }
                className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-[var(--shadow-lg)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                variants={fadeIn(0)}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={cn("space-y-6", isRTL && "text-right")}
              >
                <p className="text-lg text-[hsl(var(--foreground))]">
                  {language === "ar"
                    ? testimonials[activeTestimonial].quoteAr
                    : testimonials[activeTestimonial].quoteEn}
                </p>
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {language === "ar"
                      ? testimonials[activeTestimonial].nameAr
                      : testimonials[activeTestimonial].nameEn}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {language === "ar"
                      ? testimonials[activeTestimonial].roleAr
                      : testimonials[activeTestimonial].roleEn}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="bg-[hsl(var(--surface))]"
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className={cn("space-y-6", isRTL && "text-right")}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                  {language === "ar" ? "التواصل" : "Contact"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[hsl(var(--foreground))]">
                  {language === "ar"
                    ? "دعنا نصمم تجربة قانونية راقية معًا"
                    : "Let’s craft a premium legal experience together."}
                </h2>
              </div>
              <form
                className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-md)]"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {language === "ar" ? "الاسم الكامل" : "Full name"}
                  </label>
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--ring))] focus:outline-none"
                    placeholder={language === "ar" ? "اكتب اسمك" : "Enter your name"}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-[hsl(var(--accent))]">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    name="email"
                    value={formState.email}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--ring))] focus:outline-none"
                    placeholder={
                      language === "ar" ? "name@company.com" : "name@company.com"
                    }
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-[hsl(var(--accent))]">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {language === "ar" ? "الرسالة" : "Message"}
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--ring))] focus:outline-none"
                    placeholder={
                      language === "ar"
                        ? "كيف يمكننا مساعدتك؟"
                        : "How can we support your team?"
                    }
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-[hsl(var(--accent))]">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[var(--shadow-gold)] transition hover:-translate-y-0.5"
                >
                  {language === "ar" ? "إرسال الطلب" : "Send Request"}
                  <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[var(--shadow-md)]">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {language === "ar" ? "مكتبنا" : "Our Office"}
                </h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  {language === "ar"
                    ? "برج الأعمال، شارع الملك فهد، الرياض"
                    : "Business Tower, King Fahd Road, Riyadh"}
                </p>
                <div className="mt-4 space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <p>+966 11 555 1200</p>
                  <p>hello@avocat.legal</p>
                </div>
              </div>
              <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 shadow-[var(--shadow-md)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    {language === "ar" ? "خريطة الموقع" : "Map"}
                  </h3>
                  <Globe2 className="h-5 w-5 text-[hsl(var(--accent))]" />
                </div>
                <div className="mt-6 h-40 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]" />
                <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                  {language === "ar"
                    ? "يتم عرض الخريطة التفاعلية عند تفعيل بيانات الموقع."
                    : "Interactive map appears when location data is enabled."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <BrandLogo lang={language} />
          <div className="flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
            {[
              { id: "about", en: "About", ar: "من نحن" },
              { id: "services", en: "Services", ar: "الخدمات" },
              { id: "contact", en: "Contact", ar: "التواصل" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="transition hover:text-[hsl(var(--foreground))]"
              >
                {language === "ar" ? item.ar : item.en}
              </a>
            ))}
          </div>
          <div
            className={cn(
              "flex items-center gap-3",
              isRTL ? "justify-end" : "justify-start"
            )}
          >
            <ThemeToggle tone="dark" />
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-[hsl(var(--border))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
            >
              {language === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function LandingPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LandingContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Route example:
// <Route path="/" element={<LandingPage />} />
