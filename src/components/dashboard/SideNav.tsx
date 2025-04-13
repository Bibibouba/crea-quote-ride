
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, Home, Settings, Users, FileText,
  CreditCard, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideNavProps {
  companyName: string;
}

const SideNav = ({ companyName }: SideNavProps) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Clients', path: '/dashboard/clients', icon: Users },
    { name: 'Véhicules', path: '/dashboard/vehicles', icon: Car },
    { name: 'Devis', path: '/dashboard/quotes', icon: FileText },
    { name: 'Tarification', path: '/dashboard/pricing', icon: CreditCard },
    { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-background border-r border-border h-full flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-lg font-semibold truncate">{companyName}</h2>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    active 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
