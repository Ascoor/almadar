import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export type ThemeToggleTone = "hero" | "light" | "dark";

export const themeToggleToneVariantMap: Record<ThemeToggleTone, string> = {
  hero: "ghost",
  light: "ghost",
  dark: "ghost",
};

export const themeToggleToneClassMap: Record<ThemeToggleTone, string> = {
  hero:
    "border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.35)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/0.6)]",
  light:
    "border border-[hsl(var(--border))] bg-[hsl(var(--surface)/0.6)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface)/0.85)]",
  dark:
    "border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.2)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/0.4)]",
};

export const ThemeToggle = ({ tone }: { tone: ThemeToggleTone }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant={themeToggleToneVariantMap[tone] as "ghost"}
      className={cn(
        "group relative h-10 w-10 rounded-full transition-all duration-300",
        "shadow-[var(--shadow-sm)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]",
        themeToggleToneClassMap[tone]
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-100" />
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[hsl(var(--primary))]" />
      ) : (
        <Moon className="h-4 w-4 text-[hsl(var(--secondary))]" />
      )}
    </Button>
  );
};
