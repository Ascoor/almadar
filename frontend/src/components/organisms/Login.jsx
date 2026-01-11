import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormField";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageToggle from "@/components/common/LanguageToggle";

import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LogoNewArt } from "@/assets/images";
import { getDashboardRoute } from "@/auth/getDashboardRoute";

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useContext(AuthContext);
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const labels = useMemo(
    () => ({
      title: t("login.title") || (isArabic ? "تسجيل الدخول" : "Sign In"),
      subtitle: t("login.subtitle"),
      brand: t("login.brand"),
      email: t("login.email"),
      password: t("login.password"),
      remember: t("login.remember"),
      show: t("login.show"),
      hide: t("login.hide"),
      submit: t("login.submit"),
      submitting: t("login.submitting"),
      cancel: t("login.cancel"),
      terms: t("login.terms"),

      successTitle: t("login.successTitle"),
      successDescription: t("login.successDescription"),
      errorTitle: t("login.errorTitle"),
      errorDescription: t("login.errorDescription"),
      errorFallback: t("login.errorFallback"),
      unexpected: t("login.unexpected"),
      unexpectedDescription: t("login.unexpectedDescription"),
    }),
    [isArabic, t]
  );

  const validate = () => {
    const nextErrors = { email: "", password: "" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = isArabic ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = isArabic ? "صيغة البريد غير صحيحة" : "Invalid email format";
    }

    if (!password) {
      nextErrors.password = isArabic ? "كلمة المرور مطلوبة" : "Password is required";
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError("");

    if (!validate()) {
      onAuthComplete?.(false);
      return;
    }

    onAuthStart?.();
    setIsSubmitting(true);

    try {
      const { success, message, roles = [] } = await login(
        email.trim(),
        password,
      );

      if (success) {
        if (rememberMe) localStorage.setItem("rememberedEmail", email.trim());
        else localStorage.removeItem("rememberedEmail");

        toast.success(labels.successTitle, { description: labels.successDescription });
        onAuthComplete?.(true);
        navigate(getDashboardRoute(roles), { replace: true });
      } else {
        const errorMsg = message === "Bad credentials" ? labels.errorDescription : message;
        setFormError(errorMsg || labels.errorFallback);

        toast.error(labels.errorTitle, { description: errorMsg || labels.errorFallback });
        onAuthComplete?.(false);
      }
    } catch (error) {
      const msg = error?.message || labels.unexpectedDescription;
      setFormError(msg);

      toast.error(labels.unexpected, { description: msg });
      onAuthComplete?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleFormClose?.();
    setEmail("");
    setPassword("");
    setErrors({ email: "", password: "" });
    setFormError("");
    setShowPassword(false);
  };

  return (
    <motion.div
      dir={dir}
      aria-labelledby="login-title"
      className="w-full"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 14, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Inner card: keep it solid/readable (outer modal handles glass) */}
      <div className="login-card-special p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={LogoNewArt}
              alt={labels.brand || "Logo"}
              className="h-10 w-auto md:h-11 drop-shadow"
              draggable={false}
            />
            {labels.brand ? (
              <span className="text-xs md:text-sm text-muted-foreground font-semibold">
                {labels.brand}
              </span>
            ) : null}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="text-center space-y-2">
          <h2 id="login-title" className="neon-title text-2xl md:text-3xl font-extrabold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-xs md:text-sm max-w-xs mx-auto leading-relaxed text-muted-foreground">
            {labels.subtitle}
          </p>
        </div>

        {/* Error box */}
        {formError ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-lg p-3 text-sm border
              bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]
              border-[color-mix(in_oklab,var(--destructive)_45%,transparent)]
              text-destructive
            "
            role="alert"
            aria-live="polite"
          >
            {formError}
          </motion.div>
        ) : null}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 md:space-y-5 ${isArabic ? "text-right" : "text-left"}`}
        >
          <FormField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={{ ar: labels.email, en: labels.email }}
            label={{ ar: labels.email, en: labels.email }}
            autoComplete="email"
            required
            error={errors.email}
          />

          <div className="space-y-2">
            <FormField
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={{ ar: labels.password, en: labels.password }}
              label={{ ar: labels.password, en: labels.password }}
              autoComplete="current-password"
              required
              error={errors.password}
            />

            <div className={`flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
              <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card text-primary focus:ring-ring"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {labels.remember}
              </label>

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showPassword ? labels.hide : labels.show}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="
                w-full justify-center font-semibold
                rounded-lg py-2.5 md:py-3
                text-primary-foreground
                shadow-glow transition-all
                hover:scale-[1.02]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                disabled:opacity-80 disabled:cursor-not-allowed
              "
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {isSubmitting ? labels.submitting : labels.submit}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className="
                w-full py-2.5 md:py-3 font-medium rounded-lg
                bg-muted text-fg border border-border
                transition-all
                hover:opacity-90 hover:scale-[1.01]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              "
            >
              {labels.cancel}
            </button>

            <p className="text-[11px] md:text-xs text-muted-foreground text-center leading-snug mt-1">
              {labels.terms}
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
