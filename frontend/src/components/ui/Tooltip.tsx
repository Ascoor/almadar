import React from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-full me-2 z-50 hidden whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs text-foreground shadow border border-border group-hover:block">
        {text}
      </div>
    </div>
  );
}
