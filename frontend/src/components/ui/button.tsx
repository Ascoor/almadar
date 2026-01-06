// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/context/NetworkStatusContext";

/**
 * Notes:
 * - يعتمد على tokens عندك (bg, fg, primary, accent, gold...) من tailwind.config
 * - Variants جديدة: hero / heroOutline / glass / gold / soft
 * - shine overlay في hero & gold
 */

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold select-none",
    "transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:translate-y-[1px] active:shadow-none",
    // base radius
    "rounded-2xl",
  ].join(" "),
  {
    variants: {
      variant: {
        /**
         * Default solid (clean)
         */
        default: [
          "bg-primary text-primary-foreground",
          "shadow-md hover:shadow-glow",
          "hover:brightness-[1.03]",
        ].join(" "),

        /**
         * Premium hero gradient (best for landing CTA)
         */
        hero: [
          "text-primary-foreground",
          "bg-gradient-primary",
          "shadow-lg hover:shadow-glow",
          "hover:-translate-y-[2px]",
          "overflow-hidden",
          // shine layer (via pseudo element)
          "before:content-[''] before:absolute before:inset-0",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
          "before:[background:linear-gradient(110deg,transparent,rgba(255,255,255,.22),transparent)]",
          "before:translate-x-[-120%] hover:before:translate-x-[120%]",
          "before:transition-transform before:duration-700",
        ].join(" "),

        /**
         * Outline hero (glass border)
         */
        heroOutline: [
          "bg-background/10 text-foreground",
          "border border-border",
          "backdrop-blur-xl",
          "hover:bg-background/15",
          "hover:shadow-md hover:-translate-y-[2px]",
        ].join(" "),

        /**
         * Secondary
         */
        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-md hover:shadow-glow",
          "hover:brightness-[1.04]",
        ].join(" "),

        /**
         * Soft (subtle button)
         */
        soft: [
          "bg-muted text-foreground",
          "border border-border/60",
          "hover:bg-muted/80",
          "hover:shadow-sm",
        ].join(" "),

        /**
         * Glass button (for overlays)
         */
        glass: [
          "bg-background/10 text-foreground",
          "border border-border/50",
          "backdrop-blur-xl",
          "shadow-md",
          "hover:bg-background/15 hover:-translate-y-[2px]",
        ].join(" "),

        /**
         * Gold premium (uses gold tokens from your config)
         */
        gold: [
          "text-foreground",
          "bg-gradient-gold",
          "shadow-gold hover:shadow-glow",
          "hover:-translate-y-[2px]",
          "overflow-hidden",
          "before:content-[''] before:absolute before:inset-0",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
          "before:[background:linear-gradient(110deg,transparent,rgba(255,255,255,.28),transparent)]",
          "before:translate-x-[-120%] hover:before:translate-x-[120%]",
          "before:transition-transform before:duration-700",
        ].join(" "),

        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-md hover:shadow-lg",
          "hover:brightness-[1.02]",
        ].join(" "),

        outline: [
          "border border-border bg-background text-foreground",
          "hover:bg-muted/35 hover:shadow-sm",
        ].join(" "),

        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted/35",
        ].join(" "),

        link: [
          "bg-transparent text-primary underline-offset-4 underline",
          "hover:brightness-110",
        ].join(" "),
      },

      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-sm rounded-xl",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
<<<<<<< HEAD
  requiresNetwork?: boolean;
=======
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
>>>>>>> f5ae528 (Update gitignore)
}

/**
 * Supports:
 * <Button leftIcon={<Icon/>} rightIcon={<Icon/>}>Text</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
<<<<<<< HEAD
  (
    { className, variant, size, asChild = false, requiresNetwork, ...props },
    ref,
  ) => {
    const { isOffline, offlineMessage } = useNetworkStatus();
=======
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, children, ...props }, ref) => {
>>>>>>> f5ae528 (Update gitignore)
    const Comp = asChild ? Slot : "button";
    const shouldGuardNetwork =
      typeof requiresNetwork === "boolean"
        ? requiresNetwork
        : props.type === "submit";

    const isNetworkDisabled = Boolean(shouldGuardNetwork && isOffline);
    const mergedDisabled = props.disabled || isNetworkDisabled;
    const title =
      isNetworkDisabled && !props.title
        ? offlineMessage
        : props.title;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        aria-disabled={mergedDisabled}
        data-offline={isNetworkDisabled || undefined}
        data-requires-network={shouldGuardNetwork || undefined}
        disabled={mergedDisabled}
        title={title}
        {...props}
      >
        {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
        <span className="relative z-10">{children}</span>
        {rightIcon ? <span className="inline-flex items-center">{rightIcon}</span> : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
