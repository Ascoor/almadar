// src/components/common/AddButton.jsx
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddButton({ label = "عنصر", onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="accent"
      size="sm"
      className="w-fit sm:w-auto rounded-full"
    >
      <PlusCircle className="w-4 h-4" />
      <span className="ml-1 sm:hidden">إضافة {label}</span>
      <span className="hidden sm:inline-block">إضافة {label}</span>
    </Button>
  );
}
