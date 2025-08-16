
import { useSidebar } from './sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SidebarTrigger = () => {
  const { open, setOpen, toggleSidebar } = useSidebar()

  const handleClick = () => {
    if (typeof toggleSidebar === 'function') {
      toggleSidebar()
    } else if (typeof setOpen === 'function') {
      setOpen(!open)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      aria-controls="app-sidebar"
      aria-expanded={!!open}
      className="sm:hidden"
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}

export default SidebarTrigger
