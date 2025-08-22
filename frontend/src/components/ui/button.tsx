import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ✅ زر Tailwind مع دعم ألوان custom و theme متقدم
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-greenic text-white hover:bg-greenic-dark dark:bg-greenic-dark dark:hover:bg-greenic text-white",
        royal:
          "bg-royal hover:bg-royal-dark text-white dark:bg-royal-dark dark:hover:bg-royal-ultraDark",
        gold:
          "bg-gold text-white hover:bg-gold-dark dark:bg-gold-dark dark:hover:bg-gold-light",
        outline:
          "border border-border bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
        link:
          "bg-transparent text-royal underline hover:text-royal-dark dark:text-royal-electric dark:hover:text-royal-ultraDark",
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

// ✅ مثال تطبيقي للاستخدام
const ButtonCollection = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-background text-foreground rounded-lg shadow-md">
      <Button variant="default">الافتراضي</Button>
      <Button variant="royal">ملكي</Button>
      <Button variant="gold">ذهبي</Button>
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
