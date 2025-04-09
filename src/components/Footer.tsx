
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/10 py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="VTCZen Logo" className="h-8 w-auto" />
              <h3 className="font-bold text-xl gradient-text">VTCZen</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Solution de devis en ligne pour chauffeurs VTC
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Produit</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Démo
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/aide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cgu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CREACODEAL. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
