
import React, { useEffect, useState } from 'react';
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
  X,
  Eye,
  FileText,
  Users,
  BarChart
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>("VTCZen");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanySettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .single();
          
        if (profileData?.company_name) {
          setCompanyName(profileData.company_name);
        }
        
        const { data } = await supabase
          .from('company_settings')
          .select('logo_url')
          .eq('driver_id', user.id)
          .single();
          
        if (data?.logo_url) {
          setCompanyLogo(data.logo_url);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres de l\'entreprise:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanySettings();
  }, [user]); // Ne dépend que de l'utilisateur, pas de la location
  
  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: Home },
    { href: '/dashboard/vehicles', label: 'Véhicules', icon: Car },
    { href: '/dashboard/pricing', label: 'Tarifs', icon: CreditCard },
    { href: '/dashboard/quotes', label: 'Historique devis', icon: FileText },
    { href: '/dashboard/clients', label: 'Mes clients', icon: Users },
    { href: '/dashboard/reports', label: 'Rapports', icon: BarChart },
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

  const LogoDisplay = () => (
    <>
      {isLoading ? (
        <Skeleton className="h-8 w-8 rounded" />
      ) : companyLogo ? (
        <img src={companyLogo} alt="Logo" className="h-8 w-auto object-contain" />
      ) : null}
    </>
  );
  
  return (
    <div className="flex min-h-screen">
      {/* Mobile menu */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b bg-background px-4 py-2 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <LogoDisplay />
          <span className="text-xl font-bold">{companyName}</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <LogoDisplay />
                <h2 className="text-lg font-semibold">{companyName}</h2>
              </div>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </SheetTrigger>
            </div>
            <ScrollArea className="flex-1">
              <div className="mt-4 flex flex-col gap-2 p-2">
                <NavLinks />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 mt-4"
                  asChild
                >
                  <Link to="/client-simulator">
                    <Eye className="mr-2 h-5 w-5" />
                    Voir l'interface client
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Déconnexion
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-1">
        {/* Desktop sidebar - fixed */}
        <div className="hidden lg:flex lg:fixed left-0 top-0 bottom-0 w-64 flex-col border-r bg-muted/40">
          <div className="p-6 flex items-center gap-2">
            <LogoDisplay />
            <Link to="/" className="text-xl font-bold">{companyName}</Link>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-4">
              <NavLinks />
            </div>
          </ScrollArea>
          <div className="border-t p-4 flex flex-col gap-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
              asChild
            >
              <Link to="/client-simulator">
                <Eye className="mr-2 h-5 w-5" />
                Voir l'interface client
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
        
        {/* Main content with padding for fixed sidebar */}
        <div className="flex-1 lg:ml-64">
          <main className="container py-6 lg:py-6 mt-12 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
