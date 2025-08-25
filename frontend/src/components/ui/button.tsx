import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "border border-border bg-bg text-fg hover:bg-muted",
        ghost: "bg-transparent text-fg hover:bg-muted",
        link: "bg-transparent text-primary underline-offset-4 hover:text-primary-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-lg",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonCollection = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-bg text-fg rounded-lg shadow-md">
      <Button variant="default">أساسي</Button>
      <Button variant="secondary">ثانوي</Button>
      <Button variant="accent">مميز</Button>
      <Button variant="destructive">خطر</Button>
      <Button variant="outline">حدود</Button>
      <Button variant="ghost">شفاف</Button>
      <Button variant="link">رابط</Button>
      <Button variant="default" size="icon" aria-label="أيقونة">
        ⭐
      </Button>
    </div>
  );
};

export { Button, ButtonCollection };
