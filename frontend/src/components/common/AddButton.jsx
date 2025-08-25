// src/components/common/AddButton.jsx
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function AddButton({ label = 'item', onClick }) {
  const { t } = useLanguage();

  return (
    <Button
      onClick={onClick}
      className="w-fit sm:w-auto p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all duration-300"
      variant="default"
      size="sm"
    >
      <PlusCircle className="w-4 h-4" />
      <span className="ml-1 sm:hidden">{t('add')} {t(label)}</span>
      <span className="hidden sm:inline-block">{t('add')} {t(label)}</span>
    </Button>
  );
}
