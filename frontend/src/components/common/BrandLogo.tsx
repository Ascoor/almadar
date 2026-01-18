import React from "react";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "icon" | "text";
  lang: "en" | "ar";
  dark?: boolean;
  className?: string;
};

const BrandLogo = ({
  variant = "text",
  lang,
  dark = false,
  className,
}: BrandLogoProps) => {
  const label = lang === "ar" ? "أفوكات" : "AVOCAT";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        variant === "icon" && "gap-0",
        className
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl",
          "bg-[hsl(var(--secondary))]",
          dark && "bg-[hsl(var(--card)/0.2)]"
        )}
      >
        <Scale className="h-5 w-5 text-[hsl(var(--primary))]" />
      </div>
      {variant === "text" && (
        <div
          className={cn(
            "flex flex-col leading-none",
            lang === "ar" ? "items-end" : "items-start"
          )}
        >
          <span className="text-sm uppercase tracking-[0.4em] text-[hsl(var(--muted-foreground))]">
            {lang === "ar" ? "استشارات" : "Legal Tech"}
          </span>
          <span className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
