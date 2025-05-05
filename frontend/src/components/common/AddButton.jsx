// src/components/common/AddButton.jsx
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddButton({ label = "عنصر", onClick }) {
  return (
    <Button onClick={onClick} className="w-fit" variant="default" size="sm">
      <PlusCircle className="w-4 h-4" />
      <span>إضافة {label}</span>
    </Button>
  );
}
