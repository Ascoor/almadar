// src/components/common/AddButton.jsx
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddButton({ label = "عنصر", onClick }) {
  return (
    <Button
      onClick={onClick}
      className="w-fit sm:w-auto p-2 rounded-full 
                bg-gold-light text-navy 
                dark:hover:bg-greenic-dark dark:hover:text-white
                hover:bg-greenic-dark/70   hover:text-white dark:bg-gold-light/90
                focus:ring-4 focus:ring-gold-light transition-all duration-300" 
      variant="default"
      size="sm"
    >
      <PlusCircle className="w-4 h-4" />
      <span className="ml-1 sm:hidden">إضافة {label}</span> {/* Show label on small screens only */}
      <span className="hidden sm:inline-block">إضافة {label}</span> {/* Hide label on small screens */}
    </Button>
  );
}
