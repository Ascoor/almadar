import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Login from "@/components/organisms/Login";
import { LogoNewArt, LandingPage } from "@/assets/images";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1];

export default function HomePage() {
  const reduce = useReducedMotion();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const features = useMemo(
    () => [
      { title: "واجهة مرتبة", desc: "كل شيء قدّامك بشكل واضح وسريع.", icon: "✨" },
      { title: "تسجيل دخول آمن", desc: "حماية وصلاحيات حسب الدور.", icon: "🔒" },
      { title: "متابعة دقيقة", desc: "تتبع العمليات وتاريخ واضح دائمًا.", icon: "📌" },
    ],
    []
  );

  const open = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowLoginForm(true);
  };
  const close = () => setShowLoginForm(false);

  // ✅ الأنيميشن العلوي: يدخل من فوق ويخرج لفوق
  const topCardVariants = {
    hidden: { y: "-120%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1.2, ease: EASE } 
    },
    exit: { 
      y: "-120%", 
      opacity: 0, 
      transition: { duration: 0.8, ease: EASE } 
    }
  };

  // ✅ الأنيميشن السفلي: يدخل من تحت ويخرج لتحت
  const bottomCardVariants = {
    hidden: { y: "120%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1.2, ease: EASE } 
    },
    exit: { 
      y: "120%", 
      opacity: 0, 
      transition: { duration: 0.8, ease: EASE } 
    }
  };

  // ✅ نموذج الدخول: يظهر من المنتصف (Scaling + Fade)
  const loginPanelVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { delay: 0.3, duration: 0.6, ease: EASE } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      transition: { duration: 0.3 } 
    },
  };

  return (
    <main className="min-h-screen relative overflow-hidden font-['Tajawal'] bg-slate-950" dir="rtl" lang="ar">
      
      {/* Background - الثابتة */}
      <section className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${LandingPage})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 hero-gradient" />
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl relative flex flex-col items-center justify-center min-h-[600px]">
          
          <AnimatePresence mode="wait">
            {!showLoginForm ? (
              <motion.div 
                key="landing-content"
                className="w-full flex flex-col gap-8"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* --- الكارت العلوي --- */}
                <motion.div 
                  variants={topCardVariants}
                  className="glass-card p-8 sm:p-12 text-center"
                >
                  <motion.img
                    src={LogoNewArt}
                    alt="المدار"
                    className="mx-auto h-20 sm:h-28 w-auto mb-6 drop-shadow-2xl"
                  />
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
                    بوابة <span className="gold-text gold-glow">المدار</span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                    المنصة المتكاملة لإدارة الشؤون القانونية والعقود بكل سهولة واحترافية.
                  </p>
                  <div className="mt-10">
                    <Button variant="hero" size="xl" onClick={open} className="px-12 py-6 text-xl shadow-2xl">
                      دخول ✨
                    </Button>
                  </div>
                </motion.div>

                {/* --- الكارت السفلي (المميزات) --- */}
                <motion.div 
                  variants={bottomCardVariants}
                  className="glass-card p-6 sm:p-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {features.map((f) => (
                      <div key={f.title} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-3xl">{f.icon}</span>
                        <div className="text-right">
                          <h3 className="text-white font-bold">{f.title}</h3>
                          <p className="text-white/60 text-sm">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* --- نموذج تسجيل الدخول --- */
              <motion.div
                key="login-form"
                variants={loginPanelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-md "
              >
                <div className="glass-card shadow-2xl overflow-hidden border-t z-50 border-white/20">
                  <Login handleFormClose={close} />
                </div>
                <button
                  onClick={close}
                  className="mt-6 w-full text-white/50 hover:text-white transition-colors text-sm underline"
                >
                  العودة للرئيسية
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Overlay Backdrop عند ظهور الفورم */}
      <AnimatePresence>
        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
            onClick={close}
          />
        )}
      </AnimatePresence>
    </main>
  );
}