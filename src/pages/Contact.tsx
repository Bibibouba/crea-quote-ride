
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import { Mail, MapPin } from 'lucide-react';

const Contact = () => {
  // Ajout d'un useEffect pour gérer la navigation via les ancres sur la page d'accueil
  useEffect(() => {
    // Cette fonction permettra au Header de savoir que nous sommes sur une autre page
    // et qu'il doit rediriger vers la page d'accueil pour les sections internes
    window.sessionStorage.setItem('currentPage', 'contact');
    
    return () => {
      window.sessionStorage.removeItem('currentPage');
    };
  }, []);
  
  return (
    <Layout>
      <section className="py-20 bg-background mb-24">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-8 md:text-4xl">Contactez-nous</h1>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Nos coordonnées</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl">MENESGUEN SERVICES</h3>
                  <p className="text-muted-foreground">(Créacodeal)</p>
                </div>
                
                <p>933 323 594 R.C.S. Nanterre</p>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <p>99 Avenue Achille Peretti<br />92200 Neuilly-sur-Seine</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:creacodeal@gmail.com" className="text-primary hover:underline">
                    creacodeal@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
              <Map 
                address="99 Avenue Achille Peretti, 92200 Neuilly-sur-Seine, France" 
                zoom={15}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
