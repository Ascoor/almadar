import { useSidebar } from './sidebar'; // تأكد أن هذا هو مسار الملف الصحيح
import { Menu } from 'lucide-react'; // أيقونة القائمة (تستطيع استبدالها)
import { Button } from '@/components/ui/button'; // زر من مكتبتك أو HTML عادي

const SidebarTrigger = () => {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle sidebar"
      className="sm:hidden" // يظهر فقط على الشاشات الصغيرة (إن أردت)
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};

export default SidebarTrigger;
