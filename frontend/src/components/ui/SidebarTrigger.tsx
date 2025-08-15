
import { useSidebar } from './sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="sm:hidden"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};

export default SidebarTrigger;
