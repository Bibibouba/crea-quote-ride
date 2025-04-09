
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Car, 
  CreditCard, 
  Settings as SettingsIcon, 
  Home, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: Home },
    { href: '/dashboard/vehicles', label: 'Véhicules', icon: Car },
    { href: '/dashboard/pricing', label: 'Tarifs', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Paramètres', icon: SettingsIcon },
  ];
  
  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link to={item.href} key={item.href}>
            <Button 
              variant={isActive ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile menu */}
      <div className="flex items-center justify-between border-b px-4 py-2 lg:hidden">
        <Link to="/" className="text-xl font-bold">VTCZen</Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Menu</h2>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </SheetTrigger>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <NavLinks />
              <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="p-6">
            <Link to="/" className="text-xl font-bold">VTCZen</Link>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <NavLinks />
          </div>
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <main className="container py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
