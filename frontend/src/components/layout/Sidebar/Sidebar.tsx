import React from "react";
import { NAV_ITEMS } from "@/config/nav";
import SidebarItem from "./SidebarItem";
import { useSidebarStore } from "@/store/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const { isOpen, toggle } = useSidebarStore();
  const isMobile = useIsMobile();
  const isMini = !isOpen && !isMobile;

  const mobileCls = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      dir="rtl"
      className={`fixed top-0 bottom-0 z-30 bg-card border-r border-border transition-all duration-300 flex flex-col ${
        isMobile ? `w-64 ${mobileCls}` : isMini ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-3">
        {!isMini && <div className="font-semibold truncate">المـدار</div>}
        <button
          onClick={toggle}
          className="p-2 rounded-lg bg-card hover:bg-card-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="sr-only">Toggle sidebar</span>
          ≡
        </button>
      </div>

      <nav className="px-2 pb-4 overflow-y-auto flex-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.id} item={item} isMini={isMini} onLinkClick={onLinkClick} />
        ))}
      </nav>
    </aside>
  );
}
