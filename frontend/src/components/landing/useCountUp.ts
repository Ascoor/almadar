import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CountUpOptions = {
  end: number;
  duration?: number;
};

export const useCountUp = ({ end, duration = 1600 }: CountUpOptions) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    let frame: number | null = null;

    const animate = (startTime: number) => {
      const now = performance.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(() => animate(startTime));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (prefersReducedMotion) {
              setValue(end);
              observer.disconnect();
              return;
            }
            frame = requestAnimationFrame(() => animate(performance.now()));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(element);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      observer.disconnect();
    };
  }, [end, duration, prefersReducedMotion]);

  return { ref, value };
};
