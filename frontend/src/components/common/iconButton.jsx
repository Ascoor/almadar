import { motion } from "framer-motion";
import clsx from "clsx";

export default function IconButton({ onClick, active, children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      {...props}
      className={clsx(
        `relative inline-flex items-center justify-center p-2 rounded-full 
        transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
        bg-gold-dark text-white hover:bg-yellow-700
        dark:bg-emerald-600 dark:text-white dark:hover:bg-greenic-dark
        shadow-md`,
        active && "ring-2 ring-gold dark:ring-greenic-dark",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
