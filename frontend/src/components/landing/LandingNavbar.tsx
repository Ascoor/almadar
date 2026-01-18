import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { stagger } from "@/components/landing/landing-motion";
import { useScrollSpy } from "@/components/landing/useScrollSpy";

const navItems = [
  { id: "home", en: "Home", ar: "الرئيسية" },
  { id: "about", en: "About", ar: "من نحن" },
  { id: "services", en: "Services", ar: "الخدمات" },
  { id: "achievements", en: "Achievements", ar: "الإنجازات" },
  { id: "team", en: "Team", ar: "الفريق" },
  { id: "testimonials", en: "Testimonials", ar: "التوصيات" },
  { id: "contact", en: "Contact", ar: "التواصل" },
];

const LandingNavbar = () => {
  const { language, direction, toggleLanguage } = useLanguage();
  const isRTL = direction === "rtl";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const activeId = useScrollSpy(
    navItems.map((item) => item.id),
    160
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[hsl(var(--nav-bg-scrolled))] shadow-[var(--shadow-sm)]"
          : "bg-[hsl(var(--nav-bg-top))]"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <BrandLogo lang={language} dark={!isScrolled} />

        <nav className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  <span>{language === "ar" ? item.ar : item.en}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        "absolute -bottom-2 h-0.5 w-full rounded-full bg-[hsl(var(--primary))]",
                        isRTL ? "origin-right" : "origin-left"
                      )}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <Link
            to="/showcase"
            className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]"
          >
            {language === "ar" ? "عرض الحلول" : "Showcase"}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle tone="light" />
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-[hsl(var(--border))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]"
          >
            {language === "ar" ? "English" : "العربية"}
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground))] lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="border-t border-[hsl(var(--nav-border))] bg-[hsl(var(--nav-bg-scrolled))] lg:hidden"
          >
            <motion.div
              variants={stagger(0.05, 0.08)}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4 px-6 py-6"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  variants={prefersReducedMotion ? undefined : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium text-[hsl(var(--foreground))]",
                    activeId === item.id && "text-[hsl(var(--primary))]"
                  )}
                >
                  {language === "ar" ? item.ar : item.en}
                </motion.a>
              ))}
              <Link
                to="/showcase"
                className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-center text-sm font-semibold text-[hsl(var(--foreground))]"
              >
                {language === "ar" ? "عرض الحلول" : "Showcase"}
              </Link>
              <div
                className={cn(
                  "flex items-center gap-3",
                  isRTL ? "justify-end" : "justify-start"
                )}
              >
                <ThemeToggle tone="light" />
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="rounded-full border border-[hsl(var(--border))] px-3 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
                >
                  {language === "ar" ? "English" : "العربية"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
