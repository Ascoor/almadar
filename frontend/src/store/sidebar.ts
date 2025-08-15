import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  isOpenDesktop: boolean;
  activeSection: string | null;
  setOpenDesktop: (v: boolean) => void;
  toggleDesktop: () => void;
  setActiveSection: (id: string | null) => void;
};

export const useSidebar = create<State>()(
  persist(
    (set) => ({
      isOpenDesktop: true,
      activeSection: null,
      setOpenDesktop: (v) => set({ isOpenDesktop: v }),
      toggleDesktop: () => set((s) => ({ isOpenDesktop: !s.isOpenDesktop })),
      setActiveSection: (id) => set({ activeSection: id }),
    }),
    { name: "almadar.sidebar" }
  )
);
