import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebarStore } from "@/store/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { isOpen, setOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <div dir="rtl" className="min-h-screen flex bg-background">
      <Sidebar onLinkClick={() => isMobile && setOpen(false)} />
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "me-0" : isOpen ? "me-64" : "me-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
