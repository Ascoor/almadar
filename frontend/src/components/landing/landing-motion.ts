import { Variants } from "framer-motion";

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay },
  },
});

export const reveal = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut", delay },
  },
});

export const stagger = (
  delayChildren = 0.1,
  staggerChildren = 0.12
): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
});

export const blurIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 10, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut", delay },
  },
});
