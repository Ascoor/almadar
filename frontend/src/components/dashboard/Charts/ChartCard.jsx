import React from "react";
import Section from "../Layout/Section";

export default function ChartCard({ 
  title, 
  description, 
  actions, 
  children, 
  className = "",
  delay = 0 
}) {
  return (
    <Section 
      title={title} 
      description={description} 
      actions={actions} 
      className={`${className} overflow-hidden`}
      delay={delay}
    >
      <div className="relative">
        {/* SVG gradient definitions for charts */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(172, 84%, 45%)" />
              <stop offset="100%" stopColor="hsl(84, 81%, 56%)" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(172, 84%, 45%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(172, 84%, 45%)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </div>
    </Section>
  );
}