import { useEffect, useState } from "react";

export const useScrollSpy = (sectionIds: string[], offset = 120) => {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      let currentId = sectionIds[0];

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = id;
        }
      });

      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
};
