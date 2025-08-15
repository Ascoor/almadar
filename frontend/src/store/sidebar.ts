import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarState = {
  isOpen: boolean;
  activeSection: string | null;
  toggle: () => void;
  setOpen: (val: boolean) => void;
  setActiveSection: (id: string | null) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      activeSection: null,
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setOpen: (val) => set({ isOpen: val }),
      setActiveSection: (id) => set({ activeSection: id }),
    }),
    { name: "almadar.sidebar" }
  )
);

