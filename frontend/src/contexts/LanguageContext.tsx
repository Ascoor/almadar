import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  direction: "ltr" | "rtl";
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem("lang");
  return stored === "ar" ? "ar" : "en";
};

const applyLanguage = (language: Language) => {
  if (typeof document === "undefined") {
    return;
  }

  const direction = language === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", language);
  document.documentElement.setAttribute("dir", direction);
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const initialLanguage = useMemo(() => {
    const language = getStoredLanguage();
    applyLanguage(language);
    return language;
  }, []);

  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    applyLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", language);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const value = useMemo(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      toggleLanguage,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
