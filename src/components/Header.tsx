
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  
  // Détecter la page courante au chargement et lors des changements de route
  useEffect(() => {
    // Vérifier si nous sommes sur la page d'accueil
    const isHomePage = location.pathname === '/';
    // Stocker l'état dans le sessionStorage pour la persistance
    if (!isHomePage) {
      window.sessionStorage.setItem('currentPage', location.pathname);
      setCurrentPage(location.pathname);
    } else {
      window.sessionStorage.removeItem('currentPage');
      setCurrentPage(null);
    }
  }, [location]);
  
  const scrollToSection = (id: string) => {
    // Si nous ne sommes pas sur la page d'accueil, naviguer vers la page d'accueil avec l'ancre
    if (currentPage) {
      navigate(`/#${id}`);
    } else {
      // Si nous sommes déjà sur la page d'accueil, simplement défiler
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMobileNavClick = (id?: string) => {
    // Fermer le menu mobile
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
    
    // Défiler vers la section si id est fourni
    if (id) {
      setTimeout(() => {
        scrollToSection(id);
      }, 100); // Petit délai pour s'assurer que le menu est fermé
    }
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/a48d188b-0d09-4530-87d1-6efc0fd30019.png" alt="VTCZen Logo" className="h-8 w-auto" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Accueil
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Fonctionnalités
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Tarifs
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Comment ça marche
          </button>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/connexion">Connexion</Link>
          </Button>
          <Button asChild>
            <Link to="/inscription">Essai gratuit</Link>
          </Button>
        </div>
        
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/a48d188b-0d09-4530-87d1-6efc0fd30019.png" alt="VTCZen Logo" className="h-6 w-auto" />
              </div>
              <SheetClose ref={closeButtonRef}>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </SheetClose>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <button 
                onClick={() => handleMobileNavClick('hero')} 
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
              >
                Accueil
              </button>
              <button 
                onClick={() => handleMobileNavClick('features')} 
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
              >
                Fonctionnalités
              </button>
              <button 
                onClick={() => handleMobileNavClick('pricing')} 
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
              >
                Tarifs
              </button>
              <button 
                onClick={() => handleMobileNavClick('how-it-works')} 
                className="text-base font-medium py-2 hover:text-primary transition-colors text-left"
              >
                Comment ça marche
              </button>
              <Link 
                to="/contact" 
                className="text-base font-medium py-2 hover:text-primary transition-colors"
                onClick={() => handleMobileNavClick()}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <SheetClose asChild>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/connexion">
                      Connexion
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link to="/inscription">
                      Essai gratuit
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
