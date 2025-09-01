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
      className={`${className} overflow-hidden chart-card`}
      delay={delay}
    >
      <div className="relative w-full min-w-0" dir="ltr">
        {/* SVG gradient definitions for charts */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--chart-2)" />
              <stop offset="100%" stopColor="var(--chart-1)" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </div>
    </Section>
  );
}
