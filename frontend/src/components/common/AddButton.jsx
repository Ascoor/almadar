// src/components/common/AddButton.jsx
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddButton({ label = 'عنصر', onClick }) {
  return (
    <Button
      onClick={onClick}
      className="w-fit sm:w-auto rounded-2xl px-4 py-2 bg-primary text-[color:var(--primary-foreground)] hover:shadow-glow transition"
      variant="default"
      size="sm"
    >
      <PlusCircle className="w-4 h-4" />
      <span className="ml-1 sm:hidden">إضافة {label}</span>{' '}
      {/* Show label on small screens only */}
      <span className="hidden sm:inline-block">إضافة {label}</span>{' '}
      {/* Hide label on small screens */}
    </Button>
  );
}
