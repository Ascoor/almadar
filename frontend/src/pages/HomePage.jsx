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
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    setShowLoginForm(true);
  };

  const close = () => setShowLoginForm(false);

  const topCardVariants = {
    hidden: { y: "-120%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: reduce ? { duration: 0 } : { duration: 1.0, ease: EASE },
    },
    exit: {
      y: "-120%",
      opacity: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE },
    },
  };

  const bottomCardVariants = {
    hidden: { y: "120%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: reduce ? { duration: 0 } : { duration: 1.0, ease: EASE },
    },
    exit: {
      y: "120%",
      opacity: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE },
    },
  };

  const loginPanelVariants = {
    initial: { opacity: 0, scale: 0.96, y: 14 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.45, ease: EASE },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: reduce ? { duration: 0 } : { duration: 0.22 },
    },
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden font-['Tajawal'] bg-slate-950"
      dir="rtl"
      lang="ar"
    >
      {/* Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={LandingPage}
          alt="Legal technology background"
          className="w-full h-full object-cover"
          loading="eager"
        /> 
     
      </div>   
  <div className="absolute inset-0 z-[2] pointer-events-none hidden lg:block">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-16">
 <AnimatePresence mode="wait">
            {!showLoginForm ? (
           <motion.div
           variants={topCardVariants}
           className="glass-landing p-8 sm:p-12 text-center"
         >
                {/* Top Card */}
                <motion.div
                  variants={topCardVariants}
                  className="glass-card p-8 sm:p-12 text-center"
                >
                  <motion.img
                    src={LogoNewArt}
                    alt="المدار"
                    className="mx-auto h-20 sm:h-28 w-auto mb-6 drop-shadow-2xl"
                  />
             <h1 className="landing-title text-4xl sm:text-6xl font-extrabold text-white mb-4">
    بوابة <span className="gold-text gold-glow">المدار</span>
  </h1>

  <p className="landing-subtitle text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
        المنصة المتكاملة لإدارة الشؤون القانونية والعقود بكل سهولة واحترافية.
                  </p>

                  <div className="mt-10">
                    <Button
                      variant="hero"
                      size="xl"
                      onClick={open}
                      className="px-12 py-6 text-xl shadow-2xl"
                    >
                      دخول ✨
                    </Button>
                  </div>
                </motion.div>

                {/* Bottom Card */}
                <motion.div
                  variants={bottomCardVariants}
                  className="glass-card p-6 sm:p-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {features.map((f) => (
                      <div
                        key={f.title}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                      >
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
            ) : null}
          </AnimatePresence>
        </div>
        </div>
      </section>

      {/* Modal Layer */}
      <AnimatePresence>
        {showLoginForm && (
          <motion.div
            key="login-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ✅ Smart overlay */}
            <motion.div
              className="absolute inset-0 modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* ✅ Panel فوق */}
            <motion.div
              variants={loginPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-[110] w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✅ Use glass-modal for clarity */}
              <div className="glass-modal overflow-hidden">
  <Login handleFormClose={close} />
</div>


              <button
                onClick={close}
                className="mt-6 w-full text-white/50 hover:text-white transition-colors text-sm underline"
              >
                العودة للرئيسية
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
