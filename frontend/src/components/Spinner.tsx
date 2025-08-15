import React from "react";
export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-border border-t-ring animate-spin" />
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
