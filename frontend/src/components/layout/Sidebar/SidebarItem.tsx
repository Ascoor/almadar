import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "@/config/nav";
import { useSidebarStore } from "@/store/sidebar";
import Tooltip from "@/components/ui/Tooltip";

type SidebarItemProps = {
  item: NavItem;
  isMini: boolean;
  onLinkClick?: () => void;
};

export default function SidebarItem({ item, isMini, onLinkClick }: SidebarItemProps) {
  const { activeSection, setActiveSection } = useSidebarStore();
  const hasChildren = !!item.children?.length;
  const opened = activeSection === item.id;
  const submenuId = `${item.id}-submenu`;

  const toggleSection = () => setActiveSection(opened ? null : item.id);

  const Wrapper = hasChildren ? "button" : NavLink;
  const wrapperProps = hasChildren
    ? {
        onClick: toggleSection,
        "aria-expanded": opened,
        "aria-controls": submenuId,
        className:
          "w-full flex items-center gap-x-3 p-2 rounded-md text-sm font-medium bg-card hover:bg-card-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
      }
    : {
        to: item.path!,
        onClick: onLinkClick,
        className: ({ isActive }: { isActive: boolean }) =>
          `flex items-center gap-x-3 p-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
            isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"
          }`,
      };

  const content = (
    <Wrapper {...wrapperProps}>
      <span className="shrink-0">{item.icon}</span>
      {!isMini && <span className="flex-1 text-right">{item.label}</span>}
      {hasChildren && !isMini && (
        <ChevronRight className={`w-4 h-4 transition-transform ${opened ? "rotate-90" : ""}`} />
      )}
    </Wrapper>
  );

  return (
    <div className="relative mb-1">
      {isMini ? <Tooltip text={item.label}>{content}</Tooltip> : content}

      <AnimatePresence initial={false}>
        {hasChildren && opened && (
          isMini ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-0 right-full me-2 z-40 w-48 overflow-hidden rounded-md border border-border bg-card shadow-md"
            >
              {item.children!.map((ch) => (
                <NavLink
                  key={ch.id}
                  to={ch.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-2 p-2 text-sm transition-colors rounded-md ${
                      isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"
                    }`
                  }
                >
                  <span className="shrink-0">{ch.icon}</span>
                  <span className="flex-1 text-right">{ch.label}</span>
                </NavLink>
              ))}
            </motion.div>
          ) : (
            <motion.div
              id={submenuId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ms-6 mt-1 overflow-hidden border-r border-border"
            >
              {item.children!.map((ch) => (
                <NavLink
                  key={ch.id}
                  to={ch.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive ? "bg-card-hover shadow-sm" : "hover:bg-card-hover"
                    }`
                  }
                >
                  <span className="shrink-0">{ch.icon}</span>
                  <span className="text-right">{ch.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

