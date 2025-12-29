import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Login from '@/components/organisms/Login';
import { WelcomeLogoWhite, LandingPage } from '@/assets/images';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-['Tajawal']">
      {/* Background */}
      <motion.img
        src={LandingPage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="lazy"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeInOut' }}
      />

      {/* Overlay (أجمل من طبقة سوداء ثابتة) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />

      {/* subtle noise / glow layer */}
      <div className="absolute inset-0 z-10 opacity-40 pointer-events-none
        [background:radial-gradient(80%_60%_at_50%_35%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(60%_50%_at_70%_60%,rgba(34,197,94,0.18),transparent_60%)]" />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6">
        {isLoading && <AuthSpinner />}

        <AnimatePresence>
          {!showLoginForm && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="
                relative w-full max-w-xl text-center
                rounded-3xl p-6 sm:p-10 space-y-6
                border border-white/15
                bg-white/10 backdrop-blur-xl
                shadow-[0_30px_90px_-25px_rgba(0,0,0,0.85)]
                overflow-hidden
              "
            >
              {/* Circular soft shadow / halo behind card */}
              <div className="pointer-events-none absolute -inset-32 opacity-70
                [background:radial-gradient(circle,rgba(59,130,246,0.18),transparent_55%)]" />
              <div className="pointer-events-none absolute -inset-32 opacity-60
                [background:radial-gradient(circle,rgba(34,197,94,0.14),transparent_55%)]" />

              {/* glossy highlight */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-66 w-[32rem] -translate-x-1/2 rotate-12 rounded-full bg-white/10 blur-2xl" />

              {/* Logo */}
              <motion.img
                src={WelcomeLogoWhite}
                alt="Logo"
                className="mx-auto  w-66 h-66 drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
                initial={{ opacity: 0, y: -14 }}
                animate={
                  reduce
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, rotate: 0 }
                }
                transition={{ duration: 0.9, ease: 'easeOut' }}
                whileHover={reduce ? undefined : { y: -6, scale: 1.06 }}
              />

              {/* Button wrapper (gradient border) */}
              <div className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  disabled={isLoading}
                  aria-label="Login"
                  whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  className="
                    group relative inline-flex items-center justify-center
                    rounded-full p-[1.5px]
                    shadow-[0_18px_40px_-18px_rgba(59,130,246,0.65)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {/* gradient ring */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute inset-0 rounded-full
                      bg-gradient-to-r from-blue-500 via-emerald-400 to-green-500
                      opacity-95 blur-[0.2px]
                    "
                  />
                  {/* inner */}
                  <span
                    className="
                      relative inline-flex items-center justify-center gap-2
                      px-8 sm:px-10 py-3 sm:py-3.5
                      rounded-full
                      text-white font-bold tracking-wide
                      bg-black/25 backdrop-blur-xl
                      border border-white/15
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
                      transition-all duration-300
                      group-hover:bg-black/20
                    "
                  >
                    {/* sheen effect */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute inset-0 rounded-full overflow-hidden
                        before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3
                        before:bg-white/25 before:blur-md before:opacity-0
                        before:skew-x-[-20deg]
                        group-hover:before:opacity-100
                        group-hover:before:animate-[sheen_1.1s_ease-in-out_1]
                      "
                    />
                    <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                      🚀 Login
                    </span>

                    {isLoading && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                      </span>
                    )}
                  </span>
                </motion.button>
              </div>

              {/* Optional caption */}
              <p className="text-white/70 text-sm">
                Welcome back — sign in to continue
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <AnimatePresence>
          {showLoginForm && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Login
                onAuthStart={() => setIsLoading(true)}
                handleFormClose={() => setShowLoginForm(false)}
                onAuthComplete={(success) => {
                  setIsLoading(false);
                  if (success) setShowLoginForm(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* keyframes for sheen */}
      <style>{`
        @keyframes sheen {
          0% { transform: translateX(0) skewX(-20deg); }
          100% { transform: translateX(260%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
