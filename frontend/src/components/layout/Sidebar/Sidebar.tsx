import React from "react";
import { NavLink } from "react-router-dom";
import { NAV } from "@/config/nav";
import { useDir } from "@/context/DirContext";
import { useSidebar } from "@/store/sidebar";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { motion, AnimatePresence } from "framer-motion";
import ChevronAuto from "@/components/ui/ChevronAuto";

function useLabels() {
  const { lang } = useDir();
  return (labelAr: string, labelEn: string) => (lang === "ar" ? labelAr : labelEn);
}

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const { dir } = useDir();
  const isMobile = useIsMobile();
  const { isOpenDesktop, toggleDesktop, activeSection, setActiveSection } = useSidebar();
  const label = useLabels();

  const anchor = dir === "rtl" ? "right-0" : "left-0";
  const railSide = dir === "rtl" ? "border-l" : "border-r";

  // في الموبايل: لا mini rail. اللوحة إمّا مغلقة تمامًا أو fullscreen
  const showExpanded = isMobile ? isOpenDesktop : isOpenDesktop;
  const showMini = !isMobile && !isOpenDesktop;

  const ItemLabel = ({ ar, en }: { ar: string; en: string }) => <span className="flex-1 text-right">{label(ar, en)}</span>;

  return (
    <>
      {/* زر تبديل (ضعه في Topbar عادةً) للتبسيط هنا */}
      {!isMobile && (
        <button onClick={toggleDesktop} className="fixed top-3 z-40 p-2 rounded-lg bg-card hover:bg-card-hover border border-border"
                style={{ [dir === "rtl" ? "right" : "left"]: "0.5rem" }}>
          {isOpenDesktop ? "⟨⟩" : "≡"}
        </button>
      )}

      {/* الخلفية على الموبايل */}
      <AnimatePresence>
        {isMobile && showExpanded && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40" onClick={() => useSidebar.getState().setOpenDesktop(false)}
          />
        )}
      </AnimatePresence>

      {/* الشريط نفسه */}
      <AnimatePresence initial={false}>
        {showExpanded && (
          <motion.aside
            key="expanded"
            initial={{ x: dir === "rtl" ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir === "rtl" ? 300 : -300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            dir={dir}
            className={`fixed top-0 ${anchor} z-50 h-screen w-72 bg-card border ${railSide} border-border shadow-lg`}
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
            role="navigation"
            aria-label="Sidebar"
          >
            {/* رأس الشريط */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <div className="font-bold text-lg">{label("القائمة", "Menu")}</div>
              <button onClick={toggleDesktop} className="p-2 rounded-lg bg-card hover:bg-card-hover border border-border focus-ring">
                {isMobile ? "✕" : (dir === "rtl" ? "⟨" : "⟩")}
              </button>
            </div>

            {/* عناصر القائمة */}
            <nav className="px-2 py-3 overflow-y-auto">
              {NAV.map((item) => {
                const hasChildren = !!item.children?.length;
                const opened = activeSection === item.id;

                return (
                  <div key={item.id} className="mb-1">
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => setActiveSection(opened ? null : item.id)}
                        aria-expanded={opened}
                        aria-controls={`sec-${item.id}`}
                        className="w-full flex items-center gap-3 p-2 rounded-md text-sm font-semibold bg-card hover:bg-card-hover transition-colors focus-ring"
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <ItemLabel ar={item.labelAr} en={item.labelEn} />
                        <ChevronAuto className={`w-4 h-4 transition-transform ${opened ? "rotate-90" : ""}`} />
                      </button>
                    ) : (
                      <NavLink
                        to={item.path!}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-2 rounded-md text-sm font-semibold transition-colors
                           ${isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"}`
                        }
                        onClick={onLinkClick}
                        role="menuitem"
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <ItemLabel ar={item.labelAr} en={item.labelEn} />
                      </NavLink>
                    )}

                    {/* الفرعية في الوضع الموسّع */}
                    <AnimatePresence initial={false}>
                      {hasChildren && opened && (
                        <motion.div
                          id={`sec-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={`mt-1 ms-4 border-${dir === "rtl" ? "r" : "l"} border-border overflow-hidden`}
                        >
                          {item.children!.map((ch) => (
                            <NavLink
                              key={ch.id}
                              to={ch.path}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                                 ${isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"}`
                              }
                              onClick={onLinkClick}
                              role="menuitem"
                            >
                              <span className="shrink-0">{ch.icon}</span>
                              <ItemLabel ar={ch.labelAr} en={ch.labelEn} />
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MINI RAIL على الديسكتوب فقط */}
      <AnimatePresence initial={false}>
        {showMini && (
          <motion.aside
            key="mini"
            initial={{ x: dir === "rtl" ? 96 : -96, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir === "rtl" ? 96 : -96, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            dir={dir}
            className={`fixed top-0 ${anchor} z-40 h-screen w-16 bg-card border ${railSide} border-border`}
            role="navigation"
            aria-label="Mini sidebar"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
          >
            <div className="h-16 flex items-center justify-center border-b border-border">
              <button onClick={toggleDesktop} className="p-2 rounded-lg bg-card hover:bg-card-hover border border-border focus-ring">≡</button>
            </div>

            <nav className="py-3 overflow-y-auto">
              {NAV.map((item) => {
                const hasChildren = !!item.children?.length;
                return (
                  <div key={item.id} className="relative group">
                    {/* زر العنصر (أيقونة فقط) */}
                    {item.path ? (
                      <NavLink
                        to={item.path}
                        title={label(item.labelAr, item.labelEn)}
                        className={({ isActive }) =>
                          `mx-2 my-1 flex items-center justify-center p-2 rounded-md
                           ${isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"}`
                        }
                        role="menuitem"
                      >
                        <span className="shrink-0">{item.icon}</span>
                      </NavLink>
                    ) : (
                      <button
                        type="button"
                        title={label(item.labelAr, item.labelEn)}
                        className="mx-2 my-1 w-12 h-10 grid place-items-center rounded-md hover:bg-card-hover focus-ring"
                      >
                        {item.icon}
                      </button>
                    )}

                    {/* FLYOUT للفرعية عند التحويم إذا فيه أبناء */}
                    {hasChildren && (
                      <div
                        className={`invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                                    absolute top-0 ${dir === "rtl" ? "left-full" : "right-full"} z-50`}
                      >
                        <div className="min-w-56 bg-card border border-border rounded-xl shadow-xl p-2">
                          {item.children!.map((ch) => (
                            <NavLink
                              key={ch.id}
                              to={ch.path}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                 ${isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"}`
                              }
                              role="menuitem"
                            >
                              <span className="shrink-0">{ch.icon}</span>
                              <ItemLabel ar={ch.labelAr} en={ch.labelEn} />
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
