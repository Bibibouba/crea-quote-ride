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
  FileBarChart
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>("VTCZen");
  
  useEffect(() => {
    const fetchCompanySettings = async () => {
      if (!user) return;
      
      try {
        // Récupérer les paramètres de l'entreprise au lieu du profil
        const { data } = await supabase
          .from('company_settings')
          .select('company_name, logo_url')
          .eq('driver_id', user.id)
          .single();
          
        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
        
        if (data?.logo_url) {
          setCompanyLogo(data.logo_url);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres de l\'entreprise:', error);
      }
    };
    
    fetchCompanySettings();
  }, [user]);
  
  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: Home },
    { href: '/dashboard/vehicles', label: 'Véhicules', icon: Car },
    { href: '/dashboard/reports', label: 'Rapports', icon: FileBarChart },
    { href: '/dashboard/pricing', label: 'Tarifs', icon: CreditCard },
    { href: '/dashboard/quotes', label: 'Historique devis', icon: FileText },
    { href: '/dashboard/clients', label: 'Mes clients', icon: Users },
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
        <Link to="/" className="flex items-center gap-2">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-8 w-auto" />
          ) : null}
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
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo" className="h-6 w-auto" />
                ) : null}
                <h2 className="text-lg font-semibold">{companyName}</h2>
              </div>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </SheetTrigger>
            </div>
            <div className="mt-4 flex flex-col gap-2">
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
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="p-6 flex items-center gap-2">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="h-8 w-auto" />
            ) : null}
            <Link to="/" className="text-xl font-bold">{companyName}</Link>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <NavLinks />
          </div>
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
