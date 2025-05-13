
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Video, Settings, Tag, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard' },
    { icon: Video, label: 'Spots', href: '/spots' },
    { icon: Upload, label: 'Ajouter un Spot', href: '/spots/new' },
    { icon: Tag, label: 'Catégories', href: '/categories' },
    { icon: Users, label: 'Clients', href: '/clients' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
  ];

  const isActive = (href: string) => window.location.pathname === href;

  return (
    <aside 
      className={cn(
        "bg-sidebar backdrop-blur-sm flex flex-col border-r border-sidebar-border/60 shadow-md dark:shadow-none transition-all",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border/60">
        {!collapsed && (
          <div className="text-lg font-semibold text-primary">VideoSpot Admin</div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const active = isActive(item.href);
            
            return (
              <li key={index}>
                <Link 
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                    active 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm dark:shadow-primary/5" 
                      : "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border/60">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} VideoSpot
          </div>
        )}
      </div>
    </aside>
  );
};
