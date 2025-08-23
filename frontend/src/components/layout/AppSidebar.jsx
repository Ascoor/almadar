import React from 'react';

export default function AppSidebar({ isMobileOpen, isMini, onClose, links }) {
  return (
    <aside
      id="app-sidebar"
      role="navigation"
      dir="rtl"
      className={`group bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 ease-soft overflow-y-auto
        ${isMobileOpen ? 'fixed inset-y-0 start-0 z-50 w-72 p-3 animate-slide-in md:static md:translate-x-0' : 'hidden md:flex md:flex-col'}
        ${isMini ? 'md:w-20 md:hover:w-72 md:focus-within:w-72' : 'md:w-72'}
      `}
    >
      <nav className="mt-2 space-y-6">
        {links.map(section => (
          <div key={section.label} className="space-y-1">
            <p className={`px-3 text-xs font-semibold text-muted-foreground ${isMini ? 'hidden md:group-hover:block md:group-focus-within:block' : ''}`}>{section.label}</p>
            {section.items.map(link => (
              <a
                key={link.title}
                href={link.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
                title={link.title}
              >
                <link.icon className="w-5 h-5" />
                <span className={`${isMini ? 'hidden md:group-hover:inline md:group-focus-within:inline' : ''}`}>{link.title}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
