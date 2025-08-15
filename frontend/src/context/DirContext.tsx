// src/context/DirContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Dir = "rtl" | "ltr";
type Lang = "ar" | "en";

type DirCtx = {
  dir: Dir;
  lang: Lang;
  setDir: (d: Dir) => void;
  setLang: (l: Lang) => void;
  toggleDir: () => void;
  toggleLang: () => void;
};

const Ctx = createContext<DirCtx | null>(null);
export const useDir = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDir must be used within <DirProvider>");
  return v;
};

const DIR_KEY = "almadar.dir";
const LANG_KEY = "almadar.lang";

export function DirProvider({ children }: { children: React.ReactNode }) {
  const [dir, setDirState] = useState<Dir>(() => (localStorage.getItem(DIR_KEY) as Dir) || "rtl");
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) as Lang) || "ar");

  const setDir = (d: Dir) => { setDirState(d); localStorage.setItem(DIR_KEY, d); };
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem(LANG_KEY, l); };

  const toggleDir = () => setDir(dir === "rtl" ? "ltr" : "rtl");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", dir);
    html.setAttribute("lang", lang);
  }, [dir, lang]);

  const value = useMemo(() => ({ dir, lang, setDir, setLang, toggleDir, toggleLang }), [dir, lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
