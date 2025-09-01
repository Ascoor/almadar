import React from "react";
import { motion } from "framer-motion";

export default function Section({ 
  title, 
  description, 
  actions, 
  children, 
  className = "",
  delay = 0 
}) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`card-soft hover-scale min-w-0 p-4 md:p-6 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg md:text-xl font-semibold section-title section-title-animate mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}
