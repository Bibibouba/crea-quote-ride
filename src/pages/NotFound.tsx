
import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Page non trouvée</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Nous n'avons pas pu trouver la page que vous recherchez : {location.pathname}
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
