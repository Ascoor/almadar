import { useEffect, useState } from "react";
export function useIsMobile(breakpoint = 1024) {
  const [mobile, setMobile] = useState(() => window.matchMedia(`(max-width:${breakpoint}px)`).matches);
  useEffect(() => {
    const m = window.matchMedia(`(max-width:${breakpoint}px)`);
    const on = (e: MediaQueryListEvent) => setMobile(e.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [breakpoint]);
  return mobile;
}
